'use strict';
angular.module('irth', ['firebase'])
.controller('ctrl', function($scope, $firebase, $firebaseAuth){
	var dbURL = 'https://tezt.firebaseio.com/',
	ref = {}, sync = {};
	$scope.lifestyle = ['activity', 'diet', 'exercise', 'day', 'insight', 'task', 'event'];
	$scope.life = [];
	$scope.syncArray = {};
	$scope.syncObject = {};
	$scope.beGone = {};
	angular.forEach($scope.lifestyle, function(life){
		$scope.beGone[life] = 'display:none';
		ref[life] = new Firebase(dbURL + '/life/irth/' + life);
		sync[life] = $firebase(ref[life]);
		$scope.syncObject[life] = sync[life].$asObject();
		$scope.syncArray[life] = sync[life].$asArray();
	});
	$scope.login = function(){
		var loginRef = new Firebase("https://tezt.firebaseio.com");
		if(auth){
			console.log('authData',auth);
		}
		console.log('loginRef', loginRef);
		var auth = $firebaseAuth(loginRef);
		auth.$authWithOAuthRedirect('google').then(function(authData) {
			$scope.auth = authData;
			console.log('Logged in as:', authData.uid);
		}).catch(function(error) {
			console.error('Authentication failed: ', error);
		});
		console.log($scope.auth);
	};
//	sync.$set('life',{activity:0,diet:0,exercise:0,assess:0});
	$scope.beGone.activity = '';

	$scope.hideAll = function () {
		angular.forEach($scope.lifestyle, function(life){
			$scope.beGone[life] = 'display:none';
		});
	};
	$scope.addActivity = function(name, time, details, tags) {
		var timestamp = Date.now();
		sync.activity.$push({name:name, time:time, details:details, tags:tags, created:timestamp});
	};
	$scope.addEvent = function(name, time) {
		var timestamp = Date.now();
		sync.event.$push({name:name, time:time, created:timestamp});
	};
	$scope.addDiet = function(name, time, nutrition, details, tags) {
		var timestamp = Date.now();
		sync.diet.$push({name:name, time:time, nutrition:nutrition, details:details, tags:tags, created:timestamp});
	};
	$scope.addExercise = function(time, mode, details, tags) {
		var timestamp = Date.now();
		sync.exercise.$push({time:time, mode:mode, details:details, tags:tags, created:timestamp});
	};
	$scope.addDay = function(recap, rating, goals) {
		var timestamp = Date.now();
		sync.day.$push({recap:recap, rating:rating, goals:goals, created:timestamp});
	};
	$scope.addInsight = function(details, tags) {
		var timestamp = Date.now();
		sync.insight.$push({details:details, tags:tags, created:timestamp});
	};
	$scope.addTask = function(name, importance, details, tags) {
		var timestamp = Date.now();
		sync.task.$push({name:name, details:details, importance:importance, tags:tags, created:timestamp});
	};
	$scope.completeTask = function(id) {
		var timestamp = Date.now();
		sync.task.$update(id, {done:timestamp});
	};
	$scope.unCompleteTask = function(id) {
		var timestamp = Date.now();
		sync.task.$update(id, {done:false, undone:timestamp});
	};
	$scope.removeEntry = function(type, id) {
		sync[type].$remove(id);
	}
})
.filter('trustAsResourceUrl', ['$sce', function($sce) {
	return function(val) {
		return $sce.trustAsResourceUrl(val);
	};
}]);
