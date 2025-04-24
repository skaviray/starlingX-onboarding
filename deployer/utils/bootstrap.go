package utils

import (
	"fmt"
	"log"
	"os"

	"golang.org/x/crypto/ssh"
)

func RunAnsibleWithPassword(host, user, password, playbookPath string) error {
	config := &ssh.ClientConfig{
		User: user,
		Auth: []ssh.AuthMethod{
			ssh.Password(password),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(), // ⚠️ Insecure; use a proper callback in production
	}

	// Connect to remote host
	client, err := ssh.Dial("tcp", host+":22", config)
	if err != nil {
		return fmt.Errorf("failed to connect: %v", err)
	}
	defer client.Close()

	// Create SSH session
	session, err := client.NewSession()
	if err != nil {
		return fmt.Errorf("failed to create session: %v", err)
	}
	defer session.Close()

	if err := session.RequestPty("xterm", 80, 40, ssh.TerminalModes{}); err != nil {
		return fmt.Errorf("request for pseudo terminal failed: %v", err)
	}

	session.Stdout = os.Stdout
	session.Stderr = os.Stderr

	// Run Ansible playbook
	log.Printf("Executing playbook %s on the host %s", playbookPath, host)
	cmd := fmt.Sprintf("bash -c 'cd /home/sysadmin;pwd;ANSIBLE_FORCE_COLOR=true ansible-playbook %s'", playbookPath)
	err = session.Run(cmd)
	if err != nil {
		return fmt.Errorf("ansible run failed: %s", err)
	}

	// fmt.Println("Ansible output:\n", string(output))
	return nil
}
