"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecognizeImageGeminiService = void 0;
const recognizeImageGemini_repository_1 = require("../../repository/remote/recognizeImageGemini.repository");
/**
 * Service pour la reconnaissance d'image avec Google Gemini Pro Vision API
 * Spécialisé pour la reconnaissance de matériel et d'outils
 * Gère la logique métier et la gestion des erreurs
 */
class RecognizeImageGeminiService {
    constructor() {
        // Dictionnaire de traduction des outils et matériel
        this.translationDictionary = {
            // Outils spécifiques
            "screwdriver": "Tournevis",
            "wrench": "Clé",
            "hammer": "Marteau",
            "drill": "Perceuse",
            "pliers": "Pince",
            "saw": "Scie",
            "knife": "Couteau",
            "scissors": "Ciseaux",
            "chisel": "Ciseau",
            "file": "Lime",
            "level": "Niveau",
            "tape measure": "Mètre ruban",
            "cutter": "Cutteur",
            "clamp": "Étau",
            "vise": "Étau",
            "ratchet": "Clé à cliquet",
            "socket": "Douille",
            "bit": "Mèche",
            "nail": "Clou",
            "bolt": "Boulon",
            "screw": "Vis",
            // Catégories génériques
            "hand tool": "Outil à main",
            "power tool": "Outil électrique",
            "tool": "Outil",
            "hardware": "Quincaillerie",
            "equipment": "Équipement",
            "household hardware": "Quincaillerie domestique",
            // Autres termes courants
            "orange": "Orange",
            "red": "Rouge",
            "blue": "Bleu",
            "green": "Vert",
            "yellow": "Jaune",
            "black": "Noir",
            "white": "Blanc",
        };
        this.recognizeImageGeminiRepository = new recognizeImageGemini_repository_1.RecognizeImageGeminiRepository();
    }
    /**
     * Traduit un label anglais en français
     */
    translateLabel(englishLabel) {
        const lowerLabel = englishLabel.toLowerCase();
        // Vérifier d'abord la correspondance exacte
        if (this.translationDictionary[lowerLabel]) {
            return this.translationDictionary[lowerLabel];
        }
        // Vérifier les correspondances partielles
        for (const [key, value] of Object.entries(this.translationDictionary)) {
            if (lowerLabel.includes(key) || key.includes(lowerLabel)) {
                return value;
            }
        }
        // Si pas de traduction trouvée, retourner l'original
        return englishLabel;
    }
    /**
     * Valide le buffer de l'image
     */
    validateImageBuffer(imageBuffer) {
        if (!imageBuffer || imageBuffer.length === 0) {
            throw new Error("Le buffer de l'image est vide");
        }
        // Vérifier la taille maximale (20MB pour Gemini Pro Vision)
        const maxSize = 20 * 1024 * 1024; // 20MB
        if (imageBuffer.length > maxSize) {
            throw new Error("L'image est trop grande (maximum 20MB)");
        }
    }
    /**
     * Effectue une reconnaissance d'image pour identifier du matériel/outils
     * Utilise Gemini Pro Vision pour analyser l'image
     * @param imageBuffer - Buffer de l'image à analyser
     * @returns Résultat de la reconnaissance avec texte, labels et objet détecté
     */
    async recognizeImage(imageBuffer) {
        try {
            // Validation du buffer
            this.validateImageBuffer(imageBuffer);
            // Appeler le repository pour la reconnaissance
            const result = await this.recognizeImageGeminiRepository.recognizeImage(imageBuffer);
            // Améliorer la détection de l'objet principal en privilégiant les outils/matériel
            const improvedResult = this.improveObjectDetection(result);
            // Traduire les labels et l'objet détecté en français
            const translatedResult = this.translateResult(improvedResult);
            return {
                success: true,
                data: translatedResult,
                message: "Reconnaissance d'image effectuée avec succès (Gemini Pro Vision)",
            };
        }
        catch (error) {
            return this.handleGeminiError(error);
        }
    }
    /**
     * Traduit les labels et l'objet détecté en français
     */
    translateResult(result) {
        const translatedLabels = result.labels.map(label => ({
            ...label,
            descriptionFr: this.translateLabel(label.description),
        }));
        const translatedObject = result.detectedObject
            ? this.translateLabel(result.detectedObject)
            : undefined;
        return {
            ...result,
            labels: translatedLabels,
            detectedObjectFr: translatedObject,
        };
    }
    /**
     * Améliore la détection de l'objet principal en privilégiant les outils et le matériel
     * Filtre les labels non pertinents et applique une logique de priorité
     */
    improveObjectDetection(result) {
        // Liste des outils spécifiques (priorité maximale - noms d'outils précis)
        const specificTools = [
            "screwdriver", "wrench", "hammer", "drill", "pliers", "saw",
            "knife", "scissors", "chisel", "file", "level", "tape measure",
            "tournevis", "marteau", "perceuse", "pince", "scie",
            "cutter", "clamp", "vise", "ratchet", "socket", "bit",
            "nail", "bolt", "screw", "clou", "vis", "boulon"
        ];
        // Liste des catégories génériques d'outils (priorité moyenne - à éviter si un outil spécifique existe)
        const genericToolCategories = [
            "hand tool", "power tool", "tool", "hardware", "equipment",
            "outil", "materiel", "équipement", "household hardware"
        ];
        // Liste des mots-clés à exclure (couleurs, fruits, objets génériques non pertinents)
        const excludeKeywords = [
            "orange", "red", "blue", "green", "yellow", "black", "white", "color",
            "fruit", "food", "vegetable", "animal", "person", "face", "sky", "ground",
            "wall", "floor", "background", "texture", "pattern"
        ];
        // Filtrer et réorganiser les labels
        const filteredLabels = result.labels
            .map((label) => {
            const description = label.description.toLowerCase();
            // Calculer un score amélioré basé sur la pertinence
            let adjustedScore = label.score;
            let isSpecificTool = false;
            let isGenericCategory = false;
            // Vérifier si c'est un outil spécifique (priorité maximale)
            isSpecificTool = specificTools.some(keyword => description === keyword.toLowerCase() || description.includes(keyword.toLowerCase()));
            // Vérifier si c'est une catégorie générique
            isGenericCategory = genericToolCategories.some(keyword => description === keyword.toLowerCase() || description.includes(keyword.toLowerCase()));
            // Bonus important pour les outils spécifiques
            if (isSpecificTool) {
                adjustedScore += 0.3; // Bonus de 0.3 pour les outils spécifiques
            }
            // Bonus modéré pour les catégories génériques
            else if (isGenericCategory) {
                adjustedScore += 0.1; // Bonus de 0.1 pour les catégories
            }
            // Pénalité pour les mots-clés à exclure
            const shouldExclude = excludeKeywords.some(keyword => description === keyword.toLowerCase());
            if (shouldExclude) {
                adjustedScore -= 0.3; // Pénalité de 0.3
            }
            return {
                ...label,
                adjustedScore,
                isSpecificTool,
                isGenericCategory,
                shouldExclude
            };
        })
            // Filtrer les labels exclus
            .filter((label) => !label.shouldExclude)
            // Trier : outils spécifiques d'abord, puis par score ajusté
            .sort((a, b) => {
            // Priorité 1: Outils spécifiques d'abord (toujours avant les catégories)
            if (a.isSpecificTool && !b.isSpecificTool)
                return -1;
            if (!a.isSpecificTool && b.isSpecificTool)
                return 1;
            // Priorité 2: Score ajusté
            return b.adjustedScore - a.adjustedScore;
        })
            // Retourner au format original
            .map(({ description, score }) => ({ description, score }));
        // Déterminer l'objet principal détecté
        // Priorité 1: Premier outil spécifique trouvé (même avec score plus bas)
        // Priorité 2: Première catégorie générique
        // Priorité 3: Premier label avec un score élevé
        let detectedObject;
        // Chercher d'abord un outil spécifique dans les labels originaux
        const specificToolLabel = result.labels.find(label => {
            const desc = label.description.toLowerCase();
            return specificTools.some(keyword => desc === keyword.toLowerCase() || desc.includes(keyword.toLowerCase()));
        });
        if (specificToolLabel) {
            // Priorité absolue aux outils spécifiques
            detectedObject = specificToolLabel.description;
        }
        else if (filteredLabels.length > 0) {
            // Sinon, prendre le premier label filtré (déjà trié par priorité)
            detectedObject = filteredLabels[0].description;
        }
        return {
            text: result.text,
            labels: filteredLabels,
            detectedObject,
        };
    }
    /**
     * Gère les erreurs spécifiques de Google Gemini Pro Vision API
     */
    handleGeminiError(error) {
        console.error("Erreur Gemini Pro Vision API:", error);
        // Erreur d'authentification ou clé API invalide
        if (error?.message?.includes("API key") || error?.message?.includes("PERMISSION_DENIED") || error?.status === 403) {
            return {
                success: false,
                message: "Erreur d'authentification avec Gemini Pro Vision API (clé API invalide ou manquante)",
                error: "GEMINI_AUTH_ERROR",
            };
        }
        // Erreur de quota dépassé
        if (error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota") || error?.status === 429) {
            return {
                success: false,
                message: "Quota Gemini Pro Vision API dépassé",
                error: "GEMINI_QUOTA_EXCEEDED",
            };
        }
        // Erreur de format d'image invalide
        if (error?.message?.includes("Invalid image") || error?.message?.includes("image format") || error?.message?.includes("mimeType")) {
            return {
                success: false,
                message: "Format d'image non supporté",
                error: "INVALID_IMAGE_FORMAT",
            };
        }
        // Erreur de taille d'image
        if (error?.message?.includes("too large") || error?.message?.includes("size") || error?.message?.includes("file size")) {
            return {
                success: false,
                message: "L'image est trop grande",
                error: "IMAGE_TOO_LARGE",
            };
        }
        // Erreur de réseau ou service indisponible
        if (error?.message?.includes("UNAVAILABLE") || error?.status === 503 || error?.code === "ECONNREFUSED") {
            return {
                success: false,
                message: "Service Gemini Pro Vision API indisponible",
                error: "GEMINI_UNAVAILABLE",
            };
        }
        // Erreur de timeout
        if (error?.message?.includes("timeout") || error?.message?.includes("DEADLINE_EXCEEDED") || error?.code === "ETIMEDOUT") {
            return {
                success: false,
                message: "Timeout lors de l'appel à Gemini Pro Vision API",
                error: "GEMINI_TIMEOUT",
            };
        }
        // Erreur de configuration (clé API manquante)
        if (error?.message?.includes("credentials") || error?.message?.includes("Credentials") || error?.message?.includes("API key not configured")) {
            return {
                success: false,
                message: error.message || "Erreur de configuration de la clé API Gemini",
                error: "GEMINI_CONFIG_ERROR",
            };
        }
        // Erreur de validation du buffer
        if (error?.message?.includes("buffer") || error?.message?.includes("vide")) {
            return {
                success: false,
                message: error.message,
                error: "INVALID_IMAGE_BUFFER",
            };
        }
        // Erreur de parsing JSON (réponse de Gemini invalide)
        if (error?.message?.includes("JSON") || error?.message?.includes("parse")) {
            return {
                success: false,
                message: "Erreur lors du traitement de la réponse de Gemini Pro Vision",
                error: "GEMINI_PARSE_ERROR",
            };
        }
        // Erreur générique
        return {
            success: false,
            message: error?.message || "Erreur lors de la reconnaissance d'image avec Gemini Pro Vision",
            error: "GEMINI_ERROR",
        };
    }
}
exports.RecognizeImageGeminiService = RecognizeImageGeminiService;
