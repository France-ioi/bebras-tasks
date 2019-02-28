#! /usr/bin/python3 -B
conv = {}
for dir in ['left', 'right', 'up', 'down']:
   conv[dir + '-original.png'] = '-quality 80 -colors 100 -colorspace Gray'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

