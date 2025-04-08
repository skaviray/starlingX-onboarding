package main

import (
	"deployer/utils"
	"log"
)

func main() {
	// err := utils.Process()
	// log.Println(err)
	// bmIp := "128.224.210.43"
	// bmUser := "root"
	// bmPass := "KistaAdmin"
	info := utils.BM_INFO{
		BM_IP:   "128.224.210.41",
		BM_USER: "root",
		BM_PASS: "KistaAdmin",
	}
	data, err := utils.GetBiosAttributes(info)
	if err != nil {
		log.Println(err)
	}
	ifaces, err := utils.GetEmbededNetworkInterfaces(info)
	if err != nil {
		log.Println(err)
	}
	log.Println(data)
	for key, attribute := range data {
		value, ok := attribute.(string)
		if !ok {
			value = "NA"
		}
		if value != "" {
			log.Println(key, value)
		}

	}
	log.Println(ifaces)
}
