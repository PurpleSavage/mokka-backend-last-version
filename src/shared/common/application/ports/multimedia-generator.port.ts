
export abstract class MultimediaGeneratorPort{
   abstract createVideo(aspectRatio: string,prompt:string,audio:boolean,referenceImages?:string[]):Promise<string>
   abstract generateImage(config:{
        aspectRatio: string, 
        prompt: string,
        urls?:string[],
    }):Promise<string>
}