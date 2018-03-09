const AWS = require('aws-sdk');
var fs = require('fs');

// const Busboy = require('bu
// const knox = require('knox');

// var client = knox.createClient({
//     key: process.env.IAM_USER_KEY
//     , secret: process.env.IAM_USER_SECRET
//     , bucket: process.env.BUCKET_NAME
// });

module.exports = function uploadToS3(sourceFilename, targetFilename) {
    const s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
        Bucket: process.env.BUCKET_NAME,
    });
    s3bucket.createBucket(function () {
        var stream = fs.createReadStream(sourceFilename);
        var params = {
            Bucket: process.env.BUCKET_NAME,
            Key: targetFilename,
            Body: stream
        };
        s3bucket.upload(params, function (err, data) {
            if (err) {
                console.log('error in callback');
                console.log(err);
            }
            console.log('success');
            console.log(data);
        });
    });
}