
export class CreateUserDto {
    fullName: String
    firstName: string; 
    lastName: string;
    identityCard: string;
    birthDate: Date;
    gender: string;
}

export class CreateUserInputDto {
    firstName: string; 
    lastName: string;
    identityCard: string;
    birthDate: Date;
    gender: string;
}