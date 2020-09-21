'use strict';

//initial setup
const mongoose = require('mongoose');

//schema
const Schema = mongoose.Schema;

//compare answers
var sortAnswers = function(a, b) {
	//- negative a before b
	//0 no change
	//+ positive a after b
	if(a.votes === b.votes){
		return b.updatedAt - a.updatedAt; //returns latest updated
	}
	return b.votes - a.votes; //biggest index in vote
}

const AnswerSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    votes: {type: Number, default: 0}
})
//returns updated answer with a new date and save it to the parent
AnswerSchema.method("update", function(updates, callback){
    Object.assign(this, updates, {updateAt: new Date()})
    this.parent().save(callback);
});

//returns vote as +1, or -1
AnswerSchema.method("vote", function(vote, callback) {
	if(vote === "up") {
		this.votes += 1;
	} else {
		this.votes -= 1;
	}
	this.parent().save(callback);
});


var QuestionSchema = new Schema({
	text: String,
	createdAt: {type: Date, default: Date.now},
	answers: [AnswerSchema]
});

//returns a sorted answer by most updatedAt date or biggest index
QuestionSchema.pre("save", function(next){
	this.answers.sort(sortAnswers);
	next();
});

//model assignment
const Question = mongoose.model('Question', QuestionSchema);

//exports the function
module.exports.Question = Question;