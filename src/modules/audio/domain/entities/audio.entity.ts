import { IdModelsAudio, ModelsAudio } from "../enums/audio-models"


export class AudioEntity {
  public id: string
  public idUser: string
  public prompt: string
  public createDate: Date
  public urlAudio: string
  public idModel: IdModelsAudio
  public nameModelAudio: ModelsAudio
  public speed: number
  public stability: number
  public similarity: number
  public exaggeration: number
  public useSpeakerBoost: boolean

  constructor() {}

  setId(id: string) {
    this.id = id
    return this
  }

  setIdUser(idUser: string) {
    this.idUser = idUser
    return this
  }

  setPrompt(prompt: string) {
    this.prompt = prompt
    return this
  }

  setCreateDate(createDate: Date) {
    this.createDate = createDate
    return this
  }

  setUrlAudio(urlAudio: string) {
    this.urlAudio = urlAudio
    return this
  }

  setIdModel(idModel: IdModelsAudio) {
    this.idModel = idModel
    return this
  }

  setNameModelAudio(nameModelAudio: ModelsAudio) {
    this.nameModelAudio = nameModelAudio
    return this
  }

  setSpeed(speed: number) {
    this.speed = speed
    return this
  }

  setStability(stability: number) {
    this.stability = stability
    return this
  }

  setSimilarity(similarity: number) {
    this.similarity = similarity
    return this
  }

  setExaggeration(exaggeration: number) {
    this.exaggeration = exaggeration
    return this
  }

  setUseSpeakerBoost(useSpeakerBoost: boolean) {
    this.useSpeakerBoost = useSpeakerBoost
    return this
  }

  build(): AudioEntity {
    return this
  }
}
