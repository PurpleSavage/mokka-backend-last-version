import { InfluencerEntity } from "../../domain/entities/influecer.entity";
import { InfluencerResponse } from "../dtos/request/influencer-response.dto";

export class InfluencerMapper {
  static toResponse(entity: InfluencerEntity): InfluencerResponse {
    return {
      id: entity.getId(),
      name: entity.getName(),
      ageRange: entity.getAgeRange(),
      gender: entity.getGender(),
      bodyShape: entity.getBodyShape(),
      skinColor: entity.getSkinColor(),
      eyeColor: entity.getEyeColor(),
      hairType: entity.getHairType(),
      faceType: entity.getFaceType(),
      country: entity.getCountry(),
      lipsType: entity.getLipsType(),
      hairColor: entity.getHairColor(),
      height: entity.getHeight(),
      influencerUrlImage: entity.getInfluencerUrlImage(),
      // Usamos getCreteDate (ojo con el typo en tu entidad, lo mantuve igual)
      createDate: entity.getCreteDate() ,
      sizeImage: entity.getSizeImage(),
    };
  }

  static toResponseList(entities: InfluencerEntity[]): InfluencerResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}