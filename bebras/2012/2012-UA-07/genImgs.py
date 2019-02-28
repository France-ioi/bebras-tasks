#! /usr/bin/python3 -B
conv = {}
conv['2012-UA-07-solution-original.png'] = '-quality 100 -colors 30'
conv['2012-UA-07_automate-original.png'] = '-bordercolor "#ffffff" -trim -quality 100 -colors 30'


if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

