function initTask() {
   var state = null;
   var level;
   var answer = null;
   var data = {
      easy: {
         depth: 2,
         givens:  ["tie", "glasses", "hat"],
         questions: ["tie", "glasses", "hat"],
         faces: [
            ["tie", "nose", "mouth", "hair", "hat"],
            ["glasses", "nose", "mouth", "hair"],
            ["glasses", "nose", "mouth", "hair", "hat"],
            ["tie", "glasses", "nose", "mouth", "hair"]
         ]
      },
      medium: {
         depth: 2,
         questions: ["tie", "glasses", "hat", "hair"],
         faces: [
            ["tie", "hair", "nose", "mouth"],
            ["tie", "hair", "glasses", "nose", "mouth"],
            ["tie", "glasses", "nose", "mouth"],
            ["hair", "hat", "nose", "mouth"]
         ]
      },
      hard: {
         depth: 3,
         questions: ["tie", "glasses", "hat", "hair", "mouth", "nose"],
         faces: [
            ["hair"],
            ["mouth", "tie", "nose"],
            ["mouth", "glasses", "nose", "tie"],
            ["mouth", "glasses", "nose", "hair", "tie", "hat"],
            ["mouth", "glasses", "nose", "tie", "hat"],
            ["glasses", "hat"],
            ["hair", "hat", "nose"],
            ["hair", "hat"]
         ]
      }
   };

   var paper;
   var paperWidth = 760;
   var paperHeight = {
      easy: 510,
      medium: 510,
      hard: 600
   };
   var dragAndDrop;

   var treeParams = {
      xPos: paperWidth / 2,
      yPos: 260,
      questionAttr: {
         rx: 55,
         ry: 35,
         "stroke-width": 3,
         fill: "white"
      },
      faceAttr: {
         width: 75,
         height: 110,
         "stroke-width": 3,
         fill: "white"
      },
      edgeAttr: {
         "stroke-width": 3
      },
      verticalSpace: 95,
      horizontalSpace: 180,
      backgroundColor: "#C0C0FF"  /* "#E0E0FF"*/
   };

   var treeContainerParams = {
      questions: {
         type: "list",
         width: 2 * treeParams.questionAttr.rx,
         height: 2 * treeParams.questionAttr.ry,
         indexToNode: null,
         nodeToIndex: null,
         indexToElement: null,
         indexToPos: null
      },
      faces: {
         type: "list",
         width: treeParams.faceAttr.width,
         height: treeParams.faceAttr.height,
         indexToNode: null,
         nodeToIndex: null,
         indexToElement: null,
         indexToPos: null
      }
   };

   var bankContainerParams = {
      questions: {
         xPos: 30,
         yPos: 5,
         row: 6,
         width: 2 * treeParams.questionAttr.rx,
         height: 2 * treeParams.questionAttr.ry,
         horizontalSpace: 10,
         verticalSpace: 10,
         type: "source",
         dropMode: "replace"
      },
      faces: {
         xPos: 30,
         yPos: 90,
         width: treeParams.faceAttr.width,
         height: treeParams.faceAttr.height,
         row: 8,
         horizontalSpace: 15,
         verticalSpace: 10,
         type: "list",
         dropMode: "replace"
      }
   };

   var containerCategories = {
      tree: treeContainerParams,
      bank: bankContainerParams
   };
   var containerTypeToDrawer;
   var questionCounter = 0;
   var errorHighlightShift = 2;
   var errorHighlightParams = {
      width: treeParams.faceAttr.width + 2*errorHighlightShift,
      height: treeParams.faceAttr.height + 2*errorHighlightShift,
      stroke: "red",
      "stroke-width": 6
   };
   var errorHighlight;

   task.load = function(views, callback) {
      containerTypeToDrawer = {
         questions: drawQuestion,
         faces: drawFace
      };
      $("#validate").click(validate);
      displayHelper.hideValidateButton = true;
      displayHelper.setupLevels();

      if (views.solutions) {
         $("#solution").show();
      }

      callback();
   };

   task.getDefaultStateObject = function() {
      return { level: "easy" };
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;

      if (display) {
         initPaper();
      }
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      fillFromAnswer();
      removeFeedback();
   };

   task.getAnswerObject = function() {
      fillToAnswer();
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      var answer = {};
      for (var level in data) {
         answer[level] = {};
         for (var category in containerCategories) {
            var categoryParams = containerCategories[category];
            answer[level][category] = {};
            for (var containerType in categoryParams) {
               if (category == "bank" && containerType == "questions") {
                  continue;
               }
               answer[level][category][containerType] = [];
               for (var iSlot = 0; iSlot < data[level][containerType].length; iSlot++) {
                  var slotID;
                  if (category === "tree") {
                     slotID = null;
                  }
                  else {
                     slotID = containerType + "_" + iSlot;
                  }
                  answer[level][category][containerType].push(slotID);
               }
            }
         }
         if (data[level].givens) {
            for (var iQuestion in data[level].givens) {
               var question = data[level].givens[iQuestion];
               answer[level].tree.questions[iQuestion] = "questions_" + $.inArray(question, data[level].questions);
             }
         }
      }
      return answer;
   };

   var initPaper = function() {
      if (paper) {
         paper.remove();
      }
      paper = Raphael("anim", paperWidth, paperHeight[state.level]);

      dragAndDrop = DragAndDropSystem({
         paper: paper,
         actionIfDropped: actionIfDropped,
         actionIfEjected: actionIfEjected,
         drop: onDrop,
         canBeTaken: canBeTaken
      });

      treeContainerParams.questions.indexToElement = [];
      treeContainerParams.questions.indexToNode = [];
      treeContainerParams.questions.indexToPos = [];
      treeContainerParams.questions.nodeToIndex = {};
      treeContainerParams.faces.indexToElement = [];
      treeContainerParams.faces.indexToNode = [];
      treeContainerParams.faces.indexToPos = [];
      treeContainerParams.faces.nodeToIndex = {};

      drawTree();
      initContainers();
   };

   var onDrop = function(srcCont, srcPos, dstCont, dstPos) {
      removeFeedback();
   };

   var canBeTaken = function(containerID, position) {
      if (level == "easy" && containerID == "tree_questions") {
         return false;
      }
      return true;
   };

   var actionIfEjected = function(refElement, srcCont, srcPos) {
      if ((srcCont == "tree_faces") || (srcCont == "bank_faces"))  {
         var bankFaces = dragAndDrop.getObjects("bank_faces");
         for (var iPos = 0; iPos < bankFaces.length; iPos++) {
            if (bankFaces[iPos] === null) {
               return DragAndDropSystem.action("bank_faces", iPos, "insert");
            }
         }
      }
      return null;
   };

   var actionIfDropped = function(srcCont, srcPos, dstCont, dstPos, dropType) {
      if (!dstCont) {
         if (srcCont == "tree_questions") {
            return DragAndDropSystem.action();
         }
         return false;
      }
      var dstEmpty = (dragAndDrop.getObjects(dstCont)[dstPos] === null);

      if (srcCont == "bank_faces" || srcCont == "tree_faces") {
         if (dstCont != "bank_faces" && dstCont != "tree_faces") {
            return false;
         }
         return true;
      }

      if (srcCont.indexOf("questions_") === 0) {
         if (dstCont != "tree_questions") {
            return false;
         }
         return true;
      }

      if (srcCont == "tree_questions") {
         if (dstCont != "tree_questions") {
            return DragAndDropSystem.action();
         }
         return dstEmpty;
      }

      return false;
   };

   var drawTree = function() {
      var recursiveTree = function(depth, xPos, yPos, nodeString) {
         if (depth == data[level].depth) {
            drawTreeNode(xPos, yPos + 30, "faces", nodeString);
         }
         else {
            var horizontalDiff = treeParams.horizontalSpace / (1 << depth);
            var newY = yPos + treeParams.verticalSpace;
            if (depth === 0) {
               newY -= 50;
            }
            var textDx = horizontalDiff / 4 + 50;
            var textDy = (newY - yPos) / 3;
            if (depth === 0) {
               textDy -= 10;
            } else if (depth == data[level].depth - 1) {
               textDy += 10;
            }
            paper.text(xPos - textDx, yPos + textDy , taskStrings.yes).attr({"font-size":20});
            paper.text(xPos + textDx, yPos + textDy , taskStrings.no).attr({"font-size":20});
            drawEdge(xPos, yPos, xPos - horizontalDiff, newY, depth);
            drawEdge(xPos, yPos, xPos + horizontalDiff, newY, depth);
            drawTreeNode(xPos, yPos, "questions", nodeString);
            recursiveTree(depth + 1, xPos - horizontalDiff, newY, nodeString + "1");
            recursiveTree(depth + 1, xPos + horizontalDiff, newY, nodeString + "0");
         }
      };
      paper.rect(5,
         treeParams.yPos - (treeParams.verticalSpace / 2),
         paperWidth - 5,
         treeParams.verticalSpace * data[level].depth + treeParams.verticalSpace + 5
      ).attr({"fill": treeParams.backgroundColor});
      recursiveTree(0, treeParams.xPos, treeParams.yPos, "node_");

   };

   var drawEdge = function(x1, y1, x2, y2, depth) {
      paper.path(["M", x1, y1, "L", x2, y2]).attr(treeParams.edgeAttr);
      var f = 0.6; // fraction of progress along edge
      if (depth <= 1) {
         f = 0.55;
      }
      var xm = ((1-f)*x1 + f*x2);
      var ym = ((1-f)*y1 + f*y2);
      paper.path(["M", x1, y1, "L", xm, ym]).attr(treeParams.edgeAttr).attr({'stroke': 'black', 'stroke-width': 2, 'arrow-end': 'classic-wide-long'});
   };

   var drawTreeNode = function(xPos, yPos, type, nodeString) {
      treeContainerParams[type].nodeToIndex[nodeString] = treeContainerParams[type].indexToNode.length;
      treeContainerParams[type].indexToNode.push(nodeString);
      treeContainerParams[type].indexToPos.push([xPos, yPos]);

      var element = drawSlot(type);
      treeContainerParams[type].indexToElement.push(element);
   };

   var initContainers = function() {
      var params;
      for (var nodeType in treeContainerParams) {
         params = treeContainerParams[nodeType];
         dragAndDrop.addContainer({
            cx: 0,
            cy: 0,
            ident: "tree_" + nodeType,
            dropMode: "replace",
            dragDisplayMode: "preview",
            type: params.type,
            nbPlaces: params.indexToElement.length,
            widthPlace: params.width,
            heightPlace: params.height,
            places: params.indexToPos,
            placeBackgroundArray: params.indexToElement
         });
      }

      for (var bankType in bankContainerParams) {
         if (bankType == "questions" && level == "easy") {
            continue;
         }
         var positions = [];
         var elements = [];
         for (var iElement = 0; iElement < data[level][bankType].length; iElement++) {
            elements.push(drawSlot(bankType));
            var xPos = bankContainerParams[bankType].xPos + (iElement % bankContainerParams[bankType].row) * (bankContainerParams[bankType].horizontalSpace + bankContainerParams[bankType].width) + bankContainerParams[bankType].width / 2;
            var yPos = bankContainerParams[bankType].yPos + Math.floor(iElement / bankContainerParams[bankType].row) * (bankContainerParams[bankType].verticalSpace + bankContainerParams[bankType].height) + bankContainerParams[bankType].height / 2;
            positions.push([xPos, yPos]);
         }

         params = bankContainerParams[bankType];
         if (bankType == "questions") {
            for (var iQuestion = 0; iQuestion < data[level][bankType].length; iQuestion++) {
               var sourceElement = drawQuestion(data[level].questions[iQuestion]);
               dragAndDrop.addContainer({
                  ident: "questions_" + iQuestion,
                  type: "source",
                  cx: positions[iQuestion][0],
                  cy: positions[iQuestion][1],
                  dropMode: params.dropMode,
                  dragDisplayMode: "preview",
                  nbPlaces: 1,
                  widthPlace: params.width,
                  heightPlace: params.height,
                  placeBackgroundArray: [elements[iQuestion]],
                  sourceElemArray: [sourceElement]
               });
            }
         } else {
            dragAndDrop.addContainer({
               cx: 0,
               cy: 0,
               ident: "bank_" + bankType,
               type: params.type,
               dropMode: params.dropMode,
               dragDisplayMode: "preview",
               nbPlaces: elements.length,
               widthPlace: params.width,
               heightPlace: params.height,
               placeBackgroundArray: elements,
               places: positions
            });
         }
      }
   };

   var fillFromAnswer = function() {
      for (var category in containerCategories) {
         var categoryParams = containerCategories[category];
         for (var containerType in categoryParams) {
            if (category == "bank" && containerType == "questions") {
               continue;
            }
            var containerID = category + "_" + containerType;
            dragAndDrop.removeAllObjects(containerID);
            for (var iSlot = 0; iSlot < answer[level][category][containerType].length; iSlot++) {
               var elementID = answer[level][category][containerType][iSlot];
               if (elementID === null) {
                  continue;
               }
               if (containerType == "questions") {
                  elementID += "_" + questionCounter;
                  questionCounter++;
               }
               var elementIndex = elementID.split("_")[1];
               dragAndDrop.insertObject(containerID, iSlot, {
                  ident: elementID,
                  elements: containerTypeToDrawer[containerType](data[level][containerType][elementIndex])
               });
            }
         }
      }
   };

   var fillToAnswer = function() {
      for (var category in containerCategories) {
         var categoryParams = containerCategories[category];
         for (var containerType in categoryParams) {
            if (category == "bank" && containerType == "questions") {
               continue;
            }
            var containerID = category + "_" + containerType;
            var objectIDs = dragAndDrop.getObjects(containerID);
            answer[level][category][containerType] = [];
            for (var iObject in objectIDs) {
               var elementID = objectIDs[iObject];
               if (elementID === null) {
                  answer[level][category][containerType].push(null);
               }
               else {
                  var idParts = elementID.split("_");
                  answer[level][category][containerType].push(idParts[0] + "_" + idParts[1]);
               }
            }
         }
      }
   };

   var drawQuestion = function(facialPart) {
      var set = paper.set();
      set.push(drawSlot("questions"));
      drawFacialPart(set, facialPart, true);
      return set;
   };

   var drawSlot = function(type) {
      if (type == "questions") {
         return paper.ellipse(-treeParams.questionAttr.width / 2, -treeParams.questionAttr.height / 2).attr(treeParams.questionAttr);
      } else {
         return paper.rect(- treeParams.faceAttr.width / 2, - treeParams.faceAttr.height / 2).attr(treeParams.faceAttr);
      }
   };

   var drawFacialPart = function(set, facialPart, centered) {
      var centeredTransfY = {
         "face": "-52",
         "mouth": "-72",
         "glasses": "-52",
         "hair": "-35",
         "nose": "-62",
         "hat": "-20",
         "tie": "-95"
      };
      var transf;
      if (centered) {
         transf = "t-34" + centeredTransfY[facialPart];
      } else {
         transf = "t-34-52";
      }
      if (facialPart == "face") {
         set.push(paper.path(Raphael.transformPath("m 33.101654,14.407745 c -9.68478,0.09758 -20.099849,5.207077 -26.066796,12.835968 -4.537786,5.801666 0.570986,19.599243 -4.699137,21.59108 -5.554791,2.099411 -3.745714,9.696518 2.562862,14.251205 5.052369,18.123337 16.7569,29.222076 28.534027,31.410568 11.003197,-1.28595 23.7131,-12.387665 28.707062,-29.275589 8.376534,-5.316086 8.998177,-17.075119 1.12331,-16.840668 C 60.91272,37.278258 63.234067,32.196883 58.551613,26.308867 52.722538,18.979079 42.466229,14.313368 33.101647,14.407744 l 8e-6,0 z", transf)).attr({"stroke-width": '4',  "fill":"#eebb99"}));
         set.push(paper.path(Raphael.transformPath("m 23.151026,53.976181 c 0,1.570374 -1.379114,2.843399 -3.080338,2.843399 -1.701223,0 -3.080341,-1.273026 -3.080341,-2.843399 0,-1.570374 1.379118,-2.843399 3.080341,-2.843399 1.701223,0 3.080338,1.273026 3.080338,2.843399 z", transf)).attr({fill: '#000000',stroke: '#ffffff',"stroke-width": '2.42'}));
         set.push(paper.path(Raphael.transformPath("m 49.689335,54.540024 c 0,1.570374 -1.379116,2.843399 -3.080338,2.843399 -1.701225,0 -3.080341,-1.273026 -3.080341,-2.843399 0,-1.570374 1.379116,-2.843399 3.080341,-2.843399 1.701221,0 3.080338,1.273026 3.080338,2.843399 z", transf)).attr({fill: '#000000',stroke: '#ffffff',"stroke-width": '2.42'}));
      }
      if (facialPart == "mouth") {
         set.push(paper.path(Raphael.transformPath("M 23.534983,75.516479 C 33.550232,89.421676 43.675659,75.279541 43.675659,75.279541", transf)).attr({id: 'path5553',fill: 'none',stroke: '#000000',"stroke-width": '4'}));
      }
      if (facialPart == "glasses") {
         set.push(paper.path(Raphael.transformPath("m 27.979961,53.20163 c 11.373558,0 11.373558,0 11.373558,0", transf)).attr({stroke: '#000000',"stroke-width": '4'}));
         set.push(paper.path(Raphael.transformPath("m 53.660416,53.201599 c 0,3.925919 -3.394745,7.108475 -7.582371,7.108475 -4.187626,0 -7.582375,-3.182556 -7.582375,-7.108475 0,-3.925903 3.394749,-7.108475 7.582375,-7.108475 4.187626,0 7.582371,3.182571 7.582371,7.108475 z", transf)).attr({"stroke-width": '4'}));
         set.push(paper.path(Raphael.transformPath("m 27.30201,52.727707 c 0,3.925903 -3.394745,7.108475 -7.582375,7.108475 -4.187626,0 -7.582373,-3.182571 -7.582373,-7.108475 0,-3.925903 3.394747,-7.108475 7.582373,-7.108475 4.18763,0 7.582375,3.182571 7.582375,7.108475 z", transf)).attr({"stroke-width": '4'}));
      }
      if (facialPart == "hair") {
         set.push(paper.path(Raphael.transformPath("M 6.56459,28.150803 C 9.881878,20.568421 20.78154,15.35553 33.576798,13.933854 48.109685,15.829438 56.007992,20.094529 61.062901,26.729096 64.380188,34.785401 62.9585,41.893876 63.4324,48.054551 59.957134,39.366395 57.90358,35.417252 53.954438,29.572511 36.736127,43.315538 27.10019,38.57657 13.673073,33.363694 8.776118,38.576569 10.987645,37.154862 5.616797,48.528413 1.983576,45.843003 4.03713,35.101304 6.564591,28.150804 z", transf)).attr({fill: '#24221c',stroke: '#000000',"stroke-width": '0'}));
      }
      if (facialPart == "nose") {
         set.push(paper.path(Raphael.transformPath("m 34.524586,58.36618 c -11.126678,6.701294 -3.799166,10.4198 -3.791189,10.425766 l 5.212889,-0.473877 0.947792,0.473877", transf)).attr({stroke: '#000000',"stroke-width": '4'}));
      }
      if (facialPart == "hat") {
         set.push(paper.path(Raphael.transformPath("m 33.159172,0.029663 c -5.917088,-0.109451 -11.883057,3.130829 -8.350613,10.133331 -6.684103,1.564041 -13.950958,1.886429 -20.615152,22.451477 26.163132,-8.761459 33.575605,-6.57106 59.245108,0 C 55.263207,11.197616 53.642281,13.13919 41.214897,9.975341 44.93713,3.593215 39.076256,0.139129 33.159172,0.029662 z", transf)).attr({fill: 'brown',"fill-opacity": '1',stroke: 'brown',"stroke-width": '4'}));
      }
      if (facialPart == "tie") {
         set.push(paper.path(Raphael.transformPath("M 15.014153,91.773056 33.022286,98.407639 52.926018,91.299164 51.97823,102.19882 32.07449,98.407639 17.383641,100.77712 15.014153,91.773056 z", transf)).attr({fill: '#000000',"fill-opacity": '1',stroke: '#000000',"stroke-width": '5'}));
      }
   };

   var drawFace = function(facialParts) {
      var set = paper.set();
      set.push(drawSlot("faces"));
      drawFacialPart(set, "face");
      for (var iPart = 0; iPart < facialParts.length; iPart++) {
         drawFacialPart(set, facialParts[iPart]);
      }
      return set;
   };

   var validate = function() {
      fillToAnswer();
      removeFeedback();
      var resultAndMessage = getResultAndMessage(answer, level);
      if (resultAndMessage.result == "correct") {
         platform.validate("done");
      } else {
         if (resultAndMessage.treeFaceIndex != -1) {
            highlightTreeFace(resultAndMessage.treeFaceIndex);
         }
         $("#feedback").html(resultAndMessage.message);
         // displayHelper.validate("stay");
      }
   };

   var removeFeedback = function() {
      $("#feedback").html("");
      if (errorHighlight) {
         errorHighlight.remove();
      }
   };

   var highlightTreeFace = function(index) {
      var xPos = treeContainerParams.faces.indexToPos[index][0] - treeContainerParams.faces.width / 2 - errorHighlightShift;
      var yPos = treeContainerParams.faces.indexToPos[index][1] - treeContainerParams.faces.height / 2 - errorHighlightShift;
      errorHighlight = paper.rect(xPos, yPos).attr(errorHighlightParams);
   };

   var getResultAndMessage = function(answer, level) {
      var treeFaceIndex = -1;
      for (var containerType in answer[level].tree) {
         for (var iSlot in answer[level].tree[containerType]) {
            if (answer[level].tree[containerType][iSlot] === null) {
               var msg = "";
               if (containerType == "faces") {
                  msg = taskStrings.remainingFaces;
                  treeFaceIndex = iSlot;
               } else if (containerType == "questions") {
                  msg = taskStrings.remainingQuestions;
               }
               return {
                  result: "error",
                  message: msg,
                  treeFaceIndex: treeFaceIndex
               };
            }
         }
      }

      var faceCounter = 0;
      var questionCounter = 0;
      var error = false;
      var errorMessage = "";
      var yesList = [];
      var noList = [];
      var checkDFS = function(depth) {
         if (depth === data[level].depth) {
            var res = checkFace();
            if (! res.success) {
               error = true;
               errorMessage = res.message;
               treeFaceIndex = faceCounter;
            }
            faceCounter++;
         }
         else {
            var elementID = answer[level].tree.questions[questionCounter];
            var questionIndex = elementID.split("_")[1];
            var question = data[level].questions[questionIndex];
            questionCounter++;
            yesList.push(question);
            checkDFS(depth + 1);
            yesList.pop();
            noList.push(question);
            checkDFS(depth + 1);
            noList.pop();
         }
      };
      var checkFace = function() {
         var elementID = answer[level].tree.faces[faceCounter];
         var faceIndex = elementID.split("_")[1];
         var face = data[level].faces[faceIndex];
         var iPart, part;
         for (iPart in face) {
            part = face[iPart];
            if (Beav.Array.has(noList, part)) {
               return { success: false, message: taskStrings.errorHasButShouldNot(part) };
            }
         }
         for (iPart in yesList) {
            part = yesList[iPart];
            if (!Beav.Array.has(face, part)) {
               return { success: false, message: taskStrings.errorHasNotButShouldHave(part) };
            }
         }
         return { success: true };
      };
      checkDFS(0);
      if (error) {
         return {
            result: "wrong",
            message: errorMessage, // taskStrings.incorrect,
            treeFaceIndex: treeFaceIndex 
         };
      }
      return {
         result: "correct"
      };
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      var taskParams = displayHelper.taskParams;
      var scores = {};
      var messages = {};
      var maxScores = displayHelper.getLevelsMaxScores();

      if (strAnswer === '') {
         callback(taskParams.minScore, '');
         return;
      }
      var answer = $.parseJSON(strAnswer);
      // clone the state to restore after grading.
      var oldState = $.extend({}, task.getStateObject());
      for (var curLevel in data) {
         state.level = curLevel;
         task.reloadStateObject(state, false);

         var resultAndMessage = getResultAndMessage(answer, curLevel);
         if (resultAndMessage.result == "correct") {
            scores[curLevel] = maxScores[curLevel];
            messages[curLevel] = taskStrings.success;
         } else {
            scores[curLevel] = taskParams.noScore;
            messages[curLevel] = resultAndMessage.message;
         }
      }

      task.reloadStateObject(oldState, false);
      if (!gradedLevel) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}
initTask();

