# 🛒 Vitto's Market Place

A modern full-stack marketplace which allows users to publish products and interact with each other. This project integrated advanced AWS services to enhance security and scalability.

## 🚀 Live Demo
https://vitto-s-market-place.vercel.app/

## 🛠️ Tech Stack
- FRONTEND: HTML5, Tailwind CSS, Javascript(ES6+).
- BACKEND: Node.js, TypeScript, Express.js, AWS Lambda (Serverless Framework).
- DATABASE: MySQL (managed through Sequelize ORM).
- AWS (CLOUD) SERVICES: S3, SES, Polly, Rekognition, CloudWatch, IAM.
- HOST SERVICE: Vercel.

## ✨ Main Features
- Secure Authentication: JWT management, password hashing through bcrypt and password reset via email.
- AI Moderation: Each image is scanned by AWS Rekognition to avoid the upload of inappropriate content.
- Products management: CRUD (Create, Read, Update, Delete) enabled for authenticated users.
- User Experience: Responsive UI with immediate feedback through toast.
- Improved UI by enabling users to listen in real time to a product's description thanks to AWS Polly.
- Stripe integration to enable test payments.


## ⚠️ Technical Notes and Boundaries (Sandbox environment)

Due to management costs and security related to the usage of AWS accounts, please note that:

**1. Email (AWS SES Sandbox)**: Email sending system is in Sandbox mode. Consequently, emails (login, signup, reset password) can be sent **only to verified addresses**. If you'd like to test this feature, please contact me at vittobervr@gmail.com so that I can add your email to the whitelist.
**2. Chat system (Weksocket)**: The chat between you and another user can be accessed via "Chat" button in the UI. However, Lambda is stateless, therefore does not natively support persistent WebSocke connections. Anyways, you can take at look a the code if you wish.
**3. S3** The uploaded images reside in S3, but get automatically eliminated from it whenever the product get deleted by the owner.
**4. Performance (Cold Starts):** Due to the serverless nature of the backend (AWS Lambda), the first request after a period of inactivity may take a few seconds to process as the function initializes. This is a standard behavior of the AWS Free Tier.
