#! /usr/bin/python3 -B
import os
import glob
import subprocess
import sys
import re
import logging
import platform

## Configuring logging module
# Configure format
logging.basicConfig(format='%(levelname)s %(message)s', level=logging.DEBUG, datefmt='%I:%M:%S')
# Dirty solution to add color to the output
logging.addLevelName( logging.WARNING, "\033[1;31m%s\033[1;m" % logging.getLevelName(logging.WARNING))
logging.addLevelName( logging.ERROR, "\033[1;41m%s\033[1;m" % logging.getLevelName(logging.ERROR))


def file_get_contents(filename):
    with open(filename) as f:
        return f.read()

def pathJoin(dir, *args):
    if dir == ".":
        return os.path.join(*args)
    else:
        return os.path.join(dir, *args)

def waitToQuit():
    if platform.system() == "Windows":
        input('Cliquer sur <Entrée> pour continuer.')

class ImActions():
    """
    Get the "resize" option for the convert command
    """
    def getResizeOption(img):
        resize=""
        # The width can be reduced
        if img['width'] != -1:
            resize = img['width']
        # The height can be reduced
        if img['height'] != -1:
            resize = 'x'+str(img['height'])
        return resize

    """
    Get the gain that could be obtained with convert.
    Only a resize (estimation) or with standard options (real test).
    """
    def getPossibleGain(img, onlySize = True):
        if onlySize:
            if img['width'] != -1 and img['width'] < img['rWidth']:
                return (1 - img['width'] / img['rWidth']) * img['size']
            if img['height'] != -1 and img['height'] < img['rHeight']:
                return (1 - img['height'] / img['rHeight']) * img['size']
            return 0
        resize = ImActions.getResizeOption(img)
        if resize == "":
            resize = img['rWidth']
        ImActions.convertTmp(img['path'], '-bordercolor "#ffffff" -trim -resize ' + str(resize) + ' -quality 50 -colors 50')
        size = ImActions.convertTmp("tmp.png", '-print "%b"')
        ImActions.clean()
        gain = img['size'] - int(size[0:-1])
        if gain < 0:
            gain = 0
        return gain

    """
    Convert src to dst with the given arguments
    """
    def convert(src, dst, args = ""):
        cmd = "convert {} {} {}".format(src, args, dst)
        if platform.system() == "Linux":
            status, output = subprocess.getstatusoutput(cmd)
            if status != 0:
                logging.error("En executant la commande '{}':\t{}".format(cmd, output))
            return output
        else:
            p = subprocess.Popen(cmd, stdout=subprocess.PIPE, shell=True)
            output = p.stdout.readlines()
            status = p.poll()
            if len(output) != 0:
                output = bytes.decode(output[0])
            else:
                output = ""
            #if status != 0:
            #    print(status)
            #    logging.error("En executant la commande '{}':\t{}".format(cmd, output))
            return output        

    """
    Same as convert but the destination in "tmp.png".
    """
    def convertTmp(src, args = ""):  
        return ImActions.convert(src, "tmp.png", args)

    """
    Remove temporary files
    """
    def clean():
        if os.path.exists('tmp.png'):
            os.remove('tmp.png')


class ImAnalysis():
    """
    Analyse and sub-folders of the given folder.
    """
    def analyseAllImages(folder = "."):
        used = []
        notUsed = []
        for dir in os.listdir(folder):
            if not os.path.isdir(pathJoin(folder, dir)):
                continue
            dirUsed, dirNotUsed = ImAnalysis.analyseImages(pathJoin(folder, dir))
            used = used + dirUsed
            notUsed = notUsed + dirNotUsed
        used.sort(key = lambda x: x['img'])
        notUsed.sort()
        return used, notUsed

    """
    Analyse and returns all the used/not-used image in the folder.
    """
    def analyseImages(folder = "."):
        imgsUsed = ImAnalysis.getImgTags(folder)
        imgs = {img['img'] for img in imgsUsed}
        imgsNotUsed = [img for img in ImAnalysis.getAllImages(folder) if os.path.basename(img) not in imgs]
        return imgsUsed, imgsNotUsed 

    """
    Extract all the images used in a <img> tag in a HTML file in the folder.
    """
    def getImgTags(folder = ""):
        imgs = {}
        for fHTML in glob.glob(pathJoin(folder, "*.html")):
            html = file_get_contents(fHTML).replace('\n', '')
            for tag in re.findall("<img [^>]*>", html):
                img = re.sub(r".*src\s*=\s*['\"]([^'\"]+)['\"].*", r"\1", tag)
                name, ext = os.path.splitext(img)
                if not ext in ['.jpg', '.png']:
                    continue
                obj = {
                    'path':pathJoin(folder, img),
                    'html':tag,
                    'img':img,
                    'nbUsed':1
                    }
                obj['width'], obj['height'] = ImAnalysis.extractDimsFromTag(folder, tag)
                # New image
                if img not in imgs:
                    obj['rWidth'], obj['rHeight'], obj['size'] = ImAnalysis.getImageFileInfos(pathJoin(folder, img))
                    imgs[img] = obj
                # The image was already registered
                else:
                    imgs[img]['nbUsed'] += 1
                    # Both are defined but the current one is bigger
                    # => we keep the bigger size
                    for dim in ['height', 'width']:                
                        if imgs[img][dim] != -1 and imgs[img][dim] <= obj[dim]:
                            imgs[img][dim] = obj[dim]
                    # A different dimension was defined : each dim is once > 0 and once < 0
                    # => this will cause problems...
                    if imgs[img]['width'] * obj['width'] < 0 and imgs[img]['height'] * obj['height'] < 0:
                        logging.error("Dans {}, l'image {} est utilisée dans deux tags "
                                      ":\n\t{}\n\t{}\n\tPréciser à chaque fois la même dimension.".format(folder, obj['img'], tag, imgs[img]['html']))
                    continue
        return list(imgs.values())

    """
    Returns the extracted width/height infos from the <img > tag in the HTML code.
    """
    def extractDimsFromTag(folder, tag):
        infos = {}
        for dim in ['width', 'height']:
            # Img attribute            
            val = re.sub(r".*{}\s*=\s*['\"]([0-9]+)['\"].*".format(dim), r"\1", tag)
            # Style
            if val == tag:
                val = re.sub(r".*{}:([0-9]+)px.*".format(dim), r"\1", tag) 
            if val == tag:
                val = -1
                if re.match(r".*{}:([0-9]+).*".format(dim), tag) != None:
                    logging.error("Dans {}, tag invalide :\n\t{}\n\tIl faut obligatoirement utiliser 'px' dans le style.".format(folder, tag))
                    return -1, -1
            infos[dim] = int(val)
        if infos['height'] != -1 and infos['width'] != -1:
            logging.error("Dans {}, dans le tag suivant :\n\t{}\n\tNe préciser qu'une des deux dimensions.".format(folder, tag))

        return infos['width'], infos['height']

    """
    Returns the real width/height and disk-size of the image
    """
    def getImageFileInfos(img):
        if not os.path.exists(img):
            return -1,-1,-1
        width, height = ImActions.convertTmp(img, '-print "%w %h"').split(' ')
        ImActions.clean()
        size = os.path.getsize(img)
        return int(width), int(height), int(size)

    """
    Get all the images in the folder (excluding 'original' and 'old' ones)
    """
    def getAllImages(folder):
        all = []
        for ext in ['png', 'jpg']:
            for img in glob.glob(pathJoin(folder, "*." + ext)):
                if img.find("-original") != -1:
                    continue
                if img.find("-old") != -1:
                    continue
                all.append(img)
        return all


