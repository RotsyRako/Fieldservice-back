import { GoogleGenerativeAI } from "@google/generative-ai";
import { Intervention } from "@prisma/client";

/**
 * Interface pour les données complètes d'une intervention
 */
export interface InterventionCompleteData {
  intervention: Intervention;
  materiels: Array<{ name: string; quantity: number }>;
  timesheets: Array<{ description: string; timeAllocated: number; date: string }>;
  images: Array<{ filename: string }>;
  documents: Array<{ filename: string }>;
  comments: Array<{ message: string; date: string }>;
  signatures: Array<{ filename: string }>;
}

/**
 * Interface pour la réponse d'estimation de Gemini
 */
export interface EstimationResponse {
  estimatedTime: string; // format hh:mm:ss
  reasoning: string; // explication de l'estimation
  confidence: number; // niveau de confiance (0-1)
}

/**
 * Repository pour l'estimation d'intervention avec Gemini Pro
 */
export class EstimateInterventionRepository {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_KEY;
    
    if (!apiKey) {
      throw new Error(
        "GEMINI_KEY n'est pas définie dans les variables d'environnement.\n" +
        "Veuillez ajouter GEMINI_KEY dans votre fichier .env"
      );
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      console.log("✅ Gemini 2.0 Flash initialisé avec succès");
    } catch (error: any) {
      throw new Error(
        `Impossible d'initialiser Gemini: ${error.message}`
      );
    }
  }

  /**
   * Génère une estimation de temps pour une intervention
   * @param interventionData - Données complètes de l'intervention
   * @returns Estimation avec temps, raisonnement et confiance
   */
  async estimateInterventionTime(
    interventionData: InterventionCompleteData
  ): Promise<EstimationResponse> {
    try {
      // Construire le prompt avec toutes les informations de l'intervention
      const prompt = this.buildPrompt(interventionData);

      // Appeler Gemini Pro
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parser la réponse de Gemini
      return this.parseGeminiResponse(text);
    } catch (error: any) {
      throw new Error(`Erreur lors de l'estimation avec Gemini: ${error.message}`);
    }
  }

  /**
   * Construit le prompt pour Gemini avec toutes les informations de l'intervention
   */
  private buildPrompt(data: InterventionCompleteData): string {
    const { intervention, materiels, timesheets, images, documents, comments, signatures } = data;

    let prompt = `Tu es un expert en estimation de temps pour des interventions techniques. 
Analyse les informations suivantes d'une intervention et estime le temps nécessaire pour réaliser cette tâche.

INFORMATIONS DE L'INTERVENTION:
- Titre: ${intervention.titre}
- Description: ${intervention.description}
- Priorité: ${intervention.priority}
- Client: ${intervention.customer}
- Distance: ${intervention.distance} km
- Statut: ${intervention.status}
- Date de début prévue: ${intervention.dateStart}
- Date de fin prévue: ${intervention.dateEnd}
`;

    if (materiels.length > 0) {
      prompt += `\nMATÉRIELS NÉCESSAIRES:\n`;
      materiels.forEach((m, index) => {
        prompt += `  ${index + 1}. ${m.name} (quantité: ${m.quantity})\n`;
      });
    }

    if (timesheets.length > 0) {
      prompt += `\nTEMPS DÉJÀ ALLOUÉ:\n`;
      timesheets.forEach((t, index) => {
        prompt += `  ${index + 1}. ${t.description}: ${t.timeAllocated} heures (${t.date})\n`;
      });
    }

    if (images.length > 0) {
      prompt += `\nIMAGES ASSOCIÉES: ${images.length} image(s)\n`;
      images.forEach((img, index) => {
        prompt += `  ${index + 1}. ${img.filename}\n`;
      });
    }

    if (documents.length > 0) {
      prompt += `\nDOCUMENTS ASSOCIÉS: ${documents.length} document(s)\n`;
      documents.forEach((doc, index) => {
        prompt += `  ${index + 1}. ${doc.filename}\n`;
      });
    }

    if (comments.length > 0) {
      prompt += `\nCOMMENTAIRES:\n`;
      comments.forEach((comment, index) => {
        prompt += `  ${index + 1}. [${comment.date}] ${comment.message}\n`;
      });
    }

    if (signatures.length > 0) {
      prompt += `\nSIGNATURES: ${signatures.length} signature(s) présente(s)\n`;
    }

    prompt += `\nINSTRUCTIONS:
1. Analyse toutes ces informations pour comprendre la nature et la complexité de l'intervention
2. Estime le temps total nécessaire en heures (temps de travail effectif, pas de déplacement)
3. Prends en compte:
   - La complexité de la tâche décrite
   - Le nombre et le type de matériels nécessaires
   - Le temps déjà alloué (si disponible)
   - Les commentaires qui pourraient indiquer des difficultés ou des retards
   - La priorité de l'intervention
4. Fournis une estimation réaliste et professionnelle

Réponds UNIQUEMENT au format JSON suivant (sans markdown, sans code block):
{
  "estimatedTime": <nombre en heures, décimal autorisé>,
  "reasoning": "<explication détaillée de ton estimation en français>",
  "confidence": <nombre entre 0 et 1 indiquant ton niveau de confiance>
}`;

    return prompt;
  }

  /**
   * Parse la réponse de Gemini pour extraire l'estimation
   */
  private parseGeminiResponse(text: string): EstimationResponse {
    try {
      // Nettoyer le texte (enlever les markdown code blocks si présents)
      let cleanedText = text.trim();
      
      // Enlever les backticks et "json" si présents
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
      }

      // Parser le JSON
      const parsed = JSON.parse(cleanedText);

      // Valider la structure
      if (typeof parsed.estimatedTime !== "number" || parsed.estimatedTime < 0) {
        throw new Error("estimatedTime doit être un nombre positif");
      }

      if (typeof parsed.reasoning !== "string" || parsed.reasoning.trim().length === 0) {
        throw new Error("reasoning doit être une chaîne non vide");
      }

      if (typeof parsed.confidence !== "number" || parsed.confidence < 0 || parsed.confidence > 1) {
        throw new Error("confidence doit être un nombre entre 0 et 1");
      }

      // Convertir les heures décimales en format hh:mm:ss
      const timeInHours = parsed.estimatedTime;
      const formattedTime = this.convertHoursToTimeFormat(timeInHours);

      return {
        estimatedTime: formattedTime,
        reasoning: parsed.reasoning.trim(),
        confidence: Math.round(parsed.confidence * 100) / 100, // Arrondir à 2 décimales
      };
    } catch (error: any) {
      // Si le parsing échoue, essayer d'extraire les valeurs avec regex
      const timeMatch = text.match(/"estimatedTime"\s*:\s*([\d.]+)/);
      const reasoningMatch = text.match(/"reasoning"\s*:\s*"([^"]+)"/);
      const confidenceMatch = text.match(/"confidence"\s*:\s*([\d.]+)/);

      if (timeMatch && reasoningMatch && confidenceMatch) {
        const timeInHours = parseFloat(timeMatch[1]);
        const formattedTime = this.convertHoursToTimeFormat(timeInHours);
        
        return {
          estimatedTime: formattedTime,
          reasoning: reasoningMatch[1],
          confidence: parseFloat(confidenceMatch[1]),
        };
      }

      throw new Error(
        `Impossible de parser la réponse de Gemini: ${error.message}\nRéponse reçue: ${text.substring(0, 200)}`
      );
    }
  }

  /**
   * Convertit un nombre d'heures décimal en format hh:mm:ss
   * @param hours - Nombre d'heures (décimal)
   * @returns Format hh:mm:ss
   */
  private convertHoursToTimeFormat(hours: number): string {
    // Calculer les heures, minutes et secondes
    const totalSeconds = Math.round(hours * 3600);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    // Formater avec des zéros devant si nécessaire
    const formattedH = h.toString().padStart(2, "0");
    const formattedM = m.toString().padStart(2, "0");
    const formattedS = s.toString().padStart(2, "0");

    return `${formattedH}:${formattedM}:${formattedS}`;
  }
}

