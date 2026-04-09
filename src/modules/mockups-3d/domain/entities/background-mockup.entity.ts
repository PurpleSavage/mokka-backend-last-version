export class BackgroundMockupEntity{
    constructor(
        public readonly id:string,
        public readonly backgroundUrl:string,
        public readonly name:string,
        public readonly createdAt:Date
    ){}
    static create(
        props:{
            id:string,
            backgroundUrl:string,
            name:string,
            createdAt:Date
        }
    ){
        return new BackgroundMockupEntity(
            props.id,
            props.backgroundUrl,
            props.name,
            props.createdAt
        )
    }
}