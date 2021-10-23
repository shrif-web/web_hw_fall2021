package main

import (
	"crypto/sha256"
	"database/sql"

	//"fmt"
	b64 "encoding/base64"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func NewSHA256(data []byte) []byte {
	hash := sha256.Sum256(data)
	return hash[:]
}

func main() {
	r := gin.Default()
	r.GET("/go", func(c *gin.Context) {
		Input := c.Query("Input1")
		connStr := "user=postgres password=Arsalan995384 sslmode=disable dbname=DB_First"
		//connStr := "user=postgres password=amir1379 sslmode=disable dbname=My_db"
		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
		}
		var Key string
		err2 := db.QueryRow("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '" + Input + "'").Scan(&Key)
		if err2 == nil {
			c.String(http.StatusOK, "No Record Found!")
			//log.Fatal(err2)
		} else {
			c.String(http.StatusOK, "Hello %s", Key)
		}
	})
	r.POST("/go", func(c *gin.Context) {
		Key := c.PostForm("Input1") // shortcut for c.Request.URL.Query().Get("lastname")
		hash := b64.StdEncoding.EncodeToString(NewSHA256([]byte(Key)))
		connStr := "user=postgres password=Arsalan995384 sslmode=disable dbname=DB_First"
		//connStr := "user=postgres password=amir1379 sslmode=disable dbname=My_db"
		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
			//log.Print(err)
		}
		var Key_t string
		err2 := db.QueryRow("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '" + hash + "'").Scan(&Key_t)
		if err2 != nil {
			err3 := db.QueryRow("INSERT INTO \"Train\"(\"Key\",\"Hash\") VALUES ('" + Key + "','" + hash + "')")
			if err3 == nil {
				// log.Print(err2.Err())
				log.Fatal(err3)
			}
		}
		c.String(http.StatusOK, "%s", hash)
	})
	r.Run(":9090")
}
