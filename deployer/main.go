package main

import (
	"deployer/utils"
	"log"
)

func main() {
	// err := utils.Process()
	// log.Println(err)
	// bmIp := "128.224.210.43"
	// bmUser := "root"
	// bmPass := "KistaAdmin"
	// info := utils.BM_INFO{
	// 	BM_IP:   "128.224.210.41",
	// 	BM_USER: "root",
	// 	BM_PASS: "KistaAdmin",
	// }
	// data, err := utils.GetBiosAttributes(info)
	// if err != nil {
	// 	log.Println(err)
	// }
	// ifaces, err := utils.GetEmbededNetworkInterfaces(info)
	// if err != nil {
	// 	log.Println(err)
	// }
	// log.Println(data)
	// for key, attribute := range data {
	// 	value, ok := attribute.(string)
	// 	if !ok {
	// 		value = "NA"
	// 	}
	// 	if value != "" {
	// 		log.Println(key, value)
	// 	}

	// }
	// log.Println(ifaces)
	// err := utils.GetPowerState(info)
	// if err != nil {
	// 	log.Println(err)
	// }
	authClient := utils.AuthClient{
		Username: "admin",
		Project:  "admin",
		Endpoint: "https://128.224.212.100:5000",
		Password: "Caas-r640-wra*",
		Domain:   "Default",
	}
	if err := authClient.GetToken(); err != nil {
		log.Println(err)
	}
	// log.Print(authClient.Token)
	// // GET the hosts
	hosts, err := authClient.GetHosts()
	if err != nil {
		log.Println(err)
	}
	for _, host := range hosts {
		log.Println(host.Links)
		log.Println(host.ID)
	}
	// nodeParams := db.UpdateNodePropertiesParams{

	// }
	config, err := authClient.GetSystemConfig()
	if err != nil {
		log.Println(err)
	}
	log.Println(config)
	// if err != nil {
	// 	log.Println(err)
	// }
	// log.Println(config)
	// err = authClient.LockHost(1)
	// if err != nil {
	// 	log.Println(err)
	// }
	// GET subclouds in  systemcontroller
	// subclouds, err := authClient.GetSubclouds()
	// if err != nil {
	// 	log.Println(err)
	// }
	// for _, subcloud := range subclouds {
	// 	log.Println(subcloud.ID)
	// }
	// Run Ansible playbook on the systemcontroller
	// if err := utils.RunAnsibleWithPassword("128.224.212.103", "sysadmin", "WindRiver123!", "/usr/share/ansible/stx-ansible/playbooks/bootstrap.yml"); err != nil {
	// 	log.Println(err)
	// }
	// authclient := utils.AuthClient{
	// 	Username: "admin",
	// 	// Password: "Caas-r640-wra*",
	// 	Password: "WindRiver123!",
	// 	Endpoint: "https://128.224.212.103:5000",
	// 	Domain:   "Default",
	// 	Project:  "admin",
	// }
	// if err := authclient.GetToken(); err != nil {
	// 	log.Println(err)
	// }
	// log.Println(authclient.Token)
	// clusters, err := authclient.GetKubeConfig()
	// if err != nil {
	// 	log.Println(err)
	// }
	// log.Println(clusters)
	// for _, cluster := range clusters {
	// 	log.Println(cluster.ClusterName)
	// 	if cluster.ClusterName == "kubernetes" {
	// 		k8sClient, err := utils.NewK8sClient(cluster)
	// 		if err != nil {
	// 			log.Println(err)
	// 		}
	// 		pods, err := k8sClient.ListPods("platform-deployment-manager")
	// 		if err != nil {
	// 			log.Println(err)
	// 		}
	// 		for _, pod := range pods.Items {
	// 			log.Println(pod.Name)
	// 		}
	// 		hosts, err := k8sClient.GetHostReconcileStatus("starlingx.windriver.com", "v1", "hosts", "deployment")
	// 		if err != nil {
	// 			log.Println(err)
	// 		}
	// 		log.Println(hosts)
	// 	}
	// }

}
