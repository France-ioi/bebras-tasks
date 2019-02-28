#! /usr/bin/python3 -B
conv = {}
conv['2012-CA-01-image-original.png'] = '-bordercolor "#ffffff" -trim -quality 80 -colors 50'
conv['2012-CA-01-Starting-original.png'] = '-bordercolor "#ffffff" -trim -quality 80 -colors 80 -colorspace Gray'
conv['2012-CA-01-Final-original.png'] = '-bordercolor "#ffffff" -trim -quality 80 -colors 80 -colorspace Gray'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

