//dependencies
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var logger = require('morgan');
var dotenv = require('dotenv');
dotenv.config();

var app = express();

//middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//connect to database
const uri = process.env.DB_CONNECTION_STRING;
mongoose.connect(
    uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }, () => {
        console.log("connected to database");
    })

//require routes handlers
const loginRoutes = require('./app/routes/entry/login');
const registerRoutes = require('./app/routes/entry/register');
const refreshTokenRoutes = require('./app/routes/entry/refreshToken');
const forgotPasswordRoutes = require('./app/routes/entry/forgotPassword')
const customerRoutes = require('./app/routes/users/customer');
const messRoutes = require('./app/routes/users/mess');
const oauthRoutes = require('./app/routes/entry/oauth');
const currentMenuRoutes = require('./app/routes/modules/currentMenu');
const menuRoutes = require('./app/routes/modules/menuList');
const subscriptionRoutes = require('./app/routes/modules/subscription');
const searchbarRoutes = require('./app/routes/modules/searchbar');
const messFeatureRoutes = require('./app/routes/modules/messFeatures');
const customerFeatureRoutes = require('./app/routes/modules/customerFeatures');
const ratingRoutes = require('./app/routes/modules/review');

//routes
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/refresh', refreshTokenRoutes);
app.use('/api/forgotpassword', forgotPasswordRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/mess', messRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/currentmenu', currentMenuRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/search', searchbarRoutes);
app.use('/api/mess/features', messFeatureRoutes);
app.use('/api/customer/features', customerFeatureRoutes);
app.use('/api/rating', ratingRoutes);


app.listen(9000, () => {
    console.log("app running on port:" + 9000);
});