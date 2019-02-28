<?php

function eval_2011_FR_07($answer, $minScore, $maxScore) {
   $pos = strpos($answer, "$");
   if ($pos === FALSE) {
      return 0;
   }
   $score = substr($answer, 0, $pos);
   return intval($score);
}

?>