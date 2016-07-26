module.exports = new n.data.Store('objects', {
	connection: {
		read: '',
		save: ''
	},

	/**
	 * Mapper db의 object list load
	 * @param siteId
	 * @param callback
	 */
	read: function(siteId, callback) {
		var param = {
			siteId: siteId
		};

		this.call('object.read', param, function(res) {
			callback(res);
		});
	},

	/**
	 * Mapper db에 Object list save
	 * @param siteId
	 * @param objects
	 * @param callback
	 */
	save: function(siteId, objects, callback) {
		var param = {
			siteId: siteId,
			objects: objects
		};

		this.call('object.save', param, function(res) {
			callback(res);
		});
	},

	/**
	 * Mapper db에서 Object들을 제거
	 * @param siteId
	 * @param objects
	 * @param callback
	 */
	remove: function(siteId, objects, callback) {
		var param = {
			siteId: siteId,
			objects: objects
		};

		this.call('object.remove', param, function(res) {
			callback(res);
		});
	},

	/**
	 * ADP에서 Object detail 정보를 load
	 * @param siteId
	 * @param objectId
	 * @param callback
	 */
	detail: function(siteId, objectId, callback) {
		var param = {
			databaseKey: siteId,
			dataKey: objectId
		};

		this.call('object.detail', param, function(res) {
			callback(res);
		});
	}
});
