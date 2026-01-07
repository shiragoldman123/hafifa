import { User } from "./user.types";

export type Account = {
    _id: string;
    identifier: string;
    source: string;
    email: string;
    user: string
}

export type CreateAccountInput = Omit<Account, '_id'>

export type PopulatedAccount = Account & {
    user: User;
}