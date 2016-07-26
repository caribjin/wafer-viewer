var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
	_id: String,
	objectId: String,
	objectType: String,
	position: {
		lat: Number,
		lng: Number
	},
	children: Array,
	zoomLevel: Number
}, {
	collection: 'objects'
});
