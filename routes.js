const express = require('express');
const router = express.Router();
const Question = require('./models').Question;

//Helper functions
router.param("qId", function (req, res, next, id) {
    Question.findById(id, function (err, doc) {
        if (err) return next(err);
        if (!doc) {
            err = new Error('Not found');
            err.status = 404;
            return next(err)
        }
        req.question = doc;
        return next(err);
    });
});

router.param("aId", function (req, res, next, id) {
    req.answer = req.question.answers.id(id);
    if (!req.answer) {
        err = new Error('Not found');
        err.status = 404;
        return next(err);
    }
    next();
})

/** Handles All Routes to the Questions */
//Get request to the url http://localhost:3000/questions
//handles all questions
router.get('/', (req, res, next) => {
    //test 500 internal errors in error handler: const p = object.prop;

    //finds all questions and sort by lastest created date, null is required for mongodb projection, used before the callback
    Question.find({}) //finds all questions
        .sort({ createdAt: -1 }) //sorts by lastest date
        .exec(function (err, questions) { //execute the query
            if (err) return next(err);
            res.json({ questions });
        });
})

//Get request to the url http://localhost:3000/questions/:qId
//handles 1 question with the requested id
router.get('/:qId', (req, res) => {
    res.json(req.question);
});

//Post request to the url http://localhost:3000/questions
//Creates a question
router.post('/', (req, res, next) => {
    const question = new Question(req.body);
    question.save((err, question) => {
        if (err) next(err);
        res.status(201).json(question);
    })
})

/** Handles all routes to the Answers */
//Post request to the url http://localhost:3000/questions/:qId/answers
//Creates an answer
router.post('/:qId/answers', (req, res) => {
    req.question.answers.push(req.body);
    req.question.save((err, question) => {
        if (err) next(err);
        res.status(201).json(question);
    })
})

//update request to the url http://localhost:3000/questions/:qId/answers/:id
//change an answer
router.put('/:qId/answers/:aId', (req, res, next) => {
    //uses the update instance message
    req.answer.update(req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
})

//delete request to the url http://localhost:3000/questions/:qId/answers/:id
//change a question
router.delete('/:qId/answers/:aId', (req, res, next) => {
    req.answer.remove(function (err) {
        req.question.save(function (err, question) {
            if (err) return next(err);
            res.json(question);
        });
    })
})

//**Handles route to vote*/
//Post a vote up
//post a vote  down
//vote on a specific answer
router.post('/:qId/answers/:aId/vote-:dir',
    //anonmyous function, but cannot be another arrow () => function, is used to handle and catch /vote-:dir error 
    function (req, res, next) {
        //checks if req.params.dir is the string 'up' or 'down'
        if (req.params.dir.search(/^(up|down)$/) === -1) {
            const err = new Error('Must be an up vote or down vote');
            err.status = 404;
            next(err);
        } else {
            //passes to the next middleware
            req.vote = req.params.dir;
            next();
        }
    },
    function (req, res, next) {
        req.answer.vote(req.vote, function (err, question) {
            if (err) return next(err);
            res.json(question);
        })
    })


module.exports = router;