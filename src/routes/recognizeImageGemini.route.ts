import { Router, Request, Response, NextFunction } from "express";
import { recognizeImageGeminiController } from "../controller/recognizeImageGemini.controller";
import { authenticateToken } from "../middleware/auth";
import multer from "multer";
import { fail } from "../utils/base_response.utils";

const router = Router();

// Configuration de multer pour l'upload de fichiers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max (limite Gemini Pro Vision API)
  },
  fileFilter: (_req, file, cb) => {
    // Accepter uniquement les images
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Type de fichier non supporté. Utilisez JPEG, PNG, GIF ou WebP"));
    }
  },
});

// Middleware pour gérer les erreurs Multer
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json(fail("Le fichier est trop volumineux (maximum 20MB)"));
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json(
        fail(`Champ de fichier inattendu. Utilisez 'image' ou 'file' comme nom de champ`)
      );
    }
    return res.status(400).json(fail(`Erreur Multer: ${err.message}`));
  }
  if (err) {
    return res.status(400).json(fail(err.message || "Erreur lors de l'upload du fichier"));
  }
  next();
};

// Route pour la reconnaissance d'image avec base64
// POST /api/recognize-image-gemini
router.post(
  "/recognize-image-gemini",
  authenticateToken,
  recognizeImageGeminiController.recognizeImage
);

// Route pour la reconnaissance d'image avec upload de fichier
// POST /api/recognize-image-gemini-upload
// Accepte les champs 'image' ou 'file'
router.post(
  "/recognize-image-gemini-upload",
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    // Utiliser fields pour accepter soit 'image' soit 'file'
    upload.fields([{ name: "image", maxCount: 1 }, { name: "file", maxCount: 1 }])(
      req,
      res,
      (err) => {
        if (err) {
          return handleMulterError(err, req, res, next);
        }
        // Normaliser le fichier dans req.file pour le contrôleur
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        if (files) {
          if (files.image && files.image.length > 0) {
            (req as any).file = files.image[0];
          } else if (files.file && files.file.length > 0) {
            (req as any).file = files.file[0];
          }
        }
        next();
      }
    );
  },
  recognizeImageGeminiController.recognizeImageUpload
);

export default router;
