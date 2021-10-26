# **NodeJS**

Express framework is used in NodeJS app.<br>
Crypto library is used for making hash.<br>
Cors library is used to prevent the error 'CORS'(Cross Origin Resource Sharing) which leads to block all the requests from Nginx(Ajax) and NodeJS.

Application port and database specification is written in 'config/config.json'.

In the case of sending a post or get request without appropriate inputs, there would be a 'No Input!' response.

All responses from this app is based on Json format.

In the first run of this app a series of sql syntaxes is run to make the database ready to work.(By using bool variable 'Init')

Input is checked whether it's length is below 8 or not and appropriate respones are returned.

