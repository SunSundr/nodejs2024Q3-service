import { Controller } from '@nestjs/common';
import { ArtistDto } from 'src/lib/artist/artist.dto';
import { Artist } from 'src/lib/artist/artist.model';
import { LibBaseController } from '../lib.base.controller';
import { LibService } from '../lib.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Artists')
@Controller('artist')
export class ArtistController extends LibBaseController {
  protected readonly owner = Artist;
  protected readonly dtoClass = ArtistDto;

  constructor(readonly libService: LibService) {
    super(libService);
  }
}
