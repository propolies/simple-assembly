import fs from 'fs'
import chalk from 'chalk'
import { Bits, Bit } from './bits'
import { initLogger } from './logger'
import rand from 'random'

const byteSize = 5
const logger = initLogger(byteSize)

const registers: { [key: string]: Bits } = {
  "R0": new Bits(rand.int(1, Bit.max(byteSize)), byteSize),
  "R1": new Bits(rand.int(1, Bit.max(byteSize)), byteSize),
}

// Helper
function ZER([reg]: string[]) {
  const prev = registers[reg]
  const computed = registers[reg] = new Bits(0, byteSize)
  logger({ op: "ZER", reg, prev, computed })
}
function MOV([reg, r1]: string[]) {
  const prev = registers[reg]
  const v1 = registers[r1]
  const computed = registers[reg] = v1
  logger({ reg: "MOV", prev, computed })
}
function SHL([reg, offset]: string[]) {
  const prev = registers[reg]
  const computed = registers[reg] = Bit.shl(prev, parseInt(offset))
  logger({ op: "SHL", reg, prev, computed })
}
function SHR([reg, off]: string[]) {
  const prev = registers[reg]
  const computed = registers[reg] = Bit.shr(prev, parseInt(off))
  logger({ op: "SHL", reg, prev, computed})
}
function DEF([reg, value, type]: string[]) {
  const computed = registers[reg] = new Bits(type == "int" ? parseInt(value) : value, byteSize)
  logger({ op: "DEF", reg, computed})
}
function INT([reg]: string[]) {
  const computed = registers[reg].toInt().toString()
  logger({ op: "INT", reg, computed})
}
function CUR(_: string[]) {
  console.log(chalk.blue("CUR"))
  Object.entries(registers).forEach(([ reg, bits ]) => {
    console.log("   ", reg, bits.toString())
  })
}

// Logic
function NOT([reg]: string[]) {
  const prev = registers[reg]
  const computed = registers[reg] = Bit.not(prev)
  logger({ op: "NOT", reg, prev, computed })
}
function AND([reg, r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[reg] = Bit.and(v1, v2)
  logger({ op: "AND", reg, prev: v1, sym: "&" })
  logger({ prev: v2, computed, sym: "=" })
}
function OR([reg, r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[reg] = Bit.or(v1, v2)
  logger({ op: "OR ", reg, prev: v1, sym: "|" })
  logger({ prev: v2, computed, sym: "=" })
}
function XOR([reg, r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[reg] = Bit.xor(v1, v2)
  logger({ op: "XOR", reg, prev: v1, sym: "^" })
  logger({ prev: v2, computed, sym: "=" })
}

// Math
function INC([reg]: string[]) {
  const prev = registers[reg]
  const computed = registers[reg] = Bit.inc(prev)
  logger({ op: "INC", reg, prev, computed })
}
function ADD([reg, r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[reg] = Bit.add(v1, v2)
  logger({ op: "ADD", reg, prev: v1, sym: "+" })
  logger({ prev: v2, computed, sym: "=" })
}
function SUB([reg, r1, r2]: string[]) {
  const v1 = registers[r1]
  const v2 = registers[r2]
  const computed = registers[reg] = Bit.sub(v1, v2)
  logger({ op: "SUB", reg, prev: v1, sym: "-" })
  logger({ prev: v2, computed, sym: "=" })
}
function DEC([reg]: string[]) {
  const prev = registers[reg]
  const computed = registers[reg] = Bit.dec(prev)
  logger({ op: "DEC", reg, prev, computed })
}

fs.readFile("main.txt", (_, txt) => {
  const code = txt.toString()
  const lines = code.split("\r\n")
  loop: for (const [i, line] of lines.entries()) {
    const [op, ...regs] = line.split(" ")
    if (op[0] == "#") return
    try { switch (op) {
      // Helper
      case "ZER": ZER(regs); break
      case "MOV": MOV(regs); break
      case "SHL": SHL(regs); break
      case "SHR": SHR(regs); break
      case "CUR": CUR(regs); break
      case "DEF": DEF(regs); break
      case "INT": INT(regs); break

      // Logic
      case "NOT": NOT(regs); break
      case "AND": AND(regs); break
      case "XOR": XOR(regs); break
      case "OR ":  OR(regs); break

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
    }} catch(e) { 
      console.log(chalk.red(`Error at line: ${i}`))
      break loop;
    }
  }
})