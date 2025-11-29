import { Express } from "express";
import userRoutes from "./routes/user.route";
import interventionRoutes from "./routes/intervention.route";
import materielRoutes from "./routes/materiel.route";
import timesheetRoutes from "./routes/timesheet.route";
import imageRoutes from "./routes/image.route";
import documentRoutes from "./routes/document.route";
import commentRoutes from "./routes/comment.route";
import signatureRoutes from "./routes/signature.route";
import recognizeImageRoutes from "./routes/recognizeImage.route";

/**
 * Configure toutes les routes de l'application
 * @param app - Instance Express
 */
export function configureRoutes(app: Express): void {
  // Route de santé
  app.get("/health", (_req, res) => 
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      service: "Rotsy Backend API"
    })
  );

  // Routes API
  app.use("/api", userRoutes);
  app.use("/api", interventionRoutes);
  app.use("/api", materielRoutes);
  app.use("/api", timesheetRoutes);
  app.use("/api", imageRoutes);
  app.use("/api", documentRoutes);
  app.use("/api", commentRoutes);
  app.use("/api", signatureRoutes);
  app.use("/api", recognizeImageRoutes);
}
