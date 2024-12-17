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
var Track_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
const typeorm_1 = require("typeorm");
const lib_base_model_1 = require("../lib.base.model");
const artist_model_1 = require("../artist/artist.model");
const album_model_1 = require("../album/album.model");
const serialize_1 = require("../../common/utils/serialize");
let Track = Track_1 = class Track extends lib_base_model_1.BaseLibClass {
    constructor(userId, name, artistId = null, albumId = null, duration = 0) {
        super(userId);
        this.name = name;
        this.artistId = artistId;
        this.albumId = albumId;
        this.duration = duration;
    }
    static createFromDto(createDto, userId = null) {
        return new Track_1(userId, createDto.name, createDto.artistId, createDto.albumId, createDto.duration);
    }
    updateFromDto(updateDto) {
        var _a, _b, _c, _d;
        Object.assign(this, {
            name: (_a = updateDto.name) !== null && _a !== void 0 ? _a : this.name,
            artistId: (_b = updateDto.artistId) !== null && _b !== void 0 ? _b : this.artistId,
            albumId: (_c = updateDto.albumId) !== null && _c !== void 0 ? _c : this.albumId,
            duration: (_d = updateDto.duration) !== null && _d !== void 0 ? _d : this.duration,
        });
    }
    toJSON() {
        return (0, serialize_1.serialize)(this, ['user', 'userId', 'favorite', 'artist', 'album']);
    }
};
exports.Track = Track;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Track.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Track.prototype, "artistId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Track.prototype, "albumId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Track.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => artist_model_1.Artist, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'artistId' }),
    __metadata("design:type", artist_model_1.Artist)
], Track.prototype, "artist", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => album_model_1.Album, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'albumId' }),
    __metadata("design:type", album_model_1.Album)
], Track.prototype, "album", void 0);
exports.Track = Track = Track_1 = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, String, Number])
], Track);
//# sourceMappingURL=track.model.js.map