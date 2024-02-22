import chalk from "chalk"
import { Bits } from "./bits"


function calcSpace(v: string | number | Bits, space: number) {
  if (typeof v == "number") v = v.toString()
  return " ".repeat(space - v.length) + v
}

type LoggerArgs = {
  op?: string
  reg?: string
  prev?: string | Bits
  computed?: string | Bits
  sym?: string
}

export const initLogger = (byteSize: number) => ({ op = "", reg = "", prev = "", computed = "", sym = "="}: LoggerArgs) => {
  console.log(
    chalk.blue(calcSpace(op, 3)),
    calcSpace(reg, 2),
    chalk.red(calcSpace(prev, byteSize)),
    calcSpace(sym, 1),
    chalk.green(calcSpace(computed, byteSize))
  )
}