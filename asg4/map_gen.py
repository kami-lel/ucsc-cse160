import random

PREFIX = 'let MAPS = [['
BETWEEN = '],['
SUFFIX = ']]'


SIZE = 32
LAYER = 4


print(PREFIX)

for l in range(LAYER):
    print("    // layer {}".format(l+1))

    for i in range(SIZE):
        line = []

        for j in range(SIZE):
            v = str(0)
            line.append(v)

        print('    [', ','.join(line), '],', sep='')

    if (l != LAYER-1):
        print(BETWEEN)

print(SUFFIX)



#print(PREFIX)
#for i in range(SIZE):
#    line = []
#    for j in range(SIZE):
#        v = str(int(random.random()*2))
#        line.append(v)
#
#    print('[', ','.join(line), '],', sep='')
#
#print(BETWEEN)
#
#for i in range(SIZE):
#    line = []
#    for j in range(SIZE):
#        v = str(int(random.random()*3))
#        line.append(v)
#
#    print('[', ','.join(line), '],', sep='')
#
#print(SUFFIX)