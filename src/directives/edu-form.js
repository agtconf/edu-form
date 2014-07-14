'use strict';

eduFormDirectives.directive('eduForm', function() {
	return {
		restrict: 'AE',
		templateUrl: 'directives/edu-form.html',
		replace: true,
		scope: {
		    options:'=options',
			result: '=result'
		},
		controller: function($scope, $element) {
			$scope.save = function () {
                if ($scope.options.formListeners.onsave === undefined) return;
                console.log("form controller onsave()");
                $scope.options.formListeners.onsave($scope.result);
            };
            $scope.cancel = function () {
                if ($scope.options.formListeners === undefined) return;
                console.log("form controller oncancel()");
                $scope.options.formListeners.oncancel();
            };
	console.log("fomrController fin");
		},
		link: function ($scope,$document) {
		}
	};
});