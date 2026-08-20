const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const formatUrl = require('../utils/format_url')

describe('formatUrl()', () => {

    describe('Valid URLs', () => {
        const validCases = [
            // Standard inputs & missing schemes
            {
                input: 'example.com',
                expected: 'https://example.com/',
                desc: 'adds https:// and trailing slash to bare domain'
            },
            {
                input: 'http://example.com',
                expected: 'http://example.com/',
                desc: 'preserves http:// scheme'
            },
            {
                input: 'https://example.com',
                expected: 'https://example.com/',
                desc: 'preserves https:// scheme'
            },
            {
                input: 'www.example.com',
                expected: 'https://www.example.com/',
                desc: 'handles leading www subdomain'
            },

            // Additional cases (round 1)
            {
                input: 'HTTP://EXAMPLE.COM',
                expected: 'http://example.com/',
                desc: 'lowercases scheme and hostname'
            },
            {
                input: 'hTtP://ExAmPle.COM',
                expected: 'http://example.com/',
                desc: 'lowercases mixed-case scheme and hostname'
            },
            {
                input: '  http://example.com  ',
                expected: 'http://example.com/',
                desc: 'trims whitespace around scheme URL'
            },
            {
                input: 'example.com/',
                expected: 'https://example.com/',
                desc: 'preserves existing trailing slash'
            },
            {
                input: 'http://example.com/',
                expected: 'http://example.com/',
                desc: 'preserves trailing slash with scheme'
            },

            // Case sensitivity
            {
                input: 'EXAMPLE.COM',
                expected: 'https://example.com/',
                desc: 'lowercases upper-case hostnames'
            },
            {
                input: 'EXAMPLE.COM/MyPath?Query=1',
                expected: 'https://example.com/MyPath?Query=1',
                desc: 'lowercases hostname while preserving path & query case'
            },

            // Whitespace
            {
                input: '  example.com  ',
                expected: 'https://example.com/',
                desc: 'trims leading and trailing whitespace'
            },

            // Paths, Queries, and Hashes
            {
                input: 'example.com/path/to/resource',
                expected: 'https://example.com/path/to/resource',
                desc: 'preserves URL path'
            },
            {
                input: 'example.com?foo=bar&baz=123',
                expected: 'https://example.com/?foo=bar&baz=123',
                desc: 'preserves query parameters and prepends slash'
            },
            {
                input: 'example.com#section-1',
                expected: 'https://example.com/#section-1',
                desc: 'preserves hash fragment and prepends slash'
            },

            // Additional cases (round 1)
            {
                input: 'example.com/path/to?foo=bar&baz=123#section',
                expected: 'https://example.com/path/to?foo=bar&baz=123#section',
                desc: 'preserves combined path, query, and fragment'
            },
            {
                input: 'example.com?foo=&bar',
                expected: 'https://example.com/?foo=&bar',
                desc: 'preserves empty query values'
            },
            {
                input: 'example.com/path%20with%20spaces',
                expected: 'https://example.com/path%20with%20spaces',
                desc: 'preserves percent-encoded spaces in path'
            },
            {
                input: 'example.com/path?foo=bar',
                expected: 'https://example.com/path?foo=bar',
                desc: 'preserves path with query'
            },
            {
                input: 'example.com/path#section',
                expected: 'https://example.com/path#section',
                desc: 'preserves path with hash'
            },
            {
                input: 'example.com?foo=bar#section',
                expected: 'https://example.com/?foo=bar#section',
                desc: 'preserves query and hash without path'
            },
            {
                input: 'example.com/?foo=bar',
                expected: 'https://example.com/?foo=bar',
                desc: 'preserves existing slash before query'
            },
            {
                input: 'example.com/#section',
                expected: 'https://example.com/#section',
                desc: 'preserves existing slash before hash'
            },

            // Ports
            {
                input: 'example.com:8080/api',
                expected: 'https://example.com:8080/api',
                desc: 'preserves non-default custom ports'
            },
            {
                input: 'http://example.com:80/foo',
                expected: 'http://example.com/foo',
                desc: 'strips default HTTP port 80'
            },
            {
                input: 'https://example.com:443/foo',
                expected: 'https://example.com/foo',
                desc: 'strips default HTTPS port 443'
            },

            // Additional cases (round 1)
            {
                input: 'http://example.com:80',
                expected: 'http://example.com/',
                desc: 'strips default HTTP port 80 without a path'
            },
            {
                input: 'https://example.com:443',
                expected: 'https://example.com/',
                desc: 'strips default HTTPS port 443 without a path'
            },
            {
                input: 'https://example.com:80/foo',
                expected: 'https://example.com:80/foo',
                desc: 'preserves port 80 when scheme is https'
            },
            {
                input: 'http://example.com:443/foo',
                expected: 'http://example.com:443/foo',
                desc: 'preserves port 443 when scheme is http'
            },
            {
                input: 'example.com:65535',
                expected: 'https://example.com:65535/',
                desc: 'accepts maximum valid port number'
            },
            {
                input: 'example.com:8080',
                expected: 'https://example.com:8080/',
                desc: 'preserves custom port without path'
            },
            {
                input: 'example.com:1',
                expected: 'https://example.com:1/',
                desc: 'accepts minimum valid port number'
            },

            // Subdomains & TLD Types
            {
                input: 'sub.domain.example.com',
                expected: 'https://sub.domain.example.com/',
                desc: 'handles multi-level subdomains'
            },
            {
                input: 'my-cool-site.org',
                expected: 'https://my-cool-site.org/',
                desc: 'handles hyphenated domain names'
            },
            {
                input: 'google.co.uk',
                expected: 'https://google.co.uk/',
                desc: 'validates 2-letter country code TLDs (ccTLD)'
            },
            {
                input: 'build.dev',
                expected: 'https://build.dev/',
                desc: 'validates known gTLDs from VALID_TLDS set'
            },

            // Additional cases (round 1)
            {
                input: 'sub-domain.example.com',
                expected: 'https://sub-domain.example.com/',
                desc: 'allows internal hyphens in labels'
            },
            {
                input: 'www.sub.example.com',
                expected: 'https://www.sub.example.com/',
                desc: 'allows leading www followed by another subdomain'
            },
            {
                input: 'a.example.com',
                expected: 'https://a.example.com/',
                desc: 'accepts single-character subdomain (not w)'
            },
            {
                input: '123.example.com',
                expected: 'https://123.example.com/',
                desc: 'accepts numeric label in subdomain'
            },
            {
                input: 'a-b.c-d.example.com',
                expected: 'https://a-b.c-d.example.com/',
                desc: 'accepts multiple hyphenated labels'
            },

            // Userinfo
            {
                input: 'admin:secret@example.com',
                expected: 'https://admin:secret@example.com/',
                desc: 'preserves basic authentication credentials'
            },
            {
                input: 'user:pass@example.com:8080',
                expected: 'https://user:pass@example.com:8080/',
                desc: 'preserves userinfo and custom port'
            }
        ]

        for (const { input, expected, desc } of validCases) {
            it(`should accept: ${desc} ("${input}")`, () => {
                const result = formatUrl(input)
                assert.deepStrictEqual(result, {
                    isValid: true,
                    formattedUrl: expected
                })
            })
        }
    })

    describe('Invalid URLs', () => {
        const invalidCases = [
            // Empty / Whitespace
            { input: '', desc: 'empty string' },
            { input: '   ', desc: 'whitespace-only string' },

            // Spaces inside URL
            { input: 'example .com', desc: 'space before TLD' },
            { input: 'http://example.com /path', desc: 'space in path' },

            // Additional cases (round 1)
            { input: 'example.com?foo=bar baz', desc: 'space in query string' },
            { input: 'ht tp://example.com', desc: 'space in scheme' },
            { input: 'exa mple.com', desc: 'space in hostname' },

            // Invalid schemes
            { input: 'ftp://example.com', desc: 'non-http/https protocol (ftp)' },
            { input: 'mailto:test@example.com', desc: 'mailto link' },
            { input: 'javascript:alert(1)', desc: 'javascript URI' },

            // Additional cases (round 1)
            { input: 'http://', desc: 'protocol only with no hostname' },
            { input: 'https://', desc: 'protocol only with no hostname' },
            { input: 'http:///example.com', desc: 'triple slash with empty host' },
            { input: 'http:', desc: 'scheme with colon only' },

            // Hostname structure issues
            { input: 'localhost', desc: 'single word domain (no TLD)' },
            { input: 'http://localhost', desc: 'single word domain with protocol' },
            { input: 'example.', desc: 'trailing dot with no TLD' },
            { input: '.example.com', desc: 'leading dot in domain' },

            // Additional cases (round 1)
            { input: 'example.com.', desc: 'trailing dot after TLD' },
            { input: 'sub..example.com', desc: 'empty label between dots' },
            { input: 'example..com', desc: 'empty label before TLD' },
            { input: 'sub.example', desc: 'single word domain with subdomain (no TLD)' },

            // Hyphen placement rules
            { input: '-example.com', desc: 'segment starting with a hyphen' },
            { input: 'example-.com', desc: 'segment ending with a hyphen' },
            { input: 'sub.-domain.com', desc: 'subdomain starting with a hyphen' },

            // Additional cases (round 1)
            { input: 'example.-com', desc: 'TLD starting with a hyphen' },
            { input: 'example.com-', desc: 'TLD ending with a hyphen' },
            { input: 'sub-.example.com', desc: 'subdomain ending with a hyphen' },

            // Custom "w" segment rules
            { input: 'sub.www.example.com', desc: 'www used as a non-leading subdomain' },
            { input: 'ww.example.com', desc: 'segment with all "w"s that is not "www"' },
            { input: 'wwww.example.com', desc: '4 "w"s in segment' },

            // Additional cases (round 1)
            { input: 'w.example.com', desc: 'single "w" segment' },

            // Invalid TLDs
            { input: 'example.ww', desc: '2-letter TLD explicitly set to "ww"' },
            { input: 'example.123', desc: 'numeric TLD' },
            { input: 'example.unknown-gtld-that-does-not-exist', desc: 'unsupported gTLD' },

            // Additional cases (round 1)
            { input: 'example.c', desc: 'single-letter TLD' },
            { input: 'example.c_om', desc: 'underscore in TLD' },
            { input: 'example.1', desc: 'single-digit TLD' },

            // Invalid Ports
            { input: 'example.com:', desc: 'empty port colon' },
            { input: 'example.com:abc', desc: 'non-numeric port' },
            { input: 'example.com:0', desc: 'port 0 (out of range)' },
            { input: 'example.com:70000', desc: 'port above 65535' },

            // Additional cases (round 1)
            { input: 'example.com:-1', desc: 'negative port' },
            { input: 'example.com:80:90', desc: 'multiple port separators' },
            { input: 'example.com:65536', desc: 'port just above maximum' },

            // Invalid characters
            { input: 'ex$ample.com', desc: 'contains special symbol ($)' },
            { input: 'ex_ample.com', desc: 'contains underscore in host' },

            // Additional cases (round 1)
            { input: 'exa%mple.com', desc: 'percent in hostname' },
            { input: 'exa/mple.com', desc: 'slash in hostname' },
            { input: 'exa\\mple.com', desc: 'backslash in hostname' },
            { input: 'exa#mple.com', desc: 'hash in hostname' },
            { input: 'exa?mple.com', desc: 'question mark in hostname' },
            { input: 'exämple.com', desc: 'non-ASCII characters in hostname' },
            { input: '192.168.1.1', desc: 'IPv4 address (numeric labels and TLD)' },
            { input: '[::1]', desc: 'IPv6 address' },
            { input: 'user@name@example.com', desc: 'multiple @ symbols' },
            { input: '@example.com', desc: 'empty userinfo before @' }
        ]

        for (const { input, desc } of invalidCases) {
            it(`should reject: ${desc} ("${input}")`, () => {
                const result = formatUrl(input)
                assert.deepStrictEqual(result, {
                    isValid: false,
                    formattedUrl: input.trim()
                })
            })
        }
    })

})