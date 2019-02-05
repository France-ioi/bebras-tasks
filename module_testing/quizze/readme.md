# Questions layouts

By default, the answers to single or multiple choice questions will display vertically, one above the other.
An optionnal layout is available by adding a *class* "horizontal" to the question.

## Dynamic elements
A user can select his answer(s) to a single choice or a multiple choice question by clicking on the appropriate answer. A class "selected" is added to the selected *answer* element.
A user can visualize the solution to the quizz by clicking on the *View solution* button.
The corresponding solution is displayed in each question block, after the listed answers. In addition, a *class* "correct" is added to the *answer* element, alongside the *class* "selected" when appropriate.


## Questions markup
Below is listed the necessary markup 

### Markup for single choice question:
question (optionnal class: horizontal)
-- statement
-- div.answers
---- answer (classes selected and / or correct automatically added with javascript)
------ div.answer-block
-------- span.answer-label
-------- span.answer-code
-- solution

### Markup for multiple choice question:
question (optionnal class: horizontal)
-- statement
-- div.answers
---- answer (classes selected and / or correct automatically added with javascript)
------ div.answer-block
-------- span.answer-label
-------- span.answer-switch
---------- span.cursor
-- solution

### Markup for input type question:
question (optionnal class: horizontal)
-- statement
-- div.answers
---- answer (classes selected and / or correct automatically added with javascript)
------ input
-- solution
