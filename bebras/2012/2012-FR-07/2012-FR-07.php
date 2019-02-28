<?php

function eval_2012_FR_07($answer, $minScore, $maxScore) {
   $walls = array(
      array(0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0 ,0),
      array(0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0 ,0),
      array(0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0 ,0),
      array(0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0 ,0),
      array(0, 0, 1, 1, 0, 2, 1, 1, 1, 1, 1 ,0),
      array(0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0 ,0),
      array(0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0 ,0),
      array(0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0 ,0));

   if (strlen($answer) != 8*12) {
      return 0;
   }
   $errors = 0;
   for ($row = 0; $row < 8; $row++) {
      for ($col = 0; $col < 12; $col++) {
         if ($walls[$row][$col] == 2)
            continue;
         $ans = $answer[$row * 12 + $col];
         if (($ans == "0") && ($walls[$row][$col] != 0)) {
            $errors++;
         } else if (($ans != "0") && ($walls[$row][$col] == 0)) {
            $errors++;
         }
      }
   }
   return max($minScore, $maxScore - $errors);
}

//echo eval_2012_FR_07("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", -4, 12);
//echo eval_2012_FR_07("000050500000000540450000005432345000000501204500005400123450000321034000005430545000000545050000", -4, 12);
?>