export interface ModelNodeDataResponseDto {
  id: string;
  name_mesh: string;
  label: string;
  isEditable: boolean;
  materialDefault: string;
  transform: { position: number[]; rotation: number[]; scale: number[] };
  decalConfig?: { standardPosition: number[]; maxScale: number[]; aspectRatio: string };
}