import { SharedByEntity } from "src/shared/common/domain/entities/shared-by.entity";
import { ImageEntity } from "../../domain/entities/image.entity";
import { SharedImageResponse } from "../dtos/responses/shared-image-response.dto";
import { SharedImageEntity } from "../../domain/entities/shared-image.entity";

export class SharedImageMapper {
  static toResponse(entity: SharedImageEntity): SharedImageResponse {
    const sharedBy = entity.getSharedBy();
    const image = entity.getScene(); // Tu método getter para la imagen

    return {
      id: entity.getId(),
      remixes: entity.getRemixes(),
      downloads: entity.getDownloads(),
      // Mapeo condicional de SharedBy
      sharedBy: sharedBy instanceof SharedByEntity 
        ? { id: sharedBy.id, email: sharedBy.email } 
        : sharedBy,
      // Mapeo condicional de Image
      image: image instanceof ImageEntity 
        ? {
            id: image.getId(),
            prompt: image.getPrompt(),
            imageUrl: image.getImageUrl(),
            createDate: image.getCreateDate().toISOString(), // Convertimos Date a string para JSON
            width: image.getWidth(),
            height: image.getHeight(),
            aspectRatio: image.getAspectRatio(),
            size: image.getSize(),
            style: image.getStyle(),
            subStyle: image.getSubStyle()
          } 
        : image,
    };
  }

  static toResponseList(entities: SharedImageEntity[]): SharedImageResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}