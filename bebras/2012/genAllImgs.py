#! /usr/bin/python3 -B
import logging, sys
sys.path.append('scripts/')
from common import *
import imp

allConv = {}
for dir in os.listdir("."):
    if os.path.exists(pathJoin(dir, "genImgs.py")):
        # Import the file
        path = sys.path
        sys.path.append(dir)
        import genImgs
        genImgs = imp.reload(genImgs)
        # Get conversions
        conv = list(genImgs.conv.items())
        conv = [(pathJoin(".", dir, co[0]), co[1]) for co in conv]
        allConv = dict(list(allConv.items()) + conv)
        # Remove dir from path
        sys.path.remove(dir)

print("Analyse en cours...")

used, notUsed = ImAnalysis.analyseAllImages()
generateImages(used, notUsed, allConv)
used, notUsed = ImAnalysis.analyseAllImages()
analysis(used, notUsed, allConv, solutionMode = 2)

waitToQuit()
