package utils

import (
	"crypto/tls"
	"encoding/json"
	"log"
	"net/http"
)

func GetPowerState(bm_info BM_INFO) error {
	client := &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	data, err := redfishGet(client, bm_info, "/redfish/v1/Systems/System.Embedded.1")

	if err != nil {
		log.Println(err)
		return err
	}
	var ResetData map[string]interface{}

	if err = json.Unmarshal(data, &ResetData); err != nil {
		log.Println(err)
		return err
	}
	actions := ResetData["Actions"].(map[string]interface{})
	actions = actions["#ComputerSystem.Reset"].(map[string]interface{})
	actions = actions["ResetType@Redfish.AllowableValues"].(map[string]interface{})

	log.Println(actions)
	return nil
}
