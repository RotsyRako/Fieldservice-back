"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureRepository = void 0;
const prisma_1 = require("../utils/prisma");
const base_repository_1 = require("./base.repository");
class SignatureRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(prisma_1.prisma.signature, "Signature");
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
exports.SignatureRepository = SignatureRepository;
