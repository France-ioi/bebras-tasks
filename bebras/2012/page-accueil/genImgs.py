#! /usr/bin/python3 -B
conv = {}
conv['bandeau-original.png'] = '-quality 100 -colors 50'
conv['menu-droite-original.png'] = '-quality 100 -colors 50'
conv['reponse-original.png'] = '-quality 100 -colors 50'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)

