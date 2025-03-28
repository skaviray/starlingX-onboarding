package main

import (
	"deployer/utils"
	"log"
)

func main() {
	err := utils.Process()
	log.Println(err)
}
