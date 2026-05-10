import { StatusQueue, StatusReplicate, StatusReplicateType } from "../enums/status-queue";

export const ReplicateToStatusQueue: Record<StatusReplicateType, StatusQueue> = {
    [StatusReplicate.STARTING]: StatusQueue.PROCESSING,
    [StatusReplicate.PROCESSING]: StatusQueue.PROCESSING,
    [StatusReplicate.SUCCEEDED]: StatusQueue.COMPLETED,
    [StatusReplicate.FAILED]: StatusQueue.FAILED,
    [StatusReplicate.CANCELED]: StatusQueue.FAILED,
    [StatusReplicate.ABORTED]: StatusQueue.FAILED,
};