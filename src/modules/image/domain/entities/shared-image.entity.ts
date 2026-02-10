
import { BaseSharedEntity } from "src/shared/domain/entities/base-shared.entity";
import { ImageEntity } from "./image.entity"


export class SharedImageEntity extends BaseSharedEntity{
        
    public image: ImageEntity | string     

   
public getScene(): ImageEntity | string { return this.image; }
    
    public setImage(image:ImageEntity| string){
        this.image = image
        return this
    }
    
}