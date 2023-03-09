import PySimpleGUI as sg
import os
import subprocess
import threading
import sys
import json

sg.LOOK_AND_FEEL_TABLE['Crimson'] = {'BACKGROUND': '#454545', 'TEXT': '#ffffff', 'INPUT': '#000000', 'TEXT_INPUT': '#ffffff', 'SCROLL': '#99CC99', 'BUTTON': ('#000000', '#069ccf'), 'PROGRESS': ('#D1826B', '#CC8019'), 'BORDER': 1, 'SLIDER_DEPTH': 0, 'PROGRESS_DEPTH': 0, }

sg.theme('Crimson')
sg.set_options(font=('Arial', 16))

def getExtensions():
    returnting = []
    returnting2 = []
    subfolders = [f.path for f in os.scandir("Extensions") if f.is_dir()]
    data = None
    for i in subfolders:
        name = i[11:]
        returnting.append(sg.Text(name))
        returnting2.append("state"+name)
        f = open('extensions.json')
        data = json.load(f)
        enabled = data["enabled"]
        disabled = data["disabled"]
        test = data["test"]
        tab = None
        if name in enabled:
            if name in disabled:
                if name in test:
                    data["test"].remove(name)
                    data["disabled"].remove(name)
                    tab = sg.Tab(name, [[sg.Radio('Enabled', "state"+name, default=True, key="enabled"+name)], [sg.Radio('Disabled', "state"+name, default=False, key="disabled"+name)], [sg.Radio('Testing', "state"+name, default=False, key="test"+name)],])
                else:
                    data["disabled"].remove(name)
                    tab = sg.Tab(name, [[sg.Radio('Enabled', "state"+name, default=True, key="enabled"+name)], [sg.Radio('Disabled', "state"+name, default=False, key="disabled"+name)], [sg.Radio('Testing', "state"+name, default=False, key="test"+name)],])
            elif name in test:
                data["test"].remove(name)
                tab = sg.Tab(name, [[sg.Radio('Enabled', "state"+name, default=True, key="enabled"+name)], [sg.Radio('Disabled', "state"+name, default=False, key="disabled"+name)], [sg.Radio('Testing', "state"+name, default=False, key="test"+name)],])
            else:
                tab = sg.Tab(name, [[sg.Radio('Enabled', "state"+name, default=True, key="enabled"+name)], [sg.Radio('Disabled', "state"+name, default=False, key="disabled"+name)], [sg.Radio('Testing', "state"+name, default=False, key="test"+name)],])
        elif name in disabled:
            tab = sg.Tab(name, [[sg.Radio('Enabled', "state"+name, default=False, key="enabled"+name)], [sg.Radio('Disabled', "state"+name, default=True, key="disabled"+name)], [sg.Radio('Testing', "state"+name, default=False, key="test"+name)],])
        elif name in test:
            tab = sg.Tab(name, [[sg.Radio('Enabled', "state"+name, default=False, key="enabled"+name)], [sg.Radio('Disabled', "state"+name, default=False, key="disabled"+name)], [sg.Radio('Testing', "state"+name, default=True, key="test"+name)],])
        returnting.append(tab)
    with open("extensions.json", "w") as outfile:
        json.dump(data, outfile)
    return returnting, returnting2

extensionTabs, extensions = getExtensions()

console = [[sg.Multiline("", size=(160, 20), autoscroll=True, reroute_stdout=True, reroute_stderr=True, key='-OUTPUT-', font=("Arial", 8))]]

start = [[sg.Text("Press start to run the Discord bot")], [sg.Button("Start", key="-start-")], [sg.Frame("Output", console)]]
options = [[sg.Text("Change Crimson configuration here")], [sg.TabGroup([extensionTabs])], [sg.Button("Save", key="-save-", enable_events=True)]]

layout = [[sg.Text("CrimsonGUI - Alpha 1", font=("Arial", 18))],
          [sg.TabGroup([[sg.Tab("Start", start), sg.Tab("Options", options)]])]]

window = sg.Window('CrimsonGUI', layout, size=(800, 500), margins=(0,0), finalize=True)

def runCommand(cmd, timeout=None, window=None):
    p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    output = ''
    for line in p.stdout:
        line = line.decode(errors='replace' if sys.version_info < (3, 5)
                           else 'backslashreplace').rstrip()
        output += line
        print(line)
        if window:
            window.Refresh()

    retval = p.wait(timeout)

    return retval, output

while True:
    event, values = window.read()
    if event in (sg.WIN_CLOSED, 'Exit'):
        break
    if event == "-start-":
        os.chdir("Bot")
        command = "node index.mjs " + str(os.getpid())
        t = threading.Thread(target=runCommand, args=("node index.mjs", None, window))
        t.start()
    elif event == "-save-":
        enabledex = []
        disabledex = []
        testex = []
        allex = []
        for i in extensions:
            extension = i[5:]
            temp = "enabled"+extension
            if values[temp]:
                enabledex.append(extension)
                allex.append(extension)
            temp = "disabled"+extension
            if values[temp]:
                disabledex.append(extension)
                allex.append(extension)
            temp = "test"+extension
            if values[temp]:
                testex.append(extension)
                allex.append(extension)
        listex = {
            "enabled": enabledex,
            "disabled": disabledex,
            "test": testex,
            "all": allex
        }
        f = open('extensions.json', 'w')
        json.dump(listex, f, indent=2)
        f.close()

window.close()