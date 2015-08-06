#! /usr/bin/python3 -B
conv = {}
conv['2012-FR-10-exemple-original.png'] = '-bordercolor "#ffffff" -trim -quality 80 -colors 30'
conv['2012-FR-10-original.png'] = '-bordercolor "#ffffff" -trim -quality 80 -colors 30'
conv['2012-FR-10_solution-original.png'] = '-bordercolor "#ffffff" -trim -quality 80 -colors 30'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

