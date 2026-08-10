
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dns = require('dns');

// dns.setServers(['1.1.1.1', '8.8.8.8'])


const generateId = require('./utils/generateId.js');
const { formatName, formatNumber } = require('./utils/formatting.js');
const { validateName, validateNumber } = require('./utils/validate.js');

function main() {
    const port = (process.env.PORT || 3001);
    const address = (process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`);
    const username = 'fullstack';
    const password = process.argv[2]

    console.log("username: ", username);
    console.log("password: ", password);

    const db = createDatabase(username, password)

    // 1. Connect to DB first
    db.connect().then(() => {

        // 2. Setup Express & Middleware
        const app = express();
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

        // 3. Register Routes
        app.get('/info',                route.getInfo);
        app.get('/api/persons',         route.getPersons);
        app.get('/api/persons/:id',     route.getPerson);
        app.delete('/api/persons/:id',  route.deletePerson);
        app.post('/api/persons',        route.postPerson);
        app.put('/api/persons/:id',     route.putPerson);

        // 4. Start Server
        app.listen(port, () => {
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


function createDatabase(username, password)
{
    const DATABASE = 'phonebook';
    const url = `mongodb+srv://${username}:${password}@cluster0.zicuuua.mongodb.net/${DATABASE}?appName=Cluster0`;
    const PersonModel = mongoose.model('person',
        new mongoose.Schema({
            name: String,
            number: String,
        })
    );

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
        connect: () => {
            mongoose.set('strictQuery',false)
            return mongoose.connect(url, { family: 4 })
        },
        disconnect: () => {
            return mongoose.connection.close();
        },
        getAll: () => {
            return PersonModel.find({})
        },
        getById: (id) => {
            return PersonModel.findById(id);
        },
        getCount: () => {
            return PersonModel.countDocuments()
        },
        add: (person) => {
            const newPerson = new PersonModel({name: person.name, number: person.number})
            return newPerson.save();
        },
        remove: (id) => {
            return PersonModel.findByIdAndDelete(id);
        },
        update: (id, updatedPerson) => {
            return PersonModel.findByIdAndUpdate(id, result => {

            });
        },
        idExists: (id) => {
            return Promise.resolve(persons.some(person => person.id === id));
        },
        nameExists: (name, excludeId = null) => {
            return Promise.resolve(persons.some(person => person.name === name && person.id !== excludeId));
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
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: 'Internal server error' });
        });
    },

    getPersons: (request, response) => {
        db.getAll()
            .then(results => {
                return response.status(200).json(results)
            })
            .catch(err => {
                console.error(err);
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
            .catch(err => {
                console.error(err);
                return response.status(500).json({ error: 'Internal server error' });
            });
    },

    deletePerson: (request, response) => {
        const id = request.params.id;

        db.getById(id)
            .then(person => {
                if (!person) {
                    return response.status(404).json({ error: 'Person not found.' });
                }
                return db.remove(id).then(() => {
                    return response.status(204).end();
                });
            })
            .catch(err => {
                console.error(err);
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
                id: generateId(),
                name: name,
                number: number
            };
            return db.add(person).then(() => {
                return response.status(201).json(person);
            });
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: 'Internal server error' });
        });
    },

    putPerson: (request, response) => {
        const id = request.params.id;
        let { name, number } = request.body || {};

        db.getById(id)
            .then(person => {
                if (!person) {
                    return response.status(404).json({ error: "Person not found!" });
                }

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

                return db.nameExists(name, id).then(exists => {
                    if (exists) {
                        return response.status(400).json({ error: 'Name must be unique.' });
                    }

                    const updatedPerson = {
                        id: id,
                        name: name,
                        number: number
                    };

                    return db.update(id, updatedPerson).then(() => {
                        return response.status(200).json(updatedPerson);
                    });
                });
            })
            .catch(err => {
                console.error(err);
                return response.status(500).json({ error: 'Internal server error' });
            });
    }
});


main();