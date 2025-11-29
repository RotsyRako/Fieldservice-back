import { ImageAnnotatorClient } from "@google-cloud/vision";
import * as path from "path";
import * as fs from "fs";

/**
 * Repository pour la reconnaissance d'image avec Google Cloud Vision API
 * Spécialisé pour la reconnaissance d'outils et de matériel
 */
export class RecognizeImageRepository {
  private client: ImageAnnotatorClient;

  constructor() {
    // Utiliser le chemin du fichier JSON (méthode recommandée)
    // Supporte la variable d'environnement GOOGLE_APPLICATION_CREDENTIALS ou le chemin par défaut
    let credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    
    // Si pas défini, utiliser le chemin par défaut dans le dossier credentials
    if (!credentialsPath) {
      credentialsPath = path.join(process.cwd(), "credentials", "google-cloud-credentials.json");
    }
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(credentialsPath)) {
      throw new Error(
        `Fichier de credentials Google Cloud non trouvé: ${credentialsPath}\n` +
        `Veuillez placer votre fichier JSON dans credentials/google-cloud-credentials.json\n` +
        `ou définissez GOOGLE_APPLICATION_CREDENTIALS dans votre fichier .env`
      );
    }

    // Initialiser le client avec le fichier JSON
    try {
      this.client = new ImageAnnotatorClient({
        keyFilename: credentialsPath,
      });
      console.log(`✅ Credentials Google Cloud chargés depuis: ${credentialsPath}`);
    } catch (error: any) {
      throw new Error(
        `Impossible d'initialiser Google Cloud Vision API avec le fichier: ${credentialsPath}\n` +
        `Erreur: ${error.message}`
      );
    }
  }

  /**
   * Effectue une reconnaissance complète d'image pour identifier du matériel/outils
   * Combine la détection de texte (OCR) et la localisation d'objets pour une meilleure identification
   * @param imageBuffer - Buffer de l'image à analyser
   * @returns Résultat de la reconnaissance avec texte et objets détectés
   */
  async recognizeImage(imageBuffer: Buffer): Promise<{
    text: string;
    labels: Array<{ description: string; score: number }>;
    detectedObject?: string;
  }> {
    try {
      // Effectuer les deux détections en parallèle pour plus de rapidité
      const [textResult, objectsResult] = await Promise.all([
        this.detectText(imageBuffer),
        this.detectObjects(imageBuffer),
      ]);

      // Convertir les objets détectés en format labels pour compatibilité
      const labels = objectsResult.objects.map(obj => ({
        description: obj.name,
        score: obj.score,
      }));

      // Tenter d'identifier l'objet principal à partir des objets détectés
      // Les objets sont triés par score (confiance), le premier est généralement le plus pertinent
      const detectedObject = objectsResult.objects.length > 0 
        ? objectsResult.objects[0].name 
        : undefined;

      return {
        text: textResult.text,
        labels,
        detectedObject,
      };
    } catch (error: any) {
      throw new Error(`Erreur lors de la reconnaissance d'image: ${error.message}`);
    }
  }

  /**
   * Effectue une reconnaissance de texte (OCR) sur une image
   * @param imageBuffer - Buffer de l'image à analyser
   * @returns Résultat de la reconnaissance avec le texte détecté
   */
  private async detectText(imageBuffer: Buffer): Promise<{
    text: string;
  }> {
    try {
      const [result] = await this.client.textDetection({
        image: { content: imageBuffer },
      });

      const detections = result.textAnnotations;
      if (!detections || detections.length === 0) {
        return {
          text: "",
        };
      }

      // Le premier élément contient tout le texte détecté
      const fullText = detections[0].description || "";

      return {
        text: fullText,
      };
    } catch (error: any) {
      throw new Error(`Erreur lors de la détection de texte: ${error.message}`);
    }
  }

  /**
   * Effectue une localisation d'objets sur une image
   * Plus performant que labelDetection pour identifier des objets spécifiques comme les outils
   * @param imageBuffer - Buffer de l'image à analyser
   * @returns Objets détectés dans l'image, triés par score (confiance)
   */
  private async detectObjects(imageBuffer: Buffer): Promise<{
    objects: Array<{ name: string; score: number }>;
  }> {
    try {
      // Vérifier que la méthode objectLocalization est disponible
      if (!this.client.objectLocalization) {
        throw new Error(
          "La méthode objectLocalization n'est pas disponible. " +
          "Vérifiez que vous utilisez une version compatible de @google-cloud/vision."
        );
      }

      const [result] = await this.client.objectLocalization({
        image: { content: imageBuffer },
      });

      const objects =
        result.localizedObjectAnnotations
          ?.map((obj) => ({
            name: obj.name || "",
            score: obj.score || 0,
          }))
          // Trier par score décroissant pour avoir les meilleures correspondances en premier
          .sort((a, b) => b.score - a.score) || [];

      return {
        objects,
      };
    } catch (error: any) {
      throw new Error(`Erreur lors de la localisation d'objets: ${error.message}`);
    }
  }
}

