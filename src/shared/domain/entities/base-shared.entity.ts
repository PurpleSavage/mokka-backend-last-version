import { SharedByEntity } from "src/shared/domain/entities/shared-by.entity";

export abstract class BaseSharedEntity {
    protected id: string;
    protected remixes: number;
    protected downloads: number;
    protected sharedBy: SharedByEntity | string;

    // Getters comunes
    public getId(): string { return this.id; }
    public getRemixes(): number { return this.remixes; }
    public getDownloads(): number { return this.downloads; }
    public getSharedBy(): SharedByEntity | string { return this.sharedBy; }

    // Setters comunes (Fluent)
    public setId(id: string): this { this.id = id; return this; }
    public setRemixes(remixes: number): this { this.remixes = remixes; return this; }
    public setDownloads(downloads: number): this { this.downloads = downloads; return this; }
    public setSharedBy(sharedBy: SharedByEntity | string): this { this.sharedBy = sharedBy; return this; }
    
    public build(): this { return this; }
}