import { Get, Post, Put, Delete, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { LibService } from './lib.service';
import { LibModels, LibDtos, LibTypes } from '../db/lib.repo.interface';
import { UniversalDTO } from './lib.base.dto';

@ApiBearerAuth()
export abstract class LibBaseController {
  protected readonly owner: LibModels;
  protected readonly dtoClass: { new (): LibDtos };

  constructor(protected readonly libService: LibService) {}

  @Get()
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({ status: HttpStatus.OK })
  async getAll(@Request() req: ExpressRequest): Promise<LibTypes[]> {
    return await this.libService.getAll(this.owner, LibService.getUserId(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entity by ID' })
  @ApiParam({ name: 'id', description: 'Entity ID (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entity found', type: 'LibTypes' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request or ID is invalid (not UUID)',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity with ID not found' })
  async getById(@Request() req: ExpressRequest): Promise<LibTypes> {
    return (await this.libService.requestValidate(req, this.owner, this.dtoClass)).entity;
  }

  @Post()
  @ApiOperation({ summary: 'Create new entity' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Entity successfully created',
    type: UniversalDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request, body is invalid or missing required fields',
  })
  async create(@Request() req: ExpressRequest, @Body() _: UniversalDTO): Promise<LibTypes> {
    const { dto, userId } = await this.libService.requestValidate(req, this.owner, this.dtoClass);
    return await this.libService.create(this.owner, dto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update entity by ID' })
  @ApiParam({ name: 'id', description: 'Entity ID (UUID)', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entity successfully updated',
    type: UniversalDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request or ID is invalid (not UUID)',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity with ID not found' })
  async update(@Request() req: ExpressRequest, @Body() _: UniversalDTO): Promise<LibTypes> {
    const { entity, dto } = await this.libService.requestValidate(req, this.owner, this.dtoClass);
    return await this.libService.update(this.owner, entity, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete entity by ID' })
  @ApiParam({ name: 'id', description: 'Entity ID (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Entity successfully deleted' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request or ID is invalid (not UUID)',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity with ID not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req: ExpressRequest): Promise<void> {
    const { entity } = await this.libService.requestValidate(req, this.owner, this.dtoClass);
    return await this.libService.delete(this.owner, entity);
  }
}
