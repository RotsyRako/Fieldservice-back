"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecognizeImageGeminiRepository = void 0;
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("../../utils/config");
/**
 * Repository pour la reconnaissance d'image avec Google Gemini Pro Vision API
 * Spécialisé pour la reconnaissance d'outils et de matériel
 */
class RecognizeImageGeminiRepository {
    constructor() {
        // Vérifier que la clé API Gemini est configurée
        if (!config_1.config.gemini.apiKey) {
            throw new Error(`Clé API Gemini non configurée.\n` +
                `Veuillez définir GEMINI_KEY dans votre fichier .env`);
        }
        try {
            // Initialiser le client Gemini
            this.genAI = new generative_ai_1.GoogleGenerativeAI(config_1.config.gemini.apiKey);
            // Utiliser le modèle configuré (par défaut: gemini-2.0-flash)
            // Tous les modèles Gemini récents supportent la vision par défaut
            // Options disponibles: gemini-2.0-flash, gemini-2.5-flash, gemini-2.5-pro
            const modelName = config_1.config.gemini.model;
            this.model = this.genAI.getGenerativeModel({ model: modelName });
            console.log(`✅ Gemini Pro Vision API initialisé avec succès (modèle: ${modelName})`);
        }
        catch (error) {
            throw new Error(`Impossible d'initialiser Gemini Pro Vision API\n` +
                `Erreur: ${error.message}`);
        }
    }
    /**
     * Détecte le type MIME d'une image à partir de ses signatures de fichier (magic numbers)
     * @param imageBuffer - Buffer de l'image
     * @returns Type MIME détecté ou "image/jpeg" par défaut
     */
    detectMimeType(imageBuffer) {
        // Vérifier les signatures de fichiers (magic numbers)
        if (imageBuffer.length < 4) {
            return "image/jpeg"; // Par défaut
        }
        // JPEG: FF D8 FF
        if (imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8 && imageBuffer[2] === 0xff) {
            return "image/jpeg";
        }
        // PNG: 89 50 4E 47
        if (imageBuffer[0] === 0x89 &&
            imageBuffer[1] === 0x50 &&
            imageBuffer[2] === 0x4e &&
            imageBuffer[3] === 0x47) {
            return "image/png";
        }
        // GIF: 47 49 46 38 (GIF8)
        if (imageBuffer[0] === 0x47 &&
            imageBuffer[1] === 0x49 &&
            imageBuffer[2] === 0x46 &&
            imageBuffer[3] === 0x38) {
            return "image/gif";
        }
        // WebP: Vérifier le header RIFF...WEBP
        if (imageBuffer.length >= 12 &&
            imageBuffer[0] === 0x52 && // R
            imageBuffer[1] === 0x49 && // I
            imageBuffer[2] === 0x46 && // F
            imageBuffer[3] === 0x46 && // F
            imageBuffer[8] === 0x57 && // W
            imageBuffer[9] === 0x45 && // E
            imageBuffer[10] === 0x42 && // B
            imageBuffer[11] === 0x50 // P
        ) {
            return "image/webp";
        }
        // Par défaut, supposer JPEG
        return "image/jpeg";
    }
    /**
     * Effectue une reconnaissance complète d'image pour identifier du matériel/outils
     * Utilise Gemini Pro Vision pour analyser l'image et détecter le texte et les objets
     * @param imageBuffer - Buffer de l'image à analyser
     * @returns Résultat de la reconnaissance avec texte, labels et objet détecté
     */
    async recognizeImage(imageBuffer) {
        try {
            // Convertir le buffer en base64 pour Gemini
            const base64Image = imageBuffer.toString("base64");
            // Déterminer le type MIME automatiquement
            const mimeType = this.detectMimeType(imageBuffer);
            // Prompt spécialisé pour la reconnaissance d'outils et de matériel
            const prompt = `Analyse cette image et identifie les outils, le matériel ou les équipements présents.

Instructions:
1. Identifie TOUS les outils, matériels ou équipements visibles dans l'image
2. Pour chaque élément identifié, fournis un nom précis en anglais et un score de confiance (0-1)
3. Extrais TOUT le texte visible dans l'image (OCR)
4. Identifie l'objet principal ou le plus important dans l'image

Réponds UNIQUEMENT avec un JSON valide au format suivant (sans markdown, sans code block):
{
  "text": "texte extrait de l'image",
  "labels": [
    {"description": "nom de l'outil/matériel en anglais", "score": 0.95}
  ],
  "detectedObject": "nom de l'objet principal en anglais"
}

Si aucun texte n'est visible, utilise "" pour le champ "text".
Si aucun outil/matériel n'est détecté, retourne un tableau labels vide [].
Si aucun objet principal n'est identifié, utilise null pour "detectedObject".`;
            // Préparer les parties du contenu
            const parts = [
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: mimeType,
                    },
                },
                { text: prompt },
            ];
            // Appeler Gemini Pro Vision
            const result = await this.model.generateContent({
                contents: [{ role: "user", parts }],
            });
            const response = await result.response;
            const responseText = response.text();
            // Parser la réponse JSON
            let parsedResponse;
            try {
                // Nettoyer la réponse (enlever les backticks markdown si présents)
                const cleanText = responseText
                    .replace(/```json\n?/g, "")
                    .replace(/```\n?/g, "")
                    .trim();
                parsedResponse = JSON.parse(cleanText);
            }
            catch (parseError) {
                // Si le parsing échoue, essayer d'extraire le JSON manuellement
                console.warn("⚠️ Échec du parsing JSON, tentative d'extraction manuelle");
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    parsedResponse = JSON.parse(jsonMatch[0]);
                }
                else {
                    throw new Error(`Réponse de Gemini non valide (format JSON attendu): ${responseText.substring(0, 200)}`);
                }
            }
            // Normaliser les labels (s'assurer qu'ils ont tous un score)
            const normalizedLabels = (parsedResponse.labels || []).map((label) => ({
                description: label.description || label.name || "",
                score: typeof label.score === "number" ? label.score : 0.8, // Score par défaut si manquant
            }));
            // Filtrer les labels vides
            const validLabels = normalizedLabels.filter((label) => label.description && label.description.trim() !== "");
            return {
                text: parsedResponse.text || "",
                labels: validLabels,
                detectedObject: parsedResponse.detectedObject || undefined,
            };
        }
        catch (error) {
            throw new Error(`Erreur lors de la reconnaissance d'image avec Gemini: ${error.message}`);
        }
    }
}
exports.RecognizeImageGeminiRepository = RecognizeImageGeminiRepository;
