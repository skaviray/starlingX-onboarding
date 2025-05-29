package stx

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func (c *StarlingXClient) GetSystemConfig(endpoint string) (ISystem, error) {
	client := c.NewHttpClient()
	req := c.NewHttpRequest(http.MethodGet, endpoint)
	res, err := client.Do(req)
	if err != nil {
		return ISystem{}, err
	}
	defer res.Body.Close()
	if res.StatusCode == http.StatusUnauthorized {
		return ISystem{}, fmt.Errorf("unable to authorize")
	}
	var iSystem ISystem
	err = json.NewDecoder(res.Body).Decode(&iSystem)
	if err != nil {
		return ISystem{}, err
	}
	log.Println(iSystem)
	return iSystem, nil
}
