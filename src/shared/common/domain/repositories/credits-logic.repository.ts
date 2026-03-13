export abstract class CreditLogicRepository{
    abstract updateCredits(credits:number,userId:string):Promise<number>
    abstract decreaseCredits(credits:number,userId:string):Promise<number>
    abstract increaseCredits(credits:number,userId:string):Promise<number>
}