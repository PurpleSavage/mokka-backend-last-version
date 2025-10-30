import { UserEntity } from "../../domain/entities/user.entity";

export abstract class AuthPort{
    abstract findUserByEmail(email:string):Promise<UserEntity | null>
}