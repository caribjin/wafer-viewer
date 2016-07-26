var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Mongoose Schema definition

module.exports = new Schema({
	_id: String,
	name: String,
	createdAt: String,
	updateAt: String
});