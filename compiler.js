import {specialForms} from "./special.forms.js";
import {operators, topScope} from "./top.scope.js";
import {parse} from "./parser.js";

export function compile(program) {
  return compileExpression(parse(program));
}

function compileExpression(ast) {
  if(ast.type === 'apply') {
    return compileApply(ast);
  }
  if(ast.type === 'value') {
    return ast.value;
  }
  if(ast.type === 'word') {
    return ast.name;
  }
  throw new Error('Not known type');
}

function compileApply(ast) {
  if(ast.operator.name in specialForms) {
    return compileSpecialForm(ast);
  }
  if(operators.includes(ast.operator.name)){
    return compileOperator(ast);
  }
  return compileFunctionCall(ast);
  // throw new Error('Unexpected Apply');
}

function compileOperator(ast) {
  return `(${compileExpression(ast.args[0])} ${ast.operator.name} ${compileExpression(ast.args[1])})`
}

function compileSpecialForm(ast) {
  return specialFormCompileMatcher[ast.operator.name](ast);
}

function compileFunctionCall(ast) {
  if(ast.operator.name in topScope) {
    return topScopeCompileMatcher[ast.operator.name](ast);
  }
  return `${ast.operator.name}(${ast.args.map((arg) => compileExpression(arg))})`;
}

const specialFormCompileMatcher = {
  do: function compileDo(ast) {
    const arr =  ast.args.map((arg) => `${compileExpression(arg)};`);
    return arr.join('\n');
  },
  define: function compileDefine(ast) {
    return `var ${ast.args[0].name} = ${compileExpression(ast.args[1])}`
  },
  set: function compileSet(ast) {
    return `${ast.args[0].name} = ${compileExpression(ast.args[1])}`
  },
  fun: function compileFunction(ast) {
    const functionParams = ast.args.slice(0, -1).map((arg) => compileExpression(arg));
    let functionBody;
    functionBody = compileExpression(ast.args[ast.args.length - 1]).split('\n');
    if(ast.args[ast.args.length - 1].operator.name === 'do'){
      functionBody[functionBody.length - 1] = `return ${functionBody[functionBody.length - 1]}`;
      functionBody = functionBody.join('\n');
    } else {
      functionBody = `return ${functionBody.join('\n')}`;
    }
    return`function (${functionParams.join(', ')}) {
      ${functionBody}
  }`
  },
  if: function compileIf(ast) {
    return `${compileExpression(ast.args[0])} ? ${compileExpression(ast.args[1])} : ${compileExpression(ast.args[2])}`;
  },
  while: function compileWhile(ast) {
    return `while(${compileExpression(ast.args[0])}){\n` + compileExpression(ast.args[1]) + `\n}`
  }
};

const topScopeCompileMatcher = {
  print: function compilePrint(ast) {
    const input = ast.args[0].type === 'value' && typeof ast.args[0].value === 'string' ?
      `"${compileExpression(ast.args[0])}"` : `${compileExpression(ast.args[0])}`;
    return `console.log(${input})`;
  },
  array: function compileArray(ast) {
    return `[${ast.args.map((arg) => compileExpression(arg))}]`;
  },
  element: function compileElement(ast) {
    return `${ast.args[0].name}[${compileExpression(ast.args[1])}]`;
  },
  length: function compileLength(ast) {
    return `${ast.args[0].name}.length`;
  }
};
