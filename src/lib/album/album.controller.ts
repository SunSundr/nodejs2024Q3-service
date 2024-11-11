import { Controller } from '@nestjs/common';
import { Album } from 'src/lib/album/album.model';
import { AlbumDto } from 'src/lib/album/album.dto';
import { LibBaseController } from '../lib.base.controller';
import { LibService } from '../lib.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Albums')
@Controller('album')
export class AlbumController extends LibBaseController {
  protected readonly owner = Album;
  protected readonly dtoClass = AlbumDto;

  constructor(readonly libService: LibService) {
    super(libService);
  }
}
