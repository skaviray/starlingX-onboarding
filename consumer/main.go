package main

import (
	"database/sql"
	"log"
	db "worker/db/sqlc"
	"worker/src"
	"worker/utils"

	_ "github.com/lib/pq"
)

func main() {
	config, err := utils.LoadConfig("./")
	if err != nil {
		log.Fatalf("unable to load the config file %e", err)
	}
	if config.AMQP_URL == "" {
		log.Panic("AMQP_URL is not defined...")
	}
	log.Println(config.DBSource)
	utils.WaitForPostgres(config.DBSource)
	conn, err := sql.Open(config.DBDriver, config.DBSource)
	if err != nil {
		log.Fatalf("cannot connect to db %e", err)
	}
	log.Println("successfully connected to database..")
	store := db.NewStore(conn)
	consumer := src.New(store, config)
	consumer.StartConsumer()

}
