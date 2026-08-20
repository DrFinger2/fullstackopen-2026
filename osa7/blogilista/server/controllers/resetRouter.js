const router = require('express').Router()
const resetUsers = require('../seeding/resetUsers')
const resetBlogs = require('../seeding/resetBlogs')

router.post('/reset', async (request, response) => {
    await resetUsers()
    await resetBlogs()
    response.status(204).end()
})

module.exports = router