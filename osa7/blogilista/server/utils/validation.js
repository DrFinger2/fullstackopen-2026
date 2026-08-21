const allowedPasswordSymbols = Object.freeze([
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '(',
  ')',
  '-',
  '_',
  '=',
  '+',
  '[',
  ']',
  '{',
  '}',
  ';',
  ':',
  ',',
  '.',
  '<',
  '>',
  '?',
  '/',
  '~',
  '`',
  '"',
  ' ',
])
const allowedUsernameSymbol = Object.freeze(['_', '-', '.'])

const USERNAME_MIN = 3
const USERNAME_MAX = 30
const PASSWORD_MIN = 8
const PASSWORD_MAX = 72

// Works because symbols dont have uppercase, doesnt work with chinese or japanese but thats fine
const isAlphabetic = (char) => char.toLowerCase() !== char.toUpperCase()
const isDigit = (char) => char >= '0' && char <= '9'
const isUsernameSymbol = (char) => allowedUsernameSymbol.includes(char)
const isPasswordSymbol = (char) => allowedPasswordSymbols.includes(char)

function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { ok: false, error: 'Username cannot be blank' }
  }
  if (username.length < USERNAME_MIN) {
    return {
      ok: false,
      error: `Username needs to be at least ${USERNAME_MIN} characters long`,
    }
  }
  if (username.length > USERNAME_MAX) {
    return {
      ok: false,
      error: `Username needs to be fewer than ${USERNAME_MAX} characters long`,
    }
  }

  for (const char of username) {
    if (!isAlphabetic(char) && !isDigit(char) && !isUsernameSymbol(char)) {
      return {
        ok: false,
        error:
          'Username can only contain letters, numbers, underscores, hyphens, and periods',
      }
    }
  }

  if (isUsernameSymbol(username.at(0)) || isUsernameSymbol(username.at(-1))) {
    return { ok: false, error: 'Username cannot start or end with a symbol' }
  }

  return { ok: true }
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length === 0) {
    return { ok: false, error: 'Password is required' }
  }
  if (password.length < PASSWORD_MIN) {
    return {
      ok: false,
      error: `Password needs to be at least ${PASSWORD_MIN} characters long`,
    }
  }
  if (password.length > PASSWORD_MAX) {
    return { ok: false, error: 'Password is too long' }
  }
  if (password.trim().length === 0) {
    return { ok: false, error: 'Password cannot be only spaces' }
  }

  for (const char of password) {
    if (!isAlphabetic(char) && !isDigit(char) && !isPasswordSymbol(char)) {
      return { ok: false, error: 'Password contains an unsupported character' }
    }
  }

  return { ok: true }
}

module.exports = {
  validateUsername,
  validatePassword,
}
