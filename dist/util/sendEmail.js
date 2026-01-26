import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { env } from '../env.js';
const enviroment = env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://vitto-s-market-place.vercel.app/';
const SES_CONFIG = {
    region: env.AWS_SES_REGION,
    credentials: {
        accessKeyId: env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: env.MY_AWS_SECRET_ACCESS_KEY,
    },
};
const AWS_SES = new SESClient(SES_CONFIG);
export const sendEmail = async (recipientEmail, name, type, token = '') => {
    let subject = '';
    let text = '';
    let data = '';
    const htmlSignup = `
                    <div style="font-family:Arial,sans-serif; background-color:#f7f7f7; padding:20px;">
                    <table align="center" width="600" style="background:#ffffff; border-radius:8px; padding:30px;">
                    <tr>
                        <td style="text-align:center;">
                        <h2 style="color:#4CAF50;">Benvenuto su MyApp, ${name}!</h2>
                        <p style="font-size:16px; color:#333333;">
                            Grazie per esserti registrato. Siamo felici di averti con noi!
                        </p>
                        <p style="font-size:14px; color:#777;">
                            Inizia subito a vendere o acquistare nuovi prodotti sulla nostra piattaforma.
                        </p>
                        <div style="margin-top:30px;">
                            <a href="${enviroment}" 
                            style="background:#4CAF50; color:#fff; padding:12px 20px; text-decoration:none; border-radius:4px; font-size:16px;">
                            Vai al Login
                            </a>
                        </div>
                        </td>
                    </tr>
                    </table>
                </div>
    `;
    const htmlLogin = `
        <div style="font-family:Arial,sans-serif; background-color:#f7f7f7; padding:20px;">
                <table align="center" width="600" style="background:#ffffff; border-radius:8px; padding:30px;">
                    <tr>
                        <td style="text-align:center;">
                        <h2 style="color:#2196F3;">Bentornato, ${name}!</h2>
                        <p style="font-size:16px; color:#333333;">
                            Hai effettuato l’accesso al tuo account con successo.
                        </p>
                        <p style="font-size:14px; color:#777;">
                            Scopri le novità e i prodotti più recenti in vendita sulla piattaforma!
                        </p>
                        <div style="margin-top:30px;">
                            
                            style="background:#2196F3; color:#fff; padding:12px 20px; text-decoration:none; border-radius:4px; font-size:16px;">
                            Vai al tuo profilo
                            </a>
                        </div>
                        </td>
                    </tr>
                </table>
        </div>
    `;
    const htmlReset = `
        <div style="font-family:Arial,sans-serif; background-color:#f7f7f7; padding:20px;">
                <table align="center" width="600" style="background:#ffffff; border-radius:8px; padding:30px;">
                    <tr>
                        <td style="text-align:center;">
                        <h2 style="color:#2196F3;">Hey, ${name}!</h2>
                        <p style="font-size:16px; color:#333333;">
                            Here is your reset procedure.
                        </p>
                        <p style="font-size:14px; color:#777;">
                            If you did not request a password reset, please ignore this email.
                        </p>
                        <p>Click this <a href="${enviroment}/html/auth/new-password.html?token=${token}">link</a> to create a new password.</p>
                        </td>
                    </tr>
                </table>
        </div>
    `;
    switch (type) {
        case 'signup':
            subject = 'Welcome to the app';
            text = `Hello ${name},\n\nThank you for completing the registration`;
            data = htmlSignup;
            break;
        case 'login':
            subject = 'Welcome back to my app!';
            text = `Hello ${name},\n\nIt's been quite some time!`;
            data = htmlLogin;
            break;
        case 'reset':
            subject = 'You can now reset your password';
            text = 'In case of any doubt, please contact us at vittobervr@gmail.com';
            data = htmlReset;
            break;
    }
    const params = {
        Source: env.VERIFIED_EMAIL,
        Destination: {
            ToAddresses: [recipientEmail],
        },
        Message: {
            Subject: { Data: subject },
            Body: {
                Text: { Data: text },
                Html: { Data: data },
            },
        },
    };
    try {
        const command = new SendEmailCommand(params);
        const result = await AWS_SES.send(command);
        console.log('Email sent:', result.MessageId);
    }
    catch (err) {
        console.log(env.MY_AWS_ACCESS_KEY_ID);
        console.log(env.AWS_S3_REGION);
        console.error('Email sending failed:', err.message);
    }
};
