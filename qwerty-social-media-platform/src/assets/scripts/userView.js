var success = "SUCCESS";

// Variable to store the object of the the current user logged in
var currentUser = null;

/*
 * Hide the items that are not needed in the view.
 */
function hideAllContainers(){
    $("#newsfeed_container").css("display", "none");
    $("#profile_container").css("display", "none");
    $("#post_container").css("display", "none");
}

/*
 * Takes in a user object and displays his profile properly on the screen.
 */
function displayUserProfile(user){
    // Show only profile content
    hideAllContainers();
    $("#profile_container").css("display", "inline");

    // Display the users name
    $("#name_title").text(user.fname + " " + user.lname);
    // Display the user score
    $("#rating_display").text("Rating: " + user.avgRating.toFixed(3) + " / 5");
    // Set up the rating button
    $("#rate_btn").click(function(){
        var rate_value = 0;
        if ($('#radio_0').is(':checked')){
            rate_value = 0;
        } else if ($('#radio_1').is(':checked')){
            rate_value = 1;
        } else if ($('#radio_2').is(':checked')){
            rate_value = 2;
        } else if ($('#radio_3').is(':checked')){
            rate_value = 3;
        } else if ($('#radio_4').is(':checked')){
            rate_value = 4;
        } else if ($('#radio_5').is(':checked')){
            rate_value = 5;
        }

        // Increment this users score
        incrementRating(user.username, rate_value, function(newAvg){
            $("#rating_display").text("Rating: " + newAvg.toFixed(3) + " / 5");
            currentUser.avgRating = newAvg;
            // Make the button disappear
            $("#rate_btn").css("display", "none");
        });
    });

    // Display the about me
    $("#aboutme_content").text(user.aboutme);

    $("#postwall_container").empty();
    // Sort the posts on date, newest to oldest
    var post_list = user.posts;

    // If there are no posts, mention it in the view
    if (post_list.length === 0){
        $('#postwall_container').append("<div class='border'><h3>No Posts Yet...</h3></div>");
    } else {
        post_list.sort(function(a, b){
            return new Date(b.date) - new Date(a.date);
        });
        // Loop through all the posts and display them on view
        for(let i = 0; i < post_list.length; i++){
            // Format the post correctly on the view
            $('#postwall_container').append("<div class='border'><h3>" + post_list[i].from + " => " + 
                                            post_list[i].to + "</h3><p>" + post_list[i].msg + "</p><p>" + 
                                            "Sent: " + post_list[i].date + "</p></div>");
        }
    }
}

/*
 * Increment the rating of this user with the username given.
 */
function incrementRating(username, rate_value, callback){
    $.ajax({
        url: "/rate",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({'username': username, 'rating': rate_value}),
        success: function result(res) {
            if (res.msg === success){
                // Pass in the new average of this user
                callback(res.avg);
            } else {
                // Alert the user with the error msg that is returned
                alert("ERROR: Internal Error");
                location.reload(true);
            }
        }
    });
}

/*
 * Fill the dropdown menu with a list of all the users in the database.
 */
function readyDropdown(){
    // Fill the dropdown
    $.ajax({
        url: "/allUsersFullNames",
        type: "GET",
        success: function(name_list) {
            // Append each users name to dropdown
            name_list.sort();
            for(let i = 0; i < name_list.length; i++){
                // Dont add the current user to the list, to not let him send messages to himself
                if (name_list[i] != currentUser.fname + " " + currentUser.lname){
                    $('#user_select').append($('<option>', {
                        value: name_list[i],
                        text : name_list[i] 
                    }));
                }
            }
        }
    });
}

/*
 * Display all the posts in the news feed view.
 */
function displayNewsFeed(){
    hideAllContainers();
    $("#newsfeed_container").css("display", "inline");

    // Clear the old posts
    $('#posts_container').empty();
    // Get all the posts made on the database from server
    $.ajax({
        url: "/allPosts",
        type: "GET",
        success: function(post_list) {
            // If there are no posts, then mention it in view
            if (post_list.length === 0){
                $('#posts_container').append("<div class='border'><h3>No Posts Yet...</h3></div>");
            } else {
                // Sort the posts on date, newest to oldest
                post_list.sort(function(a, b){
                    return new Date(b.date) - new Date(a.date);
                });
                // Loop through all the posts and display them on view
                for(let i = 0; i < post_list.length; i++){
                    // Format the post correctly on the view
                    $('#posts_container').append("<div class='border'><h3>" + post_list[i].from + " => " + 
                                                    post_list[i].to + "</h3><p>" + post_list[i].msg + "</p><p>" + 
                                                    "Sent: " + post_list[i].date + "</p></div>");
                }
            }
        }
    });
}

/*
 * Setup the view properly to make a post to another user.
 */
function setupPostView(){
    hideAllContainers();
    $("#post_container").css("display", "inline");

    // Define the onclick of the send button
    $("#send_btn").click(function(){
        var userTo = $("#user_select :selected").text();
        var userFrom = currentUser.fname + " " + currentUser.lname;
        var msg = $("#msg_box").val();
        var date = new Date().toLocaleString();

        // Check if the msg is just whitespace
        if (msg.trim() === ""){
            alert("Please type characters in the text field");
            $("msg_box").val("");
            $("msg_box").focus();
        } else {
            
            // Post the message to this users profile
            $.ajax({
                url: "/makepost",
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({'toUser': userTo, 'fromUser': userFrom, 'msg': msg, 'date': date}),
                success: function result(res) {
                    if (res.msg === success){
                        // Clear the fields
                        $("#msg_box").val("");
                        // Switch to news feed view
                        document.location.href = '/';
                    } else {
                        alert("Error: Internal error. Post not sent");
                        // Clear the fields
                        $("#msg_box").val("");
                    }
                }
            });
        }
    });
}

$(document).ready(function() {
	// Make call to get the name of this user that logged in 
	$.ajax({
        url: "/currentUser",
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function result(res) {
            // If not properly logged in, redirect to login page
            if (res.hasOwnProperty("msg")){
            	document.location.href = '/';
            } else {
            	$('#greeting').text("Welcome " + res.fname + " " + res.lname);
                displayNewsFeed();
            	currentUser = res;
            }
        }
    });

    // Ready the dropdown menu of users from the database
    readyDropdown();

    // Make on click change to profile view with this user passed in through query
    $('#newsfeed').click(function(){
        displayNewsFeed();
    });

	// Make on click change to profile view with this user passed in through query
    $('#profile').click(function(){
        // Display the current users profile
        displayUserProfile(currentUser);
    });

    // Set up the post screen
    $('#post').click(function(){
        setupPostView();
    });

    $('#signout').click(function(){
        // Send post request to remove the session of this user being logged in
        $.ajax({
            url: "/logout",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function result(res) {
                // Redirect to the login page
                document.location.href = "/";
            }
        });
    });

    // Set up the search button click event
    $('#search_btn').click(function(e){
        e.preventDefault();
        // Get the name that is being searched for
        var fullname = $('#search_bar').val();
        // Send the fullname to server to find a user
        $.ajax({
            url: "/getUserByFullName",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({'fullname': fullname}),
            success: function result(res) {
                // If user not found, give a helpful alert to user
                if (res.hasOwnProperty("msg")){
                    alert('User not found. Enter full name, case sensitive: "<Firstname> <Lastname>".');
                    $('#search_bar').empty();
                } else {
                    $('#search_bar').empty();
                    // Display this users profile
                    displayUserProfile(res);
                }
            }
        });
    });
});