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

func main() {
	r := gin.Default()
	r.GET("/go", func(c *gin.Context) {
		Input := c.Query("Input1") // shortcut for c.Request.URL.Query().Get("lastname")

		//PGUSER=postgres PGPASSWORD=Arsalan995384 PGDATABASE=DB_First PGPORT=5432
		connStr := "user=postgres password=Arsalan995384 sslmode=disable dbname=DB_First"
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
		Input := c.PostForm("Input1") // shortcut for c.Request.URL.Query().Get("lastname")
		h := sha256.New()
		h.Write([]byte(Input))

		//PGUSER=postgres PGPASSWORD=Arsalan995384 PGDATABASE=DB_First PGPORT=5432
		connStr := "user=postgres password=Arsalan995384 sslmode=disable dbname=DB_First"
		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
		}
		//rows, err := db.Query("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '$1'", Input)
		var Key string
		//rows, err := db.Query("SELECT name FROM users WHERE age = $1", age)
		err2 := db.QueryRow("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '" + fmt.Sprintf("%x", h.Sum(nil)) + "'").Scan(&Key)
		if err2 != nil {
			err3 := db.QueryRow("INSERT INTO \"Train\"(\"Key\",\"Hash\") VALUES ('" + Input + "','" + fmt.Sprintf("%x", h.Sum(nil)) + "')")
			if err2 != nil {
				log.Print(err3.Err())
			}
		}
		c.String(http.StatusOK, "%s", fmt.Sprintf("%x", h.Sum(nil)))
	})
	r.Run(":9090")

}
