// known SI prefixes, multiple of 3
const PREFIXES = {
  12: 'T',
  9: 'B',
  6: 'M',
  3: 'K',
  0: '',
}

function getExponent(n) {
  if (n === 0) return 0

  return Math.floor(Math.log10(Math.abs(n)))
}

function precise(n) {
  return Number.parseFloat(n.toPrecision(4))
}

function toHumanString(sn) {
  const n = precise(Number.parseFloat(sn))
  let e = Math.min(Math.floor(getExponent(n)), 7)

  if (e % 2 === 0) e -= 1
  if (e < 2) e = 0

  return precise(n / Math.pow(10, e)).toString() + ' ' + PREFIXES[e]
}

export default (_, inject) => {
  inject('numberFormatter', toHumanString)
}