"""
Execute the requested conversions and show a report
0 : pas les solutions
1 : uniquement les solutions
2 : les deux
"""
def execute(conversions, solutionMode = 2):
    conversions = list(conversions.items())
    conversions = [(pathJoin(".", co[0]), co[1]) for co in conversions]
    conversions = dict(conversions)

    used, notUsed = ImAnalysis.analyseImages(".") 
    generateImages(used, notUsed, conversions)
    
    used, notUsed = ImAnalysis.analyseImages(".")
    analysis(used, notUsed, conversions, solutionMode)
    
    waitToQuit()
    
def generateImages(used, notUsed, conversions):
    dictUsed = {img['path']:img for img in used} 
    ## Execution of the requested conversions
    if len(conversions) > 0:
        print()
        print("CONVERSION DES IMAGES :")
        for src, args in conversions.items():
            print(" - " + src + ":")
            if src.find('-original') == -1:
                logging.error("Ce n'est pas un fichier original valide")
                continue
            dst = src.replace('-original', '')
            if not dst in dictUsed:
                logging.error("L'image {} n'est pas utilisée !".format(dst))
                continue
            resize = ImActions.getResizeOption(dictUsed[dst])
            if resize != "":
                if args.find("-trim") != -1:
                    args = args.replace("-trim", "-trim -resize {} ".format(resize))
                else:
                    args = "-resize {} {}".format(resize, args)
            print("      Arguments : {}".format(args))
            ImActions.convert(src, dst, args) 
            del dictUsed[dst]

    ## List the un-converted images
    if len(conversions) > 0 and len(dictUsed) > 0:
        print()
        print("IMAGES NON CONVERTIES :")
        for img in dictUsed.values():
            print(" - " + img['path'])


"""
Internal : show a complete report
0 : pas les solutions
1 : uniquement les solutions
2 : les deux
"""
def analysis(used, notUsed, conversions, solutionMode = 0):
    ## List the un-used images
    if len(notUsed) > 0:
        print()
        print("IMAGES NON UTILISEES :")
        for img in sorted(notUsed):
            print(" - " + img)
        
    ## List the used images
    if len(used) > 0:
        print()
        print("IMAGE UTILISEES :")
        totalSize = 0
        totalGainS = 0
        totalGainA = 0
        nbImgs = 0
        for img in sorted(used, key = lambda x: x['size']):
            estSol = img['img'].find("solution") != -1
            if estSol and solutionMode == 0: 
                continue
            if not estSol and solutionMode == 1: 
                continue
            totalSize += img['size']
            nbImgs += 1

            name, ext = os.path.splitext(img['path'])
            oriName = name + "-original" + ext

            print("{size} {path}".format(**img))
            print("    Utilisée {nbUsed} fois, TailleRéelle({rWidth} x {rHeight}), TailleUtilisée({width} x {height})".format(**img))
            if oriName in conversions.keys():
                print("    Déjà converti.")
            elif img['size'] > 0:
                # Gain when resizing image
                gain = ImActions.getPossibleGain(img)
                totalGainS += gain
                if gain > 0:
                    print("    Gain éventuel (taille) : {} Ko".format(round(gain / 1024, 1)))
                # Gain with resize + standard options
                gain = ImActions.getPossibleGain(img, onlySize = False)
                totalGainA += gain
                if gain > 0:
                    print("    Gain éventuel (taille + options) : {} Ko".format(round(gain / 1024, 1)))


    print()
    print("BILAN :")
    print("{} images utilisées".format(nbImgs))
    print("Taille totale : {} Ko".format(totalSize // 1024))
    print("Gain éventuel (taille) : {} Ko".format(totalGainS // 1024))
    print("Gain éventuel (taille + options) : {} Ko".format(totalGainA // 1024))


# supprimer jpg
# warning si taille pas précisée
# génération dans un dossier ne marche pas
