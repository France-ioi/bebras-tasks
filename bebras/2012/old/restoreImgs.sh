#! /bin/bash

for f in $(find . -name "*-original*" | grep -v ".svn")
do
   cp "$f" ${f/-original/};
done