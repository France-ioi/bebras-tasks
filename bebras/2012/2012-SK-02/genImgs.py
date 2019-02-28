#! /usr/bin/python3 -B
conv = {}
conv['2012-SK-02_1-original.png'] = '-quality 50 -colors 50'
conv['2012-SK-02_2-original.png'] = '-quality 50 -colors 50'
conv['2012-SK-02_3-original.png'] = '-quality 50 -colors 50'
conv['2012-SK-02_solution-original.png'] = '-quality 50 -colors 50'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

