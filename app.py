import PySimpleGUI as sg
import os
import subprocess
import threading
import sys
import json
import webbrowser

icon = b'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAZ1JREFUeF7tW0FygzAQw9yS96TNL5IXtZf2Q+krmjbvSW645xWHHY2AFKzcCAavhSSvF1POXVe7hn/FAJgBlkDwgLf9cdOO8HG/hvGNPMAAmAGNS+B9FwGoBS1h9Ac0iGlFLfG41D5qED0Ybl/FLAUv/8w8wACYAY1LwNOgp8HGp0FLACTw8vih1ga/u1eqPdtYjYdeC6gdsgPM2qvxGIAsE0QPUBHPnih7Xo0nZcBXicn4MAxUjH0fc33VE3DAajwnWFyM6gEGwAywBILmUXMFGFJBU0t7ABuP7AFsh3ObIBuPAVBnARbxzTEgSwqW9gA2HlkCbIdzM4CNxwCoHsAivjoGNL8YMgCuCMWiqLr+zjyDPa/Gk9YDXBT1ewG/F2Bluar2s3vAAaquU6NzEyVqANiyOPsEzQBLIO7DO7MUgvYXOF6dBxgAM0BDwBKwB0QEbIJrywQ3PwsU2Otbu7g/4HD/llxQpTx2PvlawACYAbA9vjUJSAJ/wsWTe8ATxiB1aQDmLohIj2eBi1MGLBDDv+rC3w774+nGP57+A4eDE99sqJN5AAAAAElFTkSuQmCC'

sg.LOOK_AND_FEEL_TABLE['Crimson'] = {'BACKGROUND': '#36393e', 'TEXT': '#ffffff', 'INPUT': '#1e2124', 'TEXT_INPUT': '#ffffff', 'SCROLL': '#282b30', 'BUTTON': ('#000000', '#cc0c39'), 'PROGRESS': ('#D1826B', '#CC8019'), 'BORDER': 1, 'SLIDER_DEPTH': 0, 'PROGRESS_DEPTH': 0, }

sg.theme('Crimson')
sg.set_options(font=('Arial', 16))

def getExtensions():
    f = open('config.json')
    data = json.load(f)
    serverid = data["testServer"]
    if type(serverid) == list:
        tempcurrent = "["
        for i in serverid:
            if serverid.index(i) == len(serverid) - 1:
                tempcurrent = tempcurrent + i + "]"
            else:
                tempcurrent = tempcurrent + i + ", "
        serverid = tempcurrent
    returnting = [sg.Tab("Crimson", [[sg.Text("Test Server:")], [sg.Input(serverid, key="testserverid")]])]
    returnting2 = []
    subfolders = [f.path for f in os.scandir("Extensions") if f.is_dir()]
    data = None
    for i in subfolders:
        name = i[11:]
        metadata = open(i+'/extension.json')
        metadata = json.load(metadata)
        metaname = metadata["name"]
        metatype = metadata["type"]
        returnting2.append("state"+name)
        try:
            f = open(i + '/config.json')
            data = json.load(f)
            thing = data["name"]
            current = data["thing"]
        except:
            thing = None
            current = None
        f = open('extensions.json')
        data = json.load(f)
        enabled = data["enabled"]
        disabled = data["disabled"]
        test = data["test"]
        tab = None

        def makeMenu(en, dis, test, thing, current, name):
            templayout = [[sg.Input(visible=False)], [sg.Radio('Enabled', "state"+name, default=en, key="enabled"+name)], [sg.Radio('Disabled', "state"+name, default=dis, key="disabled"+name)], [sg.Radio('Testing', "state"+name, default=test, key="test"+name)]]
            if thing is not None and current is not None:
                if type(current) == list:
                    tempcurrent = "["
                    for i in current:
                        if current.index(i) == len(current)-1:
                            tempcurrent = tempcurrent + i + "]"
                        else:
                            tempcurrent = tempcurrent + i + ", "
                    current = tempcurrent
                templayout.append([sg.Text(thing), sg.Input(current, key="config"+name)])
            if metatype == "library":
                if metaname == "PyRun":
                    templayout = [[sg.Input(visible=False)],
                                  [sg.Radio('Enabled', "state" + name, default=True, key="enabled" + name)],
                                  [sg.Radio('Disabled', "state" + name, default=False, key="disabled" + name, disabled=True)],
                                  [sg.Radio('Testing', "state" + name, default=False, key="test" + name,disabled=True)],
                                  [sg.Text("This is PyRun, you can't disabled PyRun because it is a library, you can find more\nin the link below")],
                                  [sg.Text("https://SkyoProductions.github.io/wiki#crimsonpyrun", key="pyrun", enable_events=True)]]
                else:
                    templayout = [[sg.Input(visible=False)],
                                  [sg.Radio('Enabled', "state"+name, default=True, key="enabled"+name)],
                                  [sg.Radio('Disabled', "state"+name, default=False, key="disabled"+name, disabled=True)],
                                  [sg.Radio('Testing', "state"+name, default=False, key="test"+name, disabled=True)],
                                  [sg.Text("This is a special type of extension, even if it's disabled or in testing other\nextensions can access it due to it being a library extension.")]]
            return templayout
        if name in enabled:
            if name in disabled:
                if name in test:
                    data["test"].remove(name)
                    data["disabled"].remove(name)
                    layoutt = makeMenu(True, False, False, thing, current, name)
                    tab = sg.Tab(metaname, layoutt)
                else:
                    data["disabled"].remove(name)
                    layoutt = makeMenu(True, False, False, thing, current, name)
                    tab = sg.Tab(metaname, layoutt)
            elif name in test:
                data["test"].remove(name)
                layoutt = makeMenu(True, False, False, thing, current, name)
                tab = sg.Tab(metaname, layoutt)
            else:
                layoutt = makeMenu(True, False, False, thing, current, name)
                tab = sg.Tab(metaname, layoutt)
        elif name in disabled:
            layoutt = makeMenu(False, True, False, thing, current, name)
            tab = sg.Tab(metaname, layoutt)
        elif name in test:
            layoutt = makeMenu(False, False, True, thing, current, name)
            tab = sg.Tab(metaname, layoutt)
        returnting.append(tab)
    with open("extensions.json", "w") as outfile:
        json.dump(data, outfile)
    return returnting, returnting2

