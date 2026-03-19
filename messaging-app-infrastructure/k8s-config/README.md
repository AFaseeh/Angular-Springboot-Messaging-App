# Cluster Infrastructure Configuration

This directory contains the setup for third-party controllers and security managers.

## 1. NGINX Ingress Controller
Used to manage external access to the services in the cluster.

```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

## 2. Cert-Manager
Handles automated TLS certificate issuance via Let's Encrypt.
```bash
helm install \
  cert-manager oci://quay.io/jetstack/charts/cert-manager \
  --version v1.19.4 \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true
```

## 3. Post-Installation
1. Edit `./cert-manager/Issuer.yaml` with your real email
2. Apply cert-manger config:
`kubectl apply -f ./cert-manager/`

## 4. Database & Persistence Layer
The database uses a `StatefulSet` with `hostPath` persistence and `Secret` management.

### 4.1 Storage Preparation
Before deploying, ensure the data directory exists on the host node and is owned by postgres:
```bash
sudo mkdir -p /mnt/data/postgres
sudo chown -R 999:999 /mnt/data/postgres
```

### 4.2 Manual Secret Setup
1. **Copy the template:**
   ```bash
   cp ./k8s-config/secrets/postgres-secret.example.yaml ./k8s-config/secrets/postgres-secret.yaml
   ```
2. **Update values:** Edit `stringData` in `./k8s-config/secrets/postgres-secret.yaml` with your actual passwords and remove `template` from the `name: postgres-secret-template`.
3. **Apply to cluster:**
   ```bash
   kubectl apply -f ./k8s-config/secrets/postgres-secret.yaml
   ```
## **5. Registry Authentication**
To allow the cluster to pull private images, create a `docker-registry` secret:

 1. **Login to your registry:**
      ```bash
      docker login
      ```
 2. **Generate the secret manifest:**
  If the default path below fails, copy `~/.docker/config.json` to your current directory and update the `--from-file` path.
      ```bash
      kubectl create secret generic my-registry-secret \
        --from-file=.dockerconfigjson=$HOME/.docker/config.json \
        --type=kubernetes.io/dockerconfigjson \
        --dry-run=client -o yaml | tee ./k8s-config/secrets/registry-secret.yaml
      ```
 3. **Apply the secret:**
      ```bash
      kubectl apply -f ./k8s-config/secrets/registry-secret.yaml
      ```