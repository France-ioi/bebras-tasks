#! /usr/bin/python3 -B
conv = {}
for i in range(0, 2):
   conv['2012-HU-01a_image'+str(i)+'-original.png'] = '-quality 50 -colors 50'
for i in range(1, 6):
   conv['2012-HU-01a_solution'+str(i)+'-original.png'] = '-quality 50 -colors 50'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

