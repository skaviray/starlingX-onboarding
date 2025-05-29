package stx

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func (c *StarlingXClient) authenticate() error {
	payload := AuthPayload{
		Auth: Auth{
			Identity: Identity{
				Methods: []string{"password"},
				Password: Password{
					User: User{
						Name:     c.Username,
						Password: c.Password,
						Domain: Domain{
							Name: c.Domain,
						},
					},
				},
			},
			Scope: Scope{
				Project: Project{
					Name: c.Project,
					Domain: Domain{
						Name: c.Domain,
					},
				},
			},
		},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	url := fmt.Sprintf("https://%s:5000/v3/auth/tokens", c.AuthURL)
	client := http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	req.Header.Add("Content-Type", "application/json")
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusCreated {
		return fmt.Errorf("authentication failed: %s", res.Status)
	}
	token := res.Header.Get("X-Subject-Token")
	if token == "" {
		return fmt.Errorf("unable to fetch the token from %s", url)
	}
	var tokenResponse TokenResponse
	err = json.NewDecoder(res.Body).Decode(&tokenResponse)
	if err != nil {
		log.Println(err)
		return err
	}
	for _, element := range tokenResponse.Token.Catalog {
		log.Println(element.Type)
		if element.Type == "platform" {
			for _, endpoint := range element.Endpoints {
				log.Println(endpoint.Interface)
				if endpoint.Interface == "public" {
					log.Printf("SYSINV: %s", endpoint.URL)
					c.SysInvEndpoint = endpoint.URL
				}
			}

		}
		if element.Type == "dcmanager" {
			for _, endpoint := range element.Endpoints {
				if endpoint.Interface == "public" {
					log.Println(endpoint.Interface)
					log.Printf("DCMANAGER: %s", endpoint.URL)
					c.DcManagerEndpoint = endpoint.URL
				}
			}

		}

	}
	log.Println(tokenResponse.Token.Catalog)
	c.Token = token
	return nil
}
