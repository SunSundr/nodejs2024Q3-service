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
var Artist_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artist = void 0;
const typeorm_1 = require("typeorm");
const lib_base_model_1 = require("../lib.base.model");
let Artist = Artist_1 = class Artist extends lib_base_model_1.BaseLibClass {
    constructor(userId, name, grammy = false) {
        super(userId);
        this.name = name;
        this.grammy = grammy;
    }
    static createFromDto(createDto, userId = null) {
        return new Artist_1(userId, createDto.name, createDto.grammy);
    }
    updateFromDto(updateDto) {
        var _a;
        Object.assign(this, {
            name: (_a = updateDto.name) !== null && _a !== void 0 ? _a : this.name,
            grammy: updateDto.grammy !== undefined ? updateDto.grammy : this.grammy,
        });
    }
};
exports.Artist = Artist;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artist.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Artist.prototype, "grammy", void 0);
exports.Artist = Artist = Artist_1 = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, Boolean])
], Artist);
//# sourceMappingURL=artist.model.js.map