const { LOG_LEVEL } = process.env

const LEVELS = { silent: 0, error: 1, info: 2 }
const level = LEVELS[LOG_LEVEL] ?? LEVELS.info

function info(...params) {
    if (level >= LEVELS.info) console.log(...params)
}

function error(...params){
    if (level >= LEVELS.error) console.error(...params)
}

module.exports = {
    info: info,
    error: error
}
