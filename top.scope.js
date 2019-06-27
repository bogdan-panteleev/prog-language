export const topScope = Object.create(null);

topScope.true = true;
topScope.false = false;

export const operators = ["+", "-", "*", "/", "==", "<", ">", '||', '&&'];

for (let op of operators) {
  topScope[op] = Function("a, b", `return a ${op} b`);
}

topScope.print = value => {
  console.log(value);
  return value;
};

topScope.array = (...args) => args;

topScope.length = (arr) => {
  if(!('length' in arr)) {
    throw new Error ('Propery length is not accessible');
  }
  return arr.length;
};

topScope.element = (arr, n) => {
  if(n in arr){
    return arr[n];
  }
  throw new Error('Out of array size');
};
