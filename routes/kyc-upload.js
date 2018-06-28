// var express = require('express');
// var router = express.Router();
// var fs = require('fs');
//
// router.post('/kyc-upload', function (request, response) {
//     fs.readFile(request.files.file.path, function(err, data) {
//         var newPath = __dirname + "/public/img/xspectra/cusatomlogo.png";
//         fs.writeFile(newPath, data, function (err) {
//             console.log("Finished writing file..." + err);
//             response.redirect("back");
//         });
//     });
// });
//
// module.exports = router;

var fs = require('fs');
const express = require('express');

var router = express.Router();
var rimraf = require('rimraf'); // For removing files recursively
var mkdirp = require('mkdirp'); // For making directories recursively

const DocumentInReview = require('../models/document-in-review');
const SubmittedDocumentName = require('../models/submitted-document-name');
const generateRandomHash = require('../server/generate-random-hash');
const uploadToS3 = require('../server/upload-to-s3');
const util = require('util');
var request = require('request');

// const knox = require('knox');

// var client = knox.createClient({
//     key: process.env.IAM_USER_KEY
//     , secret: process.env.IAM_USER_SECRET
//     , bucket: process.env.BUCKET_NAME
// });

// This route is entered when you click the 'Upload File' button.
router.post('/kyc-upload', ensureAuthenticated, function(req, res) {
    if (req.user.email){
        var response = res;
        DocumentInReview.getIsDocumentInReviewByEmail(req.user.email, function(err, res){
            if (res !== null && res.inreview) {
                console.log("The user should never enter a situation where this line of code is run");
            } else {
                if (!req.files)
                    return res.status(400).send('No files were uploaded.');
                // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
                // TODO: Here we process the input for personal information.

                var file = req.files.sampleFile;
                // const fileSize = getFilesizeInBytes(file.name);

                // @TODO: Display a message if the user needs to be kyced
                // @TODO: Add a branch if the file has been uploaded already
                var b = new Buffer(req.user.email);
                var randomlyGeneratedHash = generateRandomHash();
                var folderName = b.toString('hex') + "/" + randomlyGeneratedHash;

                var directoryFromRoot = 'uploads/' + folderName; // @NOTE: We have to create the directory from root
                var targetFolderName = folderName;
                // var directoryFromThisLocation = '/Users/danielbruce/Documents/Programming/alchemy-fund-manager';

                if (fs.existsSync(directoryFromRoot)){
                    rimraf(directoryFromRoot, function () {
                        createHashOfEmailFolderWithFile(directoryFromRoot, targetFolderName, randomlyGeneratedHash, file, req, response);
                    });
                } else {
                    createHashOfEmailFolderWithFile(directoryFromRoot, targetFolderName, randomlyGeneratedHash, file, req, response);
                }
            }
        })
    } else {
        console.log("The user should never enter a situation where this line of code is run");
    }

});

function createHashOfEmailFolderWithFile(directoryFromRoot, targetFolderName, randomlyGeneratedHash, file, req, res) {
    const response = res;
    // TODO: Make sure that KYC server is running for handling user data
    mkdirp(directoryFromRoot, function(err) {
        console.log(directoryFromRoot);
        // sampleFile.mv('../uploads/' + foldername, function(err) {
        // var newFileName = directoryFromThisLocation + "/" + file.name;
        var newFileName = directoryFromRoot + "/" + file.name;
        DocumentInReview.setIsDocumentInReviewByEmail(req.user.email, true, function(err, result) { // In database we record the fact that documents are under review.
            SubmittedDocumentName.setSubmittedDocumentNameByEmail(req.user.email, file.name, function(err, result) { // In database we record name of file to review
                file.mv(newFileName, function (err) {
                    if (err)
                        return res.status(500).send(err);
                    const targetFileName = targetFolderName + "/" + file.name;
                    uploadToS3(newFileName, targetFileName);
                    // The following code block removes the file from the local directory.
                    rimraf(directoryFromRoot, function () {
                        const host = process.env.KYC_HOST;
                        const placeholderString = '/insert-kyc-data?email=%s&firstname=%s&lastname=%s&streetAddress=%s&city=%s&state=%s&country=%s&dateOfBirth=%s&filehash=%s';
                        const urlSuffix = util.format(placeholderString, req.user.email, req.body.firstname, req.body.lastname, req.body.streetaddress, req.body.city, req.body.state, req.body.country, req.body.dateofbirth, randomlyGeneratedHash);
                        var url = host + urlSuffix;
                        request({
                            uri: url,
                            method: ""
                        }, function(error, res, body) {
                            if (typeof(body) !== 'undefined') { // && body.response === "success"){
                                // TODO: Consider other types of responses here
                                // @NOTE: Now that we have finished with the file, we can send a request for the kyc data to be recorded.
                                req.flash('success_msg', 'You have successfully uploaded a document. We will be in touch.');
                                response.redirect('/');
                            } else {
                                console.error("Could not get positive response from KYC importer. Perhaps the server isn't running or that database is down.");
                                // TODO: Consider better feedback than an error message here.
                            }
                        });
                    });
                    // client.putFile(newFileName, newFileName, function(err, res){
                    //     // Always either do something with `res` or at least call `res.resume()`.
                    //     if (err)
                    //         // err is usually null when
                    //         console.log(err);
                    //     req.flash('success_msg','You have successfully uploaded a document. We will be in touch.');
                    //     response.redirect('/');
                    // });
                });
            });
        })
    });
}

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

// function getFilesizeInBytes(filename) {
//     var stats = fs.statSync(filename);
//     var fileSizeInBytes = stats["size"];
//     return fileSizeInBytes
// }

module.exports = router;