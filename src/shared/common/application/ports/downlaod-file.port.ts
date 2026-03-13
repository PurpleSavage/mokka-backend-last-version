export abstract class DownloadFilePort{
    abstract downloadUrl(url: string): Promise<Buffer>
}