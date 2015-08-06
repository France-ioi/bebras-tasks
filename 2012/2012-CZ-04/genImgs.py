#! /usr/bin/python3 -B
conv = {}
# -bordercolor "#ffffff" -trim
# -colorspace Gray
conv['2012-CZ-04-solution-original.png'] = '-bordercolor "#ffffff" -trim -quality 100 -colors 50'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

