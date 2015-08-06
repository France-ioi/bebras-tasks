#! /usr/bin/python3 -B
conv = {}
conv['2012-IT-13-original.png'] = '-quality 80 -colors 1000'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

