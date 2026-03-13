export const JobsNotificationsType = {
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    TEXT: 'text',
    IMAGE_REMIX: 'image-remix',
    INFLUENCER: 'influencer',
    INFLUENCER_SNAPSHOT: 'influencer-snapshot',
    INFLUENCER_SCENE: 'influencer-scene'
} as const;

export type JobsNotificationsType = typeof JobsNotificationsType[keyof typeof JobsNotificationsType]