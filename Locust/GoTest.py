from locust import HttpUser, task
import random

class HelloWorldUser(HttpUser):
    @task
    def hello_world(self):
        n = random.randint(0,100000)
        In = 12345678945600000 + n
        self.client.get("/go/sha?Input1="+str(In))