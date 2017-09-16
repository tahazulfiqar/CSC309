# Qwerty

## Setup

### Begin by running the mongo database, by running the command:
```
mongod
```

### Seed the the database, with some starting JSON files:
```
mongoimport --db qwertydb --collection users --type json --file start_users.json --jsonArray
```

### If you want to remove previous data, clear the database with this command:
```
mongo qwertydb --eval "db.dropDatabase()"
```

### Install the required packages defined in package.json by executing:
```
npm install
```

### To run the server, from the main root directory execute:
```
node server.js
```
The server should be listening on port 3000 and should be ready!

## Some information to navigate through the app:
A sample account to use to test logging in would be:  
Username: user1  
Password: pass1  

To test admin access the admin information is:  
Keycode: admin123  

## Features of the application

### Login View

This is the starting view that is reached when localhost:3000 is reached on a browser. In this view the user has the option of logging in as a current user defined in the database or registering as a new user by filling out the required information. Also at the bottom of this view an admin can enter the admin keycode to gain admin access to modify users personal information.

### User View

After a user logged in or created a new account, they should find themseleves in the news feed view. Note that if you log in, leave the page and comeback to the website you will be automatically logged in because the site will remember your session.
##### View News Feed
This view lists out all the posts sorted by most recent to latest that have been made in the system. The user can also view their own profile to see there own information and posts that have been directed towards them. The post format is as follows:

[sending user] -> [receiving user]  
[Message]  
Date: [Date message sent]  

##### Making a post
To make a new post, you click the option in the taskbar to do so. In this view you can select any user in the program (other than yourself), write a message and send it to them. 
##### Searching for a user
The search bar in the top right corner of the screen allows you to search for users typing their full name. So if I wanted to search for Rod Mazloomi, I would type "Rod Mazloomi" and click search. This will allow you to view others profiles. Note that searching for users names is case sensitive. 
##### Rating Users
From your profile view or looking at others profiles, you have the option of rating the user from 0 to 5. The users rating average accumulates over time and is saved in the database. Note that you can rate once per login!
##### Logging out
Finally the last operation you can do is logout by clicking so in the navigation bar at the top, thus removing your session.

### Admin View

Once by entering the keycode mentioned above the admin will themself in the admin view. In this view the admin will be able to select user's usernames from a dropdown menu and load their information. From here the admin can change anything from their name, aboutme and password. When done making changes the admin clicks "Update User" and the changes the user will be saved in the database. Then after when the admin is complete, they can logout removing the administrative rights session.  

The admin can also delete a respective user from the database by clicking the "Delete User" button. 