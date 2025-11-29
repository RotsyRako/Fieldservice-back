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
    expiresIn: process.env.JWT_EXPIRES_IN || "31536000", // 1 an par défaut (365 jours)
  },

  // Configuration Supabase (si utilisé)
  supabase: {
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || "",
  },

  // Configuration Google Cloud Vision API
  googleCloud: {
    type: process.env.GOOGLE_CLOUD_TYPE || "service_account",
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || "",
    privateKeyId: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID || "",
    privateKey: process.env.GOOGLE_CLOUD_PRIVATE_KEY || "",
    clientEmail: process.env.GOOGLE_CLOUD_CLIENT_EMAIL || "",
    clientId: process.env.GOOGLE_CLOUD_CLIENT_ID || "",
    authUri: process.env.GOOGLE_CLOUD_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
    tokenUri: process.env.GOOGLE_CLOUD_TOKEN_URI || "https://oauth2.googleapis.com/token",
    authProviderX509CertUrl:
      process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL ||
      "https://www.googleapis.com/oauth2/v1/certs",
    clientX509CertUrl: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL || "",
    universeDomain: process.env.GOOGLE_CLOUD_UNIVERSE_DOMAIN || "googleapis.com",
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
      `❌ Variables d'environnement manquantes: ${missingKeys}\n` +
      "Veuillez configurer ces variables dans votre fichier .env"
    );
  }
}

/**
 * Affiche la configuration actuelle (sans les secrets)
 */
export function displayConfig(): void {
  console.log("🔧 Configuration du serveur:");
  console.log(`   Port: ${config.server.port}`);
  console.log(`   Environnement: ${config.server.nodeEnv}`);
  console.log(`   Base de données: ${config.database.url ? "✅ Configurée" : "❌ Non configurée"}`);
  console.log(`   JWT Secret: ${config.jwt.secret ? "✅ Configuré" : "❌ Non configuré"}`);
  console.log(`   Durée JWT: ${config.jwt.expiresIn} secondes`);
}
