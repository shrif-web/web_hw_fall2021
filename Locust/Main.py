from locust import HttpUser, task, between
import time
import random
import json

class QuickstartUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def go_write_request(self):
        for i in range(100):
            n = random.randint(0,100000)
            In = 12345178945600000 + n
            self.client.get("/go/sha256?Input1="+str(In))
            time.sleep(1)
    
    @task
    def node_write_request(self):
        for i in range(100):
            n = random.randint(0,100000)
            In = 12345178945600000 + n
            self.client.get("/node/sha256?Input1="+str(In))
            time.sleep(1)
    
    @task
    def go_sha256_request(self):
        for i in range(100):
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
            time.sleep(1)
    
    @task
    def node_sha256_request(self):
        for i in range(100):
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
            time.sleep(1)
