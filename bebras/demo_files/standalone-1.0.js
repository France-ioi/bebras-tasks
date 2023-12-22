/*
  usage:
     index.html
  or
     index.html?dev=1
  or
     index.html?interactive=1
  or
     index.html?private=1 // DEPRECATED, now using index_full
  or
     index.html?lang=en


   // using feature of tasks:
         ?level=easy
         ?initialLevel=easy
         ?options={showSolutionOnLoad:1}
*/

//-----------------------------------------------------------------------------

// To get the value associated with a param in URI

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null){
       return null;
    } else {
       return results[1] || 0;
    }
}

//-----------------------------------------------------------------------------

// To draw completion stars

var getStarSVGfull = function() { return '<svg height="17.099999999999998" version="1.1" width="18" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="overflow: hidden; position: relative;"><desc style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Created with Raphaël 2.1.2</desc><defs style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></defs><path fill="#ffc90e" stroke="#000000" d="M46.761,-0.11711L62.135000000000005,26.19589L91.911,32.68589L71.637,55.43889L74.666,85.76389L46.760999999999996,73.51289L18.856999999999996,85.76389L21.884999999999994,55.43889L1.6109999999999935,32.68589L31.386999999999993,26.19589Z" stroke-width="5" transform="matrix(0.18,0,0,0.18,0,0)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path></svg>'; }

var getStarSVGempty = function() { return '<span id="tabScore_medium0_empty" class="emptyStar"><svg height="17.099999999999998" version="1.1" width="18" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="overflow: hidden; position: relative; left: -0.984375px; top: -0.59375px;"><desc style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Created with Raphaël 2.1.2</desc><defs style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></defs><path fill="#ffffff" stroke="#000000" d="M46.761,-0.11711L62.135000000000005,26.19589L91.911,32.68589L71.637,55.43889L74.666,85.76389L46.760999999999996,73.51289L18.856999999999996,85.76389L21.884999999999994,55.43889L1.6109999999999935,32.68589L31.386999999999993,26.19589Z" stroke-width="5" transform="matrix(0.18,0,0,0.18,0,0)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path></svg></span>'; }


//-----------------------------------------------------------------------------

// To extract code and text-id from path

var extractShortCode = function(code) {
   return (code.match(/20..-([^\\-]*-[^\\-]*).*/))[1];
};

var extractTextCode = function(code) {
   return (code.match(/20..-[^\\-]*-[^\\-]*-(.*)/))[1];
};

//-----------------------------------------------------------------------------

function difficultyToInteger(diff) {
   if (diff == "default")
      return -1;
   if (diff == "basic")
      return 0;
   if (diff == "easy")
      return 1;
   if (diff == "medium")
      return 2;
   if (diff == "hard")
      return 3;
   return -2;
}

//-----------------------------------------------------------------------------

// To build link to version

var getLinkTask = function(code, options, language) {
   var sOptions = '';
   var sOtherOptions = '';
   if (options != null) {
      var arg = "{";
      var first = true;
      for (var key in options) {
          // TODO: file:///home/charguer/ioi/tasks/v01/Bebras_Public/2014/2014-CH-05-abacus/index.html?options=%7B%7D&initialLevel=hard
          //       options: {difficulty: "easy"} },

         if (key == "difficulty") { // special handling
            sOtherOptions = "&initialLevel=" + options[key];
         } else {
            if (! first) {
               arg += ",";
               first = false;
            }
            var value = options[key];
            arg += "\"" + String(key) + "\":\"" + String(value) + "\"";
         }
      }
      arg += "}";
      sOptions = "?options=" + encodeURIComponent(arg) + sOtherOptions;
   }
   var file = (language == undefined || language == "fr") ? "index.html" : "index_" + language + ".html";
   return code + "/" + file + sOptions;
};

//-----------------------------------------------------------------------------


// Action handlers

function loadTask(taskCode) {
    window.location = taskCode;
/* DEPRECATED for use of iframe
   $('#iframe').attr('src', taskCode);
   $('#iframe').css('display', "block");
   $('body').scrollTop(0);
   $('#task_icons').css('display', "none");
*/
};

