const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
});

const S3_BUCKET = process.env.S3_BUCKET;

if (!S3_BUCKET) {
  console.warn("S3_BUCKET is not defined in environment variables.");
}

module.exports = { s3, S3_BUCKET };