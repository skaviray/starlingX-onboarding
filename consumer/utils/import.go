package utils

import "log"

func ImportSystemController(auth AuthClient) error {
	if err := auth.GetToken(); err != nil {
		log.Println(err)
		return err
	}
	_, err := auth.GetSystemConfig()
	if err != nil {
		return err
	}
	_, err = auth.GetHosts()
	if err != nil {
		return err
	}
	return nil

}
