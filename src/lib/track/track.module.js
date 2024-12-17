"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackModule = void 0;
const common_1 = require("@nestjs/common");
const track_controller_1 = require("./track.controller");
const lib_service_module_1 = require("../lib.service.module");
const track_model_1 = require("./track.model");
let TrackModule = class TrackModule {
};
exports.TrackModule = TrackModule;
exports.TrackModule = TrackModule = __decorate([
    (0, common_1.Module)({
        imports: [lib_service_module_1.LibServiceModule.register({ typeormRepo: [track_model_1.Track] })],
        controllers: [track_controller_1.TrackController],
    })
], TrackModule);
//# sourceMappingURL=track.module.js.map