package utils

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"

	"gopkg.in/yaml.v2"
)

type SubcloudResponse struct {
	Subclouds []Subcloud `json:"subclouds"`
}
type Subcloud struct {
	ID                        int                  `json:"id"`
	SubcloudID                int                  `json:"subcloud_id"`
	GroupID                   int                  `json:"group_id"`
	Name                      string               `json:"name"`
	Description               string               `json:"description"`
	Location                  string               `json:"location"`
	SoftwareVersion           string               `json:"software-version"`
	AvailabilityStatus        string               `json:"availability-status"`
	DeployStatus              string               `json:"deploy-status"`
	BackupStatus              string               `json:"backup-status"`
	BackupDatetime            string               `json:"backup-datetime"` // can be time.Time if parsed
	PrestageStatus            string               `json:"prestage-status"`
	PrestageVersions          string               `json:"prestage-versions"`
	RegionName                string               `json:"region-name"`
	OpenstackInstalled        bool                 `json:"openstack-installed"`
	ManagementState           string               `json:"management-state"`
	SystemcontrollerGatewayIP string               `json:"systemcontroller-gateway-ip"`
	ManagementStartIP         string               `json:"management-start-ip"`
	ManagementEndIP           string               `json:"management-end-ip"`
	ManagementSubnet          string               `json:"management-subnet"`
	ManagementGatewayIP       string               `json:"management-gateway-ip"`
	CreatedAt                 string               `json:"created-at"`   // can be time.Time if parsed
	UpdatedAt                 string               `json:"updated-at"`   // can be time.Time if parsed
	DataInstall               interface{}          `json:"data_install"` // could be nil or a struct/map
	DataUpgrade               interface{}          `json:"data_upgrade"`
	SyncStatus                string               `json:"sync_status"`
	EndpointSyncStatus        []EndpointSyncStatus `json:"endpoint_sync_status"`
}

type EndpointSyncStatus struct {
	SyncStatus   string `json:"sync_status"`
	EndpointType string `json:"endpoint_type"`
}

type SubcloudCreateParams struct {
	Name                           string `json:"name"`
	SystemMode                     string `json:"system_mode"`
	ManagementSubnet               string `json:"management_subnet"`
	ManagementStartAddress         string `json:"management_start_address"`
	ManagementEndAddress           string `json:"management_end_address"`
	ManagementGatewayAddress       string `json:"management_gateway_address"`
	SystemControllerGatewayAddress string `json:"systemcontroller_gateway_address"`
	ExternalOAMSubnet              string `json:"external_oam_subnet"`
	ExternalOAMGatewayAddress      string `json:"external_oam_gateway_address"`
	ExternalOAMFloatingAddress     string `json:"external_oam_floating_address"`
	SysadminPassword               string `json:"sysadmin_password"`
	BootstrapAddress               string `json:"bootstrap-address"`
	Description                    string `json:"description"`
	Location                       string `json:"location"`
}

func (c AuthClient) CreateSubcloud(params SubcloudCreateParams) error {
	if c.Token == "" {
		return fmt.Errorf("unable to authenticate")
	}
	client := http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	bootstrapYaml, _ := yaml.Marshal(&params)
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)
	bv, err := writer.CreateFormFile("bootstrap_values", "files/bootstrap.yaml")
	if err != nil {
		return err
	}
	bv.Write(bootstrapYaml)
	url := fmt.Sprintf("%s/subclouds", c.DcManagerEndpoint)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Println(err)
		return err
	}
	req.Header.Set("X-Auth-Token", c.Token)
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Request failed:", err)
		return err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	fmt.Println("Response:", string(body))
	return nil

}

func (c AuthClient) GetSubclouds() ([]Subcloud, error) {
	if c.Token == "" {
		return nil, fmt.Errorf("unable to authenticate")
	}
	client := http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	url := fmt.Sprintf("%s/subclouds", c.DcManagerEndpoint)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Auth-Token", c.Token)
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		return nil, err
	}
	var subclouds SubcloudResponse
	err = json.NewDecoder(res.Body).Decode(&subclouds)
	if err != nil {
		return nil, err
	}
	log.Println(subclouds)
	return subclouds.Subclouds, nil
}
