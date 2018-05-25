const Price = require('../models/price');

Price.getLatestPrices(function(err, res){
    if (err) {
        console.error("Error when storing prices.");
    }
    console.log(res);
});

/*
[ anonymous {
    id: 318,
    instrument: '100G',
    time_created: 2018-05-25T14:24:52.275Z,
    price: 4196.29,
    latest_time: 2018-05-25T14:24:52.275Z },
  anonymous {
    id: 319,
    instrument: '1KILOG',
    time_created: 2018-05-25T14:24:52.279Z,
    price: 42028.69,
    latest_time: 2018-05-25T14:24:52.279Z } ]
 */