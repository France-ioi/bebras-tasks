#! /usr/bin/python3 -B
conv = {}
conv['2012-FR-02b-arbre-original.png'] = '-quality 80 -colors 200'
conv['2012-FR-02b-fenetre1-original.png'] = '-quality 80 -colors 100 -colorspace Gray'
conv['2012-FR-02b-fenetre2-original.png'] = '-quality 80 -colors 100 -colorspace Gray'

for letter in ['A','B','C','D']:
   conv['2012-FR-02b-answer'+letter+'-original.png'] = '-quality 80 -colors 100'

if __name__ == '__main__':
   import sys, os
   sys.path.append(os.path.join('..', 'scripts'))
   from common import *
   execute(conv)
