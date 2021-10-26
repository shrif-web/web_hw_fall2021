package main

import (
	"crypto/sha256"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func CORS(c *gin.Context) {

	// First, we add the headers with need to enable CORS
	// Make sure to adjust these headers to your needs
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Methods", "*")
	c.Header("Access-Control-Allow-Headers", "*")
	c.Header("Content-Type", "application/json")

	// Second, we handle the OPTIONS problem
	if c.Request.Method != "OPTIONS" {

		c.Next()

	} else {

		// Everytime we receive an OPTIONS request,
		// we just return an HTTP 200 Status Code
		// Like this, Angular can now do the real
		// request using any other method than OPTIONS
		c.AbortWithStatus(http.StatusOK)
	}
}

func main() {
	r := gin.Default()
	r.Use(CORS)

	r.GET("/go", func(c *gin.Context) {
		// Query is the input by get. if not available Input would be empty.(No Error)
		Input := c.Query("Input1")

		// Check if the length is below 8 characters
		if len(Input) < 8 {
			c.JSON(http.StatusOK, gin.H{
				"response": "Input needs to be 8 character at least!",
			})
			return
		}

		// Connection String
		connStr := "host=www.pg.com user=admin password=admin sslmode=disable"
		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
		}

		var rows_db sql.NullInt64
		// Check if the database is not created. if so create the database and the table
		db.QueryRow("SELECT count(*) AS result FROM pg_database WHERE datname='test-db'").Scan(&rows_db)
		log.Print("number of rows" + fmt.Sprint(rows_db.Int64))
		if rows_db.Int64 == 0 {
			db.Query("CREATE DATABASE \"test-db\" WITH OWNER = admin ENCODING = 'UTF8' CONNECTION LIMIT = -1;")
			db.Query("CREATE TABLE public.\"Train\"(\"Key\" character varying,\"Hash\" character varying,PRIMARY KEY (\"Key\"));ALTER TABLE IF EXISTS public.\"Train\" OWNER to admin;")
		}

		var Key sql.NullString

		// fetch key corresponding to hash code from database
		err2 := db.QueryRow("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '" + Input + "'").Scan(&Key)
		if err2 != nil {
			c.JSON(http.StatusOK, gin.H{
				"response": "No record found",
				"err":      err2.Error(),
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"response": Key.String,
			})
		}

	})

	r.POST("/go", func(c *gin.Context) {
		// Input in post request is achieved by PostForm
		Key := c.PostForm("Input1") // shortcut for c.Request.URL.Query().Get("lastname")

		// Check if the length is below 8 characters
		if len(Key) < 8 {
			c.JSON(http.StatusOK, gin.H{
				"response": "Input needs to be 8 character at least!",
			})
			return
		}

		// Create hash code of input
		h := sha256.New()
		h.Write([]byte(Key))
		hash := fmt.Sprintf("%x", h.Sum(nil))
		// Connection String
		connStr := "host=www.pg.com user=admin password=admin sslmode=disable"

		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
		}

		var rows_db sql.NullInt64

		// Check if the database is not created. if so create the database and the table
		db.QueryRow("SELECT count(*) AS result FROM pg_database WHERE datname='test-db'").Scan(&rows_db)
		if rows_db.Int64 == 0 {
			db.Query("CREATE DATABASE \"test-db\" WITH OWNER = admin ENCODING = 'UTF8' CONNECTION LIMIT = -1;")
			db.Query("CREATE TABLE public.\"Train\"(\"Key\" character varying,\"Hash\" character varying,PRIMARY KEY (\"Key\"));ALTER TABLE IF EXISTS public.\"Train\" OWNER to admin;")
		}

		// Check if hash exist in db
		var Rows sql.NullInt64
		err1 := db.QueryRow("SELECT count(\"Key\") FROM public.\"Train\" where \"Hash\" = '" + hash + "'").Scan(&Rows)
		if err1 != nil {
			log.Fatal(err1)
		}

		if Rows.Int64 > 0 {
			c.JSON(http.StatusOK, gin.H{
				"response": hash,
			})
		} else {
			// if hash doesn't exist, Insert hash and key to db
			err3 := db.QueryRow("INSERT INTO \"Train\"(\"Key\",\"Hash\") VALUES ('" + Key + "','" + hash + "')")
			if err3 == nil {
				log.Fatal(err3)
			}
			c.JSON(http.StatusOK, gin.H{
				"response": hash,
			})

		}

	})

	r.Run(":9090")
}
