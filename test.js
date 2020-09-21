//initial
const mongoose = require('mongoose');

//connect
mongoose.connect('mongodb://localhost:27017/data', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//monitor session
const db = mongoose.connection;

//check error
db.on('error', (error) => console.log(error));

//monitor
db.once('open', async () => {
    console.log('db is successfully connected');

    const Schema = mongoose.Schema;
    const AnimalSchema = new Schema({
        type: { type: String, default: "goldfish" },
        size: String,
        color: { type: String, default: "golden" },
        mass: { type: Number, default: 0.007 },
        name: { type: String, default: "Angela" }
    });

    const getAnimal = function(callback) {
		//this == document
		return Animal.find(callback);
	}

    const Animal = mongoose.model('Animal', AnimalSchema);
    var elephant = new Animal({
        type: "elephant",
        color: "gray",
        mass: 6000,
        name: "Lawrence"
    });

    var animal = new Animal({}); //Goldfish

    var whale = new Animal({
        type: "whale",
        mass: 190500,
        name: "Fig"
    })

    var animalData = [
        {
            type: "mouse",
            color: "gray",
            mass: 0.035,
            name: "Marvin"
        },
        {
            type: "nutria",
            color: "brown",
            mass: 6.35,
            name: "Gretchen"
        },
        {
            type: "wolf",
            color: "gray",
            mass: 45,
            name: "Iris"
        },
        elephant,
        animal,
        whale
    ];
    try {
        Animal.deleteMany({}, (err) => {
            if (err) console.error(err);
        });
        await Animal.create(animalData, (err, animals) => {
            if (err) console.error(err);
        })
        await getAnimal({}, (err) => {
            if (err) console.error(err);

        })
            .then(d => console.log(d))
            .catch((e) => console.log(e))
        db.close(() => console.log('db is closed'));
    } catch (err) {
        console.log(err)
    }
})