const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const logger = require('./logger');

const config = require('./config');

// connect to the database and load models
require('./models').connect(config.dbUri);

// Initialize the express App
const app = express();
app.use(bodyParser.json());
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');

passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authorization checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
const roleAssignMiddleware = require('./middleware/role-assign');

// routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

app.use('/api', authCheckMiddleware, roleAssignMiddleware, apiRoutes);
app.use('/auth', authRoutes);

app.listen(config.port, config.host, () => {
  logger.log('info', `Express is running on: ${config.serverUrl()}`);
});
