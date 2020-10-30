# Truthtable-solver

## How to run it

1. Clone the repo with:
```shell
  $ git clone https://github.com/volovikariel/Truthtable-solver.git
```
2. Install all the dependencies:
```shell
  $ npm install 
```
3. Modify the `script.js` file's first line for the input you want:
```javascript
  let inputStr = '((p -> r) v (q -> r)) -> ((p v q) -> r)';
```
4. Run it:
```shell
  $ node ./script.js
```
5 (Optional). If you want to have your Table properly center in your Latex page, make sure to add
```Latex
\usepackage[margin=1in]{geometry}
```
### Example of me using it
1) Open Latex file
2) Open script.js with a terminal [as wide as possible horizontally so as to not to have lines roll over onto the next line]
3) Edit the inputStr to match the expression you would like to generate a truthtable for
```javascript
  let inputStr = '((p -> r) v (q -> r)) -> ((p v q) -> r)';
```
4) run node ./script.js
5) copy-paste the output into the latex file, compile
```latex
\begin{displaymath}
    \begin{center}
        \begin{array}{|c c c|c c c c c|c|}
                p & q & r & p \rightarrow  r & q \rightarrow  r & (p \rightarrow  r) \lor  (q \rightarrow  r) & p \lor  q & (p \lor  q) \rightarrow  (r) & ((p \rightarrow  r) \lor  (q \rightarrow  r)) \rightarrow  ((p \lor  q) \rightarrow  r)\\
        \hline
        T & T & T & T & T & T & T & T & T\\
        T & T & F & F & F & F & T & F & T\\
        T & F & T & T & T & T & T & T & T\\
        T & F & F & F & T & T & T & F & F\\
        F & T & T & T & T & T & T & T & T\\
        F & T & F & T & F & T & T & F & F\\
        F & F & T & T & T & T & F & T & T\\
        F & F & F & T & T & T & F & T & T\\
        \end{array}
    \end{center}
\end{displaymath}
```
6) Look at the beautiful output

![Picture](https://github.com/volovikariel/Truthtable-solver/blob/master/Truth-table-solver-example-output.png)

### Things to be careful of
~~The inputStr starts with the variables used in the expression comma separated without any spaces between them~~
It now automatically figures out the predicates (someone submitted a pull request)

Parentheses are needed to correctly parse the input.

#### The logical operators supported are: 
- v (or)
- ^ (and)
- -> (conditional)
- <-> (biconditional)
- xor (xor)
- ~ (negation)
