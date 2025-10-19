"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = configureRoutes;
const user_route_1 = __importDefault(require("./routes/user.route"));
/**
 * Configure toutes les routes de l'application
 * @param app - Instance Express
 */
function configureRoutes(app) {
    // Route de santé
    app.get("/health", (_req, res) => res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "Rotsy Backend API"
    }));
    // Routes API
    app.use("/api", user_route_1.default);
}
