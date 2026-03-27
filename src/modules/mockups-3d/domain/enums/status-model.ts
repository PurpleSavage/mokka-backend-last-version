export const StatusModel={
    ACTIVE:'active',
    INACTIVE:'inactive'
} as const
export type StatusModelType = typeof StatusModel[keyof typeof StatusModel]