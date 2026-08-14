const { NODE_ENV } = process.env

function info(...params) {
    if (NODE_ENV !== 'test') {
        console.log(...params)
    }
}

function error(...params){
    if (NODE_ENV !== 'test') {
        console.error(...params)
    }
}

module.exports = {
    info: info,
    error: error
}