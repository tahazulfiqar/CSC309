var constants = require("./constants");
var User = require('../models/user');

/*
 * Return true if there exists a user in the database with the given
 * username, false otherwise.
 */
exports.getUserExists = function(user_name, callback){

    // Find user in the databse
    User.findOne({username: user_name}, function(err, user){
        // Return whether they exist or not
        var exist = (user !== null);
        callback(exist);
    });

};

/*
 * Get user from database with given username.
 */
exports.getUserByUsername = function(user_name, callback){

    User.findOne({username: user_name}, function(err, user){
        if (err) throw err;
        callback(user);
    });

};

/*
 * Get user with from database with given fullname.
 */
exports.getUserByFullName = function(fullname, callback){

    //Creates an array with 2 elements, fname and lname
    var name_array = fullname.split(" ");
    User.findOne({fname: name_array[0], lname: name_array[1]}, function(err, user){
        if (err) throw err;
        callback(user);
    });

};

/*
 * Add a new user in to the database.
 */
exports.addNewUser = function(newUser, callback){

    var newUserObj = new User(newUser);
    newUserObj.save(function(err, newBook) {
        if (err) throw err;

        callback(constants.SUCCESS);
    });

};

/*
* Deletes a user by username.
*/
exports.deleteUser = function(user, callback){

    User.remove({username: user.username}, function(err){
        if (err) throw err;

        callback(constants.SUCCESS);
    });

};

/*
 * Save an existing users information in the database.
 */
exports.saveUser = function(user, callback){

    user.save(function(err, newBook) {
        if (err) throw err;

        callback(constants.SUCCESS);
    });

};

/*
 * Return a list of all the users in the database.
 */
exports.allUsers = function(callback){

    User.find({}, function(err, allUsers) {
        if (err) throw err;
        callback(allUsers);
    });
    
};
