import { User } from "./user.types";

export type Account = {
    identifier: string;
    source: string;
    email: string;
}

export type PopulatedAccount = Account & {
    user: User;
}