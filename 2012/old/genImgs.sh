#! /bin/bash

line='---------------'
echo "Generating all the images:"
for dir in *; 
do
   if [[ ! -d "$dir" ]]; then
      continue;
   fi
   printf " - $dir %s "  ${line:$((${#dir}))};
   if [[ -e "$dir/genImgs.sh" ]]; then      
      cd "$dir";
      bash "genImgs.sh";
      cd ..;
      echo "DONE";
   else
      echo "Nothing to do";
   fi
done