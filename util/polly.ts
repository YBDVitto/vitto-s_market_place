import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly'
import { env } from '../env.js'

const polly = new PollyClient({
    region: env.AWS_S3_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
    }
})

export const synthetizeSpeech = async (descriptionText: string, voiceId: any): Promise<Buffer> => {
    const command = new SynthesizeSpeechCommand({
        OutputFormat: 'mp3',
        Text: descriptionText,
        VoiceId: voiceId
    })

    const response = await polly.send(command)
    if(!response.AudioStream) {
        throw new Error('Error while getting the mp3 from Polly.')
    }
    if(response.AudioStream instanceof Buffer) {
        return response.AudioStream
    }
    const chunks: Buffer[] = []
    for await (const chunk of response.AudioStream as any) {
        chunks.push(chunk)
    }
    return Buffer.concat(chunks)

}