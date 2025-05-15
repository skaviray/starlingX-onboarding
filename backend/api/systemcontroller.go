package api

import (
	db "api/db/sqlc"
	"api/utils"
	"log"
	"net/http"
	"strconv"

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
	Name           string `json:"name"`
	OAM_FLOATING   string `json:"oam_floating" binding:"required,ipv4"`
	DEPLOY_FILE    string `json:"deploy_file" binding:"required"`
	INSTALL_FILE   string `json:"install_file" binding:"required"`
	BOOTSTRAP_FILE string `json:"bootstrap_file" binding:"required"`
	Status         string `json:"status"`
}

type ImportSystemControllerReq struct {
	Name            string `json:"name" binding:"required"`
	OAM_FLOATING_IP string `json:"oam_floating_ip" binding:"required,ipv4"`
	ADMIN_PASS      string `json:"admin_pass" binding:"required"`
}

func (server *Server) CreateSystemController(ctx *gin.Context) {
	var scParams CreateSystemControllerReq
	if err := ctx.ShouldBindJSON(&scParams); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}

	// Serialize config to JSON
	// configJSON, err := json.Marshal(scParams.CONFIG)
	// if err != nil {
	// 	ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
	// 	return
	// }

	args := db.CreateSystemControllerParams{
		Name:          scParams.Name,
		OamFloating:   scParams.OAM_FLOATING,
		DeployFile:    scParams.DEPLOY_FILE,
		InstallFile:   scParams.INSTALL_FILE,
		BootstrapFile: scParams.DEPLOY_FILE,
		AdminPass:     "",
		Status:        "creating",
	}

	systemController, err := server.store.CreateSystemController(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	message := Message{
		Id:     systemController.ID,
		Action: "create",
	}
	if err := server.SendToQueue(message); err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, systemController)
}

func (server *Server) ImportSystemController(ctx *gin.Context) {
	var req ImportSystemControllerReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}
	params := db.CreateSystemControllerParams{
		Name:          req.Name,
		OamFloating:   req.OAM_FLOATING_IP,
		AdminPass:     req.ADMIN_PASS,
		InstallFile:   "",
		BootstrapFile: "",
		DeployFile:    "",
		Status:        "importing",
	}
	sc, err := server.store.CreateSystemController(ctx, params)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	message := Message{
		Id:     sc.ID,
		Action: "import",
	}
	if err := server.SendToQueue(message); err != nil {
		log.Println(err)
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	log.Println(message)
	ctx.JSON(http.StatusCreated, sc)
}

func (server *Server) ListSystemControllers(ctx *gin.Context) {
	systemControllers, err := server.store.ListSystemController(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
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

func (server *Server) GetControllerNodesBySystemControllerID(ctx *gin.Context) {
	idParam := ctx.Param("id")
	systemControllerID, err := strconv.Atoi(idParam)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid system controller ID"})
		return
	}

	nodes, err := server.store.GetControllerNodesBySystemControllerID(ctx, int32(systemControllerID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve controller nodes"})
		return
	}

	ctx.JSON(http.StatusOK, nodes)
}

func (server *Server) GetStorageNodesBySystemControllerID(ctx *gin.Context) {
	idParam := ctx.Param("id")
	systemControllerID, err := strconv.Atoi(idParam)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid system controller ID"})
		return
	}

	nodes, err := server.store.GetStorageNodesBySystemControllerID(ctx, int32(systemControllerID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve storage nodes"})
		return
	}

	ctx.JSON(http.StatusOK, nodes)
}

func (server *Server) GetWorkerNodesBySystemControllerID(ctx *gin.Context) {
	idParam := ctx.Param("id")
	systemControllerID, err := strconv.Atoi(idParam)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid system controller ID"})
		return
	}

	nodes, err := server.store.GetWorkerNodesBySystemControllerID(ctx, int32(systemControllerID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve worker nodes"})
		return
	}

	ctx.JSON(http.StatusOK, nodes)
}

func (server *Server) DeleteSystemController(ctx *gin.Context) {
	var params SystemControllerByIdParams
	if err := ctx.ShouldBindUri(&params); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}

	err := server.store.DeleteSystemController(ctx, params.Id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "System controller deleted successfully"})
}
