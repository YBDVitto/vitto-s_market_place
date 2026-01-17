import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { RekognitionClient, DetectModerationLabelsCommand } from '@aws-sdk/client-rekognition';
import { env } from '../env.js';
import { Upload } from '@aws-sdk/lib-storage';
// ricordati che su AWS la password dello user creato per s3 è
// portfolio_project_user_s3
const rekognition = new RekognitionClient({
    region: env.AWS_S3_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_S3,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY_S3,
    },
});
const s3 = new S3Client({
    region: env.AWS_S3_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_S3,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY_S3,
    },
});
export const uploadToS3 = async (fileBuffer, filename, mimetype) => {
    // : Promise<string> serve per dire a typescript il tipo di valore che verrà ritornato
    const Key = `${Date.now()}_${filename}`;
    const upload = new Upload({
        client: s3,
        params: {
            Bucket: env.AWS_S3_BUCKET_NAME,
            Key,
            Body: fileBuffer,
            ContentType: mimetype
        }
    });
    await upload.done();
    const fileUrl = `https://${'portfolio-project-a'}.s3.${env.AWS_S3_REGION}.amazonaws.com/${Key}`;
    const params = {
        Image: {
            S3Object: {
                Bucket: env.AWS_S3_BUCKET_NAME,
                Name: Key
            }
        },
        MinConfidence: 80
    };
    const command = new DetectModerationLabelsCommand(params);
    const moderation = await rekognition.send(command);
    const labels = moderation.ModerationLabels;
    if (labels && labels.length > 0) {
        await deleteFromS3(fileUrl);
        return null;
    }
    return fileUrl;
};
export const deleteFromS3 = async (fileUrl) => {
    try {
        const bucketName = env.AWS_S3_BUCKET_NAME;
        const Key = fileUrl.split(".amazonaws.com/")[1];
        if (!Key) {
            throw new Error("Could not extract key from file URL");
        }
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: Key
        });
        await s3.send(command);
        console.log(`Deleted the file ${Key} from S3`);
    }
    catch (err) {
        console.log(err);
    }
};
