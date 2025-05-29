package stx

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func (c *StarlingXClient) GetSystemSelfLink() (selfLink string, err error) {
	client := c.NewHttpClient()
	req := c.NewHttpRequest(http.MethodGet, c.SysInvEndpoint, "isystems")
	res, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	if res.StatusCode == http.StatusUnauthorized {
		return "", fmt.Errorf("unable to authorize")
	}
	log.Println(res.StatusCode)
	var iSystem ISystemsResponse
	err = json.NewDecoder(res.Body).Decode(&iSystem)
	if err != nil {
		return "", err
	}
	log.Println(iSystem.Isystems)
	for _, link := range iSystem.Isystems[0].Links {
		if link.Rel == "self" {
			selfLink = link.Href
		}
	}
	log.Println(selfLink)
	return
}
