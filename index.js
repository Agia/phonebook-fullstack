/* eslint-disable indent */
/* eslint-disable semi */
const express = require('express');
// Create Express server
const app = express();
const cors = require('cors');
require('dotenv').config();

const Person = require('./models/person');

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method);
	console.log('Path:  ', request.path);
	console.log('Body:  ', request.body);
	console.log('Status: ', request.status);
	console.log('---');
	next();
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'Unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'Incorrectly formatted id' })
	} else if(error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	next(error)
}

// Use cors middleware to allow cross port interaction between front and backend
app.use(cors())
// Enable parsing json with built-in express middleware json-parser
app.use(express.json())
app.use(requestLogger)
// Use built-in express middleware for serving static content (index.html, js, etc.) - each GET request, express will look in 'build' dir for relevant files
app.use(express.static('build'))

//GET request to response with basic <h1> HTML
// app.get('/', (request, response) => {
// 	response.send('<h1>Phonebook</h1>')
// });

// GET request to response with 'persons' data from database
app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons)
	})
})

// GET request response with current date and time, and HTML with current count of 'people' entries in database
app.get('/info', (request, response) => {
	const now = new Date();
	// response.send(`<h3>Phonebook has ${persons.length} entries.</h3><p>${now}</p>`)
	const count = Person.runCommand({ count: 'people' })
	// const docCount = Person.getCollection('phonebook');
	// docCount.count();
	// const count = Person.aggregate([{ $count: 'n' }]);
	response.send(`<p>Phonebook has ${count} entries in it's database, at the current time of ${now}</p>`)
});

// GET request to particular phonebook entry (e.g. /api/persons/3 should return the entry of id 3)
app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body;

	// const person = {
	// 	name: body.name,
	// 	number: body.number,
	// };

	Person.findByIdAndUpdate(request.params.id,
		{ name, number },
		{
			new: true,
			runValidators: true,
			context: 'query'
		})
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

app.post('api/persons', (request, response, next) => {
	const body = request.body;

	// Error check that both name and number values are present
	// if (!body.name && !body.number) {
	// 	return response.status(400).json({
	// 		error: 'No content in body.',
	// 	});
	// 	// Error check if either name or number is missing
	// } else if (!body.name || !body.number) {
	// 	return response.status(400).json({
	// 		error: 'The entry is missing the name or number value.',
	// 	});
		// Error check that name isn't already in the phonebook
		// } else if (persons.find((person) => person.name === body.name)) {
		// 	return response.status(400).json({
		// 		error: 'This name already exists in the database.',
		// 	});
	// }

	// Creates a person object
	const person = new Person({
		name: body.name,
		number: body.number,
	});

	// Adds the person object to the 'persons' collection
	person.save()
	.then((newPerson) => {
		response.json(newPerson);
	})
	.catch((error) => next(error))
})

app.use(unknownEndpoint);
app.use(errorHandler);

// Creates a server on the assigned PORT variable and adds a console.log
const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

// module.exports = app;




// Use cors middleware to allow cross port interaction between front and backend

// // GET request to particular phonebook entry (e.g. /api/persons/3 should return the entry of id 3)
// app.get('/api/persons/:id', (request, response) => {
//     // Ensure id is converted to number type, for comparison
//     const id = Number(request.params.id)
//     // Search array for an id match to url :id, and return that data if found or an error if not
//     const person = persons.find(person => person.id === id)
//     if(person) {
//         response.json(person)
//     } else {
//         return response.status(404).json({
//             error: 'No entry with that ID'
//         })
//     }

// })

// // DELETE request which filters the 'persons' array, discounting any match, then returns
// app.delete('/api/persons/:id', (request, response) => {
// 	const id = Number(request.params.id);
// 	const persons = persons.filter((person) => person.id !== id);

// 	response.status(204).end();
// });

// // Generates a random(ish) ID
// const generateId = () => {
// 	return Math.floor(Math.random() * 100000);
// };

// // POST request to add new entries to the phonebook
// app.post('/api/persons', (request, response) => {
//     // Saves the request body to variable
// 	const body = request.body;

//     // Error check that both name and number values are present
// 	if (!body.name && !body.number) {
// 		return response.status(400).json({
// 			error: 'No content in body.',
// 		});
//         // Error check if either name or number is missing
// 	} else if(!body.name || !body.number) {
//         return response.status(400).json({
//             error: "The entry is missing the name or number value."
//         })
//         // Error check that name isn't already in the phonebook
//     } else if (persons.find((person) => person.name === body.name)) {
// 		return response.status(400).json({
// 			error: 'This name already exists in the database.',
// 		});
// 	}

//     // Creates a person object wtih random ID
// 	const person = {
// 		id: generateId(),
// 		name: body.name,
//         number: body.number
// 	};

//     // Adds the person object to the 'persons' array
// 	persons = persons.concat(person);

//     // Responses with the new person object
// 	response.json(person);
// });
