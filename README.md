# French Beaver Contest Archive

This repository contains tasks used in past [French Beaver Contest](http://castor-informatique.fr/). They are in a particular format, and can be used in [Bebras Platform](https://github.com/France-ioi/bebras-platform).

To start using:

```
git clone https://github.com/France-ioi/bebras-tasks.git
cd bebras-tasks
git submodule update --init
```

To update:

```
git pull
git submodule update --recursive
```

To update modules to the current version:

```
cd modules
git pull
git checkout master
cd ..
git commit
git push
```
