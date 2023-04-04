import requests
import zipfile
import io
import os

response = requests.get("https://github.com/SkyoProductions/crimson/raw/main/CrimsonGUI.zip")

if response.status_code != 200:
    raise response.status_code

zip_data = io.BytesIO(response.content)

zip_file = zipfile.ZipFile(zip_data)

zip_dir = os.path.dirname(os.path.abspath(__file__))

zip_file.extractall(zip_dir)

zip_file.close()

#how to compile

#python -m nuitka --mingw64 --windows-icon-from-ico=iconPath install.py