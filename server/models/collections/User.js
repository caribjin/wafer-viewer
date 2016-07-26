var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
// Mongoose Schema definition
var saltRounds = 10;

var User = new Schema({
	_id: String,
	_siteId: String,

	profile: {
		name: String,
		password: String,
		mobile: String,
		email: String,
		memberType: String,
		description: String,
		authentication: String,

		userLicense: String,
		isLdapAdmin: Boolean,
		clientAccessRight: String
	},
	createdAt: Date,
	status: {
		online: Boolean
	}
});

User.pre('save', function(next) {
	var me = this;
	if (!this.createdAt) this.createdAt = new Date;

	bcrypt.genSalt(saltRounds, function(err, salt) {
		bcrypt.hash(me.profile.password, salt, function(err, hash) {
			// Store hash in your password DB.

			if (hash) {
				me.profile.password = hash;

				next();
			}
		});
	});
});

User.methods.validPassword = function(pwd, _callback) {
	//bcrypt.compare(pwd, this.password, _callback);

	return bcrypt.compareSync(pwd, this.profile.password); // true
	// return pwd == this.profile.password
};


module.exports = User;