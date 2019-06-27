import {evaluate} from "./evaluator.js";
import {parse} from "./parser.js";
import {topScope} from "./top.scope.js";

export function run(program) {
  return evaluate(parse(program), Object.create(topScope));
}
