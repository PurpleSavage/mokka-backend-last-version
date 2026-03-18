import { AspectRatioImage } from "src/shared/common/infrastructure/enums/image-aspect-ratio";
import { TypeStyle } from "../../../domain/enums/image-styles";
import { TypeSubStyle } from "../../../domain/enums/image-substyle";

export interface SharedImageResponse {
  id: string;
  remixes: number;
  downloads: number;
  sharedBy: SharedByResponse | string;
  image: ImageDetailsResponse | string;
}

// Sub-interfaz para los detalles del usuario que compartió
export interface SharedByResponse {
  id: string;
  email: string;
}

// Sub-interfaz con todos los campos de ImageEntity
export interface ImageDetailsResponse {
  id: string;
  prompt: string;
  createDate: string; // ISO String para el Front
  width: number;
  height: number;
  imageUrl: string;
  aspectRatio: AspectRatioImage;
  size: string;
  style: TypeStyle;
  subStyle: TypeSubStyle;
}