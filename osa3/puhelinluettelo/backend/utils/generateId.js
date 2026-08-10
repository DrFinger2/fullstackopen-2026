const generateId = (db) => {
    const MAX_ITERS = 100;
    const iterations = 0;
    let id;
    do {
        if (iterations >= MAX_ITERS) {
            let id = null;
            break;
        }
        id = String(Math.floor(Math.random() * 1000000000));
    }
    while (db.idExists(id));
    return id;
};

module.exports = generateId;