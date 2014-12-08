/*******************************************
*  Controller for the addGoals template    *
*******************************************/

angular.module('app.add', [])
.controller('addGoalController', function(goalsService, $scope){
	
  //setup our data for the Add Goal view

  $scope.data = {
        goal: {
          goal: "",
          endDate: "",
          why: "",
          freq: {
            daily: false,
            weekly: false,
            monthly: false
          }
        }
      };

  //this tracks whether a required field has been touched but not filled in
  $scope.conflict = false;

  //The require function checks on ng-blur to see if the blurred field has been filled in
  //If not, it will set the class "error" on the input field (passed in here as event.target)

  $scope.require = function(event){
    if (event.target.value == ""){
      $(event.target).parent().addClass("error");
    } else {
      $(event.target).parent().removeClass("error");      
    }
  };

  //Scope function to attach to the goalsService creation function

  $scope.createGoal = function(){
    var input = $scope.prepareData($scope.data.goal);
    console.log(input);
    goalsService.createGoal(input).then(function(res){
      console.log(res);
      $scope.showCreateSuccess();
    });
  }

  //Prepares data to be sent to the server. The server is
  //expecting specific field names and we want to make sure to match those
  //

  $scope.prepareData = function (data) {
    var prepared = {};

    prepared.goalContent= data.goal;
    prepared.startDate = new Date();
    prepared.endDate = $scope.picker.get('select').obj; //make utc
    prepared.why = data.why; //need to adjust to array

    for (key in data.freq){
      if (data.freq[key]){
        prepared.freq = key;
      }
    }
    return prepared;
  }

  //Utility function that shows the splash "dimmer" screen upon successful
  //message post.

  $scope.showCreateSuccess = function(){
    console.log($('.dimmer'));
    $('.dimmer').dimmer('show');
    setTimeout(function(){
      $('.dimmer').dimmer('hide');
    }, 2000);
  };

  //Controls the toggle for email send frequency as seen in the view
  //Manually sets to true the clicked frequency value, and sets all others to
  //false
          
  $scope.freqToggle = function(value){
    for (key in $scope.data.goal.freq){
      if (value === key){
        $scope.data.goal.freq[key] = true;
      } else {
        $scope.data.goal.freq[key] = false;
      }
    }
  };

  //Invokes the Pickadate jQ plugin on the page.
  //Called when the content is loaded so as to make sure to attach to the correct element
  //('.datepicker' doesn't exist before load)

  $scope.$on('$viewContentLoaded', function(){
    
    var $input = $('.datepicker').pickadate();
    $scope.picker = $input.pickadate('picker');

  });

});