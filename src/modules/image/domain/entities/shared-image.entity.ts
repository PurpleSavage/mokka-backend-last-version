
import { ImageEntity } from "./image.entity"
import { SharedByEntity } from "./shared-by.entity"

export class SharedImageEntity{
    public id: string               
    public remixes: number
    public downloads: number           
    public image: ImageEntity | string     
    public sharedBy: SharedByEntity | string
    constructor(){}

    setId(id:string){   
        this.id = id
        return this
    }
    setRemixes(remixes:number){
        this.remixes = remixes
        return this
    }
    setDownloads(downloads:number){
        this.downloads=downloads
        return this
    }
    setImage(image:ImageEntity){
        this.image = image
        return this
    }
    setSharedBy(sharedBy:SharedByEntity){
        this.sharedBy=sharedBy
        return this
    }
    build(){
        return this
    }
}