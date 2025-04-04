package api

import (
	db "api/db/sqlc"
	"api/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type CreateNodeReq struct {
	Name       string `json:"name"`
	HostName   string `json:"host_name"`
	ParentType string `json:"parent_type"`
	ParentId   int64  `json:"parent_id"`
	Role       string `json:"role"`
	BmIp       string `json:"bm_ip" binding:"required,ipv4"`
	BmUser     string `json:"bm_user" binding:"required"`
	BmPass     string `json:"bm_pass" binding:"required"`
}

func (server *Server) CreateNode(ctx *gin.Context) {
	var nodeParams CreateNodeReq
	if err := ctx.ShouldBindJSON(&nodeParams); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}
	hashed_pass, err := utils.CreateHashedPassword(nodeParams.BmPass)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	args := db.CreateNodeParams{
		Name:     nodeParams.Name,
		Hostname: nodeParams.HostName,
		ParentID: int32(nodeParams.ParentId),
		BmIp:     nodeParams.BmIp,
		BmPass:   hashed_pass,
	}
	node, err := server.store.CreateNode(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, node)
		return
	}
	ctx.JSON(http.StatusOK, node)
}

type NodeResponse struct {
	Id         int32     `json:"id"`
	Name       string    `json:"name"`
	HostName   string    `json:"host_name"`
	ParentType string    `json:"parent_type"`
	ParentId   int32     `json:"parent_id"`
	Role       string    `json:"role"`
	BmIp       string    `json:"bm_ip"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"created_at"`
}

func newNodeResponse(node db.Node) NodeResponse {
	return NodeResponse{
		Id:         node.ID,
		Name:       node.Name,
		HostName:   node.Hostname,
		ParentId:   node.ParentID,
		ParentType: node.ParentType,
		Role:       node.Role,
		BmIp:       node.BmIp,
		CreatedAt:  node.CreatedAt,
	}

}

type ListNodeParams struct {
	PageId   int32 `form:"page_id" binding:"required,min=1"`
	PageSize int32 `form:"page_size" binding:"required,min=5,max=10"`
}

func (server *Server) ListNodes(ctx *gin.Context) {
	var nodeParams ListNodeParams
	if err := ctx.ShouldBindQuery(&nodeParams); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}
	args := db.ListNodesParams{
		Limit:  nodeParams.PageSize,
		Offset: nodeParams.PageId,
	}
	nodes, err := server.store.ListNodes(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	res := []NodeResponse{}
	for _, node := range nodes {
		res = append(res, newNodeResponse(node))
	}
	ctx.JSON(http.StatusOK, res)

}

type NodeByIdParams struct {
	Id int32 `uri:"id" binding:"required"`
}

func (server *Server) GetNodeById(ctx *gin.Context) {
	var params NodeByIdParams
	if err := ctx.ShouldBindUri(&params); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}
	node, err := server.store.GetNodeById(ctx, params.Id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	res := newNodeResponse(node)
	ctx.JSON(http.StatusOK, res)
}



func (server *Server) DeleteNode(ctx *gin.Context) {

}
