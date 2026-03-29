export class MusicEntity {
    constructor(
        public readonly id: string,
        public readonly prompt: string, // Corregido el typo 'pormpt'
        public readonly songUrl: string,
        public readonly createDate: Date,
        public readonly bpm: number,
        public readonly genreMusic: string,
        public readonly durationMs: number, // Usar ms es el estándar de ElevenLabs
    ) {}

    /**
     * Factory Method: Útil para crear la entidad desde una respuesta de API 
     * o desde el Persistence Mapper.
     */
    static create(data: {
        id: string;
        prompt: string;
        songUrl: string;
        createDate: string | Date;
        bpm: number;
        genreMusic: string;
        durationMs: number;
    }): MusicEntity {
        return new MusicEntity(
            data.id,
            data.prompt,
            data.songUrl,
            typeof data.createDate === 'string' ? new Date(data.createDate) : data.createDate,
            data.bpm,
            data.genreMusic,
            data.durationMs
        );
    }
}