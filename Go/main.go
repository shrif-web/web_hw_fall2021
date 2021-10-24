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
		Input := c.Query("Input1")

		connStr := "host=www.pg.com user=admin dbname=test-db password=admin sslmode=disable"
		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
		}

		var Key sql.NullString

		err2 := db.QueryRow("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '" + Input + "'").Scan(&Key)
		if err2 != nil {
			c.JSON(http.StatusOK, gin.H{
				"response": "No record found",
				"err": err2.Error()
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"response": Key.String,
			})
		}

	})

	r.POST("/go", func(c *gin.Context) {
		Key := c.PostForm("Input1") // shortcut for c.Request.URL.Query().Get("lastname")

		if len(Key) < 8 {
			c.JSON(http.StatusOK, gin.H{
				"response": "Input needs to be 8 character at least!",
			})
			return
		}

		h := sha256.New()
		h.Write([]byte(Key))
		hash := fmt.Sprintf("%x", h.Sum(nil))
		connStr := "host=www.pg.com user=admin dbname=test-db password=admin sslmode=disable"

		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
		}

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
