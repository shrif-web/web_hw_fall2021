package main

import (
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"database/sql"
	_ "github.com/lib/pq"
)

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		lastname := c.Query("Input1") // shortcut for c.Request.URL.Query().Get("lastname")
		c.String(http.StatusOK, "Hello %s",lastname)
	})
	r.Run(":9090") 
	
}

/*
connStr := "user=pqgotest dbname=pqgotest sslmode=verify-full"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	age := 21
	rows, err := db.Query("SELECT name FROM users WHERE age = $1", age)
*/