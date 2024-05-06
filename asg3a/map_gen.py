import random

PREFIX = 'let MAPS = ['
BETWEEN = """]

let TEXTURES = ["""
SUFFIX = ']'





SIZE = 32




print(PREFIX)
for i in range(SIZE):
    line = []
    for j in range(SIZE):
        v = str(int(random.random()*2))
        line.append(v)

    print('[', ','.join(line), '],', sep='')

print(BETWEEN)

for i in range(SIZE):
    line = []
    for j in range(SIZE):
        v = str(int(random.random()*3))
        line.append(v)

    print('[', ','.join(line), '],', sep='')

print(SUFFIX)