const mongoose = require('mongoose')
const dns = require('dns')

// Using Googles DNS server because I couldnt connect to the database from my home computer
dns.setServers(['1.1.1.1', '8.8.8.8'])

const PersonModel = mongoose.model('person',
    new mongoose.Schema({
        name: String,
        number: String,
    })
)

function main() {
    const args = process.argv
    const argumentCount = args.length

    if (argumentCount !== 3 && argumentCount !== 5) {
        console.log(`Invalid number of arguments: ${argumentCount}\n`)
        console.log('Usage:')
        console.log(' • node mongo.js <password>                          - List all persons in the phonebook')
        console.log(' • node mongo.js <password> <name> <phonenumber>     - Add a new person to the phonebook')
        process.exit(1)
    }

    const DATABASE = 'people'
    const USERNAME = 'fullstack'
    const password = args[2]
    const url = `mongodb+srv://${USERNAME}:${password}@cluster0.zicuuua.mongodb.net/${DATABASE}?appName=Cluster0`

    if (argumentCount === 3) {
        return printPersons(url)
    }
    if (argumentCount === 5) {
        const name = args[3]
        const phoneNumber = args[4]
        return addPerson(url, name, phoneNumber)
    }
}


function printPersons(url) {
    mongoose.set('strictQuery', false)
    mongoose.connect(url, { family: 4 })
        .then(() => {
            return PersonModel.find({})
        })
        .then(result => {
            console.log('Phonebook:')
            result.forEach(person => console.log(`${person.name} ${person.number}`))
        })
        .catch(error => {
            console.log('Error: ', error)
        })
        .finally(() => {
            mongoose.connection.close()
        })
}

function addPerson(url, name, phoneNumber) {
    if (!name || !phoneNumber) {
        console.log('Name and phone number are required')
        process.exit(1)
    }

    const person = new PersonModel({
        name: name,
        number: phoneNumber
    })

    mongoose.set('strictQuery', false)
    mongoose.connect(url, { family: 4 })
        .then(() => {
            return person.save()
        })
        .then(() => {
            console.log(`added ${name} number ${phoneNumber} to phonebook`)
        })
        .catch(error => {
            console.log('Error: ', error)
        })
        .finally(() => {
            mongoose.connection.close()
        })
}

main()
