// Imports
const express = require('express');
const morgan = require('morgan')
const cors = require('cors')

// Create Express server
const app = express();
// Enable parsing json with built-in express middleware json-parser
app.use(express.json())

// Use cors middleware to allow cross port interaction between front and backend
app.use(cors)

// Use built-in express middleware for serving static content (index.html, js, etc.) - each GET request, express will look in 'build' dir for relevant files
app.use(express.static('build'))

// Create a token to print body of request (also uses json-parser)
morgan.token('body', (request) => {
    return JSON.stringify(request.body);
});

// Uses Morgan logger, formatted using 'tiny' spec, plus :body token created above
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :body'
	)
);

// Data array
let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

// GET request to response with basic <h1> HTML
app.get('/', (request, response) => {
	response.send('<h1>Phonebook</h1>');
});

// GET request to response with 'persons' data array
app.get('/api/persons', (request, response) => {
	response.json(persons);
});

// GET request response with current date and time, and HTML with current length of 'persons' array / entries in phonebook
app.get('/info', (request, response) => {
    const now = new Date()
    response.send(`<h3>Phonebook has ${persons.length} entries.</h3><p>${now}</p>`)
})

// GET request to particular phonebook entry (e.g. /api/persons/3 should return the entry of id 3)
app.get('/api/persons/:id', (request, response) => {
    // Ensure id is converted to number type, for comparison
    const id = Number(request.params.id)
    // Search array for an id match to url :id, and return that data if found or an error if not
    const person = persons.find(person => person.id === id)
    if(person) {
        response.json(person)
    } else {
        return response.status(404).json({
            error: 'No entry with that ID'
        })
    }

})

// DELETE request which filters the 'persons' array, discounting any match, then returns
app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

// Generates a random(ish) ID
const generateId = () => {
	return Math.floor(Math.random() * 100000);
};

// POST request to add new entries to the phonebook
app.post('/api/persons', (request, response) => {
    // Saves the request body to variable
	const body = request.body;

    // Error check that both name and number values are present
	if (!body.name && !body.number) {
		return response.status(400).json({
			error: 'No content in body.',
		});
        // Error check if either name or number is missing
	} else if(!body.name || !body.number) {
        return response.status(400).json({
            error: "The entry is missing the name or number value."
        })
        // Error check that name isn't already in the phonebook
    } else if (persons.find((person) => person.name === body.name)) {
		return response.status(400).json({
			error: 'This name already exists in the database.',
		});
	}

    // Creates a person object wtih random ID
	const person = {
		id: generateId(),
		name: body.name,
        number: body.number
	};

    // Adds the person object to the 'persons' array
	persons = persons.concat(person);

    // Responses with the new person object
	response.json(person);
});

// Creates a server on the assigned PORT variable and adds a console.log
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});