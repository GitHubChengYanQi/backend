// eslint-disable-next-line no-extend-native
Array.prototype.getObjIndex = function (keyName, value) {
  for (const index in this) {
    if (this[index][keyName] === value) {
      return index
    }
  }
}

// eslint-disable-next-line no-extend-native
Array.prototype.deleteObj = function (keyName, value) {
  const index = this.getObjIndex(keyName, value)

  this.splice(index, 1)
}

// eslint-disable-next-line no-extend-native
Array.prototype.delete = function (item) {
  if (typeof item === 'object') {
    for (const index in this) {
      if (JSON.stringify(this[index]) === JSON.stringify(item)) {
        this.splice(index, 1)

        return false
      }
    }

    return false
  }

  for (const index in this) {
    if (this[index] === item) {
      this.splice(index, 1)

      return false
    }
  }
}

// eslint-disable-next-line no-extend-native
Array.prototype.duplicate = function (key) {
  const map = new Map()
  this.forEach(item => {
    if (!map.has(item[key])) map.set(item[key], item)
  })
  return [...map.values()]
}
