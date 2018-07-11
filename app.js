require('dotenv').config(); // This reads the .env file in the root directory of the project and uses its values.

// Adding different modules to the project
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('./server/body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./server/passport');
var host = require('./server/host');
const fileUpload = require('express-fileupload');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const csrfProtection = require('./server/csrf-protection');

// Incoming web requests
var routeIndex = require('./routes/index');
var routeUsers = require('./routes/users');
var routeRegister = require('./routes/register');
var routeLogin = require('./routes/login');
var routeLogout = require('./routes/logout');
var routeCompleteRegistration = require('./routes/complete-registration');
var routeJsonEchoAddress = require('./routes/json-echo-address');
var routeJsonGetOwnedAddressesByEmail = require('./routes/json-get-owned-addresses-by-email');
var routeJsonAddOwnedAddressesToEmail = require('./routes/json-add-owned-address-to-email');
var routeJsonGetAuthenticatedEmail = require('./routes/json-get-authenticated-email');
var routeTwoFactorOptions = require('./routes/two-factor-options');
var routeTwoFactorBridgeDeleteSharedSecret = require('./routes/two-factor-bridge-delete-shared-secret');
var routeTwoFactorBridgeHasSharedSecret = require('./routes/two-factor-bridge-has-shared-secret');
var routeTwoFactorBridgeSetSharedSecret = require('./routes/two-factor-bridge-set-shared-secret');
var routeTwoFactorBridgeVerifyOneTimeCodeAndEmail = require('./routes/two-factor-bridge-verify-one-time-code-and-email');
var routeTwoFactorBridgeVerifyOneTimeCodeAndEmailAgainstSpecificSharedSecret = require('./routes/two-factor-bridge-verify-one-time-code-and-email-against-specific-shared-secret');
var routeTwoFactorBridgeIs2FAAttemptableForSpecificEmail = require('./routes/two-factor-bridge-is-2fa-attemptable-for-specific-email');
var routeTwoFactorBridgeHasSharedSecretForSpecificEmail = require('./routes/two-factor-bridge-has-shared-secret-for-specific-email');
var routeLoginSharedSecretSet = require('./routes/login-shared-secret-set');
var routeLoginSharedSecretRemoved = require('./routes/login-shared-secret-removed');
var routeIs2faAttemptable = require('./routes/two-factor-bridge-is-2fa-attemptable');
var routeForgottenPassword = require('./routes/forgotten-password');
var routeForgottenPasswordSubmitted = require('./routes/forgotten-password-submitted');
var routeResetYourPassword = require('./routes/reset-your-password');
var routeSubmitResetPassword = require('./routes/submit-reset-password');
var routeBuyTokens = require('./routes/buy-tokens');
var routeSubmitYourInformation = require('./routes/submit-your-information');
var routeKycUpload = require('./routes/kyc-upload');
var routeInformationIsInReview = require('./routes/information-is-in-review');
// var routeKycApprove = require('./routes/kyc-approve');
// var routeKycDeny = require('./routes/kyc-deny');
// var routeDeposit = require('./routes/deposit');
// var routeWithdraw = require('./routes/withdraw');
// var routeWithdrawalAddressAdd = require('./routes/withdrawal-address-add');
// var routeWithdrawalAddressRemove = require('./routes/withdrawal-address-remove');
// var routeSubmitWithdrawal = require('./routes/submit-withdrawal');
var routeGetPrices = require('./routes/json-get-prices');
var routeJsonLockTradesAndGetResponse = require('./routes/json-lock-trades-and-get-response');
var routeJsonAddProductAddressToEmail = require('./routes/json-add-product-address-to-email')
var routeJsonBeginOrderAndGetResponse = require('./routes/json-begin-order-and-get-response');
var routeJsonGetProducts = require('./routes/json-get-products');

var os = require("os");
var RateLimit = require('express-rate-limit');

// Init App
var app = express(); // I

// View Engine
app.set('views', path.join(__dirname, 'views')); // Set handlebars views to correspond to the views folder
app.engine('handlebars', exphbs({defaultLayout:'layout'})); // Part of setting engine to handlebars
app.set('view engine', 'handlebars'); // Set the view engine to handlebars

// Attach the rate limiter middleware
var limiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
    delayMs: 0 // disable delaying - full speed until the max limit is reached
});
app.use(limiter); //  apply to all requests

app.use(helmet({ // Parse the http headers for security reasons
    frameguard: {action: 'deny'} // Use a deny
}));

// BodyParser Middleware
app.use(bodyParser.json()); // Middleware for parsing the body of requests
app.use(bodyParser.urlencoded({ extended: false })); // Middleware for encoding urls
app.use(cookieParser()); // Middleware for parsing cookies

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public'))); // Adds the public folder to the front end

if (process.env.NODE_ENV === 'production') { // If we are running the production version of the app
    app.use(session({ // Use a session that saves the following information
        secret: process.env.SESSION_SECRET, // Session secret
        saveUninitialized: true,
        resave: true, // resave
        cookie: {httpOnly: true, secure: true} // cookie security
    }));
} else { // If we are running the development version of the app
    app.use(session({  // Use a session that saves the following information
        secret: process.env.SESSION_SECRET, // Session secret
        saveUninitialized: true,
        resave: true,
        cookie: {httpOnly: true, secure: false} // Cookie security set to false since website fails if it is not
    }));
}

