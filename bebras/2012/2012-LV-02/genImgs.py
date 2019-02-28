#! /usr/bin/python3 -B
conv = {}
conv['2012-LV-02-original.png'] = '-bordercolor "#ffffff" -trim -quality 50 -colors 20 -colorspace Gray'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

