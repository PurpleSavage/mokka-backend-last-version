export class SharedByEntity{
    private id:string
    private email:string
    constructor(){}
    setId(id:string){
        this.id = id
        return this
    }
    setEmail(email:string){
        this.email=email
        return this
    }
    getId(){
        return this.id
    }
    getEmail(){
        return this.email
    }
    build(){
        return this
    }
}