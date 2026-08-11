const formatName = (name) => {
    if (!name || typeof name !== 'string') {
        return name
    }
    let result = ''
    let capitalize = true

    for (const char of name.toLowerCase()) {
        if (char === ' ') {
            if (result && result[result.length - 1] !== ' ') {
                result += ' '
                capitalize = true
            }
        } else {
            result += capitalize ? char.toUpperCase() : char
            capitalize = false
        }
    }
    return result.trimEnd()
}

const formatNumber = (number) => {
    if (!number || typeof number !== 'string') {
        return number
    }

    let result = ''
    for (const char of number) {
        if (char === ' ') {
            if (result && result[result.length - 1] !== ' ') {
                result += ' '
            }
        } else {
            result += char
        }
    }
    return result.trimEnd()
}


module.exports = { formatName: formatName, formatNumber: formatNumber }