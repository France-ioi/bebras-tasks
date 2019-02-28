# Fix all HTLML/text file that are not in UTF8
for f in $(find . -name "*.html" -o -name "*.txt")
do
   infos=$(file "$f")   
   encoding=$(echo "$infos" | sed -r 's/.*, ([a-ZA-Z0-9-]*).*text(,|$).*/\1/')
   #echo $infos
   # Correct non UTF-8
   if [[ $encoding != "UTF-8" ]]; then
       if [[ $encoding == "ISO-8859" ]]; then
           encoding="ISO-8859-1"
       fi
       echo "$f was in $encoding"
       iconv -f "$encoding" -t "UTF-8" "$f" --output "$f"
   fi
   # Remove all the \r
   sed -i 's/\r//' "$f"
done
echo ""
echo "Some file without any special caracters will remains in ASCII. That's OK."
