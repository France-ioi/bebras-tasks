<?php
/*
   Usage: php contents_generator.php
   Input:
     Reads the files `contents.sh` in subfolders corresponding to a year.
     Obtain information on the `index_foo.html` to know what translations are available.
     Read the <h1> tag in those files to recover a title for each task,
     except for french tasks, we use the title stored in 'contents.js'.
     These files contains lists of tasks, and information about available levels.
   Output:
     Produces a file `contents.sh`, with description of all available tasks
     in all languages. The format is the same as in a `contents.sh` file, except
     with one additional field for translations, e.g.:

      tasks: [
        { code: "2016-FR-03-balanced-trees",
          title: "Chemins de Castor",
          translations: [
            { language: "fr",
              file: "index.html",
              title: "Chemins de Castor" }, // same as title above
            { language: "en",
              file: "index_en.html",
              title: "Circles and Arrows" }, // obtained from <h1> tag
            { language: "fi",
              file: "index_fi.html",
              title: "Ympyrät ja nuolet" }, // obtained from <h1> tag
          ]
        }

   Interest:
     The file `contents.sh` is loaded by `index.html` to display the list of all tasks.
     The processing of this file is performed by `demo_files/standalone-1.0.js`.

   For convenience, the generated file `contents.sh` is commited into the repo.

   Note: the files 'contents_en.js' are deprecated, they could be removed.
*/

// Select list of available years
$years = glob('????');

// Contents of output file
$sOutput = '';
/*
$sContentsObject = '{"code": "castor_2016"}';
  $jsonContents = json_decode($sContentsObject);
  print_r($jsonContents);   exit;
*/


$matches = array(); // for matching

// Loop through the array of files
$pwd = getcwd();

foreach($years as $year) {
  // for debug: if ($year != 2015) continue;
  echo "Processing $year.\n";
  $filename = $year.'/contents.js';
  chdir($pwd);
  if (! file_exists($filename)) {
    echo "File $filename is missing.";
    continue;
  }
  $sContents = file_get_contents($filename);


  preg_match('/standaloneAddContents\((.*)\);/ms',$sContents, $matches, PREG_OFFSET_CAPTURE);
  $sContentsOriginal = $matches[1][0];
  // replace e.g. [code:] with ["code":]
  $sContentsFormatted = preg_replace('/ ([a-z]*):/', ' "\1":', $sContentsOriginal);
  //echo $sContentsFormatted;
  //echo "==";

  $descr = json_decode($sContentsFormatted);
  //print_r($descr);
  if ($descr == NULL) {
    echo "Error: could not parse json for $year/contents.js\n";
    continue;
  }
  // echo "Processing ".count($descr->tasks)." tasks in $year\n";
  foreach ($descr->tasks as $task) {
    $path = $descr->folder . $task->code;
    // echo("chdir:".$pwd."/".$path."\n");
    chdir($pwd."/".$path);
    $indexes = glob("index_??.html");
    $translations = array(); // filled below
    $translations[] = array(
      "language" => "fr",
      "file" => "index.html",
      "title" => $task->title);
    foreach ($indexes as $i => $index) {
      if ($year == "2018" && $index == "index_en.html") {
        $index == "index_en2.html"; // patch for 2018, file named index_en2.html
      }
      $language = str_replace(".html", "", str_replace("index_","",$index));
      echo "Processing $path/$index for language $language\n";
      $sTask = file_get_contents($index);
      preg_match('#<h1>(.*)</h1>#',$sTask, $matches, PREG_OFFSET_CAPTURE);
      if (isset($matches[1][0])) {
        $title = $matches[1][0];
      } else {
        echo "Warning: could not obtain title for $path/$index\n";
        $title = $task->code;
      }
      echo "Title extracted: $title\n";
      $translations[] = array(
        "language" => $language,
        "file" => $index,
        "title" => $title);
    }
    $task->translations = $translations;
  }

  $json = json_encode($descr, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  $sOutput .= "standaloneAddContents($json);\n";
}

chdir($pwd);
file_put_contents('contents.js', $sOutput);
//echo $sOutput;
echo "Generated contents.js\n"

?>