app.use(csrfProtection); // Use the cross site request forgery protection middleware
// default options
app.use(fileUpload()); // Use the file upload middleware

// Passport init
app.use(passport.initialize()); // Use an initialized version of passport (passport is for validating logins)
app.use(passport.session()); // Use passport sessions

// Express Validator
app.use(expressValidator({ // Express validator validates input on the body/query of post/get requests
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash()); // Use the flash middleware to send messages back to the user

// Global Vars
app.use(function (req, res, next) {
  res.locals.host = host; // Set the host variable in handlebars view
  res.locals.success_msg = req.flash('success_msg'); // Set local variable success_msg to display in handlebars view
  res.locals.error_msg = req.flash('error_msg'); // Set local variable error_msg to display in handlebars view
  res.locals.error = req.flash('error'); // Set the error variable to display in handlebars view
  res.locals.user = req.user || null; // Set the user variable to the email of the user that is logged in
  res.locals.csrfToken = req.csrfToken(); // Set the cross site request forgery token in the view to be included in all post requests
  res.locals.google_recaptcha_public = process.env.GOOGLE_RECAPTCHA_PUBLIC; // Set the view so that Google Related front end knows what api key to use to get captchas
  next(); // Call the next function in the list of arguments
});

// Get app to use all routes defined earlier
app.use('/', routeIndex);
// app.use('/users', users); // old code
app.use('/', routeUsers);
app.use('/', routeRegister);
app.use('/', routeLogin);
app.use('/', routeLogout);
app.use('/', routeCompleteRegistration);
app.use('/', routeJsonEchoAddress);
app.use('/', routeJsonGetOwnedAddressesByEmail);
app.use('/', routeJsonAddOwnedAddressesToEmail);
app.use('/', routeJsonGetAuthenticatedEmail);
app.use('/', routeTwoFactorOptions);
app.use('/', routeTwoFactorBridgeDeleteSharedSecret);
app.use('/', routeTwoFactorBridgeHasSharedSecret);
app.use('/', routeTwoFactorBridgeSetSharedSecret);
app.use('/', routeTwoFactorBridgeVerifyOneTimeCodeAndEmail);
app.use('/', routeTwoFactorBridgeVerifyOneTimeCodeAndEmailAgainstSpecificSharedSecret);
app.use('/', routeTwoFactorBridgeIs2FAAttemptableForSpecificEmail);
app.use('/', routeTwoFactorBridgeHasSharedSecretForSpecificEmail);
app.use('/', routeLoginSharedSecretSet);
app.use('/', routeLoginSharedSecretRemoved);
app.use('/', routeIs2faAttemptable);
app.use('/', routeForgottenPassword);
app.use('/', routeForgottenPasswordSubmitted);
app.use('/', routeResetYourPassword);
app.use('/', routeSubmitResetPassword);
app.use('/', routeBuyTokens);
app.use('/', routeSubmitYourInformation);
app.use('/', routeKycUpload);
app.use('/', routeInformationIsInReview);
// app.use('/', routeKycApprove);
// app.use('/', routeKycDeny);
// app.use('/', routeDeposit);
// app.use('/', routeWithdraw);
// app.use('/', routeWithdrawalAddressAdd);
// app.use('/', routeWithdrawalAddressRemove);
// app.use('/', routeSubmitWithdrawal);
app.use('/', routeGetPrices);
// app.use('/', routeJsonLockTradesAndGetResponse);
app.use('/', routeJsonAddProductAddressToEmail);
app.use('/', routeJsonBeginOrderAndGetResponse);
app.use('/', routeJsonGetProducts);

// Runs server side code on various time intervals.
require('./server/server-interval-5-seconds');
// require('./server/server-interval-30-seconds');
// require('./server/server-interval-5-minutes');

// This segment of code is concerned with setting up the actual server to serve the 'app'
if (process.env.NODE_ENV !== 'production') { // If the node environment is 'production'
    app.set('port', (process.env.PORT || 3000)); // Set port environment variable to specific value
    app.listen(app.get('port'), function(){ // Allow app to listen on that port
        console.log('Server started on port '+app.get('port')); // Message displayed when server begins listening
    });
} else { // If node environment variable is development
    app.set('port', (process.env.PORT || 3000)); // Set port environment variable to specific value
    var sslPath = process.env.SSL_PATH; // On your filesystem, this is where your security certificate is. ie. '/etc/letsencrypt/live/yourdomain.example.com/';
    var options = { // Set options for where SSL key and SSL certificate will be stored.
        key: fs.readFileSync(sslPath + 'privkey.pem'), // This is the SSL key
        cert: fs.readFileSync(sslPath + 'fullchain.pem') // This is the SSL certificate
    };
    const server = https.createServer(options, app); // This is the server variable that we set to an https server
    server.listen(app.get('port'), function(){ // This is where we tell the server to begin listening on the environment variable 'port'
        console.log('Server started on port '+app.get('port')); // Message displayed when server begins listening.
    });
}
