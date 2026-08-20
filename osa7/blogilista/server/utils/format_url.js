const VALID_TLDS = new Set([
    'com', 'org', 'net', 'edu', 'gov', 'mil', 'info', 'biz', 'name', 'pro',
    'tech', 'dev', 'app', 'online', 'site', 'store', 'xyz', 'blog', 'cloud',
    'digital', 'link', 'shop', 'space', 'club', 'live', 'life', 'world',
    'agency', 'global', 'media', 'news', 'design', 'studio', 'group', 'systems'
])

const SCHEME_HTTP = 'http://'
const SCHEME_HTTPS = 'https://'

function formatUrl(urlInput) {
    const len = urlInput.length
    if (len === 0) return { isValid: false, formattedUrl: '' }

    // 1. Trim leading and trailing whitespace indices without intermediate allocations
    let start = 0
    while (start < len && urlInput.charCodeAt(start) <= 32) {
        start++
    }
    let end = len
    while (end > start && urlInput.charCodeAt(end - 1) <= 32) {
        end--
    }

    if (start >= end) {
        return { isValid: false, formattedUrl: '' }
    }

    // 2. Reject internal spaces without regex
    for (let i = start; i < end; i++) {
        if (urlInput.charCodeAt(i) === 32) {
            return { isValid: false, formattedUrl: urlInput.slice(start, end) }
        }
    }

    // 3. Fast scheme detection
    let scheme = SCHEME_HTTPS
    let authStart = start
    let sepIdx = -1

    for (let i = start; i < end; i++) {
        const c = urlInput.charCodeAt(i)
        if (c === 47 || c === 63 || c === 35 || c === 92) { // / ? # \
            break
        }
        if (c === 58 && i + 2 < end && urlInput.charCodeAt(i + 1) === 47 && urlInput.charCodeAt(i + 2) === 47) { // ://
            sepIdx = i
            break
        }
    }

    if (sepIdx !== -1) {
        const schemeLen = sepIdx - start
        if (schemeLen === 4 &&
            (urlInput.charCodeAt(start) | 32) === 104 &&
            (urlInput.charCodeAt(start + 1) | 32) === 116 &&
            (urlInput.charCodeAt(start + 2) | 32) === 116 &&
            (urlInput.charCodeAt(start + 3) | 32) === 112) {
            scheme = SCHEME_HTTP
            authStart = sepIdx + 3
        } else if (schemeLen === 5 &&
            (urlInput.charCodeAt(start) | 32) === 104 &&
            (urlInput.charCodeAt(start + 1) | 32) === 116 &&
            (urlInput.charCodeAt(start + 2) | 32) === 116 &&
            (urlInput.charCodeAt(start + 3) | 32) === 112 &&
            (urlInput.charCodeAt(start + 4) | 32) === 115) {
            scheme = SCHEME_HTTPS
            authStart = sepIdx + 3
        } else {
            return { isValid: false, formattedUrl: urlInput.slice(start, end) }
        }
    } else {
        // Fast non-http scheme checks: mailto:, javascript:, tel:, data:, urn:, about:
        const c0 = urlInput.charCodeAt(start) | 32
        const remLen = end - start
        if (c0 === 109 && remLen >= 7 && urlInput.charCodeAt(start + 6) === 58) { // mailto:
            if (urlInput.slice(start, start + 7).toLowerCase() === 'mailto:') return { isValid: false, formattedUrl: urlInput.slice(start, end) }
        } else if (c0 === 106 && remLen >= 11 && urlInput.charCodeAt(start + 10) === 58) { // javascript:
            if (urlInput.slice(start, start + 11).toLowerCase() === 'javascript:') return { isValid: false, formattedUrl: urlInput.slice(start, end) }
        } else if (c0 === 116 && remLen >= 4 && urlInput.charCodeAt(start + 3) === 58) { // tel:
            if (urlInput.slice(start, start + 4).toLowerCase() === 'tel:') return { isValid: false, formattedUrl: urlInput.slice(start, end) }
        } else if (c0 === 100 && remLen >= 5 && urlInput.charCodeAt(start + 4) === 58) { // data:
            if (urlInput.slice(start, start + 5).toLowerCase() === 'data:') return { isValid: false, formattedUrl: urlInput.slice(start, end) }
        } else if (c0 === 117 && remLen >= 4 && urlInput.charCodeAt(start + 3) === 58) { // urn:
            if (urlInput.slice(start, start + 4).toLowerCase() === 'urn:') return { isValid: false, formattedUrl: urlInput.slice(start, end) }
        } else if (c0 === 97 && remLen >= 6 && urlInput.charCodeAt(start + 5) === 58) { // about:
            if (urlInput.slice(start, start + 6).toLowerCase() === 'about:') return { isValid: false, formattedUrl: urlInput.slice(start, end) }
        }
    }

    // 4. Find end of authority
    let authEnd = end
    for (let i = authStart; i < end; i++) {
        const c = urlInput.charCodeAt(i)
        if (c === 47 || c === 63 || c === 35 || c === 92) {
            authEnd = i
            break
        }
    }

    // 5. Parse authority: userinfo, host, port
    let userinfo = ''
    let hostStart = authStart
    let hostEnd = authEnd

    // Check for @
    let atIdx = -1
    for (let i = authStart; i < authEnd; i++) {
        if (urlInput.charCodeAt(i) === 64) { // @
            if (atIdx !== -1 || i === authStart) {
                return { isValid: false, formattedUrl: urlInput.slice(start, end) }
            }
            atIdx = i
        }
    }
    if (atIdx !== -1) {
        userinfo = urlInput.slice(authStart, atIdx + 1)
        hostStart = atIdx + 1
    }

    // Check for : (port)
    let colonIdx = -1
    for (let i = hostStart; i < authEnd; i++) {
        if (urlInput.charCodeAt(i) === 58) { // :
            if (colonIdx !== -1) {
                return { isValid: false, formattedUrl: urlInput.slice(start, end) }
            }
            colonIdx = i
        }
    }

    let portStr = ''
    let portNum = 0
    if (colonIdx !== -1) {
        hostEnd = colonIdx
        const pLen = authEnd - colonIdx - 1
        if (pLen === 0 || pLen > 5) return { isValid: false, formattedUrl: urlInput.slice(start, end) }
        for (let i = colonIdx + 1; i < authEnd; i++) {
            const digit = urlInput.charCodeAt(i) - 48
            if (digit < 0 || digit > 9) return { isValid: false, formattedUrl: urlInput.slice(start, end) }
            portNum = portNum * 10 + digit
        }
        if (portNum < 1 || portNum > 65535) return { isValid: false, formattedUrl: urlInput.slice(start, end) }
        portStr = urlInput.slice(colonIdx + 1, authEnd)
    }

    // 6. Validate host segments & TLD
    if (hostStart >= hostEnd) return { isValid: false, formattedUrl: urlInput.slice(start, end) }

    let segmentCount = 0
    let segStart = hostStart
    let lastSegStart = hostStart
    let lastSegEnd = hostEnd
    let hasUpper = false

    for (let i = hostStart; i <= hostEnd; i++) {
        if (i === hostEnd || urlInput.charCodeAt(i) === 46) { // '.' or end of host
            const segLen = i - segStart
            if (segLen === 0) return { isValid: false, formattedUrl: urlInput.slice(start, end) }

            // Segment cannot start or end with hyphen
            if (urlInput.charCodeAt(segStart) === 45 || urlInput.charCodeAt(i - 1) === 45) {
                return { isValid: false, formattedUrl: urlInput.slice(start, end) }
            }

            let isAllW = true
            for (let j = segStart; j < i; j++) {
                const c = urlInput.charCodeAt(j)
                const isLower = c >= 97 && c <= 122
                const isUpper = c >= 65 && c <= 90
                const isDigit = c >= 48 && c <= 57
                const isHyphen = c === 45
                if (isUpper) hasUpper = true
                if (!isLower && !isUpper && !isDigit && !isHyphen) return { isValid: false, formattedUrl: urlInput.slice(start, end) }
                if (c !== 119 && c !== 87) isAllW = false
            }

            if (isAllW) {
                if (segLen !== 3 || segmentCount > 0) {
                    return { isValid: false, formattedUrl: urlInput.slice(start, end) }
                }
            }

            lastSegStart = segStart
            lastSegEnd = i
            segmentCount++
            segStart = i + 1
        }
    }

    if (segmentCount < 2) return { isValid: false, formattedUrl: urlInput.slice(start, end) }

    // Validate TLD
    const tldLen = lastSegEnd - lastSegStart
    if (tldLen === 2) {
        const c0 = urlInput.charCodeAt(lastSegStart) | 32
        const c1 = urlInput.charCodeAt(lastSegStart + 1) | 32
        if (c0 < 97 || c0 > 122 || c1 < 97 || c1 > 122 || (c0 === 119 && c1 === 119)) {
            return { isValid: false, formattedUrl: urlInput.slice(start, end) }
        }
    } else {
        const tld = urlInput.slice(lastSegStart, lastSegEnd).toLowerCase()
        if (!VALID_TLDS.has(tld)) {
            return { isValid: false, formattedUrl: urlInput.slice(start, end) }
        }
    }

    // 7. Build formatted output
    const rawHost = urlInput.slice(hostStart, hostEnd)
    const lowerHost = hasUpper ? rawHost.toLowerCase() : rawHost
    let formattedHost = userinfo + lowerHost

    if (portStr) {
        const isDefault = (scheme === SCHEME_HTTP && portNum === 80) || (scheme === SCHEME_HTTPS && portNum === 443)
        if (!isDefault) {
            formattedHost += ':' + portStr
        }
    }

    let formattedPath = '/'
    if (authEnd < end) {
        const firstC = urlInput.charCodeAt(authEnd)
        if (firstC === 92) { // '\'
            formattedPath = '/' + urlInput.slice(authEnd + 1, end)
        } else if (firstC === 63 || firstC === 35) { // '?' or '#'
            formattedPath = '/' + urlInput.slice(authEnd, end)
        } else {
            formattedPath = urlInput.slice(authEnd, end)
        }
    }

    return {
        isValid: true,
        formattedUrl: scheme + formattedHost + formattedPath
    }
}

module.exports = formatUrl