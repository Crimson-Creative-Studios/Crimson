import os
from subprocess import Popen

os.chdir("src/")

Popen(["electron", "main.js"], shell=True)