import {  AspectRatioImage } from "../../../../shared/common/infrastructure/enums/image-aspect-ratio"
import { TypeStyle } from "../enums/image-styles"
import { TypeSubStyle } from "../enums/image-substyle"

export class ImageEntity {
  private id: string;
  private prompt: string;
  private createDate: Date;
  private width: number;
  private height: number;
  private imageUrl: string;
  private aspectRatio: AspectRatioImage;
  private size: string;
  private style: TypeStyle;
  private subStyle: TypeSubStyle;

  constructor() {}

  // --- Getters Públicos (Indispensables para el Mapper) ---
  public getId(): string { return this.id; }
  public getPrompt(): string { return this.prompt; }
  public getCreateDate(): Date { return this.createDate; }
  public getWidth(): number { return this.width; }
  public getHeight(): number { return this.height; }
  public getImageUrl(): string { return this.imageUrl; }
  public getAspectRatio(): AspectRatioImage { return this.aspectRatio; }
  public getSize(): string { return this.size; }
  public getStyle(): TypeStyle { return this.style; }
  public getSubStyle(): TypeSubStyle { return this.subStyle; }

  // --- Setters (Fluent Interface) ---
  public setId(id: string): this {
    this.id = id;
    return this;
  }

  public setPrompt(prompt: string): this {
    this.prompt = prompt;
    return this;
  }

  public setCreateDate(createDate: Date): this {
    this.createDate = createDate;
    return this;
  }

  public setWidth(width: number): this {
    this.width = width;
    return this;
  }

  public setHeight(height: number): this {
    this.height = height;
    return this;
  }

  public setImageUrl(imageUrl: string): this {
    this.imageUrl = imageUrl;
    return this;
  }

  public setAspectRatio(aspectRatio: AspectRatioImage): this {
    this.aspectRatio = aspectRatio;
    return this;
  }

  public setSize(size: string): this {
    this.size = size;
    return this;
  }

  public setStyle(style: TypeStyle): this {
    this.style = style;
    return this;
  }

  public setSubStyle(subStyle: TypeSubStyle): this {
    this.subStyle = subStyle;
    return this;
  }

  public build(): ImageEntity {
    // Aquí podrías añadir validaciones antes de retornar
    // ej. if(!this.imageUrl) throw new Error("Image URL is required");
    return this;
  }
}