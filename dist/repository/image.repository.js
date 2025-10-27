"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRepository = void 0;
const prisma_1 = require("../utils/prisma");
const base_repository_1 = require("./base.repository");
class ImageRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(prisma_1.prisma.image, "Image");
    }
    getSelectFields() {
        return {
            id: true,
            ic: true,
            filename: true,
            data: true,
            idIntervention: true,
            createdAt: true,
            updatedAt: true,
        };
    }
}
exports.ImageRepository = ImageRepository;
