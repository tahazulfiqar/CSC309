var success = "SUCCESS";
/*
 * Function do display all the users information on the view, for the admin.
 */
function displayUserInfo(user){
	// Fill all the fields and make update button visible
	$('#password_field').val(user.pass);
	$('#fname_field').val(user.fname);
	$('#lname_field').val(user.lname);
	$('#aboutme_field').val(user.aboutme);
	$('#update_btn').css("display", "inline");
    $('#delete_btn').css("display", "inline");    
}

// Ready the dropdown and buttons at page load
$(document).ready(function() {

	// Get all the users usernames and add to the dropdown
	$.ajax({
        url: "/allUsersUsernames",
        type: "GET",
        success: function(name_list) {
            // Append each users name to dropdown
            name_list.sort();
            for(let i = 0; i < name_list.length; i++){ 
                $('#username_select').append($('<option>', {
                    value: name_list[i],
                    text : name_list[i] 
                })); 
            }
        }
    });

	// Click handler for get user button, to get user info
	$('#get_user_btn').click(function(){
		var username = $("#username_select :selected").text();

		$.ajax({
            url: "/getUserByUsername",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({'username': username}),
            success: function result(res) {
                // If user not found, give a helpful alert to user
                if (res.hasOwnProperty("msg")){
                    alert(res.msg);
                } else {
                	// If the user is found display the users information on the screen
                    displayUserInfo(res);
                }
            }
        });
	});

	// Update button handler for updating the user information
	$('#update_btn').click(function(){
		var username = $("#username_select :selected").text();
		var pass = $('#password_field').val();
		var fname = $('#fname_field').val();
		var lname = $('#lname_field').val();
		var aboutme = $('#aboutme_field').val();

		// Update the user on the server
		$.ajax({
            url: "/updateUser",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({'username': username, 'pass': pass, 'fname': fname, 'lname': lname, 'aboutme': aboutme}),
            success: function result(res) {
                if (res.msg === success){
                	// If successful alert the user
                	alert("User updated successfully");
                	location.reload(true);
                } else {
                	alert(res.msg);
                }
            }
        });

	});

    // Set up the delete user button for the admin
    $('#delete_btn').click(function(){
        var username = $("#username_select :selected").text();

        // Delete the user on the server
        $.ajax({
            url: "/deleteUser",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({'username': username}),
            success: function result(res) {
                if (res.msg === success){
                    // If successful alert the user
                    alert("User deleted successfully!");
                    location.reload(true);
                } else {
                    alert(res.msg);
                }
            }
        });

    });

	// Set up the logout button for the admin
	$('#logout_btn').click(function(){
		$.ajax({
            url: "/adminLogout",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function result(res) {
                // Go back to sign in screen
                document.location.href = "/";
            }
        });
	});
});