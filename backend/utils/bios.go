package utils

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type BM_INFO struct {
	BM_IP   string
	BM_USER string
	BM_PASS string
}

func redfishGet(client *http.Client, info BM_INFO, path string) ([]byte, error) {
	url := fmt.Sprintf("https://%s%s", info.BM_IP, path)
	req, _ := http.NewRequest("GET", url, nil)
	req.SetBasicAuth(info.BM_USER, info.BM_PASS)
	req.Header.Set("Accept", "application/json")
	res, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer res.Body.Close()
	return io.ReadAll(res.Body)

}

func GetBiosAttributes(info BM_INFO) (map[string]interface{}, error) {
	client := &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	data, err := redfishGet(client, info, "/redfish/v1/Systems/System.Embedded.1/Bios")
	if err != nil {
		return nil, err
	}
	var BiosData map[string]interface{}
	if err := json.Unmarshal(data, &BiosData); err != nil {
		return nil, err
	}
	Attributes, _ := BiosData["Attributes"].(map[string]interface{})
	return Attributes, nil
}
