import { UserEntity } from "../entities/user.entity";

export abstract class AuthRepository{
    abstract createAccount(email:string,password:string):Promise<UserEntity>
    abstract googleAuthCreateAccount(email:string):Promise<UserEntity>
}