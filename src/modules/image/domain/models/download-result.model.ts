
export class UpdateDownloadsResultDomainModel{
    public downloads:number
    public imageId:string
    constructor(){}
    setDownloads(downloads:number){
        this.downloads= downloads
        return this
    }
    setImageId(imageId:string){
        this.imageId = imageId
        return this
    }
    build(){
        return this
    }
}