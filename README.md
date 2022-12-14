# string-matching-automaton
## Background
Given a pattern P, text T, and alphabet $\Sigma$, a string matching automaton is used to find every occurrence of the pattern within the text. The string matching automaton consists of |P|+1 states. The last state is known as the "final state", *F*. Once the automaton is built, the text can be run through with a simple algorithm (omitted). Each time the final state is reached, the pattern has just been read and the starting position of the pattern within the text can be determined. 

## Transitions
For each state i, i $\neq$ *F*, there is a forward transition on the i-th character of the pattern to the next state. Each state also has backwards transitions on the other characters in $\Sigma$ to a previous state. This previous state is determined by the pattern and a maximal overlap calculation. 

## Purpose
This project simply builds a visual representation of the string matching automaton given the pattern.  
