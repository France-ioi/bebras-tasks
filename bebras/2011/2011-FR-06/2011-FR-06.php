<?php

function eval_2011_FR_06($answer, $minScore, $maxScore) {
   $validAnswers = array(
      "GGHHHGGGH",
      "GGHHGHGGH",
      "GGHGHHGGH",
      "GGHHHGGHG",
      "GGHHGHGHG",
      "GGHGHHGHG");
   if (in_array(trim(strtoupper($answer)), $validAnswers)) {
      return $maxScore;
   } else {
      return $minScore;
   }
}

?>