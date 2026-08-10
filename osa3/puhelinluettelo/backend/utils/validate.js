const validateName = (name) => {
    if (name === undefined || name === null) {
        return { ok: false, error: 'Name is missing.' };
    }
    if (typeof name !== 'string') {
        return { ok: false, error: 'Name is in invalid format.' };
    }
    if (name.trim() === '') {
        return { ok: false, error: 'Name is missing.' };
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
    if (number.trim() === '') {
        return { ok: false, error: 'Phone number is missing.' };
    }
    return { ok: true };
};

module.exports = { name: validateName, phoneNumber: validatePhoneNumber };