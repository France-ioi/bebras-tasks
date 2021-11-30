function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   // Documentation of attributes: see containerTextAttr
   var data = {
      easy: {
         text: [ taskStrings.text0, taskStrings.text1, taskStrings.text3 ],
         objective: [
            [0,1],
            [3]
         ],
         nbPlacesAttr: 3,
         nbStyles: 2,
         nbPlacesStyle: 0, // not relevant
         attributes: [ 0, 1, 2, 3 ]
      },
      medium: {
         text: [ taskStrings.text0, taskStrings.text1, taskStrings.text2, taskStrings.text3 ],
         objective: [
            [0,1],
            [3],
            [0,1],
            [3]
         ],
         nbPlacesAttr: 3,
         nbStyles: 3,
         nbPlacesStyle: 1,
         attributes: [ 0, 1, 2, 3 ]
      },
      hard: {
         text: [ taskStrings.text0, taskStrings.text1, taskStrings.text4, taskStrings.text2, taskStrings.text3 ],
         objective: [
            [0,4,2],
            [1,3],
            [7],
            [0,4,2,7],
            [1,3,7]
         ],
         nbPlacesAttr: 3,
         nbStyles: 3,
         nbPlacesStyle: 3,
         attributes: [ 0, 1, 2, 3, 4, 5, 6, 7 ]
      }
   };

   var paper;
   var paperW = 770;
   var paperH;
   var marginX = 15;
   var marginY = 20;
   var styleW = 75;
   var styleH = 30;
   var attrW = 80;
   var attrH = styleH;
   var controlBoxW = paperW;
   var controlBoxH;
   var xControlBox = 0;
   var yControlBox = 0;
   var attrLineW;
   var xOption = marginX;
   var yOptionAttr;
   var yOptionStyle;
   var xStyles;
   var xNumber;
   var xSecondColumn;
   var reservedStyleOfW = 105;
   var xDropStyles;
   var dropAttrH = attrH + 2;
   var dropStylesH = styleH + 2;
   var dropAttrW;
   var dropStylesW;
   var xDropAttr = 100;
   if (typeof enableRtl != 'undefined') {
      xDropAttr = 10;
   }
   var circleR = styleH/2 - 2;

   var title = [ taskStrings.result, taskStrings.objective ];
   var text;
   var nbRows;
   var nbCol = 3;
   var objective;
   var nbStyles;
   var nbPlacesStyle;
   var attributes;
   var nbAttributes;
   var nbAttrPerLine, nbStylePerLine;
   var nbAttrLines, nbStyleLines;
   var delayTime = 500;

   var dragAndDrop;
   var attrDropIDs = [];
   var styleDropIDs = [];

   var letters = [ "A", "B", "C", "D", "E", "F", "G", "H" ];

   var cssAttrNames = [ "text-align", "font-weight", "text-decoration", "font-style", "text-transform", "font-size", "font-size", "background" ];
   var cssAttrValues = [ "center", "bold", "underline", "italic", "uppercase", "14px", "23px", "#D7FF1D" ];
   var defaultValues = [];
   var attrLabels = [ taskStrings.center, taskStrings.bold, taskStrings.underline, taskStrings.italic, taskStrings.upperCase, taskStrings.small, taskStrings.large, taskStrings.colored ];

   var colors = {
      black: "#4a4a4a",
      lightGrey: "#f2f2f2",
      grey: "#e5e5e5",
      darkGrey: "#787878",
      blue: "#4a90e2",
      green: "#ccb336",
      yellow: "#f5a623"
   };

   var backgroundAttr = {
      stroke: "none",
      fill: colors.grey
   };
   var containerAttr = {
      stroke: "none",
      fill: colors.blue,
      r: 5
   };
   var dropContainerAttr = {
      stroke: "none",
      fill: colors.blue,
      r: 5
   };
   var containerTextAttr = [
      { // 0: centered
         "font-size": 16,
         fill: "white"
      },
      { // 1: bold
         "font-size": 16,
         "font-weight": "bold",
         fill: "white"
      },
      { // 2: underlined
         "font-size": 16,
         fill: "white",
         "text-decoration": "underline"
      },
      { // 3: italic
         "font-size": 16,
         "font-style": "italic",
         fill: "white"
      },
      { // 4: small-caps
         "font-size": 12,
         fill: "white"
      },
      { // 5: small
         "font-size": 14,
         fill: "white"
      },
      { // 6: large
         "font-size": 23,
         fill: "white"
      },
      { // 7: colored
         "font-size": 16,
         fill: "#D7FF1D",
      }
   ];
   var underlineAttr = {
      stroke: "white",
      "stroke-width": 1
   };
   var styleAttr = {
      "font-size": 14,
      "font-weight": "bold",
      fill: "white"
   };
   var optionAttr = {
      "font-size": 14,
      "font-weight": "bold",
      fill: "black",
      "text-anchor": "start"
   };
   var dropRectAttr = {
      stroke: colors.darkGrey,
      "stroke-width": 2,
      "stroke-dasharray": ".",
      r: 5
   };
   var circleAttr = {
      stroke: 'none',
      fill: colors.green,
      r: circleR
   };
   var numberAttr = {
      "font-size": 14,
      "font-weight": "bold",
      fill: "white"
   };
   var highlightedCSS = {
      border: "3px solid "+colors.yellow
   };
   var unhighlightedCSS = {
      border: "3px solid "+colors.lightGrey
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      objective = data[level].objective;
      nbStyles = data[level].nbStyles;
      attributes = data[level].attributes;
      nbAttributes = attributes.length;
      nbPlacesAttr = data[level].nbPlacesAttr;
      nbPlacesStyle = data[level].nbPlacesStyle;
      text = data[level].text;
      nbRows = text.length;

      dropAttrW = nbPlacesAttr*(attrW + 2);
      dropStylesW = nbPlacesStyle*(styleW + 2);
      attrLineW = (level != "easy") ? controlBoxW/2 - marginX : controlBoxW - marginX;
      nbAttrPerLine = Math.floor(attrLineW/(attrW + marginX/2));
      nbStylePerLine = Math.floor(attrLineW/(styleW + marginX/2));
      nbAttrLines = Math.ceil(nbAttributes/nbAttrPerLine);
      nbStyleLines = Math.ceil(nbStyles/nbStylePerLine);
      yOptionAttr = nbAttrLines*(attrH + marginY/2) + 2*marginY;
      yOptionStyle = nbStyleLines*(attrH + marginY/2) + 2*marginY;
      var yOption = Math.max(yOptionAttr, yOptionStyle);
      controlBoxH = (level != "easy") ? yOption + Math.max(nbStyles,nbRows)*(dropAttrH + marginY/2) + marginY/2 : yOption + 2*(dropAttrH + marginY/2) + marginY/2;
      paperH = controlBoxH;
      xSecondColumn = xDropAttr + dropAttrW + 2*marginX;
      xNumber = xSecondColumn + reservedStyleOfW + marginX;
      xDropStyles = xNumber + circleR + marginX;
      if (typeof enableRtl != 'undefined') {
         xDropStyles -= 20;
      }
      xStyles = xNumber - circleR - marginX/2;
      // rng = new RandomGenerator(subTask.taskParams.randomSeed + level.charCodeAt(0));
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      // rng.reset(answer.seed);
   };

   subTask.resetDisplay = function () {
      displayError("");
      initTable();
      initObjective();
      initDefaultValues();
      initPaper();
      initDragAndDrop();
      initControlBox();
      applyStyles();

      displayHelper.customValidate = checkResult;
      if (typeof(enableRtl) != "undefined") {
         $("body").attr("dir", "rtl");
         $(".largeScreen #zone_1").css("float", "right");
         $(".largeScreen #zone_2").css("float", "right");
      }
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = {
         previousMove: {
            styleAttr: [],
            rowStyles: []
         },
         styleAttr: [],
         rowStyles: [],
         attrSrcIDs: [],
         styleSrcIDs: []
      };
      for(var iStyle = 0; iStyle < nbStyles; iStyle++){
         defaultAnswer.previousMove.styleAttr[iStyle] = Beav.Array.make(nbPlacesAttr,null);
         defaultAnswer.styleAttr[iStyle] = Beav.Array.make(nbPlacesAttr,null);
      }
      for(var iRow = 0; iRow < nbRows; iRow++){
         defaultAnswer.previousMove.rowStyles[iRow] = Beav.Array.make(nbPlacesStyle,null);
         defaultAnswer.rowStyles[iRow] = Beav.Array.make(nbPlacesStyle,null);
      }

      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result
   };

   subTask.unloadLevel = function (callback) {
      subTask.delayFactory.destroy("delay");
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initTable() {
      $("#htmlTable").empty();
      if(Beav.Navigator.isIE8()) {
         var html = '<tr class="vertrow" style="height: 1px;"><td colspan="3"><hr id="vertLine"></td></tr>';
      } else {
         var html = "<hr id=\"vertLine\">";
      }
      for(var iRow = 0; iRow <= nbRows; iRow++){
         html += "<tr class=\"row_"+iRow+"\">";
         for(var iCol = 0; iCol < nbCol; iCol++){
            html += "<td class=\"col_"+iCol+"\">";
            if(iCol != 1){
               if (iRow != 0) {
                  var col_title = "<span class=\"col_title\">" + title[iCol/2] + "</span>";
                  var str = (iRow == 0) ? col_title : text[iRow - 1];
                  html += str;
               }
            }else if(iRow > 0){
               html += "<div class=\"horLine\"></div>";
               html += "<div class=\"number\"><span>"+iRow+"</span></div>";
            }
            html += "</td>";
         }
         html += "</tr>";
         html += "<tr class=\"spacing\"><td colspan="+nbCol+"></td></tr>";
      }

      $("#htmlTable").html(html);
   };

   function initObjective() {
      for(var iRow = 1; iRow <= nbRows; iRow++){
         var lineCss = (level != "easy") ? objective[iRow - 1] : objective[Math.min(iRow - 1, 1)];
         for(var iAttr = 0; iAttr < lineCss.length; iAttr++){
            var attrID = lineCss[iAttr];
            var attrName = cssAttrNames[attrID];
            var attrValue = cssAttrValues[attrID];
            $(".row_"+iRow+" .col_2").css(attrName,attrValue);
         }
      }
   };

   function initDefaultValues() {
      for(var iRow = 1; iRow <= nbRows; iRow++){
         for(var iAttr = 0; iAttr < cssAttrNames.length; iAttr++){
            var attrName = cssAttrNames[iAttr];
            var attrValue = $(".row_"+iRow+" .col_0").css(attrName);
            defaultValues[iAttr] = attrValue;
         }
      }
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);

      $("#paperContainer").css("position","relative");
      var id = "overlay";
      $("#paperContainer #"+id).remove();
      if(level == "easy"){
         $("#paperContainer").append("<div id=\""+id+"\"></div>");
         var x,y,w,h;
         x = 465; 
         y = 0;
         w = paperW - x;
         h = paperH; 
            
         $("#"+id).css({
            position: "absolute",
            top: y,
            left: x,
            width: w,
            height: h,
            background: "red",
            opacity: 0
         });
      }
   };

   function initDragAndDrop() {
      dragAndDrop = new DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            displayError("");
            if(level != "easy"){
               for(var iStyle = 0; iStyle < nbStyles; iStyle++){
                  answer.previousMove.styleAttr[iStyle] = answer.styleAttr[iStyle];
                  answer.styleAttr[iStyle] = this.getObjects(attrDropIDs[iStyle]);
               }
               for(var iRow = 0; iRow < nbRows; iRow++){
                  answer.previousMove.rowStyles[iRow] = answer.rowStyles[iRow];
                  answer.rowStyles[iRow] = this.getObjects(styleDropIDs[iRow]);
               }
            }else{
               for(var iRow = 0; iRow < nbRows; iRow++){
                  answer.previousMove.rowStyles[iRow] = answer.rowStyles[iRow];
                  answer.rowStyles[iRow] = this.getObjects(attrDropIDs[Math.min(iRow,1)]);
               }
            }
            applyStyles(true);

            if(dstContId == null){
               return null
            }
            var dstContObj = this.getContainer(dstContId);
            var component = dstContObj.draggableElements[dstPos].component;
            var raph = component.element;
            if(Beav.Array.has(attrDropIDs,dstContId) || Beav.Array.has(styleDropIDs,dstContId)){
               /* change container color in drop zone */
               raph[0].attr(dropContainerAttr);
            }


         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType)
         {
            var drop = false;
            if(Beav.Array.has(answer.attrSrcIDs,srcCont,eq) && Beav.Array.has(attrDropIDs,dstCont,eq) ||
               Beav.Array.has(attrDropIDs,srcCont,eq) && Beav.Array.has(attrDropIDs,dstCont,eq) ||
               Beav.Array.has(answer.styleSrcIDs,srcCont,eq) && Beav.Array.has(styleDropIDs,dstCont,eq) ||
               Beav.Array.has(styleDropIDs,srcCont,eq) && Beav.Array.has(styleDropIDs,dstCont,eq)){
               var dstObjects = this.getObjects(dstCont);

               /* prevent 2 same objects in same container */
               if(!Beav.Array.has(dstObjects,srcCont,eq)){
                  drop = true;
               }
            }
            if((Beav.Array.has(attrDropIDs,srcCont,eq) || Beav.Array.has(styleDropIDs,srcCont,eq)) && dstCont == null){
               drop = true;
            }
            if(drop){
               if(dstCont == null){
                  return true
               }
               var dstObjects = this.getObjects(dstCont);
               var srcObjects = this.getObjects(srcCont);
               var srcID = srcObjects[srcPos];

               /* prevent 2 same objects in same container */
               if(srcCont != dstCont && Beav.Array.has(dstObjects,srcID,eq)){
                  return false
               }

               var dstContObj = this.getContainer(dstCont);
               var dstElements = dstContObj.draggableElements;
               var newDstPos = dstPos;

               for(var iPlace = 0; iPlace < dstElements.length; iPlace++){
                  if(!dstElements[iPlace] && iPlace < dstPos){
                     newDstPos = iPlace;
                     break;
                  }
               }
               if((Beav.Array.has(attrDropIDs,srcCont,eq) || Beav.Array.has(styleDropIDs,srcCont,eq)) && srcCont == dstCont){
                  var nbElem = 0;
                  for(var iPlace = 0; iPlace < dstElements.length; iPlace++){
                     if(dstElements[iPlace]){
                        nbElem++;
                     }
                  }
                  if(nbElem - 1 < newDstPos){
                     newDstPos = nbElem - 1;
                  }
               }

               return DragAndDropSystem.action(dstCont,newDstPos,'insert');
            }
            return false
         },
         actionIfEjected: function(refElement, previousContainerId, previousPos) {
            return null
         }
      });
   };

   function initControlBox() {
      paper.rect(xControlBox,yControlBox,controlBoxW,controlBoxH).attr(backgroundAttr);
      initAttributes();
      initAttrDropZone();
      if(level != "easy"){
         initStyles();
         initStyleDropZone();
      }
   };

   function initAttributes() {
      var x0 = xControlBox + marginX;
      var y0 = marginY;
      for(var iRow = 0; iRow < nbAttrLines; iRow++){
         for(var iCol = 0; iCol < nbAttrPerLine; iCol++){
            var x = x0 + iCol*(attrW + marginX/2);
            var y = y0 + iRow*(attrH + marginY/2);
            var index = iRow*(nbAttrPerLine) + iCol;
            if(index >= nbAttributes){
               iRow = nbAttrLines;
               break;
            }
            var attrID = attributes[index];
            var elem = drawAttrContainer(attrID,-attrW/2,-attrH/2);
            var id = "attr_"+attrID;
            answer.attrSrcIDs[index] = id;

            dragAndDrop.addContainer({
               ident : id,
               cx : x + attrW/2, cy: y + attrH/2, widthPlace : attrW, heightPlace : attrH,
               nbPlaces: 1,
               type : 'source',
               sourceElemArray : elem,
               placeBackgroundArray : []
            });
         }
      }
   };

   function initStyles() {
      var x0 = xNumber;
      var y0 = marginY;
      for(var iRow = 0; iRow < nbStyleLines; iRow++){
         for(var iCol = 0; iCol < nbStylePerLine; iCol++){
            var x = x0 + iCol*(styleW + marginX/2);
            var y = y0 + iRow*(styleH + marginY/2);
            var index = iRow*(nbAttrPerLine) + iCol;
            if(index >= nbStyles){
               iRow = nbAttrLines;
               break;
            }

            var elem = drawStyleContainer(index,-styleW/2,-styleH/2);
            var id = "style_"+index;
            answer.styleSrcIDs[index] = id;

            dragAndDrop.addContainer({
               ident : id,
               cx : x + styleW/2, cy: y + styleH/2, widthPlace : styleW, heightPlace : styleH,
               nbPlaces: 1,
               type : 'source',
               sourceElemArray : elem,
               placeBackgroundArray : []
            });
         }
      }
   };

   function initAttrDropZone() {
      var nbDropLines = nbStyles;
      for(var iDropLine = 0; iDropLine < nbDropLines; iDropLine++){
         var dxText = 0;
         var xColumn = 195;
         if (typeof enableRtl != 'undefined') {
            if (level == "easy") {
               dxText = 60;
            } else {
               dxText = 120;
            }
            xOption = 200;
            xColumn = 0;
         }
         var yDrop = yOptionAttr + iDropLine*(dropAttrH + marginY/2);
         var xText = xOption;
         var yText = yDrop + attrH/2;
         var text = (level != "easy") ? taskStrings.styleOption(letters[iDropLine]) : "";
         paper.text(xText + dxText,yText,text).attr(optionAttr);

         if(level == "easy"){
            var number = iDropLine + 1;
            var yCircle = yText;
            var xCircle = xText + ((iDropLine == 0) ? 155 : 90);
            drawNumber(number,xCircle,yCircle);
            if(iDropLine == 1){
               var xAnd = xCircle + 25;
               if (typeof enableRtl != 'undefined') {
                  xAnd += 10;
               }
               paper.text(xAnd,yText,taskStrings.and).attr(optionAttr);
               var xCircle2 = xCircle + 65;
               drawNumber(3,xCircle2,yCircle);
            }
            paper.text(xColumn,yText,":").attr(optionAttr);
         }

         var xDropRect = (level != "easy") ? xDropAttr : xColumn + 20;

         var rect = paper.rect(xDropRect, yDrop,dropAttrW,dropAttrH).attr(dropRectAttr);
         var id = "dropAttr_"+iDropLine;
         attrDropIDs[iDropLine] = id;
         dragAndDrop.addContainer({
            ident : id,
            cx : xDropRect + dropAttrW/2, cy: yDrop + dropAttrH/2, widthPlace : attrW + 2, heightPlace : attrH,
            nbPlaces: nbPlacesAttr,
            dropMode : 'insertBefore',
            align: 'left',
            dragDisplayMode: 'marker',
            placeBackgroundArray : []
         });

         var styleAttr = (level != "easy") ? answer.styleAttr[iDropLine] : answer.rowStyles[iDropLine];
         for(var iAttr = 0; iAttr < styleAttr.length; iAttr++){
            var attrName = styleAttr[iAttr];
            if(attrName != null){
               var attrID = Beav.Array.indexOf(answer.attrSrcIDs,attrName,eq);
               var elem = drawAttrContainer(attrID,-attrW/2,-attrH/2);
               elem[0].attr(dropContainerAttr);
               dragAndDrop.insertObject(id, iAttr, {ident : attrName, elements : elem });
            }
         }
      }
   };

   function initStyleDropZone() {
      for(var iRow = 0; iRow < nbRows; iRow++){
         var yDrop = yOptionStyle + iRow*(dropStylesH + marginY/2);
         var xText = xStyles;
         var xCircle = xNumber;
         if (typeof enableRtl != 'undefined') {
            if (level == "medium") {
               xText += 150;
               xCircle += 110;
            } else {
               xText += 300;
               xCircle += 260;
            }
         }
         var yText = yDrop + attrH/2;
         var text = taskStrings.stylesOf(nbPlacesStyle);
         paper.text(xText,yText,text).attr(optionAttr).attr({"text-anchor": "end"});

         var number = iRow + 1;
         var yCircle = yText;
         drawNumber(number,xCircle,yCircle);

         var rect = paper.rect(xDropStyles, yDrop,dropStylesW,dropStylesH).attr(dropRectAttr);
         var id = "dropStyle_"+iRow;
         styleDropIDs[iRow] = id;
         dragAndDrop.addContainer({
            ident : id,
            cx : xDropStyles+ dropStylesW/2, cy: yDrop + dropStylesH/2, widthPlace : styleW + 2, heightPlace : styleH + 2,
            nbPlaces: nbPlacesStyle,
            dropMode : 'insertBefore',
            align: 'left',
            dragDisplayMode: 'marker',
            placeBackgroundArray : []
         });

         var rowStyles = answer.rowStyles[iRow];
         for(var iStyle = 0; iStyle < rowStyles.length; iStyle++){
            var styleName = rowStyles[iStyle];
            if(styleName != null){
               var styleID = Beav.Array.indexOf(answer.styleSrcIDs,styleName,eq);
               var elem = drawStyleContainer(styleID,-styleW/2,-styleH/2);
               elem[0].attr(dropContainerAttr);
               dragAndDrop.insertObject(id, iStyle, {ident : styleName, elements : elem });
            }
         }
      }
   };

   function applyStyles(delay) {
      if(delay){
         subTask.delayFactory.destroy("delay");
         for(var iRow = 0; iRow < nbRows; iRow++){
            $(".row_"+(iRow + 1)+" td.col_0").css(unhighlightedCSS);
         }
         var changedRows = getChangedRows();
         for(var iRow = 0; iRow < changedRows.length; iRow++){
            var row = changedRows[iRow];
            $(".row_"+(row + 1)+" td.col_0").css(highlightedCSS);
         }
         subTask.delayFactory.create("delay",function() {
            applyStyles(false);
            subTask.delayFactory.destroy("delay");
            subTask.delayFactory.create("delay",function() {
               for(var iRow = 0; iRow < changedRows.length; iRow++){
                  var row = changedRows[iRow];
                  $(".row_"+(row + 1)+" .col_0").css(unhighlightedCSS);
               }
            },delayTime);
         },delayTime);
         return
      }
      resetStyles();
      for(var iRow = 0; iRow < nbRows; iRow++){
         var rowStyles = answer.rowStyles[iRow];
         if(level != "easy"){
            for(var iStyle = 0; iStyle < rowStyles.length; iStyle++){
               var styleName = rowStyles[iStyle];
               if(styleName != null){
                  var styleID = Beav.Array.indexOf(answer.styleSrcIDs,styleName,eq);
                  var styleAttr = answer.styleAttr[styleID];
                  for(var iAttr = 0; iAttr < styleAttr.length; iAttr++){
                     var attrName = styleAttr[iAttr];
                     if(attrName != null){
                        var attrID = Beav.Array.indexOf(answer.attrSrcIDs,attrName,eq);
                        // TODO: might be needed: var attrID = attributes[attrID];
                        var attrName = cssAttrNames[attrID];
                        var attrValue = cssAttrValues[attrID];
                        $(".row_"+(iRow + 1)+" .col_0").css(attrName,attrValue);
                     }

                  }
               }
            }
         }else{
            for(var iAttr = 0; iAttr < rowStyles.length; iAttr++){
               var attrName = rowStyles[iAttr];
               if(attrName != null){
                  var attrID = Beav.Array.indexOf(answer.attrSrcIDs,attrName,eq);
                  var attrName = cssAttrNames[attrID];
                  var attrValue = cssAttrValues[attrID];
                  $(".row_"+(iRow + 1)+" .col_0").css(attrName,attrValue);
               }
            }
         }
      }
   };

   function resetStyles() {
      for(var iRow = 1; iRow <= nbRows; iRow++){
         for(var iAttr = 0; iAttr < cssAttrNames.length; iAttr++){
            var attrName = cssAttrNames[iAttr];
            var attrValue = defaultValues[iAttr];
            $(".row_"+iRow+" .col_0").css(attrName,attrValue);
         }
      }
   };

   function getChangedRows() {
      var changedRows = [];
      for(var iRow = 0; iRow < nbRows; iRow++){
         var rowStyles = answer.rowStyles[iRow];
         var prevRowStyles = answer.previousMove.rowStyles[iRow];
         if(level == "easy"){
            var rowAttr = rowStyles;
            var prevRowAttr = prevRowStyles;
         }else{
            var rowAttr = getAttrFromStyles(rowStyles,false);
            var prevRowAttr = getAttrFromStyles(prevRowStyles,true);
         }
         for(var iAttr = 0; iAttr < rowAttr.length; iAttr++){
            var attrName = rowAttr[iAttr];
            var prevAttrName = prevRowAttr[iAttr];
            if(attrName != null){
               if(!Beav.Array.has(prevRowAttr,attrName,eq)){
                  if(!Beav.Array.has(changedRows,iRow,eq)){
                     changedRows.push(iRow);
                  }
               }
            }
            if(prevAttrName != null){
               if(!Beav.Array.has(rowAttr,prevAttrName,eq)){
                  if(!Beav.Array.has(changedRows,iRow,eq)){
                     changedRows.push(iRow);
                  }
               }
            }
         }
      }
      return changedRows
   };

   function getAttrFromStyles(styles,previous) {
      var attr = [];
      for(var iStyle = 0; iStyle < styles.length; iStyle++){
         var styleName = styles[iStyle];
         if(styleName != null){
            var styleID = Beav.Array.indexOf(answer.styleSrcIDs,styleName,eq);
            var styleAttr = (previous) ? answer.previousMove.styleAttr[styleID] : answer.styleAttr[styleID];
            for(var iAttr = 0; iAttr < styleAttr.length; iAttr++){
               var attrName = styleAttr[iAttr];
               // var attrID = Beav.Array.indexOf(answer.attrSrcIDs,attrName,eq);
               if(!Beav.Array.has(attr,attrName,eq)){
                  attr.push(attrName);
               }
            }
         }
      }
      return attr
   };

   function drawAttrContainer(id,x,y) {
      var rect = paper.rect(x,y,attrW,attrH).attr(containerAttr);
      var label = attrLabels[id];
      var text = paper.text(0,0,label).attr(containerTextAttr[id]);
      if(id == 2){
         text = underline(text);
      }
      return paper.set(rect,text);
   };

   function drawStyleContainer(id,x,y) {
      var rect = paper.rect(x,y,styleW,styleH).attr(containerAttr);
      var label = taskStrings.style+" "+letters[id];
      var text = paper.text(0,0,label).attr(styleAttr);
      return paper.set(rect,text);
   };

   function drawNumber(number,x,y) {
      paper.circle(x,y).attr(circleAttr);
      paper.text(x,y,number).attr(numberAttr);
   };

   function underline(text) {
      var bbox = text.getBBox();
      var x1 = bbox.x;
      var x2 = bbox.x + bbox.width;
      var y = bbox.y + bbox.height;
      var path = paper.path("M"+x1+" "+y+",H"+x2).attr(underlineAttr);
      return paper.set(text,path);
   };

   function eq(val1,val2){
      return (val1 == val2)
   };

   function checkResult(noVisual) {
      var error = null;
      for(var iRow = 0; iRow < nbRows; iRow++){
         if(level == "easy" && iRow > 1){
            break;
         }
         var targetRowCss = objective[iRow];
         var rowStyles = answer.rowStyles[iRow];
         var currRowCss = [];
         if(level != "easy"){
            for(var iStyle = 0; iStyle < rowStyles.length; iStyle++){
               var styleName = rowStyles[iStyle];
               if(styleName != null){
                  var styleID = Beav.Array.indexOf(answer.styleSrcIDs,styleName,eq);
                  var styleAttr = answer.styleAttr[styleID];
                  for(var iAttr = 0; iAttr < styleAttr.length; iAttr++){
                     var attrName = styleAttr[iAttr];
                     if(attrName != null){
                        var attrID = Beav.Array.indexOf(answer.attrSrcIDs,attrName,eq);
                        if(!Beav.Array.has(currRowCss,attrID,eq)){
                           currRowCss.push(attrID);
                        }
                     }
                  }
               }
            }
         }else{
            for(var iAttr = 0; iAttr < rowStyles.length; iAttr++){
               var attrName = rowStyles[iAttr];
               if(attrName != null){
                  var attrID = Beav.Array.indexOf(answer.attrSrcIDs,attrName,eq);
                  if(!Beav.Array.has(currRowCss,attrID,eq)){
                     currRowCss.push(attrID);
                  }
               }
            }
         }

         for(var iAttr = 0; iAttr < currRowCss.length; iAttr++){
            var attrID = currRowCss[iAttr];
            if(!Beav.Array.has(targetRowCss,attrID)){
               error = taskStrings.errorStyle(iRow + 1,attrID,false);
               break;
            }
         }
         for(var iAttr = 0; iAttr < targetRowCss.length; iAttr++){
            var attrID = targetRowCss[iAttr];
            if(!Beav.Array.has(currRowCss,attrID)){
               error = taskStrings.errorStyle(iRow + 1,attrID,true);
               break;
            }
         }

         if(error){
            if(!noVisual){
               displayError(error);
            }
            return { successRate: 0, message: error }
         }
      }

      if(!noVisual){
         platform.validate("done");
      }
      return { successRate: 1, message: taskStrings.success }

   };

   function displayError(msg) {
      $("#displayHelper_graderMessage").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
