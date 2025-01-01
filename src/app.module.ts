import { Module, ModuleMetadata } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArtistModule } from './lib/artist/artist.module';
import { TrackModule } from './lib/track/track.module';
import { AlbumModule } from './lib/album/album.module';
import { FavoritesModule } from './lib/favorites/favs.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { LogInterceptor } from './log/log.interceptor';
import { HttpExceptionFilter } from './log/httpException.filter';
import { LogModule } from './log/log.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDataSourceOptions } from './typeorm/data-source-options';
import { OrmTypes, validateEnv } from './common/utils/validate.env';
import { AppConfigService } from './app.config.service';
import { LogService } from './log/log.service';

function getAppImports(): ModuleMetadata['imports'] {
  const imports = [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      ignoreEnvFile: true,
      validate: validateEnv,
    }),
    AuthModule,
    UsersModule.forRoot(),
    TrackModule,
    AlbumModule,
    ArtistModule,
    FavoritesModule,
    LogModule,
  ];
  if (process.env.ORM_TYPE === OrmTypes.TYPEORM) {
    imports.push(
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule, LogModule],
        inject: [ConfigService, LogService],
        useFactory: async (configService: ConfigService, logService: LogService) => {
          return await getDataSourceOptions(
            AppConfigService.getInstance(configService),
            logService,
          );
        },
      }),
    );
  }
  return imports;
}

@Module({
  imports: getAppImports(),
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LogInterceptor },
  ],
})
export class AppModule {}
