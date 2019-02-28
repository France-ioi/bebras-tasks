#! /usr/bin/python3 -B
conv = {}
conv['2012-DE-01-original.png'] = '-quality 50 -colors 100'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

