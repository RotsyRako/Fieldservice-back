"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = configureRoutes;
const user_route_1 = __importDefault(require("./routes/user.route"));
const intervention_route_1 = __importDefault(require("./routes/intervention.route"));
const materiel_route_1 = __importDefault(require("./routes/materiel.route"));
const timesheet_route_1 = __importDefault(require("./routes/timesheet.route"));
const image_route_1 = __importDefault(require("./routes/image.route"));
const document_route_1 = __importDefault(require("./routes/document.route"));
const comment_route_1 = __importDefault(require("./routes/comment.route"));
const signature_route_1 = __importDefault(require("./routes/signature.route"));
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
    app.use("/api", intervention_route_1.default);
    app.use("/api", materiel_route_1.default);
    app.use("/api", timesheet_route_1.default);
    app.use("/api", image_route_1.default);
    app.use("/api", document_route_1.default);
    app.use("/api", comment_route_1.default);
    app.use("/api", signature_route_1.default);
}
