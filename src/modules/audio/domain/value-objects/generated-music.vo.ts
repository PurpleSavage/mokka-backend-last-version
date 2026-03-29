export class GeneratedMusicVO {
    private constructor(
        public readonly user: string,
        public readonly prompt: string,
        public readonly bpm: number,
        public readonly genre: string,
        public readonly durationMs: number,
        public readonly forceInstrumental: boolean = true,
        public readonly songUrl: string,
    ) {
        // Validaciones de integridad (Domain Rules)
        if (!user || user.trim().length === 0) throw new Error('User identifier is required');
        if (bpm < 90 || bpm > 220) throw new Error('BPM must be between 40 and 220');
        if (durationMs <= 300000) throw new Error('Duration must be at least 3 min');
    }
    static create(data: {
        user: string;
        prompt: string;
        bpm: number;
        genre: string;
        durationMs: number;
        forceInstrumental?: boolean;
        songUrl:string
    }): GeneratedMusicVO {
        return new GeneratedMusicVO(
            data.user,
            data.prompt,
            data.bpm,
            data.genre,
            data.durationMs,
            data.forceInstrumental,
            data.songUrl
        );
    }
}