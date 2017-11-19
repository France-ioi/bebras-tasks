import React from 'react';
import EpicComponent from 'epic-component';

export const Task1 = EpicComponent(self => {

  self.render = function () {
    return (
      <div className="taskInstructions">
        <h1>Masque jetable 1</h1>
        <h2>Méthode utilisée pour chiffrer / déchiffrer un message</h2>

        <p>Un message se déchiffre de la manière suivante :</p>

        <ul className="list-unstyled">
          <li>La clé est une suite de nombres de la taille du message (par exemple 2, 1, 5, 12, 4, 9)</li>
          <li>À la première lettre, on ajoute le premier nombre (A + 2 = C)</li>
          <li>À la deuxième lettre, on ajoute le deuxième nombre (Q + 1 = R)</li>
          <li>Et ainsi de suite jusqu’au bout de la ligne.</li>
        </ul>

        <p>Exemple :</p>
        <table className="pre">
          <tbody>
            <tr>
              <td>Message chiffré :</td>
              <td>A</td>
              <td>Q</td>
              <td>T</td>
              <td>Z</td>
              <td>P</td>
              <td>F</td>
            </tr>
            <tr>
              <td>Clé :</td>
              <td>+2</td>
              <td>+1</td>
              <td>+5</td>
              <td>+16</td>
              <td>+4</td>
              <td>+9</td>
            </tr>
            <tr>
              <td>Message déchiffré :</td>
              <td>C </td>
              <td>R </td>
              <td>Y </td>
              <td>P</td>
              <td>T</td>
              <td>O</td>
            </tr>
          </tbody>
        </table>

        <p>Quand elle est utilisée correctement, cette méthode de chiffrement est très sûre car aucune technique de cryptanalyse ne fonctionne. Toutefois si on fait l’erreur d’utiliser la même clé pour plusieurs messages, il devient possible de retrouver le message clair sans avoir la clé. C’est le but de cet exercice !</p>

        <h2>Ce qui vous est donné</h2>

        <p>Dans ce sujet vous avez quatre messages chiffrés par le masque jetable (un sur chaque ligne). Chaque message est le chiffré d’une suite de mots simples, par exemple “CAROTTE VOYAGE MANGER FENETRE”, qui ne forme pas forcément une phrase. La faiblesse à exploiter est que les quatre messages ont été chiffrés avec la même clé.</p>

        <p>De plus, on vous donne un mot que l’on sait être présent dans l’un des quatre messages, mais sans vous dire où il se positionne dans le texte. À vous de le placer à la bonne place puis de trouver le reste de la clé.</p>

        <h2>Ce qui vous est demandé</h2>

        <p>L’objectif est de retrouver la clé, afin de déchiffrer les quatre messages.</p>

        <h2>Indices</h2>

        <p>Vous avez la possibilité de demander en indice la valeur de l’un des nombres de la clé. Pour cela, il suffit de cliquer sur la case correspondante, puis de valider. Chaque indice demandé coûte 20 points.</p>

      </div>
    );
  };
});

export const Task2 = EpicComponent(self => {
  self.render = function () {
    return (
      <div>
        <h1>Masque jetable 2</h1>

        <p>Ce sujet est identique au précédent mais avec une difficulté supplémentaire : on ne vous fournit aucun mot présent dans les messages.</p>
      </div>
    );
  }
});

export default EpicComponent(self => {
  self.render = function () {
    const {task} = self.props;
    if (task.version == 1) {
      return <Task1 task={task}/>;
    }
    return <Task2 task={task}/>;
  }
});
