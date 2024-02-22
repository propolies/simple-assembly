import fs from 'fs'
import chalk from 'chalk'
import { Bits, Bit } from './bits'

const byteSize = 5

function logger(op: string, reg: string, old: Bits | string, value: Bits | string, sym = "=") {
  function calcSpace(v: string | number | Bits, space: number) {
    if (typeof v == "number") v = v.toString()
    return " ".repeat(Math.abs(space - v.length)) + v
  }
  console.log(
    chalk.blue(calcSpace(op, 3)),
    calcSpace(reg, 2),
    chalk.red(calcSpace(old, byteSize)),
    calcSpace(sym, 1),
    chalk.green(calcSpace(value, byteSize))
  )
}

const registers: { [key: string]: Bits } = {
  "R5": new Bits("10001", byteSize),
  "R6": new Bits("01110", byteSize),
  "R7": new Bits(5, byteSize),
}

// Helper
function ZER([r1]: string[]) {
  const v1 = registers[r1]
  const computed = registers[r1] = new Bits(0, byteSize)
  logger("ZER", r1, v1, computed)
}
function MOV([r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[r1] = v2
  logger("MOV", r1, v1, computed)
}
function SHL([r1, off]: string[]) {
  const v1 = registers[r1]
  const computed = registers[r1] = Bit.shl(v1, Number.parseInt(off))
  logger("SHL", r1, v1, computed)
}
function SHR([r1, off]: string[]) {
  const v1 = registers[r1]
  const computed = registers[r1] = Bit.shr(v1, Number.parseInt(off))
  logger("SHL", r1, v1, computed)
}
function DEF([r1, v]: string[]) {
  const computed = registers[r1] = new Bits(v, byteSize)
  logger("DEF", r1, "", computed)
}
function CUR(_: string[]) {
  console.log(chalk.blue("CUR"))
  Object.entries(registers).forEach(([ reg, bits ]) => {
    console.log("   ", reg, bits.toString())
  })
}

// Logic
function NOT([r1]: string[]) {
  const v1 = registers[r1]
  const computed = registers[r1] = Bit.not(v1)
  logger("NOT", r1, v1, computed)
}
function AND([rd, r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[rd] = Bit.and(v1, v2)
  logger("AND", rd, v1, "", "&")
  logger("", "", v2, computed, "=")
}
function OR([rd, r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[rd] = Bit.or(v1, v2)
  logger("OR ", rd, v1, "", "|")
  logger("", "", v2, computed, "=")
}
function XOR([rd, r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[rd] = Bit.xor(v1, v2)
  logger("XOR", rd, v1, "", "^")
  logger("", "", v2, computed, "=")
}

// Math
function INC([r1]: string[]) {
  const v1 = registers[r1]
  const computed = registers[r1] = Bit.inc(v1)
  logger("INC", r1, v1, computed)
}
function ADD([rd, r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[rd] = Bit.add(v1, v2)
  logger("ADD", rd, v1, "", "+")
  logger("", "", v2, computed, "=")
}
function SUB([rd, r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[rd] = Bit.sub(v1, v2)
  logger("SUB", rd, v1, "", "-")
  logger("", "", v2, computed, "=")
}
function DEC([r1]: string[]) {
  const v1 = registers[r1]
  const computed = registers[r1] = Bit.dec(v1)
  logger("DEC", r1, v1, computed)
}

fs.readFile("main.txt", (_, txt) => {
  const code = txt.toString()
  const lines = code.split("\r\n")
  lines.forEach((line, i) => {
    const [op, ...regs] = line.split(" ")
    switch (op) {

      // Helper
      case "ZER": ZER(regs); break
      case "MOV": MOV(regs); break
      case "SHL": SHL(regs); break
      case "SHR": SHR(regs); break
      case "CUR": CUR(regs); break
      case "DEF": DEF(regs); break

      // Logic
      case "NOT": NOT(regs); break
      case "AND": AND(regs); break
      case "OR": OR(regs); break
      case "XOR": XOR(regs); break

      // Math
      case "ADD": ADD(regs); break
      case "SUB": SUB(regs); break
      case "INC": INC(regs); break
      case "DEC": DEC(regs); break

      default: 
        if (line !== "") {
          console.log(chalk.red(`Unexpected operation (${i}): ${op}`))
        } else {
          console.log("")
        }
    }
  })
})