//TODO: Check for the switching last two
let inputStr = 'p,q,r, ((p -> r) v (q -> r)) -> ((p v q) -> r)'; 

let input = inputStr.trim().split(',');

// P, Q = 2
//let numVar = inputTwo.length - 1;
let numVar = input.length - 1;

// P, Q and R are stored as arrays - given their truth tables
// Filling the variable list with empty arrays
let varList = {};

// Final truth table to be formatted
let solutions = {};
for(let i = 0; i < numVar; i++) {
    Object.assign(varList, {[input[i]]: []});
    Object.assign(solutions, {[input[i]]: []});
}
/** FF, FT, TF, TT **/
// Filling the Variables' truth tables using binary
//for(let row = 0; row < 2 ** numVar; row++) {
//    let bin = (row.toString(2)).padStart(numVar, '0');
//    
//    for(let col = 0; col < numVar; col++) {
//        (varList[input[col]]).push(Number(bin[col]));
//        (solutions[input[col]]).push(Number(bin[col]));
//    }
//}

/** TT, TF, FT, FF **/
// Filling the Variables' truth tables using binary
for(let row = 2 ** numVar - 1; row >= 0; row--) {
    let bin = (row.toString(2)).padStart(numVar, '0');
    
    for(let col = 0; col < numVar; col++) {
        (varList[input[col]]).push(Number(bin[col]));
        (solutions[input[col]]).push(Number(bin[col]));
    }
}

let currRow = 0;


function recursFunc(expression) {
    let returnValue = _recursFunc(expression);
    //console.log(`Return value for expression ${expression} is ${returnValue}`);
    return returnValue == true ? 1 : 0;
}

