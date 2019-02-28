#! /usr/bin/python3 -B
conv = {}
for i in range(1, 5):
   conv['2012-SK-03-'+str(i)+'-original.png'] = '-quality 50 -colors 50'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

