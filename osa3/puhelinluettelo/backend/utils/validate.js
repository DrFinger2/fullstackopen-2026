
const validateName = (name) => {
    if (name === undefined || name === null) {
        return { ok: false, error: 'Name is missing.' };
    }
    if (typeof name !== 'string') {
        return { ok: false, error: 'Name is in invalid format.' };
    }
    
    const trimmedName = name.trim();
    if (trimmedName === '') {
        return { ok: false, error: 'Name is missing.' };
    }

    if (trimmedName.length < 2) {
        return { ok: false, error: 'Name must be at least 2 characters long.' };
    }

    const nameRegex = /^[\p{L}\s\-']+$/u;
    if (!nameRegex.test(trimmedName)) {
        return { ok: false, error: 'Name contains invalid characters.' };
    }

    return { ok: true };
};

const validatePhoneNumber = (number) => {
    if (number === undefined || number === null) {
        return { ok: false, error: 'Phone number is missing.' };
    }
    if (typeof number !== 'string') {
        return { ok: false, error: 'Phone number is in invalid format.' };
    }
    
    const trimmedNumber = number.trim();
    if (trimmedNumber === '') {
        return { ok: false, error: 'Phone number is missing.' };
    }

    let state = 'START';
    let digitCount = 0;

    for (let i = 0; i < trimmedNumber.length; i++) {
        const char = trimmedNumber[i];
        
        const isDigit       = (char >= '0' && char <= '9');
        const isSeparator   = (char === '-' || char === ' ');
        const isPlus        = (char === '+');

        switch (state) {
            case 'START':
                if (isPlus) {
                    state = 'PLUS';
                } else if (isDigit) {
                    state = 'DIGIT';
                    digitCount++;
                } else {
                    return { ok: false, error: `Invalid starting character '${char}' found in phone number. Must be a digit or '+'.` };
                }
                break;

            case 'PLUS':
                if (isDigit) {
                    state = 'DIGIT';
                    digitCount++;
                } else {
                    return { ok: false, error: `Invalid character '${char}' found in phone number after '+'. Expected a digit.` };
                }
                break;

            case 'DIGIT':
                if (isDigit) {
                    digitCount++;
                } else if (isSeparator) {
                    state = 'SEPARATOR';
                } else {
                    return { ok: false, error: `Invalid character '${char}' found in phone number` };
                }
                break;

            case 'SEPARATOR':
                if (isDigit) {
                    state = 'DIGIT';
                    digitCount++;
                } else if (isSeparator) {
                    return { ok: false, error: 'Consecutive separators (hyphens or spaces) are not allowed.' };
                } else {
                    return { ok: false, error: `Invalid character '${char}' found in phone number after separator.` };
                }
                break;
        }
    }


    if (state === 'SEPARATOR') {
        return { ok: false, error: 'Phone number cannot end with a hyphen or space.' };
    }
    if (state === 'PLUS') {
        return { ok: false, error: 'Phone number cannot consist of only a plus sign.' };
    }
    if (digitCount < 7) {
        return { ok: false, error: 'Phone number must contain at least 7 digits.' };
    }

    return { ok: true };
};

module.exports = { validateName: validateName, validateNumber: validatePhoneNumber };