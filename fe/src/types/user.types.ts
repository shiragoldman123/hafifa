import { Account } from "./account.types";

export enum Gender {
    FEMALE = "female",
    MALE = "male"
}

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  identityCard: string;
  birthDate: Date;
  gender: Gender;
  fullName: string;
};

export type Paginated<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PopulatedUser = User & {
    accounts: Account[];
}

export type CreateInputUser = Omit<User, 'fullName' | '_id'>