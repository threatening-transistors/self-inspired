/*******************************************
*  Controller for the goalsList template   *
*******************************************/

angular.module('app.goals', [])
.controller('goalsListController', function($scope){

	//temporary testing array for populating goals list
	$scope.data = {};
	var goalsList = [
		{
		  _id: "7d7hebsd6f",
          goal: "Acheive inner peace",
          endDate: Date.parse("Sun Dec 07 2014 16:20:42 GMT-0800 (PST)"),
          startDate: Date.parse("Sun Dec 07 2014 16:20:42 GMT-0800 (PST)"),
          why: ["I really want to be a yogi","Because I want to be thin"],
          freq: "daily"
        },
        {
          _id: "7gydksgg4",
          goal: "Help inner city children",
          endDate: Date.parse("Sun Dec 07 2014 16:20:42 GMT-0800 (PST)"),
          startDate: Date.parse("Sun Dec 07 2014 16:20:42 GMT-0800 (PST)"),
          why: ["I want to protect kids from abuse","Because I never stood up when I was young"],
          freq: "weekly"
        },
        {
          _id: "5f5dtgbe",
          goal: "Lose 30lbs",
          endDate: Date.parse("Sun Dec 07 2014 16:20:42 GMT-0800 (PST)"),
          startDate: Date.parse("Sun Dec 07 2014 16:20:42 GMT-0800 (PST)"),
          why: ["I want to be sexy again","So I can score with hot chicks"],
          freq: "monthly"
        },
	];

	//stub function for testing / dev. will use HTTP service when fleshed out.

	$scope.getGoals = function(){
		$scope.data.goalsList = goalsList;
	}

	//Shows success dimmer flash and then deletes goal when the user clicks "I did it"

	$scope.celebrateSuccess = function(event){
		
		$('.success-dimmer').dimmer('show');
		//delete item here
		setTimeout(function(){
			$('.success-dimmer').dimmer('hide');
		}, 2000);
	}

	//Middle-man function for confirming deletion of a goal.
	//Shows the confirmation dimmer flash and stores the item so we can access it if the
	//user confirms

	$scope.deleteWithConfirm = function(event){
		$('.delete-goal-dimmer').dimmer('show');

		$scope.deletionPending = $(event.target);
	}

	//Activated when the user confirms deletion. Deletes the goal we're storing
	//and closes the dimmer flash window

	$scope.confirmedDelete = function(){
		//do stuff here to actually delete the element at $scope.deletionPending
		console.log("deleting " + $scope.deletionPending);
		$scope.closeConfirmDimmer();
	}

	//Function to close dimmer flash. Used above and directly from the "no" button on
	//deletion confirm.

	$scope.closeConfirmDimmer = function(){
		$('.delete-goal-dimmer').dimmer('hide');
	}

	//call our function to get goals on load
	$scope.getGoals();

});