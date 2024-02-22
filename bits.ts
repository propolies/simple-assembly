import { split, crossMap } from './utils'

export class Bits {
  bits: number[]
  length: number
  constructor(value: number | string, length: number) {
    if (typeof value == "number") this.fromNumber(value, length)
    if (typeof value == "string") this.fromBin(value, length)
  }

  fromBin(value: string, length: number) {
    this.length = length
    this.bits = value
      .split("")
      .map((s) => parseInt(s))
  }

  fromNumber(value: number, length: number) {
    const max = Bit.max(length)
    if (value > max) {
      throw new Error(`${value} too large, should be less than ${max}`)
    }
    this.length = length
    this.bits = value
      .toString(2)
      .padStart(length, '0')
      .split("")
      .map((s) => parseInt(s))
  }

  toString() {
    return this.bits.join("")
  }
}

export class Bit {

  // Helper
  static max(bits: number) {
    return (1 << (bits - 1)) - 1;
  }
  static shl(bits: Bits, offset: number) {
    if (offset == 0) return bits;
    const shifted = [...bits.bits.slice(1), 0]
    return this.shl(new Bits(shifted.join(""), bits.length), offset - 1);
  }
  
  static shr(bits: Bits, offset: number) {
    if (offset == 0) return bits
    const shifted = [0, ...bits.bits.slice(0, bits.length - 1)]
    return this.shr(new Bits(shifted.join(""), bits.length), offset - 1);
  }

  // Logic
  static not(bits: Bits) {
    return new Bits(bits.bits.map((b) => 1 - b).join(""), bits.length)
  }
  static and(bits1: Bits, bits2: Bits) {
    const res = crossMap(bits1.bits, bits2.bits, (b1, b2) => b1 & b2)
    return new Bits(res.join(""), bits1.length)
  }
  static or(bits1: Bits, bits2: Bits) {
    const res = crossMap(bits1.bits, bits2.bits, (b1, b2) => b1 | b2)
    return new Bits(res.join(""), bits1.length)
  }
  static xor(bits1: Bits, bits2: Bits) {
    const res = crossMap(bits1.bits, bits2.bits, (b1, b2) => b1 ^ b2)
    return new Bits(res.join(""), bits1.length)
  }

  // Math
  static dec(bits: Bits) {
    return Bit.sub(bits, new Bits(1, bits.length))
  }

  static inc(bits: Bits, start?: number) {
    let carry = 1
    const [front, back] = split(bits.bits.slice().reverse(), start ?? 0)
    const incremented = [
      ...front,
      ...back
      .map((bit) => {
        const [, c, b] = (new Bits(bit + carry, 3)).bits
        carry = c
        return b
      }),
    ].reverse().join("")
    return new Bits(incremented, bits.length)
  }

  static add(bits1: Bits, bits2: Bits) {
    return bits2.bits.slice().reverse().reduce((acc, b, i) => b
      ? Bit.inc(acc, i)
      : acc
      , bits1
    )
  }

  static sub(bits1: Bits, bits2: Bits) {
    return Bit.add(bits1, Bit.twos(bits2))
  }

  static twos(bits: Bits) {
    return Bit.inc(Bit.not(bits))
  }
}