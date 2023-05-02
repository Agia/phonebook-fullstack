const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('You need to enter your DB password as an argument');
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://elects-tarsals:${password}@fso.x2cudvp.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema);

const person = new Person({
    name: 'Poison Ivy',
    number: '213-345-334',
})


if(process.argv.length > 3) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then((result) => {
        console.log(`Added ${person.name} with number ${person.number} to the phonebook`);
        mongoose.connection.close()
    })
} else if(process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("Phonebook")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
