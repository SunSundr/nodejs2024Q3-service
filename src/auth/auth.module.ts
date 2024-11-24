import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { loadEnv } from 'src/common/utils/load.env';
import { JWT_DEFAULT } from 'src/app.config';
import { UsersModule } from 'src/users/users.module';

loadEnv(); // for dev-mode

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY || JWT_DEFAULT.defaultSecret,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME || JWT_DEFAULT.tokenExpireTime },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
