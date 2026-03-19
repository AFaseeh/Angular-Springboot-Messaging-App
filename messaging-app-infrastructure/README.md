# Infrastructure

This repository contains the Kubernetes orchestration and configuration.

## Project Structure
* **k8s-manifests/**: Application-level resources (Frontend, Backend, and Ingress routing).
* **k8s-config/**: Cluster-level infrastructure tools and security configurations.

## Prerequisites
* A running Kubernetes cluster (k3s used for this project).
* Helm v3+ installed.
* A domain name pointing to your Node's Public IP.

## Deployment Order
1. **Edit All the `<placeholder>`s in the yaml files**
2. **Initialize Infrastructure**: Follow instructions in `k8-config/README.md` to install the controllers.
3. **Deploy Application**: Run `kubectl apply -f k8s-manifests`.


---

# K3s Remote Access Guide

### 1. Configure TLS SAN
Add your VM's public IP to the K3s config to allow remote connections.

```bash
# Edit /etc/rancher/k3s/config.yaml
tls-san:
  - "YOUR_PUBLIC_IP"
```

### 2. Restart Service
```bash
sudo systemctl restart k3s
```

### 3. Download Kubeconfig
Run this from your **local machine**:
```bash
ssh -i key user@ip "sudo cat /etc/rancher/k3s/k3s.yaml" > k3s.yaml
```

### 4. Final Tweak
1.  Open `k3s.yaml` and change `server: https://127.0.0.1:6443` to `server: https://YOUR_PUBLIC_IP:6443`.
2.  **Test:** `export KUBECONFIG=./k3s.yaml && kubectl get nodes`

> **Tip:** Ensure Cloud provider's Security group allows inbound traffic on **Port 6443**.

---