package api

import (
	db "api/db/sqlc"
	"api/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type NodeConfig struct {
	BM_IP       string   `json:"bm_ip" binding:"required,ipv4"`
	BM_USER     string   `json:"bm_user" binding:"required"`
	BM_PASS     string   `json:"bm_pass" binding:"required"`
	BM_TYPE     string   `json:"bm_type" binding:"required"`
	PERSONALITY string   `json:"personality" binding:"required oneof=controller storage worker"`
	PXE_DEVICE  string   `json:"pxe_device" binding:"required"`
	PXE         string   `json:"pxe" binding:"required"`
	CEPH_DISKS  []string `json:"ceph_disks" binding:"required"`
	ROOT_DISK   []string `json:"root_disk" binding:"required"`
	HostName    string   `json:"hostname"`
	// SUBFUNCTIONS string `json:"subfuctions"`
}

type NetworkConfig struct {
	OAM          string `json:"oam" binding:"required,cidr"`
	CLUSTER_HOST string `json:"cluster_host" binding:"required,cidr"`
	MANAGEMENT   string `json:"mgmt" binding:"required,cidr"`
	ADMIN        string `json:"admin" binding:"required,cidr"`
}

type SystemConfig struct {
	Type        string        `json:"type" binding:"oneof=system-controller subcloud"`
	Controllers []NodeConfig  `json:"controllers"`
	Storages    []NodeConfig  `json:"storages"`
	Workers     []NodeConfig  `json:"workers"`
	Network     NetworkConfig `json:"network_config"`
	Ntp_Servers []string      `json:"ntp_Servers" binding:"required"`
	DNS_Servers []string      `json:"dns_Servers" binding:"required"`
}

type CreateSystemControllerReq struct {
	Name             string       `json:"name"`
	OAM_FLOATING_IP  string       `json:"oam_floating" binding:"required,ipv4"`
	OAM_CONTROLLER_0 string       `json:"oam_controller_0" binding:"required,ipv4"`
	OAM_CONTROLLER_1 string       `json:"oam_controller_1" binding:"required,ipv4"`
	CONFIG           SystemConfig `json:"config" binding:"required"`
	Status           string       `json:"status"`
}

func (server *Server) CreateSystemController(ctx *gin.Context) {
	var scParams CreateSystemControllerReq
	if err := ctx.ShouldBindJSON(&scParams); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}
	
	// Serialize config to JSON
	configJSON, err := json.Marshal(scParams.CONFIG)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	
	args := db.CreateSystemControllerParams{
		Name:           scParams.Name,
		OamFloating:    scParams.OAM_FLOATING_IP,
		OamController0: scParams.OAM_CONTROLLER_0,
		OamController1: scParams.OAM_CONTROLLER_1,
		Config:         configJSON, // Use the raw JSON bytes
		Status:         "deploying",
	}
	
	systemController, err := server.store.CreateSystemController(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	
	// Create nodes from the config
	createdNodes := []db.Node{}
	
	// Process controller nodes
	for i, controllerConfig := range scParams.CONFIG.Controllers {
		nodeName := systemController.Name + "-controller-" + fmt.Sprintf("%d", i)
		
		hostname := controllerConfig.HostName
		if hostname == "" {
			hostname = nodeName
		}
		
		hashedPass, err := utils.CreateHashedPassword(controllerConfig.BM_PASS)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			return
		}
		
		nodeArgs := db.CreateNodeParams{
			Name:       nodeName,
			Hostname:   hostname,
			BmIp:       controllerConfig.BM_IP,
			BmUser:     controllerConfig.BM_USER,
			BmPass:     hashedPass,
			Role:       "controller",
			ParentType: "system_controller",
			ParentID:   systemController.ID,
		}
		
		node, err := server.store.CreateNode(ctx, nodeArgs)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			return
		}
		
		createdNodes = append(createdNodes, node)
	}
	
	// Process storage nodes
	for i, storageConfig := range scParams.CONFIG.Storages {
		nodeName := systemController.Name + "-storage-" + fmt.Sprintf("%d", i)
		
		// Use the hostname if provided, otherwise generate one
		hostname := storageConfig.HostName
		if hostname == "" {
			hostname = nodeName
		}
		
		// Create the storage node
		hashedPass, err := utils.CreateHashedPassword(storageConfig.BM_PASS)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			return
		}
		
		nodeArgs := db.CreateNodeParams{
			Name:       nodeName,
			Hostname:   hostname,
			BmIp:       storageConfig.BM_IP,
			BmUser:     storageConfig.BM_USER,
			BmPass:     hashedPass,
			Role:       "storage",
			ParentType: "system_controller",
			ParentID:   systemController.ID,
		}
		
		node, err := server.store.CreateNode(ctx, nodeArgs)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			return
		}
		
		createdNodes = append(createdNodes, node)
	}
	
	// Process worker nodes
	for i, workerConfig := range scParams.CONFIG.Workers {
		nodeName := systemController.Name + "-worker-" + fmt.Sprintf("%d", i)
		
		// Use the hostname if provided, otherwise generate one
		hostname := workerConfig.HostName
		if hostname == "" {
			hostname = nodeName
		}
		
		// Create the worker node
		hashedPass, err := utils.CreateHashedPassword(workerConfig.BM_PASS)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			return
		}
		
		nodeArgs := db.CreateNodeParams{
			Name:       nodeName,
			Hostname:   hostname,
			BmIp:       workerConfig.BM_IP,
			BmUser:     workerConfig.BM_USER,
			BmPass:     hashedPass,
			Role:       "worker",
			ParentType: "system_controller",
			ParentID:   systemController.ID,
		}
		
		node, err := server.store.CreateNode(ctx, nodeArgs)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			return
		}
		
		createdNodes = append(createdNodes, node)
	}
	
	// Return enhanced response
	type EnhancedSystemControllerResponse struct {
		SystemController db.SystemController `json:"system_controller"`
		Nodes            []db.Node           `json:"nodes"`
	}
	
	response := EnhancedSystemControllerResponse{
		SystemController: systemController,
		Nodes:            createdNodes,
	}
	
	ctx.JSON(http.StatusOK, response)
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
