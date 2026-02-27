export const monthNoColor = (index) => {
  if (index > 3) {
    if ((index - 4) % 5 === 0 || (index - 4) % 5 === 1) {
      return '#FDFFF9'
    } else {
      return '#D2D3D0'
    }
  }
  return ''
}

export const monthItemGroupBackground = (index) => {
  if (index === 1) {
    return '#F9ED9E'
  } else if (index === 2) {
    return '#CBE8D3'
  } else if (index === 3) {
    return '#F6D9BA'
  } else {
    return '#F9ED9E'
  }
}

export const rankIndex = (index) => {
  if (index === 0) {
    return 1
  } else if (index === 1) {
    return 0
  } else {
    return index
  }
}
