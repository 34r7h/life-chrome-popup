'use strict';
angular.module('irth', ['firebase'])
.controller('ctrl', function($scope, $firebase, $firebaseAuth){
	var dbURL = 'https://yourlife.firebaseio.com/',
	ref = {}, sync = {}, bind = {};
	$scope.lifestyle = [ 'activity', 'event', 'diet', 'exercise', 'day', 'insight', 'task' ];

	$scope.life = [];
	$scope.syncArray = {};
	$scope.syncObject = {};
	$scope.bindObject = {};
	$scope.beGone = {};
	angular.forEach($scope.lifestyle, function(life){
		$scope.beGone[life] = 'display:none';
		ref[life] = new Firebase(dbURL + '/irth/' + life);
		sync[life] = $firebase(ref[life]);
		$scope.syncObject[life] = sync[life].$asObject();
		bind[life] = sync[life].$asObject();
		$scope.syncArray[life] = sync[life].$asArray();
		$scope.bindObject[life] = bind[life].$bindTo($scope, life.toString());
	});
	console.log('bond', bind);
		console.log('$scope.bindObject', $scope.bindObject);
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
		console.log('args', arguments);
		var timestamp = Date.now();
		sync.activity.$push({name:name, time:Date.now(), details:details, tags:tags, created:timestamp});
	};
	var addActivity = function(name, time, details, tags) {
		var timestamp = Date.now();
		var shipment = {name:name, time: time, details:details, tags:tags, created:timestamp}
		sync.activity.$push(shipment);
	};
	$scope.addEvent = function(name, time) {
		var timestamp = Date.now();
		sync.event.$push({name:name, time:time, created:timestamp});
	};
	$scope['add'+'Diet'] = function(name, time, nutrition, details, tags) { // todo proof of forming named functions in a loop
		console.log(name, time, nutrition, details, tags);
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
	$scope.addInsight = function(title, note) {
		console.log(title,note);
		if(note === undefined){
			var note = 'no note.';
		}
		if(title === undefined){
			var title = 'untitled';
		}
		var timestamp = Date.now();
		sync.insight.$push({title:title, note:note, created:timestamp});
	};
	$scope.addTask = function(name, description) {
		if(name === undefined){
			var name = 'unnamed';
		}
		if(description === undefined){
			var description = 'no description';
		}
		var timestamp = Date.now();
		sync.task.$push({name:name, description:description, created:timestamp});
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
	};

		$scope.cLifestyle = [{name:'activity', models:{name: new String(), time: new Number(), details: new String(), tags: new Array() }, methods:{create:$scope.addActivity}}];


	})
.filter('trustAsResourceUrl', ['$sce', function($sce) {
	return function(val) {
		return $sce.trustAsResourceUrl(val);
	};
}]);
