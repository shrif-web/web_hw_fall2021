# Dockerize the project

In this branch we automate all the processes to build the project. 
<br/>
For this perpose we write a Dockerfile in each directory and a docker-compose in the root directory to orchestrate this Dockerfiles.

# Run the project 

To run this project we just need to run this simple command in the root: 
> docker-compose up -d -- build

in this project the database will be build automaticly using sql queries.