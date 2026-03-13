export class SharedByEntity{
    public id:string
    public email:string
    constructor(){}
    setId(id:string){
        this.id = id
        return this
    }
    setEmail(email:string){
        this.email=email
        return this
    }
    build(){
        return this
    }
}