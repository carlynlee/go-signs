package main

import (
	"log"
	"net/http"

	"github.com/kylerisse/go-signs/signs"
)

func run(c signs.Config) error {
	// Create the server from the signs package
	server := signs.NewServer(c)

	// Optionally serve static files (ensure the `static/` directory exists in your project root)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	// Start the server
	log.Printf("Starting server on %s", c.Address)
	err := server.ListenAndServe()
	if err != nil {
		log.Printf("Server encountered an error: %v", err)
		return err
	}

	return nil
}

func main() {
	// Create a new configuration for the server
	conf := signs.NewServerConfig()

	// Add logging to inspect configuration
	log.Printf("Loaded server configuration: %+v", conf)

	// Run the server
	err := run(conf)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

