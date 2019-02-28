function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;

   /*
   * A configuration is an array of 13 values. Each value is the color of a region, or null for transaprent.
   * The 13 regions cover all possibilities:
   * 
   *               2
   *          4    6    12
   *      1   8    0    7   9
   *          10   5    11
   *               3
   * 
   */

   var colors = {
      orange: "#ff7f27",
      purple: "#803080",
      green: "#00e8a2"
   };
   var symbols = {
      "A": [colors.orange, null, null, null, colors.orange, colors.orange, colors.orange, colors.orange, colors.orange, null, colors.orange, colors.orange, colors.orange],
      "B": [colors.purple, colors.purple, null, null, null, null, null, colors.purple, colors.purple, colors.purple, null, null, null],
      "C": [colors.green, null, colors.green, colors.green, null, colors.green, colors.green, null, null, null, null, null, null]
   };
   var operators = {
      "+": operatorAdd,
      "-": operatorSub,
      "#": operatorCross
   };
   var operatorsButtons = ["+", "-", "#"];

   var data = {
      easy: {
         target: [null, colors.purple, null, null, null, null, null, null, null, colors.purple, null, null, null],
         parentheses: false
      },
      medium: {
         target: [colors.green, colors.purple, null, null, null, null, null, null, null, colors.purple, null, null, null],
         parentheses: false
      },
      hard: {
         target: [null, null, null, null, null, colors.green, colors.green, colors.purple, colors.purple, null, null, null, null],
         parentheses: true
      }
   };

   var examples = {
      easy: ["A+C", "A-B", "A#C"],
      medium: ["A+C", "A-B", "A#C", "A-B+C", "A+B#C"],
      hard: ["A+C", "A-B", "A#C", "A-B+C", "A+(B#C)", "A+B#C"]
   };

   var userVisualConfig;
   var targetVisualConfig;
   var keyboard;

   var inputLimit = 30;

   var smallParams = {
      width: 70,
      height: 70,
      scale: 0.27,
      "background-color": "gray"
   };

   var mediumParams = {
      width: 90,
      height: 100,
      scale: 0.4
   };

   var bigParams = {
      width: 240,
      height: 240,
      scale: 0.95
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      
      // Not supposed to happen in regular use.
      if(!isValidPrefix(answer)) {
         answer = "";
      }
   };

   subTask.resetDisplay = function() {
      initVisualSymbols();
      initExamples();
      initVisualUser();
      initKeyboard();
      updateFromAnswer();
      showError(null);
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return "";
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function createVisualConfig(elementID, visualParams) {
      var paper = subTask.raphaelFactory.create(elementID, elementID, visualParams.width, visualParams.height);
      paper.setStart();
      var array = [
         paper.path("m 365.46715,629.30276 c -9.64827,-0.62577 -21.6938,-2.08094 -29.86147,-3.60751 l -3.72308,-0.69579 -1.23512,-8.76716 c -2.11985,-15.0473 -2.34505,-18.59716 -2.34859,-37.02449 -0.003,-17.2121 0.16916,-20.37798 1.79892,-33.02167 0.81596,-6.32997 2.52959,-16.68752 2.9139,-17.61214 0.25514,-0.61383 1.00999,-0.80571 6.78737,-1.72539 22.37019,-3.56097 42.67938,-4.23506 65.47803,-2.17327 7.77128,0.70277 23.07518,2.97668 23.60417,3.50715 0.27367,0.27445 1.43546,6.58052 2.28778,12.41789 2.32447,15.91979 2.92852,25.75774 2.6731,43.53603 -0.19872,13.83069 -0.5674,18.57689 -2.56906,33.07241 l -1.07325,7.77223 -0.99348,0.17266 c -0.54642,0.095 -3.13142,0.54876 -5.74446,1.00843 -5.93985,1.0448 -13.5335,2.01867 -20.96986,2.68928 -6.72218,0.60621 -30.22026,0.89264 -37.0249,0.45134 z").attr({
            id: 'path4310',
            fill: '#ffff00',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4310'),
         paper.path("m 302.2422,615.99812 c -4.5545,-1.80792 -13.80279,-6.42923 -17.31614,-8.65276 -6.6263,-4.19365 -12.31195,-9.14627 -15.8321,-13.79091 -2.04811,-2.70236 -4.72207,-8.00359 -5.4804,-10.86509 -0.85495,-3.22607 -0.77573,-9.23298 0.16497,-12.50912 3.62131,-12.61182 16.68778,-23.79778 38.09803,-32.61501 2.13503,-0.87926 3.93615,-1.59865 4.00247,-1.59865 0.0663,0 0.12059,18.3052 0.12059,40.67822 0,22.37302 -0.11027,40.67193 -0.24504,40.66426 -0.13478,-0.008 -1.71535,-0.5976 -3.51238,-1.31094 z").attr({
            id: 'path4298',
            fill: '#00ff00',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4298'),
         paper.path("m 341.4942,501.2529 c 1.87387,-5.18976 6.56127,-14.41325 9.97362,-19.6253 8.8004,-13.44179 18.81084,-20.31777 29.57975,-20.31777 10.80122,0 20.76141,6.85982 29.65019,20.42079 3.39663,5.18199 7.89795,14.06099 9.89707,19.52228 l 0.4485,1.22524 -39.99576,0 -39.99577,0 0.4424,-1.22524 z").attr({
            id: 'path4302',
            fill: '#ff00ff',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4302'),
         paper.path("m 377.5526,697.30096 c -15.02183,-2.36717 -29.38427,-19.53857 -38.18687,-45.65532 l -1.23891,-3.67574 42.92605,0 42.92605,0 -0.34685,1.06188 c -4.5228,13.84661 -10.72153,25.98368 -17.51941,34.30291 -4.12956,5.05373 -10.01102,9.82821 -14.61521,11.8644 -4.29001,1.89725 -9.88845,2.74108 -13.94485,2.10187 z").attr({
            id: 'path4304',
            fill: '#ff00ff',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4304'),
         paper.path("m 305.86446,519.17449 0,-16.69965 17.4834,0 c 9.61587,0 17.4834,0.0769 17.4834,0.17092 0,0.094 -0.88606,2.83696 -1.96906,6.09537 -1.083,3.25847 -2.73637,8.99794 -3.67414,12.75446 -0.93778,3.75651 -1.73766,6.8627 -1.77747,6.90264 -0.0399,0.0399 -2.17039,0.54074 -4.73455,1.11284 -5.62288,1.25454 -14.0475,3.57878 -18.79755,5.18603 -1.91336,0.64733 -3.59925,1.17704 -3.74642,1.17704 -0.14723,0 -0.26761,-7.51484 -0.26761,-16.69965 z").attr({
            id: 'path4312',
            fill: '#000000',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4312'),
         paper.path("m 337.02829,645.27422 c -1.7191,-5.58375 -5.08169,-20.28959 -4.72309,-20.65737 0.0739,-0.0761 2.57178,0.29205 5.55098,0.81804 28.07661,4.95761 59.92276,4.89138 87.2017,-0.18135 2.50751,-0.4663 4.63574,-0.76919 4.7295,-0.67309 0.39334,0.40365 -2.85989,14.77559 -4.67986,20.67388 l -0.85828,2.78156 -43.18526,0 -43.18542,0 -0.85027,-2.76167 z").attr({
            id: 'path4322',
            fill: '#ff0000',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4322'),
         paper.path("m 333.50341,527.88068 c -0.0253,-0.99762 3.52858,-13.91335 5.20649,-18.92182 l 2.14955,-6.41625 40.18812,0 40.18812,0 2.16684,6.48568 c 1.93965,5.80564 5.43488,18.71669 5.13763,18.97794 -0.064,0.0563 -2.10125,-0.25014 -4.52725,-0.68086 -13.50125,-2.39707 -26.77521,-3.48302 -42.80198,-3.50166 -15.76709,-0.0184 -27.67107,0.89815 -41.41336,3.1884 -3.45928,0.57652 -6.29165,0.96737 -6.29416,0.86857 z").attr({
            id: 'path4320',
            fill: '#ff0000',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4320'),
         paper.path("m 430.13088,623.28589 c 1.31827,-7.50741 2.54354,-17.48515 3.21987,-26.2203 0.54103,-6.98754 0.544,-28.29479 0.005,-35.45049 -0.76755,-10.18899 -2.54386,-23.48382 -4.15383,-31.08928 l -0.4467,-2.11014 1.03589,0.20818 c 6.13184,1.23231 14.3819,3.41523 21.24593,5.62155 l 4.70195,1.51135 0,40.93249 0,40.93249 -5.59331,1.80106 c -5.39099,1.73591 -18.30426,5.08834 -19.59985,5.08834 -0.54636,0 -0.60147,-0.1628 -0.41492,-1.22525 z").attr({
            id: 'path4308',
            fill: '#808000',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4308'),
         paper.path("m 331.31217,624.58018 c -3.20385,-0.57468 -14.99399,-3.68666 -19.64892,-5.18628 l -5.79815,-1.86793 0.0833,-40.83206 0.0833,-40.83206 3.28316,-1.1107 c 5.31248,-1.79721 12.75197,-3.86823 18.41397,-5.12611 2.90473,-0.64532 5.36138,-1.17331 5.45922,-1.17331 0.0978,0 -0.0319,0.99245 -0.2883,2.20545 -0.90336,4.27352 -2.4002,14.03452 -3.04383,19.84901 -1.17113,10.57979 -1.47211,16.48355 -1.47416,28.91584 -0.003,15.9421 0.70578,25.36942 2.97772,39.62601 0.4519,2.83564 0.77383,5.26691 0.71543,5.40282 -0.0584,0.1359 -0.40169,0.1941 -0.76284,0.12932 z").attr({
            id: 'path4306',
            fill: '#808000',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4306'),
         paper.path("m 455.70599,576.77698 c 0,-22.44572 0.11932,-40.8104 0.26516,-40.8104 0.73333,0 8.35207,3.26117 12.96751,5.5507 8.69101,4.31124 15.32833,8.95767 20.5994,14.42055 4.43553,4.59694 7.06827,8.84297 8.69491,14.02302 0.64829,2.06446 0.76313,3.10983 0.75224,6.84732 -0.012,4.11434 -0.0847,4.61911 -1.08073,7.50803 -0.58734,1.70343 -1.52224,3.90887 -2.07755,4.90099 -5.94086,10.61384 -18.6304,19.87167 -37.4254,27.30423 l -2.69554,1.06596 0,-40.8104 z").attr({
            id: 'path4300',
            fill: '#00ff00',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4300'),
         paper.path("m 305.93046,632.59533 c 0,-8.40336 0.0465,-15.27884 0.10323,-15.27884 0.0568,0 1.43243,0.4606 3.05702,1.02352 4.48944,1.55564 12.97195,3.95223 18.31766,5.17543 l 4.78835,1.09558 0.24327,1.13791 c 1.7352,8.11619 2.8275,12.73536 4.02095,17.00429 l 1.43167,5.12094 -15.98108,0 -15.98107,0 0,-15.27883 z").attr({
            id: 'path4318',
            fill: '#000080',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4318'),
         paper.path("m 425.71482,642.81155 c 1.34917,-4.73644 3.51251,-13.92766 3.96481,-16.84504 l 0.20857,-1.34517 3.64879,-0.76504 c 4.63522,-0.97196 12.06513,-3.01585 17.69325,-4.86731 l 4.37997,-1.44084 0,15.13001 0,15.13 -15.65933,0 -15.65932,0 1.42326,-4.99661 z").attr({
            id: 'path4316',
            fill: '#666666',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4316'),
         paper.path("m 452.15641,534.85806 c -4.52197,-1.60019 -12.3675,-3.81386 -18.0615,-5.09616 -2.89991,-0.65315 -5.34267,-1.2581 -5.42831,-1.34432 -0.0856,-0.0863 -0.41984,-1.33535 -0.74262,-2.77558 -1.18977,-5.30863 -3.09179,-12.13222 -4.85213,-17.40728 -0.9944,-2.97996 -1.80804,-5.50241 -1.80804,-5.60549 0,-0.10307 7.69824,-0.18738 17.1072,-0.18738 l 17.1072,0 0,16.73288 c 0,9.20306 -0.11213,16.72149 -0.24915,16.70765 -0.13702,-0.0135 -1.51971,-0.47481 -3.07265,-1.02432 z").attr({
            id: 'path4314',
            fill: '#00ffff',
            stroke: 'none',
            "stroke-width": '1',
            "stroke-miterlimit": '1.00000012',
            "stroke-dasharray": 'none',
            "stroke-dashoffset": '0',
            "stroke-opacity": '1'
         }).data('id', 'path4314')
      ];

      var set = paper.setFinish();

      var centerX = visualParams.width / 2;
      var centerY = visualParams.height / 2;

      // Apply the needed transformations using transformPath (for IE6 compatibility).
      // This brings the shapes' center to the paper's center.
      set.forEach(function(element) {
         element.attr({
            path: Raphael.transformPath(element.attrs.path, ["T", -263 - 118 + centerX, -461 - 118 + centerY])
         });
      });

      set.transform(["S", visualParams.scale, visualParams.scale, centerX, centerY]);
      set.attr("opacity", 0);

      return {
         paper: paper,
         set: set,
         array: array
      };
   }

   function refreshVisualConfig(visualConfig, values) {
      for(var index = 0; index < values.length; index++) {
         var color = values[index];
         var opacity = 1;
         if(values[index] === null) {
            opacity = 0;
         }
         visualConfig.array[index].attr({
            fill: values[index],
            opacity: opacity,
            stroke: color
         });
      }
   }

   function initVisualSymbols() {
      var symbolsContainerHTML = "";
      var symbol;
      for(symbol in symbols) {
         symbolsContainerHTML += '<div class="symbol sectionBlock" id="symbol_' + symbol + '"><span class="paperTitle">' + symbol + '</span><br><div class="paperDiv symbolButton" id="paperSymbol_' + symbol + '"></div></div>';
      }
      $("#symbolsContainer").html(symbolsContainerHTML);
      function attachClick(symbol) {
         $("#symbol_" + symbol).click(function() { handleKey(symbol.charCodeAt(0)) });
      }
      for(symbol in symbols) {
         attachClick(symbol);
      }

      for(symbol in symbols) {
         var visualConfig = createVisualConfig("paperSymbol_" + symbol, smallParams);
         refreshVisualConfig(visualConfig, symbols[symbol]);
      }
   }

   function initExamples() {
      var examplesContainerHTML = '';
      var iExample;
      for(iExample in examples[level]) {
         examplesContainerHTML += '<div class="example sectionBlock"><span class="paperTitle">' + expressionToDisplayString(examples[level][iExample]) + '</span><br><div class="paperDiv" id="paperExample_' + iExample + '"></div></div>';
      }
      $("#examples").html(examplesContainerHTML);

      for(iExample in examples[level]) {
         var visualConfig = createVisualConfig("paperExample_" + iExample, mediumParams);
         var config = configFromExpression(examples[level][iExample]);
         refreshVisualConfig(visualConfig, config);
      }
   }

   function initVisualUser() {
      userVisualConfig = createVisualConfig("paperUser", bigParams);
      refreshVisualConfig(userVisualConfig, configFromExpression(answer));

      targetVisualConfig = createVisualConfig("paperTarget", bigParams);
      refreshVisualConfig(targetVisualConfig, data[level].target);
   }

   function initKeyboard() {
      keyboard = new Keyboard(handleKey);
      var rows = [];
/*
      var symbolKeys = [];
      for(var symbol in symbols) {
         symbolKeys.push({keyCode: symbol, buttonText: symbol});
      }
      symbolKeys.sort(keyComparator);
      rows.push(symbolKeys);
*/
      var operatorKeys = [];
      for(var iOp = 0; iOp < operatorsButtons.length; iOp++) {
         var operator = operatorsButtons[iOp];
         operatorKeys.push({keyCode: operator, buttonText: operator});
      }
      rows.push(operatorKeys);

      if(data[level].parentheses) {
         rows.push([
            {keyCode: "(", buttonText: "("},
            {keyCode: ")", buttonText: ")"}
         ]);
      }
      
      rows.push([{
         keyCode: Keyboard.BACKSPACE,
         buttonText: taskStrings.backspace
      }]);

      keyboard.addMap($("#keyboardContainer"), rows);
   }

   function keyComparator(key1, key2) {
      return key1.keyCode.charCodeAt(0) - key2.keyCode.charCodeAt(0);
   }

   function handleKey(key) {
      showError(null);

      if(key === Keyboard.BACKSPACE) {
         answer = answer.substring(0, answer.length - 1);
      }
      else if(answer.length < inputLimit) {
         var newChar = String.fromCharCode(key);
         var newAnswer = answer + newChar;
         if(isValidPrefix(newAnswer)) {
            answer = newAnswer;
         }
         else {
            if (isSymbol(newChar)) {
               showError(taskStrings.syntaxErrorShape);
            } else {
               showError(taskStrings.syntaxError(newChar));
            }
         }
      }
      
      refreshVisualConfig(userVisualConfig, configFromExpression(answer));
      updateFromAnswer();
   }

   function updateFromAnswer() {
      $("#input").text(expressionToDisplayString(answer));
   }

   // Escape a string in order to search it using regex.
   // From https://stackoverflow.com/a/3561711
   function escapeRegex(string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
   }

   function expressionToDisplayString(expression) {
      // Prepend a space to each operator.
      var string = expression;
      for(operator in operators) {
         string = string.replace(new RegExp(escapeRegex(operator), "g"), " " + operator);
      }
      return string;
   }

   function configFromExpression(expression) {

      // A config only takes into account the longest prefix which is valid.
      expression = getLongestPrefixValid(expression);

      /*
       * Auxiliary function:
       * Takes an array without parentheses, in the form:
       * [config, operator, config, operator, ..., config]
       * and returns the resulting config.
       */
      function evaluateFlat(array) {
         if(array.length === 0) {
            return Beav.Array.make(data[level].target.length, null);
         }
         var result = array[0];
         // Iterate over the operators and apply in order from left to right.
         for(var index = 1; index < array.length; index += 2) {
            var operatorFunc = operators[array[index]];
            result = operatorFunc(result, array[index + 1]);
         }
         return result;
      }

      var currentArray = [];
      var stack = [currentArray];
      for(var index = 0; index < expression.length; index++) {
         var char = expression.charAt(index);

         // Go higher up the stack.
         if(char === "(") {
            currentArray = [];
            stack.push(currentArray);
         }

         // Finished an expression in parentheses - evaluate it and push it down.
         else if(char === ")") {
            stack.pop();
            var tempResult = evaluateFlat(currentArray);
            currentArray = stack[stack.length - 1];
            currentArray.push(tempResult);
         }

         // Symbols are pushed in the current stack level.
         else if(isSymbol(char)) {
            currentArray.push(symbols[char]);
         }

         // Operators are pushed in the current stack level.
         else {
            currentArray.push(char);
         }
      }

      // The stack now contains a single level with a flat array.
      return evaluateFlat(stack[0]);
   }

   // Return the longest prefix of the expression which is itself a valid expression.
   function getLongestPrefixValid(expression) {
      var info = analyzeExpression(expression);
      if(!info.isValidPrefix) {
         return "";
      }
      return expression.substr(0, info.maxValidLength);
   }

   function isValidPrefix(expression) {
      var info = analyzeExpression(expression);
      return info.isValidPrefix;
   }

   /*
    * Return an object with the fields:
    * isValidPrefix: boolean indicating whether this expression is a prefix of a valid expression.
    * depth: the number of open brackets that haven't been closed. The expression is valid iff
    *        it is a valid prefix, and the depth is 0, and the last character is not an operator.
    * maxValidLength: The length of the longest prefix of this expression which is a valid expression.
    *
    * If the expression is not a valid prefix, the last two field are omitted.
    */
   function analyzeExpression(expression) {
      if(expression === "") {
         return {
            isValidPrefix: true,
            depth: 0,
            maxValidLength: 0
         };
      }

      var maxValidLength = 0;

      // First char must be a symbol or a "(".
      var depth = 0;
      var char;
      // The first character's limitations are equivalent to the situation after an operator.
      var previousChar = "+";

      for(var index = 0; index < expression.length; index++) {
         char = expression.charAt(index);
         if(char === "(") {
            depth++;
            if(previousChar === ")" || isSymbol(previousChar)) {
               return {isValidPrefix: false};
            }
         }
         else if(char === ")") {
            depth--;
            if(previousChar === "(" || isOperator(previousChar) || depth < 0) {
               return {isValidPrefix: false};
            }
         }
         else if(isSymbol(char)) {
            if(previousChar === ")" || isSymbol(previousChar)) {
               return {isValidPrefix: false};
            }
         }
         else {
            if(previousChar === "(" || isOperator(previousChar)) {
               return {isValidPrefix: false};
            }
         }

         if(depth === 0 && !isOperator(char)) {
            maxValidLength = index + 1;
         }

         previousChar = char;
      }

      return {
         isValidPrefix: true,
         depth: depth,
         maxValidLength: maxValidLength
      };
   }

   function isOperator(char) {
      return operators[char] !== undefined;
   }

   function isSymbol(char) {
      return symbols[char] !== undefined;
   }

   function operatorAdd(config1, config2) {
      return Beav.Array.init(config1.length, function(index) {
         if(config2[index] !== null) {
            return config2[index];
         }
         return config1[index];
      });
   }

   function operatorSub(config1, config2) {
      return Beav.Array.init(config1.length, function(index) {
         if(config2[index] !== null) {
            return null;
         }
         return config1[index];
      });
   }

   function operatorCross(config1, config2) {
      return Beav.Array.init(config1.length, function(index) {
         if(config1[index] !== null && config2[index] !== null) {
            return config1[index];
         }
         return null;
      });
   }

   function showError(string) {
      if(string === null || string === undefined || string === "") {
         string = "&nbsp;";
      }
      $("#error").html(string);
   }

   function getResultAndMessage() {
      var userConfig = configFromExpression(answer);

      for(var index = 0; index < data[level].target.length; index++) {
         if(data[level].target[index] !== userConfig[index]) {
            return {
               successRate: 0,
               message: taskStrings.error
            };
         }
      }
      return {
         successRate: 1,
         message: taskStrings.success
      };
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
