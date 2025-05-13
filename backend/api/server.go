package api

import (
	db "api/db/sqlc"
	"api/token"
	"api/utils"
	"fmt"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

type Server struct {
	config     utils.Config
	store      db.Store
	tokenMaker token.Maker
	router     *gin.Engine
}

func New(store db.Store, config utils.Config) (*Server, error) {
	maker, err := token.NewPasetoMaker(config.SecretKey)
	if err != nil {
		return nil, fmt.Errorf("unable to create token maker: %c", err)
	}
	server := &Server{
		config:     config,
		store:      store,
		tokenMaker: maker,
	}
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("currency", validCurrency)
	}
	server.setupRouter()
	return server, nil
}
func (server *Server) setupRouter() {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Adjust based on your frontend URL
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	router.POST("/users", server.CreateUser)
	router.GET("/users", server.GetUser)
	router.POST("/users/login", server.LoginUser)
	// SystemController endpoints
	addRoutes := router.Group("/").Use(authMiddleware(server.tokenMaker))
	addRoutes.POST("/systemcontrollers", server.CreateSystemController)
	addRoutes.GET("/systemcontrollers", server.ListSystemControllers)
	addRoutes.POST("/systemcontrollers/import", server.ImportSystemController)
	addRoutes.GET("/systemcontrollers/:id", server.GetSystemControllerById)
	addRoutes.GET("/systemcontrollers/:id/controllers", server.GetControllerNodesBySystemControllerID)
	addRoutes.GET("/systemcontrollers/:id/storages", server.GetStorageNodesBySystemControllerID)
	addRoutes.GET("/systemcontrollers/:id/workers", server.GetWorkerNodesBySystemControllerID)
	addRoutes.DELETE("/systemcontrollers/:id", server.DeleteSystemController)
	// Subclouds endpoints
	addRoutes.POST("/subclouds", server.CreateSubcloud)
	addRoutes.GET("/subclouds", server.ListSubclouds)
	addRoutes.GET("/subclouds/:id", server.GetSubcloudById)
	addRoutes.DELETE("/subclouds/:id", server.DeleteSubcloud)
	// addRoutes.PATCH("/system-controllers/:id")
	addRoutes.POST("/nodes", server.CreateNode)
	addRoutes.GET("/nodes", server.ListNodes)
	addRoutes.GET("/nodes/:id", server.GetNodeById)
	addRoutes.GET("/nodes/:id/bios", server.GetNodeBiosAttributes)
	server.router = router
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}
