import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

/**
 * Configuration centralisée des variables d'environnement
 * Toutes les variables d'environnement du projet sont définies ici
 */
export const config = {
  // Configuration du serveur
  server: {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
  },

  // Configuration de la base de données
  database: {
    url: process.env.DATABASE_URL || "",
  },

  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || "",
    expiresIn: process.env.JWT_EXPIRES_IN || "604800", // 7 jours par défaut
  },

  // Configuration Supabase (si utilisé)
  supabase: {
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || "",
  },
} as const;

/**
 * Validation des variables d'environnement critiques
 * Lance une erreur si les variables obligatoires ne sont pas définies
 */
export function validateConfig(): void {
  const requiredVars = [
    { key: "DATABASE_URL", value: config.database.url },
    { key: "JWT_SECRET", value: config.jwt.secret },
  ];

  const missingVars = requiredVars.filter(({ value }) => !value);

  if (missingVars.length > 0) {
    const missingKeys = missingVars.map(({ key }) => key).join(", ");
    throw new Error(
      `Variables d'environnement manquantes: ${missingKeys}\n` +
      "Veuillez configurer ces variables dans votre fichier .env"
    );
  }
}

/**
 * Affiche la configuration actuelle (sans les secrets)
 */
export function displayConfig(): void {
  console.log("Configuration du serveur:");
  console.log(`Port: ${config.server.port}`);
  console.log(`Environnement: ${config.server.nodeEnv}`);
  console.log(`Base de données: ${config.database.url ? "Configurée" : "Non configurée"}`);
  console.log(`JWT Secret: ${config.jwt.secret ? "Configuré" : "Non configuré"}`);
  console.log(`Durée JWT: ${config.jwt.expiresIn} secondes`);
}
