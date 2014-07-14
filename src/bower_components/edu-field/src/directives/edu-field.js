'use strict';

eduFieldDirectives.directive("dynamicName",function($compile){
    return {
        restrict:"A",
        terminal:true,
        priority:1000,
        link:function(scope,element,attrs){
            element.attr('name', scope.$eval(attrs.dynamicName));
            element.removeAttr("dynamic-name");
            $compile(element)(scope);
        }
    };
});
eduFieldDirectives.directive(
        'dateInput',
        function(dateFilter) {
            return {
                require: 'ngModel',
                template: '<input type="date"></input>',
                replace: true,
                link: function(scope, elm, attrs, ngModelCtrl) {
                    ngModelCtrl.$formatters.unshift(function (modelValue) {
                        return dateFilter(modelValue, 'yyyy-MM-dd');
                    });
                    
                    ngModelCtrl.$parsers.unshift(function(viewValue) {
                        return new Date(viewValue);
                    });
                },
            };
    });
	eduFieldDirectives.directive(
        'dateTimeInput',
        function(dateFilter) {
            return {
                require: 'ngModel',
                template: '<input type="datetime-local"></input>',
                replace: true,
                link: function(scope, elm, attrs, ngModelCtrl) {
                    ngModelCtrl.$formatters.unshift(function (modelValue) {
                        return dateFilter(modelValue, 'yyyy-MM-ddTHH:mm');
                    });
                    
                    ngModelCtrl.$parsers.unshift(function(viewValue) {
                        return new Date(viewValue);
                    });
                },
            };
    });



