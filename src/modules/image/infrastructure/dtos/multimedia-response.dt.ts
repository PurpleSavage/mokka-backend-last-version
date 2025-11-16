
export interface MultimediaResponseDto<T=any>{
    id:string,
    model:string,
    version:string,
    input:{
        text:string
    },
    logs:string,
    output:null | T,
    error:string,
    status:'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
    created_at: string;
    /** Indica si los datos de salida fueron eliminados */
    data_removed: boolean;

    /** Timestamp de inicio de procesamiento (ISO 8601) */
    started_at: string | null;

    /** Timestamp de finalización (ISO 8601) */
    completed_at: string | null;

    /** Métricas de rendimiento */
    metrics?: {
        /** Tiempo de predicción en segundos */
        predict_time: number;
    };

    /** URLs de la API para interactuar con esta predicción */
    urls: {
        /** URL para cancelar la predicción */
        cancel: string;
        /** URL para obtener el estado actual */
        get: string;
    };
}