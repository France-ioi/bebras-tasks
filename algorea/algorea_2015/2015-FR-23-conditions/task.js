function initTask() {
   var level = "easy";
   var papers = [];
   var cellSide = 20;
   var margin = 20;
   var cells;
   var tokens = [];
   var iToken = 0;
   var nbCols;
   var nbRows;
   var data = {
      "easy": [[1, 1, 1, 1, 1, 0, 0, 0, 1, 1]],
      "medium": [
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
         [0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
         [0, 0, 0, 0, 0, 1, 1, 1, 1, 0]
      ],
      "hard": [
         [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
      ]
   };
   var answer = null;
   var state = null;

   task.load = function(views, callback) {
      displayHelper.hideValidateButton = true;
      displayHelper.setupLevels();
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
      nbRows = data[level].length;
      nbCols = data[level][0].length;
      if (display) {
         if (papers[0] != null) {
            papers[0].remove();
            papers[1].remove();
         }
         buildGrid();
         fillGrid(0, data[level]);
      }
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      $("#expression").val(answer[level]);
      task.test();
   };

   task.getAnswerObject = function() {
      answer[level] = $("#expression").val();
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      return {
         easy: "",
         medium: "",
         hard: ""
      };
   };

   task.unload = function(callback) {
      callback();
   };

   var nextToken = function() {
      if (iToken >= tokens.length) {
         throw taskStrings.invalidExpression;
      }
      var token = tokens[iToken];
      iToken++;
      return token;
   };

   var expectedTypes = {
      "<=": "number",
      ">=": "number",
      "<": "number",
      ">": "number",
      "==": "number"
   };
   expectedTypes[taskStrings.or] = "boolean";
   expectedTypes[taskStrings.and] = "boolean";
   expectedTypes[taskStrings.not] = "boolean";


   var opPriorities = {
      "EOF": 1,
      ")": 2,
      "<=": 5,
      ">=": 5,
      "<": 5,
      ">": 5,
      "==": 5
   };
   opPriorities[taskStrings.or] = 3;
   opPriorities[taskStrings.and] = 3;
   opPriorities[taskStrings.not] = 4;

   var exprToString = function(expr) {
      if (typeof expr == "object") {
         var strParams = [];
         for (var iParam = 0; iParam < expr.params.length; iParam++) {
            strParams.push(exprToString(expr.params[iParam]));
         }
         var strExpr = strParams.join(" " + expr.op + " ");
         if (expr.hasParenthesis) {
            strExpr = "(" + strExpr + ")";
         }
         return strExpr;
      } else {
         return expr;
      }
   }

   var evalExpr = function(expr, x, y) {
      if (typeof expr == "number") {
         return expr;
      }
      if (typeof expr == "string") {
         if (expr == "x") {
            return x;
         }
         if (expr == "y") {
            return y;
         }
         throw taskStrings.invalidExpressionExpectingNumberXY(exprToString(expr));
      }
      var valuesParams = [];
      for (var iParam = 0; iParam < expr.params.length; iParam++) {
         var value = evalExpr(expr.params[iParam], x, y);
         valuesParams[iParam] = value;
         if (typeof value != expectedTypes[expr.op]) {
            throw taskStrings.invalidParameter(exprToString(expr.params[iParam]), expr.op);
         }
      }
      if ((expectedTypes[expr.op] == "number") && (valuesParams.length != 2)) {
         throw taskStrings.invalidExpression2Params(exprToString(expr), expr.op);
      }
      if ((expr.op == taskStrings.not) && (valuesParams.length != 1)) {
         throw invalidExpression1Param(expr.op);
      }
      switch (expr.op) {
         case "<":
            return (valuesParams[0] < valuesParams[1]);
         case ">":
            return (valuesParams[0] > valuesParams[1]);
         case "<=":
            return (valuesParams[0] <= valuesParams[1]);
         case ">=":
            return (valuesParams[0] >= valuesParams[1]);
         case "==":
            return (valuesParams[0] == valuesParams[1]);
         case taskStrings.not:
            return !valuesParams[0];
         case taskStrings.and:
            var result = true;
            for (var iParam = 0; iParam < valuesParams.length; iParam++) {
               result = result && valuesParams[iParam];
            }
            return result;
         case taskStrings.or:
            var result = false;
            for (var iParam = 0; iParam < valuesParams.length; iParam++) {
               result = result || valuesParams[iParam];
            }
            return result;
      }
   };

   var buildTreeSub = function() {
      var token = nextToken();
      if (token == taskStrings.not) {
         var param = buildTreeSub();
         return {op: taskStrings.not, params:[param], hasParenthesis: false};
      }
      if (token == "(") {
         var expr = buildTree();
         if (nextToken() != ")") {
            throw taskStrings.missingParenthesis;
         }
         if (typeof expr == "object") {
            expr.hasParenthesis = true;
         }
         return expr;
      } else {
         return token;
      }
   }

   var buildTree = function() {
      var parts = [];
      parts.push(buildTreeSub());
      var prevOp = null;
      while (true) {
         var newOp = nextToken();
         while ((prevOp != null) && (opPriorities[newOp] < opPriorities[prevOp])) {
            var params = [];
            var iStartOp = parts.length - 2;
            while ((parts.length > 2) && (parts[parts.length - 2] == prevOp)) {
               params.push(parts[parts.length - 1]);
               parts.pop();
               parts.pop();
            }
            params.push(parts[parts.length - 1]);
            parts.pop();
            parts.push({op: prevOp, params: params.reverse(), hasParenthesis: false});
            if (parts.length > 2) {
               prevOp = parts[parts.length - 2];
            } else {
               prevOp = null;
            }
         }
         if ((prevOp != null) && (opPriorities[newOp] == opPriorities[prevOp]) && (newOp != prevOp)) {
            throw taskStrings.parenthesisMissingForOps(newOp, prevOp);
         }
         if ((newOp == ')') || (newOp == 'EOF')) {
            iToken--;
            return parts[0];
         }
         prevOp = newOp;
         parts.push(newOp);
         parts.push(buildTreeSub());
      }
   };

   var tokenize = function(expression) {
      var allowedTokens = [taskStrings.or, taskStrings.and, "<=", ">=", "<", ">", "x", "y", "(", ")"];
      tokens = [];
      var iLetter = 0;
      while (iLetter < expression.length) {
         var found = false;
         if (expression.charAt(iLetter) == " ") {
            iLetter++;
         } else {
            for (var iAllowedToken = 0; iAllowedToken < allowedTokens.length; iAllowedToken++) {
               var token = allowedTokens[iAllowedToken];
               if (expression.substring(iLetter, iLetter + token.length).toUpperCase() == token.toUpperCase()) {
                  tokens.push(token);
                  iLetter += token.length;
                  found = true;
                  break;
               }
            }
            if (!found) {
               var endLetter = iLetter;
               while ($.isNumeric(expression.charAt(endLetter))) {
                  endLetter++;
               }
               if (endLetter > iLetter) {
                  tokens.push(parseInt(expression.substring(iLetter, endLetter)));
                  iLetter = endLetter;
                  found = true;
               }
            }
            if (!found) {
               throw(invalidCharacterAfterExpression(expression.charAt(iLetter), expression.substring(0, iLetter)));
            }
         }
      }
      tokens.push("EOF");
      return tokens;
   }

   var buildGrid = function() {
      papers[0] = Raphael("target", nbCols * cellSide + 3 * margin, nbRows * cellSide + 2 * margin);
      papers[1] = Raphael("grid", nbCols * cellSide + 3 * margin, nbRows * cellSide + 2 * margin);
      cells = [[], []];
      for (var iRow = 0; iRow < nbRows; iRow++) {
         var y = iRow * cellSide;
         for (var iGrid = 0; iGrid < 2; iGrid++) {
            cells[iGrid].push([]);
            papers[iGrid].text(margin + margin / 2, y + (cellSide / 2), (nbRows - 1 - iRow)).attr({"font-size": 14});
         }
         for (var iCol = 0; iCol < nbCols; iCol++) {
            var x = 2 * margin + iCol * cellSide;
            for (var iGrid = 0; iGrid < 2; iGrid++) {
               cells[iGrid][iRow].push(papers[iGrid].rect(x, y, cellSide, cellSide));
            }
         }
      }
      for (var iGrid = 0; iGrid < 2; iGrid++) {
         for (var iCol = 0; iCol < nbCols; iCol++) {
            var x = 2 * margin + iCol * cellSide + cellSide / 2;
            papers[iGrid].text(x, nbRows * cellSide + cellSide / 2, iCol).attr({"font-size": 14});
         }
         if (nbRows > 1) {
            papers[iGrid].text(cellSide / 2, (nbRows / 2) * cellSide, "y").attr({"font-size": 14});
         }
         papers[iGrid].text(2 * margin + (nbCols / 2) * cellSide, (nbRows + 1) * cellSide + cellSide / 2, "x").attr({"font-size": 14});
      }
   }

   var evalExprAll = function(expr) {
      var results = [];
      for (var y = 0; y < nbRows; y++) {
         results.push([]);
         for (var x = 0; x < nbCols; x++) {
            var value = evalExpr(expr, x, y);
            if (typeof value != "boolean") {
               throw taskStrings.expressionNotBoolean;
            }
            results[y][x] = value;
         }
      }
      return results;
   }

   var exprEqual = function(expr1, expr2) {
      var res1 = evalExprAll(expr1);
      var res2 = evalExprAll(expr2);
      for (var y = 0; y < nbRows; y++) {
         for (var x = 0; x < nbCols; x++) {
            if (res1[y][x] != res2[y][x]) {
               return false;
            }
         }
      }
      return true;
   }

   var fillGrid = function(iGrid, values) {
      for (var y = 0; y < nbRows; y++) {
         var iRow = nbRows - 1 - y;
         for (var x = 0; x < nbCols; x++) {
            var iCol = x;
            var color = "white";
            if (values[y][x]) {
               color = "blue"
            }
            cells[iGrid][iRow][iCol].attr({"fill": color});
         }
      }
   }

   var parseExpr = function(str) {
      tokens = tokenize(str);
      iToken = 0;
      var tree = buildTree();
      if (iToken < tokens.length - 1) {
         throw taskStrings.invalidExpressionTokenMissing;
      }
      return tree;
   }

   task.executeSample = function(iSample) {
      var value = $("#sample" + iSample).val();
      task.resetSelectedExample();
      $("#sample" + iSample).parent().css("background-color", "#AAFFAA");
      try {
         task.execute(value);
      } catch (exception) {
      }
   }

   task.execute = function(answer) {
      var strCondition = taskStrings.none;
      if (answer != "") {
         strCondition = answer;
      } else {
         answer = "x < 0";
      }
      $("#programUsed").html("<b>" + taskStrings.appliedCondition + "</b><br/>" + strCondition);
      var expr = parseExpr(answer);
      var grid = evalExprAll(expr);
      fillGrid(1, grid);
      if (checkGrid(grid, level)) {
         return true;
      }
      return false;
   }

   task.resetSelectedExample = function() {
      $("#expression").parent().css("background-color", "");
      $(".examples td").css("background-color", "");
   }

   task.test = function() {
      var strAnswer = $("#expression").val();
      task.resetSelectedExample();
      if ($.trim(strAnswer) != "") {
         $("#expression").parent().css("background-color", "#AAFFAA");
      }
      $(".examples td").css("background-color", "");
      try {
         return task.execute(strAnswer);
      } catch(exception) {
         return false;
      }
   };

   task.testAnswer = function() {
      if (task.test()) {
         platform.validate("done", function() {});
      } else {
         displayHelper.validate("stay");
      }
   }

   task.keydown = function() {
      task.resetSelectedExample();
      task.execute("");
   };

   checkGrid = function(grid, curLevel) {
      for (var row = 0; row < nbRows; row++) {
         for (var col = 0; col < nbCols; col++) {
            if ((grid[row][col] != data[curLevel][row][col])) {
               return false;
            }
         }
      }
      return true;
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      var answer = $.parseJSON(strAnswer);
      var taskParams = displayHelper.taskParams;
      var scores = {};
      var messages = {};
      var maxScores = displayHelper.getLevelsMaxScores();

      // clone the state to restore after grading.
      var oldState = $.extend({}, task.getStateObject());
      for (var curLevel in data) {
         state.level = curLevel;
         task.reloadStateObject(state, false);
         var success = true;
         try {
            var expr = parseExpr(answer[curLevel]);
            var values = evalExprAll(expr);
            success = checkGrid(values, curLevel);
         } catch (exception) {
            messages[curLevel] = exception;
            scores[curLevel] = 0;
            continue;
         }
         if (success) {
            messages[curLevel] = taskStrings.success;
            scores[curLevel] = maxScores[curLevel];
         } else {
            messages[curLevel] = taskStrings.failure;
            scores[curLevel] = 0;
         }
      }
      task.reloadStateObject(oldState, false);

      if (gradedLevel == null) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}

initTask();