from openai import OpenAI
import requests
import shutil
from pathlib import Path
import time
import json
from dotenv import load_dotenv
import os

load_dotenv()  # take environment variables from .env.

client = OpenAI(
    # Defaults to os.environ.get("OPENAI_API_KEY")
)

class NelsonBot:
    def __init__(self):
        self.data = []
        self.generate_image3()

    def generate_image_edit(self):
        print("File Prefix")
        prefix=input()
        print("Prompt")
        prompt=input()
        if len(prompt)<3:
            prompt="Artistic rendering of two people posing in front of a recycling bin"

        print("Number of images to generate")
        num=input()

        response = client.images.edit(
        model="dall-e-2",
        image=open("s1.png", "rb"),
        mask=open("s1_m2.png", "rb"),
        prompt=prompt,
        n=num,
        size="1024x1024"
        )
        image_url = response.data[0].url
        print(response)
        return image_url

    def generate_image2(self):
        print("File Prefix")
        prefix=input()
        print("Prompt")
        prompt=input()
        if len(prompt)<3:
            prompt="Artistic rendering of two people posing in front of a recycling bin"

        print("Number of images to generate")
        num=int(input())

        response = client.images.generate(
        model="dall-e-2",
        prompt=prompt,
        n=num,
        size="1024x1024"
        )
        headers={}
        for i,item in enumerate(response):
            image_url = response.data[i].url
            filename=prefix+str(i)+".png"
            r = requests.get(image_url,headers=headers, stream=True)
            with open(filename, mode="wb") as file:
                # file.write(r.raw)  
                shutil.copyfileobj(r.raw, file)
                print(image_url)  
                print(filename)        

        #print(response)
        return response

    def generate_image3(self):
        print("File Prefix")
        prefix=input()
        print("Prompt")
        prompt=input()
        if len(prompt)<3:
            prompt="Artistic rendering of two people posing in front of a recycling bin"

        response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        n=1,
        size="1024x1024"
        )
        headers={}
        for i,item in enumerate(response):
            image_url = response.data[i].url
            filename=prefix+str(i)+".png"
            r = requests.get(image_url,headers=headers, stream=True)
            with open(filename, mode="wb") as file:
                # file.write(r.raw)  
                shutil.copyfileobj(r.raw, file)
                print(image_url)  
                print(filename)        

        #print(response)
        return response


    def convert_image(self):
        from PIL import Image
        import os

        directory = r'D:\PATH'
        c=1
        for filename in os.listdir(directory):
            if filename.endswith(".jpg"):
                im = Image.open(filename)
                name='img'+str(c)+'.png'
                rgb_im = im.convert('RGB')
                rgb_im.save(name)
                c+=1
                print(os.path.join(directory, filename))
                continue
            else:
                continue

    def print_non_user_messages(self, messages):
        message_arr=list()
        for message in messages:
            if message.role=="user":
                break
            result=message.content[0].text.value
            message_arr.append(result)
        message_arr.reverse()
        for msg in message_arr:
            print(msg)

    def poll_for_finish(self,thread_id,run_id):
        while (True):
            run_status = client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run_id
            )

            if run_status.status == 'completed':
                return client.beta.threads.messages.list(
                    thread_id=thread_id
                ) 
            elif run_status.status in ['queued', 'in_progress']:
                print("Still waiting for run to finish")
                time.sleep(2)
            else:
                print(f"Run status: {run_status.status}")
                break


bot = NelsonBot()