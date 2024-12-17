import { Request as ExpressRequest } from 'express';
import { ValidationError } from 'class-validator';
import { UUID } from 'crypto';
import { LibNames } from '../db/lib.repo.interface';
import { ILibRepository, FavoritesJSON } from '../db/lib.repo.interface';
import { LibModels, LibDtos, LibTypes } from '../db/lib.repo.interface';
export interface ValidateResult {
    entity: LibTypes | null;
    dto?: LibDtos;
    errors?: ValidationError[];
    userId: UUID | null;
}
export declare class LibService {
    private readonly libRepository;
    constructor(libRepository: ILibRepository);
    static callByOwner(owner: LibModels, func: (..._: unknown[]) => LibTypes | void, dto: LibDtos, ...args: unknown[]): void | LibTypes;
    static typeNameByOwner(owner: LibModels): LibNames;
    static getUserId(req: ExpressRequest): UUID | null;
    requestValidate(req: ExpressRequest, owner: LibModels, dtoClass: {
        new (): LibDtos;
    }): Promise<ValidateResult>;
    create(owner: LibModels, createDto: LibDtos, userID: UUID): Promise<LibTypes | null>;
    update(owner: LibModels, obj: LibTypes, updateDto: LibDtos | undefined): Promise<LibTypes>;
    getAll(owner: LibModels, userID: UUID | null): Promise<LibTypes[]>;
    getById(owner: LibModels, id: UUID, userID: UUID | null): Promise<LibTypes | null>;
    delete(owner: LibModels, obj: LibTypes): Promise<void>;
    setFavorite(owner: LibModels, id: UUID, status: boolean, userId: UUID | null): Promise<LibTypes | null>;
    getAllFavs(userId: UUID | null): Promise<FavoritesJSON>;
}
