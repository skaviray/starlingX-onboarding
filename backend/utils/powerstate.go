package utils

import (
	"crypto/tls"
	"encoding/json"
	"log"
	"net/http"
)

func GetPowerState(client *http.Client, bm_info BM_INFO) error {
	client = &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	data, err := redfishGet(client, bm_info, "/redfish/v1/Systems/System.Embedded.1/Actions/ComputerSystem.Reset")

	if err != nil {
		log.Println(err)
		return err
	}
	var ResetData map[string]interface{}

	if err = json.Unmarshal(data, &ResetData); err != nil {
		log.Println(err)
		return err
	}
	log.Println(ResetData)
	return nil
}
