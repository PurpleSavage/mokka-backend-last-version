
export abstract class MultimediaGeneratorPort{
   abstract createVideo(aspectRatio: string,prompt:string):Promise<string>
   abstract createImage(aspectRatio: string, prompt: string):Promise<string>
}