'use strict';
// Angular Init
var app = angular.module('app', [
	'eduField'
]);

app.controller('appController', ['$scope','$http','dataFactory', function ($scope,$http,dataFactory) {
     $scope.result={};
	 $scope.municipios=[
						{
							"value":"ABANILLA",
							"name": "Abanilla"	
						},{
							"value":"ABARAN",
							"name": "Abarán"	
						},{
							"value":"MURCIA",
							"name": "Murcia"	
						},{
							"value":"CARTAGENA",
							"name": "Cartagena"
						},{
							"value":"ALCANTARILLA",
							"name": "Alcantarilla"
						},
						{
							"value":"ABUDEITE",
							"name": "Albudeite"
						}
				];		
     $scope.fields=[
	                {key: 'oculto',type: 'hidden',value:"campo oculto",name:"nombre",id:"id" },
					{key: 'iban',type: 'iban',col:'col-md-8',label: 'Nº cuenta cliente',placeholder: 'Texto',autofocus:'',required: true },
	                {key: 'texto',type: 'text',col:'col-md-4',label: 'Texto',placeholder: 'Texto',autofocus:'',required: true },
					{key: 'numero',type: 'number',col:'col-md-4',min:1,max:12,pattern:"/^[0-9]+$/",label: 'Número',placeholder: 'Número',autofocus:'',required: true },
					{key: 'email',type: 'email',col:'col-md-4',label: 'Email',placeholder: 'Email',autofocus:'',required: true },
					{key: 'url',type: 'url',col:'col-md-4',label: 'Url',placeholder: 'Url',autofocus:'',required: true },
					{key: 'password',type: 'password',col:'col-md-4',label: 'Password',placeholder: 'Password',autofocus:'',required: true },
				   
					{key: 'ckeckbox',type: 'checkbox',col:'col-md-4',label: 'Checkbox',placeholder: 'Checkbox',autofocus:'',disabled:false,required: true },
					{key: 'radio',type: 'radio',col:'col-md-4',label: 'Radio',options:[{"name":"perro","value":"1"},{"name":"gato","value":"2"}],placeholder: 'Checkbox',autofocus:'',required: true },
					{key: 'rango',type: 'range',col:'col-md-4',label: 'Slider',min:100,max:500,placeholder: 'Slider',autofocus:'',required: true },
					
					
					{key: 'fecha',type: 'date',col:'col-md-4',lines: 5,label:'Fecha',placeholder: 'Fecha',autofocus:'',required: true}, 
					{key: 'fechahora',type: 'date-time',col:'col-md-4',label:'Fecha Hora',placeholder: 'Fecha Hora',autofocus:'',required: true,disabled:false},					 
					{key: 'mes',type: 'month',col:'col-md-4',label: 'Fecha mes',placeholder: 'Fecha mes',autofocus:'',required: true },
					{key: 'semana',type: 'week',col:'col-md-4',label: 'Semana',placeholder: 'Semana',autofocus:'',required: true },
					{key: 'hora',type: 'time',col:'col-md-4',label: 'Hora',placeholder: 'Hora',autofocus:'',required: true },
					
					{key: 'autocompletalocal',type: 'autocomplete',col:'col-md-4',required:true,label: 'Autocomplete datos locales',autoclocaldata:$scope.municipios,autocsearchfields:"name",autocminlength:3,autocfieldtitle:"value,name",autocfielddescription:"",autocfieldvalue:"value",autocpause:300},
				    {key: 'autocompleteremoto',type: 'autocomplete',col:'col-md-4',required:true,label: 'Autocomplete datos remotos',autocurldata: 'api/v1/municipios?filter=',autocsearchfields:"name",autocminlength:3,autocfieldtitle:"value,name",autocfielddescription:"",autocfieldvalue:"value",autocpause:300},											   
				    
					{key: 'selectlocal',type: 'select',col:'col-md-4',required:true,label: 'Select datos locales',selecttypesource:'array',selectsource: $scope.municipios,optionname:"name",optionvalue:"value",selectconcatvaluename:true},
					{key: 'selectremoto',type: 'select',col:'col-md-4',required:true,label: 'Select datos remotos',selecttypesource:'url',selectsource: 'api/v1/municipios',optionname:"name",optionvalue:"value",selectconcatvaluename:true},
					
					{key: 'areatexto',type: 'textarea',col:'col-md-4',rows: 5,label: 'Área de texto',placeholder: 'Área de texto',autofocus:'',required: true	},
    	            {key: 'areatextoedit',type: 'textedit',col:'col-md-4',rows: 5,label: 'Área de texto rico',placeholder: 'Área de texto rico',autofocus:'',required: true	}
    	                     
					
					
					]
										

}])

