package utils

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type AuthClient struct {
	Endpoint          string
	SysInvEndpoint    string
	DcManagerEndpoint string
	Username          string
	Password          string
	Domain            string
	Project           string
	Token             string
}

type AuthPayload struct {
	Auth Auth `json:"auth"`
}

type Auth struct {
	Identity Identity `json:"identity"`
	Scope    Scope    `json:"scope"`
}

type Identity struct {
	Methods  []string `json:"methods"`
	Password Password `json:"password"`
}

type Password struct {
	User User `json:"user"`
}

type User struct {
	Name     string `json:"name"`
	Domain   Domain `json:"domain"`
	Password string `json:"password"`
}

type Domain struct {
	Name string `json:"name"`
}

type Scope struct {
	Project Project `json:"project"`
}

type Project struct {
	Name   string `json:"name"`
	Domain Domain `json:"domain"`
}

func (c *AuthClient) GetToken() error {
	authPayload := AuthPayload{
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
	payload, err := json.Marshal(authPayload)
	if err != nil {
		log.Println(err)
		return err
	}
	url := fmt.Sprintf("%s/v3/auth/tokens", c.Endpoint)
	client := http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(payload))
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
		body_bytes, _ := io.ReadAll(res.Body)
		return fmt.Errorf("failed to authenticate: %s", body_bytes)
	}
	c.Token = res.Header.Get("X-Subject-Token")
	c.SysInvEndpoint = "https://128.224.212.100:6385/v1"
	c.DcManagerEndpoint = "https://128.224.212.100:8119/v1.0"
	return nil

}

func (c *AuthClient) NewHttpClient() *http.Client {
	client := http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	return &client
}

func (c *AuthClient) NewRequest(method, path string) *http.Request {
	url := fmt.Sprintf("%s%s", c.SysInvEndpoint, path)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Auth-Token", c.Token)
	log.Println(c.Token)
	return req
}
