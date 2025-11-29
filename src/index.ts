import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { errorHandler } from "./middleware/error_handler";
import { testDatabaseConnection, closeDatabaseConnection } from "./utils/database_connection";
import { configureRoutes } from "./app_router";
import { config, validateConfig, displayConfig } from "./utils/config";

const app = express();

// Middleware global
// Augmenter la limite de taille du body pour gérer les images/documents en base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configuration Swagger
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Rotsy API Documentation",
}));

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
      console.log(`📚 API Documentation: http://localhost:${config.server.port}/api-docs`);
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
