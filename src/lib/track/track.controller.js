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
exports.TrackController = void 0;
const common_1 = require("@nestjs/common");
const track_model_1 = require("./track.model");
const track_dto_1 = require("./track.dto");
const lib_base_controller_1 = require("../lib.base.controller");
const lib_service_1 = require("../lib.service");
const swagger_1 = require("@nestjs/swagger");
let TrackController = class TrackController extends lib_base_controller_1.LibBaseController {
    constructor(libService) {
        super(libService);
        this.libService = libService;
        this.owner = track_model_1.Track;
        this.dtoClass = track_dto_1.TrackDto;
    }
};
exports.TrackController = TrackController;
exports.TrackController = TrackController = __decorate([
    (0, swagger_1.ApiTags)('Tracks'),
    (0, common_1.Controller)('track'),
    __metadata("design:paramtypes", [lib_service_1.LibService])
], TrackController);
//# sourceMappingURL=track.controller.js.map