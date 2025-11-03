import { IdModelsAudio, ModelsAudio } from "../enums/audio-models";

export class GenerateAudioVO {
  public prompt: string
  public user: string
  public idModel: IdModelsAudio
  public nameModelAudio: ModelsAudio
  public urlAudio: string
  public speed: number
  public stability: number
  public similarity: number
  public exaggeration: number
  public useSpeakerBoost: boolean

  constructor() {}

  setPrompt(prompt: string) {
    this.prompt = prompt;
    return this;
  }

  setUser(user: string) {
    this.user = user;
    return this;
  }

  setIdModel(idModel: IdModelsAudio) {
    this.idModel = idModel;
    return this;
  }

  setNameModelAudio(nameModelAudio: ModelsAudio) {
    this.nameModelAudio = nameModelAudio;
    return this;
  }

  setUrlAudio(urlAudio: string) {
    this.urlAudio = urlAudio;
    return this;
  }

  setSpeed(speed: number) {
    this.speed = speed;
    return this;
  }

  setStability(stability: number) {
    this.stability = stability;
    return this;
  }

  setSimilarity(similarity: number) {
    this.similarity = similarity;
    return this;
  }

  setExaggeration(exaggeration: number) {
    this.exaggeration = exaggeration;
    return this;
  }

  setUseSpeakerBoost(useSpeakerBoost: boolean) {
    this.useSpeakerBoost = useSpeakerBoost;
    return this;
  }

  build(): GenerateAudioVO {
    return this;
  }
}