eduFieldDirectives.directive('eduField', function formField($http, $compile, $templateCache) {

	var getTemplateUrl = function(type) {
		var templateUrl = '';

		switch(type) {
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
			case 'password' :
				templateUrl = 'directives/edu-field-password.html';
				break;
			case 'hidden' :
				templateUrl = 'directives/edu-field-hidden.html';
				break;
			case 'email':
				templateUrl = 'directives/edu-field-email.html';
				break;
			case 'text':
				templateUrl = 'directives/edu-field-text.html';
				break;
			default :
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
			formName:'@formName',
			index: '@index',
			value: '=formValue'
		},
		link: function fieldLink($scope, $element, $attr,ctrl) {
		    //load the correct template
			var templateUrl = $scope.options.templateUrl || getTemplateUrl($scope.options.type);
			if (templateUrl) {
				$http.get(templateUrl, {
					cache: $templateCache
				}).success(function(data) {
					$element.html(data);
					$compile($element.contents())($scope);					
				});
			} else {
				console.log('eduField Error: plantilla tipo \'' + $scope.options.type + '\' no soportada.');
			}
	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<		
        
            $scope.$dirty=false;
			$scope.$invalid=false;
			$scope.$invalidRequired=false;
			$scope.$invalidPattern=false;
			$scope.$invalidMinlength=false;
			$scope.$invalidMaxlength=false;
			$scope.$invalidMin=false;
			$scope.$invalidMax=false;
		    
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
			$scope.onChange=function() {
			  console.log("edu-field.js CONTROLLER CHANGE id:"+'#'+$scope.id+ " class:" +$element.find('#'+$scope.id).attr('class'));
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
						else if(aClass[i]=="ng-invalid-min"){ $scope.$invalidMin=true;}
						else if(aClass[i]=="ng-invalid-max"){ $scope.$invalidMax=true;}
						else if(aClass[i]=="ng-valid"){ $scope.$invalid=false;}
						else if(aClass[i]=="ng-valid-required"){ $scope.$invalidRequired=false;}
						else if(aClass[i]=="ng-valid-pattern"){ $scope.$invalidPattern=false;}
						else if(aClass[i]=="ng-valid-minlength"){ $scope.$invalidMinlength=false;}
						else if(aClass[i]=="ng-valid-maxlength"){ $scope.$invalidMaxlength=false;}
					}
				}				   
			}
			
			$scope.onBlur=function() {
			    console.log("edu-field.js CONTROLLER BLUR id:"+'#'+$scope.id+ " class:" +$element.find('#'+$scope.id).attr('class'));
				var elementClass=angular.element('#'+$scope.id).attr('class');
				if(typeof elementClass!=="undefined"){
				    var aClass=elementClass.split(" ");
					for(var i=0;i<aClass.length;i++){
						if(aClass[i]==="ng-dirty"){ $scope.$dirty=true;console.log("dirty");}
						else if(aClass[i]=="ng-invalid"){ $scope.$invalid=true;}
						else if(aClass[i]=="ng-invalid-required"){ $scope.$invalidRequired=true;}
						else if(aClass[i]=="ng-invalid-pattern"){ $scope.$invalidPattern=true;}
						else if(aClass[i]=="ng-invalid-minlength"){ $scope.$invalidMinlength=true;}
						else if(aClass[i]=="ng-invalid-maxlength"){ $scope.$invalidMaxlength=true;}
						else if(aClass[i]=="ng-invalid-min"){ $scope.$invalidMin=true;}
						else if(aClass[i]=="ng-invalid-max"){ $scope.$invalidMax=true;}
						
						else if(aClass[i]=="ng-valid"){ $scope.$invalid=false;}
						else if(aClass[i]=="ng-valid-required"){ $scope.$invalidRequired=false;}
						else if(aClass[i]=="ng-valid-pattern"){ $scope.$invalidPattern=false;}
						else if(aClass[i]=="ng-valid-minlength"){ $scope.$invalidMinlength=false;}
						else if(aClass[i]=="ng-valid-maxlength"){ $scope.$invalidMaxlength=false;}
					}
					
				}
			}
		},
		controller: function fieldController($scope) {
		  $scope.ibanValidator = (function() {
				//var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
				return {
					test: function(value) {
						//if( $scope.requireTel === false ) return true;
						//else return regexp.test(value);
						return IBAN.isValid(value)
					}
				};
			})();
		
		
		
		
		
		
		
			$scope.options = $scope.optionsData();
			
			if($scope.options.selecttypesource=='url'){
			
				$http.get($scope.options.selectsource).
					success(function(data, status, headers, config) {
					  $scope.optionsSelect=data;
					  for(var i=0;i<$scope.optionsSelect.length;i++) {
							if(!$scope.optionsSelect[i].hasOwnProperty("value")){
								$scope.optionsSelect[i].value = $scope.optionsSelect[i][$scope.options.optionvalue];
							}
							if(!$scope.optionsSelect[i].hasOwnProperty("name")){
								if($scope.options.selectconcatvaluename){ 
									$scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionvalue] + " - " +$scope.optionsSelect[i][$scope.options.optionname];
								}else{
									$scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
								}
								delete $scope.optionsSelect[i][$scope.options.optionname];  
								delete $scope.optionsSelect[i][$scope.options.optionvalue]; 	
							}else{
								if($scope.options.selectconcatvaluename){ 
									$scope.optionsSelect[i].name = $scope.optionsSelect[i]["value"] + " - " +$scope.optionsSelect[i]["name"];
								}else{
									$scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
								}
							}		
						}
					  
					}).
					error(function(data, status, headers, config) {
						
					});
				
			}else if($scope.options.selecttypesource=='array'){
			
				$scope.optionsSelect=$scope.options.selectsource;
				$scope.$watchCollection('optionsSelect', function() {
					if(typeof $scope.optionsSelect!='undefined'){
						for(var i=0;i<$scope.optionsSelect.length;i++) {
							if(!$scope.optionsSelect[i].hasOwnProperty("value")){
								$scope.optionsSelect[i].value = $scope.optionsSelect[i][$scope.options.optionvalue];
							}
							if(!$scope.optionsSelect[i].hasOwnProperty("name")){
								if($scope.options.selectconcatvaluename){ 
									$scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionvalue] + " - " +$scope.optionsSelect[i][$scope.options.optionname];
								}else{
									$scope.optionsSelect[i].name = $scope.optionsSelect[i][$scope.options.optionname];
								}
								delete $scope.optionsSelect[i][$scope.options.optionvalue];   
								delete $scope.optionsSelect[i][$scope.options.optionname];
							}else{
								if($scope.options.selectconcatvaluename){ 
									$scope.optionsSelect[i].name = $scope.optionsSelect[i]["value"] + " - " +$scope.optionsSelect[i]["name"];
								}else{
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
	};
});
