import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUserRepository } from '../db/users.repo.interface';
import { isUUID, validate } from 'class-validator';
import { UpdateUserDto } from './user.dto';
import { plainToClass } from 'class-transformer';
import { ReqMethod } from '../common/utils/req-method.enum';
import { USERS_REPOSITORY_TOKEN } from 'src/db/tokens';

@Injectable()
export class UserByIdInterceptor implements NestInterceptor {
  constructor(@Inject(USERS_REPOSITORY_TOKEN) private readonly userRepository: IUserRepository) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const updateUserDto = plainToClass(UpdateUserDto, request.body);

    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    if (request.method !== ReqMethod.DELETE) {
      const errors = await validate(updateUserDto);
      if (errors.length > 0) {
        throw new BadRequestException('Invalid request body');
      }
    }

    const user =
      request.method === ReqMethod.PUT
        ? await this.userRepository.getUserWithPasswordById(id)
        : await this.userRepository.getById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    request.user = user;

    return next.handle().pipe(map((data) => data));
  }
}
