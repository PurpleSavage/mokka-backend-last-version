export class SharedByDataVO{
    constructor(
        private readonly  id:string,
        private readonly email:string
    ){}
    static create(data:{
        id:string,
        email:string
    }):SharedByDataVO{
        return new SharedByDataVO(
            data.id,
            data.email
        )
    }
}