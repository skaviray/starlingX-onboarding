# Cloud Infrastructure Orchestration Platform

This project is designed to orchestrate and manage a StarlingX (https://www.starlingx.io/) cloud infrastructure composed of System Controllers, Subclouds, and Nodes.

---

## 📦 Project Components

### 1. Frontend
- Provides a **graphical interface** for users.
- Allows orchestration and management of:
  - **System Controllers**
  - **Subclouds**
  - **Nodes**
- Communicates with the backend via RESTful (or gRPC) and Redfish APIs.

### 2. Backend (API Service)
- Serves as the **core API layer**.
- Handles:
  - Incoming requests from the frontend.
  - Database interactions.
  - Task dispatching via RabbitMQ.
- Exposes endpoints to:
  - Create, update, delete, and monitor system components.

### 3. RabbitMQ (Message Broker)
- Acts as a **message queue** between the Backend and the Deployer.
- Ensures:
  - **Asynchronous task processing**
  - **Reliable delivery** of orchestration commands
  - **Loose coupling** between components

### 4. Database
- Stores **state and metadata** of all managed components:
  - System Controllers
  - Subclouds
  - Nodes

### 5. Deployer
- Subscribes to task queues via RabbitMQ.
- Contains the **implementation logic** to:
  - Provision
  - Configure
  - Manage
- Interfaces with tools like:
  - **Ansible**
  - **IPMI**
  - or custom scripts
- Responsible for actual system changes based on API instructions.

---

## 🔁 Component Interaction Overview

```plaintext
Frontend ⇄ Backend ⇄ Database
                   ⇓
              RabbitMQ
                   ⇓
               Deployer
```
## 🧑‍💻 Development Environment Setup

### 📁 Prerequisites
- Docker
- Docker Desktop
- Docker Compose
- Git
- Node.js & npm (for frontend)
- Go (for backend)
- Python 3 (for deployer, if used)

### 🏗️ Setup Instructions

```bash
git clone https://github.com/skaviray/starlingX-onboarding
cd starlingX-onboarding
```

- Start the frontend
```bash
# cd frontend
# npm start
Compiled successfully!

You can now view frontend in the browser.

  http://localhost:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully

```

- Start the Backend

```bash
cd backend
make postgres-setup
make createdb
make migrate-up
make start-server
```

- Access the Dashboard at http://localhost:3000/login
