import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArtistModule } from './lib/artist/artist.module';
import { TrackModule } from './lib/track/track.module';
import { AlbumModule } from './lib/album/album.module';
import { FavoritesModule } from './lib/favorites/favs.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LogInterceptor } from './log/log.interceptor';
import { HttpExceptionFilter } from './log/httpException.filter';
import { LogModule } from './log/log.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { dataSourceOptions } from './typeorm/data-source-options';

@Module({
  imports: [
    // TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavoritesModule,
    AuthModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LogInterceptor },
  ],
})
export class AppModule {}
