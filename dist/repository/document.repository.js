"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRepository = void 0;
const prisma_1 = require("../utils/prisma");
const base_repository_1 = require("./base.repository");
class DocumentRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(prisma_1.prisma.document, "Document");
    }
    getSelectFields() {
        return {
            id: true,
            filename: true,
            data: true,
            idIntervention: true,
            createdAt: true,
            updatedAt: true,
        };
    }
}
exports.DocumentRepository = DocumentRepository;
