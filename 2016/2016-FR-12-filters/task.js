function initTask(subTask) {
   var state = [];
   var level;
   var answer = null;
   var allItems = {
      orange: {
         type: "fruit",
         color: "orange",
         price: "7"
      },
      brocoli: {
         type: "vegetable",
         color: "green",
         price: "4"
      },
      rose: {
         type: "flower",
         color: "red",
         price: "3"
      },
      carrot: {
         type: "vegetable",
         color: "orange",
         price: "6"
      },
      cucumber: {
         type: "vegetable",
         color: "green",
         price: "5"
      },
      radish: {
         type: "vegetable",
         color: "red",
         price: "2"
      },
      apple: {
         type: "fruit",
         color: "red",
         price: "3"
      },
      tulip: {
         type: "flower",
         color: "yellow",
         price: "10"
      },
      banana: {
         type: "fruit",
         color: "yellow",
         price: "6"
      },
      kiwi: {
         type: "fruit",
         color: "green",
         price: "3"
      },
      eggplant: {
         type: "vegetable",
         color: "black",
         price: "6"
      },
      blackberry: {
         type: "fruit",
         color: "black",
         price: "9"
      }
   };
   var data = {
      easy: {
         items: ["orange", "brocoli", "rose", "carrot", "cucumber", "radish", "apple", "tulip", "banana", "kiwi"],
         target: ["brocoli", "cucumber"],
         columns: ["image", "name", "type", "color"],
         optionsAutoFill: ["type", "color"]
      },
      medium: {
         items: ["orange", "brocoli", "rose", "carrot", "cucumber", "radish", "apple", "tulip", "banana"],
         target: ["apple", "banana", "rose"],
         targetOrder: "name",
         columns: ["image", "name", "type", "color", "price"],
         optionsAutoFill: ["type", "color"],
         sorting: ["name", "type", "color", "price"]
      },
      hard: {
         items: ["orange", "brocoli", "eggplant", "rose", "carrot", "cucumber", "radish", "apple", "tulip", "banana", "blackberry"],
         target: ["radish", "apple", "brocoli", "blackberry"],
         targetOrder: "price", 
         columns: ["image", "name", "type", "color", "price"],
         optionsAutoFill: ["type", "color"],
         sorting: ["name", "type", "color", "price"]
      }
   };

   var controllers;
   var controlQuery;

   subTask.loadLevel = function(curLevel, curState) {
      level = curLevel;
      controlQuery = "." + level + " .controller";
      controllers = $(controlQuery);

      if(data[level].targetOrder) {
         sortByProperty(data[level].target, data[level].targetOrder);
      }
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initEvents();
      autoFillControllers();
      answerToControllers();
      refreshVisualResult(false);
      drawTarget();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      // Each controller ID is an answer field.
      var answerObject = {};
      controllers.each(function() {
         answerObject[this.id] = this[0].value;
      });
      return answerObject;
   };

   subTask.unloadLevel = function(callback) {
      controllers.unbind();
      callback();
   };

   function initEvents() {
      controllers.unbind();
      controllers.change(onChange);
      $(".clearFilters").unbind();
      $(".clearFilters").click(clickClear);
   }

   function autoFillControllers() {
      var propertyValues;
      var property;

      function fillEach() {
         var element = $("#" + this.id);
         element.empty();
         element.append("<option value=\"_empty\"></option>");

         var array = [];
         for(var propertyValue in propertyValues) {
            array.push({
               value: propertyValue,
               display: taskStrings.properties[property][propertyValue]
            });
         }
         array.sort(autoFillEntryComparator);
         for(var index = 0; index < array.length; index++) {
            element.append("<option value=\"" + array[index].value + "\">" + array[index].display + "</option>");
         }
      }

      for(var index in data[level].optionsAutoFill) {
         propertyValues = {};
         property = data[level].optionsAutoFill[index];
         for(var iItem in data[level].items) {
            var itemData = allItems[data[level].items[iItem]];
            if(itemData[property]) {
               propertyValues[itemData[property]] = true;
            }
         }
         $("." + level + " .property-" + property).each(fillEach);
      }

      /* DEPRECATED BUT KEEP FOR FUTURE USE
      if(data[level].sorting) {
         var element = $("." + level + " .sorting");
         element.empty();
         element.append("<option value=\"_empty\"></option>");

         var array = Beav.Array.init(data[level].sorting.length, function(index) {
            var property = data[level].sorting[index];
            return {
               value: property,
               display: taskStrings.columns[property]
            };
         });
         array.sort(autoFillEntryComparator);

         for(var sortIndex = 0; sortIndex < array.length; sortIndex++) {
            element.append("<option value=\"" + array[sortIndex].value + "\">" + array[sortIndex].display + "</option>");
         }
      }
      */
   }

   function autoFillEntryComparator(entry1, entry2) {
      return stringComparator(entry1.display, entry2.display);
   }

   function stringComparator(str1, str2) {
      return str1.localeCompare(str2);
   }

   function answerToControllers() {
      controllers.each(function() {
         this.value = answer[this.id];
      });
   }

   function itemFilter(itemName) {
      var itemData = allItems[itemName];

      function filterTextProperty(property, value, comp) {
         return value == "_empty" || comp == "_empty" || ((itemData[property] == value) === (comp == "equal"));
      }

      function filterPrice(value, comp) {
         if(value == "_empty" || comp == "_empty") {
            return true;
         }
         var itemPrice = itemData.price;
         var price = parseInt(value);
         if(comp == "lower_equal" && itemPrice <= price) {
            return true;
         }
         if(comp == "greater_equal" && itemPrice >= price) {
            return true;
         }
         return false;
      }

      function filterTwoTextProperties(property1, value1, comp1, property2, value2, comp2, cond) {
         var result1 = filterTextProperty(property1, value1, comp1);
         var result2 = filterTextProperty(property2, value2, comp2);
         if(value1 == "_empty" || comp1 == "_empty") {
            return result2;
         } else if(value2 == "_empty" || comp2 == "_empty") {
           return result1;
         } else if(cond == "and") {
            return result1 && result2;
         }
         else {
            return result1 || result2;
         }
      }

      function filterTwoPrices(value1, comp1, value2, comp2, cond) {
         var result1 = filterPrice(value1, comp1);
         var result2 = filterPrice(value2, comp2);
         if(value1 == "_empty" || comp1 == "_empty") {
           return result2;
         } else if (value2 == "_empty" || comp2 == "_empty") {
            return result1;
         } else if(cond == "and") {
            return result1 && result2;
         } else {
            return result1 || result2;
         }
      }

      if(level == "easy") {
         return filterTextProperty("type", answer["easy-type"], "equal") && filterTextProperty("color", answer["easy-color"], "equal");
      }
      else if(level == "medium") {
         return filterTextProperty("type", answer["medium-type"], answer["medium-type-comp"]) &&
                filterTextProperty("color", answer["medium-color"], answer["medium-color-comp"]) &&
                filterPrice(answer["medium-price"], answer["medium-price-comp"]);
      }
      else if(level == "hard") {
         return filterTwoTextProperties("type", answer["hard-type1"], answer["hard-type-comp1"], "type", answer["hard-type2"], answer["hard-type-comp2"], answer["hard-type-cond"]) &&
                filterTwoTextProperties("color", answer["hard-color1"], answer["hard-color-comp1"], "color", answer["hard-color2"], answer["hard-color-comp2"], answer["hard-color-cond"]) &&
                filterTwoPrices(answer["hard-price1"], answer["hard-price-comp1"], answer["hard-price2"], answer["hard-price-comp2"], answer["hard-price-cond"]);
      }
   }

   function itemsSorter(items) {
      var property = answer[level + "-sorting"];
      if(property == "_empty") {
         return;
      }
      sortByProperty(items, property);
   }

   function sortByProperty(items, property) {
      // When two items are equal, the tie is broken by *decreasing* order of the target order property.
      var tieBreakProperty = data[level].targetOrder;

      items.sort(function(item1, item2) {
         var name1 = taskStrings.properties.name[item1];
         var name2 = taskStrings.properties.name[item2];

         if(property == "name") {
            return stringComparator(name1, name2);
         }

         var result;
         var price1 = parseInt(allItems[item1].price);
         var price2 = parseInt(allItems[item2].price);

         if(property == "price") {
            result = price1 - price2;
         }
         else {
            // Property is not name and not price.
            var value1 = taskStrings.properties[property][allItems[item1][property]];
            var value2 = taskStrings.properties[property][allItems[item2][property]];
            result = stringComparator(value1, value2);
         }

         if(result !== 0) {
            return result;
         }

         // Break ties with decreasing order of the tie break property.
         if(tieBreakProperty == "name") {
            return stringComparator(name2, name1);
         }
         else if(tieBreakProperty == "price") {
            result = price2 - price1;
         }
         else {
            var tieValue1 = taskStrings.properties[property][allItems[item1][tieBreakProperty]];
            var tieValue2 = taskStrings.properties[property][allItems[item2][tieBreakProperty]];
            result = stringComparator(tieValue2, tieValue1);
         }

         if(result !== 0) {
            return result;
         }

         // Break by decreasing name.
         return stringComparator(name2, name1);
      });
   }

   function answerToResult() {
      var items = [];
      for(var iItem in data[level].items) {
         var item = data[level].items[iItem];
         if(itemFilter(item)) {
            items.push(item);
         }
      }
      if(data[level].sorting) {
         itemsSorter(items);
      }
      return items;
   }

   function drawTarget() {
      drawTable("targetTable", data[level].target);
   }

   function refreshVisualResult(validateOnSuccess) {
      var result = answerToResult();
      drawTable("resultTable", result);

      if(validateOnSuccess && Beav.Object.eq(result, data[level].target)) {
         platform.validate("done");
      }
   }

   function drawTable(id, items) {
      var iColumn, column;

      var html = "<tr>";
      for(iColumn in data[level].columns) {
         column = data[level].columns[iColumn];
         html += "<td style='width:" + taskStrings.columnWidth[column] + "px'>" + taskStrings.columns[column] + "</td>";
      }
      html += "</tr>";

      for(var iItem in items) {
         html += "<tr>";
         var itemName = items[iItem];
         var itemData = allItems[itemName];
         for(iColumn in data[level].columns) {
            column = data[level].columns[iColumn];
            if(column == "name") {
               html += "<td>" + taskStrings.properties.name[itemName] + "</td>";
            }
            else if(column == "image") {
               html += "<td><img src=\"" + $("#" + itemName + "_image").attr("src") + "\"></td>";
            }
            else if(column == "price") {
               html += "<td>" + taskStrings.priceOf(itemData[column]) + "</td>";
            }
            else {
               html += "<td>" + taskStrings.properties[column][itemData[column]] + "</td>";
            }
         }
         html += "</tr>";
      }

      if(items.length === 0) {
         html += "<tr><td colspan=\"" + data[level].columns.length + "\" id=\"messageEmpty\">" + taskStrings.empty + "</td></tr>";
      }
      $("#" + id).html(html);
   }

   function onChange() {
      answer[this.id] = this.value;
      // refreshVisualResult(true);
      refreshVisualResult(false);
   }

   function clickClear() {
      answer = subTask.getDefaultAnswerObject();
      answerToControllers();
      refreshVisualResult(false);
   }

   function getResultAndMessage() {
      var userItems = answerToResult();
      if(Beav.Object.eq(userItems, data[level].target)) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }
      else {
         return {
            successRate: 0,
            message: taskStrings.wrong
         };
      }
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
