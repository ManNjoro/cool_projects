const mongoose = require('mongoose')
const express = require('express')
const Joi = require('joi')
const router = express.Router()

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to mongodb...'))
    .catch((err) => console.error(err))

const genres = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})


// const genres = [
//     { id: 1, name: 'Action' },
//     { id: 2, name: 'Drama' },
//     { id: 3, name: 'Comedy' },
// ];
const Genre = mongoose.model('Genre', genres)

const createGenres = async(genre) => {
    const result = new Genre(genre)

    return await result.save()
    // console.log('Genre created:', result)
}

// createGenres()

const fetchGenres = async() => {
    return await Genre.find().sort('name')
    // console.log('Genres:', genres)
}

// fetchGenres()

const updateGenre = async(id, kwargs) => {
    const genre = await Genre.findByIdAndUpdate(
        id,
        {$set: kwargs},
        { new: true }
    )
    return genre
}

// updateGenre('67952c648b5a89d91f99a1b6')

const deleteGenre = async (id) => {
    const genre = await Genre.findByIdAndDelete(id)
    return genre
}

// deleteGenre('67952c648b5a89d91f99a1b6')

function validateGenres(genre) {
    const schema = Joi.object({
        name: Joi.string().required()
    })
    return schema.validate(genre)
}

router.get('/', async (req, res) => {
    const result = await fetchGenres()
    res.send(result)
})

router.get('/:id', (req, res)=> {
    const genre = genres.find(genre => genre.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send('The genre with the given ID was not found.')
    res.send(genre)
})

router.post('/', async (req, res) => {
    const {error} = validateGenres(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const genre = {
        name: req.body.name
    }
    try {
        res.send(await createGenres(genre))   
    } catch (error) {
        console.log(error)
    }
    
    // genres.push(genre)
})

router.put('/:id', async(req, res) => {
    const result = await fetchGenres()
    console.log(result);
    console.log(typeof req.params.id)
    const genre = result.find(genre => genre._id == req.params.id)
    if (!genre) return res.status(404).send('The genre with the given ID was not found.')
        
    const {error} = validateGenres(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    
    // genre.name = req.body.name
    const updated = await updateGenre(req.params.id, {name: req.body.name})
    res.send(updated)
})

router.delete('/:id', async(req, res) => {
    const result = await fetchGenres()
    const genre = result.find(genre => genre.id == req.params.id)
    if (!genre) return res.status(404).send('The genre with the given ID was not found.')

    // const index = genres.indexOf(genre)
    // genres.splice(index, 1)
    const deleted = await deleteGenre(req.params.id)
    res.send(deleted)
})

module.exports = router;