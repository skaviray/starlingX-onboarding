package src

import (
	"context"
	"log"
	db "worker/db/sqlc"
	"worker/stx"
)

func (consumer *Consumer) ImportSystemController(id int32) {
	sc, err := consumer.Store.GetSystemController(context.TODO(), id)
	if err != nil {
		log.Println(err)
	}
	// endpoint := fmt.Sprintf("https://%s:5000")
	// auth := utils.AuthClient{
	// 	Endpoint: fmt.Sprintf("https://%s:5000", sc.OamFloating),
	// 	Username: "admin",
	// 	Project:  "admin",
	// 	Password: sc.AdminPass,
	// 	Domain:   "Default",
	// }
	// url := fmt.Sprintf("https://%s", sc.OamFloating)
	client, err := stx.NewClient("admin", sc.AdminPass, "Default", "admin", sc.OamFloating)
	if err != nil {
		log.Println(err)
		status := db.UpdateSystemControllerStatusParams{
			ID:           sc.ID,
			Status:       "failed-import",
			FailedReason: err.Error(),
		}
		sc, err := consumer.Store.UpdateSystemControllerStatus(context.TODO(), status)
		if err != nil {
			log.Println(err)
		}
		log.Println(sc)
		return
	}
	log.Println(client.Token)
	log.Println(client.DcManagerEndpoint)
	log.Println(client.SysInvEndpoint)
	// if err := auth.GetToken(); err != nil {
	// 	log.Println(err)
	// 	staus := db.UpdateSystemControllerStatusParams{
	// 		ID:           sc.ID,
	// 		Status:       "failed-import",
	// 		FailedReason: err.Error(),
	// 	}
	// 	_, err := consumer.Store.UpdateSystemControllerStatus(context.TODO(), staus)
	// 	if err != nil {
	// 		log.Println(err)
	// 		return
	// 	}
	// 	return
	// }
	// if err := auth.GetToken(); err != nil {
	// 	staus := db.UpdateSystemControllerStatusParams{
	// 		ID:           sc.ID,
	// 		Status:       "failed-import",
	// 		FailedReason: err.Error(),
	// 	}
	// 	_, err := consumer.Store.UpdateSystemControllerStatus(context.TODO(), staus)
	// 	if err != nil {
	// 		log.Println(err)
	// 		return
	// 	}
	// 	return
	// }
	systemSelfLink, err := client.GetSystemSelfLink()
	if err != nil {
		status := db.UpdateSystemControllerStatusParams{
			ID:           sc.ID,
			Status:       "failed-import",
			FailedReason: err.Error(),
		}
		sc, err := consumer.Store.UpdateSystemControllerStatus(context.TODO(), status)
		if err != nil {
			log.Println(err)
			return
		}
		log.Println(sc)
		return
	}
	// var selfLink string
	// for _, link := range system.Links {
	// 	if link.Rel == "self" {
	// 		selfLink = link.Href
	// 	}
	// }
	params := db.UpdateSystemControllerLinkParams{
		ID:   sc.ID,
		Link: systemSelfLink,
	}
	_, err = consumer.Store.UpdateSystemControllerLink(context.TODO(), params)
	if err != nil {
		status := db.UpdateSystemControllerStatusParams{
			ID:           sc.ID,
			Status:       "failed-import",
			FailedReason: err.Error(),
		}
		_, err := consumer.Store.UpdateSystemControllerStatus(context.TODO(), status)
		if err != nil {
			log.Println(err)
			return
		}
		return
	}
	status := db.UpdateSystemControllerStatusParams{
		ID:           sc.ID,
		Status:       "imported",
		FailedReason: "",
	}
	_, err = consumer.Store.UpdateSystemControllerStatus(context.TODO(), status)
	if err != nil {
		log.Println(err)
		return
	}
}
