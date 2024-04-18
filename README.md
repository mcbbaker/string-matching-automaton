# string-matching-automaton
**_(A Personal Project)_**
## Background
Given a pattern P, text T, and alphabet $\Sigma$, a string matching automaton is used to find every occurrence of the pattern within the text. The string matching automaton consists of |P|+1 states. The last state is known as the "final state", *F*. Once the automaton is built, the text can be run through with a simple algorithm (omitted). Each time the final state is reached, the pattern has just been read and the starting position of the pattern within the text can be determined. 

## Transitions
For each state i, i $\neq$ *F*, there is a forward transition on the i-th character of the pattern to the next state. Each state also has backwards transitions on the other characters in $\Sigma$ to a previous state. This previous state is determined by the pattern and a maximal overlap calculation. 

## Purpose
This project simply builds a visual representation of the string matching automaton given the pattern.  

## Examples
Note that a larger $\Sigma$ creates a more complex automaton due to a greater number of transitions. Therefore, only examples with $\Sigma$=2 are shown.

***Example 1***
![automaton2](https://user-images.githubusercontent.com/118228251/219541046-9742ab4d-9aec-42ef-9382-89123237d2a2.png)

***Example 2***
![automaton1](https://user-images.githubusercontent.com/118228251/219541009-095e98b8-a54d-4a03-8c6b-8db8649e43f8.png)
