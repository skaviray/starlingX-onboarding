package src

import (
	"context"
	"fmt"
	"log"
	db "worker/db/sqlc"
	"worker/utils"
)

func (consumer *Consumer) ImportSystemController(id int32) {
	sc, err := consumer.Store.GetSystemController(context.TODO(), id)
	if err != nil {
		log.Println(err)
	}
	// endpoint := fmt.Sprintf("https://%s:5000")
	auth := utils.AuthClient{
		Endpoint: fmt.Sprintf("https://%s:5000", sc.OamFloating),
		Username: "admin",
		Project:  "admin",
		Password: sc.AdminPass,
		Domain:   "Default",
	}
	log.Println(auth)
	if err := auth.GetToken(); err != nil {
		log.Println(err)
		staus := db.UpdateSystemControllerStatusParams{
			ID:           sc.ID,
			Status:       "failed-import",
			FailedReason: err.Error(),
		}
		_, err := consumer.Store.UpdateSystemControllerStatus(context.TODO(), staus)
		if err != nil {
			log.Println(err)
			return
		}
		return
	}
	if err := auth.GetToken(); err != nil {
		staus := db.UpdateSystemControllerStatusParams{
			ID:           sc.ID,
			Status:       "failed-import",
			FailedReason: err.Error(),
		}
		_, err := consumer.Store.UpdateSystemControllerStatus(context.TODO(), staus)
		if err != nil {
			log.Println(err)
			return
		}
		return
	}
	system, err := auth.GetSystemConfig()
	if err != nil {
		staus := db.UpdateSystemControllerStatusParams{
			ID:           sc.ID,
			Status:       "failed-import",
			FailedReason: err.Error(),
		}
		_, err := consumer.Store.UpdateSystemControllerStatus(context.TODO(), staus)
		if err != nil {
			log.Println(err)
			return
		}
		return
	}
	var selfLink string
	for _, link := range system.Links {
		if link.Rel == "self" {
			selfLink = link.Href
		}
	}
	params := db.UpdateSystemControllerLinkParams{
		ID:   sc.ID,
		Link: selfLink,
	}
	_, err = consumer.Store.UpdateSystemControllerLink(context.TODO(), params)
	if err != nil {
		staus := db.UpdateSystemControllerStatusParams{
			ID:           sc.ID,
			Status:       "failed-import",
			FailedReason: err.Error(),
		}
		_, err := consumer.Store.UpdateSystemControllerStatus(context.TODO(), staus)
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
