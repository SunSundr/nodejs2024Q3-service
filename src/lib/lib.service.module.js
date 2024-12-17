"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LibServiceModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibServiceModule = void 0;
const common_1 = require("@nestjs/common");
const lib_service_1 = require("./lib.service");
const lib_repo_1 = require("../db/lib.repo");
const typeorm_1 = require("@nestjs/typeorm");
const user_model_1 = require("../users/user.model");
const lib_repo_typeORM_1 = require("../db/lib.repo.typeORM");
const validate_env_1 = require("../common/utils/validate.env");
let LibServiceModule = LibServiceModule_1 = class LibServiceModule {
    static register(options) {
        var _a;
        const imports = [];
        const providers = [lib_service_1.LibService];
        const ormType = process.env.ORM_TYPE;
        if (ormType === validate_env_1.OrmTypes.MEMORY) {
            providers.push({
                provide: 'ILibRepository',
                useFactory: () => this.libRepository || (this.libRepository = new lib_repo_1.LibInMemoryRepository()),
            });
        }
        else if (ormType === validate_env_1.OrmTypes.TYPEORM) {
            const typeormRepo = (_a = options.typeormRepo) !== null && _a !== void 0 ? _a : [];
            imports.push(typeorm_1.TypeOrmModule.forFeature([user_model_1.User, ...typeormRepo]));
            providers.push({ provide: 'ILibRepository', useClass: lib_repo_typeORM_1.LibTypeOrmRepository });
        }
        else {
            throw new Error(`Unsupported ORM_TYPE: ${ormType}`);
        }
        return {
            module: LibServiceModule_1,
            imports,
            providers,
            exports: [lib_service_1.LibService],
        };
    }
};
exports.LibServiceModule = LibServiceModule;
exports.LibServiceModule = LibServiceModule = LibServiceModule_1 = __decorate([
    (0, common_1.Module)({})
], LibServiceModule);
//# sourceMappingURL=lib.service.module.js.map