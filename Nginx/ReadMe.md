# **NodeJS**

Nginx is used to set up the front page and forward requests to Go and NodeJS servers.

By using 'volumes' option in docker-compose file, default.conf and nginx.conf is used inside container.

>
    location /node/sha256 {
        proxy_pass   http://www.node.com:3000/node/;
    }

    location /go/sha256 {
        proxy_pass   http://www.go.com:9090/go;
    }

    location /node {
        proxy_pass   http://www.node.com:3000/node/;
    }

    location /go {
        proxy_pass   http://www.go.com:9090/go;
    }

    location /sha {
        proxy_pass   http://www.node.com:3000/node/;
    }