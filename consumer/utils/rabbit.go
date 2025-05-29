package utils

import (
	"encoding/json"
	"log"

	"github.com/rabbitmq/amqp091-go"
)

var amqpURI = "amqp://user:Li69nux*@localhost:5672/" // RabbitMQ URI

type Message struct {
	Id     int32  `json:"id"`
	Action string `json:"action"`
}

func StartConsumer() {
	conn, err := amqp091.Dial(amqpURI) // Updated method
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %s", err)
	}
	defer conn.Close()
	log.Println("Successfully connected to rabbitmq..")
	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %s", err)
	}
	defer ch.Close()
	// Declare the queue
	queue, err := ch.QueueDeclare(
		"task_queue", // Queue name
		true,         // Durable
		false,        // Delete when unused
		false,        // Exclusive
		false,        // NoWait
		nil,          // Arguments
	)
	if err != nil {
		log.Fatalf("Failed to declare a queue: %s", err)
	}
	// Start consuming from the queue
	msgs, err := ch.Consume(
		queue.Name, // Queue name
		"",         // Consumer name
		true,       // AutoAck
		false,      // Exclusive
		false,      // NoLocal
		false,      // NoWait
		nil,        // Arguments
	)
	if err != nil {
		log.Fatalf("Failed to register a consumer: %s", err)
	}
	log.Println("Waiting for messages....")
	// Consume messages
	for msg := range msgs {
		var task Message
		if err := json.Unmarshal(msg.Body, &task); err != nil {
			log.Printf("Failed to unmarshal task message: %v", err)
			continue
		}
		if err != nil {
			log.Printf("Failed to unmarshal message: %s", err)
			continue
		}
		go handleMessages(task)
	}
}

func handleMessages(msg Message) {
	log.Println(msg.Id)
	log.Println(msg.Action)

	switch msg.Action {
	case "import":
		log.Printf("go the import request for the task id %d", msg.Id)

	case "create":
		log.Printf("got the create request for id %d", msg.Id)
	}
}
