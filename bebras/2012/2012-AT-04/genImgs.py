#! /usr/bin/python3 -B
conv = {}
conv['fish-original.png'] = '-quality 50 -colorspace Gray'
conv['2012-AT-04-solution-original.png'] = '-quality 50 -colorspace Gray'

for i in range(1, 6):
   conv['pix'+str(i)+'-solution-original.png'] = '-quality 100 -colors 100'
   conv['vec'+str(i)+'-solution-original.png'] = '-quality 100 -colors 100'

conv['solution-zoomX6-pixInter-original.png'] = '-quality 100 -colors 100'
conv['solution-zoomX6-pix-original.png'] = '-quality 100 -colors 100'
conv['solution-zoomX6-vec-original.png'] = '-quality 100 -colors 100'


if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)
