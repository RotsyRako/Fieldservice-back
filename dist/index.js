"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_handler_1 = require("./middleware/error_handler");
const database_connection_1 = require("./utils/database_connection");
const app_router_1 = require("./app_router");
const config_1 = require("./utils/config");
const app = (0, express_1.default)();
// Middleware global
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Configuration des routes
(0, app_router_1.configureRoutes)(app);
// Middleware global d'erreurs en dernier
app.use(error_handler_1.errorHandler);
// Démarrage du serveur avec test de connexion
async function startServer() {
    try {
        // Valider la configuration
        (0, config_1.validateConfig)();
        // Afficher la configuration
        (0, config_1.displayConfig)();
        // Tester la connexion à la base de données
        const isConnected = await (0, database_connection_1.testDatabaseConnection)();
        if (!isConnected) {
            console.error("❌ Impossible de démarrer le serveur sans connexion à la base de données");
            process.exit(1);
        }
        app.listen(config_1.config.server.port, () => {
            console.log(`🚀 Server running on http://localhost:${config_1.config.server.port}`);
            console.log(`📊 Health check: http://localhost:${config_1.config.server.port}/health`);
        });
    }
    catch (error) {
        console.error("❌ Erreur de configuration:", error);
        process.exit(1);
    }
}
// Gestion propre de l'arrêt du serveur
process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt du serveur...');
    await (0, database_connection_1.closeDatabaseConnection)();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n🛑 Arrêt du serveur...');
    await (0, database_connection_1.closeDatabaseConnection)();
    process.exit(0);
});
startServer().catch((error) => {
    console.error("❌ Erreur lors du démarrage du serveur:", error);
    process.exit(1);
});
