#!/usr/bin/env python3
import os;
import json;
import sys;
from datetime import datetime


def versionize(fileName, newFileName, fieldName, version):
    if not os.path.exists(newFileName):
        new_env = open(newFileName, 'x')
        new_env.close()
    env_temp = open(newFileName, 'r+')
    file = open(fileName, 'r+')
    lines = file.readlines()
    for line in lines:
        if fieldName not in line:
            env_temp.write(line)
    env_temp.write(fieldName + '=' + version + "\n")
    file.close()
    env_temp.close()
    os.remove(fileName)
    os.rename(newFileName, fileName)


os.chdir('./..')
now = datetime.now()
current_date = now.strftime("%d-%m-%Y")
current_time = now.strftime("%H:%M:%S")
packageJSON = open('package.json')
data = json.load(packageJSON)
timestamp = current_date + '/' + current_time

if sys.argv[1] == 'prod':
    versionize('.env.production', 'temp.env', 'VUE_APP_VERSION', data['version'] )
    versionize('.env.production', 'temp.env', 'VUE_APP_COMPILATION_TIMESTAMP', timestamp)
    print('Changed version on production')
elif sys.argv[1] == 'preprod':
    versionize('.env.preproduction', 'temp.env', 'VUE_APP_VERSION', data['version'] )
    versionize('.env.preproduction', 'temp.env', 'VUE_APP_COMPILATION_TIMESTAMP', timestamp)
    print('Changed version on preproduction')
elif sys.argv[1] == 'dev':
    versionize('.env.development', 'temp.env', 'VUE_APP_VERSION', data['version'] )
    versionize('.env.development', 'temp.env', 'VUE_APP_COMPILATION_TIMESTAMP', timestamp)
    print('Changed version on development')
else:
    print('Invalid arguments')
