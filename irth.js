'use strict';
angular.module('irth', ['firebase'])
.controller('ctrl', function($scope, $firebase, $firebaseAuth, $location){
	var dbURL = 'https://yourlife.firebaseio.com/',
	ref = {}, sync = {}, bind = {}, authRef = new Firebase(dbURL);
	$scope.lifestyle = [ 'activity', 'event', 'diet', 'exercise', 'day', 'insight', 'task', 'note', 'thanks', 'forgive', 'stretch', 'water' ];
	$scope.nav = {body:['diet', 'exercise', 'stretch', 'water'], mind:['activity', 'event','task', 'note'], spirit:['day', 'insight', 'thanks', 'forgive']};
	$scope.pictures = [
		'http://i.imgur.com/hsOvM.jpg',
		'http://a.images.blip.tv/Indiegamemag-PAXEastMarkOfTheNinjaMoGameplay179-507.jpg',
		'http://www.geekmanifesto.net/wordpress/wp-content/uploads/2013/01/Mark-of-the-Ninja.jpg',
		'http://pinnaclegameprofiler.com/forum/attachment.php?attachmentid=5545&d=1394829381',
		'http://1.bp.blogspot.com/-au1Rmty2iV0/UPImcpH-apI/AAAAAAAAQ6Y/KmW3gEBmReY/s1600/6.jpg'
	];
	$scope.style = {};
	$scope.style.note = {position:'fixed', bottom: 0, left:0, width:'300px', minHeight: '300px', margin: '0.7%'};
	$scope.show = {note:{big:true}};
	$scope.showLinks = {mind:true,body:true,spirit:true};
	$scope.life = [];
	$scope.syncArray = {};
	$scope.syncObject = {};
	$scope.bindObject = {};
	$scope.beGone = {};
	$scope.new = {};
	$scope.api = {add:{}};
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
		$scope.showLinks = {};
	}

	$scope.getData = function(){
		angular.forEach($scope.lifestyle, function(life){
			$scope.new[life]={};
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

		// API

		angular.forEach($scope.lifestyle, function(section){
			// Loop through the lifestyle array
			// and create a method on api.add for each section
			$scope.api.add[section] = function(submission) {
				var time = Date.now();
				submission.created = time;
				sync[section].$push(submission);
			};
		});

		$scope.removeEntry = function(type, id) {
			console.log( 'removing', type + ": " + id );
			sync[type].$remove(id);
		};



	$scope.hideAll = function () {
		angular.forEach($scope.lifestyle, function(life){
			$scope.beGone[life] = 'display:none';
		});
	};

	$scope.completeTask = function(id) {
		var timestamp = Date.now();
		sync.task.$update(id, {done:timestamp });
	};
	$scope.unCompleteTask = function(id) {
		var timestamp = Date.now();
		sync.task.$update(id, {done:false, undone:timestamp});
	};


		$scope.cLifestyle = [{name:'activity', models:{name: new String(), time: new Number(), details: new String(), tags: new Array() }, methods:{create:$scope.addActivity}}];


	})
.filter('trustAsResourceUrl', ['$sce', function($sce) {
	return function(val) {
		return $sce.trustAsResourceUrl(val);
	};
}]);
