<?php

function eval_2012_FR_01($answer, $minScore, $maxScore) {
   $walls = array(
      array(0, 0, 0, 0),
      array(0, 1, 1, 1),
      array(0, 0, 0, 0),
      array(1, 0, 1, 1),
      array(0, 0, 0, 0));

   $sequences = explode(",", strtoupper($answer));

   if (strlen($sequences[0]) != strlen($sequences[1])) {
      return $minScore;
   }
   $rows = array(0, 4);
   $cols = array(3, 3);
   $nbSteps = strlen($sequences[0]);
   for ($step = 0; $step < $nbSteps; $step++) {
      for ($animal = 0; $animal < 2; $animal++) {
         switch ($sequences[$animal][$step]) {
            case "N":
               $rows[$animal]--;
               break;
            case "S":
               $rows[$animal]++;
               break;
            case "O":
               $cols[$animal]--;
               break;
            case "E":
               $cols[$animal]++;
         }
         if (($cols[$animal] < 0) || ($cols[$animal] > 3) || ($rows[$animal] < 0) || ($rows[$animal] > 4)) {
            return $minScore;
         }
         if ($walls[$rows[$animal]][$cols[$animal]]) {
            return $minScore;
         }
      }
      if (($rows[0] == $rows[1]) && ($cols[0] == $cols[1])) {
         return $minScore;
      }
   }
   if (($rows[0] != 4) || ($rows[1] != 0) || ($cols[0] != 3) || ($cols[1] != 3)) {
      return $minScore;
   }
   return $maxScore;
}
/* Tests :
echo eval_2012_FR_01("OOOSSEEEOOSSEE,OOOEOENNONNEEE", 0, 9)." (ok)<br/>";
echo eval_2012_FR_01("OOOSSEEEOOSSEE,OOEOOENNONNEEE", 0, 9)." (ok)<br/>";
echo eval_2012_FR_01("OOOSSEEEOOSSEE,OONSOENNONNEEE", 0, 9)." (ok)<br/>";
echo eval_2012_FR_01("OEOOOSSEEEOOSSEE,OEOONSOENNONNEEE", 0, 9)." (ok)<br/>";
echo eval_2012_FR_01("OOOSSEEEOOSSEE,OOOEOENNONNEEEOE", 0, 9)." (different length)<br/>";
echo eval_2012_FR_01("OOOSSEEEOOSSEE,OOOEOENNONNEEO", 0, 9)." (bad destination)<br/>";
echo eval_2012_FR_01("OOOSSEEEOOSSEN,OOOEOENNONNEEE", 0, 9)." (run into wall)<br/>";
echo eval_2012_FR_01("SSSNSS,ONNNNE", 0, 9)." (run into walls)<br/>";
*/

?>