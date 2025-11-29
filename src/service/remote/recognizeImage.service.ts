import { RecognizeImageRepository } from "../../repository/remote/recognizeImage.repository";
import { ServiceResponse } from "../base.service";

export interface ImageRecognitionResult {
  text: string;
  labels: Array<{ description: string; score: number; descriptionFr?: string }>;
  detectedObject?: string;
  detectedObjectFr?: string;
}

/**
 * Service pour la reconnaissance d'image avec Google Cloud Vision API
 * Spécialisé pour la reconnaissance de matériel et d'outils
 * Gère la logique métier et la gestion des erreurs
 */
export class RecognizeImageService {
  private recognizeImageRepository: RecognizeImageRepository;

  // Dictionnaire de traduction des outils et matériel
  private translationDictionary: { [key: string]: string } = {
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

  constructor() {
    this.recognizeImageRepository = new RecognizeImageRepository();
  }

  /**
   * Traduit un label anglais en français
   */
  private translateLabel(englishLabel: string): string {
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
  private validateImageBuffer(imageBuffer: Buffer): void {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error("Le buffer de l'image est vide");
    }

    // Vérifier la taille maximale (20MB pour Cloud Vision API)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (imageBuffer.length > maxSize) {
      throw new Error("L'image est trop grande (maximum 20MB)");
    }
  }

  /**
   * Effectue une reconnaissance d'image pour identifier du matériel/outils
   * Combine OCR et détection de labels pour identifier l'objet
   * @param imageBuffer - Buffer de l'image à analyser
   * @returns Résultat de la reconnaissance avec texte, labels et objet détecté
   */
  async recognizeImage(
    imageBuffer: Buffer
  ): Promise<ServiceResponse<ImageRecognitionResult>> {
    try {
      // Validation du buffer
      this.validateImageBuffer(imageBuffer);

      // Appeler le repository pour la reconnaissance
      const result = await this.recognizeImageRepository.recognizeImage(imageBuffer);

      // Améliorer la détection de l'objet principal en privilégiant les outils/matériel
      const improvedResult = this.improveObjectDetection(result);

      // Traduire les labels et l'objet détecté en français
      const translatedResult = this.translateResult(improvedResult);

      return {
        success: true,
        data: translatedResult,
        message: "Reconnaissance d'image effectuée avec succès",
      };
    } catch (error: any) {
      return this.handleCloudVisionError(error);
    }
  }

  /**
   * Traduit les labels et l'objet détecté en français
   */
  private translateResult(result: ImageRecognitionResult): ImageRecognitionResult {
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
  private improveObjectDetection(result: ImageRecognitionResult): ImageRecognitionResult {
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
        isSpecificTool = specificTools.some(keyword => 
          description === keyword.toLowerCase() || description.includes(keyword.toLowerCase())
        );
        
        // Vérifier si c'est une catégorie générique
        isGenericCategory = genericToolCategories.some(keyword => 
          description === keyword.toLowerCase() || description.includes(keyword.toLowerCase())
        );
        
        // Bonus important pour les outils spécifiques
        if (isSpecificTool) {
          adjustedScore += 0.3; // Bonus de 0.3 pour les outils spécifiques
        } 
        // Bonus modéré pour les catégories génériques
        else if (isGenericCategory) {
          adjustedScore += 0.1; // Bonus de 0.1 pour les catégories
        }
        
        // Pénalité pour les mots-clés à exclure
        const shouldExclude = excludeKeywords.some(keyword => 
          description === keyword.toLowerCase()
        );
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
        if (a.isSpecificTool && !b.isSpecificTool) return -1;
        if (!a.isSpecificTool && b.isSpecificTool) return 1;
        // Priorité 2: Score ajusté
        return b.adjustedScore - a.adjustedScore;
      })
      // Retourner au format original
      .map(({ description, score }) => ({ description, score }));

    // Déterminer l'objet principal détecté
    // Priorité 1: Premier outil spécifique trouvé (même avec score plus bas)
    // Priorité 2: Première catégorie générique
    // Priorité 3: Premier label avec un score élevé
    let detectedObject: string | undefined;
    
    // Chercher d'abord un outil spécifique dans les labels originaux
    const specificToolLabel = result.labels.find(label => {
      const desc = label.description.toLowerCase();
      return specificTools.some(keyword => 
        desc === keyword.toLowerCase() || desc.includes(keyword.toLowerCase())
      );
    });
    
    if (specificToolLabel) {
      // Priorité absolue aux outils spécifiques
      detectedObject = specificToolLabel.description;
    } else if (filteredLabels.length > 0) {
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
   * Gère les erreurs spécifiques de Google Cloud Vision API
   */
  private handleCloudVisionError(error: any): ServiceResponse {
    console.error("Erreur Cloud Vision API:", error);

    // Erreur d'authentification
    if (error?.code === 7 || error?.message?.includes("PERMISSION_DENIED")) {
      return {
        success: false,
        message: "Erreur d'authentification avec Google Cloud Vision API",
        error: "GOOGLE_CLOUD_AUTH_ERROR",
      };
    }

    // Erreur de quota dépassé
    if (error?.code === 8 || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      return {
        success: false,
        message: "Quota Google Cloud Vision API dépassé",
        error: "GOOGLE_CLOUD_QUOTA_EXCEEDED",
      };
    }

    // Erreur de format d'image invalide
    if (error?.message?.includes("Invalid image") || error?.message?.includes("image format")) {
      return {
        success: false,
        message: "Format d'image non supporté",
        error: "INVALID_IMAGE_FORMAT",
      };
    }

    // Erreur de taille d'image
    if (error?.message?.includes("too large") || error?.message?.includes("size")) {
      return {
        success: false,
        message: "L'image est trop grande",
        error: "IMAGE_TOO_LARGE",
      };
    }

    // Erreur de réseau
    if (error?.code === 14 || error?.message?.includes("UNAVAILABLE")) {
      return {
        success: false,
        message: "Service Google Cloud Vision API indisponible",
        error: "GOOGLE_CLOUD_UNAVAILABLE",
      };
    }

    // Erreur de timeout
    if (error?.code === 4 || error?.message?.includes("DEADLINE_EXCEEDED")) {
      return {
        success: false,
        message: "Timeout lors de l'appel à Google Cloud Vision API",
        error: "GOOGLE_CLOUD_TIMEOUT",
      };
    }

    // Erreur de configuration (fichier credentials manquant ou invalide)
    if (error?.message?.includes("credentials") || error?.message?.includes("Credentials")) {
      return {
        success: false,
        message: error.message || "Erreur de configuration des credentials Google Cloud",
        error: "GOOGLE_CLOUD_CONFIG_ERROR",
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

    // Erreur générique
    return {
      success: false,
      message: error?.message || "Erreur lors de la reconnaissance d'image",
      error: "GOOGLE_CLOUD_ERROR",
    };
  }
}

