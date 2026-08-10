
const express = require('express');
const morgan = require('morgan');

const generateId = require('./utils/generateId.js');
const format = require('./utils/formatting.js');
const validate = require('./utils/validate.js');

function main() {
    const app = express();

    const port = (process.env.PORT || 3001);
    const address = (process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`);
    const db = createDatabase();
    const route = createRoute(db);

    morgan.token('test-token', request => {
        if (request.method === 'POST') return JSON.stringify(request.body);
        else return '';
    });
    morgan.format(
        'test-format',
        ':method :url :status :response-time ms :test-token'
    );

    app.use(express.static('dist'));
    app.use(express.json());
    app.use(morgan('test-format'));

    app.get('/info',                route.getInfo);
    app.get('/api/persons',         route.getPersons);
    app.get('/api/persons/:id',     route.getPerson);
    app.delete('/api/persons/:id',  route.deletePerson);
    app.post('/api/persons',        route.postPerson);
    app.put('/api/persons/:id',     route.putPerson);

    app.listen(port, () => {
        console.log(`Server running on port: ${port}`);
        console.log(`Host Address: ${address}\n`);
    });
}

function createDatabase() {
    let persons = [
        { "id": "1", "name": "Lena Hartmann", "number": "040-7182934" },
        { "id": "2", "name": "Noah Bennett", "number": "39-52-1847261" },
        { "id": "3", "name": "Maya Thompson", "number": "12-63-927415" },
        { "id": "4", "name": "Elias Novak", "number": "39-27-5813042" },
        { "id": "5", "name": "Sofia Andersson", "number": "070-3468291" },
        { "id": "6", "name": "Jonas Miller", "number": "08-715-3926" },
        { "id": "7", "name": "Amira Collins", "number": "073-481-9265" },
        { "id": "8", "name": "Theo Martinez", "number": "31-48-2751936" },
        { "id": "9", "name": "Nora Fischer", "number": "040-5928174" },
        { "id": "10", "name": "Leo Campbell", "number": "076-238-5149" }
    ];

    return {
        getAll: () => {
            return persons;
        },
        getById: (id) => {
            return persons.find(person => person.id === id)
        },
        getCount: () => {
            return persons.length
        },
        add: (person) => {
            persons = persons.concat(person);
        },
        remove: (id) => {
            persons = persons.filter(person => person.id !== id);
        },
        update: (id, updatedPerson) => {
            persons = persons.map(person => person.id === id ? updatedPerson : person);
        },
        idExists: (id) => {
            return persons.some(person => person.id === id)
        },
        nameExists: (name, excludeId = null) => {
            return persons.some(person => person.name === name && person.id !== excludeId);
        }
    };
}

const createRoute = (db) => {
    return {
        getInfo: (request, response) => {
            const count = db.getCount();
            const infoText = (count === 0) ? 'Phonebook is empty.' : `Phonebook has info for ${count} people.`;
            const requestTime = new Date().toLocaleString();
        
            return response.status(200).send(
                `<h3>${infoText}</h3>
             <p><strong>Request time: </strong>${requestTime}</p>`
            );
        },
        getPersons: (request, response) => {
            const results = db.getAll()
            return response.status(200).json(results);
        },
        getPerson: (request, response) => {
            const id = request.params.id;
            const person = db.getById(id);

            if (!person) {
                return response.status(404).json({ error: 'Person not found.' });
            }
            return response.status(200).json(person);
        },
        deletePerson: (request, response) => {
            const id = request.params.id;
            const person = db.getById(id);

            if (!person) {
                return response.status(404).json({ error: 'Person not found.' });
            }

            db.remove(id);
            return response.status(204).end();
        },
        postPerson: (request, response) => {
            let { name, number } = request.body || {};

            name = format.name(name);
            const nameResult = validate.name(db, name);
            if (!nameResult.ok) {
                return response.status(400).json({ error: nameResult.error });
            }

            number = format.phoneNumber(number);
            const numberResult = validate.phoneNumber(number); 
            if (!numberResult.ok) {
                return response.status(400).json({ error: numberResult.error });
            }

            const person = {
                id: generateId(db), 
                name: name,
                number: number
            };

            db.add(person);
            return response.status(201).json(person);
        },
        putPerson: (request, response) => {
            const id = request.params.id;
            let { name, number } = request.body || {};

            const person = db.getById(id);
            if (!person) {
                return response.status(404).json({ error: "Person not found!" });
            }

            name = format.name(name);
            const nameResult = validate.name(db, name, id);
            if (!nameResult.ok) {
                return response.status(400).json({ error: nameResult.error });
            }

            number = format.phoneNumber(number);
            const numberResult = validate.phoneNumber(number);
            if (!numberResult.ok) {
                return response.status(400).json({ error: numberResult.error });
            }

            const updatedPerson = {
                id: id,    
                name: name,
                number: number
            };

            db.update(id, updatedPerson);
            return response.status(200).json(updatedPerson);
        }
    }
};

main();