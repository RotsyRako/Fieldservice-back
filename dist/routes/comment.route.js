"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middleware/validate");
const comment_dto_1 = require("../model/dto/comment.dto");
const comment_controller_1 = require("../controller/comment.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes publiques (avec authentification optionnelle)
router.get("/comments", auth_1.optionalAuth, comment_controller_1.commentController.getAll);
router.get("/comments/count", auth_1.optionalAuth, comment_controller_1.commentController.count);
router.get("/comments/search", auth_1.optionalAuth, comment_controller_1.commentController.findByField);
// Routes nécessitant une authentification obligatoire
router.post("/comments", auth_1.authenticateToken, (0, validate_1.validate)(comment_dto_1.CreateCommentSchema), comment_controller_1.commentController.createComment);
router.get("/comments/:id", auth_1.authenticateToken, comment_controller_1.commentController.getById);
router.put("/comments/:id", auth_1.authenticateToken, (0, validate_1.validate)(comment_dto_1.UpdateCommentSchema), comment_controller_1.commentController.update);
router.delete("/comments/:id", auth_1.authenticateToken, comment_controller_1.commentController.delete);
exports.default = router;
