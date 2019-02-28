
function Task() {
  this.mode = "";
  this.interval_id = -1;
};

Task.prototype.load = function(random_seed, mode) {
   var nbColumns = 20;
   var nbLines = 14;
   var cellSize = 30;
   var colorDiameter = 40;
   var margin = 10;
   var that = this;

   var cellColor = [
      "1.........5.3...7...",
      ".....2.............6",
      "...4.......1...5....",
      "3......6.....6......",
      "......1..........3..",
      "..2..6.....2...7....",
      "5..................4",
      ".7....4..7....1.....",
      "...3..............2.",
      ".......4...3...6....",
      ".6...5..............",
      "..4.........5...1...",
      ".....2..2.........4.",
      ".1..7.........2....7"
   ]

   this.mode = mode;
   paper = Raphael(document.getElementById('anim'),(nbColumns + 5) * cellSize + 2 * margin, nbLines * cellSize + 2 * margin);

   var setClick = function(rect, iLig, iCol) {
      rect.node.onclick = function() {
         var y = margin + (nbLines - iLig - 1) * cellSize;
         var width = (iCol + 1) * cellSize;
         var height = (iLig + 1) * cellSize;
         that.rectNbLins = iLig + 1;
         that.rectNbCols = iCol + 1;
         that.bigRect.attr({y: y , width: width, height: height});
         updateTexts()
      }
   }

   var getColor = function(iLig, iCol) {
      var color = cellColor[nbLines - 1 - iLig].charAt(iCol);
      if (color == '.') {
         return -1;
      }
      return parseInt(color) - 1;
   }

   var updateTexts = function() {
      var nbPerColor = [0, 0, 0, 0, 0, 0, 0];
      for (var iLig = 0; iLig < that.rectNbLins; iLig++) {
         for (var iCol = 0; iCol < that.rectNbCols; iCol++) {
            var color = getColor(iLig, iCol);
            if (color != -1) {
               nbPerColor[color]++;
            }
         }
      }
      var hasNon2 = false;
      for (var iColor = 0; iColor < 7; iColor++) {
         that.texts[iColor].attr({'text': nbPerColor[iColor]});
         if (nbPerColor[iColor] != 2) {
            hasNon2 = true;
         }
      }
      if (!hasNon2) {
         alert("You won !");
      }
   }
   var rainbowColors = ["#FF6060", "#FF9F40", "#FFFF40", "#40FF40", "#6060FF", "#AB60F2", "#DF40FF"];

   var setRectGrille = paper.set();
   for (var iLig = 0; iLig < nbLines; iLig++) {
      for (var iCol = 0; iCol < nbColumns; iCol++) {
         var rect = paper.rect(margin + iCol * cellSize, margin + (nbLines - 1 - iLig) * cellSize, cellSize, cellSize);
         var fill = 'white';
         var color = getColor(iLig, iCol);
         if (color != -1) {
            //fill = rainbowColors[color];            
         }
         rect.attr({'stroke': 'black', 'fill': fill});
         setClick(rect, iLig, iCol);
         setRectGrille.push(rect);
      }
   }
   this.texts = [];
   for (var iColor = 0; iColor < 7; iColor++) {
      var cx = margin + (nbColumns) * cellSize + colorDiameter;
      var cy = margin * 2 + colorDiameter/2 + iColor * colorDiameter * 1.5;
      var circle = paper.circle(cx, cy, colorDiameter / 2);
      circle.attr({'stroke': 'black', 'fill': rainbowColors[iColor]});
      this.texts[iColor] = paper.text(cx, cy, 0);
      this.texts[iColor].attr({'font-size': 22, 'font-weight': 'bold' });
   }
   this.rectNbCols = 8;
   this.rectNbLins = 5;
   this.bigRect = paper.rect(margin, margin + (nbLines - this.rectNbLins) * cellSize, this.rectNbCols * cellSize, this.rectNbLins * cellSize);
   this.bigRect.attr({'stroke': 'black', 'stroke-width': 6});
   updateTexts();
};

Task.prototype.unload = function() {
};

Task.prototype.getAnswer = function() {
}

Task.prototype.reloadAnswer = function(strAnswer) {
}

var task = new Task();
