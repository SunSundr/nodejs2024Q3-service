import { UUID } from 'crypto';
import { Request as ExpressRequest } from 'express';
import { LibService } from '../lib.service';
import { Track } from 'src/lib/track/track.model';
import { Artist } from 'src/lib/artist/artist.model';
import { Album } from 'src/lib/album/album.model';
export declare class FavoritesController {
    readonly libService: LibService;
    constructor(libService: LibService);
    findAll(req: ExpressRequest): Promise<import("../../db/lib.repo.interface").FavoritesJSON>;
    addTrack(id: UUID, req: ExpressRequest): Promise<Artist | Album | Track>;
    deleteTrack(id: UUID, req: ExpressRequest): Promise<Artist | Album | Track>;
    addAlbum(id: UUID, req: ExpressRequest): Promise<Artist | Album | Track>;
    deleteAlbum(id: UUID, req: ExpressRequest): Promise<Artist | Album | Track>;
    addArtist(id: UUID, req: ExpressRequest): Promise<Artist | Album | Track>;
    deleteArtist(id: UUID, req: ExpressRequest): Promise<Artist | Album | Track>;
}
