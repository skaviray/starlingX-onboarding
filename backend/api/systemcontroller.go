package api

import (
	db "api/db/sqlc"
	"api/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateSystemControllerReq struct {
	Name     string `json:"name"`
	IpAdress string `json:"ip_address" binding:"required,ipv4"`
	Status   string `json:"status"`
}

func (server *Server) CreateSystemController(ctx *gin.Context) {
	var scParams CreateSystemControllerReq
	if err := ctx.ShouldBindJSON(&scParams); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}
	args := db.CreateSystemControllerParams{
		Name:      scParams.Name,
		IpAddress: scParams.IpAdress,
		Status:    "deploying",
	}
	systemController, err := server.store.CreateSystemController(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, systemController)
}

// type ListSystemControllerParams struct {
// 	PageId   int32 `form:"page_id" binding:"required,min=0"`
// 	PageSize int32 `form:"page_size" binding:"required,min=5,max=10"`
// }

func (server *Server) ListSystemControllers(ctx *gin.Context) {
	// var params ListSystemControllerParams
	// if err := ctx.ShouldBindQuery(&params); err != nil {
	// 	ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
	// 	return
	// }
	// args := db.ListSystemControllerParams{
	// 	Limit:  params.PageSize,
	// 	Offset: params.PageId,
	// }
	systemControllers, err := server.store.ListSystemController(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	log.Println(systemControllers)
	ctx.JSON(http.StatusOK, systemControllers)

}

type SystemControllerByIdParams struct {
	Id int32 `uri:"id" binding:"required"`
}

func (server *Server) GetSystemControllerById(ctx *gin.Context) {
	var params SystemControllerByIdParams
	if err := ctx.ShouldBindUri(&params); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}
	systemController, err := server.store.GetSystemController(ctx, params.Id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, systemController)
}

func (server *Server) DeleteSystemController(ctx *gin.Context) {

}
