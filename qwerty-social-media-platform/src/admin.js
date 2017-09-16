"use strict";

var constants = require(__dirname + '/constants');
var dbAdapter = require(constants.dbAdapter);

/*
 * Login the admin by making sure keycode is correct and starting an admin session.
 */
exports.adminLogin = function(req, res){

	//Checks to see if a keycode is entered
	if (!req.body.hasOwnProperty('keycode')){
		return res.json({msg: "ERROR: keycode required"});
	} else {
		//If the keycode is correct, go to the admin view otherwise tell the user its incorrect
		if (req.body.keycode === constants.ADMIN_KEYCODE){
			// Mark the session as a valid admin
			req.session.admin = true;
			return res.json({msg: constants.SUCCESS});
		} else {
			return res.json({msg: "Admin keycode incorrect"});
		}
	}

};

/*
 * Logout the admin by removing the admin session.
 */
exports.adminLogout = function(req, res){

	// Remove the admin session
	req.session = null;
	return res.json({msg: constants.SUCCESS});

};

/*
 * If an admin session exists give the admin proper admin view.
 */
exports.getAdminView = function(req, res){

	// If a valid admin, then send the page
	if (req.session.hasOwnProperty("admin")){
		res.render(constants.adminViewPage);
	} else {
		// If not an admin then send back to the login page
		res.render(constants.loginPage);
	}

};

/*
 * Returns a list of all the users usernames that exist in the database.
 */
exports.allUsersUsernames = function(req, res){

	dbAdapter.allUsers(function(allUsers){
		var username_list = [];
		// Add all the users usernames to the list
		for (let i = 0; i < allUsers.length; i++){
			username_list.push(allUsers[i].username);
		}
		return res.json(username_list);
	});

};

/*
 * Get the user object that has the username that is given.
 */
exports.getUserByUsername = function(req, res){

	// Check if a username was passed in
	if (!req.body.hasOwnProperty('username')){
		return res.json({msg: "ERROR: username required"});
	} else {
		dbAdapter.getUserByUsername(req.body.username, function(user){
			// Return the user if found
			if (user === null){
				return res.json({msg: "ERROR: User not found"});
			} else {
				return res.json(user);
			}
		});
	}

};

/*
 * Update the users info with the given username.
 */
exports.updateUser = function(req, res){

	//Makes sure all the required fields are filled out
	if (!req.body.hasOwnProperty('username') ||
		!req.body.hasOwnProperty('pass') ||
		!req.body.hasOwnProperty('fname') ||
		!req.body.hasOwnProperty('lname') ||
		!req.body.hasOwnProperty('aboutme')){
		return res.json({msg: "ERROR: fields required"});
	} else {
		// Get the user from the database
		dbAdapter.getUserByUsername(req.body.username, function(user){
			if (user === null){
				return res.json({msg: "ERROR: user does not exist"});
			} else {
				// Set the new information
				user.pass = req.body.pass;
				user.fname = req.body.fname;
				user.lname = req.body.lname;
				user.aboutme = req.body.aboutme;

				// Change the name in this users posts
				for (let i = 0; i < user.posts.length; i++){
					user.posts[i].to = user.fname + " " + user.lname;
				}

				// Save the user back in the database
				dbAdapter.saveUser(user, function(){
					return res.json({msg: constants.SUCCESS});
				});
			}
		});
	}

};

/*
* Deletes the user with given username.
*/
exports.deleteUser = function(req, res){

	//Checks to see that a username to delete has been provided
	if (!req.body.hasOwnProperty('username')){
		return res.json({msg: "ERROR: fields required"});
	} else {
		// Get the user by his username
		dbAdapter.getUserByUsername(req.body.username, function(user){
			if (user === null){
				return res.json({msg: "ERROR: user does not exist"});
			} else {
				//Delete user
				dbAdapter.deleteUser(user, function(){
					return res.json({msg: constants.SUCCESS});
				});
			}
		});
	}

};