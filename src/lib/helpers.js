export function supplantStr(str, o) {
    try {
        return str.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b]
                return typeof r === 'string' || typeof r === 'number' ? r : a
            }
        )
    }
    catch(e) {
        return str
    }
}

export function randomNumber(min, max) {
    return parseInt(Math.random() * (max - min) + min,0)
}
