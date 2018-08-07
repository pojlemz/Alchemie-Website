var bcrypt = require('bcryptjs');

bcrypt.hash('aaa', '$2a$10$AKylNQQ49oam0G73SrvObu', function(err, hash) {
    if (err){
        throw err
    }
    console.log(hash);
});

bcrypt.hash('aaa', '$2a$10$AKylNQQ49oam0G73SrvObu', function(err, hash) {
    if (err){
        throw err;
    }
    bcrypt.compare('aaa', hash, function(err, isMatch) {
        if(err) throw err;
        console.log('isMatch: ', isMatch); // should output true.
    });
    console.log(hash);
});