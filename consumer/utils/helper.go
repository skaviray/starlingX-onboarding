package utils

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

func WaitForPostgres(dsn string) {
	for {
		db, err := sql.Open("postgres", dsn)
		if err == nil {
			if err = db.Ping(); err == nil {
				db.Close()
				fmt.Println("Postgres is ready!")
				break
			}
		}
		log.Println(err)
		fmt.Println("Waiting for Postgres...")
		time.Sleep(2 * time.Second)
	}
}
