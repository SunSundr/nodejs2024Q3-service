"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibBaseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lib_service_1 = require("./lib.service");
const lib_base_dto_1 = require("./lib.base.dto");
class LibBaseController {
    constructor(libService) {
        this.libService = libService;
    }
    async getAll(req) {
        return await this.libService.getAll(this.owner, lib_service_1.LibService.getUserId(req));
    }
    async getById(req) {
        return (await this.libService.requestValidate(req, this.owner, this.dtoClass)).entity;
    }
    async create(req, _) {
        const { dto, userId } = await this.libService.requestValidate(req, this.owner, this.dtoClass);
        return await this.libService.create(this.owner, dto, userId);
    }
    async update(req, _) {
        const { entity, dto } = await this.libService.requestValidate(req, this.owner, this.dtoClass);
        return await this.libService.update(this.owner, entity, dto);
    }
    async delete(req) {
        const { entity } = await this.libService.requestValidate(req, this.owner, this.dtoClass);
        return await this.libService.delete(this.owner, entity);
    }
}
exports.LibBaseController = LibBaseController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all entities' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibBaseController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get entity by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Entity ID (UUID)', type: String }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Entity found', type: 'LibTypes' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad request or ID is invalid (not UUID)',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Entity with ID not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibBaseController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new entity' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Entity successfully created',
        type: lib_base_dto_1.UniversalDTO,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad request, body is invalid or missing required fields',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, lib_base_dto_1.UniversalDTO]),
    __metadata("design:returntype", Promise)
], LibBaseController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update entity by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Entity ID (UUID)', type: String }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Entity successfully updated',
        type: lib_base_dto_1.UniversalDTO,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad request or ID is invalid (not UUID)',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Entity with ID not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, lib_base_dto_1.UniversalDTO]),
    __metadata("design:returntype", Promise)
], LibBaseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete entity by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Entity ID (UUID)', type: String }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT, description: 'Entity successfully deleted' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad request or ID is invalid (not UUID)',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Entity with ID not found' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibBaseController.prototype, "delete", null);
//# sourceMappingURL=lib.base.controller.js.map