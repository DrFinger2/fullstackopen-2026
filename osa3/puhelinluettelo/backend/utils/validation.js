 


// Simple wrapper for mongoose
const createValidator = (validateFn) => {
   let lastError = '';
    
    return {
        validator: function (value) {
            const result = validateFn(value);
            if (!result.ok) {
                lastError = result.error;
            } else {
                lastError = '';
            }
            return result.ok;
        },
        message: () => lastError,
    };
};

const validateName = (name) => {
    if (!name || typeof name !== 'string') {
        return { ok: false, error: 'Name is missing or invalid.' };
    }
    
    const trimmedName = name.trim();
    if (trimmedName === '') {
        return { ok: false, error: 'Name is missing.' };
    }

    // because i hate regex..
    const allowedExtraChars = [' ', '-', '\'', 'ä', 'ö', 'å', 'Ä', 'Ö', 'Å'];

    for (let i = 0; i < trimmedName.length; i++) {
        const char = trimmedName[i];
        const isLetter = (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
        const isAllowedExtra = allowedExtraChars.includes(char);
        if (!isLetter && !isAllowedExtra) {
            return { ok: false, error: 'Name contains invalid characters.' };
        }
    }

    return { ok: true };
};


const validatePhoneNumber = (number) => {
    if (!number || typeof number !== 'string') {
        return { ok: false, error: 'Phone number is missing or invalid format.' };
    }

    const trimmedNumber = number.trim();
    
    if (trimmedNumber.length < 8) {
        return { ok: false, error: 'Phone number must be at least 8 characters long.' };
    }

    let state = 'PART_1';
    let part1Digits = 0;
    let part2Digits = 0;

    for (let i = 0; i < trimmedNumber.length; i++) {
        const char = trimmedNumber[i];
        const isDigit = char >= '0' && char <= '9';

        switch (state) {
            case 'PART_1':
                if (isDigit) {
                    part1Digits++;
                    if (part1Digits > 3) {
                        return { ok: false, error: 'First part of the number can have at most 3 digits.' };
                    }
                } else if (char === '-') {
                    if (part1Digits < 2) {
                        return { ok: false, error: 'First part of the number must have at least 2 digits before the hyphen.' };
                    }
                    state = 'PART_2';
                } else {
                    return { ok: false, error: `Invalid character '${char}' found in the first part.` };
                }
                break;

            case 'PART_2':
                if (isDigit) {
                    part2Digits++;
                } else {
                    return { ok: false, error: `Invalid character '${char}' found. Only digits are allowed after the hyphen.` };
                }
                break;
        }
    }

    if (state !== 'PART_2' || part2Digits === 0) {
        return { ok: false, error: 'Phone number must consist of two parts separated by a hyphen.' };
    }

    return { ok: true };
};

module.exports = {
    validateName: validateName,
    validatePhoneNumber: validatePhoneNumber,
    createCustomValidator: createCustomValidator
};