import { Album } from 'src/lib/album/album.model';
import { AlbumDto } from 'src/lib/album/album.dto';
import { LibBaseController } from '../lib.base.controller';
import { LibService } from '../lib.service';
export declare class AlbumController extends LibBaseController {
    readonly libService: LibService;
    protected readonly owner: typeof Album;
    protected readonly dtoClass: typeof AlbumDto;
    constructor(libService: LibService);
}
