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
    public readonly modelUrl: string,
    public readonly thumbnailUrl: string,
    public readonly cameraSettings: {
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
    modelUrl: string;
    thumbnailUrl: string;
    cameraSettings: { position: number[]; target: number[]; fov: number };
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
      data.modelUrl,
      data.thumbnailUrl,
      data.cameraSettings,
      nodeEntities,
      data.createdAt ?? new Date() 
    );
  }
}