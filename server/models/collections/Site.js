var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Mongoose Schema definition

module.exports = new Schema({
	_id: String,
	_companyId: String,
	_datasetId: String,
	_siteId: String,
	_templateId: String,
	name: String,
	description: String,
	siteAdminId: String,
	domain: String,
	startDate: String,
	endDate: String,
	upTime: String,
	regTime: String,
	licenseKey: String
});