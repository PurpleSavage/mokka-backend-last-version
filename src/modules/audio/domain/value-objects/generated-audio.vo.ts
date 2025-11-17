import { IdModelsAudio, ModelsAudio } from "../enums/audio-models";

export class GenerateAudioVO {
  public readonly prompt: string
  public readonly user: string
  public readonly idModel: IdModelsAudio
  public readonly nameModelAudio: ModelsAudio
  public readonly urlAudio: string
  public readonly speed: number
  public readonly stability: number
  public readonly similarity: number
  public readonly exaggeration: number
  public readonly useSpeakerBoost: boolean

  private constructor(data: {
    prompt: string
    user: string
    idModel: IdModelsAudio
    nameModelAudio: ModelsAudio
    urlAudio: string
    speed: number
    stability: number
    similarity: number
    exaggeration: number
    useSpeakerBoost: boolean
  }) {
    this.prompt = data.prompt
    this.user = data.user
    this.idModel = data.idModel
    this.nameModelAudio = data.nameModelAudio
    this.urlAudio = data.urlAudio
    this.speed = data.speed
    this.stability = data.stability
    this.similarity = data.similarity
    this.exaggeration = data.exaggeration
    this.useSpeakerBoost = data.useSpeakerBoost
    
   
  }

  // private validate(): void {
  //   if (!this.prompt) throw new Error('Prompt is required')
  //   if (this.speed < 0 || this.speed > 2) throw new Error('Speed must be between 0 and 2')
  //   // ... más validaciones
  // }

  static create(data: {
    prompt: string
    user: string
    idModel: IdModelsAudio
    nameModelAudio: ModelsAudio
    urlAudio: string
    speed: number
    stability: number
    similarity: number
    exaggeration: number
    useSpeakerBoost: boolean
  }): GenerateAudioVO {
    return new GenerateAudioVO(data)
  }
}