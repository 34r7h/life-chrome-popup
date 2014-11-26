'use strict';
angular.module('irth', ['firebase'])
.controller('ctrl', function($scope, $firebase){
	var dbURL = 'https://tezt.firebaseio.com',
	lifestyle = ['activity', 'diet', 'exercise', 'day', 'insight', 'task'];
	var ref = {}, sync = {};
	$scope.syncArray = {};
	$scope.syncObject = {};
	angular.forEach(lifestyle, function(life){
		ref[life] = new Firebase(dbURL + '/life/' + life + '/');
		sync[life] = $firebase(ref[life]);
		$scope.syncObject[life] = sync[life].$asObject();
		$scope.syncArray[life] = sync[life].$asArray();
	});

//	sync.$set('life',{activity:0,diet:0,exercise:0,assess:0});

	$scope.exerciseBeGone = 'display:none';
	$scope.dietBeGone = 'display:none';
	$scope.dayBeGone = 'display:none';
	$scope.insightBeGone = 'display:none';
	$scope.taskBeGone = 'display:none';


	$scope.hideAll = function () {
		$scope.activityBeGone = 'display:none';
		$scope.exerciseBeGone = 'display:none';
		$scope.dietBeGone = 'display:none';
		$scope.dayBeGone = 'display:none';
		$scope.insightBeGone = 'display:none';
		$scope.taskBeGone = 'display:none';
	};
	$scope.addActivity = function(name, time, details, tags) {
		sync.activity.$push({name:name, time:time, details:details, tags:tags});
	};
	$scope.addDiet = function(name, time, nutrition, details, tags) {
		sync.diet.$push({name:name, time:time, nutrition:nutrition, details:details, tags:tags});
	};
	$scope.addExercise = function(time, mode, details, tags) {
		sync.exercise.$push({time:time, mode:mode, details:details, tags:tags});
	};
	$scope.addDay = function(recap, rating, goals) {
		sync.day.$push({recap:recap, rating:rating, goals:goals});
	};
	$scope.addInsight = function(name, importance, details, tags) {
		sync.insight.$push({name:name, details:details, importance:importance, tags:tags});
	};
	$scope.addTask = function(name, importance, details, tags) {
		sync.task.$push({name:name, details:details, importance:importance, tags:tags});
	};
})
.filter('trustAsResourceUrl', ['$sce', function($sce) {
	return function(val) {
		return $sce.trustAsResourceUrl(val);
	};
}]);
