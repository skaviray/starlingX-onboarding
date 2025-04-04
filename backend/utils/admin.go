package utils

import (
	db "api/db/sqlc"
	"context"
	"database/sql"
	"fmt"
	"log"
)

// CreateDefaultAdminUser creates a default admin user if it doesn't already exist
func CreateDefaultAdminUser(store db.Store) error {
	// Check if admin user already exists
	ctx := context.Background()
	_, err := store.GetUser(ctx, "admin")
	
	// If user already exists, return without error
	if err == nil {
		log.Println("Admin user already exists, skipping creation")
		return nil
	}
	
	// If error is not "no rows" error, return the error
	if err != sql.ErrNoRows {
		return fmt.Errorf("error checking for admin user: %w", err)
	}
	
	// Create hashed password for "Ammu@2501"
	hashedPassword, err := CreateHashedPassword("Ammu@2501")
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}
	
	// Create admin user
	adminUser := db.CreateUserParams{
		Username:       "admin",
		HashedPassword: hashedPassword,
		Email:          "admin@starlingx.com",
		FullName:       "System Administrator",
	}
	
	_, err = store.CreateUser(ctx, adminUser)
	if err != nil {
		return fmt.Errorf("failed to create admin user: %w", err)
	}
	
	log.Println("Default admin user created successfully")
	return nil
}
