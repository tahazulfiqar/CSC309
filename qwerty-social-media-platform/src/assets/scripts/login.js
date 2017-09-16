var success = "SUCCESS";

$(document).ready(function() {
	
    // Button click event for logging in the user
    $('#submitBtn').click(function(){

		var val_username = $('#inputUsername').val();
		var val_password = $('#inputPassword').val();
		$.ajax({
            url: "/login",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({'username': val_username, 'pass': val_password}),
            success: function result(res) {
                if (res.msg === success){
                    // Redirect user to the newsFeed now that he is logged in
                    document.location.href = '/newsFeed';
                } else {
                    // Alert the user with the error msg that is returned
                    alert(res.msg);
                    location.reload(true);
                }
            }
        });
	});

    // Button click event for making the call to register the user
    $("#signup").submit(function(e) {
     
        e.preventDefault();

        var firstname = $("#first_name").val().trim();
        var lastname = $("#last_name").val().trim();
        var username = $("#user_name").val().trim();
        var p_word1 = $("#pw1").val();
        var p_word2 = $("#pw2").val();
        var about_me = $("#about_me").val();

        if(p_word1 !== p_word2){
            alert('Sorry, the passwords you have entered do not match.');
            location.reload(true);
        } else {

            var addObj = 
                {
                    "fname": firstname,
                    "lname": lastname,
                    "username": username,
                    "pass": p_word1,
                    "aboutme": about_me
                };   

            $.ajax({
                url: '/register',
                type: 'POST',
                processData: false,
                contentType: 'application/json',
                data: JSON.stringify(addObj),
                success: function result(res){
                    if(res.msg === success){
                        // Redirect user to the newsFeed now that he is logged in
                        document.location.href = '/newsFeed';
                    } else {
                        // Alert the user with the error msg that is returned
                        alert(res.msg);
                        location.reload(true);
                    }
                }
            });
        }
    });

    // Button click event to allow admin access
    $('#admin_btn').click(function(){
        var keycode = $('#input_keycode').val();
        // Attempt to log in admin
        $.ajax({
                url: '/adminLogin',
                type: 'POST',
                processData: false,
                contentType: 'application/json',
                data: JSON.stringify({'keycode': keycode}),
                success: function result(res, status){
                    if(res.msg === success){
                        // Redirect user to the newsFeed now that he is logged in
                        document.location.href = '/adminView';
                    } else {
                        // Alert the user with the error msg that is returned
                        alert(res.msg);
                        location.reload(true);
                    }
                }
            });
    });
});
