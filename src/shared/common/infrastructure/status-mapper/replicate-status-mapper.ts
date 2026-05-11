import { StatusQueue } from "../enums/status-queue";
import { StatusReplicate, StatusReplicateType } from "../enums/status-replicate";


export const ReplicateToStatusQueue: Record<StatusReplicateType, StatusQueue> = {
    [StatusReplicate.STARTING]: StatusQueue.PROCESSING,
    [StatusReplicate.PROCESSING]: StatusQueue.PROCESSING,
    [StatusReplicate.SUCCEEDED]: StatusQueue.COMPLETED,
    [StatusReplicate.FAILED]: StatusQueue.FAILED,
    [StatusReplicate.CANCELED]: StatusQueue.FAILED,
    [StatusReplicate.ABORTED]: StatusQueue.FAILED,
};