export class ModelNodeEntity {
  constructor(
    public readonly id: string,
    public readonly nameMesh: string,
    public readonly label: string,
    public readonly isEditable: boolean,
    public readonly materialDefault: string,
    public readonly transform: {
      position: number[];
      rotation: number[];
      scale: number[];
    },
    public readonly decalConfig?: {
      standardPosition: number[];
      maxScale: number[];
      aspectRatio: string;
    },
  ) {}
  static create(data: {
    id: string;
    nameMesh: string;
    label: string;
    isEditable: boolean;
    materialDefault: string;
    transform: { 
        position: number[]; 
        rotation: number[]; 
        scale: number[] 
    };
    decalConfig?: {
      standardPosition: number[];
      maxScale: number[];
      aspectRatio: string;
    };
  }): ModelNodeEntity {
    return new ModelNodeEntity(
      data.id,
      data.nameMesh,
      data.label,
      data.isEditable ,
      data.materialDefault,
      data.transform,
      data.decalConfig,
    );
  }
}
