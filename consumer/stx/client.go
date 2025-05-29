package stx

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/http"
)

type StarlingXClient struct {
	Username          string
	Password          string
	Domain            string
	Project           string
	AuthURL           string
	Token             string
	TenantID          string
	SysInvEndpoint    string
	DcManagerEndpoint string
}

func NewClient(username, password, domain, project, authURL string) (*StarlingXClient, error) {
	client := &StarlingXClient{
		Username: username,
		Password: password,
		Domain:   domain,
		Project:  project,
		AuthURL:  authURL,
	}

	err := client.authenticate()
	if err != nil {
		return nil, err
	}
	return client, nil
}

func (c *StarlingXClient) NewHttpClient() *http.Client {
	client := http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	return &client
}

func (c *StarlingXClient) NewHttpRequest(method, endpoint, path string) *http.Request {
	url := fmt.Sprintf("%s/%s", endpoint, path)
	log.Println(url)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Auth-Token", c.Token)
	log.Println(c.Token)
	return req
}
