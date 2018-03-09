require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
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
var routeKycApprove = require('./routes/kyc-approve');
var routeKycDeny = require('./routes/kyc-deny');
var os = require("os");
var RateLimit = require('express-rate-limit');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Attach the rate limiter middleware
var limiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
    delayMs: 0 // disable delaying - full speed until the max limit is reached
});
app.use(limiter); //  apply to all requests

app.use(helmet({ // Parse the http headers for security reasons
    frameguard: {action: 'deny'}
}));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    /*cookieName: 'session',*/
    /*duration: 30 * 60 * 1000,*/
    /*activeDuration: 5 * 60 * 1000,*/
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {  httpOnly: true,  secure: true  }
}));

// default options
app.use(fileUpload());

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
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
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.host = host;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.google_recaptcha_public = process.env.GOOGLE_RECAPTCHA_PUBLIC;
  next();
});

// app.use(function(req, res, next) {
//     var clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1
//     next();
// });

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
app.use('/', routeKycApprove);
app.use('/', routeKycDeny);

// Set Port
if (process.env.NODE_ENV !== 'production') {
    app.set('port', (process.env.PORT || 3000));
    app.listen(app.get('port'), function(){
        console.log('Server started on port '+app.get('port'));
    });
} else {
    app.set('port', (process.env.PORT || 3000));
    var sslPath = process.env.SSL_PATH; // '/etc/letsencrypt/live/yourdomain.example.com/';
    var options = {
        key: fs.readFileSync(sslPath + 'privkey.pem'),
        cert: fs.readFileSync(sslPath + 'fullchain.pem')
    };
    const server = https.createServer(options, app);
    server.listen(app.get('port'), function(){
        console.log('Server started on port '+app.get('port'));
    });
}
