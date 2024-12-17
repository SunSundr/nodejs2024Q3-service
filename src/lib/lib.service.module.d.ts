import { DynamicModule } from '@nestjs/common';
import { LibModels } from 'src/db/lib.repo.interface';
interface LibServiceOptions {
    typeormRepo?: LibModels[];
}
export declare class LibServiceModule {
    private static libRepository;
    static register(options: LibServiceOptions): DynamicModule;
}
export {};
