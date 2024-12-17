"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesModule = void 0;
const common_1 = require("@nestjs/common");
const lib_service_module_1 = require("../lib.service.module");
const favs_controller_1 = require("./favs.controller");
const artist_model_1 = require("../artist/artist.model");
const track_model_1 = require("../track/track.model");
const album_model_1 = require("../album/album.model");
let FavoritesModule = class FavoritesModule {
};
exports.FavoritesModule = FavoritesModule;
exports.FavoritesModule = FavoritesModule = __decorate([
    (0, common_1.Module)({
        imports: [lib_service_module_1.LibServiceModule.register({ typeormRepo: [artist_model_1.Artist, track_model_1.Track, album_model_1.Album] })],
        controllers: [favs_controller_1.FavoritesController],
    })
], FavoritesModule);
//# sourceMappingURL=favs.module.js.map