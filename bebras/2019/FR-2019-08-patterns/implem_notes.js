      // REVIEW[ARNAUD]: pour la prochaine fois :
      // une manière plus simple sans doute d'implémenter cela, ce serait de calculer l'ensemble des coordonnées des cases qu'occuperait la forme, et de voir s'il s'agit de coordonnées valides et si ces coordonnées recouvrent celles validant "isCellSelected".
      // Pour gérer la rotation, la forme peut être décrite par rapport à son centre en coordonnées relatives: [[0,0], [-1,0], [0,-1], [0,1]], et l'effet des rotations est le mapping (x,y) -> (y,-x) -> (-x,-y) -> (-y,x) à appliquer sur les cases, que l'on peut représenter par l'application successives de la matrice de rotation [[0,-1],[0,1]] aux vecteurs (x,y). (Une rotation peut se décrire par un nombre de 0 à 3 indiquant le nombre de fois qu'il faut appliquer la matrice de rotation.) Pour une rotation donnée, en ajoutant une translation aux coordonnées, on retrouve l'ensemble des cases couvertes par la forme, et on peut tester s'il s'agit de coordonnéees dans la grille, et utiliser un tableau de booléens pour savoir si on tombe sur des cases déjà utilisées.
      // Une autre manière plus directe de coder cela consiste à définir une fonction "rotate(dir,x,y)" avec dir entre 0 et 3, qui fait le switch et: switch (dir) case 0: return [x,y]; case 1: return [y,-x], etc...
      // à partir de là on peut définir une fonction "rotatePoints(dir,points)" qui prend un tableau de points (x,y).


   function rotateShape(cellsBefore, rot) { // rot must be in [0,4)
      var m = [ [[1,0],[0,1]], [[0,-1],[1,0]], [[-1,0],[0,-1]], [[0,1],[-1,0]] ]; // rotationMatrix
      var cells = [];
      for(var iCell = 0; iCell < cellsBefore.length; iCell++) {
         var c = cellsBefore[iCell];
         cells.push(c[0]*m[0][0]+c[1]*m[0][1], c[0]*m[1][0]+c[1]*m[1][1]);
      }
      return cells;
   };

   function translateShape(cellsBefore, trans) {
      var cells = [];
      for(var iCell = 0; iCell < cellsBefore.length; iCell++) {
         var c = cellsBefore[iCell];
         cells.push(c[0]*trans[0], c[0]+trans[1]);
      }
      return cells;
   }

   function getSpot(row,col) {
      var shiftRow = (level == "hard") ? 1 : 0; // recall that "hard" shape needs to be translated by [1,0]
      var trans = [row+shiftRow, col];
      var cells = rotateShape(shape, answer.rotation);
      return translateShape(cells, trans);
   }


      var data = {
      easy: {
         shape: [ [0,0], [0,1], [1,1] ], // [row,col] format

      },
      medium: {
         shape: [ [0,0], [1,0], [2,0], [2,1] ],

      },
      hard: {
         shape: [ [-1,0], [0,0], [0,-1], [1,0] ], // in rotation 0; needs to be translated by [1,0] to obtain real coordinates.

      }
   };


   // idéalement il fadudrait éviter d'avoir besoin de translater la forme qui tourne lorsqu'elle tourne.