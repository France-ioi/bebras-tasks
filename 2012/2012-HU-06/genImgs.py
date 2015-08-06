#! /usr/bin/python3 -B
conv = {}
conv['arbre-original.png'] = '-quality 50 -colors 80'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

