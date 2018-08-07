file.mv(directoryFromThisLocation, function(err) {
    if (err)
        return res.status(500).send(err);

    res.send('File uploaded!');
});