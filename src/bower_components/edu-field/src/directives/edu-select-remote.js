'use strict';

eduFieldDirectives.directive('eduSelectRemote', function($parse, $compile, $timeout, $document,dataFactory) {
  console.log("eduSelectRemote........................1");
	var template ='<select ng-model="value" class="form-control"' +
						'ng-options="option[options.fieldValue] as option[options.fieldName] group by option.group for option in options.options">' +
					'</select>';
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
	    
        controller: function ($scope) {
		   $scope.value1="hola capullo";
		   $scope.value2="hola capullo";
		},
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
			var api=dataFactory(scope.options.uriData);
			var oParams={};
            api.getAll(oParams,function (data) {     
	            scope.options.options =data;
	        });
           
        }
    };
});