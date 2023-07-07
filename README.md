# French Beaver Contest Archive

Testing commit 2 from remote

This repository contains tasks used in past [French Beaver Contest](http://castor-informatique.fr/). They are in a particular format, and can be used in [Bebras Platform](https://github.com/France-ioi/bebras-platform).

To start using:

```
git clone https://github.com/France-ioi/bebras-tasks.git
cd bebras-tasks
git submodule update --init
```

To open tasks, open in a browser the file `bebras/index.html`.

To view only interactive tasks, edit the url to: `index.html?interactive=1`.
To view the loading specific versions, edit the url to: `index.html?dev=1`.

To update:

```
git pull
git submodule update --recursive
```

To update modules to the current version:

```
cd _common/modules
git checkout master
git pull
cd ../..
git add _common/modules/
git commit -m "update modules"
git push
```
