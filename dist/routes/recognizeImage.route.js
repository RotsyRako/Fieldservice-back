"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recognizeImage_controller_1 = require("../controller/recognizeImage.controller");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const base_response_utils_1 = require("../utils/base_response.utils");
const router = (0, express_1.Router)();
// Configuration de multer pour l'upload de fichiers
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB max (limite Cloud Vision API)
    },
    fileFilter: (_req, file, cb) => {
        // Accepter uniquement les images
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Type de fichier non supporté. Utilisez JPEG, PNG, GIF ou WebP"));
        }
    },
});
// Middleware pour gérer les erreurs Multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json((0, base_response_utils_1.fail)("Le fichier est trop volumineux (maximum 20MB)"));
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json((0, base_response_utils_1.fail)(`Champ de fichier inattendu. Utilisez 'image' ou 'file' comme nom de champ`));
        }
        return res.status(400).json((0, base_response_utils_1.fail)(`Erreur Multer: ${err.message}`));
    }
    if (err) {
        return res.status(400).json((0, base_response_utils_1.fail)(err.message || "Erreur lors de l'upload du fichier"));
    }
    next();
};
// Route pour la reconnaissance d'image avec base64
// POST /api/recognize-image
router.post("/recognize-image", auth_1.authenticateToken, recognizeImage_controller_1.recognizeImageController.recognizeImage);
// Route pour la reconnaissance d'image avec upload de fichier
// POST /api/recognize-image-upload
// Accepte les champs 'image' ou 'file'
router.post("/recognize-image-upload", auth_1.authenticateToken, (req, res, next) => {
    // Utiliser fields pour accepter soit 'image' soit 'file'
    upload.fields([{ name: "image", maxCount: 1 }, { name: "file", maxCount: 1 }])(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        // Normaliser le fichier dans req.file pour le contrôleur
        const files = req.files;
        if (files) {
            if (files.image && files.image.length > 0) {
                req.file = files.image[0];
            }
            else if (files.file && files.file.length > 0) {
                req.file = files.file[0];
            }
        }
        next();
    });
}, recognizeImage_controller_1.recognizeImageController.recognizeImageUpload);
exports.default = router;
