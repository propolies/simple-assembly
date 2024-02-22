import fs from 'fs'
import chalk from 'chalk'
import { Bits, Bit } from './bits'

const byteSize = 5

function logger(op: string, reg: string, old: Bits | string, value: Bits | string, sym = "=") {
  function calcSpace(v: string | number | Bits, space: number) {
    if (typeof v == "number") v = v.toString()
    return " ".repeat(space - v.length) + v
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
  const old = registers[r1]
  const value = registers[r1] = new Bits(0, byteSize)
  logger("ZER", r1, old, value)
}
function MOV([r1, r2]: string[]) {
  const old = registers[r1]
  const value = registers[r1] = registers[r2]
  logger("MOV", r1, old, value)
}
function CUR(_: string[]) {
  console.log(chalk.blue("CUR"))
  Object.entries(registers).forEach(([ reg, bits ]) => {
    console.log("   ", reg, bits.toString())
  })
}

// Logic
function NOT([r1]: string[]) {
  const old = registers[r1]
  const value = registers[r1] = Bit.not(registers[r1])
  logger("NOT", r1, old, value)
}
function AND([r1, r2]: string[]) {
  const old = registers[r1]
  const value = registers[r1] = Bit.and(registers[r1], registers[r2])
  logger("AND", r1, old, "", "&")
  logger("", "", registers[r2], value, "=")
}
function OR([r1, r2]: string[]) {
  const old = registers[r1]
  const value = registers[r1] = Bit.or(registers[r1], registers[r2])
  logger("OR ", r1, old, "", "|")
  logger("", "", registers[r2], value, "=")
}

// Math
function INC([r1]: string[]) {
  const old = registers[r1]
  const value = registers[r1] = Bit.inc(registers[r1])
  logger("INC", r1, old, value)
}
function ADD([r1, r2]: string[]) {
  const old = registers[r1]
  const value = registers[r1] = Bit.add(registers[r1], registers[r2])
  logger("ADD", r1, old, "", "+")
  logger("", "", registers[r2], value, "=")
}
function DEC([r1]: string[]) {
  const old = registers[r1]
  const value = registers[r1] = Bit.dec(registers[r1])
  logger("DEC", r1, old, value)
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
      case "CUR": CUR(regs); break

      // Logic
      case "NOT": NOT(regs); break
      case "AND": AND(regs); break
      case "OR": OR(regs); break

      // Math
      case "ADD": ADD(regs); break
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