var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var path = require('path');
var app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// Include views, css and scripts
app.use(express.static(__dirname + '/src/assets'));
app.use(express.static(__dirname + '/'));

// Set up to use a session
app.use(cookieParser('secretkey'));
app.use(session({
    secret: 'secrettkey123'
}));

// Use body parser
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
}));

//Modules for project (Routes)
var constants = require(__dirname + '/src/constants');
var user = require(constants.user);
var admin = require(constants.admin);

// Routes
app.get('/', user.startUp);

/*-----------USER INTERACTION-------------------*/
app.post('/login', user.login);
app.post('/logout', user.logout);
app.post('/register', user.register);
app.get('/newsFeed', user.newsFeed);
app.get('/allPosts', user.allPosts);
app.post('/makepost', user.makePost);
app.post('/rate', user.rateUser);
app.get('/currentUser', user.getCurrentUser);
app.get('/getUser', user.getUser);
app.post('/getUserByFullName', user.getUserByFullName);
app.get('/allUsersFullNames', user.allUsersFullNames);


/*-----------ADMIN INTERACTION-------------------*/
//Example admin interactions for now
app.post('/adminLogin', admin.adminLogin);
app.post('/adminLogout', admin.adminLogout);
app.get('/adminView', admin.getAdminView);
app.get('/allUsersUsernames', admin.allUsersUsernames);
app.post('/getUserByUsername', admin.getUserByUsername);
app.post('/updateUser', admin.updateUser);
app.post('/deleteUser', admin.deleteUser)
/*------------------------------*/


// Start the server
app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
