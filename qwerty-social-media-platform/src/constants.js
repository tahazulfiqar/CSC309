/* --- File paths --- */
exports.login = __dirname + '/assets/scripts/login';
exports.userView = __dirname + '/assets/scripts/userView';

exports.user = __dirname + '/user';
exports.admin = __dirname + '/admin';
exports.dbAdapter = __dirname + '/db-adapter';

//views
exports.loginPage = __dirname + '/views/login.html';
exports.userViewPage = __dirname + '/views/userView.html';
exports.adminViewPage = __dirname + '/views/adminView.html';


/* --- Constants representing success / failure for asynchronous callbacks
       or for other purposes --- */

exports.SUCCESS = "SUCCESS";
exports.ERROR = "ERROR";

/* --- Admin keycode to have access --- */
exports.ADMIN_KEYCODE = 'admin123';