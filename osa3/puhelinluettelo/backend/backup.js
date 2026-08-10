function createDatabaseOld(username, password) 
{
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
            return Promise.resolve();
        },
        disconnect: () => {
            return Promise.resolve();
        },
        getAll: () => {
            return Promise.resolve(persons);
        },
        getById: (id) => {
            return Promise.resolve(persons.find(person => person.id === id));
        },
        getCount: () => {
            return Promise.resolve(persons.length)
        },
        add: (person) => {
            persons = persons.concat(person);
            return Promise.resolve();
        },
        remove: (id) => {
            persons = persons.filter(person => person.id !== id);
            return Promise.resolve();
        },
        update: (id, updatedPerson) => {
            persons = persons.map(person => person.id === id ? updatedPerson : person);
            return Promise.resolve();
        },
        idExists: (id) => {
            return Promise.resolve(persons.some(person => person.id === id));
        },
        nameExists: (name, excludeId = null) => {
            return Promise.resolve(persons.some(person => person.name === name && person.id !== excludeId));
        }
    };
}