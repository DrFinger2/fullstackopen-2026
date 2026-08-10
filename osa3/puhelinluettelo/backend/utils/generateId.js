const generateId = () => {
    // Got rid of the db dependency, now there is chance of collision but its pretty low
    // Probably need to come up with something better in the future?
    return String(Math.floor(Math.random() * 1000000000));
};

module.exports = generateId;