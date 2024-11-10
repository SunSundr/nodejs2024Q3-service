import { Controller } from '@nestjs/common';

import { Track } from '../../common/models/track.model';
import { TrackDto } from '../../common/dto/track.dto';

// import { createEntityInterceptor } from '../lib.entity.interceptor';
import { LibBaseController } from '../lib.base.controller';
import { LibService } from '../lib.service';

@Controller('track')
export class TrackController extends LibBaseController {
  protected readonly owner = Track;
  protected readonly dtoClass = TrackDto;

  constructor(readonly libService: LibService) {
    super(libService);
  }
}
