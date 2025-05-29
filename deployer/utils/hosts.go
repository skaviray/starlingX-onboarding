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
	ID int `json:"id"`
	// UUID                 string       `json:"uuid"`
	// Hostname             string       `json:"hostname"`
	// InvProvision         string       `json:"invprovision"`
	// MgmtMAC              string       `json:"mgmt_mac"`
	// MgmtIP               string       `json:"mgmt_ip"`
	// BMIP                 string       `json:"bm_ip"`
	// BMType               string       `json:"bm_type"`
	// BMUsername           string       `json:"bm_username"`
	// Personality          string       `json:"personality"`
	// Subfunctions         string       `json:"subfunctions"`
	// SubfunctionOper      string       `json:"subfunction_oper"`
	// SubfunctionAvail     string       `json:"subfunction_avail"`
	// SerialID             *string      `json:"serialid"`
	// Administrative       string       `json:"administrative"`
	// Operational          string       `json:"operational"`
	// Availability         string       `json:"availability"`
	// Action               string       `json:"action"`
	// IHostAction          string       `json:"ihost_action"`
	// InvState             string       `json:"inv_state"`
	// VIMProgressStatus    string       `json:"vim_progress_status"`
	// Task                 string       `json:"task"`
	// MtceInfo             string       `json:"mtce_info"`
	// Reserved             bool         `json:"reserved"`
	// ConfigStatus         string       `json:"config_status"`
	// ConfigApplied        string       `json:"config_applied"`
	// ConfigTarget         string       `json:"config_target"`
	// ClockSynchronization string       `json:"clock_synchronization"`
	// Uptime               int          `json:"uptime"`
	// Location             struct{}     `json:"location"`
	// Capabilities         Capabilities `json:"capabilities"`
	// ISystemUUID          string       `json:"isystem_uuid"`
	// Peers                *string      `json:"peers"`
	Links []Link `json:"links"`
	// BootDevice          string  `json:"boot_device"`
	// RootFSDevice        string  `json:"rootfs_device"`
	// HWSettle            string  `json:"hw_settle"`
	// InstallOutput       string  `json:"install_output"`
	// Console             string  `json:"console"`
	// TBoot               string  `json:"tboot"`
	// TTyDCD              bool    `json:"ttys_dcd"`
	// AppArmor            string  `json:"apparmor"`
	// SoftwareLoad        string  `json:"software_load"`
	// TargetLoad          string  `json:"target_load"`
	// InstallState        *string `json:"install_state"`
	// InstallStateInfo    *string `json:"install_state_info"`
	// MaxCPUMhzConfigured *int    `json:"max_cpu_mhz_configured"`
	// MaxCPUMhzAllowed    string  `json:"max_cpu_mhz_allowed"`
	// ISCSIInitiatorName  string  `json:"iscsi_initiator_name"`
	// DeviceImageUpdate   *string `json:"device_image_update"`
	// RebootNeeded        bool    `json:"reboot_needed"`
	// CreatedAt           string  `json:"created_at"`
	// UpdatedAt           string  `json:"updated_at"`
}

type Capabilities struct {
	IsMaxCPUConfigurable string `json:"is_max_cpu_configurable"`
	MinCPUMhzAllowed     int    `json:"min_cpu_mhz_allowed"`
	MaxCPUMhzAllowed     int    `json:"max_cpu_mhz_allowed"`
	CStatesAvailable     string `json:"cstates_available"`
	StorFunction         string `json:"stor_function"`
	Personality          string `json:"Personality"`
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
