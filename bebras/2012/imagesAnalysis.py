#! /usr/bin/python3 -B
import logging, sys
sys.path.append('scripts/')
from common import *

print("Analyse en cours...")
used, notUsed = ImAnalysis.analyseAllImages()
analysis(used, notUsed, {}, solutionMode = 2)

waitToQuit()
