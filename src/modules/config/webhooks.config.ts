

export function buildUrlWebhook(baseUrl:string){
    return {
        INFLUENCERS:{
            INFLUECER:`${baseUrl}/v1/webhooks/replicate/influencers/influencer`,
            SNAPSHOTS:`${baseUrl}/v1/webhooks/replicate/influencers/snapshots`,
            SCENES:`${baseUrl}/v1/webhooks/replicate/influencers/scenes`
        },
        IMAGES:{
             INFLUECER:`${baseUrl}/v1/webhooks/replicate/influencers/influencer`
        }
    }
}