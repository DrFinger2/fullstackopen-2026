class Test {
  static isNameValid(name, persons) {
    const personExists = persons.some((person) => person.name === name)

    if (personExists) {
      return {
        valid: false,
        error: `Name ${name} is already added to phonebook`
      }
    }

    if (name.length === 0) {
      return {
        valid: false,
        error: 'Name field is empty'
      }
    }

    return {
      valid: true,
      error: null
    }
  }

  static isNumberValid(number) {
    const phoneRegex =
      /^(?:0\d{2,3}[- ]?\d{5,8}|\+358\d{2,3}[- ]?\d{5,8})$/

    if (number.length === 0) {
      return {
        valid: false,
        error: 'Phone number field is empty'
      }
    }

    if (!phoneRegex.test(number)) {
      return {
        valid: false,
        error: `Phone number '${number}' is invalid`
      }
    }

    return {
      valid: true,
      error: null
    }
  }
}

export default Test