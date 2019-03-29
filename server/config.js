module.exports = {
    site_url: process.env.SITE_URL,
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD,
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION,
        bucketName: process.env.S3_BUCKET
    },
    mongodb: {
        uri: process.env.MONGODB_URI
    },
    pagination: {
        no_of_items: 12
    }
};