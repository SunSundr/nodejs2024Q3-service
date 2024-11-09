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
import { IUserRepository } from '../../users/repo/users.repo.interface';
import { isUUID, validate } from 'class-validator';
import { UpdateUserDto } from '../../users/dto/dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserByIdInterceptor implements NestInterceptor {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const updateUserDto = plainToClass(UpdateUserDto, request.body);

    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    if (request.method !== 'DELETE') {
      const errors = await validate(updateUserDto);
      if (errors.length > 0) {
        throw new BadRequestException('Invalid request body');
      }
    }

    const user = await this.userRepository.get(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    request.user = user;

    return next.handle().pipe(map((data) => data));
  }
}
