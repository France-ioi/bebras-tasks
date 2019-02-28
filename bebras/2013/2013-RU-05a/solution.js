function getSolutionContent(mode) {
   var easy = "\
   <h2>La solution</h2> \
   <p>Une manière simple de résoudre le sujet consiste à noter, à chaque étape, pour chacun des trois embranchements (en haut au milieu, en bas à gauche, en bas à droite), si l'ailette envoie la bille vers la gauche ou vers la droite.</p> \
   <style> \
   .soltable { \
      border-collapse: collapse; \
   } \
   .soltable td { \
      border: 1px solid black; \
      padding: 0.5em; \
   } \
   .solstate { \
      text-align: center; \
   } \
   </style> \
   <table class='soltable'> \
   <tr> \
      <td></td> \
      <td>Embranchement<br/>en haut au milieu</td> \
      <td>Embranchement<br/>en bas à gauche</td> \
      <td>Embranchement<br/>en bas à droite</td> \
   </tr> \
   <tr> \
      <td>Tout au début, avant<br/> le passage des billes</td> \
      <td class='solstate'>gauche</td> \
      <td class='solstate'>gauche</td> \
      <td class='solstate'>gauche</td> \
   </tr> \
   <tr> \
      <td>Après le passage de la<br/> 1<sup>ère</sup> bille, qui tombe en A</td> \
      <td class='solstate'>droite</td> \
      <td class='solstate'>droite</td> \
      <td class='solstate'>gauche</td> \
   </tr> \
   <tr> \
      <td>Après le passage de la<br/> 2<sup>e</sup> bille, qui tombe en C</td> \
      <td class='solstate'>gauche</td> \
      <td class='solstate'>droite</td> \
      <td class='solstate'>droite</td> \
   </tr> \
   <tr> \
      <td>Après le passage de la<br/> 3<sup>e</sup> bille, qui tombe en B</td> \
      <td class='solstate'>droite</td> \
      <td class='solstate'>gauche</td> \
      <td class='solstate'>droite</td> \
   </tr> \
   </table> \
   <p>La bonne réponse est donc <b>B</b>.</p> \
   ";
   var hard = "\
   <h2>La solution</h2> \
   <p>On peut commencer par observer qu'un embranchement revient dans sa position initiale dès qu'il est traversé par deux billes. Si l'on fait tomber 4 billes dans l'embranchement du haut, deux billes partent vers la gauche, et deux vers la droite. Ainsi, tous les embranchements du bas se retrouve dans sa position initiale. </p> \
   <p>Plus généralement, après avoir fait tomber 8 billes, 12 billes, 16 billes, ou bien n'importe quel nombre de billes multiple de 4, l'état du jeu revient dans le même état que dans la situation de départ. </p> \
   <p>En particulier, après la chûte de la 100<sup>e</sup> bille, on se retrouve exactement dans la même situation qu'au tout début. Du coup, pour déterminer où va tomber la 103<sup>e</sup> bille, il suffit de  déterminer où va tomber la 3<sup>e</sup> bille. Lorsqu'on a que 3 billes, la première tombe en A, la seconde en C, et la troisième en B. </p><p>La bonne réponse est donc <b>B</b>.</p> \
   ";
   var info = "\
   <h2>C'est de l'informatique </h2> \
   <p>Les embranchements de ce jeu ont chacun deux états possibles&nbsp;: soit orienté à gauche, soit orienté à droite. Le fait d'envoyer une bille modifie l'état de l'embranchement.</p><p>Ces embranchements ressemblent ainsi à ce que l'on appelle des «&nbsp;bascules&nbsp;» («&nbsp;flip-flop&nbsp;» en anglais), qui sont des composants fondamentaux des circuits électroniques. Les bascules permettent de stocker de l'information en maintenant leur état électrique dans une des deux positions stables du circuit. En envoyant un signal électrique à la bascule, on peut la faire passer d'un état à l'autre état. </p><p>Lorsqu'un circuit est capable de stocker une unique information binaire telle que «&nbsp;gauche ou droite&nbsp;» ou «&nbsp;un ou zéro&nbsp;», on dit que ce circuit permet de stocker 1 «&nbsp;bit&nbsp;». Si l'on dispose de 8 bascules permettant chacune de stocker 1 bit, on peut stocker 8 bits, soit 1 «&nbsp;octet&nbsp;». Pour stocker un fichier de 1 méga-octet, comme par exemple une petite photo, il faut 1 million d'octets, ce qui représente 8 millions de bits&nbsp;!</p> \
   ";

   return ((mode == 'easy') ? easy : hard) + info;
}
