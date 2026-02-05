import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { StorageRepository } from "src/shared/domain/repositories/storage.repository"
import { createClient} from "@supabase/supabase-js";
import { ConfigService } from "@nestjs/config";
import { SupabaseImageResponse, SupabaseResponse, SupabaseVideoResponse } from "src/shared/domain/types/supabase-types";
import { PathStorage } from "src/shared/domain/enums/path-storage";
@Injectable()
export class StorageService implements StorageRepository{
    private clientSupabase:ReturnType<typeof createClient>
    
    constructor(private configService: ConfigService){
        const supabaseUrl= this.configService.get<string>('SUPABASE_URL')!
        const apiKey= this.configService.get<string>('SUPABASE_API_KEY')!
        this.clientSupabase = createClient(supabaseUrl,apiKey)
    }

    private generateId(){
        const random = Math.random().toString(32).substring(2)
        const fecha = Date.now().toString(32)
        return random + fecha

    }
    private calculateSizeFile(bytes:number){
        if(bytes===0) return '0 Bytes'

        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']

        // Calcular qué unidad usar
        const i = Math.floor(Math.log(bytes) / Math.log(k))

        // Calcular el valor en la unidad correspondiente
        const size = bytes / Math.pow(k, i)

         const formattedSize = i === 0 ? size.toString() : size.toFixed(2);
        
        return `${formattedSize} ${sizes[i]}`

    }
    async saveAudio(idUser: string, buffer: Buffer<ArrayBuffer>): Promise<SupabaseResponse> {
        const filename =`${idUser}-${this.generateId()}`
        const filePath = `audios-generated/${filename}`
        const {error} = await this.clientSupabase.storage
        .from('mokkaaudios')
        .upload(filePath,buffer,{
            contentType: 'audio/mpeg',
            cacheControl: '3600',
            upsert: true //  reemplazar el archivo si ya existe
        })
       
        if (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while saving  the audio, please try again later.',
                errorType:'Storage_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR) 
        }
        const {data } = this.clientSupabase.storage
        .from('mokkaaudios')
        .getPublicUrl(filePath)
        if(!data) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while retrieving the audio, please try again later.',
                errorType:'Storage_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR) 
        }
        return {
            url:data?.publicUrl,
        }
    }
    
    async saveImage(bufferImage:Buffer<ArrayBufferLike>,userId:string,path:PathStorage):Promise<SupabaseImageResponse>{
        
        const filename = `${userId}-${this.generateId()}.png`

        const size = this.calculateSizeFile(bufferImage.length)

        const filePath = `${path}/${filename}`

        const {error} = await this.clientSupabase.storage
        .from('mokkastorage')
        .upload(filePath,bufferImage,{
            contentType:'image/png',
            cacheControl: '3600',
            upsert: true
        })
        
        if (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while saving the image, please try again later.',
                errorType:'Storage_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR)  // Lanza el error si ocurre un fallo
        }

        const {data } = this.clientSupabase.storage
        .from('mokkastorage')
        .getPublicUrl(filePath)
        if(!data) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while retrieving the image, please try again later.',
                errorType:'Storage_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR) 
        }
        return {
            url:data?.publicUrl,
            size
        }
    }
    async saveVideo(idUser: string, bufferVideo: Buffer<ArrayBuffer>,path:PathStorage): Promise<SupabaseVideoResponse> {
        const filename = `${idUser}-${this.generateId()}.mp4`
        const filePath = `${path}/${filename}`
        const {error} = await this.clientSupabase.storage
        .from('mokkastorage')
        .upload(filePath,bufferVideo,{
            contentType:'video/mp4',
            cacheControl: '3600',
            upsert: true
        })
        if (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while saving video, please try again later.',
                errorType:'Storage_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR) 
        }

        const {data} = this.clientSupabase.storage
        .from('mokkastorage')
        .getPublicUrl(filePath)
        if(!data) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while retrieving the video, please try again later.',
                errorType:'Storage_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR) 
        }

        return {
            url:data.publicUrl,
        }
    }
}