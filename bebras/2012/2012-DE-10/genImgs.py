#! /usr/bin/python3 -B
conv = {}
for letter in 'ABCD':
   conv['2012-DE-10_image'+letter+'-original.png'] = '-bordercolor "#ffffff" -trim -quality 80 -colors 50'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

