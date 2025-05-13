package api

import (
	"encoding/json"
	"fmt"

	"github.com/rabbitmq/amqp091-go" // Updated import
)

type ImportRequest struct {
	Name string `json:"name"`
	Tag  int    `json:"tag"`
}

var amqpURI = "amqp://user:Li69nux*@localhost:5672/" // RabbitMQ URI

type Message struct {
	Id     int32  `json:"id"`
	Action string `json:"action"`
}

func SendToQueue(msg Message) error {
	conn, err := amqp091.Dial(amqpURI)
	if err != nil {
		return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return fmt.Errorf("failed to open a channel: %w", err)
	}
	defer ch.Close()

	queue, err := ch.QueueDeclare(
		"task_queue",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to declare a queue: %w", err)
	}

	body, err := json.Marshal(msg)
	if err != nil {
		return fmt.Errorf("failed to marshal task message: %w", err)
	}

	err = ch.Publish(
		"",
		queue.Name,
		false,
		false,
		amqp091.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
	return err
}

// func (server *Server) ListenForResponses() {
// 	conn, err := amqp091.Dial(amqpURI)
// 	if err != nil {
// 		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
// 	}
// 	defer conn.Close()
// 	log.Println("Successfully connected to rabbitmq...")
// 	ch, err := conn.Channel()
// 	if err != nil {
// 		log.Fatalf("Failed to open a channel: %v", err)
// 	}
// 	defer ch.Close()

// 	queue, err := ch.QueueDeclare(
// 		"response_queue",
// 		true,
// 		false,
// 		false,
// 		false,
// 		nil,
// 	)
// 	if err != nil {
// 		log.Fatalf("Failed to declare a queue: %v", err)
// 	}

// 	msgs, err := ch.Consume(
// 		queue.Name,
// 		"",
// 		true,
// 		false,
// 		false,
// 		false,
// 		nil,
// 	)
// 	if err != nil {
// 		log.Fatalf("Failed to register a consumer: %v", err)
// 	}
// 	log.Println("Listening for messages...")
// 	for msg := range msgs {
// 		var response Response
// 		if err := json.Unmarshal(msg.Body, &response); err != nil {
// 			log.Printf("Failed to unmarshal response: %v", err)
// 			continue
// 		}
// 		taskID := response.TaskID
// 		status := response.Status
// 		taskType := response.TaskType
// 		log.Println(taskType)
// 		log.Printf("%d,%s", taskID, status)
// 		switch taskType {
// 		case "vlan":
// 			continue

// 		case "vxlan_tunnel":
// 			continue
// 		}
// 	}
// }
