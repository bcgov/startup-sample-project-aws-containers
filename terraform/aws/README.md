# Deployment Steps

1. Build the docker image: ``docker build -t startup-sample .``
2. Create a repository for the image. ``aws ecr create-repository --region ca-central-1 --repository-name startup-sample``
3. Tag the docker image with the url of the repository from the previous step. ``docker tag startup-sample <<AWS ACCOUNTID>>.dkr.ecr.ca-central-1.amazonaws.com/startup-sample``
4. Push the image to ECR: ``docker push <<AWS ACCOUNTID>.dkr.ecr.ca-central-1.amazonaws.com/startup-sample``


In the server.js file, ``app.use(requireHttps);`` is commented out. SSL needs to be configured.