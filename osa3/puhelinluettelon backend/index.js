const express = require('express');
const morgan = require('morgan');

const formatName = require('./utils/formatName.js')
const formatNumber = require('./utils/formatNumber.js')

let persons = [
    {
        "id": "1",
        "name": "Lena Hartmann",
        "number": "040-7182934"
    },
    {
        "id": "2",
        "name": "Noah Bennett",
        "number": "39-52-1847261"
    },
    {
        "id": "3",
        "name": "Maya Thompson",
        "number": "12-63-927415"
    },
    {
        "id": "4",
        "name": "Elias Novak",
        "number": "39-27-5813042"
    },
    {
        "id": "5",
        "name": "Sofia Andersson",
        "number": "070-3468291"
    },
    {
        "id": "6",
        "name": "Jonas Miller",
        "number": "08-715-3926"
    },
    {
        "id": "7",
        "name": "Amira Collins",
        "number": "073-481-9265"
    },
    {
        "id": "8",
        "name": "Theo Martinez",
        "number": "31-48-2751936"
    },
    {
        "id": "9",
        "name": "Nora Fischer",
        "number": "040-5928174"
    },
    {
        "id": "10",
        "name": "Leo Campbell",
        "number": "076-238-5149"
    }
];


morgan.token(
    'test-token',
    request => {
        if (request.method === 'POST') { return JSON.stringify(request.body);}
        return '';
    }
);
morgan.format(
    'test-format',
    ':method :url :status :response-time ms :test-token'
);

const app = express();
app.use(express.json())
app.use(morgan('test-format'));


// 1. Helper methods
const generateId = () => {
    let id;
    do {
        id = String(Math.floor(Math.random() * 1000000000));
    } while (persons.some(person => person.id === id));
    return id;
};


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
    if (persons.some(person => person.name === name)) {
        return { ok: false, error: 'Name must be unique.' };
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


// 2. API GET methods
app.get('/', (request, response) => {
    return response.status(200).send('<h1>Home page</h1>');
});

app.get('/info', (request, response) => {
    const infoText = (persons.length === 0) ? 'Phonebook is empty.' : `Phonebook has info for ${persons.length} people.`;
    const requestTime = new Date().toLocaleString();

    response.status(200).send(
        `<h3>${infoText}</h3>
        <p><strong>Request time: </strong>${requestTime}</p>`);
});

app.get('/api/persons', (request, response) => {
    response.status(200).json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);

    if (!person) {
        return response.status(404).json({ error: 'Person not found.' });
    }

    return response.status(200).json(person);
});

// 3. API Delete method
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);

    if (!person) {
        return response.status(404).json({ error: 'Person not found.' });
    }

    persons = persons.filter(person => person.id !== id);
    return response.status(204).end();
});


// 4. API post method
app.post('/api/persons', (request, response) => {
    let { name, number } = request.body || {};

    name = formatName(name)
    const nameResult = validateName(name);
    if (!nameResult.ok) {
        return response.status(400).json({ error: nameResult.error });
    }

    number = formatNumber(number)
    const numberResult = validatePhoneNumber(number);
    if (!numberResult.ok) {
        return response.status(400).json({ error: numberResult.error });
    }
    
    const person = {
        id: generateId(),
        name: name,
        number: number
    };
    persons = persons.concat(person);
    return response.status(201).json(person);
})


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    console.log(`API PERSONS: http://localhost:${PORT}/api/persons\n`);
});

