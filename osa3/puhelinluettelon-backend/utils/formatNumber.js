// I wanted a similar method for phone numbers to keep the formatting consistent/symmetrical..
const formatNumber = (number) => {
    if (!number || typeof number !== 'string') {
        return number;
    }

    let result = '';
    for (const char of number) {
        if (char === ' ') {
            if (result && result[result.length - 1] !== ' ') {
                result += ' ';
            }
        } else {
            result += char;
        }
    }
    return result.trimEnd();
};

module.exports = formatNumber;