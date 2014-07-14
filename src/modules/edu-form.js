// Main eduCrud Module

//Declare app level module which depends on filters, and services
var eduFormServices = angular.module('edu-form.services', []);
var eduFormDirectives = angular.module('edu-form.directives', []);
var eduFormFilters = angular.module('edu-form.filters', []);
var eduFormTpl=angular.module('edu-form.tpl',[]);
// initialization of services into the main module
angular.module('eduForm', ['edu-form.services', 'edu-form.directives', 'edu-form.filters','edu-form.tpl','ngResource','ui.bootstrap','eduField']);