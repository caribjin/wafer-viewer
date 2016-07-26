var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Mongoose Schema definition

module.exports = new Schema({
	_id: String,
	name: String,
	// description : String,
	// address : String,
	// email : String,
	// phone : String,
	createdAt: String,
	updateAt: String
});
