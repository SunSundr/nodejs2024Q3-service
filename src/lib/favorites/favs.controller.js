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
exports.FavoritesController = void 0;
const common_1 = require("@nestjs/common");
const lib_service_1 = require("../lib.service");
const track_model_1 = require("../track/track.model");
const artist_model_1 = require("../artist/artist.model");
const album_model_1 = require("../album/album.model");
const swagger_1 = require("@nestjs/swagger");
let FavoritesController = class FavoritesController {
    constructor(libService) {
        this.libService = libService;
    }
    async findAll(req) {
        return await this.libService.getAllFavs(lib_service_1.LibService.getUserId(req));
    }
    async addTrack(id, req) {
        return await this.libService.setFavorite(track_model_1.Track, id, true, lib_service_1.LibService.getUserId(req));
    }
    async deleteTrack(id, req) {
        return await this.libService.setFavorite(track_model_1.Track, id, false, lib_service_1.LibService.getUserId(req));
    }
    async addAlbum(id, req) {
        return await this.libService.setFavorite(album_model_1.Album, id, true, lib_service_1.LibService.getUserId(req));
    }
    async deleteAlbum(id, req) {
        return await this.libService.setFavorite(album_model_1.Album, id, false, lib_service_1.LibService.getUserId(req));
    }
    async addArtist(id, req) {
        return await this.libService.setFavorite(artist_model_1.Artist, id, true, lib_service_1.LibService.getUserId(req));
    }
    async deleteArtist(id, req) {
        return await this.libService.setFavorite(artist_model_1.Artist, id, false, lib_service_1.LibService.getUserId(req));
    }
};
exports.FavoritesController = FavoritesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Returns all favorite items' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('track/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Add track to favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Track added to favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid UUID format for trackId' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNPROCESSABLE_ENTITY, description: 'Track not found' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "addTrack", null);
__decorate([
    (0, common_1.Delete)('track/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove track from favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT, description: 'Track removed from favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid UUID format for trackId' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Track not found in favorites' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "deleteTrack", null);
__decorate([
    (0, common_1.Post)('album/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Add album to favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Album added to favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid UUID format for albumId' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNPROCESSABLE_ENTITY, description: 'Album not found' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "addAlbum", null);
__decorate([
    (0, common_1.Delete)('album/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove album from favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT, description: 'Album removed from favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid UUID format for albumId' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Album not found in favorites' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "deleteAlbum", null);
__decorate([
    (0, common_1.Post)('artist/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Add artist to favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Artist added to favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid UUID format for artistId' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNPROCESSABLE_ENTITY, description: 'Artist not found' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "addArtist", null);
__decorate([
    (0, common_1.Delete)('artist/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove artist from favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT, description: 'Artist removed from favorites' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid UUID format for artistId' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Artist not found in favorites' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "deleteArtist", null);
exports.FavoritesController = FavoritesController = __decorate([
    (0, swagger_1.ApiTags)('Favorites'),
    (0, common_1.Controller)('favs'),
    __metadata("design:paramtypes", [lib_service_1.LibService])
], FavoritesController);
//# sourceMappingURL=favs.controller.js.map