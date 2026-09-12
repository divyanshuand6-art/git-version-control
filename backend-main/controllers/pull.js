const fs = require("fs").promises;
const path = require("path");

const {
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");

  try {
    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: "commits/",
      })
    );

    const objects = data.Contents || [];

    for (const object of objects) {
      const key = object.Key;

      if (!key) {
        continue;
      }

      const localPath = path.join(repoPath, key);

      await fs.mkdir(path.dirname(localPath), {
        recursive: true,
      });

      const response = await s3.send(
        new GetObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
        }),
      );

      const body = await response.Body.transformToByteArray();

      await fs.writeFile(localPath, body);
    }

    console.log("All commits pulled from S3.");
  } catch (err) {
    console.error("Unable to pull:", err);
  }
}

module.exports = { pullRepo };