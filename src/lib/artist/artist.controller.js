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
exports.ArtistController = void 0;
const common_1 = require("@nestjs/common");
const artist_dto_1 = require("./artist.dto");
const artist_model_1 = require("./artist.model");
const lib_base_controller_1 = require("../lib.base.controller");
const lib_service_1 = require("../lib.service");
const swagger_1 = require("@nestjs/swagger");
let ArtistController = class ArtistController extends lib_base_controller_1.LibBaseController {
    constructor(libService) {
        super(libService);
        this.libService = libService;
        this.owner = artist_model_1.Artist;
        this.dtoClass = artist_dto_1.ArtistDto;
    }
};
exports.ArtistController = ArtistController;
exports.ArtistController = ArtistController = __decorate([
    (0, swagger_1.ApiTags)('Artists'),
    (0, common_1.Controller)('artist'),
    __metadata("design:paramtypes", [lib_service_1.LibService])
], ArtistController);
//# sourceMappingURL=artist.controller.js.map