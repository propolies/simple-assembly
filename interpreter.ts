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
function SHL([r1]: string[]) {
  const v1 = registers[r1]
  const computed = registers[r1] = Bit.shl(v1)
  logger("SHL", r1, v1, computed)
}
function SHR([r1]: string[]) {
  const v1 = registers[r1]
  const computed = registers[r1] = Bit.shr(v1)
  logger("SHL", r1, v1, computed)
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
function AND([r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[r1] = Bit.and(v1, v2)
  logger("AND", r1, v1, "", "&")
  logger("", "", v2, computed, "=")
}
function OR([r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[r1] = Bit.or(v1, v2)
  logger("OR ", r1, v1, "", "|")
  logger("", "", v2, computed, "=")
}

function XOR([r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[r1] = Bit.xor(v1, v2)
  logger("XOR ", r1, v1, "", "|")
  logger("", "", v2, computed, "=")
}

// Math
function INC([r1]: string[]) {
  const v1 = registers[r1]
  const computed = registers[r1] = Bit.inc(v1)
  logger("INC", r1, v1, computed)
}
function ADD([r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[r1] = Bit.add(v1, v2)
  logger("ADD", r1, v1, "", "+")
  logger("", "", v2, computed, "=")
}
function SUB([r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[r1] = Bit.sub(v1, v2)
  logger("SUB", r1, v1, "", "-")
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