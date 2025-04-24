package utils

import (
	"context"
	"log"

	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"

	// v1 "k8s.io/client-go/applyconfigurations/core/v1"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

type K8sClient struct {
	TypedClient   kubernetes.Interface
	DynamicClient dynamic.Interface
}

func NewK8sClient(cluster KubeCluster) (*K8sClient, error) {
	config := &rest.Config{
		Host: cluster.ClusterAPIEndpoint,
		TLSClientConfig: rest.TLSClientConfig{
			CAData:   []byte(cluster.ClusterCACert),
			CertData: []byte(cluster.AdminClientCert),
			KeyData:  []byte(cluster.AdminClientKey),
		},
	}
	TypeClient, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, err
	}
	DynamicClient, err := dynamic.NewForConfig(config)
	if err != nil {
		return nil, err
	}
	return &K8sClient{
		TypedClient:   TypeClient,
		DynamicClient: DynamicClient,
	}, nil
}

func (c *K8sClient) ListPods(namespace string) (*v1.PodList, error) {
	pods, err := c.TypedClient.CoreV1().Pods(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return nil, err
	}
	return pods, nil
}

func (c *K8sClient) GetHostReconcileStatus(group, version, resource, namespace string) ([]string, error) {
	GVR := schema.GroupVersionResource{
		Group:    group,
		Version:  version,
		Resource: resource, // Plural name of the resource
	}
	hosts, err := c.DynamicClient.Resource(GVR).Namespace(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		log.Println(err)
	}
	var hostStatus []string
	for _, host := range hosts.Items {
		status, found, _ := unstructured.NestedBool(host.Object, "status", "inSync")
		if found && status {
			hostStatus = append(hostStatus, host.GetName())
		}
	}
	return hostStatus, nil
}

// func CreateKubernetesClient(cluster KubeCluster) (*kubernetes.Clientset, err) {

// 	return kubernetes.NewForConfig(config)
// 	// return dynamic.NewForConfig(config)
// }
// func CreateDynamicKubeClient(cluster KubeCluster) (*dynamic.DynamicClient, error) {
// 	config := &rest.Config{
// 		Host: cluster.ClusterAPIEndpoint,
// 		TLSClientConfig: rest.TLSClientConfig{
// 			CAData:   []byte(cluster.ClusterCACert),
// 			CertData: []byte(cluster.AdminClientCert),
// 			KeyData:  []byte(cluster.AdminClientKey),
// 		},
// 	}
// 	return dynamic.NewForConfig(config)
// }
