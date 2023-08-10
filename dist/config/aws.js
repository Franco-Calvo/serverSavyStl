import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const s3 = new S3Client({
    region: process.env.ACCESS_REGION_AWS || "",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_AWS || "",
        secretAccessKey: process.env.ACCESS_SECRET_KEY_AWS || "",
    },
});
export default s3;
