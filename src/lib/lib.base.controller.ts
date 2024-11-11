import {
  Get,
  Post,
  Put,
  Delete,
  Request,
  NotFoundException,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { plainToClass } from 'class-transformer';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { LibService } from './lib.service';
import { isUUID, validate, ValidationError } from 'class-validator';
import { LibModels, LibDtos, LibTypes } from '../db/lib.repo.interface';

interface ValidateResult {
  entity: LibTypes | null;
  dto?: LibDtos;
  errors?: ValidationError[];
}

export abstract class LibBaseController {
  protected readonly owner: LibModels;
  protected readonly dtoClass: { new (): LibDtos };

  constructor(protected readonly libService: LibService) {}

  protected async requestValidate(req: ExpressRequest): Promise<ValidateResult> {
    const { id } = req.params as { id: UUID };

    if (req.method !== 'POST' && !isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    let dto: LibDtos | undefined;

    if (req.method !== 'DELETE' && req.method !== 'GET') {
      dto = plainToClass(this.dtoClass, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'Validation failed',
          errors: errors.map((error: ValidationError) => {
            const children = error.children || {};
            return {
              property: error.property,
              constraints: error.constraints,
              ...children,
            };
          }),
        });
      }
    }

    let entity: LibTypes | null;

    if (req.method !== 'POST') {
      entity = await this.libService.getById(this.owner, id);

      if (!entity) {
        throw new NotFoundException(`Entity with id ${id} not found`);
      }
    } else {
      entity = null;
    }

    return { entity, dto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({ status: HttpStatus.OK })
  async getAll(): Promise<LibTypes[]> {
    return await this.libService.getAll(this.owner);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entity by ID' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request or ID is invalid (not uuid)',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found entity with ID' })
  async getById(@Request() req: ExpressRequest): Promise<LibTypes> {
    return (await this.requestValidate(req)).entity;
  }

  @Post()
  @ApiOperation({ summary: 'Create new entity' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request, body is invalid',
  })
  async create(@Request() req: ExpressRequest): Promise<LibTypes> {
    const { dto } = await this.requestValidate(req);
    return await this.libService.create(this.owner, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update entity' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request or ID is invalid (not uuid)',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found entity with ID' })
  async update(@Request() req: ExpressRequest): Promise<LibTypes> {
    const { entity, dto } = await this.requestValidate(req);
    if (!dto) throw new BadRequestException('Body is invalid');
    return await this.libService.update(this.owner, entity, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete entity' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request or ID is invalid (not uuid)',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found entity with ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req: ExpressRequest): Promise<void> {
    const { entity } = await this.requestValidate(req);
    return this.libService.delete(this.owner, entity);
  }
}
