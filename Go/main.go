package main

import (
	"database/sql"
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
		connStr := "user=postgres password=Arsalan995384 dbname=DB_First"
		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
		}
		//rows, err := db.Query("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '$1'", Input)
		var Key string
		db.QueryRow("SELECT \"Key\" FROM public.\"Train\" where \"Hash\" = '$1'", Input).Scan(&Key)
		c.String(http.StatusOK, "Hello %s", Key[0])
	})
	r.Run(":9090")

}

/*

 */
