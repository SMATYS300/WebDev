git clone https://github.com/SMATYS300/WebDev.git
cd WebDev
npm install

To start the server:
node index

Open your web browser and go to http://localhost:3000 to access the application.
You can register as a new user or use the provided credentials to login:

Admin account:
Email: admin@gmail.com
Password: admin

Pantry account:
Email: pantry@gmail.com
Password: pantry

Normal User account:
Email: user@gmail.com
Password: user

If you create a new account through register link underneath login page 
the account role will automatiocally be set to NormalUser

If you want to create an account with a different role you need to access 
the admin account and register through add user function.
This function has a drop down menu where your can choose 3 roles.

Features
User authentication and authorization
Role-based access control
Registration and login functionality
Profile management for different user roles

Features that aren't working properly
Admin account - Edit user 
Admin account - Delete user 
Profile Pages are redirecting the users based on their role,
user information is retrieved from the database but it is not displayed
on the profile page most likely because I used a switch and case for 
user profile navigaion.

Dependencies
express
mustache-express
body-parser
express-session
bcrypt
