# **Golang**

Gin framework is used in NodeJS app.<br>
"crypto/sha256" library is used for making hash.<br>
A function called 'CORS' is written to prevent the error 'CORS'(Cross Origin Resource Sharing) which leads to block all the requests from Nginx(Ajax) and NodeJS.

Application port is 9090 and database specification is written in connection string.

In the case of sending a post or get request without appropriate inputs, there would be a 'Input needs to be 8 character at least!' response.

All responses from this app is based on Json format.

In the first run of this app a series of sql syntaxes is run to make the database ready to work.

Input is checked whether it's length is below 8 or not and appropriate respones are returned.

We added the headers to enable CORS:
> c.Header("Access-Control-Allow-Origin", "*") <br>
> c.Header("Access-Control-Allow-Methods", "*") <br>
> c.Header("Access-Control-Allow-Headers", "*")<br>
> c.Header("Content-Type", "application/json")<br>
>

