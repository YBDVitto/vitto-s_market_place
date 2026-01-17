import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { env } from '../env.js';
const polly = new PollyClient({
    region: env.AWS_S3_REGION,
    credentials: {
        accessKeyId: env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: env.MY_AWS_SECRET_ACCESS_KEY
    }
});
export const synthetizeSpeech = async (descriptionText, voiceId) => {
    const command = new SynthesizeSpeechCommand({
        OutputFormat: 'mp3',
        Text: descriptionText,
        VoiceId: voiceId
    });
    const response = await polly.send(command);
    if (!response.AudioStream) {
        throw new Error('Error while getting the mp3 from Polly.');
    }
    if (response.AudioStream instanceof Buffer) {
        return response.AudioStream;
    }
    const chunks = [];
    for await (const chunk of response.AudioStream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
};
