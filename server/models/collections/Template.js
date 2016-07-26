var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Mongoose Schema definition

module.exports = new Schema({
	_id: String,
	name: String,
	description: String,
	modules: Array,
	// address : String,
	// email : String,
	// phone : String,
	entry: Number,
	createdAt: String,
	updateAt: String
});