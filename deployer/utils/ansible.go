package utils

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"

	"github.com/apenella/go-ansible/v2/pkg/execute"
	results "github.com/apenella/go-ansible/v2/pkg/execute/result/json"
	"github.com/apenella/go-ansible/v2/pkg/execute/stdoutcallback"
	"github.com/apenella/go-ansible/v2/pkg/playbook"
)

var PlayBookPath = "/Users/shiva.kavirayani/Documents/wr-front-end/deployer/sample.yaml"

// #func Process(vars interface{}, action string) map[string]error {
func Process() map[string]error {
	// variables, _ := vars.(map[string]interface{})
	variables := make(map[string]interface{})
	variables["ansible_ssh_user"] = "user"
	log.Println(variables)
	var res *results.AnsiblePlaybookJSONResults
	buff := new(bytes.Buffer)
	ansiblePlaybookOptions := &playbook.AnsiblePlaybookOptions{
		// ExtraVars: map[string]interface{}{
		// 	"extravar1":    "value11",``
		// 	"extravar2":    "value12",
		// 	"ansible_port": "22225",
		// },
		ExtraVars: variables,
		// Inventory:     "/dev/null",
		SSHCommonArgs: "-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null",
		Connection:    "local",
		Inventory:     "10.240.32.239,10.232.80.168",
	}
	playbookCmd := playbook.NewAnsiblePlaybookCmd(
		playbook.WithPlaybooks(PlayBookPath),
		playbook.WithPlaybookOptions(ansiblePlaybookOptions),
	)
	exec := stdoutcallback.NewJSONStdoutCallbackExecute(
		execute.NewDefaultExecute(
			execute.WithCmd(playbookCmd),
			execute.WithErrorEnrich(playbook.NewAnsiblePlaybookErrorEnrich()),
			execute.WithWrite(io.Writer(buff)),
		),
	)

	err := exec.Execute(context.TODO())
	if err != nil {
		fmt.Println(err.Error())
	}

	res, err = results.ParseJSONResultsStream(io.Reader(buff))
	if err != nil {
		panic(err)
	}
	// msgOutput := struct {
	// 	Host    string `json:"host"`
	// 	Message string `json:"message"`
	// }{}
	// log.Println(res.Stats)
	// log.Println(res.Plays)
	for _, play := range res.Plays {
		log.Println(play)
		for _, task := range play.Tasks {
			// log.Println(task.Hosts)
			log.Println(task.Task.Name)
		}
		// log.Println(play)
		// for _, task := range play.Tasks {
		// 	log.Println(task.Task.Name)
		// for _, content := range task.Hosts {
		// 	log.Println(con)
		// }
		// for _, content := range task.Hosts {
		// 	err = json.Unmarshal([]byte(fmt.Sprint(content.Stdout)), &msgOutput)
		// 	if err != nil {
		// 		panic(err)
		// 	}
		// 	fmt.Printf("[%s] %s\n", msgOutput.Host, msgOutput.Message)
		// }
		// }
	}
	return nil
}