// Convert (PvQ) -> (~Q) into return (return (PvQ) -> return (~Q))
// Need to have (PvQ), (~Q) and -> 
// Assume the input is of type (blabla) operation (blabla)
function _recursFunc(expression) {
    let twoParentheses = /[,]*\s*([~]*)\(([^"]+)\)\s*(<->|v|∨|\^|∧|->|<-|xor){1}\s*([~]*)\(([^"]+)\)\s*/g.exec(expression);  // Separates it into [...,(),operator,(),...]
    let oneParenthesisLeft = /[,]*\s*([~]*)\(([^"]+)\)\s*(<->|v|∨|\^|∧|->|<-|xor){1}\s*([~]*)(\w){1}(?!\))/g.exec(expression);  // Separates it into [...,express,operator,(),...]
    let oneParenthesisRight = /[,]*\s*(?<!\()([~]*)(\w){1}\s*(<->|v|∨|\^|∧|->|<-|xor){1}\s*([~]*)\(([^"]+)\)/g.exec(expression);  // Separates it into [...,(),operator,express,...]
    let noParenthesis = /[,]*(?<!\()([~]*)(\w){1}\s*(<->|v|∨|\^|∧|->|<-|xor){1}\s*([~]*)(\w){1}(?!\))/g.exec(expression);    // Separates it into [...,express,operator,express,...]
    let rightNegatedExpress = /[,]*\s*\(*([\w\s~]+)\)*\s*(<->|v|∨|\^|∧|->|<-|xor){1}[\s]*([~]+)\(([^)]+)\)$/g.exec(expression); // Separates it into [express, operator, ~+, express,...]
    let leftNegatedExpress = /([~]+)\(([^)]+)\)\s*(<->|v|∨|\^|∧|->|<-|xor){1}[\s]*\(*([\w\s~]*)\)*$/g.exec(expression); // Separates it into [~+, express, operator, express,...]
    let bothNegatedExpress = /([~]+)\(([^)]+)\)\s*(<->|v|∨|\^|∧|->|<-|xor){1}[\s]*([~]+)\(([^)]*)\)$/g.exec(expression); // Separates it into [~+, express, operator, ~+, express,...]
    let singleNegatedExpress = /([~]+)\(([^)]+)\)/g.exec(expression);

    //let negatedExpress = /([~]+)\(([^)]+)\)$/g.exec(expression);
    
    // Trim it if it has spaces
    twoParentheses = (twoParentheses != null) ? twoParentheses.map((curr) => {return (typeof curr == 'string') ? curr.trim() : curr}) : twoParentheses;
    oneParenthesisLeft = (oneParenthesisLeft != null) ? oneParenthesisLeft.map((curr) => {return (typeof curr == 'string') ? curr.trim() : curr}) :  oneParenthesisLeft;
    oneParenthesisRight = (oneParenthesisRight != null) ? oneParenthesisRight.map((curr) => {return (typeof curr == 'string') ? curr.trim() : curr}) : oneParenthesisRight;
    noParenthesis = (noParenthesis != null) ? noParenthesis.map((curr) => {return (typeof curr == 'string') ? curr.trim() : curr}) : noParenthesis;
    rightNegatedExpress = (rightNegatedExpress != null) ? rightNegatedExpress.map((curr) => {return (typeof curr == 'string') ? curr.trim() : curr}) : rightNegatedExpress;
    leftNegatedExpress = (leftNegatedExpress != null) ? leftNegatedExpress.map((curr) => {return (typeof curr == 'string') ? curr.trim() : curr}) :  leftNegatedExpress;
    bothNegatedExpress = (bothNegatedExpress != null) ? bothNegatedExpress.map((curr) => {return (typeof curr == 'string') ? curr.trim() : curr}) : bothNegatedExpress;
    let left;
    let operator;
    let right;
    
    // Handle negatives by returning their opposite if the expression is negative
    // Both sides are negated means we'd like to eval both sides [as parentheses because negation means parentheses].
    if(bothNegatedExpress != undefined) {
        console.table(['Both negated', bothNegatedExpress]);
        left = bothNegatedExpress[2];
        operator = bothNegatedExpress[3];
        right = bothNegatedExpress[5];
        let negatedRight = !recursFunc(right) == true ? 1 : 0;
        let negatedLeft = !recursFunc(left) == true ? 1 : 0;
        
        solutions[`${bothNegatedExpress[1]}(${left})`] = solutions[`${bothNegatedExpress[1]}(${left})`] || [];
        solutions[`${bothNegatedExpress[4]}(${right})`] = solutions[`${bothNegatedExpress[4]}(${right})`] || [];
        // Make sure it's not running several times [Whenever something's negated it runs once for the outside and once for the inside, 'cause it's recursion]
        (solutions[`${bothNegatedExpress[1]}(${left})`].length == currRow) ? solutions[`${bothNegatedExpress[1]}(${left})`].push(negatedLeft) : solutions[`${bothNegatedExpress[1]}(${left})`];
        (solutions[`${bothNegatedExpress[4]}(${right})`].length == currRow) ? solutions[`${bothNegatedExpress[4]}(${right})`].push(negatedRight) : solutions[`${bothNegatedExpress[4]}(${right})`];
        //Object.assign(solutions, {[`${bothNegatedExpress[1]}(${left})`]: negatedRight});
        //Object.assign(solutions, {[`${bothNegatedExpress[4]}(${right})`]: negatedRight});
        return evalExpression(!recursFunc(left) == true ? 1 : 0, !recursFunc(right) == true ? 1 : 0, operator, currRow, [`~(${left})`, operator, `~(${right})`]); 


        // Past attempts at solving this vvvv 
        //expression = (negatedExpress[1].length % 2 == 0) ? negatedExpress[2] : !negatedExpress[2];
        //return (negatedExpress[1].length % 2 == 0) ? recursFunc(negatedExpress[2]) : !recursFunc(negatedExpress[2]);
    }
    else if(leftNegatedExpress != undefined) {
        console.table(['Negated Left', leftNegatedExpress]);
        left = leftNegatedExpress[2];
        operator = leftNegatedExpress[3];
        right = leftNegatedExpress[4];
        let negatedLeft = !recursFunc(left) == true ? 1 : 0;
        solutions[`${leftNegatedExpress[1]}(${left})`] = solutions[`${leftNegatedExpress[1]}(${left})`] || [];
        solutions[`${leftNegatedExpress[1]}(${left})`].push(negatedLeft);
        //Object.assign(solutions, {[`${leftNegatedExpress[1]}(${left})`]: negatedLeft});
        let returnedValue = evalExpression(!recursFunc(left) == true ? 1 : 0, recursFunc(right), operator, currRow, [`~(${left})`, operator, right]); 
        return returnedValue;
    }
    else if(rightNegatedExpress != undefined) {
        console.table(['Negated Right', rightNegatedExpress]);
        left = rightNegatedExpress[1];
        operator = rightNegatedExpress[2];
        right = rightNegatedExpress[4];
        let negatedRight = !recursFunc(right) == true ? 1 : 0;
        //Object.assign(solutions, {[`${rightNegatedExpress[3]}(${right})`]: negatedRight});
        solutions[`${rightNegatedExpress[3]}(${right})`] = solutions[`${rightNegatedExpress[3]}(${right})`] || [];
        solutions[`${rightNegatedExpress[3]}(${right})`].push(negatedRight);
        let returnedValue = evalExpression(recursFunc(left), !recursFunc(right) == true ? 1 : 0, operator, currRow, [`(${left})`, operator, `~(${right})`]); 
        return returnedValue;
    }
   
    // If it's not negative - check what form it is and act accordingly [for eval]
    if(twoParentheses != null) {
      console.table(['Two', twoParentheses] || 'Not both');
      // Set default values 
      left = twoParentheses[2];
      operator = twoParentheses[3];
      right = twoParentheses[5];
      // If it's not undefined - it means it contains ~ 
      if(twoParentheses[1] != undefined || twoParentheses[4] != undefined) {
        // Check how many ~ there are
        if((twoParentheses[1] || '').length % 2 == 1) {
            left = (varList[left] == undefined) ? !left : !varList[left][currRow]; 
        }
        if((twoParentheses[4] || '').length % 2 == 1) {
            right = (varList[right] == undefined) ? !right : !varList[right][currRow]; 
        }
      }
      return evalExpression(recursFunc(left), recursFunc(right), operator, currRow, [`(${left})`, operator, `(${right})`]);
    }
    else if(oneParenthesisLeft != null) {
      console.table(['Left', oneParenthesisLeft] || 'Not left');
      // Set default values 
      left = oneParenthesisLeft[2];
      operator = oneParenthesisLeft[3];
      right = oneParenthesisLeft[5];
      // If it's not undefined - it means it contains ~ 
      if(oneParenthesisLeft[1] != undefined || oneParenthesisLeft[4] != undefined) {
        // Check how many ~ there are
        if((oneParenthesisLeft[1] || '').length % 2 == 1) {
            left = (varList[left] == undefined) ? !left : !varList[left][currRow]; 
        }
        if((oneParenthesisLeft[4] || '').length % 2 == 1) {
            right = (varList[right] == undefined) ? !right : !varList[right][currRow]; 
        }
      }
      return evalExpression(recursFunc(left), right, operator, currRow, [`(${left})`, operator, `(${right})`]);
    }
    else if(oneParenthesisRight != null) {
      console.table(['Right parenthesis', oneParenthesisRight] || 'Not right');
      // Set default values 
      left = oneParenthesisRight[2];
      operator = oneParenthesisRight[3];
      right = oneParenthesisRight[5];
      // If it's not undefined - it means it contains ~ 
      if(oneParenthesisRight[1] != undefined || oneParenthesisRight[4] != undefined) {
        // Check how many ~ there are
        if((oneParenthesisRight[1] || '').length % 2 == 1) {
            left = (varList[left] == undefined) ? !left : !varList[left][currRow]; 
        }
        if((oneParenthesisRight[4] || '').length % 2 == 1) {
            right = (varList[right] == undefined) ? !right : !varList[right][currRow]; 
        }
      }
      return evalExpression(left, recursFunc(right), operator, currRow, [`(${left})`, operator, `(${right})`]);
    }
    else if(noParenthesis != null) {
      console.table(['None', noParenthesis] || 'Has parenth');
      // Set default values 
      left = noParenthesis[2];
      operator = noParenthesis[3];
      right = noParenthesis[5];
      // Check how many ~ there are
      if((noParenthesis[1] || '').length % 2 == 1 && (noParenthesis[4] || '').length % 2 == 1) {
          left = (varList[left] == undefined) ? !left : !varList[left][currRow]; 
          right = (varList[right] == undefined) ? !right : !varList[right][currRow]; 
          return evalExpression(recursFunc(left) == true ? 1 : 0, recursFunc(right) == true ? 1 : 0, operator, currRow, [`~${noParenthesis[2]}`, operator, `~${noParenthesis[5]}`]);          
      }
      if((noParenthesis[1] || '').length % 2 == 1) {
          left = (varList[left] == undefined) ? !left : !varList[left][currRow]; 
          return evalExpression(recursFunc(left) == true ? 1 : 0, right, operator, currRow, [`~${noParenthesis[2]}`, operator, `(${right})`]);          
      }
      if((noParenthesis[4] || '').length % 2 == 1) {
          right = (varList[right] == undefined) ? !right : !varList[right][currRow]; 
          return evalExpression(left, recursFunc(right) == true ? 1 : 0, operator, currRow, [`(${left})`, operator, `~${noParenthesis[5]}`]);          
      }
      return evalExpression(left, right, operator, currRow, [left, operator, right]);
    }
    else if(singleNegatedExpress != null) {
       if((singleNegatedExpress[1] || '').length % 2 == 1) {
          return !recursFunc(singleNegatedExpress[2]); 
       }
       return recursFunc(singleNegatedExpress[2]);
    }
    else if(expression == false) {
        return 0;
    }
    else if(expression == true) {
        return 1;
    }
    else {
        console.log(`Expression: ${expression}`);
        if(expression.length == 1) {
            console.table(['Single', `Returning:${varList[expression][currRow]}`, expression]);
            return varList[expression][currRow];
        }
        else {
            console.log('Not sure what happened~');
        }
    }
}

// Used to log the return value for debugging
function evalExpression(left, right, operator, row, expression) {
    const returnValue = _evalExpression(left, right, operator, row);
    // All solutions to the expressions
    //Object.assign(solutions, {[`${expression[0]} ${expression[1]} ${expression[2]}`]: returnValue}); // Took off row for testing
    solutions[`${expression[0]} ${expression[1]} ${expression[2]}`] = solutions[`${expression[0]} ${expression[1]} ${expression[2]}`] || []; // Running twice???
    (solutions[`${expression[0]} ${expression[1]} ${expression[2]}`].length == currRow) ? solutions[`${expression[0]} ${expression[1]} ${expression[2]}`].push(returnValue) : solutions[`${expression[0]} ${expression[1]} ${expression[2]}`];

    console.log(`[EVAL] Return value: ${returnValue}`);
    return returnValue;
}

// Left is a primitive predicate if it exists in varList
function _evalExpression(left, right, operator, row) {
    console.log(`-------Eval Expression-------`);
    console.log(`Expression: ${left} ${operator} ${right}`);
    console.log(`Row: ${row} means left: ${varList[left] == undefined ? left : varList[left][row]} and right: ${varList[right] == undefined ? right : varList[right][row]}`);
    console.log(`Varlist: ${JSON.stringify(varList)}`);
    // console.trace();
    console.log(`-----------End eval----------`);
    
    switch(operator) {
        case 'v' || '∨': 
            return or(left, right, row);
        case '^' || '∧': 
            return and(left, right, row);
        case '->':
            return conditional(left, right, row);
        case '<->':
            return biconditional(left, right, row);
        case 'xor':
            return xor(left, right, row);

        default: console.log(`Invalid operator ${operator}`);
    }

}

function xor(left, right, row) {
    let returnValue = _xor(left,right,row);
    console.log(`Result of XOR operation on ${left}, ${right}, ${row} is ${returnValue}`);
    return returnValue;
}

function _xor(left, right, row) {
    if(!isNaN(left) && !isNaN(right)) {
        return Number(left) != Number(right) ? 1 : 0;
    }
    else if(!isNaN(left)) {
       return Number(left) != varList[right][row] ? 1 : 0;
    }
    else if(!isNaN(right)) {
        return varList[left][row] != Number(right) ? 1 : 0;
    }
    else {
        return varList[left][row] != varList[right][row] ? 1 : 0;
    }
}

function biconditional(left, right, row) {
    let returnValue = _biconditional(left,right,row);
    console.log(`Result of BICONDITIONAL operation on ${left}, ${right}, ${row} is ${returnValue}`);
    return returnValue;
}
function _biconditional(left, right, row) {
    if(!isNaN(left) && !isNaN(right)) {
        return Number(left) == Number(right) ? 1 : 0;
    }
    else if(!isNaN(left)) {
       return Number(left) == varList[right][row] ? 1 : 0;
    }
    else if(!isNaN(right)) {
        return varList[left][row] == Number(right) ? 1 : 0;
    }
    else {
        return varList[left][row] == varList[right][row] ? 1 : 0;
    }
}

function and(left,right,row) {
    let returnValue = _and(left,right,row);
    console.log(`Result of AND operation on ${left}, ${right}, ${row} is ${returnValue}`);
    return returnValue;
}
function _and(left, right, row){
    if(!isNaN(left) && !isNaN(right)) {
        return Number(left) && Number(right);
    }
    else if(!isNaN(left)) {
       return Number(left) && varList[right][row];
    }
    else if(!isNaN(right)) {
        return varList[left][row] && Number(right);
    }
    else {
        console.table([left, right, row, varList[right]]);
        return varList[left][row] && varList[right][row];
    }
}
// Logging function
function or(left,right,row) {
    let returnValue = _or(left,right,row);
    console.log(`Result of OR operation on ${left}, ${right}, ${row} is ${returnValue}`);
    return returnValue;
}
function _or(left, right,row){
    if(!isNaN(left) && !isNaN(right)) {
        return Number(left) || Number(right);
    }
    else if(!isNaN(left)) {
       return Number(left) || varList[right][row];
    }
    else if(!isNaN(right)) {
        return varList[left][row] || Number(right);
    }
    return varList[left][row] || varList[right][row];
}
function conditional(left, right, row) {
    let returnValue = _conditional(left,right,row);
    console.log(`Result of CONDITIONAL operation on ${left}, ${right}, ${row} is ${returnValue}`);
    return returnValue == true ? 1 : 0;
}
function _conditional(left, right, row) {
    if(!isNaN(left) && !isNaN(right)) {
        if(left) {
            return right;
        }
        else {
            return 1;
        }
    }
    else if(!isNaN(left)) {
        if(left) {
            return varList[right][row];
        }
        else {
            return 1;
        }
    }
    else if(!isNaN(right)) {
        if(varList[left][row]) {
            return Number(right);
        }
        else {
            return 1;
        }
    }
    else {
        if(varList[left][row]) {
            return varList[right][row];
        }
        else {
            return 1;
        }
    }
}

varList["result"] = [];

for(let i = 0; i < 2 ** numVar; i++) {
   let result = recursFunc(inputStr);
   varList["result"].push(result);
   currRow++;
}

// Formatting output for Latex
// The final truth table
console.table(varList);
console.table(solutions);

let latexFormat = '';
latexFormat += `\\begin{displaymath}\n    `;
latexFormat += `\\begin{center}\n\t`;
latexFormat += `\\begin{array}{|`;
// Variables
for(let i = 0; i < numVar; i++) {
    if(i == numVar - 1) {
        latexFormat += 'c|';
        break;
    }
    latexFormat += `c `
}
// Expressions evaluated
for(let i = 0; i < Object.keys(solutions).length - numVar; i++) {
    // If it's greater than 3 then you can do |variables|(oneside)|operator|(oneside)
   // if(Object.keys(solutions).length - numVar >= 3) {
   //     if(i == Object.keys(solutions).length - numVar - 2) {
   //         latexFormat += '|c|c|}\n\t\t';
   //         break;
   //     }
   //     if(i == Object.keys(solutions).length - numVar - 3) {
   //         latexFormat += 'c';
   //         continue;
   //     }
   //     latexFormat += `c `;
   // }
   // else {
        if(i == Object.keys(solutions).length - numVar - 1) { 
            latexFormat += '|c|}\n\t\t';
            break;
        }
        if(i == Object.keys(solutions).length - numVar -2) {
            latexFormat += 'c';
            continue;
        }
        latexFormat += `c `;
   // }
}
// Looping through the expressions
console.table(Object.keys(solutions));
for(let i = 0; i < Object.keys(solutions).length; i++) {
   // if(Object.keys(solutions).length - numVar >= 3) { // p,q, p v q, (p v q) ^ p
   //     if(i == Object.keys(solutions).length - 2) {
   //         latexFormat += parse(Object.keys(solutions)[i + 1]).match(/([^)]+)(\\leftrightarrow|\\lor|\\land|\\rightarrow|\\oplus){1}([^)]+)/g)[0] + ' & ';
   //         latexFormat += parse(Object.keys(solutions)[i]) + '\\\\\n\t\\hline\n\t';
   //         break;
   //     }
   // }
   // else {
        console.log('here');
        if(i == Object.keys(solutions).length - 1) {
            latexFormat += parse(Object.keys(solutions)[i]) + '\\\\\n\t\\hline\n\t';
            break;
        }
   // }
    latexFormat += parse(Object.keys(solutions)[i]) + ' & ';
}
// Function to turn the expression into \lor, etc
function parse(input) {
    input = input.replace(/v/g, '\\lor ');
    input = input.replace(/\^/g, '\\land ');
    input = input.replace(/v/g, '\\lor ');
    input = input.replace(/xor/g, '\\oplus ');
    input = input.replace(/~/g, '\\lnot ');
    input = input.replace(/<->/g, '\\leftrightarrow ');
    input = input.replace(/->/g, '\\rightarrow ');
    return input;
}

// Go through through the Truth table
// for(# rows)
// for(# col)
let _;
for(let row = 0; row < Object.values(solutions)[0].length; row++) {
    for(let col = 0; col < Object.keys(solutions).length; col++) {
       _ = Object.values(solutions)[col][row] == '1' ? 'T' : 'F';
       if(col == Object.keys(solutions).length -1) {
           latexFormat += `${_}`;
           break;
       }
       latexFormat += `${_} & `;
        // Switch the last two so that we have a cleaner solution (have the v sign be on is own)
       // if(col == Object.keys(solutions).length - 2) {
       //     _ = Object.values(solutions)[col + 1][row] == '1' ? 'T' : 'F';
       //     latexFormat += `${_} & `
       //     _ = Object.values(solutions)[col][row] == '1' ? 'T' : 'F';
       //     latexFormat += `${_}`;
       //     break;
       // }
    }
    latexFormat += '\\\\\n\t';
}
latexFormat += `\\end{array}\n    `; //4 spaces = half my console tab (8)
latexFormat += `\\end{center}\n`;
latexFormat += `\\end{displaymath}`;
console.log(latexFormat);
//console.log(Object.values(solutions)[Object.values(solutions).length -1]);


//\begin{displaymath}
//        \begin{center}
//        \begin{array}{|c c c|c c c c c|c|}
//                p & q & r & p \rightarrow  r & q \rightarrow  r & (p \rightarrow  r) \lor  (q \rightarrow  r) & p \lor  q & (p \lor  q) \rightarrow  (r) & ((p \rightarrow  r) \lor  (q \rightarrow  r)) \rightarrow  ((p \lor  q) \rightarrow  r)\\
//        \hline
//        T & T & T & T & T & T & T & T & T\\
//        T & T & F & F & F & F & T & F & T\\
//        T & F & T & T & T & T & T & T & T\\
//        T & F & F & F & T & T & T & F & F\\
//        F & T & T & T & T & T & T & T & T\\
//        F & T & F & T & F & T & T & F & F\\
//        F & F & T & T & T & T & F & T & T\\
//        F & F & F & T & T & T & F & T & T\\
//        \end{array}
//        \end{center}
//\end{displaymath}
