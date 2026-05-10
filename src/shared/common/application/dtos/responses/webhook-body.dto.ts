import { StatusReplicateType } from "src/shared/common/infrastructure/enums/status-replicate"


export interface WebhookBodyResponseDto{
    id:string
    version:string
    input:Record<string, unknown>
    output:string[] | null
    error: string | null
    logs: string | null
    status:StatusReplicateType
    created_at: string
    started_at: string | null
    completed_at: string | null
    metrics?: {
        predict_time?: number
    };
}