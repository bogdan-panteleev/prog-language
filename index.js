import {compile} from "./compiler.js";
import {run} from "./engine.js";


const program = `
  do(
      define(sum, 0),
      define(counter, 1),
      while(<(counter, 11), 
        do(
          set(sum, +(sum, counter)),
          set(counter, +(counter, 1))
        )  
      ),
      print(sum)
    )
`;
console.log(compile(program));

// console.log(getCompiled(`
// do(
//    define(x, /(+(4,2), /(6,3))),
//    define(y, +(x,5)),
//    set(y, 100),
//    define(setx, fun(val, set(x, val)))
//    )
// `));


// run(`
// do(define(x, 4),
//    define(setx, fun(val, set(x, val))),
//    setx(50),
//    print(x))
// `);
