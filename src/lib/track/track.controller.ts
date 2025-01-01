import { Controller } from '@nestjs/common';
import { Track } from './track.model';
import { TrackDto } from './track.dto';
import { LibBaseController } from '../lib.base.controller';
import { LibService } from '../lib.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tracks')
@Controller('track')
export class TrackController extends LibBaseController {
  protected readonly owner = Track;
  protected readonly dtoClass = TrackDto;

  constructor(readonly libService: LibService) {
    super(libService);
  }
}
