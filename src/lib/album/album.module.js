"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumModule = void 0;
const common_1 = require("@nestjs/common");
const album_controller_1 = require("./album.controller");
const lib_service_module_1 = require("../lib.service.module");
const album_model_1 = require("./album.model");
let AlbumModule = class AlbumModule {
};
exports.AlbumModule = AlbumModule;
exports.AlbumModule = AlbumModule = __decorate([
    (0, common_1.Module)({
        imports: [lib_service_module_1.LibServiceModule.register({ typeormRepo: [album_model_1.Album] })],
        controllers: [album_controller_1.AlbumController],
    })
], AlbumModule);
//# sourceMappingURL=album.module.js.map