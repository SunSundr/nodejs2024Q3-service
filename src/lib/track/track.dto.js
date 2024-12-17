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
exports.TrackDto = void 0;
const class_validator_1 = require("class-validator");
const IsUUIDOrNull_decorator_1 = require("../../common/utils/IsUUIDOrNull.decorator");
const lib_base_dto_1 = require("../lib.base.dto");
class TrackDto extends lib_base_dto_1.LibBaseDto {
}
exports.TrackDto = TrackDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], TrackDto.prototype, "duration", void 0);
__decorate([
    (0, IsUUIDOrNull_decorator_1.IsUUIDOrNull)(),
    __metadata("design:type", String)
], TrackDto.prototype, "artistId", void 0);
__decorate([
    (0, IsUUIDOrNull_decorator_1.IsUUIDOrNull)(),
    __metadata("design:type", String)
], TrackDto.prototype, "albumId", void 0);
//# sourceMappingURL=track.dto.js.map