tabs, extensions = getExtensions()

#, reroute_stdout=True, reroute_stderr=True
console = [[sg.Multiline("", size=(160, 20), autoscroll=True, reroute_stdout=True, reroute_stderr=True, key='-OUTPUT-', font=("Arial", 8), disabled=True)]]

start = [[sg.Text("Press start to run the Discord bot")], [sg.Button("Start", key="-start-", enable_events=True)], [sg.Frame("Output", console)]]
options = [[sg.Text("Change Crimson configuration here")], [sg.TabGroup([tabs])], [sg.Button("Save", key="-save-", enable_events=True)]]

try:
    f = open("Bot/version.txt", "r")
    ver = f.read()
except:
    ver = "Unknown, Start Crimson so a version file can be created"

info = [[sg.Text("GUI Version - Open Beta 1")], [sg.Text("Bot Version - "+ver)], [sg.Text("Credit to PySimpleGUI to allow the making of this GUI")]]

layout = [[sg.Input(visible=False)], [sg.Text("CrimsonGUI", font=("Arial", 18))],
          [sg.TabGroup([[sg.Tab("Bot", start), sg.Tab("Options", options), sg.Tab("Information", info)]])]]

window = sg.Window('CrimsonGUI', layout, size=(800, 500), margins=(0,0), finalize=True, use_default_focus=False, icon=icon)
window["pyrun"].set_cursor("hand2")
window["pyrun"].Widget.bind("<Button-1>", lambda _: window["pyrun"].update(text_color='blue'))
def finclicked():
    window["pyrun"].update(text_color='white')
    webbrowser.open("https://SkyoProductions.github.io/wiki#crimsonpyrun")
window["pyrun"].Widget.bind("<ButtonRelease-1>", lambda _: finclicked())
window["pyrun"].Widget.bind("<Enter>", lambda _: window["pyrun"].update(font=('Arial', 16, "underline")))
window["pyrun"].Widget.bind("<Leave>", lambda _: window["pyrun"].update(font=('Arial', 16)))

p = None

def runCommand(cmd, timeout=None, window=None):
    p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    output = ''
    for line in p.stdout:
        line = line.decode(errors='replace' if sys.version_info < (3, 5) else 'backslashreplace').rstrip()
        output += line
        print(line)
        if window:
            window.Refresh()

    retval = p.wait(timeout)

    return retval, output

online = False

while True:
    event, values = window.read(timeout=200)
    if event in (sg.WIN_CLOSED, 'Exit'):
        break
    if event == "-start-":
        if online:
            continue
        else:
            os.chdir("Bot")
            t = threading.Thread(target=runCommand, args=("node index.mjs", 5, window))
            t.start()
            online = True
    if event == "-save-":
        enabledex = []
        disabledex = []
        testex = []
        for i in extensions:
            extension = i[5:]
            temp = "enabled"+extension
            if values[temp]:
                enabledex.append(extension)
            temp = "disabled"+extension
            if values[temp]:
                disabledex.append(extension)
            temp = "test"+extension
            if values[temp]:
                testex.append(extension)
            try:
                inputt = values["config"+extension]
                try:
                    inputt = json.loads(inputt)
                except:
                    inputt = values["config" + extension]
                f = open("Extensions/"+extension+"/config.json")
                data = json.load(f)
                thing = data["name"]
                savelist = {
                    "name": thing,
                    "thing": inputt
                }
                f = open("Extensions/"+extension+"/config.json", 'w')
                json.dump(savelist, f, indent=4)
                f.close()
            except:
                ok = None
        listex = {
            "enabled": enabledex,
            "disabled": disabledex,
            "test": testex
        }
        f = open('extensions.json', 'w')
        json.dump(listex, f, indent=4)
        f.close()
        testserver = values["testserverid"]
        testserver = json.loads(testserver)
        testserlist = []
        for i in testserver:
            testserlist.append(str(i))
        crimcfg = {
            "testServer": testserlist
        }
        f = open('config.json', 'w')
        json.dump(crimcfg, f, indent=4)
        f.close()
        sg.Popup('Options saved successfully', keep_on_top=True)

window.close()