#! /usr/bin/python3 -B
conv = {}
for digit in range(0, 10):
   conv['digital'+str(digit)+'-original.png'] = '-quality 100 -colors 50'
for name in ['3inv','7inv-solution']:
   conv['digital'+name+'-original.png'] = '-quality 100 -colors 50'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

