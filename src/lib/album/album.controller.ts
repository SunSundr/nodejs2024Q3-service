import { Controller } from '@nestjs/common';

import { Album } from 'src/common/models/album.model';
import { AlbumDto } from 'src/common/dto/album.dto';

import { LibBaseController } from '../lib.base.controller';
import { LibService } from '../lib.service';

@Controller('album')
export class AlbumController extends LibBaseController {
  protected readonly owner = Album;
  protected readonly dtoClass = AlbumDto;

  constructor(readonly libService: LibService) {
    super(libService);
  }
}