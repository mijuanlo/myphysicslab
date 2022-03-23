#!/usr/bin/env python3
import json
import os
import re

OUTPUT_DIR="./output"
LANGS=["es","en","ca"]

def get_name(filename):
    if os.path.isfile(filename):
        with open(filename,'r') as fp:
            m=re.findall('<title>([^<]+)</title>',fp.read())
            if m:
                try:
                    return m[0].split('.')[-1]
                except:
                    return ''

for x in os.listdir(OUTPUT_DIR):
    meta={}
    prjdir=f'{OUTPUT_DIR}/{x}'
    locales = []
    for l in LANGS:
        if os.path.isfile(f'{prjdir}/{x}-{l}.html'):
            locales.append(l)
    meta.setdefault('languages',locales)
    for l in locales:
        meta.setdefault(f'name_{l}',get_name(f'{prjdir}/{x}-{l}.html'))
        meta.setdefault(f'banner_{l}',f'{x}.png')
        meta.setdefault(f'html_{l}',f'{x}-{l}.html')
    meta.setdefault('category','physics')
    meta.setdefault('require','')
    meta.setdefault('license','Apache-2.0')
    meta.setdefault('url','https://github.com/myphysicslab/myphysicslab')
    meta.setdefault('description',"Real-time interactive animated physics simulations")
    with open(f'{prjdir}/meta.json','w') as fp:
        json.dump(meta,fp,ensure_ascii=False)
