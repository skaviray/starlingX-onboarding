package main

import (
	"api/api"
	db "api/db/sqlc"
	"api/utils"
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	// config, err := utils.LoadConfig("/app/")
	config, err := utils.LoadConfig("./")
	if err != nil {
		log.Fatalf("unable to load the config file %e", err)
	}
	if config.AMQP_URL == "" {
		log.Panic("AMQP_URL is not defined...")
	}
	utils.WaitForPostgres(config.DBSource)
	conn, err := sql.Open(config.DBDriver, config.DBSource)
	if err != nil {
		log.Fatalf("cannot connect to db %e", err)
	}
	log.Println("successfully connected to database..")
	store := db.NewStore(conn)

	// Create default admin user during startup
	if err := utils.CreateDefaultAdminUser(store); err != nil {
		log.Printf("Warning: Failed to create admin user: %v", err)
		// Continue application startup even if admin creation fails
	}

	server, err := api.New(store, config)
	if err != nil {
		log.Println(err)
	}
	// go server.ListenForResponses()
	server.Start(config.ListenAddress)
}
