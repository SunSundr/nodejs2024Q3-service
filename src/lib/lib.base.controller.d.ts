import { Request as ExpressRequest } from 'express';
import { LibService } from './lib.service';
import { LibModels, LibDtos, LibTypes } from '../db/lib.repo.interface';
import { UniversalDTO } from './lib.base.dto';
export declare abstract class LibBaseController {
    protected readonly libService: LibService;
    protected readonly owner: LibModels;
    protected readonly dtoClass: {
        new (): LibDtos;
    };
    constructor(libService: LibService);
    getAll(req: ExpressRequest): Promise<LibTypes[]>;
    getById(req: ExpressRequest): Promise<LibTypes>;
    create(req: ExpressRequest, _: UniversalDTO): Promise<LibTypes>;
    update(req: ExpressRequest, _: UniversalDTO): Promise<LibTypes>;
    delete(req: ExpressRequest): Promise<void>;
}
