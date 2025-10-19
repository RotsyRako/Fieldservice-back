import express from "express";
import { errorHandler } from "./middleware/error_handler";
import { testDatabaseConnection, closeDatabaseConnection } from "./utils/database_connection";
import { configureRoutes } from "./app_router";
import { config, validateConfig, displayConfig } from "./utils/config";

const app = express();

// Middleware global
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des routes
configureRoutes(app);

// Middleware global d'erreurs en dernier
app.use(errorHandler);

// Démarrage du serveur avec test de connexion
async function startServer() {
  try {
    // Valider la configuration
    validateConfig();
    
    // Afficher la configuration
    displayConfig();
    
    // Tester la connexion à la base de données
    const isConnected = await testDatabaseConnection();
    
    if (!isConnected) {
      console.error("❌ Impossible de démarrer le serveur sans connexion à la base de données");
      process.exit(1);
    }
    
    app.listen(config.server.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.server.port}`);
      console.log(`📊 Health check: http://localhost:${config.server.port}/health`);
    });
  } catch (error) {
    console.error("❌ Erreur de configuration:", error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt du serveur
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await closeDatabaseConnection();
  process.exit(0);
});

startServer().catch((error) => {
  console.error("❌ Erreur lors du démarrage du serveur:", error);
  process.exit(1);
});
