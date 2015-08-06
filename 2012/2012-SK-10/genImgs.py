#! /usr/bin/python3 -B
conv = {}
conv['2012-SK-10-original.png'] = '-quality 100 -colorspace Gray'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

