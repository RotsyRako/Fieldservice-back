import { prisma } from "./prisma";
import { config } from "./config";

/**
 * Teste la connexion à la base de données Supabase
 * @returns Promise<boolean> - true si la connexion est réussie
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    console.log("🔍 Test de connexion à Supabase...");
    
    // Test de connexion
    await prisma.$connect();
    console.log("✅ Connexion à Supabase établie");
    
    // Test de requête simple
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Base de données accessible");
    
    return true;
  } catch (error: any) {
    console.error("❌ Erreur de connexion à Supabase:", error.message);
    
    // Gestion des erreurs spécifiques
    if (error.code === "P1001") {
      console.error("💡 Erreur: Impossible de se connecter au serveur de base de données");
    } else if (error.code === "P1003") {
      console.error("💡 Erreur: Base de données introuvable");
    } else if (error.message?.includes("connect")) {
      console.error("💡 Erreur: Problème de connexion réseau");
    }
    
    console.error("💡 Vérifiez votre configuration DATABASE_URL dans le fichier .env");
    console.error(`💡 URL actuelle: ${config.database.url ? "Configurée" : "Non configurée"}`);
    return false;
  }
}

/**
 * Ferme proprement la connexion à la base de données
 */
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log("✅ Connexion à la base de données fermée");
  } catch (error) {
    console.error("❌ Erreur lors de la fermeture de la connexion:", error);
  }
}

/**
 * Vérifie si la base de données est accessible
 * @returns Promise<boolean> - true si accessible
 */
export async function isDatabaseAccessible(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
