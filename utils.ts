function crossMap<T, R>(li1: T[], li2: T[], callback: (a: T, b: T) => R): R[] {
  const res: R[] = []
  li1.forEach((a, i) => {
    const b = li2[i]
    res.push(callback(a, b))
  })
  return res
}

function split<T>(li: T[], i: number) {
  return [li.slice(0, i), li.slice(i)]
}

export {
  crossMap,
  split
}