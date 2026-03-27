import { ModelNodeDataResponseDto } from "../../application/dtos/responses/model-node.dto";
import { StatusModel, StatusModelType } from "../enums/status-model";
import { ModelNodeEntity } from "./model-node.entity";

export class Model3DEntity {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly name: string,
    public readonly category: string,
    public readonly status: StatusModelType,
    public readonly model_url: string,
    public readonly thumbnail_url: string,
    public readonly camera_settings: {
      position: number[];
      target: number[];
      fov: number;
    },
    public readonly nodes: ModelNodeEntity[],
    public readonly createdAt: Date
  ) {}

  static create(data: {
    id: string;
    slug: string;
    name: string;
    category: string;
    status?: StatusModelType;
    model_url: string;
    thumbnail_url: string;
    camera_settings: { position: number[]; target: number[]; fov: number };
    nodes: ModelNodeDataResponseDto[]; 
    createdAt:Date;
  }): Model3DEntity {

    const nodeEntities = data.nodes.map((node) => ModelNodeEntity.create(node));

    return new Model3DEntity(
      data.id,
      data.slug,
      data.name,
      data.category,
      data.status ?? StatusModel.ACTIVE,
      data.model_url,
      data.thumbnail_url,
      data.camera_settings,
      nodeEntities,
      data.createdAt ?? new Date() 
    );
  }
}