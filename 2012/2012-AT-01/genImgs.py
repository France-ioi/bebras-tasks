#! /usr/bin/python3 -B
conv = {}
for letter in 'ABCD':
   conv['2012-AT-01-sol'+letter+'-original.png'] = '-quality 50 -colors 50'
for i in range(0, 4):
   conv['2012-AT-01-etape'+str(i)+'-original.png'] = '-quality 50 -colors 50'
conv['2012-AT-01-res-original.png'] = '-quality 50 -colors 50'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

