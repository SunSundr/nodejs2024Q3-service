import { UUID } from 'crypto';
import { User } from 'src/users/user.model';
export declare abstract class BaseLibClass {
    readonly id: UUID;
    userId: UUID | null;
    favorite: boolean;
    user: User | null;
    protected constructor(userId?: UUID | null);
    toJSON(): {
        [key: string]: unknown;
    };
}
