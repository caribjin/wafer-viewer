var http = require('http');
var requireDirectory = require('require-directory');
var _ = require('lodash');
var modules = requireDirectory(module, './modules');
var ddp = require('./ddp')(modules);

module.exports = function(app, config, logger) {
	// for test
	// modules.ObjectType['objectType.list']({}, function() {
	// modules.Editor['...']({}, function() {
	//
	//   console.log('callback!!!!   : ', arguments[0].result);
	// });

	return {
		api: modules,
		ddp: ddp
	};
};


// for test
// modules.Object['object.list']({}, function() {
// modules.Object['object.list']({}, function() {
// modules.Object['object.list']({}, function() {

// modules.ObjectType['ObjectType/Search']({}, function() {
// modules.ObjectType['ObjectType/Set']({}, function() {
// modules.ObjectType['ObjectType/Delete']({}, function() {

// modules.MetricTemplate['MetricTemplate/NameList']({}, function() {
// modules.MetricTemplate['MetricTemplate/Read']({}, function() {
// modules.MetricTemplate['MetricTemplate/Create']({}, function() {
// modules.MetricTemplate['MetricTemplate/UpdateMetricTableTemplate']({}, function() {
// modules.MetricTemplate['MetricTemplate/Delete']({}, function() {

// modules.Metric['Metric/Update']({}, function() {
// modules.Metric['Metric/Delete']({}, function() {

// modules.MetricConditionTemplate['MetricTemplateCondition/ReadAll']({}, function() {
// modules.MetricConditionTemplate['MetricTemplateCondition/Create']({}, function() {
// modules.MetricConditionTemplate['MetricTemplateCondition/Update']({}, function() {
// modules.MetricConditionTemplate['MetricTemplateCondition/Delete']({}, function() {

// modules.Map['RefList/Get/Page']({}, function() {
// modules.Map['RefList/Get/Step']({}, function() {
// modules.Map['Map_RefList/Set']({}, function() {

// modules.MapTemplate['Map/Get']({}, function() {
// modules.MapTemplate['List/Add']({}, function() {
// modules.MapTemplate['Map_RefList/Del']({}, function() {

// modules.MapTreeTemplate['MapTreeTemplate/ReadAll']({}, function() {
// modules.MapTreeTemplate['MapTreeTemplate/Delete']({}, function() {
// modules.MapTreeTemplate['MapTreeTemplate/Update']({}, function() {
// modules.MapTreeTemplate['MapTreeTemplate/Create']({}, function() {
// modules.MapTreeTemplate['MapTreeTemplate/Set']({}, function() {

// modules.PlayerType['PlayerType/Read']({}, function() {
// modules.PlayerType['PlayerType/ReadAll']({}, function() {

// modules.Editor['Script/List']({}, function() {
// modules.Editor['Script/Read']({}, function() {
// modules.Editor['Script/Create']({}, function() {
// modules.Editor['Script/Delete']({}, function() {
// modules.Editor['Script/Update']({}, function() {

//     console.log('callback!!!!   : ', arguments[0].result);
//   });
