//initial setup
const mongoose = require('mongoose');

//connects to mongoose
mongoose.connect('mongodb+srv://plantsUser:' + secret + '@cluster0.kjhuc.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//monitors mongoose db connection
const db = mongoose.connection;

//listens to error
db.on('error', (error) => {
    console.log('error', error)
})

//listens to connection
db.once('open', async () => {
    console.log('db is connected');

    //creates a schema object
    const schema = mongoose.Schema;

    //creates a class object
    const plant = new schema({
        name: String,
        type: String
    })

    //creates a collection model
    const plants = mongoose.model('plants', plant);

    //creates an object and values
    const flowers = new plants({
        name: 'Rose',
        type: 'Flowers'
    });

    const carrots = new plants({
        name: 'Carrot',
        type: 'Vegetable'
    })

    //delete all collections
    await plants.deleteMany({});

    //saves carrot collection
    await carrots.save()
        .then((carrot) => {
            console.log('saved carrot: ' + carrot);
        })
        .catch((err) => {
            console.log('error: ' + err);
        });

    //saves flower collection
    await flowers.save()
        .then(() => console.log('saved flower: '))
        .catch((err) => console.log('error: '));

    //read from db
    //find one from plants
    await plants.find({name: "Rose"}, (err, flower) => {
        flower.map(f => console.log(f.name + ' and ' + f.type))
    })
    //find all from plants
    await plants.find().then(p => console.log('All Plants: ', p));
    //close database
    db.close(() => console.log('db is closed'));
});