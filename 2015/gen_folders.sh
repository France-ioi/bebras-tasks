S="2015-AT-07-telephone-book 2015-FR-03-mark-and-shuffle 2015-FR-05-visit-everyone 2015-SI-05-horse-races 2015-CH-09-intricated-labyrinth 2015-CA-02-fireworks 2015-CH-02-binary-tree-hotel 2015-FR-02-spreading-secret 2015-CZ-02-relationships 2015-DE-03-robotic-car 2015-DE-05-mobiles 2015-FR-01-copy-pattern 2015-IT-02-meteo 2015-SK-01-two-drawing-robots 2015-FR-04-next-distance 2015-FR-07-placing-arrows 2015-JP-04-crane-operating 2015-FR-06-modulo-ellipses"
for f in $S 
do
   mkdir $f
   cp 2015-FR-13-open-lock/index.html $f/index.html
   touch $f/task.js
   svn add $f
done