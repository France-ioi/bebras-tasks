#! /bin/bash

allImgs=$(find . -name "*.jpg" -o -name "*.png" | grep -vE "(solution|original|old)")

usedImgs=""
notUsedImgs=""
usedSize=0
notUsedSize=0
for img in $(echo "$allImgs" | sort )
do
   size=$(ls -l "$img" | cut -d' ' -f5)
   # Search for use of the image (in HTML files)
   grep -r $(basename "$img") $(dirname "$img") 2> /dev/null | grep -v ".svn" > /dev/null
   if [[ $? -eq 0 ]]; then
      usedImgs+="$img"$'\n' 
      usedSize=$((usedSize+size))
   else
      notUsedImgs+="$img"$'\n'  
      notUsedSize=$((notUsedSize+size))
   fi
done
notUsedImgs=$(echo "$notUsedImgs" | sed '/^$/d')
usedImgs=$(echo "$usedImgs" | sed '/^$/d')

nbTotal=$(echo "$allImgs" | wc -l)
nbUsed=$(echo "$usedImgs" | wc -l)
nbNotUsed=$(echo "$notUsedImgs" | wc -l)


printf "Unused images:\n$notUsedImgs\n"
printf "\n"

printf "Used images:\n"

gain=0
while read size img; do
   usages=$(grep -r $(basename "$img") $(dirname "$img") 2> /dev/null | grep -v ".svn" | grep ".html")
   w=$(echo "$usages" | head -n 1 | sed -rn "s/.*width=[\"']([0-9]*)[\"'].*/\1/p")
   if [[ $w == "" ]]; then
      w=$(echo "$usages" | head -n 1 | sed -rn "s/.*width:([0-9]*).*/\1/p")
   fi
   h=$(echo "$usages" | head -n 1 | sed -rn "s/.*height=[\"']([0-9]*)[\"'].*/\1/p")
   if [[ $h == "" ]]; then
      h=$(echo "$usages" | head -n 1 | sed -rn "s/.*height:([0-9]*).*/\1/p")
   fi
   set $(convert "$img" -print "%w %h" /dev/null)
   printf "$size $img\n"
   printf "  Used %d times, Real($1 x $2), Used($w x $h)\n" $(echo "$usages" | wc -l);
   if [[ $w != "" && $1 -ge $w ]]; then
      localGain=$((size - (size * w * w) / ($1 * $1) ))
      gain=$((gain + localGain))
      printf "  Resizing gain : %d Ko\n" $((localGain / 1024));
   elif [[ $h != "" && $1 -ge $h ]]; then
      localGain=$((size - (size * h * h) / ($2 * $2) ))
      gain=$((gain + localGain))
      printf "  Resizing gain : %d Ko\n" $((localGain / 1024));
   fi
done < <(
   for img in $usedImgs
   do
      ls -l "$img"
   done | cut -d' ' -f5- | sed -r 's/^([0-9]*) .*(\.\/.*)$/\1 \2/' | sort -g -k1,1
)

printf "\n"
printf "There is a total of %d images:\n" $nbTotal
printf "%d unused images, for a total of %d Ko\n" $nbNotUsed $((notUsedSize/1024))
printf "%d used images, for a total of %d Ko\n" $nbUsed $((usedSize/1024))
printf "%d Ko can be gained by resizing images\n" $((gain / 1024))

exit 0