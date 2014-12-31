'use strict';
angular.module('irth', ['firebase'])
.controller('ctrl', function($scope, $firebase, $firebaseAuth, $location){
	var dbURL = 'https://yourlife.firebaseio.com/',
	ref = {}, sync = {}, bind = {}, authRef = new Firebase(dbURL);
	$scope.lifestyle = [ 'activity', 'event', 'diet', 'exercise', 'day', 'insight', 'task', 'note', 'thanks', 'forgive' ];
	$scope.nav = {body:['diet', 'exercise'], mind:['activity', 'event','task', 'note'], spirit:['day', 'insight', 'thanks', 'forgive']};
	$scope.showLinks = {mind:true};
	$scope.life = [];
	$scope.syncArray = {};
	$scope.syncObject = {};
	$scope.bindObject = {};
	$scope.beGone = {};
	$scope.login = {email:'',password:''};
		$scope.authObj = $firebaseAuth(authRef);
	$scope.location = $location;

	$scope.auth = function(email, password){
		$scope.authObj.$authWithPassword({
			email: email,
			password: password
		}).then(function(authData) {
			$scope.authData = authData;
			console.log("Logged in as:", authData.uid);
			$scope.getData();

		}).catch(function(error) {
			console.error("Authentication failed:", error);
		});

	};
	if($scope.location.$$protocol === 'chrome-extension'){
		$scope.auth('i@o.io','o');
		$scope.showLinks = {mind:true};

	}

	$scope.getData = function(){
		angular.forEach($scope.lifestyle, function(life){
			$scope.beGone[life] = 'display:none';
			ref[life] = new Firebase(dbURL + '/irth/' + life);
			sync[life] = $firebase(ref[life]);
			$scope.syncObject[life] = sync[life].$asObject();
			bind[life] = sync[life].$asObject();
			$scope.syncArray[life] = sync[life].$asArray();
			$scope.bindObject[life] = bind[life].$bindTo($scope, life.toString());
		});
		$scope.beGone.activity = '';

	};
	$scope.getData();


	$scope.hideAll = function () {
		angular.forEach($scope.lifestyle, function(life){
			$scope.beGone[life] = 'display:none';
		});
	};
	$scope.addActivity = function(name, time, details, tags) {
		console.log('args', arguments);
		var timestamp = Date.now();
		sync.activity.$push({name:name, time:time, details:details, tags:tags, created:timestamp});
	};
	$scope.addForgive = function(name, details) {
		console.log('args', arguments);
		var timestamp = Date.now();
		sync.forgive.$push({name:name, details:details, created:timestamp});
	};
	$scope.addThanks = function(name, details) {
		console.log('args', arguments);
		var timestamp = Date.now();
		sync.thanks.$push({name:name, details:details, created:timestamp});
	};
	var addActivity = function(name, time, details, tags) {
		var timestamp = Date.now();
		var shipment = {name:name, time: time, details:details, tags:tags, created:timestamp};
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
	$scope.addNote = function(note) {
		var timestamp = Date.now();
		sync.note.$push({note:note, created:timestamp});
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
		console.log('removing', type + id);
		sync[type].$remove(id);
	};

		$scope.cLifestyle = [{name:'activity', models:{name: new String(), time: new Number(), details: new String(), tags: new Array() }, methods:{create:$scope.addActivity}}];


	})
.filter('trustAsResourceUrl', ['$sce', function($sce) {
	return function(val) {
		return $sce.trustAsResourceUrl(val);
	};
}]);
