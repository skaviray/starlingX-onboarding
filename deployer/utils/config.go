package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type ISystemsResponse struct {
	Isystems []ISystem `json:"isystems"`
}

type ISystem struct {
	UUID            string        `json:"uuid"`
	SoftwareVersion string        `json:"software_version"`
	Name            string        `json:"name"`
	Links           []SystemLinks `json:"links"`
	CreatedAt       string        `json:"created_at"`
	UpdatedAt       string        `json:"updated_at"`
	Contact         *string       `json:"contact"`
	Location        *string       `json:"location"`
	Latitude        *string       `json:"latitude"`
	Longitude       *string       `json:"longitude"`
	Description     string        `json:"description"`
	SystemType      string        `json:"system_type"`
	SystemMode      string        `json:"system_mode"`
	Timezone        string        `json:"timezone"`
	Capabilities    Capabilities  `json:"capabilities"`
}

type SystemLinks struct {
	Href string `json:"href"`
	Rel  string `json:"rel"`
}

type SystemCapabilities struct {
	SdnEnabled     bool   `json:"sdn_enabled"`
	SharedServices string `json:"shared_services"`
	BMRegion       string `json:"bm_region"`
	CinderBackend  string `json:"cinder_backend"`
	HTTPSEnabled   bool   `json:"https_enabled"`
	RegionConfig   bool   `json:"region_config"`
}

func (authclient AuthClient) GetSystemConfig() (ISystem, error) {
	if authclient.Token == "" {
		return ISystem{}, fmt.Errorf("Token is missing")
	}
	client := authclient.NewHttpClient()
	req := authclient.NewRequest(http.MethodGet, "/isystems")
	res, err := client.Do(req)
	if err != nil {
		return ISystem{}, fmt.Errorf(err.Error())
	}
	defer res.Body.Close()
	if res.StatusCode == http.StatusUnauthorized {
		return ISystem{}, fmt.Errorf("unable to authorize")
	}
	log.Println(res.StatusCode)
	var iSystem ISystemsResponse
	err = json.NewDecoder(res.Body).Decode(&iSystem)
	if err != nil {
		return ISystem{}, err
	}
	log.Println(iSystem)
	return iSystem.Isystems[0], nil
}
