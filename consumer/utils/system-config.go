package utils

func (authclient AuthClient) GetSystemConfig() error {
	// if authclient.Token == "" {
	// 	return ISystem{}, fmt.Errorf("Token is missing")
	// }
	// client := authclient.NewHttpClient()
	// req := authclient.NewRequest(http.MethodGet, "/isystems")
	// res, err := client.Do(req)
	// if err != nil {
	// 	return ISystem{}, fmt.Errorf(err.Error())
	// }
	// defer res.Body.Close()
	// if res.StatusCode == http.StatusUnauthorized {
	// 	return ISystem{}, fmt.Errorf("unable to authorize")
	// }
	// log.Println(res.StatusCode)
	// var iSystem ISystemsResponse
	// err = json.NewDecoder(res.Body).Decode(&iSystem)
	// if err != nil {
	// 	return ISystem{}, err
	// }
	// log.Println(iSystem)
	// return iSystem.Isystems[0], nil
	return nil
}
