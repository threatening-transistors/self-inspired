/******************************************************
*  Factory for adding, listing, and processing goals  *
******************************************************/

angular.module('app.goalFact', [])
.factory('goalsService', function($q, $http){

	//creates goal on server

	var createGoal = function(goal){
		return $http({
			method: 'POST',
			url: '/goals',
			data: goal
		}).then(function(res){
			return res.data;
		});
	}

	//stubs - fill out with real data later

	var getGoals = function(user){
		console.log("gettin yer goals");
		return $http({
			method: 'GET',
			url: '/goals'
		}).then(function(res){
			return res.data;
		});
	};

	var deleteGoal = function(goalID){	
		console.log("deleting goal: " + goalID);
		return $http({
			method: 'DELETE',
			url: '/goals' + '/' + goalID
		}).then(function(res){
			return res.data;
		});
	};

	return {
		createGoal: createGoal,
		getGoals: getGoals,
		deleteGoal: deleteGoal
	};
});