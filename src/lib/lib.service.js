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
var LibService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibService = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const track_model_1 = require("./track/track.model");
const artist_model_1 = require("./artist/artist.model");
const album_model_1 = require("./album/album.model");
const req_method_enum_1 = require("../common/utils/req-method.enum");
let LibService = LibService_1 = class LibService {
    constructor(libRepository) {
        this.libRepository = libRepository;
    }
    static callByOwner(owner, func, dto, ...args) {
        switch (owner) {
            case track_model_1.Track:
                return func(dto, ...args);
            case artist_model_1.Artist:
                return func(dto, ...args);
            case album_model_1.Album:
                return func(dto, ...args);
            default:
                return;
        }
    }
    static typeNameByOwner(owner) {
        return owner.name.toLowerCase();
    }
    static getUserId(req) {
        return req['userId'] ? req['userId'] : null;
    }
    async requestValidate(req, owner, dtoClass) {
        const { id } = req.params;
        const userId = LibService_1.getUserId(req);
        if (req.method !== req_method_enum_1.ReqMethod.POST && !(0, class_validator_1.isUUID)(id)) {
            throw new common_1.BadRequestException('Invalid UUID');
        }
        let dto;
        if (req.method !== req_method_enum_1.ReqMethod.DELETE && req.method !== req_method_enum_1.ReqMethod.GET) {
            dto = (0, class_transformer_1.plainToClass)(dtoClass, req.body);
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                throw new common_1.BadRequestException({
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    error: 'Bad Request',
                    message: 'Validation failed',
                    errors: errors.map((error) => {
                        const children = error.children || {};
                        return Object.assign({ property: error.property, constraints: error.constraints }, children);
                    }),
                });
            }
        }
        let entity;
        if (req.method !== req_method_enum_1.ReqMethod.POST) {
            entity = await this.getById(owner, id, userId);
            if (!entity) {
                throw new common_1.NotFoundException(`Entity with id ${id} not found`);
            }
        }
        else {
            entity = null;
        }
        return { entity, dto, userId };
    }
    async create(owner, createDto, userID) {
        const newEntity = LibService_1.callByOwner(owner, owner.createFromDto, createDto, userID);
        if (!newEntity)
            return null;
        return await this.libRepository.saveEntyty(newEntity, LibService_1.typeNameByOwner(owner));
    }
    async update(owner, obj, updateDto) {
        if (!updateDto)
            throw new common_1.BadRequestException('Body is invalid');
        LibService_1.callByOwner(owner, obj.updateFromDto.bind(obj), updateDto);
        return await this.libRepository.updateByID(obj, LibService_1.typeNameByOwner(owner));
    }
    async getAll(owner, userID) {
        return await this.libRepository.getAll(LibService_1.typeNameByOwner(owner), userID);
    }
    async getById(owner, id, userID) {
        const entity = await this.libRepository.get(id, LibService_1.typeNameByOwner(owner), userID);
        return entity || null;
    }
    async delete(owner, obj) {
        await this.libRepository.deleteByID(obj.id, LibService_1.typeNameByOwner(owner));
    }
    async setFavorite(owner, id, status, userId) {
        const entity = await this.getById(owner, id, userId);
        if (!entity)
            throw new common_1.UnprocessableEntityException(`${owner.name} not found`);
        const type = owner.name.toLowerCase();
        entity.favorite = status;
        await this.libRepository.setFavs(id, type, status, userId);
        return entity;
    }
    async getAllFavs(userId) {
        return await this.libRepository.getFavs(userId);
    }
};
exports.LibService = LibService;
exports.LibService = LibService = LibService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ILibRepository')),
    __metadata("design:paramtypes", [Object])
], LibService);
//# sourceMappingURL=lib.service.js.map