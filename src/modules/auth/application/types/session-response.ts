export interface Session{
    access_token:string,
    user:{
        email:string,
        id:string,
        credits:number,
        createDate:Date,
        refresh_token:string
    }
}