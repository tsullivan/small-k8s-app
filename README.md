# Small Kubernetes App

This is a learning experiment to design a distributed app with Kubernetes. 

## Requirements

1. Docker
1. Kubernetes cluster
  - [Minikube](https://minikube.sigs.k8s.io/docs/start/) and [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/) each have interesting features for running with your local Docker.
1. Kubectl: https://kubernetes.io/docs/tasks/tools/#kubectl
1. Skaffold: https://skaffold.dev/docs/quickstart/ 


## Running in dev mode

**1. Clone this repository**
```
git clone https://github.com/tsullivan/small-k8s-app.git
```

**2. Install the dependencies**
This step ensures your local IDE understands the types in the code.
```
npm install
cd src/frontend ; npm install ; cd -
cd src/backend ; npm install ; cd -
```
You will not need to run `npm start` locally, as skaffold will run your services in k8s using the commands in each `Dockerfile`.

**3. Create the pods**
To run the app in dev mode, run `skaffold dev`. To delete the pods, hit `Ctrl+C`.

In a separate terminal window, in any directory, run this command to see the status of the pods:
```
kubectl get po -A
```

**4. Work on the code**
The k8s cluster has its own docker repository. When you save a file with dev mode, skaffold kicks off new builds of all of the services, and instals the images into the k8s cluster's docker repository..
