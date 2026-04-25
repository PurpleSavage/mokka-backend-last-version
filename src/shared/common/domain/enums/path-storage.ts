
export const PathStorage={
    PATH_IMAGE:'images-generated',
    PATH_INFLUENCER:'influencers-images-generated',
    PATH_IMAGE_REMIXES:'image-remixes',
    PATH_VIDEOS:'videos',
    PATH_INFLUENCERS_SNPASHOTS:'influencer-snapshots',
    PATH_INFLUENCERS_SCENES:'influencers-scenes',
    PATH_MUSIC:'music-generated',
    PATH_AUDIO:'audio-generated'
} as const
export type PathStorageType = typeof PathStorage[keyof typeof PathStorage]