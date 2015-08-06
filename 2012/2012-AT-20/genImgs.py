#! /usr/bin/python3 -B
conv = {}
conv['2012-AT-20-original.png'] = '-quality 90 -colors 50'
conv['2012-AT-20_Robbie-original.png'] = '-quality 90 -colors 50'
for letter in 'ACD':
   conv['2012-AT-20_Sticks'+letter+'-solution-original.png'] = '-quality 90 -colors 50'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

