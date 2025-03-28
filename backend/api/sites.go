package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Site struct {
	Name      string
	Id        string
	CreatedAt time.Time
}

var sites = DummySites()

func DummySites() []Site {
	return []Site{
		{
			Name:      "site-1",
			Id:        "1",
			CreatedAt: time.Now(),
		},
		{
			Name:      "site-2",
			Id:        "2",
			CreatedAt: time.Now(),
		},
		{
			Name:      "site-3",
			Id:        "3",
			CreatedAt: time.Now(),
		},
		{
			Name:      "site-4",
			Id:        "4",
			CreatedAt: time.Now(),
		},
		{
			Name:      "site-5",
			Id:        "5",
			CreatedAt: time.Now(),
		},
		{
			Name:      "site-6",
			Id:        "6",
			CreatedAt: time.Now(),
		},
	}
}
func (server *Server) GetSites(ctx *gin.Context) {
	// sites := DummySites()
	ctx.JSON(http.StatusOK, sites)

}

func (server *Server) CreateSites(ctx *gin.Context) {
	var site Site
	ctx.ShouldBindJSON(&site)
	sites = append(sites, site)

}

func (server *Server) GetSiteById(ctx *gin.Context) {

}

func (server *Server) DeleteSiteById(ctx *gin.Context) {

}
