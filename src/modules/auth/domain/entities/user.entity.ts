import { TypeAuth } from "../enums/type-auth";
export class UserEntity {
    public id: string
    public email: string
    public credits:number
    public createDate:Date
    public refreshtoken:string
    public typeAuth:TypeAuth
    public password?:string
    constructor(){}
    setId(id:string){
        this.id=id
        return this
    }
    setEmail(email:string){
        this.email = email
        return this
    }
    setCredits(credits:number){
        this.credits= credits
        return this
    }
    setCreateDate(createDate:Date){
        this.createDate = createDate
        return this
    }
    setRefreshToken(refreshtoken:string){
        this.refreshtoken=refreshtoken
        return this
    }
    setTypeAuth(typeAuth:TypeAuth){
        this.typeAuth=typeAuth
        return this
    }
    setPassword(password:string){
        this.password= password
        return this
    }
    build(): UserEntity{
        return this
    }
}