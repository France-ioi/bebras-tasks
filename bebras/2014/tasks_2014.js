
var nbLevels = 5;
var tasks = [
   { code: "2014-CH-05-abacus",
     title: "Boulier (a)",
     options: {difficulty: "easy"},
     levels: [11,0,0,0,1]
   },
   { code: "2014-CH-05-abacus",
     title: "Boulier (b)",
     options: {difficulty: "hard"},
     levels: [0,11,11,11,1]
   },
   { code: "2014-FR-20-shell",
     title: "Terminal (a)",
     options: {difficulty: "easy"},
     levels: [53,53,0,0,1]
   },
   { code: "2014-FR-20-shell",
     title: "Terminal (b)",
     options: {difficulty: "hard"},
     levels: [0,0,84,84,1]
   },
   { code: "2014-FR-03-monster",
     title: "Attraper le monstre",
     options: null,
     levels: [40,40,40,40,1]
   },
   { code: "2014-FR-06-bridge",
     title: "Traverser le pont (a)",
     options: {difficulty: "easy"},
     levels: [32,32,0,0,1]
   },
   { code: "2014-FR-06-bridge",
     title: "Traverser le pont (b)",
     options: {difficulty: "hard"},
     levels: [0,0,32,32,1]
   },
   { code: "2014-FR-08-maze",
     title: "Deux billes",
     options: {difficulty: "hard"},
     levels: [44,44,44,44,1],
     initSolution: true
   },
   { code: "2014-FR-04-gattaca",
     title: "Le défi",
     options: {difficulty: "hard"},
     levels: [90,90,90,90,1]
   },
   { code: "2014-FR-05-laser",
     title: "Laser",
     options: null,
     levels: [31,31,31,31,1]
   },
   { code: "2014-SI-02-alien-language",
     title: "Langage alien",
     options: null,
     levels: [30,30,12,12,1]
   },
   { code: "2014-FR-19-summed-row",
     title: "Position secrète (a)",
     options: {difficulty: "easy"},
     levels: [13,13,0,0,1]
   },
   { code: "2014-FR-19-summed-row",
     title: "Position secrète (b)",
     options: {difficulty: "hard"},
     levels: [0,0,81,81,1]
   },
   { code: "2014-TW-05-summed-area",
     title: "Carte secrète",
     options: null,
     levels: [0,0,0,91,1]
   },
   { code: "2014-AU-02-pancake-flipping",
     title: "Retourner les crêpes (a)",
     options: {difficulty: "easy"},
     levels: [89,0,0,0,1]
   },
   { code: "2014-AU-02-pancake-flipping",
     title: "Retourner les crêpes (b)",
     options: {difficulty: "hard"},
     levels: [0,89,89,89,1]
   },
   { code: "2014-AU-02-pancake-flipping",
     title: "Davantage de crêpes",
     options: {difficulty: "many"},
     levels: [93,93,93,93,1]
   },
   { code: "2014-NL-01-secret-number",
     title: "Retenir un code",
     options: {difficulty: "easy"},
     levels: [52,52,45,45,1]
   },
   { code: "2014-SI-04-unknown-friendship",
     title: "Les amis (a)",
     options: {difficulty: "easy"},
     levels: [12,12,0,0,1]
   },
   { code: "2014-SI-04-unknown-friendship",
     title: "Les amis (b)",
     options: {difficulty: "hard"},
     levels: [0,0,32,32,1]
   },
   { code: "2014-RU-04-carrot-storehouses",
     title: "Pièces d'or",
     options: null,
     levels: [87,87,87,87,1]
   },
   { code: "2014-CA-02-shout-your-name",
     title: "Discours familiaux",
     options: null,
     levels: [0,0,70,70,1],
     initSolution: true
   },
   { code: "2014-SK-01-sticker",
     title: "Autocollants",
     options: null,
     levels: [10,10,0,0,1]
   },
   { code: "2014-SE-04-height-game",
     title: "Parapente (a)",
     options: {difficulty: "easy"},
     levels: [51,51,0,0,1]
   },
   { code: "2014-SE-04-height-game",
     title: "Parapente (b)",
     options: {difficulty: "hard"},
     levels: [0,0,88,88,1]
   },
   { code: "2014-SP-02-traffic",
     title: "Grande réunion",
     options: null,
     levels: [81,81,71,71,1]
   },
   { code: "2014-CH-07-rectangles",
     title: "Dessin interactif",
     options: {difficulty: "hard"},
     levels: [84,84,46,46,1],
     initSolution: true
   }
   ];
   /* -- deprecated --
   { code: "2014-FR-03-monster",
     title: "Attraper le monstre (dbg)",
     options: {difficulty: "debug"},
     levels: [0,0,0,0,1]
   },
   { code: "2014-FR-04-gattaca",
     title: "Le défi (a)",
     options: {difficulty: "easy"},
     levels: [0,0,0,0,1]
   },
   { code: "2014-FR-04-gattaca",
     title: "Le défi (dbg)",
     options: {difficulty: "debug"},
     levels: [0,0,0,0,1]
   },

   { code: "2014-FR-08-maze",
     title: "Labyrinthe (a)",
     options: {difficulty: "easy"},
     levels: [44,0,0,0,1],
     initSolution: true
   },

   { code: "2014-CH-07-rectangles",
     title: "Dessin interactif (a)",
     options: {difficulty: "easy"},
     levels: [80,53,0,0,1],
     initSolution: true
   },
   { code: "2014-NL-01-secret-number",
     title: "Retenir un code (b)",
     options: {difficulty: "hard"},
     levels: [0,0,0,0,0]
   },

   { code: "2014-CH-07-rectangles",
     title: "Dessin interactif (c)",
     options: {difficulty: "harder"},
     levels: [0,0,50,0,1],
     initSolution: true
   }
   { code: "2014-SK-01-sticker-b",
     title: "Autocollants (dur)",
     options: null,
     levels: [0,0,0,0,1],
     dev: true
   },
   { code: "2014-JP-04-conveyor-sushi",
     title: "Dégustation de sushis",
     options: null,
     levels: [1,1,1,1,1],
     dev: true
   },
   { code: "2014-BE-17-beaver-007",
     title: "Castor 007",
     options: null,
     levels: [1,1,1,1,1],
     dev: true
   },
   */

var use_trunk = false;

var getLinkTask = function(code, options) {
   var sOptions = '';
   if (options != null) {
      var arg = "{";
      for (var key in options) {
         if (arg.length > 1)
            arg += ",";
         var value = options[key];
         arg += "\"" + String(key) + "\":\"" + String(value) + "\"";
      }
      arg += "}";
      sOptions = "?options=" + encodeURIComponent(arg); 
   }
   var base = (use_trunk) ? "2014_trunk/" : "";
   return base + code + "/index.html" + sOptions;
};

var extractShortCode = function(code) {
   return (code.match(/2014-([^\\-]*-[^\\-]*).*/))[1];
};
