#! /usr/bin/python3 -B
conv = {}
conv['2012-DE-07-Robots-original.png'] = '-quality 80 -colors 50'
for i in range(1,5):
   conv['2012-DE-07-solution'+str(i)+'-original.png'] = '-quality 80 -colors 50'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

