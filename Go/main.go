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
		rows, _ := db.Query("SELECT count(\"Key\") FROM public.\"Train\" where \"Hash\" = '" + Input + "'")
		i := 0
		for rows.Next() {
			rows.Scan(&i)
		}
		log.Print(i)
		rows.Close()

		rows, _ = db.Query("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '" + Input + "'")
		var k string
		for rows.Next() {
			rows.Scan(&k)
		}
		log.Print(k)

		if i == 0 {
			c.String(http.StatusOK, "No Record Found!")
			//log.Fatal(err2)
		} else {
			c.String(http.StatusOK, "Hello %s", k)
		}
	})
	r.POST("/go", func(c *gin.Context) {
		Key := c.PostForm("Input1") // shortcut for c.Request.URL.Query().Get("lastname")
		// hash := b64.StdEncoding.EncodeToString(NewSHA256([]byte(Key))) // Erfan Wrong Casting
		h := sha256.New()
		h.Write([]byte(Key))
		hash := fmt.Sprintf("%x", h.Sum(nil))
		connStr := "user=postgres password=Arsalan995384 sslmode=disable dbname=DB_First"
		//connStr := "user=postgres password=amir1379 sslmode=disable dbname=My_db"
		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
		}

		/*
			rows, _ := db.Query("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '" + hash + "'")

			//defer rows.Close()
				i := 0
				for rows.Next() {
					i = i + 1
				}
				log.Print(i)
				log.Print(hash)
		*/
		rows, _ := db.Query("SELECT count(\"Key\") FROM public.\"Train\" where \"Hash\" = '" + hash + "'")
		i := 0
		for rows.Next() {
			rows.Scan(&i)
			log.Print(i)
		}
		if i == 1 {
			c.String(http.StatusOK, "%s", hash)
		} else {
			err3 := db.QueryRow("INSERT INTO \"Train\"(\"Key\",\"Hash\") VALUES ('" + Key + "','" + hash + "')")
			if err3 == nil {
				log.Fatal(err3)
			}
		}
	})
	r.Run(":9090")
}
