package utils

import (
	"errors"

	results "github.com/apenella/go-ansible/v2/pkg/execute/result/json"
)

var Failures = map[string]error{}

func GetFailureMessage(plays []results.AnsiblePlaybookJSONResultsPlay, hosts []string) map[string]error {
	for _, play := range plays {
		for _, host := range hosts {
			for _, task := range play.Tasks {
				if task.Hosts[host].Failed {
					// var std_err interface{}
					std_err, ok := task.Hosts[host].Stderr.(string)
					if !ok {
						Failures[host] = errors.New("Failed")
					}
					// msg := fmt.Sprintf(std_err)
					Failures[host] = errors.New(std_err)
				}
			}
		}
	}
	return Failures
}

func GetFailedHosts(stats map[string]*results.AnsiblePlaybookJSONResultsStats) []string {
	failedHosts := []string{}
	for host := range stats {
		// failure := stats[host].Failures
		if stats[host].Failures != 0 {
			failedHosts = append(failedHosts, host)
		}
	}
	return failedHosts
}
