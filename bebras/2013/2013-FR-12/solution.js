function solution_load_nodes() {
   return [1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0];
}

function getSolutionHtml() { 
   return " \
      <h2>Solution</h2> \
      <p>Il n'y avait qu'une seule manière de sélectionner 8 invités ne \
        se connaissant pas les uns les autres. Pour trouver cette solution,\
        une bonne manière de commencer consiste à sélectionner d'abord les \
      invités qui ne sont reliés qu'à seulement deux autres invités, \
      car ce sont ceux qui ont le moins de chance de connaître d'autres personnes. \
      </p> \
      <div id='graph_solution' style='width:450px; height:280px; margin:10px; text-align:center'></div> \
      <h2>C'est de l'informatique !</h2> \
      <p> \
      Pour résoudre ce sujet efficacement, il fallait trouver une «&nbsp;heuristique&nbsp;», \
      c'est-à-dire une stratégie permettant de converger plus vite vers la bonne solution. \
      Trouver des bonnes heuristiques demande une certaine créativité, et c'est une faculté \
      qui peut se révéler très utile lorsque l'on conçoit de nouveaux algorithmes. \
      </p> \
      <p> \
      Le problème présenté dans ce sujet est un problème classique en algorithmique. \
      Il se trouve que, dans le cas général, pour des graphes très grands, il n'existe \
      aucun algorithme permettant de trouver rapidement le nombre maximum de ronds \
      que l'on peut sélectionner sans qu'ils ne soient reliés les uns aux autres. \
      Du coup, on est obligé de se contenter d'algorithmes trouvant des solutions \
      approchées, c'est-à-dire en sélectionnant un très grand nombre de ronds, \
      mais sans forcément réussir à sélectionner le nombre maximum de ronds possibles. \
      </p> \
      <p> Il existe en fait un grand nombre de problèmes pour lesquels, comme celui-là, \
      il n'existe pas d'algorithme optimal efficace.</p> \
  "; 
}