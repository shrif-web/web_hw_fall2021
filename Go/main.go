package main

import (
	"crypto/sha256"
	"database/sql"
	//"fmt"
	"log"
	"net/http"
	b64 "encoding/base64"
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
	//r.GET("/node", func(c *gin.Context) {	
		Input := c.Query("Input1") // shortcut for c.Request.URL.Query().Get("lastname")
		//PGUSER=postgres PGPASSWORD=Arsalan995384 PGDATABASE=DB_First PGPORT=5432
		// connStr := "user=postgres password=Arsalan995384 sslmode=disable dbname=DB_First"
		connStr := "user=postgres password=amir1379 sslmode=disable dbname=My_db"
		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
		}
		//rows, err := db.Query("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '$1'", Input)
		var Key string
		//rows, err := db.Query("SELECT name FROM users WHERE age = $1", age)
		err2 := db.QueryRow("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '" + Input + "'").Scan(&Key)
		if err2 != nil {
			c.String(http.StatusOK, "No Record Found!")
			//log.Fatal(err2)
		} else {
			c.String(http.StatusOK, "Hello %s", Key)
		}
	})
	r.POST("/go", func(c *gin.Context) {
	//r.POST("/node", func(c *gin.Context) {		
		Key := c.PostForm("Input1") // shortcut for c.Request.URL.Query().Get("lastname")
		// deleted
		// h := sha256.New()
		// new 
		// hash := sha256.Sum256(Key)
		// hash_str := b64.StdEncoding.EncodeToString(hash)
		hash := b64.StdEncoding.EncodeToString(NewSHA256([]byte(Key)))
		//
		// deleted
		// h.Write([]byte(Input))

		//PGUSER=postgres PGPASSWORD=Arsalan995384 PGDATABASE=DB_First PGPORT=5432
		// connStr := "user=postgres password=Arsalan995384 sslmode=disable dbname=DB_First"
		connStr := "user=postgres password=amir1379 sslmode=disable dbname=My_db"
		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
			//log.Print(err)
		}
		//rows, err := db.Query("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '$1'", Input)
		var Key_t string
		//rows, err := db.Query("SELECT name FROM users WHERE age = $1", age)
		// err2 := db.QueryRow("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '" + fmt.Sprintf("%x", h.Sum(nil)) + "'").Scan(&Key)
		err2 := db.QueryRow("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '" + hash + "'").Scan(&Key_t)
		if err2 != nil {
			// err3 := db.QueryRow("INSERT INTO \"Train\"(\"Key\",\"Hash\") VALUES ('" + Input + "','" + fmt.Sprintf("%x", h.Sum(nil)) + "')")
			err3 := db.QueryRow("INSERT INTO \"Train\"(\"Key\",\"Hash\") VALUES ('" + Key + "','" + hash + "')")
			// if err2 != nil {
			if err3 != nil {
				// log.Print(err2.Err())
				log.Fatal(err3)
			}
		}
		// c.String(http.StatusOK, "%s", fmt.Sprintf("%x", h.Sum(nil)))
		c.String(http.StatusOK, "%s",  hash )
	})
	r.Run(":9090")
}
