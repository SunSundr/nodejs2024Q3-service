import { Controller } from '@nestjs/common';
import { Track } from '../../common/models/track.model';
import { TrackDto } from '../../common/dto/track.dto';
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
