import { Track } from './track.model';
import { TrackDto } from './track.dto';
import { LibBaseController } from '../lib.base.controller';
import { LibService } from '../lib.service';
export declare class TrackController extends LibBaseController {
    readonly libService: LibService;
    protected readonly owner: typeof Track;
    protected readonly dtoClass: typeof TrackDto;
    constructor(libService: LibService);
}
