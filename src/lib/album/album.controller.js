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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumController = void 0;
const common_1 = require("@nestjs/common");
const album_model_1 = require("./album.model");
const album_dto_1 = require("./album.dto");
const lib_base_controller_1 = require("../lib.base.controller");
const lib_service_1 = require("../lib.service");
const swagger_1 = require("@nestjs/swagger");
let AlbumController = class AlbumController extends lib_base_controller_1.LibBaseController {
    constructor(libService) {
        super(libService);
        this.libService = libService;
        this.owner = album_model_1.Album;
        this.dtoClass = album_dto_1.AlbumDto;
    }
};
exports.AlbumController = AlbumController;
exports.AlbumController = AlbumController = __decorate([
    (0, swagger_1.ApiTags)('Albums'),
    (0, common_1.Controller)('album'),
    __metadata("design:paramtypes", [lib_service_1.LibService])
], AlbumController);
//# sourceMappingURL=album.controller.js.map