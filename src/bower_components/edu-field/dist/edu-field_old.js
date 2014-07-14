// Main eduField Module
//Declare app level module which depends on filters, and services
var eduFieldServices = angular.module('edu-field.services', []);
var eduFieldDirectives = angular.module('edu-field.directives', []);
var eduFieldFilters = angular.module('edu-field.filters', []);
var eduFieldTpl = angular.module('edu-field.tpl', []);
// initialization of services into the main module
angular.module('eduField', [
  'edu-field.services',
  'edu-field.directives',
  'edu-field.filters',
  'edu-field.tpl',
  'ngResource',
  'textAngular',
  'ui.bootstrap'
]);
eduFieldServices.factory('dataFactory', [
  '$resource',
  function ($resource) {
    return function (uri) {
      console.log('dataFactory:' + uri);
      return $resource(uri, {}, {
        getAll: {
          method: 'GET',
          params: {},
          headers: { 'Access-Control-Allow-Credentials': true },
          isArray: true
        },
        getCount: {
          method: 'GET',
          params: {},
          headers: { 'Access-Control-Allow-Credentials': true },
          isArray: false
        },
        get: {
          method: 'GET',
          params: {},
          headers: { 'Access-Control-Allow-Credentials': true },
          isArray: false
        },
        insert: {
          method: 'POST',
          params: {},
          headers: { 'Access-Control-Allow-Credentials': true },
          isArray: false
        },
        update: {
          method: 'PUT',
          params: {},
          headers: { 'Access-Control-Allow-Credentials': true },
          isArray: false
        },
        remove: {
          method: 'DELETE',
          params: {},
          headers: { 'Access-Control-Allow-Credentials': true },
          isArray: false
        }
      });
    };
  }
]);
eduFieldDirectives.directive('eduComplete', [
  '$parse',
  '$http',
  '$sce',
  '$timeout',
  function ($parse, $http, $sce, $timeout) {
    return {
      restrict: 'EA',
      scope: {
        'id': '@id_',
        'name': '@name',
        'onblur': '&onblur',
        'onfocus': '&onfocus',
        'onchange': '&onchange',
        'required': '=required',
        'placeholder': '@placeholder',
        'selectedObject': '=selectedobject',
        'url': '@url',
        'dataField': '@datafield',
        'titleField': '@titlefield',
        'descriptionField': '@descriptionfield',
        'imageField': '@imagefield',
        'imageUri': '@imageuri',
        'inputClass': '@inputclass',
        'userPause': '@pause',
        'localData': '=localdata',
        'searchFields': '@searchfields',
        'minLengthUser': '@minlength',
        'matchClass': '@matchclass'
      },
      template: '<div class="eduComplete-holder"><input id="{{id}}" name="{{name}}"  ng-blur="onblur()" ng-focus="onfocus()" ng-change="onchange()" ng-required="{{required}}" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}}" onmouseup="this.select();" ng-focus="resetHideResults()" ng-blur="hideResults()" /><div id="{{id}}_dropdown" class="eduComplete-dropdown" ng-if="showDropdown"><div class="eduComplete-searching" ng-show="searching">Buscando...</div><div class="eduComplete-searching" ng-show="!searching && (!results || results.length == 0)">No hay resultados</div><div class="eduComplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'eduComplete-selected-row\': $index == currentIndex}"><div ng-if="imageField" class="eduComplete-image-holder"><img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="eduComplete-image"/><div ng-if="!result.image && result.image != \'\'" class="eduComplete-image-default"></div></div><div class="eduComplete-title" ng-if="matchClass" ng-bind-html="result.title"></div><div class="eduComplete-title" ng-if="!matchClass">{{ result.title }}</div><div ng-if="result.description && result.description != \'\'" class="eduComplete-description">{{result.description}}</div></div></div></div>',
      link: function ($scope, elem, attrs) {
        $scope.lastSearchTerm = null;
        $scope.currentIndex = null;
        $scope.justChanged = false;
        $scope.searchTimer = null;
        $scope.hideTimer = null;
        $scope.searching = false;
        $scope.pause = 500;
        $scope.minLength = 3;
        //$scope.searchStr = null;
        // $scope.searchStr="hola capullo";
        console.log('eduComplete valor init:' + $scope.searchStr);
        if ($scope.minLengthUser && $scope.minLengthUser != '') {
          $scope.minLength = $scope.minLengthUser;
        }
        if ($scope.userPause) {
          $scope.pause = $scope.userPause;
        }
        isNewSearchNeeded = function (newTerm, oldTerm) {
          return newTerm.length >= $scope.minLength && newTerm != oldTerm;
        };
        $scope.processResults = function (responseData, str) {
          if (responseData && responseData.length > 0) {
            $scope.results = [];
            var titleFields = [];
            if ($scope.titleField && $scope.titleField != '') {
              titleFields = $scope.titleField.split(',');
            }
            for (var i = 0; i < responseData.length; i++) {
              // Get title variables
              var titleCode = [];
              for (var t = 0; t < titleFields.length; t++) {
                titleCode.push(responseData[i][titleFields[t]]);
              }
              var description = '';
              if ($scope.descriptionField) {
                description = responseData[i][$scope.descriptionField];
              }
              var data = '';
              if ($scope.dataField) {
                data = responseData[i][$scope.dataField];
              }
              var imageUri = '';
              if ($scope.imageUri) {
                imageUri = $scope.imageUri;
              }
              var image = '';
              if ($scope.imageField) {
                image = imageUri + responseData[i][$scope.imageField];
              }
              var text = titleCode.join(' ');
              if ($scope.matchClass) {
                var re = new RegExp(str, 'i');
                var strPart = text.match(re)[0];
                text = $sce.trustAsHtml(text.replace(re, '<span class="' + $scope.matchClass + '">' + strPart + '</span>'));
              }
              //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
              var resultRow = {
                  title: text,
                  description: description,
                  image: image,
                  data: data
                };
              //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
              $scope.results[$scope.results.length] = resultRow;
            }
          } else {
            $scope.results = [];
          }
        };
        $scope.searchTimerComplete = function (str) {
          // Begin the search
          if (str.length >= $scope.minLength) {
            if ($scope.localData) {
              var searchFields = $scope.searchFields.split(',');
              var matches = [];
              for (var i = 0; i < $scope.localData.length; i++) {
                var match = false;
                for (var s = 0; s < searchFields.length; s++) {
                  match = match || typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0;
                }
                if (match) {
                  matches[matches.length] = $scope.localData[i];
                }
              }
              $scope.searching = false;
              $scope.processResults(matches, str);
            } else {
              $http.get($scope.url + str + '&field=' + $scope.TitleField, {}).success(function (responseData, status, headers, config) {
                $scope.searching = false;
                console.log('eduComplete.js responseData:' + responseData + ' dataField:' + $scope.dataField);
                //$scope.processResults((($scope.dataField) ? responseData[$scope.dataField] : responseData ), str);
                $scope.processResults(responseData, str);
              }).error(function (data, status, headers, config) {
                console.log('error');
              });
            }
          }
        };
        $scope.hideResults = function () {
          $scope.hideTimer = $timeout(function () {
            $scope.showDropdown = false;
          }, $scope.pause);
        };
        $scope.resetHideResults = function () {
          if ($scope.hideTimer) {
            $timeout.cancel($scope.hideTimer);
          }
          ;
        };
        $scope.hoverRow = function (index) {
          $scope.currentIndex = index;
        };
        $scope.keyPressed = function (event) {
          if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
            if (!$scope.searchStr || $scope.searchStr == '') {
              $scope.showDropdown = false;
              $scope.lastSearchTerm = null;
            } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
              $scope.lastSearchTerm = $scope.searchStr;
              $scope.showDropdown = true;
              $scope.currentIndex = -1;
              $scope.results = [];
              if ($scope.searchTimer) {
                $timeout.cancel($scope.searchTimer);
              }
              $scope.searching = true;
              $scope.searchTimer = $timeout(function () {
                $scope.searchTimerComplete($scope.searchStr);
              }, $scope.pause);
            }
          } else {
            event.preventDefault();
          }
        };
        $scope.$watch('selectedObject', function (value) {
          if (typeof value !== 'undefined') {
            console.log('eduComplete.js link $scope.selectedObject:' + $scope.selectedObject + ' value:' + value);
            var titleField = '';
            var str = $scope.selectedObject;
            if ($scope.titleField && $scope.titleField != '') {
              titleFields = $scope.titleField.split(',');
            }
            if ($scope.localData) {
              var matches = [];
              for (var i = 0; i < $scope.localData.length; i++) {
                var match = false;
                console.log('eduComplete.js link search in localData:' + i + angular.toJson($scope.localData[i]) + ' ' + $scope.dataField + '==' + str);
                match = typeof $scope.localData[i][$scope.dataField] === 'string' && typeof str === 'string' && $scope.localData[i][$scope.dataField].toLowerCase().indexOf(str.toLowerCase()) >= 0;
                if (match) {
                  //matches[matches.length] = $scope.localData[i];
                  $scope.searchStr = '';
                  for (var t = 0; t < titleFields.length; t++) {
                    if (t == 0) {
                      $scope.searchStr = $scope.localData[i][titleFields[t]];
                    } else {
                      $scope.searchStr = $scope.searchStr + ' ' + $scope.localData[i][titleFields[t]];
                    }
                  }
                  break;
                }
              }
              $scope.searching = false;
            } else {
              $http.get($scope.url + str + '&field=' + $scope.dataField, {}).success(function (data, status, headers, config) {
                $scope.searching = false;
                if (data.length > 0) {
                  $scope.searchStr = '';
                  for (var t = 0; t < titleFields.length; t++) {
                    if (t == 0) {
                      $scope.searchStr = data[0][titleFields[t]];
                    } else {
                      $scope.searchStr = $scope.searchStr + ' ' + data[0][titleFields[t]];
                    }
                  }
                }
              }).error(function (data, status, headers, config) {
                console.log('error');
              });
            }
          }
        });
        $scope.selectResult = function (result) {
          console.log('select result:' + result.title);
          if ($scope.matchClass) {
            result.title = result.title.toString().replace(/(<([^>]+)>)/gi, '');
          }
          $scope.searchStr = $scope.lastSearchTerm = result.title;
          //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          //$scope.selectedObject = result;
          $scope.selectedObject = result.data;
          //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
          $scope.showDropdown = false;
          $scope.results = [];  //$scope.$apply();
        };
        var inputField = elem.find('input');
        inputField.on('keyup', $scope.keyPressed);
        elem.on('keyup', function (event) {
          if (event.which === 40) {
            if ($scope.results && $scope.currentIndex + 1 < $scope.results.length) {
              $scope.currentIndex++;
              $scope.$apply();
              event.preventDefault;
              event.stopPropagation();
            }
            $scope.$apply();
          } else if (event.which == 38) {
            if ($scope.currentIndex >= 1) {
              $scope.currentIndex--;
              $scope.$apply();
              event.preventDefault;
              event.stopPropagation();
            }
          } else if (event.which == 13) {
            if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
              $scope.selectResult($scope.results[$scope.currentIndex]);
              $scope.$apply();
              event.preventDefault;
              event.stopPropagation();
            } else {
              $scope.results = [];
              $scope.$apply();
              event.preventDefault;
              event.stopPropagation();
            }
          } else if (event.which == 27) {
            $scope.results = [];
            $scope.showDropdown = false;
            $scope.$apply();
          } else if (event.which == 8) {
            $scope.selectedObject = null;
            $scope.$apply();
          }
        });
      }
    };
  }
]);
'use strict';
eduFieldDirectives.directive('dynamicName', [
  '$compile',
  function ($compile) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 1000,
      link: function (scope, element, attrs) {
        element.attr('name', scope.$eval(attrs.dynamicName));
        element.removeAttr('dynamic-name');
        $compile(element)(scope);
      }
    };
  }
]);
eduFieldDirectives.directive('dateInput', [
  'dateFilter',
  function (dateFilter) {
    return {
      require: 'ngModel',
      template: '<input type="date"></input>',
      replace: true,
      link: function (scope, elm, attrs, ngModelCtrl) {
        ngModelCtrl.$formatters.unshift(function (modelValue) {
          return dateFilter(modelValue, 'yyyy-MM-dd');
        });
        ngModelCtrl.$parsers.unshift(function (viewValue) {
          return new Date(viewValue);
        });
      }
    };
  }
]);
eduFieldDirectives.directive('dateTimeInput', [
  'dateFilter',
  function (dateFilter) {
    return {
      require: 'ngModel',
      template: '<input type="datetime-local"></input>',
      replace: true,
      link: function (scope, elm, attrs, ngModelCtrl) {
        ngModelCtrl.$formatters.unshift(function (modelValue) {
          return dateFilter(modelValue, 'yyyy-MM-ddTHH:mm');
        });
        ngModelCtrl.$parsers.unshift(function (viewValue) {
          return new Date(viewValue);
        });
      }
    };
  }
]);
eduFieldDirectives.directive('eduField', [
  '$http',
  '$compile',
  '$templateCache',
  function formField($http, $compile, $templateCache) {
    var getTemplateUrl = function (type) {
      var templateUrl = '';
      switch (type) {
      case 'nif':
        templateUrl = 'directives/edu-field-nif.html';
        break;
      case 'iban':
        templateUrl = 'directives/edu-field-iban.html';
        break;
      case 'autocomplete':
        templateUrl = 'directives/edu-field-autocomplete.html';
        break;
      case 'range':
        templateUrl = 'directives/edu-field-range.html';
        break;
      case 'textedit':
        templateUrl = 'directives/edu-field-textedit.html';
        break;
      case 'url':
        templateUrl = 'directives/edu-field-url.html';
        break;
      case 'time':
        templateUrl = 'directives/edu-field-time.html';
        break;
      case 'week':
        templateUrl = 'directives/edu-field-week.html';
        break;
      case 'month':
        templateUrl = 'directives/edu-field-month.html';
        break;
      case 'date':
        templateUrl = 'directives/edu-field-date.html';
        break;
      case 'date-time':
        templateUrl = 'directives/edu-field-date-time.html';
        break;
      case 'textarea':
        templateUrl = 'directives/edu-field-textarea.html';
        break;
      case 'radio':
        templateUrl = 'directives/edu-field-radio.html';
        break;
      case 'select':
        templateUrl = 'directives/edu-field-select.html';
        break;
      case 'number':
        templateUrl = 'directives/edu-field-number.html';
        break;
      case 'checkbox':
        templateUrl = 'directives/edu-field-checkbox.html';
        break;
      case 'password':
        templateUrl = 'directives/edu-field-password.html';
        break;
      case 'hidden':
        templateUrl = 'directives/edu-field-hidden.html';
        break;
      case 'email':
        templateUrl = 'directives/edu-field-email.html';
        break;
      case 'text':
        templateUrl = 'directives/edu-field-text.html';
        break;
      default:
        templateUrl = null;
        break;
      }
      return templateUrl;
    };
    return {
      restrict: 'AE',
      transclude: true,
      scope: {
        optionsData: '&options',
        formId: '@formId',
        formName: '@formName',
        index: '@index',
        value: '=formValue'
      },
      link: function fieldLink($scope, $element, $attr, ctrl) {
        //load the correct template
        var templateUrl = $scope.options.templateUrl || getTemplateUrl($scope.options.type);
        if (templateUrl) {
          $http.get(templateUrl, { cache: $templateCache }).success(function (data) {
            $element.html(data);
            $compile($element.contents())($scope);
          });
        } else {
          console.log('eduField Error: plantilla tipo \'' + $scope.options.type + '\' no soportada.');
        }
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<		
        $scope.$dirty = false;
        $scope.$invalid = false;
        $scope.$invalidRequired = false;
        $scope.$invalidPattern = false;
        $scope.$invalidMinlength = false;
        $scope.$invalidMaxlength = false;
        $scope.$invalidMin = false;
        $scope.$invalidMax = false;
        /*$scope.$watch('value', function() {
			
				console.log("edu-field-text CONTROLLER WATCH value #myFormIdtext0.child:"+$element.find('#'+$scope.id).attr('class'));
				var elementClass=angular.element('#'+$scope.id).attr('class');
				console.log("watch elementClass:"+elementClass + " val:" + $element.find('#'+$scope.id).val());
				if(typeof elementClass!=="undefined"){
				   console.log("no undefinded");
				    var aClass=elementClass.split(" ");
					for(var i=0;i<aClass.length;i++){
						if(aClass[i]==="ng-dirty"){ $scope.$dirty=true; console.log("dirty");}
						else if(aClass[i]=="ng-invalid"){ $scope.$invalid=true;}
						else if(aClass[i]=="ng-invalid-required"){ $scope.$invalidRequired=true;}
						else if(aClass[i]=="ng-invalid-pattern"){ $scope.$invalidPattern=true;}
						else if(aClass[i]=="ng-invalid-minlength"){ $scope.$invalidMinlength=true;}
						else if(aClass[i]=="ng-invalid-maxlength"){ $scope.$invalidMaxlength=true;}
						
						else if(aClass[i]=="ng-valid"){ $scope.$invalid=false;}
						else if(aClass[i]=="ng-valid-required"){ $scope.$invalidRequired=false;}
						else if(aClass[i]=="ng-valid-pattern"){ $scope.$invalidPattern=false;}
						else if(aClass[i]=="ng-valid-minlength"){ $scope.$invalidMinlength=false;}
						else if(aClass[i]=="ng-valid-maxlength"){ $scope.$invalidMaxlength=false;}
					}
				}
			});  
			*/
        /*$scope.onFocus=function() {
			  console.log("edu-field.js CONTROLLER FOCUS id:"+'#'+$scope.id+ " class:" +$element.find('#'+$scope.id).attr('class'));
				var elementClass=angular.element('#'+$scope.id).attr('class');
				if(typeof elementClass!=="undefined"){
				    var aClass=elementClass.split(" ");
					for(var i=0;i<aClass.length;i++){
						if(aClass[i]==="ng-dirty"){ $scope.$dirty=true; console.log("dirty");}
						else if(aClass[i]=="ng-invalid"){ $scope.$invalid=true;}
						else if(aClass[i]=="ng-invalid-required"){ $scope.$invalidRequired=true;}
						else if(aClass[i]=="ng-invalid-pattern"){ $scope.$invalidPattern=true;}
						else if(aClass[i]=="ng-invalid-minlength"){ $scope.$invalidMinlength=true;}
						else if(aClass[i]=="ng-invalid-maxlength"){ $scope.$invalidMaxlength=true;}
						
						else if(aClass[i]=="ng-valid"){ $scope.$invalid=false;}
						else if(aClass[i]=="ng-valid-required"){ $scope.$invalidRequired=false;}
						else if(aClass[i]=="ng-valid-pattern"){ $scope.$invalidPattern=false;}
						else if(aClass[i]=="ng-valid-minlength"){ $scope.$invalidMinlength=false;}
						else if(aClass[i]=="ng-valid-maxlength"){ $scope.$invalidMaxlength=false;}
					}
				}				   
			}*/
        $scope.onChange = function () {
          //console.log("edu-field.js CONTROLLER CHANGE id:"+'#'+$scope.id+ " class:" +$element.find('#'+$scope.id).attr('class'));
          var elementClass = angular.element('#' + $scope.id).attr('class');
          //console.log("onchange blur:"+angular.element('#'+$scope.id).attr('blur'));
          if (typeof elementClass !== 'undefined' && angular.element('#' + $scope.id).attr('blur')) {
            var aClass = elementClass.split(' ');
            for (var i = 0; i < aClass.length; i++) {
              if (aClass[i] === 'ng-dirty') {
                $scope.$dirty = true;
                console.log('dirty');
              } else if (aClass[i] == 'ng-invalid') {
                $scope.$invalid = true;
              } else if (aClass[i] == 'ng-invalid-required') {
                $scope.$invalidRequired = true;
              } else if (aClass[i] == 'ng-invalid-pattern') {
                $scope.$invalidPattern = true;
              } else if (aClass[i] == 'ng-invalid-minlength') {
                $scope.$invalidMinlength = true;
              } else if (aClass[i] == 'ng-invalid-maxlength') {
                $scope.$invalidMaxlength = true;
              } else if (aClass[i] == 'ng-invalid-min') {
                $scope.$invalidMin = true;
              } else if (aClass[i] == 'ng-invalid-max') {
                $scope.$invalidMax = true;
              } else if (aClass[i] == 'ng-valid') {
                $scope.$invalid = false;
              } else if (aClass[i] == 'ng-valid-required') {
                $scope.$invalidRequired = false;
              } else if (aClass[i] == 'ng-valid-pattern') {
                $scope.$invalidPattern = false;
              } else if (aClass[i] == 'ng-valid-minlength') {
                $scope.$invalidMinlength = false;
              } else if (aClass[i] == 'ng-valid-maxlength') {
                $scope.$invalidMaxlength = false;
              }
            }
          }
        };
        $scope.onBlur = function () {
          //console.log("edu-field.js CONTROLLER BLUR id:"+'#'+$scope.id+ " class:" +$element.find('#'+$scope.id).attr('class'));
          var elementClass = angular.element('#' + $scope.id).attr('class');
          angular.element('#' + $scope.id).attr('blur', true);
          if (typeof elementClass !== 'undefined') {
            var aClass = elementClass.split(' ');
            for (var i = 0; i < aClass.length; i++) {
              if (aClass[i] === 'ng-dirty') {
                $scope.$dirty = true;
                console.log('dirty');
              } else if (aClass[i] == 'ng-invalid') {
                $scope.$invalid = true;
              } else if (aClass[i] == 'ng-invalid-required') {
                $scope.$invalidRequired = true;
              } else if (aClass[i] == 'ng-invalid-pattern') {
                $scope.$invalidPattern = true;
              } else if (aClass[i] == 'ng-invalid-minlength') {
                $scope.$invalidMinlength = true;
              } else if (aClass[i] == 'ng-invalid-maxlength') {
                $scope.$invalidMaxlength = true;
              } else if (aClass[i] == 'ng-invalid-min') {
                $scope.$invalidMin = true;
              } else if (aClass[i] == 'ng-invalid-max') {
                $scope.$invalidMax = true;
              } else if (aClass[i] == 'ng-valid') {
                $scope.$invalid = false;
              } else if (aClass[i] == 'ng-valid-required') {
                $scope.$invalidRequired = false;
              } else if (aClass[i] == 'ng-valid-pattern') {
                $scope.$invalidPattern = false;
              } else if (aClass[i] == 'ng-valid-minlength') {
                $scope.$invalidMinlength = false;
              } else if (aClass[i] == 'ng-valid-maxlength') {
                $scope.$invalidMaxlength = false;
              }
            }
          }
        };
      },
      controller: [
        '$scope',
        function fieldController($scope) {
          $scope.ibanValidator = function () {
            //var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
            return {
              test: function (value) {
                return IBAN.isValid(value);
              }
            };
          }();
          $scope.options = $scope.optionsData();
          if ($scope.options.selecttypesource == 'url') {
            $http.get($scope.options.selectsource).success(function (data, status, headers, config) {
              $scope.optionsSelect = data;
              for (var i = 0; i < $scope.optionsSelect.length; i++) {
                if (!$scope.optionsSelect[i].hasOwnProperty('value')) {
                  $scope.optionsSelect[i].value = $scope.optionsSelect[i][$scope.options.optionvalue];
                }
                if (!$scope.optionsSelect[i].hasOwnProperty('name')) {
                  if ($scope.options.selectconcatvaluename) {
                    $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionvalue] + ' - ' + $scope.optionsSelect[i][$scope.options.optionname];
                  } else {
                    $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
                  }
                  delete $scope.optionsSelect[i][$scope.options.optionname];
                  delete $scope.optionsSelect[i][$scope.options.optionvalue];
                } else {
                  if ($scope.options.selectconcatvaluename) {
                    $scope.optionsSelect[i].name = $scope.optionsSelect[i]['value'] + ' - ' + $scope.optionsSelect[i]['name'];
                  } else {
                    $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
                  }
                }
              }
            }).error(function (data, status, headers, config) {
            });
          } else if ($scope.options.selecttypesource == 'array') {
            $scope.optionsSelect = $scope.options.selectsource;
            $scope.$watchCollection('optionsSelect', function () {
              if (typeof $scope.optionsSelect != 'undefined') {
                for (var i = 0; i < $scope.optionsSelect.length; i++) {
                  if (!$scope.optionsSelect[i].hasOwnProperty('value')) {
                    $scope.optionsSelect[i].value = $scope.optionsSelect[i][$scope.options.optionvalue];
                  }
                  if (!$scope.optionsSelect[i].hasOwnProperty('name')) {
                    if ($scope.options.selectconcatvaluename) {
                      $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionvalue] + ' - ' + $scope.optionsSelect[i][$scope.options.optionname];
                    } else {
                      $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
                    }
                    delete $scope.optionsSelect[i][$scope.options.optionvalue];
                    delete $scope.optionsSelect[i][$scope.options.optionname];
                  } else {
                    if ($scope.options.selectconcatvaluename) {
                      $scope.optionsSelect[i].name = $scope.optionsSelect[i]['value'] + ' - ' + $scope.optionsSelect[i]['name'];
                    } else {
                      $scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
                    }
                  }
                }
              }
            });
          }
          if (typeof $scope.options.default !== 'undefined') {
            $scope.value = $scope.options.default;
          }
          // set field id to link labels and fields
          $scope.id = $scope.formId + $scope.options.type + $scope.index;
          $scope.name = $scope.formName + $scope.options.type + $scope.index;
        }
      ]
    };
  }
]);
'use strict';
eduFieldDirectives.directive('eduSelectRemote', [
  '$parse',
  '$compile',
  '$timeout',
  '$document',
  'dataFactory',
  function ($parse, $compile, $timeout, $document, dataFactory) {
    console.log('eduSelectRemote........................1');
    var template = '<select ng-model="value" class="form-control"' + 'ng-options="option[options.fieldValue] as option[options.fieldName] group by option.group for option in options.options">' + '</select>';
    /*'<select ng-model="value" class="form-control"' +
						'ng-options="option[options.fieldValue] as option[options.fieldName] group by option.group for option in options.options">' +
					'</select>';
					*/
    /*   '<select ng-model="value" class="form-control"' +
			'autofocus="{{options.autofocus}}"' +
			'ng-required="options.required"' +
			'ng-disabled="options.disabled"' +
			//'ng-init="value = options.options[options.default]"' +
			'ng-options="option[options.fieldValue] as option[options.fieldName] group by option.group for option in options.options">' +
	    '</select>';
	*/
    return {
      restrict: 'A',
      require: 'ngModel',
      template: template,
      controller: [
        '$scope',
        function ($scope) {
          $scope.value1 = 'hola capullo';
          $scope.value2 = 'hola capullo';
        }
      ],
      link: function (scope, elm, attrs, ctrl) {
        //scope.value="hola capullo";
        //console.log("uridata:"+attrs.uriData + attrs.label);
        scope.options = {
          uriData: attrs.uriData ? attrs.uriData : null,
          fieldValue: attrs.fieldValue ? attrs.fieldvalue : null,
          fieldName: attrs.fieldName ? attrs.fieldName : null
        };
        /*elm.on('change', function() {
			    console.log("change.................................j"+elm.val());
				scope.$apply(function() {
				  ctrl.$setViewValue("view value");
				});
			  });

			 // model -> view
			  ctrl.$render = function() {
			     console.log("render..............:"+scope.model.$viewValue);
				elm.html(ctrl.$viewValue);
			  };

			  // load init value from DOM
			  //ctrl.$setViewValue(elm.html());
			*/
        // Scope handling
        var api = dataFactory(scope.options.uriData);
        var oParams = {};
        api.getAll(oParams, function (data) {
          scope.options.options = data;
        });
      }
    };
  }
]);
angular.module('edu-field.tpl').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('directives/edu-field-autocomplete.html', '<div class="form-group {{options.col}}" ng-class="{\'has-error\':  $invalid, \'has-success\': !$invalid && $dirty}"><label for={{id}}>{{options.label || \'Autocomplete\'}} {{options.required ? \'*\' : \'\'}}</label><edu-complete id_={{id}} name={{name}} onblur=onBlur() onfocus=onFocus() onchange=onChange() required placeholder={{options.placeholder}} pause={{autocpause}} selectedobject=value url={{options.autocurldata}} localdata=options.autoclocaldata searchfields={{options.autocsearchfields}} datafield={{options.autocfieldvalue}} titlefield={{options.autocfieldtitle}} descriptionfield={{options.autocdescriptionfield}} imagefield={{options.autocfieldimg}} minlength={{options.autocminlength}} inputclass="form-control form-control-small"><div class="help-block has-error" ng-show=$invalid><small class=error ng-show=$invalidRequired>Campo obligatorio. Introduzca un valor</small> <small class=error ng-show=$invalidMinlength>Debe tener al menos {{options.min}} caracteres</small> <small class=error ng-show=$invalidMaxlength>No puede tener m\xe1s de {{options.max}} caracteres</small> <small class=error ng-show=$invalidPattern>Introduzca un valor v\xe1lido</small></div></div>');
    $templateCache.put('directives/edu-field-checkbox.html', '<div class="checkbox {{options.col}}" ng-class="{\'has-error\':  $invalid, \'has-success\': !$invalid && $dirty}"><label><input type=checkbox id={{id}} name=name ng-blur=onBlur() ng-focus=onFocus() ng-change=onChange() ng-required=options.required ng-disabled=options.disabled ng-model=value>{{options.label || \'Checkbox\'}} {{options.required ? \'*\' : \'\'}}</label><div class="help-block has-error" ng-show=$invalid><small class=error ng-show=$invalidRequired>Campo obligatorio. Introduzca un valor</small> <small class=error ng-show=$invalidMinlength>Debe tener al menos {{options.min}} caracteres</small> <small class=error ng-show=$invalidMaxlength>No puede tener m\xe1s de {{options.max}} caracteres</small> <small class=error ng-show=$invalidPattern>Introduzca un valor v\xe1lido</small></div></div>');
    $templateCache.put('directives/edu-field-date-time.html', '<div class="form-group {{options.col}}"><label for={{id}}>{{options.label || \'Number\'}} {{options.required ? \'*\' : \'\'}}</label><input date-time-input="" class=form-control id={{id}} placeholder={{options.placeholder}} autofocus ng-required=options.required ng-disabled=options.disabled min={{options.min}} max={{options.max}} ng-model=value></div>');
    $templateCache.put('directives/edu-field-date.html', '<div class="form-group {{options.col}}" ng-class="{\'has-error\':  $invalid, \'has-success\': !$invalid && $dirty}"><label for={{id}}>{{options.label || \'Fecha\'}} {{options.required ? \'*\' : \'\'}}</label><input date-input="" class=form-control id={{id}} placeholder={{options.placeholder}} autofocus ng-blur=onBlur() ng-focus=onFocus() ng-required={{options.required}} ng-disabled={{options.disabled}} min={{options.min}} max={{options.max}} ng-model=value><div class="help-block has-error" ng-show=$invalid><small class=error ng-show=$invalidRequired>Campo obligatorio. Introduzca un valor</small> <small class=error ng-show=$invalidMinlength>Debe tener al menos {{options.min}} caracteres</small> <small class=error ng-show=$invalidMaxlength>No puede tener m\xe1s de {{options.max}} caracteres</small> <small class=error ng-show=$invalidPattern>Introduzca un valor v\xe1lido</small></div></div>');
    $templateCache.put('directives/edu-field-email.html', '<div class="form-group {{options.col}}" ng-class="{\'has-error\':  $invalid, \'has-success\': !$invalid && $dirty}"><label for={{id}}>{{options.label || \'Email\'}} {{options.required ? \'*\' : \'\'}}</label><input class=form-control id={{id}} name=name placeholder={{options.placeholder}} ng-blur=onBlur() ng-focus=onFocus() ng-change=onChange() autofocus ng-required={{options.required}} ng-disabled={{options.disabled}} ng-pattern="/^[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:[A-Z]{2}|es|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\\b$/" ng-minlength={{options.min}} ng-maxlength={{options.max}} ng-model=value><div class="help-block has-error" ng-show=$invalid><small class=error ng-show=$invalidRequired>Campo obligatorio. Introduzca un email</small> <small class=error ng-show=$invalidMinlength>Debe tener al menos {{options.min}} caracteres</small> <small class=error ng-show=$invalidMaxlength>No puede tener m\xe1s de {{options.max}} caracteres</small> <small class=error ng-show=$invalidPattern>Introduzca un email v\xe1lido</small></div></div>');
    $templateCache.put('directives/edu-field-hidden.html', '<input type=hidden ng-model=value>');
    $templateCache.put('directives/edu-field-iban.html', '<div class="form-group {{options.col}}" ng-class="{\'has-error\':  $invalid, \'has-success\': !$invalid && $dirty}"><label for={{id}}>{{options.label || \'IBAN\'}} {{options.required ? \'*\' : \'\'}}</label><div class=input-group><span class=input-group-btn><button class="btn btn-default" type=button>IBAN</button></span><div class=input-group><input style=width:250px class=form-control id={{id}} name=name placeholder={{options.placeholder}} ng-blur=onBlur() ng-focus=onFocus() ng-change=onChange() autofocus ng-required={{options.required}} ng-disabled={{options.disabled}} ng-pattern=ibanValidator ng-minlength={{options.min}} ng-maxlength={{options.max}} ng-model=value></div></div><div class="help-block has-error" ng-show=$invalid><small class=error ng-show=$invalidRequired>Campo obligatorio. Introduzca un IBAN</small> <small class=error ng-show=$invalidMinlength>Debe tener al menos {{options.min}} caracteres</small> <small class=error ng-show=$invalidMaxlength>No puede tener m\xe1s de {{options.max}} caracteres</small> <small class=error ng-show=$invalidPattern>Introduzca un IBAN v\xe1lido</small></div></div>');
    $templateCache.put('directives/edu-field-month.html', '<div class="form-group {{options.col}}"><label for={{id}}>{{options.label || \'Number\'}} {{options.required ? \'*\' : \'\'}}</label><input type=month class=form-control id={{id}} placeholder={{options.placeholder}} autofocus ng-required=options.required ng-disabled=options.disabled min={{options.min}} max={{options.max}} ng-model=value></div>');
    $templateCache.put('directives/edu-field-number.html', '<div class="form-group {{options.col}}" ng-class="{\'has-error\':  $invalid, \'has-success\': !$invalid && $dirty}"><label for={{id}}>{{options.label || \'Number\'}} {{options.required ? \'*\' : \'\'}}</label><input type=number class=form-control id={{id}} placeholder={{options.placeholder}} ng-blur=onBlur() ng-focus=onFocus() ng-change=onChange() autofocus ng-required={{options.required}} ng-disabled={{options.disabled}} ng-pattern={{options.pattern}} min={{options.min}} max={{options.max}} ng-minlength={{options.minlength}} ng-maxlength={{options.maxlength}} ng-model=value><div class="help-block has-error" ng-show=$invalid><small class=error ng-show=$invalidRequired>Campo obligatorio. Introduzca un valor.</small> <small class=error ng-show=$invalidMinlength>Debe tener al menos {{options.minlength}} caracteres.</small> <small class=error ng-show=$invalidMaxlength>No puede tener m\xe1s de {{options.maxlength}} caracteres.</small> <small class=error ng-show=$invalidMin>El valor debe ser mayor o igual que {{options.min}}.</small> <small class=error ng-show=$invalidMax>El valor debe ser menor o igual que {{options.max}}.</small> <small class=error ng-show=$invalidPattern>Introduzca un valor v\xe1lido.</small></div></div>');
    $templateCache.put('directives/edu-field-password.html', '<div class="form-group {{options.col}}" ng-class="{\'has-error\':  $invalid, \'has-success\': !$invalid && $dirty}"><label for={{id}}>{{options.label || \'Password\'}} {{options.required ? \'*\' : \'\'}}</label><input type=password class=form-control id={{id}} ng-blur=onBlur() ng-focus=onFocus() ng-change=onChange() autofocus ng-required={{options.required}} ng-disabled={{options.disabled}} ng-pattern={{options.pattern}} ng-model=value><div class="help-block has-error" ng-show=$invalid><small class=error ng-show=$invalidRequired>Campo obligatorio. Introduzca un valor</small> <small class=error ng-show=$invalidMinlength>Debe tener al menos {{options.min}} caracteres</small> <small class=error ng-show=$invalidMaxlength>No puede tener m\xe1s de {{options.max}} caracteres</small> <small class=error ng-show=$invalidPattern>Introduzca un valor v\xe1lido</small></div></div>');
    $templateCache.put('directives/edu-field-radio.html', '<div class="radio-group {{options.col}}"><label class=control-label>{{options.label}} {{options.required ? \'*\' : \'\'}}</label><div class=radio ng-repeat="(key, option) in options.options"><label><input type=radio name={{id}} id="{{id + \'_\'+ $index}}" ng-value=option.value ng-required=options.required ng-model=$parent.value>{{option.name}}</label></div></div>');
    $templateCache.put('directives/edu-field-range.html', '<div class="form-group {{options.col}}"><label for={{id}}>{{options.label || \'Range\'}} {{options.required ? \'*\' : \'\'}}</label><input type=range class=form-control id={{id}} placeholder={{options.placeholder}} ng-required=options.required ng-disabled=options.disabled min={{options.min}} max={{options.max}} ng-model=value></div>');
    $templateCache.put('directives/edu-field-select-remote.html', '<div class="form-group {{options.col}}"><label for={{id}}>{{options.label || \'Select\'}} {{options.required ? \'*\' : \'\'}}</label><div edu-select-remote="" ng-model=value autofocus ng-required={{options.required}} ng-disabled={{options.disabled}} uri-data={{options.uridata}} field-value={{options.fieldvalue}} field-name={{options.fieldname}}></div>');
    $templateCache.put('directives/edu-field-select.html', '<div class="form-group {{options.col}}" ng-class="{\'has-error\':  $invalid, \'has-success\': !$invalid && $dirty}"><label for={{id}}>{{options.label || \'Select\'}} {{options.required ? \'*\' : \'\'}}</label><select class=form-control id={{id}} ng-blur=onBlur() ng-focus=onFocus() ng-change=onChange() ng-model=value ng-required=options.required ng-disabled=options.disabled ng-init="value = options.options[options.default]" ng-options="option.value as option.name for option in optionsSelect"></select><div class="help-block has-error" ng-show=$invalid><small class=error ng-show=$invalidRequired>Campo obligatorio. Introduzca un valor</small> <small class=error ng-show=$invalidMinlength>Debe tener al menos {{options.min}} caracteres</small> <small class=error ng-show=$invalidMaxlength>No puede tener m\xe1s de {{options.max}} caracteres</small> <small class=error ng-show=$invalidPattern>Introduzca un valor v\xe1lido</small></div></div>');
    $templateCache.put('directives/edu-field-text.html', '<div class="form-group {{options.col}}" ng-class="{\'has-error\':  $invalid, \'has-success\': !$invalid && $dirty}"><label for={{id}}>{{options.label || \'Text\'}} {{options.required ? \'*\' : \'\'}}</label><input class=form-control id={{id}} name=name placeholder={{options.placeholder}} ng-blur=onBlur() ng-focus=onFocus() ng-change=onChange() autofocus ng-required={{options.required}} ng-disabled={{options.disabled}} ng-pattern={{options.pattern}} ng-minlength={{options.min}} ng-maxlength={{options.max}} ng-model=value><div class="help-block has-error" ng-show=$invalid><small class=error ng-show=$invalidRequired>Campo obligatorio. Introduzca un valor</small> <small class=error ng-show=$invalidMinlength>Debe tener al menos {{options.min}} caracteres</small> <small class=error ng-show=$invalidMaxlength>No puede tener m\xe1s de {{options.max}} caracteres</small> <small class=error ng-show=$invalidPattern>Introduzca un valor v\xe1lido</small></div></div>');
    $templateCache.put('directives/edu-field-textarea.html', '<div class="form-group {{options.col}}"><label for={{id}}>{{options.label || \'Text\'}} {{options.required ? \'*\' : \'\'}}</label><textarea type=text class=form-control id={{id}} rows={{options.rows}} placeholder={{options.placeholder}} autofocus ng-required=options.required ng-disabled=options.disabled ng-model=value>\r' + '\n' + '\t</textarea></div>');
    $templateCache.put('directives/edu-field-textedit.html', '<div class="form-group {{options.col}}"><label for={{id}}>{{options.label || \'Text edit\'}} {{options.required ? \'*\' : \'\'}}</label><div text-angular="" ng-model=value autofocus class={{class}}></div></div>');
    $templateCache.put('directives/edu-field-time.html', '<div class="form-group {{options.col}}"><label for={{id}}>{{options.label || \'Number\'}} {{options.required ? \'*\' : \'\'}}</label><input type=time class=form-control id={{id}} placeholder={{options.placeholder}} autofocus ng-required=options.required ng-disabled=options.disabled min={{options.min}} max={{options.max}} ng-model=value></div>');
    $templateCache.put('directives/edu-field-url.html', '<div class="form-group {{options.col}}" ng-class="{\'has-error\':  $invalid, \'has-success\': !$invalid && $dirty}"><label for={{id}}>{{options.label || \'Url\'}} {{options.required ? \'*\' : \'\'}}</label><input class=form-control id={{id}} name=name placeholder={{options.placeholder}} ng-blur=onBlur() ng-focus=onFocus() ng-change=onChange() autofocus ng-required={{options.required}} ng-disabled={{options.disabled}} ng-pattern="/^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$/" ng-minlength={{options.min}} ng-maxlength={{options.max}} ng-model=value><div class="help-block has-error" ng-show=$invalid><small class=error ng-show=$invalidRequired>Campo obligatorio. Introduzca una url</small> <small class=error ng-show=$invalidMinlength>Debe tener al menos {{options.min}} caracteres</small> <small class=error ng-show=$invalidMaxlength>No puede tener m\xe1s de {{options.max}} caracteres</small> <small class=error ng-show=$invalidPattern>Introduzca una url v\xe1lida</small></div></div>');
    $templateCache.put('directives/edu-field-week.html', '<div class="form-group {{options.col}}"><label for={{id}}>{{options.label || \'Semana\'}} {{options.required ? \'*\' : \'\'}}</label><input type=week class=form-control id={{id}} placeholder={{options.placeholder}} autofocus ng-required=options.required ng-disabled=options.disabled ng-min={{options.min}} ng-max={{options.max}} ng-model=value></div>');
    $templateCache.put('directives/edu-field.html', '');
  }
]);
(function (exports) {
  // Array.prototype.map polyfill
  // code from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map
  if (!Array.prototype.map) {
    Array.prototype.map = function (fun) {
      'use strict';
      if (this === void 0 || this === null)
        throw new TypeError();
      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== 'function')
        throw new TypeError();
      var res = new Array(len);
      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++) {
        // NOTE: Absolute correctness would demand Object.defineProperty
        //       be used.  But this method is fairly new, and failure is
        //       possible only if Object.prototype or Array.prototype
        //       has a property |i| (very unlikely), so use a less-correct
        //       but more portable alternative.
        if (i in t)
          res[i] = fun.call(thisArg, t[i], i, t);
      }
      return res;
    };
  }
  var A = 'A'.charCodeAt(0), Z = 'Z'.charCodeAt(0);
  /**
     * Prepare an IBAN for mod 97 computation by moving the first 4 chars to the end and transforming the letters to
     * numbers (A = 10, B = 11, ..., Z = 35), as specified in ISO13616.
     *
     * @param {string} iban the IBAN
     * @returns {string} the prepared IBAN
     */
  function iso13616Prepare(iban) {
    iban = iban.toUpperCase();
    iban = iban.substr(4) + iban.substr(0, 4);
    return iban.split('').map(function (n) {
      var code = n.charCodeAt(0);
      if (code >= A && code <= Z) {
        // A = 10, B = 11, ... Z = 35
        return code - A + 10;
      } else {
        return n;
      }
    }).join('');
  }
  /**
     * Calculates the MOD 97 10 of the passed IBAN as specified in ISO7064.
     *
     * @param iban
     * @returns {number}
     */
  function iso7064Mod97_10(iban) {
    var remainder = iban, block;
    while (remainder.length > 2) {
      block = remainder.slice(0, 9);
      remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
    }
    return parseInt(remainder, 10) % 97;
  }
  /**
     * Parse the BBAN structure used to configure each IBAN Specification and returns a matching regular expression.
     * A structure is composed of blocks of 3 characters (one letter and 2 digits). Each block represents
     * a logical group in the typical representation of the BBAN. For each group, the letter indicates which characters
     * are allowed in this group and the following 2-digits number tells the length of the group.
     *
     * @param {string} structure the structure to parse
     * @returns {RegExp}
     */
  function parseStructure(structure) {
    // split in blocks of 3 chars
    var regex = structure.match(/(.{3})/g).map(function (block) {
        // parse each structure block (1-char + 2-digits)
        var format, pattern = block.slice(0, 1), repeats = parseInt(block.slice(1), 10);
        switch (pattern) {
        case 'A':
          format = '0-9A-Za-z';
          break;
        case 'B':
          format = '0-9A-Z';
          break;
        case 'C':
          format = 'A-Za-z';
          break;
        case 'F':
          format = '0-9';
          break;
        case 'L':
          format = 'a-z';
          break;
        case 'U':
          format = 'A-Z';
          break;
        case 'W':
          format = '0-9a-z';
          break;
        }
        return '([' + format + ']{' + repeats + '})';
      });
    return new RegExp('^' + regex.join('') + '$');
  }
  /**
     * Create a new Specification for a valid IBAN number.
     *
     * @param countryCode the code of the country
     * @param length the length of the IBAN
     * @param structure the structure of the undernying BBAN (for validation and formatting)
     * @param example an example valid IBAN
     * @constructor
     */
  function Specification(countryCode, length, structure, example) {
    this.countryCode = countryCode;
    this.length = length;
    this.structure = structure;
    this.example = example;
  }
  /**
     * Lazy-loaded regex (parse the structure and construct the regular expression the first time we need it for validation)
     */
  Specification.prototype._regex = function () {
    return this._cachedRegex || (this._cachedRegex = parseStructure(this.structure));
  };
  /**
     * Check if the passed iban is valid according to this specification.
     *
     * @param {String} iban the iban to validate
     * @returns {boolean} true if valid, false otherwise
     */
  Specification.prototype.isValid = function (iban) {
    return this.length == iban.length && this.countryCode === iban.slice(0, 2) && this._regex().test(iban.slice(4)) && iso7064Mod97_10(iso13616Prepare(iban)) == 1;
  };
  /**
     * Convert the passed IBAN to a country-specific BBAN.
     *
     * @param iban the IBAN to convert
     * @param separator the separator to use between BBAN blocks
     * @returns {string} the BBAN
     */
  Specification.prototype.toBBAN = function (iban, separator) {
    return this._regex().exec(iban.slice(4)).slice(1).join(separator);
  };
  /**
     * Convert the passed BBAN to an IBAN for this country specification.
     * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
     * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
     *
     * @param bban the BBAN to convert to IBAN
     * @returns {string} the IBAN
     */
  Specification.prototype.fromBBAN = function (bban) {
    if (!this.isValidBBAN(bban)) {
      throw new Error('Invalid BBAN');
    }
    var remainder = iso7064Mod97_10(iso13616Prepare(this.countryCode + '00' + bban)), checkDigit = ('0' + (98 - remainder)).slice(-2);
    return this.countryCode + checkDigit + bban;
  };
  /**
     * Check of the passed BBAN is valid.
     * This function only checks the format of the BBAN (length and matching the letetr/number specs) but does not
     * verify the check digit.
     *
     * @param bban the BBAN to validate
     * @returns {boolean} true if the passed bban is a valid BBAN according to this specification, false otherwise
     */
  Specification.prototype.isValidBBAN = function (bban) {
    return this.length - 4 == bban.length && this._regex().test(bban);
  };
  var countries = {};
  function addSpecification(IBAN) {
    countries[IBAN.countryCode] = IBAN;
  }
  addSpecification(new Specification('AD', 24, 'F04F04A12', 'AD1200012030200359100100'));
  addSpecification(new Specification('AE', 23, 'F03F16', 'AE070331234567890123456'));
  addSpecification(new Specification('AL', 28, 'F08A16', 'AL47212110090000000235698741'));
  addSpecification(new Specification('AT', 20, 'F05F11', 'AT611904300234573201'));
  addSpecification(new Specification('AZ', 28, 'U04A20', 'AZ21NABZ00000000137010001944'));
  addSpecification(new Specification('BA', 20, 'F03F03F08F02', 'BA391290079401028494'));
  addSpecification(new Specification('BE', 16, 'F03F07F02', 'BE68539007547034'));
  addSpecification(new Specification('BG', 22, 'U04F04F02A08', 'BG80BNBG96611020345678'));
  addSpecification(new Specification('BH', 22, 'U04A14', 'BH67BMAG00001299123456'));
  addSpecification(new Specification('BR', 29, 'F08F05F10U01A01', 'BR9700360305000010009795493P1'));
  addSpecification(new Specification('CH', 21, 'F05A12', 'CH9300762011623852957'));
  addSpecification(new Specification('CR', 21, 'F03F14', 'CR0515202001026284066'));
  addSpecification(new Specification('CY', 28, 'F03F05A16', 'CY17002001280000001200527600'));
  addSpecification(new Specification('CZ', 24, 'F04F06F10', 'CZ6508000000192000145399'));
  addSpecification(new Specification('DE', 22, 'F08F10', 'DE89370400440532013000'));
  addSpecification(new Specification('DK', 18, 'F04F09F01', 'DK5000400440116243'));
  addSpecification(new Specification('DO', 28, 'U04F20', 'DO28BAGR00000001212453611324'));
  addSpecification(new Specification('EE', 20, 'F02F02F11F01', 'EE382200221020145685'));
  addSpecification(new Specification('ES', 24, 'F04F04F01F01F10', 'ES9121000418450200051332'));
  addSpecification(new Specification('FI', 18, 'F06F07F01', 'FI2112345600000785'));
  addSpecification(new Specification('FO', 18, 'F04F09F01', 'FO6264600001631634'));
  addSpecification(new Specification('FR', 27, 'F05F05A11F02', 'FR1420041010050500013M02606'));
  addSpecification(new Specification('GB', 22, 'U04F06F08', 'GB29NWBK60161331926819'));
  addSpecification(new Specification('GE', 22, 'U02F16', 'GE29NB0000000101904917'));
  addSpecification(new Specification('GI', 23, 'U04A15', 'GI75NWBK000000007099453'));
  addSpecification(new Specification('GL', 18, 'F04F09F01', 'GL8964710001000206'));
  addSpecification(new Specification('GR', 27, 'F03F04A16', 'GR1601101250000000012300695'));
  addSpecification(new Specification('GT', 28, 'A04A20', 'GT82TRAJ01020000001210029690'));
  addSpecification(new Specification('HR', 21, 'F07F10', 'HR1210010051863000160'));
  addSpecification(new Specification('HU', 28, 'F03F04F01F15F01', 'HU42117730161111101800000000'));
  addSpecification(new Specification('IE', 22, 'U04F06F08', 'IE29AIBK93115212345678'));
  addSpecification(new Specification('IL', 23, 'F03F03F13', 'IL620108000000099999999'));
  addSpecification(new Specification('IS', 26, 'F04F02F06F10', 'IS140159260076545510730339'));
  addSpecification(new Specification('IT', 27, 'U01F05F05A12', 'IT60X0542811101000000123456'));
  addSpecification(new Specification('KW', 30, 'U04A22', 'KW81CBKU0000000000001234560101'));
  addSpecification(new Specification('KZ', 20, 'F03A13', 'KZ86125KZT5004100100'));
  addSpecification(new Specification('LB', 28, 'F04A20', 'LB62099900000001001901229114'));
  addSpecification(new Specification('LI', 21, 'F05A12', 'LI21088100002324013AA'));
  addSpecification(new Specification('LT', 20, 'F05F11', 'LT121000011101001000'));
  addSpecification(new Specification('LU', 20, 'F03A13', 'LU280019400644750000'));
  addSpecification(new Specification('LV', 21, 'U04A13', 'LV80BANK0000435195001'));
  addSpecification(new Specification('MC', 27, 'F05F05A11F02', 'MC5811222000010123456789030'));
  addSpecification(new Specification('MD', 24, 'U02F18', 'MD24AG000225100013104168'));
  addSpecification(new Specification('ME', 22, 'F03F13F02', 'ME25505000012345678951'));
  addSpecification(new Specification('MK', 19, 'F03A10F02', 'MK07250120000058984'));
  addSpecification(new Specification('MR', 27, 'F05F05F11F02', 'MR1300020001010000123456753'));
  addSpecification(new Specification('MT', 31, 'U04F05A18', 'MT84MALT011000012345MTLCAST001S'));
  addSpecification(new Specification('MU', 30, 'U04F02F02F12F03U03', 'MU17BOMM0101101030300200000MUR'));
  addSpecification(new Specification('NL', 18, 'U04F10', 'NL91ABNA0417164300'));
  addSpecification(new Specification('NO', 15, 'F04F06F01', 'NO9386011117947'));
  addSpecification(new Specification('PK', 24, 'U04A16', 'PK36SCBL0000001123456702'));
  addSpecification(new Specification('PL', 28, 'F08F16', 'PL61109010140000071219812874'));
  addSpecification(new Specification('PS', 29, 'U04A21', 'PS92PALS000000000400123456702'));
  addSpecification(new Specification('PT', 25, 'F04F04F11F02', 'PT50000201231234567890154'));
  addSpecification(new Specification('RO', 24, 'U04A16', 'RO49AAAA1B31007593840000'));
  addSpecification(new Specification('RS', 22, 'F03F13F02', 'RS35260005601001611379'));
  addSpecification(new Specification('SA', 24, 'F02A18', 'SA0380000000608010167519'));
  addSpecification(new Specification('SE', 24, 'F03F16F01', 'SE4550000000058398257466'));
  addSpecification(new Specification('SI', 19, 'F05F08F02', 'SI56263300012039086'));
  addSpecification(new Specification('SK', 24, 'F04F06F10', 'SK3112000000198742637541'));
  addSpecification(new Specification('SM', 27, 'U01F05F05A12', 'SM86U0322509800000000270100'));
  addSpecification(new Specification('TN', 24, 'F02F03F13F02', 'TN5910006035183598478831'));
  addSpecification(new Specification('TR', 26, 'F05A01A16', 'TR330006100519786457841326'));
  addSpecification(new Specification('VG', 24, 'U04F16', 'VG96VPVG0000012345678901'));
  var NON_ALPHANUM = /[^a-zA-Z0-9]/g, EVERY_FOUR_CHARS = /(.{4})(?!$)/g;
  /**
     * Utility function to check if a variable is a String.
     *
     * @param v
     * @returns {boolean} true if the passed variable is a String, false otherwise.
     */
  function isString(v) {
    return typeof v == 'string' || v instanceof String;
  }
  /**
     * Check if an IBAN is valid.
     *
     * @param {String} iban the IBAN to validate.
     * @returns {boolean} true if the passed IBAN is valid, false otherwise
     */
  exports.isValid = function (iban) {
    if (!isString(iban)) {
      return false;
    }
    iban = this.electronicFormat(iban);
    var countryStructure = countries[iban.slice(0, 2)];
    return !!countryStructure && countryStructure.isValid(iban);
  };
  /**
     * Convert an IBAN to a BBAN.
     *
     * @param iban
     * @param {String} [separator] the separator to use between the blocks of the BBAN, defaults to ' '
     * @returns {string|*}
     */
  exports.toBBAN = function (iban, separator) {
    if (typeof separator == 'undefined') {
      separator = ' ';
    }
    iban = this.electronicFormat(iban);
    var countryStructure = countries[iban.slice(0, 2)];
    if (!countryStructure) {
      throw new Error('No country with code ' + iban.slice(0, 2));
    }
    return countryStructure.toBBAN(iban, separator);
  };
  /**
     * Convert the passed BBAN to an IBAN for this country specification.
     * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
     * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
     *
     * @param countryCode the country of the BBAN
     * @param bban the BBAN to convert to IBAN
     * @returns {string} the IBAN
     */
  exports.fromBBAN = function (countryCode, bban) {
    var countryStructure = countries[countryCode];
    if (!countryStructure) {
      throw new Error('No country with code ' + countryCode);
    }
    return countryStructure.fromBBAN(this.electronicFormat(bban));
  };
  /**
     * Check the validity of the passed BBAN.
     *
     * @param countryCode the country of the BBAN
     * @param bban the BBAN to check the validity of
     */
  exports.isValidBBAN = function (countryCode, bban) {
    if (!isString(bban)) {
      return false;
    }
    var countryStructure = countries[countryCode];
    return countryStructure && countryStructure.isValidBBAN(this.electronicFormat(bban));
  };
  /**
     *
     * @param iban
     * @param separator
     * @returns {string}
     */
  exports.printFormat = function (iban, separator) {
    if (typeof separator == 'undefined') {
      separator = ' ';
    }
    return this.electronicFormat(iban).replace(EVERY_FOUR_CHARS, '$1' + separator);
  };
  /**
     *
     * @param iban
     * @returns {string}
     */
  exports.electronicFormat = function (iban) {
    return iban.replace(NON_ALPHANUM, '').toUpperCase();
  };
  /**
     * An object containing all the known IBAN specifications.
     */
  exports.countries = countries;
}(typeof exports == 'undefined' ? this.IBAN = {} : exports));