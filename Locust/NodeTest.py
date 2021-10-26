from locust import HttpUser, task
import random
import json

class HelloWorldUser(HttpUser):
    @task
    def hello_world(self):
        n = random.randint(0,100000)
        In = 12345178945600000 + n
        # self.client.get("/node/sha256?Input1="+str(In))
        data = {'Input1': str(In)}
        self.client.post(
            url="/node/sha256",
            data=json.dumps(data),
            auth=None,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )