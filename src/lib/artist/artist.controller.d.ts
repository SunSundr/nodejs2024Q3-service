import { ArtistDto } from 'src/lib/artist/artist.dto';
import { Artist } from 'src/lib/artist/artist.model';
import { LibBaseController } from '../lib.base.controller';
import { LibService } from '../lib.service';
export declare class ArtistController extends LibBaseController {
    readonly libService: LibService;
    protected readonly owner: typeof Artist;
    protected readonly dtoClass: typeof ArtistDto;
    constructor(libService: LibService);
}
