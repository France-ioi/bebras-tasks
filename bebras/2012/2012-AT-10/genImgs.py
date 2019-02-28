#! /usr/bin/python3 -B
conv = {}
for letter in ['A','B','C','D']:
   conv['2012-AT-10_image'+letter+'-original.png'] = '-quality 50 -colors 50'
conv['2012-AT-10_image-original.png'] = '-quality 50 -colors 50'
for letter in ['A','B','C','D']:
   conv['2012-AT-10_solution'+letter+'-original.png'] = '-quality 50 -colors 50'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)
