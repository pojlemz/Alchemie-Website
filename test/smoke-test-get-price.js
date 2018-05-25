const Price = require('../models/price');

Price.getLatestPrice('1KILOG', function(err, res){
    if (err) {
        console.error("Error when storing prices.");
    }
    console.log(res);
    console.log(res['price']);
});

/*
{
  id: 301,
  instrument: '1KILOG',
  time_created: 2018-05-24T21:12:17.872Z,
  price: 42057.62
}
 */