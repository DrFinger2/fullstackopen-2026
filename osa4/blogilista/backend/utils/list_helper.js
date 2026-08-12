function dummy(blogs) {
    return 1
}

function totalLikes(blogs) {
    const likes = blogs.reduce((sum, blog) => (sum + blog.likes), 0)
    return likes
}

function favoriteBlog(blogs) {
    const blog = blogs.reduce((favorite, blog) => {
        return blog.likes > favorite.likes ? blog : favorite
    }, blogs[0])
    return blog
}

function mostBlogs(blogs) {
    const counts = {}
    let max = 0
    for (const blog of blogs) {
        counts[blog.author] = (counts[blog.author] || 0) + 1
        const count = counts[blog.author]
        if (count > max) max = count
    }

    const result = []
    for (const author in counts) {
        if (counts[author] === max) result.push({ author: author, blogs: max })
    }
    return result.at(0)
}

function mostLikes(blogs) {
    const likes = {}
    let max = 0
    for (const blog of blogs) {
        const amount = (likes[blog.author] || 0) + blog.likes
        likes[blog.author] = amount
        if (amount > max) max = amount
    }

    const result = []
    for (const author in likes) {
        if (likes[author] === max) result.push({ author: author, likes: max })
    }
    return result.at(0)
}


module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }