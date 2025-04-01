package api

import (
	db "api/db/sqlc"
	"api/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateSubcloudReq struct {
	Name               string       `json:"name"`
	SystemControllerId int32        `json:"system_controller_id" binding:"required"`
	IpAdress           string       `json:"ip_address" binding:"required,ipv4"`
	OAM_FLOATING_IP    string       `json:"oam_floating" binding:"required,ipv4"`
	OAM_CONTROLLER_0   string       `json:"oam_controller_0" binding:"required,ipv4"`
	OAM_CONTROLLER_1   string       `json:"oam_controller_1" binding:"required,ipv4"`
	CONFIG             SystemConfig `json:"config" binding:"required"`
	SyncStatus         string       `json:"sync_status"`
}

func (server *Server) CreateSubcloud(ctx *gin.Context) {
	var scParams CreateSubcloudReq
	if err := ctx.ShouldBindJSON(&scParams); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}
	args := db.CreateSubcloudParams{
		Name:               scParams.Name,
		SystemControllerID: scParams.SystemControllerId,
		OamFloating:        scParams.OAM_FLOATING_IP,
		OamController0:     scParams.OAM_CONTROLLER_0,
		OamController1:     scParams.OAM_CONTROLLER_1,
		Config:             "hello",
		// IpAddress:          scParams.IpAdress,
		SyncStatus: "unknown",
	}
	Subcloud, err := server.store.CreateSubcloud(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, Subcloud)
}

// type ListSubcloudParams struct {
// 	PageId   int32 `form:"page_id" binding:"required,min=1"`
// 	PageSize int32 `form:"page_size" binding:"required,min=5,max=10"`
// }

func (server *Server) ListSubclouds(ctx *gin.Context) {
	// var params ListSubcloudParams
	// if err := ctx.ShouldBindQuery(&params); err != nil {
	// 	ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
	// 	return
	// }
	// args := db.ListSubcloudsParams{
	// 	Limit:  params.PageSize,
	// 	Offset: params.PageId,
	// }
	Subclouds, err := server.store.ListSubclouds(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, Subclouds)

}

type SubcloudByIdParams struct {
	Id int32 `uri:"id" binding:"required"`
}

func (server *Server) GetSubcloudById(ctx *gin.Context) {
	var params SubcloudByIdParams
	if err := ctx.ShouldBindUri(&params); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}
	Subcloud, err := server.store.GetSubcloud(ctx, params.Id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, Subcloud)
}

func (server *Server) DeleteSubcloud(ctx *gin.Context) {

}
