package utils

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"net/http"
)

type OdataMember struct {
	OdataID string `json:"@odata.id"`
}

type AdapterCollection struct {
	Members []OdataMember `json:"Members"`
}

type NetworkPort struct {
	ID string `json:"Id"`
	// Name                       string   `json:"Name"`
	LinkStatus                 string   `json:"LinkStatus"`
	AssociatedNetworkAddresses []string `json:"AssociatedNetworkAddresses"`
	VendorId                   string   `json:"VendorId"`
}

type PortCollection struct {
	Members []OdataMember `json:"Members"`
}

func GetEmbededNetworkInterfaces(info BM_INFO) ([]NetworkPort, error) {
	client := &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	data, err := redfishGet(client, info, "/redfish/v1/Chassis/System.Embedded.1/NetworkAdapters")
	if err != nil {
		return nil, err
	}
	// var interfaces map[string]interface{}
	var adapters AdapterCollection
	var portsInfo []NetworkPort
	if err := json.Unmarshal(data, &adapters); err != nil {
		return nil, err
	}
	for _, adapter := range adapters.Members {
		fmt.Println("Adapter: ", adapter.OdataID)
		portsUrl := adapter.OdataID + "/NetworkPorts"

		portsData, err := redfishGet(client, info, portsUrl)
		if err != nil {
			return nil, err
		}

		var ports PortCollection
		if err := json.Unmarshal(portsData, &ports); err != nil {
			return nil, err
		}

		for _, port := range ports.Members {
			portData, err := redfishGet(client, info, port.OdataID)
			if err != nil {
				return nil, err
			}
			var networkPort NetworkPort
			if err := json.Unmarshal(portData, &networkPort); err != nil {
				return nil, err
			}
			portsInfo = append(portsInfo, networkPort)
		}
	}
	return portsInfo, nil
}
