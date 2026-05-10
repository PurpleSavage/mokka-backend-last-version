export const StatusReplicate={
    STARTING : 'starting',
    PROCESSING : 'processing',
    SUCCEEDED : 'succeeded',
    FAILED : 'failed',
    CANCELED : 'canceled',
    ABORTED : 'aborted',
} as const


export type StatusReplicateType = typeof StatusReplicate[keyof typeof StatusReplicate]