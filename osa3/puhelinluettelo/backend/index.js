
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { Person, connect, disconnect } = require('./models/person.js')
const { formatName, formatNumber } = require('./utils/formatting.js');
const { validateName, validateNumber } = require('./utils/validate.js');


function main() {
    const port = process.env.PORT || 3001;
    const address = (process.env.RENDER_EXTERNAL_URL || process.env.EXTERNAL_URL);
    const url = process.env.MONGODB_URI
    const db = createDatabase(url)
    
    // 1. Connect to DB
    db.connect().then(() => {
        // 2. Setup Express & Middleware
        const app = express();
        const route = createRoute(db);
        
        morgan.token('test-token', request => {
            if (request.method === 'POST' || request.method === 'PUT') {
                return JSON.stringify(request.body);
            }
            else {
                return '';
            }
        });

        morgan.format(
            'test-format',
            ':method :url :status :response-time ms :test-token'
        );

        app.use(express.static('dist'));
        app.use(express.json({ limit: '10kb' })); // I read that this is probably good idea to do
        app.use(morgan('test-format'));

        // 3. Register Routes
        app.get('/info',                route.getInfo);
        app.get('/api/persons',         route.getPersons);
        app.get('/api/persons/:id',     route.getPerson);
        app.delete('/api/persons/:id',  route.deletePerson);
        app.post('/api/persons',        route.postPerson);
        app.put('/api/persons/:id',     route.putPerson);

        // 4. Start Server
        const server = app.listen(port, () => {
            console.log(`Server running on port: ${port}`);
            console.log(`Host Address: ${address}\n`);
        });
    
        // 5. Shutdown
        process.on('SIGINT', () => {
            console.log('Shutting down...');
            server.close(() => {
                db.disconnect().then(() => {
                    console.log('MongoDB connection closed');
                    process.exit(0);
                });
            });
        });
    })
    .catch(error => {
        console.error('MongoDB connection failed:');
        console.error(error);
    });
    
}


function createDatabase(url)
{
    return {
        connect: () => {
            return connect(url);
        },
        disconnect: () => {
            return disconnect();
        },
        getAll: () => {
            return Person.find({})
        },
        getById: (id) => {
            return Person.findById(id);
        },
        getCount: () => {
            return Person.countDocuments()
        },
        add: (person) => {
            const newPerson = new Person(person)
            return newPerson.save();
        },
        remove: (id) => {
            return Person.findByIdAndDelete(id);
        },
        update: (id, updatedPerson) => {
            return Person.findByIdAndUpdate(id, updatedPerson, { new: true });
        },
        idExists: (id) => {
            return Person.exists({ _id: id }).then(result => result != null);
        },
        nameExists: (name) => {
            return Person.exists({ name: name }).then(result => result != null);
        }
    };
}



const createRoute = (db) => ({
    getInfo: (request, response) => {
        db.getCount()
        .then(count => {
            const infoText = count === 0 ? 'Phonebook is empty.': `Phonebook has info for ${count} people.`;
            const requestTime = new Date().toLocaleString();
            return response.status(200).send(
                `<h3>${infoText}</h3>
                <p><strong>Request time: </strong>${requestTime}</p>`
            );
        })
        .catch(error => {
            console.error(error);
            return response.status(500).json({ error: 'Internal server error' });
        });
    },

    getPersons: (request, response) => {
        db.getAll()
            .then(results => {
                return response.status(200).json(results)
            })
            .catch(error => {
                console.error(error);
                return response.status(500).json({ error: 'Internal server error' });
            });
    },

    getPerson: (request, response) => {
        const id = request.params.id;
            
        db.getById(id)
            .then(person => {
                if (!person) return response.status(404).json({ error: 'Person not found.' });
                return response.status(200).json(person);
            })
            .catch(error => {
                console.error(error);
                return response.status(500).json({ error: 'Internal server error' });
            });
    },

    deletePerson: (request, response) => {
        const id = request.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return response.status(400).json({ error: 'Malformed id.' });
        }

         // simplified db calls findByidAndDelete, so there is no need to check if id exists.
        db.remove(id)
            .then(person => {
                if (!person) {
                    return response.status(404).json({ error: 'Person not found.' });
                }
                return response.status(204).end();
            })
            .catch(error => {
                console.error(error);
                return response.status(500).json({ error: 'Internal server error' });
            });
    },

    postPerson: (request, response) => {
        let { name, number } = request.body || {};
        
        const nameResult = validateName(name);
        if (!nameResult.ok) {
            return response.status(400).json({ error: nameResult.error });
        }

        const numberResult = validateNumber(number);
        if (!numberResult.ok) {
            return response.status(400).json({ error: numberResult.error });
        }

        name = formatName(name);
        number = formatNumber(number);

        db.nameExists(name).then(exists => {
            if (exists) {
                return response.status(400).json({ error: 'Name must be unique.' });
            }
            const person = {
                name: name,
                number: number
            };
            return db.add(person).then((result) => {
                return response.status(201).json(result);
            });
        })
        .catch(error => {
            console.error(error);
            return response.status(500).json({ error: 'Internal server error' });
        });
    },

    putPerson: (request, response) => {
        const id = request.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return response.status(400).json({ error: 'Malformed id.' });
        }

        const { number } = request.body || {};

        const numberResult = validateNumber(number);
        if (!numberResult.ok) {
            return response.status(400).json({ error: numberResult.error });
        }

        const updatedPerson = { number: formatNumber(number) };

        db.update(id, updatedPerson)
            .then((person) => {
                if (!person) {
                    return response.status(404).json({ error: "Person not found!" });
                }
                return response.status(200).json(person);
            })
            .catch(error => {
                console.error(error);
                return response.status(500).json({ error: 'Internal server error' });
            });
    }
});


main();