"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const prisma_1 = require("../utils/prisma");
const base_repository_1 = require("./base.repository");
class CommentRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(prisma_1.prisma.comment, "Comment");
    }
    getSelectFields() {
        return {
            id: true,
            message: true,
            date: true,
            attachmentFilename: true,
            attachmentData: true,
            idIntervention: true,
            createdAt: true,
            updatedAt: true,
        };
    }
}
exports.CommentRepository = CommentRepository;
