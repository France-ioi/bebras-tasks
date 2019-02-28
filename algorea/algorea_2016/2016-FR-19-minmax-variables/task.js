
function initTask(subTask) {
   'use strict';
   var level;
   var answer = null; // an array of size nbRows, storing array with the value of the 4 choices (var / [min|max] / var / var)
   // state is the same as answer

   var data = {
      nbRows: {
         easy: 2,
         medium: 3,
         hard: 5 },
      leftVariables: {
         easy: ["Y", "Z"],
         medium: ["X", "Y", "Z"],
         hard: ["V", "W", "X", "Y", "Z"] },
      variables: {
         easy: ["", "A", "B", "C", "Y", "Z"],
         medium: ["", "A", "B", "C", "D", "X", "Y", "Z"],
         hard: ["", "A", "B", "C", "V", "W", "X", "Y", "Z"] },
      example: {
         easy: { "before": [3, 5, 4, '', ''], instruction: "Y = max(A, B)", "after": [3, 5, 4, 5, ''] },
         medium: { "before": [3, 5, 4, 2, '', '', ''], instruction: "X = min(A, B)", "after": [3, 5, 4, 2, 3, '', ''] },
         hard: { "before": [3, 5, 4, '', '', '', '', ''], instruction: "V = max(A, B)", "after": [3, 5, 4, 5, '', '', '', ''] }
      },
      nbInput: {
         easy: 3,
         medium: 4,
         hard: 3 },
      outputValue: {
         easy: 3, // biggest 
         medium: 1, // smallest
         hard: 2 } // medium 
      };
   // set by level
   var nbRows;
   var variables;
   var leftVariables;
   var example;
   var nbInput;
   var outputValue;
   var paperExampleA;
   var paperExampleB;
   var paperTarget;

   //-------------------------------------------------------------------------

   subTask.loadLevel = function(curLevel, curState) {
      displayHelper.timeoutMinutes = 10;
      level = curLevel;
      nbRows = data.nbRows[level];
      variables = data.variables[level];
      leftVariables = data.leftVariables[level];
      example = data.example[level];
      nbInput = data.nbInput[level];
      outputValue = data.outputValue[level];

      if (subTask.display) {
         initHandlers();
         initGraphics();
      }
      /*
     // For debug:
         selectOption(0, "left", "R");
         selectOption(0, "right1", "A");
         selectOption(0, "right2", "B");
         console.log("loadLevel " + display);
     */
   };

   // Remark: state is not used; these functions might not be needed

   subTask.getDefaultStateObject = function() {
      return subTask.getDefaultAnswerObject();
   };

   subTask.getStateObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return Beav.Array.init(nbRows, function(iRow) {
         return ["", "", ""]; // ""
         });
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      clearTrace();
   };

   subTask.resetDisplay = function() {
      for (var row = 0; row < nbRows; row++) {
         if (level != "easy") {
            selectOption(row, "op", answer[row][0]);
         }
         selectOption(row, "right1", answer[row][1]);
         selectOption(row, "right2", answer[row][2]);
         // selectOption(row, "left", answer[row][3]);
      };
   };

   //-------------------------------------------------------------------------

   function updateAnswer() {
      answer = [];
      for (var row = 0; row < nbRows; row++) {
         var id_prefix = "#arg_" + row + "_";
         var op = $(id_prefix + "op").val();
         var right1 = $(id_prefix + "right1").val();
         var right2 = $(id_prefix + "right2").val();
         // var left = $(id_prefix + "left").val();
         answer[row] = [ op, right1, right2 ]; // left
      };
   };

   function selectOption(row, key, value) {
      var id = "arg_" + row + "_" + key;
      $('#' + id + ' option[value="' + value + '"]').prop('selected', true);
   };

   function makeText(text, extraClass) {
      if (! extraClass) {
         extraClass = "";
      }
      return '<span class="arg_text ' + extraClass + '">' + text + '</span>';
   };

   function makeSelect(id, values, className) {
      var s = '<select id="' + id + '" class="' + className + '">';
      for (var iValue = 0; iValue < values.length; iValue++) {
         var value = values[iValue];
         s += '<option value="' + value + '">' + value + '</option>';
      }
      s += '</select>';
      return s;
   };

   function initHandlers() {
      $('#clean_trace').click(function clean_trace_handler() { clearTrace(); });
   };

   function drawHoles(paper, cy, values, variables) {
      var nbHoles = variables.length - 1;
      var elWidth = 30;
      var elHeight = 15;
      var spacing = 80;
      for (var iHole = 0; iHole < nbHoles; iHole++) {
         var cx = 35 + iHole * spacing;
         var color = "black";
         var value = '';
         if (iHole > variables.length - leftVariables.length - 2) {
            color = "gray";
         }
         if (iHole == nbHoles - 1) {
            color = "blue";
         }
         if (iHole < values.length) {
            value = values[iHole];
         }
         paper.ellipse(cx, cy, elWidth, elHeight).attr({"fill": color});
         paper.text(cx, cy + 1, value).attr({"fill": "white", "stroke": "white", "font-size": 20});
         paper.text(cx, cy + 30, variables[iHole + 1]).attr({"font-size": 20});
      }
   }

   function initTargetAndExample() {
      if (paperExampleA != null) {
         paperExampleA.remove();
         paperExampleB.remove();
         paperTarget.remove();
      }
      paperTarget = subTask.raphaelFactory.create("paperTarget", "paperTarget", 700, 80);
      var hiddenValues = [];
      for (var iHole = 0; iHole < variables.length - leftVariables.length - 1; iHole++) {
         hiddenValues.push('?');
      }
      drawHoles(paperTarget, 20, hiddenValues, variables);

      paperExampleA = subTask.raphaelFactory.create("paperExampleA", "paperExampleA", 650, 80);
      paperExampleB = subTask.raphaelFactory.create("paperExampleB", "paperExampleB", 650, 80);
      drawHoles(paperExampleA, 20, example.before, variables);
      $("#exampleInstruction").html(example.instruction);
      drawHoles(paperExampleB, 20, example.after, variables);
   };

   function initGraphics() {

      initTargetAndExample();

      // clear the table
      $('#program_table tr').remove();

      // fill the table
      $('#program_table').append('<tr><td></td><td><span id="traceInit" class="trace">&nbsp;</span></td></tr>');
      for (var row = 0; row < nbRows; row++) {
         var sRow = "";
         var id_prefix = "arg_" + row + "_";
         // To allow choosing the varible to the left, use this line:
         // sRow += makeSelect(id_prefix + "left", variables, "arg_choice arg_choice_var");
         var left = leftVariables[row];
         sRow += makeText(left, "arg_text_left");
         sRow += '<input type="hidden" id="' + id_prefix + "left" + '" value="' + left + '"></input>';
         sRow += makeText("=");
         var id_op = id_prefix + "op";
         if (level == "easy") {
            sRow += makeText("max");
            sRow += '<input type="hidden" id="' + id_op + '" value="max"></input>';
         } else {
            sRow += makeSelect(id_op, ["", "min", "max"], "arg_choice arg_choice_op");
         }
         sRow += makeText("(");
         sRow += makeSelect(id_prefix + "right1", variables, "arg_choice arg_choice_var");
         sRow += makeText(",");
         sRow += makeSelect(id_prefix + "right2", variables, "arg_choice arg_choice_var");
         sRow += makeText(")");
         var sCell1 = '<td>' + sRow + '</td>';
         var sCell2 = '<td><span id="trace_' + row + '" class="trace"></span></td>';
         $('#program_table').append('<tr>' + sCell1 + sCell2 + '</tr>');
      }  
      
      // register handlers
      $('.arg_choice').change(function() { updateAnswer(); });
   }

   // compute an array with all the permutations of a set of values
   // e.g.   console.log(permutations([1,2,3,4]));
   function permutations(values) {
      if (values.length == 0) {
         return [ [] ];
      } 
      var perm = [];
      for (var i = 0; i < values.length; i++) {
         var newvalues = [];
         for (var j = 0; j < values.length; j++) {
            if (i != j) {
               newvalues.push(values[j]);
            }
         }
         var subperm = permutations(newvalues);
         for (var k = 0; k < subperm.length; k++) {
            perm.push([values[i]].concat(subperm[k]));
         }
      }
      return perm;
   };

   // Returns an object with a boolean field "success",
   // and if the answer is negative, then a counter example
   // describe as an instantiation of the input variables
   // and a description of the computation performed by each row
   function evalSolution() {
      // create the array [1, 2, .., nbInput]
      var input = [];
      for (var i = 0; i < nbInput; i++) {
         input.push(i + 1);
      }
      // compute all permutations of the input
      var perms = permutations(input);

      // check sanity
      for (var row = 0; row < nbRows; row++) {
         var left = leftVariables[row];
         // var left = answer[row][3];
         var op = answer[row][0];
         var right1 = answer[row][1];
         var right2 = answer[row][2];

         // check operator is valid
         if (op != "min" && op != "max" && op != "") {
            return { success: false, message: "internal error, invalid op" };
         }

         // check variables in range (elem 0 is the "op")
         for (var elem = 1; elem < answer[row].length; elem++) {
            if (! Beav.Array.has(variables, answer[row][elem])) {
               return { success: false, message: "internal error, invalid variable" };
            }
         }

         // check that row is not partially filled:
         if (right1 != "" || right2 != "") {
            if (op == "" || right1 == "" || right2 == "") {
               return { success: false, message: taskStrings.incompleteRow };
            }
         }

         // 
         /* deprecated:
            (if not all fields are present, all but possibly op must be present) 
            if (  ! (left != "" && op != "" && right1 != "" && right2 != "")  
            && ! (left == "" && right1 == "" && right2 == "")) { 
            return { success: false, message: taskStrings.incompleteRow };
         }*/

      }

      // iterate on the permutation and do the simulation
      for (var iPerm = 0; iPerm < perms.length; iPerm++) {

         // set the initial values of the variables
         var inputValues = perms[iPerm];
         var bindings = [];
         var traceInit = "";
         for (var iVar = 1; iVar <= nbInput; iVar++) {
            bindings[variables[iVar]] = inputValues[iVar-1];
            traceInit += variables[iVar] + " = " + inputValues[iVar-1];
            if (iVar < nbInput) {
               traceInit += ",&nbsp;";
            }
         }
         for (var iVal = nbInput+1; iVar < variables.length; iVar++) {
            bindings[variables[iVar]] = 0; // 0 means never set
         }
          
         // simulate the rows
         // var hasSetR = false;
         var trace = [];
         for (var row = 0; row < nbRows; row++) {
            var left = leftVariables[row];
            // var left = answer[row][3];
            var op = answer[row][0];
            var right1 = answer[row][1];
            var right2 = answer[row][2];
            if (right1 == "" || right2 == "") {
               if (row == nbRows-1) {
                  return { success: false, message: taskStrings.emptyResult(left) };
               } else {
                  trace.push("");
                  continue;
               }
            }
            var vright1 = bindings[right1];
            if (vright1 == 0) {
               return { success: false, message: taskStrings.neverSet(right1), traceInit: traceInit, trace: trace };
            }
            var vright2 = bindings[right2];
            var vleft;
            if (op == "max") {
               vleft = Math.max(vright1, vright2);
            } else if (op == "min") {
               vleft = Math.min(vright1, vright2);
            }
            bindings[left] = vleft;
            /*if (left == "R") {
               hasSetR = true;
            }*/
            trace.push(left + " = " + op + "(" + vright1 + ", " + vright2 + ")" + " = " + vleft);
         }

         // check that result is correct
         var resultVar = variables[variables.length-1];
         if (bindings[resultVar] != outputValue) {
            var message = taskStrings.failure(level);
            return { success: false, message: message, traceInit: traceInit, trace: trace };
         }
      }
      return { success: true };
   };

   function reportTrace(result) {
      if (! result.traceInit) {
         return;
      }
      $('#clean_trace').show();
      // remove trailing comma
      $("#traceInit").html(taskStrings.forExample + result.traceInit);
      for (var i = 0; i < result.trace.length; i++) {
         $("#trace_" + i).html(result.trace[i]);
      }
   };

   function clearTrace() {
      $('.trace').html("");
      $('#clean_trace').hide();
   };


   //-------------------------------------------------------------------------

   subTask.getGrade = function(callback) {
     //updateAnswer();
     var result = evalSolution();
     var score = 0;
     var message = "";
     if (result.success) {
        score = 1;
        message = taskStrings.success;
     } else {
        score = 0;
        message = result.message;
        reportTrace(result);
     }
     callback({
        successRate: score,
        message: message
     });
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);



