package utils

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

var ACCEPTABLE_ACTIONS = []string{"unlock", "lock", "swact", "apply-profile", "reboot", "reset", "power-on", "power-off", "reinstall", "force-lock"}

type NodeAction struct {
	HostId int32  `json:"host_id"`
	Action string `json:"action"`
}
type IHostResponse struct {
	IHosts []IHost `json:"ihosts"`
}
type IHost struct {
	Links []Link `json:"links"`
}

type Link struct {
	Href string `json:"href"`
	Rel  string `json:"rel"`
}

type Clusters struct {
}

type KubeCluster struct {
	ClusterName        string `json:"cluster_name"`
	ClusterVersion     string `json:"cluster_version"`
	ClusterAPIEndpoint string `json:"cluster_api_endpoint"`
	ClusterCACert      string `json:"cluster_ca_cert"`
	AdminClientCert    string `json:"admin_client_cert"`
	AdminClientKey     string `json:"admin_client_key"`
	AdminUser          string `json:"admin_user"`
	AdminToken         string `json:"admin_token"`
}

func (authclient AuthClient) GetHosts() ([]IHost, error) {
	if authclient.Token == "" {
		return nil, fmt.Errorf("unable to authenticate")
	}
	client := authclient.NewHttpClient()
	req := authclient.NewRequest(http.MethodGet, "/ihosts")
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode == http.StatusUnauthorized {
		return nil, fmt.Errorf("unable to authorize")
	}
	var ihosts IHostResponse
	err = json.NewDecoder(res.Body).Decode(&ihosts)
	if err != nil {
		return nil, err
	}
	log.Println(ihosts)
	return ihosts.IHosts, nil
}

func contains(slice []string, val string) bool {
	for _, v := range slice {
		if v == val {
			return true
		}
	}
	return false
}

func (authclient AuthClient) PerformAction(action NodeAction) error {
	if !contains(ACCEPTABLE_ACTIONS, action.Action) {
		return fmt.Errorf("%s is not supported action", action.Action)
	}
	client := http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	url := fmt.Sprintf("%s/ihosts", authclient.SysInvEndpoint)
	payload := []map[string]string{
		{
			"op":    "replace",
			"path":  "/action",
			"value": action.Action,
		},
	}
	jsonPayloads, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	req, err := http.NewRequest(http.MethodPatch, url, bytes.NewBuffer([]byte(jsonPayloads)))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Auth-Token", authclient.Token)
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode == http.StatusUnauthorized {
		return fmt.Errorf("unable to authorize")
	} else if res.StatusCode != http.StatusOK {
		return fmt.Errorf("%s : %d", res.Status, res.StatusCode)
	}
	return nil
}

func (authclient AuthClient) LockHost(id int32) error {
	action := NodeAction{
		HostId: id,
		Action: "sslock",
	}
	if err := authclient.PerformAction(action); err != nil {
		return err
	}
	return nil
}

func (authclient AuthClient) GetKubeConfig() ([]KubeCluster, error) {
	if authclient.Token == "" {
		return nil, fmt.Errorf("unable to authenticate")
	}
	client := http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	url := fmt.Sprintf("%s/kube_clusters", authclient.SysInvEndpoint)
	log.Println(url)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Auth-Token", authclient.Token)
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unable to do perform the get call: staus code %s", res.Status)
	}
	var KubeClusterList struct {
		KubeClusters []KubeCluster `json:"kube_clusters"`
	}
	if err := json.NewDecoder(res.Body).Decode(&KubeClusterList); err != nil {
		return nil, err
	}
	return KubeClusterList.KubeClusters, nil

}
