from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
api_key=os.getenv("ZAI_API_KEY"),
base_url="https://open.bigmodel.cn/api/paas/v4/"
)

response = client.chat.completions.create(
model="glm-5.3-flash",
messages=[
{"role": "user", "content": "Dis bonjour et confirme que tu fonctionnes."}
]
)

print(response.choices[0].message.content)