//-----------------------------------------------------------------------------

// Contents manager

var standaloneContents = {};

var standaloneAddContents = function(descr) {
  // descr should have fields: code, title, folder, tasks;
  // where tasks is an array of objects with fields: code and title.
  standaloneContents[descr.code] = descr;
}


//-----------------------------------------------------------------------------

var standaloneLoadPage = function(codes, pathToRoot) {

    // Extra private contents // DEPRECATED, NOW USING index_full.html
    var showPrivate = ($.urlParam('private') == "1");
    if (showPrivate) {
      var extraCodes = [ "castor_2022", "castor_2021" ];
      codes = extraCodes.concat(codes);
      // dynamic load of contents files
      for (var iCode = 0; iCode < extraCodes.length; iCode++) {
        var code = extraCodes[iCode];
        var year = code.substring("castor_".length);
        var path = "./" + year + "/contents.js";
        document.write('<script type="text/javascript" src="'+path+'"></script>');
      }
    }


  //------------------------------
  // Configuration

  if (pathToRoot === undefined) {
    pathToRoot = "../";
  }

  // DEPRECATED var showLinks = ($.urlParam('links') == "1");
  var showDev = ($.urlParam('dev') == "1");
  var showLinksOpeningInSeparateWindows = showDev;
  var showGroupIcon = false;
  var showOnlyInteractive = ($.urlParam('interactive') == "1");
  if (showDev) {
    if (onlyOneGroup) {
       showGroupIcon = true;
    }
  }
  var showLang = $.urlParam('lang');
  if (showLang == null) {
    showLang = "fr";
  }

  var path = window.location.pathname;
  var showPage = path.split("/").pop();

  //------------------------------
  // Display properties

  var onlyOneGroup = (codes.length == 1);
  var theContents = (onlyOneGroup) ? standaloneContents[codes[0]] : null;
  if (theContents !== null && theContents === undefined) {
     console.log("Resources not found: " + codes[0]);
  }



  //------------------------------
  // Task icon html contents

  function computeTaskDiv(contents, iTask, idLanguage) {

    var pathPrefix = pathToRoot + contents.folder;
    var tasks = contents.tasks;
    var task = tasks[iTask];

    if (! task.hasOwnProperty("translations")) {
      console.log("ERROR: missing translations field for " + task.code);
    }
    if (! (0 <= idLanguage && idLanguage < task.translations.length)) {
      console.log("ERROR: invalid idLanguage " + idLanguage + "  for " + task.code);
    }
    var translation = task.translations[idLanguage];
    if (! translation.hasOwnProperty("language")) {
      console.log("ERROR: missing language field for " + task.code);
    }
    var language = translation.language;
    // LATER: could read translation.file  to build the target;
    var difficulties = task.difficulties;

    // options for link generation
    var options = task.options;

    // image and main link
    var targetNormal = pathPrefix + getLinkTask(task.code, options, language, idLanguage);
    if (options == null) {
      options = [];
    }
    //options.difficulty = "easy";
    //var targetNormalEasy = pathPrefix + getLinkTask(task.code, options, language);

    // DEPRECATED: open task inside iframe
    var onclick = " onclick=\"loadTask('" + targetNormal + "')\" ";
    //    var onclick = " onclick=\"window.open('" + targetNormal + "', '_blank')\" ";

    var title = task.translations[idLanguage].title; // DEPRECATED task.title
    var iconTitle = '<div class="icon_title">' + title + '</div>';
    var imgPath = pathPrefix + task.code + '/icon.png';
    //if (showLinksOpeningInSeparateWindows) {
       var sImg = '<img src="' + imgPath + '" ' + onclick + '/>';
    //} else {
    //   var sImg = '<a href="' + targetNormal + '"><img src="' + imgPath + '"/></a>';
    //}
    var iconImg = '<div class="icon_img"><table><tr><td class="icon_img_td" style="vertical-align: middle;">' + sImg + '</td></tr></table></div>';

    // filter-out non-interactive tasks if requested
    if (showOnlyInteractive && ! task.isInteractive) {
      return '';
    }

    var stars = '';
    for (var i = 0; i < 4; i++) { // 4 versions max
       stars += (task.hasStar[i]) ? getStarSVGfull() : getStarSVGempty();
    }
    var iconStars = '<div class="icon_stars">' + stars + '</div>';

    // standalone links placed below the image
    var iconLink = '';
    /* DEPRECATED  show textual links that can be copy-pasted
    if (showLinks) {
      var textTitle = extractTextCode(task.code);
      var shortCode = extractShortCode(task.code);
      var sLinkTitle = (showDev) ? (shortCode + " " + textTitle) : task.title; // "Lien direct";
      var sLinkStyle = (showDev) ? "icon_link_text_black" : "icon_link_text_link";
      var sLink = '<a class="' + sLinkStyle + '" target = "_blank" href="' + targetNormal + '">' + sLinkTitle + '</a>';
      iconLink = '<div class="icon_link">' + sLink + '</div>';
    }
    */

    // development links
    var iconDev = '';
    if (showDev) {
      var versionTargets = [];
      for (var iDifficulty = 0; iDifficulty < difficulties.length; iDifficulty++) {
         var diff = difficulties[iDifficulty];
         var sDiff = "" + difficultyToInteger(diff);
         if (sDiff == -1)
            sDiff = "";
         options.difficulty = difficulties[iDifficulty];
         var targetNormal = pathPrefix + getLinkTask(task.code, options, language);
         var optionsSol = jQuery.extend({}, options);
         optionsSol.showSolutionOnLoad = "1";
         var targetSol = pathPrefix + getLinkTask(task.code, optionsSol);
         // var targetEnglish = pathPrefix + getLinkTask(task.code, optionsSol, "en");
         versionTargets[sDiff] = {normal: targetNormal, solution: targetSol };
      }
      var sDev = "";
      for (var diff in versionTargets) {
         sDev += " <a href='" + versionTargets[diff].normal + "' style='color:black'>[T" + diff + "]</a>";
      }
      sDev += "<br/>";
      for (var diff in versionTargets) {
        sDev += " <a href='" + versionTargets[diff].solution + "' style='color:black'>[S" + diff + "]</a>";
      }
      //sDev += "&nbsp;&nbsp;";
      //sDev += "<a href='" + versionTargets[0].english + "' style='color:black'>[en1]</a>";
      sDev += "<br/><br/>";
      iconDev = '<div class="icon_dev">' + sDev + '</div>';
    }
    return '<div class="icon"><div ' + onclick + '>' + iconTitle + iconImg + iconStars + '</div>' +  iconLink + iconDev + '</div>';
  };



  //------------------------------
  // Main html contents

  var getHtmlContents = function() {
    /*
              <!--<td id="header_score">Score&nbsp;:<br/><b>214 points</b></td> \
              <td id="header_time">Temps restant&nbsp;: <br/><b>38 minutes</b></td>--> \
              <!--<td id="header_space"></td>-->

    */
    var interactifs = (showOnlyInteractive) ? "interactifs " : "";
    return ' \
    <div id="main_wrapper"> \
     <div id="main"> \
        <div id="header"> \
           <table id="header_table"> \
           <tr> \
              <td id="header_logo"></td> \
              <td id="header_title">Défis ' + interactifs + 'du Concours Castor</td> \
              <td id="header_button"> \
                <span id="language_select"></span> \
                <!--<input id="button_return_list" type="button" value="Retour à la liste des exercices"></input>--> \
              </td> \
           </tr> \
           </table> \
        </div> \
        \
        <div id="header_sep_top"></div> \
        <div class="layout_table_wrapper"> \
          <div id="task_icons"></div> \
        </div> \
        <div class="layout_table_wrapper"> \
         <iframe id="iframe" src="../demo_files/presentation.html" frameborder="0"></iframe> \
        </div> \
        \
        <div id="header_sep_bottom"></div>  \
        \
        <div id="all_icons"></div>  \
        \
     </div><!--main--> \
     </div><!--main_wrapper--> \
    ';
  };

  //------------------------------


  //------------------------------

    $(document).ready(function() {

       // --- Setting up page elements ---

       $("#body").html(getHtmlContents());
       if (onlyOneGroup) {
         $("#header_title").html(theContents.title);
       }

       $("#header_logo").html('<img id="header_logo_img" src="' + pathToRoot + 'demo_files/img/castor_very_small.png" />');

       $("#button_return_list").click(function() {
           $('#iframe').css('display', "none");
           $('#task_icons').css('display', "block");
        });
       $("#task_icons").css("display", "block");

       // --- Loop over codes ---
       var allLanguages = [];
       for (var iCode = 0; iCode < codes.length; iCode++) {

         var code = codes[iCode];
         var contents = standaloneContents[code];
         if (contents === undefined) {
           console.log("undefined contents for " + code);
           continue; //  silently ignore unavailable resources
         }
         var tasks = contents.tasks;

         // --- Compute versions available for each task ---

         var defaultDifficulties = contents.difficulties;

         var nbInteractive = 0;
         for (var iTask = 0; iTask < tasks.length; iTask++) {
            var task = tasks[iTask];

            if (! task.hasOwnProperty('difficulties')) {
              task.difficulties = defaultDifficulties;
            }
            task.hasStar = [0, 0, 0, 0]; // 4 versions max
            for (var iDifficulty = 0; iDifficulty < task.difficulties.length; iDifficulty++) {
               var diff = task.difficulties[iDifficulty];
               var i = difficultyToInteger(diff);
               if (i >= 0 && i < 4) { // 4 versions max
                 task.hasStar[i] = 1;
               }
            }
            task.isInteractive = (task.hasStar[1] && task.hasStar[2]); // criteria could be refined
            if (task.isInteractive) {
              nbInteractive++;
            }
         }

         // --- Display contents ---

         if (! (showOnlyInteractive && nbInteractive == 0)) {
           if (!onlyOneGroup) {
              $("#task_icons").append('<div class="groupTitle">' + contents.title + '</div>');
           }
           var nbTasksShown = 0;
           for (var iTask = 0; iTask < tasks.length; iTask++) {
              var task = tasks[iTask];
              var idLanguage = -1;
              // save available languages
              for (var iTrans = 0; iTrans < task.translations.length; iTrans++) {
                var language = task.translations[iTrans].language;
                if (language == showLang) {
                  idLanguage = iTrans;
                }
                allLanguages[language] = true;
              }
              // display task if translation is available
              if (idLanguage != -1) {
                var taskdiv = computeTaskDiv(contents, iTask, idLanguage);
                $("#task_icons").append(taskdiv);
                nbTasksShown++;
              }

           }

           if (nbTasksShown == 0) {
             $('#task_icons').children().last().remove();
           }
         }

         // --- Generation of the image with combined icons ---

         if (showGroupIcon) {
           $("#all_icons").css('display', "block");
           $("#all_icons").append("<table>");
           for (var iTask = 0; iTask < tasks.length; iTask++) {
              var task = tasks[iTask];
              if (iTask % 4 == 0) {
                 $("#all_icons").append("<tr>");
              }
              $("#all_icons").append("<td><div class='icon_img'><img src='" + task.code + "/icon.png'></div></td>");
              if (iTask % 4 == 3) {
                 $("#all_icons").append("</tr>");
              }
           }
           $("#all_icons").append("</table>");
         }

      } // end loop on iCode

    // Set the language control
     var sLang = "Select language: ";
     var languages = Object.keys(allLanguages);
     for (var iLang = 0; iLang < languages.length; iLang++) {
       var language = languages[iLang];
       if (language == "he")  // TEMPORARILY HIDE, BECAUSE ONLY 1 TRANSLATION
         continue;
       if (language != showLang) {
        language = "<a href='" + showPage + "?lang=" + language + "'>" + language + "</a>";
       }
       sLang += "&nbsp;&nbsp;" + language;
     }
    $('#language_select').html(sLang);

   }); // end of document onload

}