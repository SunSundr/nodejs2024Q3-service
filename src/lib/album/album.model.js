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
var Album_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Album = void 0;
const typeorm_1 = require("typeorm");
const lib_base_model_1 = require("../lib.base.model");
const artist_model_1 = require("../artist/artist.model");
const serialize_1 = require("../../common/utils/serialize");
let Album = Album_1 = class Album extends lib_base_model_1.BaseLibClass {
    constructor(userId, name, year = null, artistId = null) {
        super(userId);
        this.name = name;
        this.year = year;
        this.artistId = artistId;
    }
    static createFromDto(createDto, userId = null) {
        return new Album_1(userId, createDto.name, createDto.year, createDto.artistId);
    }
    updateFromDto(updateDto) {
        var _a, _b, _c;
        Object.assign(this, {
            name: (_a = updateDto.name) !== null && _a !== void 0 ? _a : this.name,
            year: (_b = updateDto.year) !== null && _b !== void 0 ? _b : this.year,
            artistId: (_c = updateDto.artistId) !== null && _c !== void 0 ? _c : this.artistId,
        });
    }
    toJSON() {
        return (0, serialize_1.serialize)(this, ['user', 'userId', 'favorite', 'artist']);
    }
};
exports.Album = Album;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Album.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Album.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Album.prototype, "artistId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => artist_model_1.Artist, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'artistId' }),
    __metadata("design:type", artist_model_1.Artist)
], Album.prototype, "artist", void 0);
exports.Album = Album = Album_1 = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, Number, String])
], Album);
//# sourceMappingURL=album.model.js.map