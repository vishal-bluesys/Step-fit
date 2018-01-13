
/* global angular, document, window */
'use strict';
var fullPathURLTest = "http://racreativesworld.com/icici/index.php/Rest/";
//var fullPathURLTest = "http://glowlogicmedia.com/wallet/admin/index.php/Rest/";
angular.module('starter.controllers', ['LocalStorageModule', 'ngMessages','ng-walkthrough'])
.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('icici');
  
})
.directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            };

            return {
                link: fn_link
            }
        } ])
.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                //scope.hideloader();
                element.bind('load', function() {
                scope.hideloader();
            });
            }
        }
    }
})
 .factory('myservice', function() {
  var balObj = "0";
   function setObj(obj){
     balObj = obj;
   }
   function getObj()
   {
     return balObj;
   }
   
   return {
        setObj: setObj,
        getObj: getObj,
    }
   // return this.xxx;
    })

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };



    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
  
  
})

.controller('LoginCtrl', function($location,$ionicLoading,localStorageService , $http, $scope, $timeout, $stateParams, ionicMaterialInk) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);

    $(".background").fadeShow({
        correctRatio: true,
        shuffle: true,
        speed: 3000,
        images: ['img/1.jpg', 'img/1.jpg']
    });
        

    var request=$http({
    method: "post",
    url: fullPathURLTest+"placeholder",
    header: {'Access-Control-Allow-Origin':'*'},
    crossDomain: true,
    //data: JSON.stringify($scope.group)
   });

    request.success(function(data){  
     // $scope.groupsList = data['groups'];
     $scope.Username_placeholder=data[0];
     $scope.Password_placeholder=data[1];
     console.log(data);

    });
    
    request.error(function(data){
      console.log(data);
    });

  $scope.user = {};
  $scope.user.username = '';
  $scope.user.password = '';
  
  var networkState = navigator.connection.type;
  //var Connection =true;
    var states = {};
    states['none'] = 'Please Check your internet connection';
  
  if(localStorageService.get('details') != null)
  {
    $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
    $scope.user.username = localStorageService.get('details')['username'];
    $scope.user.password = localStorageService.get('details')['password'];
  }
  if(networkState != "none")
  { 
    if(localStorageService.get('details') != null)
    {
      var request1=$http({
        method: "post",
        url: fullPathURLTest+"login",
        header: {'Access-Control-Allow-Origin':'*'},
        crossDomain: true,
        data: JSON.stringify($scope.user)
       });

      request1.success(function(data)
      {    
        $ionicLoading.hide();
        if(data['status'] == 'success')
        {
          localStorageService.set('details',data['details']);
          $location.path("/app/dashboard");
        }
        else        
          $scope.validationError = data['status'];
          //console.log(data);
      });
      
      request1.error(function(data)
      {
        $ionicLoading.hide();
        //console.log('error',data);
      });
    }   
  }
  else
  {
    $ionicLoading.hide();
    $scope.validationError = states[networkState];
  }

  $scope.login = function()
  {
    networkState = navigator.connection.type;
    $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
    if(networkState != "none"){
      if (($('.loginname').val()== '') || ($('.password1').val()== ''))
      {
        $scope.validationError = 'Enter username and password';
        return;
      }
      else{
        var request1=$http({
          method: "post",
          url: fullPathURLTest+"login",
          header: {'Access-Control-Allow-Origin':'*'},
          crossDomain: true,
          data: JSON.stringify($scope.user)
         });

        request1.success(function(data)
        {    
          $ionicLoading.hide();
          if(data['status'] == 'success')
          {
            localStorageService.set('details',data['details']);
            if(data['details']['age']!=0)
              $location.path("/app/dashboard");
              else    
            $location.path("/app/viewprofile");
          }
          else        
            $scope.validationError = data['status'];
        });
        
        request1.error(function(data){
          $ionicLoading.hide();
          //console.log(data);
        });
      }
    }
    else
    { 
      $ionicLoading.hide();
      $scope.validationError = states[networkState];
    }
  }

    ionicMaterialInk.displayEffect();
})

.controller('DashboardCtrl', function($http,$ionicLoading,localStorageService,$location, $interval, $scope, $timeout, $stateParams, ionicMaterialInk , $ionicModal, $ionicPopover, myservice) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
  
  var c4 = $('.forth.circless');

  c4.circleProgress({
    startAngle: -Math.PI / 4 * 3,
    value: 0,
    lineCap: 'round',
    fill: {color: '#f27f20'}
  });

  $scope.loadComplete=function()
      {
      if(window.localStorage.getItem('test3')==null)
      {  
        $scope.demoActive1 = true;
         window.localStorage.setItem('test3','test3');
       $scope.demoCaption1 = "Go to profile page";
      }
    }; 
    
    $scope.gototrends = function(){
      if(window.localStorage.getItem('test')==null)
      {   
      $scope.demoActive2 = true; 
      window.localStorage.setItem('test','test');
      $scope.demoCaption2 = "Go to Trends page";
      }
      else
      {
       $location.path('/app/viewprofile'); 
      }
    };
    
     $scope.goto_goals = function(){
         if(window.localStorage.getItem('test1')==null)
      { 
         $scope.demoActive3 = true; 
         window.localStorage.setItem('test1','test1');
      
      $scope.demoCaption3 = "Go to Goals page";
      }
      else{
        
         $location.path('/app/trends'); 
      }
      
      
    };
    
     $scope.goto_grps = function(){
      if(window.localStorage.getItem('test2')== null)
      {
         $scope.demoActive4 = true; 
         window.localStorage.setItem('test2','test2');
         $scope.demoCaption4 = "Go to Groups page";
      }
       else{
         
         $location.path('/app/goals'); 
       }
    };
    
    $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
  $scope.stepCount = "";
  $scope.distance = "";
  $scope.calories = "";
  $scope.stepPercentage = '';
  $scope.getDate = 0;
  $scope.dataPercent = 0;
  $scope.goalSteps = 0;
   var startingOffset = 0;
   var startGuageCounter = 0;
   var db;
   var prevData = 0;
   var preProg = 0;
   
   
    document.addEventListener('deviceready', function () {
     //Android customization
   //cordova.plugins.backgroundMode.setDefaults({ text:'Calculating...',icon:'ic_notify',color:'f27f20'});
    // Enable background mode
  //   if(localStorageService.get('details')!=undefined)
  // {
  // if(!cordova.plugins.backgroundMode.isEnabled())
  //   cordova.plugins.backgroundMode.enable();
  // }
  // else
  // {
  // if(cordova.plugins.backgroundMode.isEnabled())
  //   cordova.plugins.backgroundMode.disable();
    
  // } 
    //Add details to database
    db = window.openDatabase("main","1","Main DB",1000000);
    db.transaction(initDB,dbError,dbReady);
    
    function initDB(tx) {
      tx.executeSql("create table if not exists stepsCount(id INTEGER PRIMARY KEY AUTOINCREMENT, step INTEGER, activityTime DATETIME, created DATE, synced INTEGER)");
    }
    
    function dbError(e) {
      //console.log("SQL ERROR");
      console.dir(e);
    }
    
    function dbReady()
    {
      
    }
    
    
    
    // Insert step data every 15 minutes into local database
    $interval(function(){
        stepcounter.getHistory(function(historyData){
        insertDatabaseSuccess(historyData);
          },
          insertDatabaseFailure
        );
      }, 900000);
    
    function insertDatabaseSuccess(stepData){
      $.each(stepData, function(key, value){
        //console.log(key + ' = ' + value.steps);
        db.transaction(function(tx){
          var d = new Date();
          tx.executeSql("Insert into stepsCount(step,created,activityTime,synced) values(?,?,?)",[value.steps,d.getTime(),key,0],getLog1, errorLog1);
        });
      });
    }
    
    function insertDatabaseFailure(stepData){
      //console.log("Database insert failed");
    }
    
    function getLog1(tx, results)
    {
      //console.log('SQL insert');
    }
    
    function errorLog1(data)
    {
      //console.log('sql insert error');
      //console.log(data);
    }
    $interval(function(){
        stepcounter.getHistory(function(historyData){
        success(historyData);
          },
          failure
        );
      }, 1000);
      
    function successCallback1(data)
    {
      //console.log("Step Counter "+data);
    }
    
    function errorCallback1(data)
    {
      //console.log("Step Counter ");
      //console.log(data);
    }

     function getFormattedDate() {
        var date = new Date();
        var str = date.getFullYear() + "-" + getFormattedPartTime(date.getMonth() + 1) + "-" + getFormattedPartTime(date.getDate());

        return str;
      }
      
      function getFormattedPartTime(partTime){
      if (partTime<10)
         return "0"+partTime;
      return partTime;
      }
    
    function success(data)
    {
      //console.log("Historical data ");
      //console.log(data);
      startingOffset = 0;
      stepcounter.start(0, successCallback1, errorCallback1);
      var todayDate;
      if($scope.getDate == 0)
        todayDate = getFormattedDate();
      else
        todayDate = $scope.getDate;
      var todaysStep = 1;
      $.each(data, function(key, value){
        if (key.indexOf(todayDate) === 0) {
          //console.log(key + ' = ' + value.steps);
          todaysStep += value.steps;
        }
      });
      
     
      
      var dist = 1.0;
      if(todaysStep > 0)
        dist = (todaysStep) / 1250;
    
      $scope.stepCount = todaysStep;
      $scope.distance = dist;
      $scope.calories = ((todaysStep) * 0.044);
      //$scope.stepPercentage = (todaysStep) / 100; 
      if(localStorageService.get('goal'+todayDate) != null)
      {
        todaysStep = todaysStep == 0 ? 1 : todaysStep;
        var getStep = localStorageService.get('goal'+todayDate);
        $scope.todaysGoal = getStep;
        
        var progress = parseFloat((todaysStep / (parseInt(getStep))).toFixed(2));
        if(preProg != progress)
          $('.circless').circleProgress({ value: progress });
        $scope.goalSteps = (progress * 100).toFixed();
        preProg = progress;
      }
      else
      {
        $scope.stepPercentage = (todaysStep) / 100;
        $scope.dataPercent = '100';
        var progress = parseFloat((todaysStep / 10000).toFixed(1));
        if(preProg != progress)
          $('.circless').circleProgress({ value: progress });
        $scope.goalSteps = (progress * 100).toFixed();
        $scope.todaysGoal = 8000;
        preProg = progress;
      }
      
      if(prevData != todaysStep)
      {
        
      }
      prevData = todaysStep;
      
        
    //     if(localStorageService.get('details')!=undefined)
    //     {
    //   if(!cordova.plugins.backgroundMode.isEnabled())
    //     cordova.plugins.backgroundMode.enable();
      
    // //  console.log(todaysStep);
    //   cordova.plugins.backgroundMode.configure({
    //     text:'Steps: ' + todaysStep + ', cal: ' + ((todaysStep) * 0.044).toFixed(2) + ', km:  ' + dist.toFixed(2)
    //   });
    //   }
    //   else
    //   {
    //     if(cordova.plugins.backgroundMode.isEnabled())
    //     cordova.plugins.backgroundMode.disable();
        
    //   }
      /**************************Graph***************************/
      var hourlyData = {};
      //var hourlyStep = new Array();
      var hoursArray = ['0','2','4','6','8','10','12','14','16','18','20','22','24'];
      var todaysStep = 0;
      //var todayDate = getFormattedDate();
      var hourlyKeyArray = new Array();
      var hourlyValueArray = new Array();
      var totalHourlySteps = 0;
      var totalHourlyAvg = 0;
      for(var i = 0; i < (hoursArray.length); i++)
      {
          hourlyData[hoursArray[i]] = 0;
      }
      
      // Get hourly steps
      $.each(data, function(key, value){
        if (key.indexOf(todayDate) === 0) {
          for(var i = 0; i < (hoursArray.length - 1); i++)
          {
            var hour = key.split(' ');
            if(parseInt(hour[1]) >=  parseInt(hoursArray[i]) && parseInt(hour[1]) <  parseInt(hoursArray[i + 1]))
            {
              todaysStep += value.steps;
              hourlyData[hoursArray[i+1]] += todaysStep;
              totalHourlySteps += value.steps;
            }
          }
          todaysStep = 0;
        }
      });
      
      $scope.dailyTotal = totalHourlySteps;
      $scope.dailyAvg = (totalHourlySteps / 12).toFixed();
      
      //console.log(hourlyData);
      
      //insert hourly key and value for showing in graph
      $.each(hourlyData, function(key, value){
        hourlyKeyArray.push(key);
        hourlyValueArray.push(value);
      });
      
      $scope.labels = hourlyKeyArray;
      $scope.data = [hourlyValueArray];
      $scope.series = ['Series A'];
      $scope.colors = ['#f27f20'];
      $ionicLoading.hide();
    }
    
    function failure(data)
    {
      $ionicLoading.hide();
      //console.log("Failure "+data);
    }
    
    
    
    }, false);
    
    $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
  //$scope.groupsList = '';
  
  var request=$http({
    method: "post",
    url: fullPathURLTest+"trendingGroup",
    header: {'Access-Control-Allow-Origin':'*'},
    crossDomain: true,
    data: JSON.stringify($scope.group)
   });

    request.success(function(data){  
      $scope.groupsList = data['groups'];
    });
    
    request.error(function(data){
      console.log(data);
    });
    
    $('.counter').counterUp({
            delay: 10,
            time: 1000
        });

     $(".GaugeMeter").gaugeMeter();


     $("#owl-example2").owlCarousel({
        items : 3,
         itemsMobile : [479,3],
     });
        
  $scope.labels = ["00:00","06:00", "12:00", "18:00","24:00"];
  $scope.series = ['Steps'];
  $scope.data = [
    [10, 2, 4, 6, 9, 0, 3]
  ];
  $scope.onClick = function (points, evt) {
   //console.log(points, evt);
  };
   $scope.colors = ['#f27f20'];
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' , borderWidth: 3}, { yAxisID: 'y-axis-2' , borderWidth: 1,}];

  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          //type: 'linear',
          display: false,
          position: 'right'
        }
      ]
    }
  };    

    // Popupover starts
    $ionicPopover.fromTemplateUrl('templates/settingpopup.html', {
    
    scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
      });


     $scope.openPopover = function($event) {

            $scope.popover.show($event);
        }; 
    // Popupover End     

    var currentDate = new Date();
    var date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 23);
    $scope.date = currentDate;

    $scope.myFunction = function (date) {
        alert(date);
    };

    $scope.onezoneDatepicker = {
        date: new Date(),
    callback: function(value){
       // console.log(value);
    $scope.getDate = getFormattedDateByValue(value);
    function getFormattedDateByValue(date) {
      var str = date.getFullYear() + "-" + getFormattedPartTime(date.getMonth() + 1) + "-" + getFormattedPartTime(date.getDate());

      return str;
    }

    function getFormattedPartTime(partTime){
      if (partTime<10)
         return "0"+partTime;
      return partTime;
    }
    }
    };
  
  
     $scope.showDatepicker = function () {
        $scope.onezoneDatepicker.showDatepicker = true;
    };
  
   // Popupover starts
   $ionicPopover.fromTemplateUrl('templates/settingpopup.html', {
   
   scope: $scope,
     }).then(function(popover) {
       $scope.popover = popover;
     });


    $scope.openPopover = function($event) {

           $scope.popover.show($event);
       }; 
   // Popupover End 
  
    ionicMaterialInk.displayEffect();
})

.controller('MeCtrl', function($scope,localStorageService , $timeout, $stateParams, ionicMaterialInk , $ionicModal, $ionicPopover) {
    //$scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);

    //$("#owl-example").owlCarousel();

    var mySwiper = new Swiper ('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    slidesPerView: 1
  })  
  $scope.user = {};
  $scope.user.img_path = localStorageService.get('details')['img_path'];
  
  $scope.data = {};
  //$scope.data.bgColors = [];
  $scope.data.currentPage = 0;
  $scope.data.sliderOptions = {
      initialSlide: 0,
      direction: 'horizontal', //or vertical
      speed: 300 //0.3s transition
    };
  var setupSlider = function() {
    //some options to pass to our slider
    $scope.data.sliderOptions = {
      initialSlide: 0,
      direction: 'horizontal', //or vertical
      speed: 300 //0.3s transition
    };

    //create delegate reference to link with slider
    //$scope.data.sliderDelegate = null;

    //watch our sliderDelegate reference, and use it when it becomes available
    $scope.$watch('data.sliderDelegate', function(newVal, oldVal) {
      if (newVal != null) {
        $scope.data.sliderDelegate.on('slideChangeEnd', function() {
          $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
          //use $scope.$apply() to refresh any content external to the slider
          $scope.$apply();
        });
      }
    });
  };

   
     setupSlider();
  
  $scope.labels4 = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series4 = ['Series A'];
  $scope.data4 = [
    [65, 59, 80, 81, 56, 55, 40]
  ];
  $scope.onClick = function (points, evt) {
   //console.log(points, evt);
  };
  $scope.colors = ['#f27f20'];
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };
  
  $scope.labels7 = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series7 = ['Series A'];
  $scope.data7 = [
    [65, 59, 80, 81, 56, 55, 40]
  ];
  $scope.onClick = function (points, evt) {
   //console.log(points, evt);
  };
  $scope.colors = ['#f27f20'];
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };

  $scope.labels3 = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series3 = ['Series A', 'Series B'];
  $scope.data3 = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
   //console.log(points, evt);
  };
  $scope.colors = ['#f27f20'];
  $scope.datasetOverride = 
  [
  {
        label: "Bar chart",
        borderWidth: 1,
        type: 'bar'
      },
      {
        label: "Line chart",
        borderWidth: 3,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        type: 'line'
      }
  ];  

  
    // Popupover starts
    $ionicPopover.fromTemplateUrl('templates/settingpopup.html', {
    
    scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
      });


     $scope.openPopover = function($event) {

            $scope.popover.show($event);
        }; 
    // Popupover End     




    ionicMaterialInk.displayEffect();

})

.controller('GoalsCtrl', function($scope,$location,localStorageService, $timeout, $stateParams, ionicMaterialInk , $ionicModal, $ionicPopover) {
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
   
  var wslotCalled = 0;
    ionicMaterialInk.displayEffect();
  
  var date = 'goal' + getFormattedDate(new Date());
  
  var goalArray = ['5,000','6,000','7,000','8,000','9,000','10,000','12,000','15,000','18,000','20,000','25,000'];
  
  var currentDate = new Date();
  var yesterdaysDate = 'goal' + getFormattedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1));
  
  if(localStorageService.get(date) == null)
    if(localStorageService.get(yesterdaysDate) == null)
    {
      localStorageService.set(date,'8,000');
      //$('.scrollergoal').WSlot('rollTo',3);
    }
    else{
      var yesterdayGoal = localStorageService.get(yesterdaysDate);
      localStorageService.set(date , yesterdayGoal);
      var goalIndex = goalArray.indexOf(yesterdayGoal);
      //$('.scrollergoal').WSlot('rollTo',goalIndex);
    }
  else
  {
    var goal = localStorageService.get(date);
    var goalIndex = goalArray.indexOf(goal);
    //$('.scrollergoal').WSlot('rollTo',goalIndex);
  }
  function getFormattedDate(date) {
      //var date = new Date();
      var str = date.getFullYear() + "-" + getFormattedPartTime(date.getMonth() + 1) + "-" + getFormattedPartTime(date.getDate());

      return str;
    }

    function getFormattedPartTime(partTime){
      if (partTime<10)
         return "0"+partTime;
      return partTime;
    }
    // Popupover starts
    $ionicPopover.fromTemplateUrl('templates/settingpopup.html', {
    
    scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
      });

    
    
    
    $scope.setGoal = function(){
     // var goal = {};
     
      var goal = $('.scrollergoal').WSlot('getText').replace(/,/g, "");
      localStorageService.set(date,goal);
      $location.path("/app/dashboard");
    }
    
    
    // Done by parag start
     /*var alreadysetgoal = localStorageService.get(date,goal);
     console.log(alreadysetgoal);  */
    // Done by parag end
    
    
      $scope.loadComplete=function()
      {
        test();
    
  if(wslotCalled == 0){
    wslotCalled = 1;
       $('.scrollergoal').WSlot({
          items:['5,000','6,000','7,000','8,000','9,000','10,000','12,000','15,000','18,000','20,000','25,000'],
          center : '2',
          angle:25,
          distance:'auto',
          displayed_length : 3,
           rotation:0,
          item_height : 60,
        });
    
  }

      }
     $scope.openPopover = function($event) {

            $scope.popover.show($event);
        }; 
    // Popupover End

})


.controller('TrendsCtrl', function($ionicLoading, $http, $scope, $timeout, $stateParams, ionicMaterialInk , $ionicModal, $ionicPopover, localStorageService,$sce) {

   $timeout(function() {
        $scope.$parent.hideHeader();
    
    }, 0);

  var request1=$http({
         method: "post",
         url: fullPathURLTest+"notificationcount",
         header: {'Access-Control-Allow-Origin':'*'},
         crossDomain: true,
         //data: JSON.stringify($scope.group)
        });

       request1.success(function(data){ 
         console.log('notificationcount success', data);
         $scope.notificationcount = data;
         if ($scope.notificationcount.countnot == 0){
           $('.notificationcount').hide();
         }else{
             $('.notificationcount').show();
         }

       });
       
       request1.error(function(data){
         console.log('notificationcount error', data);
         //$ionicLoading.hide();
       });
       
   var request1=$http({
          method: "post",
          url: fullPathURLTest+"show_formula",
          header: {'Access-Control-Allow-Origin':'*'},
          crossDomain: true,
          //data: JSON.stringify($scope.group)
         });

        request1.success(function(data){ 
          console.log('formula success', data);
         $scope.showstepsformula = $sce.trustAsHtml(data.steps_formula);
          $scope.showkmformula = $sce.trustAsHtml(data.kms_formula);
          $scope.showcalformula = $sce.trustAsHtml(data.calories_formula);    
        });
        
        request1.error(function(data){
          console.log('formula error', data);
          //$ionicLoading.hide();
        });

  $scope.weekdlydone=0;
  $scope.monthydone=0;

// Steps total  
  $scope.trendstepmonth = function() {

       $('.countertrends').counterUp({
            delay: 10,
            time: 1000
        }); 
    $('.stepschart1').show();
    $('.stepschart2').hide();
    $('.stepschart3').hide();
       $('.stepmonth').addClass('activetrends');
       $('.stepweekly').removeClass('activetrends');
       $('.activetrends').removeClass('activetrends');
       $('.caloriesmonth').addClass('activetrends');
       $('.kmmonth').addClass('activetrends');
       $('.stepmonth').addClass('activetrends');
       $('.stepdaily').removeClass('activetrends');
     $scope.stepsd.stepsTotal = totalmonthlySteps;
    $scope.stepsd.stepsAvg = totalavgmonthlySteps;
   }

  $scope.trendstepweekly = function() {

       $('.countertrends').counterUp({
            delay: 10,
            time: 1000
        }); 
    $('.stepschart1').hide();
    $('.stepschart2').show();
    $('.stepschart3').hide();
       $('.stepmonth').removeClass('activetrends');
       $('.stepweekly').addClass('activetrends');
       $('.activetrends').removeClass('activetrends');
       $('.caloriesweekly').addClass('activetrends');
       $('.kmweekly').addClass('activetrends');
       $('.stepweekly').addClass('activetrends');
       $('.stepdaily').removeClass('activetrends');
    $scope.stepsd.stepsTotal = totalweeklySteps;
    $scope.stepsd.stepsAvg = totalavgweeklySteps;
  }

  

// KM in total

  $scope.trendkmmonth = function() {

       $('.countertrends').counterUp({
            delay: 10,
            time: 1000
        });
    $('.stepschart1').show();
    $('.stepschart2').hide();
    $('.stepschart3').hide();
       $('.kmmonth').addClass('activetrends');
       $('.kmweekly').removeClass('activetrends');
       $('.activetrends').removeClass('activetrends');
       $('.caloriesmonth').addClass('activetrends');
       $('.kmmonth').addClass('activetrends');
       $('.stepmonth').addClass('activetrends');
       $('.kmdaily').removeClass('activetrends');
     $scope.stepsd.kmTotal = totalmonthlykm;
    $scope.stepsd.kmAvg = totalavgmonthlykm;
   }

  $scope.trendkmweekly = function() {

       $('.countertrends').counterUp({
            delay: 10,
            time: 1000
        });
    $('.stepschart1').hide();
    $('.stepschart2').show();
    $('.stepschart3').hide(); 
       $('.kmmonth').removeClass('activetrends');
       $('.kmweekly').addClass('activetrends');
       $('.activetrends').removeClass('activetrends');
       $('.caloriesweekly').addClass('activetrends');
       $('.kmweekly').addClass('activetrends');
       $('.stepweekly').addClass('activetrends');
       $('.kmdaily').removeClass('activetrends');
    $scope.stepsd.kmTotal = totalweeklykm;
    $scope.stepsd.kmAvg = totalavgweeklykm;
  }

 

// calories in total

  $scope.trendcaloriesmonth = function() {

       $('.countertrends').counterUp({
            delay: 10,
            time: 1000
        });
    $('.stepschart1').show();
    $('.stepschart2').hide();
    $('.stepschart3').hide();   
       $('.caloriesmonth').addClass('activetrends');
       $('.activetrends').removeClass('activetrends');
       $('.caloriesmonth').addClass('activetrends');
       $('.kmmonth').addClass('activetrends');
       $('.stepmonth').addClass('activetrends');
       $('.caloriesdaily').removeClass('activetrends');
      $scope.stepsd.calTotal = totalmonthlycal;
    $scope.stepsd.calAvg = totalavgmonthlycal;
   }

  $scope.trendcaloriesweekly = function() {

       $('.countertrends').counterUp({
            delay: 10,
            time: 1000
        }); 
   $('.stepschart1').hide();
    $('.stepschart2').show();
    $('.stepschart3').hide();
       $('.caloriesmonth').removeClass('activetrends');
       $('.activetrends').removeClass('activetrends');
       $('.caloriesweekly').addClass('activetrends');
       $('.kmweekly').addClass('activetrends');
       $('.stepweekly').addClass('activetrends');
       $('.caloriesdaily').removeClass('activetrends');
    $scope.stepsd.calTotal = totalweeklycal;
    $scope.stepsd.calAvg = totalavgweeklycal;
  }

  $scope.trendcaloriesdaily = function() {

       $('.countertrends').counterUp({
            delay: 10,
            time: 1000
        }); 
    $('.stepschart1').hide();
    $('.stepschart2').hide();
    $('.stepschart3').show();
       $('.caloriesmonth').removeClass('activetrends');
       $('.caloriesweekly').removeClass('activetrends');
       $('.caloriesdaily').addClass('activetrends');
   
  }
  
   $( "#tabs" ).tabs({
    hide: {
        effect: "slide",
        duration: 600
    }
});
 // $ionicLoading.show({
 //            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
 //      });
 stepcounter.getHistory(function(historyData){
  success(historyData);
    },
    failure
  );
  /**********************************************************/
  var totalHourlySteps = 0;
  var totalweeklySteps = 0;
  var totalavgweeklySteps = 0;
  var totalweeklykm = 0;
  var totalavgweeklykm = 0;
  var totalweeklycal = 0;
  var totalavgweeklycal = 0;
  var totalmonthlySteps = 0;
  var totalavgmonthlySteps = 0;
  var totalmonthlykm = 0;
  var totalavgmonthlykm = 0;
  var totalmonthlycal = 0;
  var totalavgmonthlycal = 0;
  
  var hourlyValueArray = new Array();
  var hourlyData = {};
  //var hourlyKmData = {};
  //var hourlyData = {};

  var weeklyData = {};
  var weeklyDatakm = {};
  var weeklyDatacal = {};
  var weeklyKmData = new Array();
  var weeklyCalData = new Array();
  var weeklyValueArray = new Array();
  var weeklyCalArray = new Array();
  var weeklyKmArray = new Array();

  var monthlyData = {};
  var monthlyDatacal = {};
  var monthlyDatakms = {};
  var monthlyKmData = new Array();
  var monthlyCalData = new Array();
  var monthlyValueArray = new Array();
  var monthlyCalArray = new Array();
  var monthlykmArray = new Array();
  

$scope.stepsd={};
function success(data)
{
 
  var hoursArray = ['0','2','4','6','8','10','12','14','16','18','20','22','24'];
  var todaysStep = 0;
  var todayDate = getFormattedDate();
  var hourlyKeyArray = new Array();
  
  totalHourlySteps = 0;
  var totalHourlyAvg = 0;
  for(var i = 0; i < (hoursArray.length); i++)
  {
      hourlyData[hoursArray[i]] = 0;
  }
  
  
  $scope.labels3 = hourlyKeyArray;
  $scope.data3 = [hourlyValueArray];
  $scope.series3 = ['Series A'];
  $scope.colors3 = ['#f27f20'];
  
  //Weekly data variables
  
  var weeklyDatesArray = new Array();
  weeklyDatesArray = getWeeklyDates();
  var weeklySteps = 0;
  var weeklyKeyArray = new Array();
  var startenddatearray = [];
   totalweeklySteps = 0;
   totalavgweeklySteps = 0;
   totalweeklykm = 0;
   totalavgweeklykm = 0;
   totalweeklycal = 0;
   totalavgweeklycal = 0;

  //initialize Weekly dates to 0 steps
  for(var i = 0; i < (weeklyDatesArray.length); i++)
  {
      weeklyData[weeklyDatesArray[i]] = 0;
      weeklyDatakm[weeklyDatesArray[i]]=0;
      weeklyDatacal[weeklyDatesArray[i]]=0;
      var obj={};
      obj.startdate=new Date(weeklyDatesArray[i]);
      obj.enddate=new Date(weeklyDatesArray[i]);
      obj.startdate=new Date(obj.startdate.setHours(0,0,0,0));
      obj.enddate=new Date(obj.enddate.setHours(23,59,59,99));
      obj.type="weeklydata";
      obj.originalSring=weeklyDatesArray[i];
      startenddatearray.push(obj);
  }
  console.log(startenddatearray);
  var monthlyArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var monthYearArray = {};
  var monthlySteps = 0;
  var monthlyKeyArray = new Array();

  
   totalmonthlySteps = 0;
   totalavgmonthlySteps = 0;
   totalmonthlykm = 0;
   totalavgmonthlykm = 0;
   totalmonthlycal = 0;
   totalavgmonthlycal = 0;
   
  for(var i = 0; i < (monthlyArray.length); i++)
  {
      monthlyData[monthlyArray[i]] = 0;
      monthlyDatacal[monthlyArray[i]] = 0;
      monthlyDatakms[monthlyArray[i]] = 0;
      var yearMonth = (new Date().getFullYear()).toString() + "-" + getFormattedPartTime(i + 1);
      var date = new Date(), year = date.getFullYear(), month = (i+1);
      var firstDay = new Date(year, month, 1);
        var lastDay = new Date(year, month + 1, 0);
      monthYearArray[yearMonth] = 0;
      var obj={};
      obj.startdate=new Date(firstDay.setHours(0,0,0,0));
      obj.enddate=new Date(lastDay.setHours(23,59,59,99));
      obj.type="monthlydata";
      obj.originalSring=yearMonth;
      startenddatearray.push(obj);

  }
  var mainobj={};
  mainobj.startenddatearray=startenddatearray;
  mainobj.cindex=0;
  window.localStorage.setItem("mainobj",JSON.stringify(mainobj));
  onlinesync();
//console.log(startenddatearray);

  function onlinesync()
{
      $scope.send = {};
     $scope.send.emp_id = localStorageService.get('details')['gen_user_id'];

  var request=$http({
    method: "post",
    url: fullPathURLTest+"get_weekly_steps",
    header: {'Access-Control-Allow-Origin':'*'},
    crossDomain: true,
    data: JSON.stringify($scope.send)
   });

   request.success(function(data){  
        console.log(data);
    var weeklyDatatemp=data['steps'];
    var weeklyDatatemp1=data['kms'];
    var weeklyDatatemp2=data['calories'];
     
     for (var x=0;x<weeklyDatatemp.length;x++)
    {
      weeklyData[weeklyDatatemp[x].activity_date] = weeklyDatatemp[x].step_count;
      weeklyDatacal[weeklyDatatemp2[x].activity_date] = weeklyDatatemp2[x].step_count;
      weeklyDatakm[weeklyDatatemp1[x].activity_date] = weeklyDatatemp1[x].step_count;     
    }
        //totalweeklySteps=0;
        
        $.each(weeklyData, function(key, value){
          //totalweeklySteps+=parseInt(value);
          var dateFormat = nth(parseInt(key.split('-')[2]));
          weeklyKeyArray.push(dateFormat);
          weeklyValueArray.push(value);
        });
        //totalweeklycal=0;
        $.each(weeklyDatacal, function(key, value){
            //totalweeklycal+=parseInt(value);
          weeklyCalArray.push(value);
        });
        //totalweeklykm=0;
        $.each(weeklyDatakm, function(key, value){
          //  totalweeklykm+=parseInt(value);
          weeklyKmArray.push(value);
        });
          totalweeklySteps = data.steps_count_total.toFixed();
          totalweeklycal = data.calories_count_total.toFixed();
          totalweeklykm = data.kms_count_total.toFixed();

          $scope.stepsd.weeklyTotal = totalweeklySteps;
          $scope.stepsd.weeklyTotal1 = totalweeklycal;
          $scope.stepsd.weeklyTotal2 = totalweeklykm;

          totalavgweeklySteps = data.steps_count_avg.toFixed();
          totalavgweeklycal = data.calories_count_total_avg.toFixed();
          totalavgweeklykm = data.kms_count_total_avg.toFixed();
          
        $scope.stepsd.weeklyAvg = totalavgweeklySteps;
        $scope.stepsd.weeklyAvg1 = totalavgweeklycal;
        $scope.stepsd.weeklyAvg2 = totalavgweeklykm;

    $scope.labels2 = weeklyKeyArray;
        $scope.data2 = [weeklyValueArray];
        //$scope.data2 = [weeklyValueArray];
        $scope.data5 = [weeklyKmArray];
        $scope.data8 = [weeklyCalArray];
        $scope.series2 = ['Series A'];
        $scope.colors2 = ['#f27f20'];
        console.log(weeklyData);
        $scope.weekdlydone=1;
        if($scope.monthydone==1)
        {
          $scope.trendstepmonth();
        }
        });
    
    request.error(function(data){
      console.log(data);
    });


var request2=$http({
    method: "post",
    url: fullPathURLTest+"get_monthly_steps",
    header: {'Access-Control-Allow-Origin':'*'},
    crossDomain: true,
    data: JSON.stringify($scope.send)
   });

  request2.success(function(data){  
    var monthlyDatatemp=data['steps']; 
    var monthlyDatatemp1=data['calories'];
    var monthlyDatatemp2=data['kms'];
    for (var x=0;x<monthlyDatatemp.length;x++)
    {
      monthlyData[monthlyArray[parseInt(monthlyDatatemp[x].activity_month)-1]] = monthlyDatatemp[x].step_count;
      monthlyDatacal[monthlyArray[parseInt(monthlyDatatemp1[x].activity_month)-1]] = monthlyDatatemp1[x].step_count;
      monthlyDatakms[monthlyArray[parseInt(monthlyDatatemp2[x].activity_month)-1]] = monthlyDatatemp2[x].step_count;
            
    }
            //totalmonthlySteps=0;
          $.each(monthlyData, function(key, value){
            //totalmonthlySteps+=parseInt(value);
            monthlyKeyArray.push(key);
            //monthlyValueArray.push(monthlyData[value]);
            monthlyValueArray.push(value);
          });

          //totalmonthlycal=0;
        $.each(monthlyDatacal, function(key, value){
            //totalmonthlycal+=parseInt(value);
          monthlyCalArray.push(value);
        });

        //totalmonthlykm=0;
        $.each(monthlyDatakms, function(key, value){
            //totalmonthlykm+=parseInt(value);
          monthlykmArray.push(value);
        });
          
          totalmonthlySteps = data.steps_count_total.toFixed();
          totalmonthlycal = data.calories_count_total.toFixed();
          totalmonthlykm = data.kms_count_total.toFixed();

          $scope.stepsd.monthlyTotal = totalmonthlySteps;
          $scope.stepsd.monthlyTotal1 = totalmonthlycal;
          $scope.stepsd.monthlyTotal2 = totalmonthlykm;

          totalavgmonthlySteps = data.steps_count_avg.toFixed();
          totalavgmonthlykm = data.kms_count_total_avg.toFixed();
          totalavgmonthlycal = data.calories_count_total_avg.toFixed();

          $scope.stepsd.monthlyAvg = totalavgmonthlySteps;
          $scope.stepsd.monthlyAvg1 = totalavgmonthlycal;
          $scope.stepsd.monthlyAvg2 = totalavgmonthlykm;
        
          $scope.labels1 = monthlyKeyArray;
          $scope.data1 = [monthlyValueArray];
          $scope.data4 = [monthlykmArray];
          $scope.data7 = [monthlyCalArray];
          $scope.series1 = ['Series A'];
          $scope.colors1 = ['#f27f20'];       
                  $scope.monthydone=1;
        if($scope.weekdlydone==1)
        {
          $scope.trendstepmonth();
        }
        });
    
    request2.error(function(data){
      console.log(data);
    });

}
var weeklyindex=0;
var monthlyindex=0;
  for(var i = 0; i < (monthlyArray.length); i++)
  {
      monthlyData[monthlyArray[i]] = 0;
      var yearMonth = (new Date().getFullYear()).toString() + "-" + getFormattedPartTime(i + 1);
      monthYearArray[yearMonth] = 0;
  }
    
  function getFormattedDate() {
    var date = new Date();
    var str = date.getFullYear() + "-" + getFormattedPartTime(date.getMonth() + 1) + "-" + getFormattedPartTime(date.getDate());

    return str;
  }

  function getFormattedPartTime(partTime){
    if (partTime<10)
       return "0"+partTime;
    return partTime;
  }
  
  function getWeeklyDates()
  {
    var dates = new Array();
    var currentDate = new Date();
    for(var i = 6; i >= 0 ; i--)
    {
      var date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i);
      dates.push(date.getFullYear() + "-" + getFormattedPartTime(date.getMonth() + 1) + "-" + getFormattedPartTime(date.getDate()));
    }
    return dates;
  }
  
  //Get date suffix for weekly data
  function nth(d) {
    if(d>3 && d<21) return d.toString()+'th'; // thanks kennebec
    switch (d % 10) {
      case 1:  return d.toString()+"st";
      case 2:  return d.toString()+"nd";
      case 3:  return d.toString()+"rd";
      default: return d.toString()+"th";
    }
}

$ionicLoading.hide();}
$scope.trendstepmonth();
  $scope.trendcaloriesmonth();
  $scope.trendkmmonth(); 


function failure(data)
{
  console.log(data);
}
  
     
    // Popupover starts
    $ionicPopover.fromTemplateUrl('templates/settingpopup.html', {
    
    scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
      });


     $scope.openPopover = function($event) {

            $scope.popover.show($event);
        }; 
    // Popupover End

      ionicMaterialInk.displayEffect();   
   
    

})

.controller('ChartsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');
    ionicMaterialInk.displayEffect();
})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})


.controller('GrouplistCtrl', function($scope,$ionicLoading,$http,$location, localStorageService, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicPopover) {
    // Set Header
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
  
   $( ".takeactiondropdown1" ).click(function() {
      $( ".actionsgroupneeded1" ).slideToggle();
    });

   $( ".takeactiondropdown2" ).click(function() {
      $( ".actionsgroupneeded2" ).slideToggle();
    });

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

    // Popupover starts
    $ionicPopover.fromTemplateUrl('templates/settingpopup.html', {
    
    scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
      });

  
     $scope.openPopover = function($event) {

            $scope.popover.show($event);
        }; 
    // Popupover End

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();
  
  $scope.group = {};
  $scope.group.user_id = localStorageService.get('details')['gen_user_id'];
  $scope.group_my_group_loaded = 0;
  $scope.group_other_group_loaded = 0;
  $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
  //$scope.groupsList = '';
  
  var request=$http({
    method: "post",
    url: fullPathURLTest+"getGroupsById",
    header: {'Access-Control-Allow-Origin':'*'},
    crossDomain: true,
    data: JSON.stringify($scope.group)
   });

    request.success(function(data){  
      
      //console.log(data);
      $scope.groupsList = data['groups'];
      $scope.AdminGroup = data['adminGroup'];
      $scope.group.create_group = data['create_group'];
      $ionicLoading.hide();
    });
    
    request.error(function(data){
      $scope.group_admin_loaded = 1
      if($scope.group_other_group_loaded == 1)
      $ionicLoading.hide();
      //console.log(data);
    });
    
    var request1=$http({
    method: "post",
    url: fullPathURLTest+"getGroupsNotInId",
    header: {'Access-Control-Allow-Origin':'*'},
    crossDomain: true,
    data: JSON.stringify($scope.group)
   });

    request1.success(function(data){
      $scope.group_other_group_loaded = 1
      if($scope.group_admin_loaded == 1)      
      $ionicLoading.hide();
      //console.log(data);
      $scope.topTenGroup = data['groups'];
    });
    
    request1.error(function(data){
      $ionicLoading.hide();
      //console.log(data);
    });
    
    $scope.groupDetail = function(data)
    {
      var groupData = data['group'];
      localStorageService.set('group_data',groupData);
      
      $location.path("/app/groupdetail");
    }
    // Set Ink
    //ionicMaterialInk.displayEffect();
})

.controller('GroupdetailCtrl', function($scope,$ionicLoading,$location,$ionicPopup, localStorageService,$http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);
  
  $scope.group = {};
  $scope.group_data = {};
  $scope.group.fit_grp_id = localStorageService.get('group_data')['fit_grp_id'];
  $scope.group_data = localStorageService.get('group_data');
  $scope.group.owner_id = localStorageService.get('group_data')['gen_user_id'];
  $scope.group.gen_user_id = localStorageService.get('details')['gen_user_id'];
  $scope.group.showOperations = localStorageService.get('group_data')['show_operations'];
  $scope.group.showEdit = false;
  if($scope.group.gen_user_id == $scope.group.owner_id)
  {
    $scope.group.showEdit = true;
  }
  $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      }); 
  var request1=$http({
    method: "post",
    url: fullPathURLTest+"getGroupDetailsById",
    header: {'Access-Control-Allow-Origin':'*'},
    crossDomain: true,
    data: JSON.stringify($scope.group)
   });

  request1.success(function(data){  
    $ionicLoading.hide();
    //console.log(data);
    $scope.userList = data['groups'];
    localStorageService.set('editGroupUsers',$scope.userList)
  });
  
  request1.error(function(data){
    $ionicLoading.hide();
    //console.log(data);
  });
  
  $scope.editGroup = function()
  {
    localStorageService.set('groupMode','edit');
    localStorageService.set('editGroupData',$scope.group_data);
    $location.path("/app/creategroup");
  }
  
  $scope.deleteGroup = function()
  {
    var confirmPopup = $ionicPopup.confirm({
       title: '',
       cssClass:'grpdetail',
       template: 'Are you sure you want to delete '+ $scope.group_data.grp_name +' Group?',
       buttons: [
      {text: 'Yes', type: 'button-positive',
       onTap: function(e){ 
       $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      }); 
        var request1=$http({
          method: "post",
          url: fullPathURLTest+"deleteGroup",
          header: {'Access-Control-Allow-Origin':'*'},
          crossDomain: true,
          data: JSON.stringify($scope.group)
         });

        request1.success(function(data){ 
          $ionicLoading.hide();
          if(data['status'] == 'success')
          {
            $location.path("/app/grouplist");
          }
        });
        
        request1.error(function(data){
          //console.log(data);
          $ionicLoading.hide();
        });
      }},{text: '<b>No</b>', type: ''}]
    });
  }
  
  $scope.leaveGroup = function()
  {
    var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Are you sure you want to leave '+ $scope.group_data.grp_name +' Group?',
       buttons: [
      {text: 'Yes', type: 'button-positive',
       onTap: function(e){ 
       $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      }); 
        var request1=$http({
          method: "post",
          url: fullPathURLTest+"leaveGroup",
          header: {'Access-Control-Allow-Origin':'*'},
          crossDomain: true,
          data: JSON.stringify($scope.group)
         });

        request1.success(function(data){ 
          $ionicLoading.hide();
          if(data['status'] == 'success')
          {
            $location.path("/app/grouplist");
          }
        });
        
        request1.error(function(data){
          $ionicLoading.hide();
          //console.log(data);
        });
      }},{text: '<b>No</b>', type: 'button-assertive'}]
    });
  }
  
   ionicMaterialInk.displayEffect();
})


.controller('AddmembersCtrl', function($ionicLoading,$http, $location, localStorageService , $scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
$ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
if($('.loading-container').length>0)
{
  $('.loading-container').css('opacity', 1);
  $('.loading-container').css('visibility', 'visible');
}
var myVar = setInterval(function(){ myTimer() }, 1000);
function myTimer() {
    if($('h2').length>20)
    {
      //$('.loaderi').hide();
      if($('.loading-container').length>0)
{
  $('.loading-container').css('opacity', 0);
  $('.loading-container').css('visibility', 'hidden');
}
      clearInterval(myVar);
    } 
}
  $scope.group = {};
  //$scope.group.group_name = '';
  //$scope.group.group_short_desc = '';
  $scope.group.userList = {};
  //$scope.group.owner_id = '';
  $scope.group.owner_id = localStorageService.get('details')['gen_user_id'];
  $scope.group.group_name = localStorageService.get('group_details')['group_name'];
  $scope.group.group_short_desc = localStorageService.get('group_details')['group_short_desc'];
 // $scope.usersList = '';
  //$scope.group.fit_grp_id = '';
  $scope.isChecked=[];
  $scope.groupdata={};
  $scope.groupdata.limititem=25;
  $scope.loadMore = function()
  { 
    $scope.groupdata.limititem+=25;

    }
  $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });

  $scope.hideloader=function()
  {
          //$ionicLoading.hide();
  }

  $scope.createGroup = function()
  { 
     $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
    $scope.group.userList = [];
    var upsert = "create_group";
    if(localStorageService.get('groupMode') != null)
    {
      var upsert = "editGroup";
    }
    
    
    angular.forEach($scope.usersList, function(value1, key1) {

      if(value1.isChecked)
      {
        $scope.group.userList.push({
          gen_user_id: value1.gen_user_id

        });
      }
    });
    
    if($scope.group.userList.length > 9)
    {
      //$ionicLoading.hide();
      alert("Number of members should be less than or equal to 10");
    }
    else
    {
      var request=$http({
      method: "post",
      url: fullPathURLTest+upsert,
      header: {'Access-Control-Allow-Origin':'*'},
      crossDomain: true,
      data: JSON.stringify($scope.group)
     });

    request.success(function(data){
      
      if(data['status'] == 'success')
      {
        localStorageService.remove('groupMode');
        localStorageService.remove('editGroupUsers');
        localStorageService.remove('editGroupData');
        if(localStorageService.get('grp_image_path') != null){
          var filePath = localStorageService.get('grp_image_path').split("?")[0];
          var fileExtension = filePath.substr(filePath.lastIndexOf('.')+1);
          var image_name = data['grp_id'];
          var file_name = image_name + "." + fileExtension;
          var options = new FileUploadOptions();
          options.fileKey="file";
          options.fileName = file_name;
          options.chunkedMode=false;
          var ft = new FileTransfer();
       
          
          var win = function (r) {
            console.log(r);
            localStorageService.remove('grp_image_path');
            $ionicLoading.hide();
            $location.path("/app/grouplist");

          }

          var fail = function (error) {
            console.log(error);
            $ionicLoading.hide();
            $location.path("/app/grouplist");
          }
             ft.upload(filePath, encodeURI(fullPathURLTest+"testForm"), win, fail, options);
        }
        else
        {
          $location.path("/app/grouplist");
        }
        
      }
      else
      {
        $scope.validationError = data['status'];
      }
    });

    request.error(function(data){
      //$ionicLoading.hide();
      //console.log('error',data);
    });
    }
  }
  
   $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

   ionicMaterialInk.displayEffect();
  var request1=$http({
    method: "post",
    url: fullPathURLTest+"getUsers",
    header: {'Access-Control-Allow-Origin':'*'},
    crossDomain: true,
    data: JSON.stringify($scope.group)
   });

    request1.success(function(data){ 
    //$ionicLoading.hide(); 
     // $ionicLoading.show({
      //      template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      // }); 
    
    $scope.usersList = data['details'];
    $scope.group.userList = [];
    
    if(localStorageService.get('groupMode') != null)
    {
      $scope.group.userList = localStorageService.get('editGroupUsers');
      $scope.group.fit_grp_id = localStorageService.get('editGroupData')['fit_grp_id'];
    }
    
    angular.forEach($scope.usersList, function(value, key) {
      value.isChecked=false;
      angular.forEach($scope.group.userList, function(value1, key1) {
        if(value.gen_user_id == value1.gen_user_id)
        {
          value.isChecked=true;
        }
      });
      
    });
    
    //$ionicLoading.hide(); 
  });

    request1.error(function(data){
    //$ionicLoading.hide();
    //console.log('error',data);
  });
})

.controller('CreategroupCtrl', function($http,localStorageService,$location, $scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
   // $scope.$parent.clearFabs();
   // $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);
  
  
  $scope.group = {};
  $scope.group.group_name = '';
  $scope.group.group_short_desc = '';
  $scope.group.owner_id = '';
  $scope.group.owner_id = localStorageService.get('details')['gen_user_id'];
  $scope.group.img_path = '';
  $scope.group.mode = 'Create Group';
  var pictureSource;   // picture source
    var destinationType;
  var filePath;
  
  if(localStorageService.get('groupMode') != null)
  {
    $scope.group.group_name = localStorageService.get('editGroupData')['grp_name'];
    $scope.group.group_short_desc = localStorageService.get('editGroupData')['short_desc'];
    $scope.group.img_path = localStorageService.get('editGroupData')['img_path'];
    $scope.group.mode = 'Edit Group';
  }
  $scope.addMembers = function(){
    if($scope.group.group_name == '')
    {
      alert('Group name cannot be blank');
    }
    // else if($scope.group.group_short_desc == '')
    // {
    //   alert('Group Description cannot be blank');
    // }
    else
    {
      localStorageService.set('group_details',$scope.group);
      //console.log("Add members");
      //console.log(localStorageService.get('group_details'));
      $location.path("/app/addmembers");
    }
  }
  
  document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
  }
  
  $scope.selectPic = function()
  {
    navigator.camera.getPicture(cameraSuccess, cameraError, { quality: 20,
        destinationType: destinationType.FILE_URI, sourceType: pictureSource.PHOTOLIBRARY });
  }
  
  function cameraSuccess(data)
  {
      if (data.startsWith("content://")) {
    //We have a native file path (usually returned when a user gets a file from their Android gallery)
    //Let's convert to a fileUri that we can consume properly
    window.FilePath.resolveNativePath(data, function(localFileUri) {
    window.resolveLocalFileSystemURL(localFileUri,
   function (fileEntry) {
       console.log(fileEntry.toURL());
       var urlc=fileEntry.toURL();
          filePath = urlc;
          var options = {
        allowEdit: true,
        destinationType: destinationType.FILE_URI, 
        sourceType: pictureSource.PHOTOLIBRARY,
        quality: 200,
        // height: 130px,
        // width: 130px,
  };

      window.plugins.crop.promise(filePath, options)
      .then(function success (newPath) {
        console.log ('cropped image');
        console.log(newPath);
    $scope.group.img_path = newPath;
    localStorageService.set('grp_image_path',newPath);
      })
      .catch(function fail (err) {
        console.log('image not cropped. Try again');
      })

    
   },
   function () { });
  },
   function () { });  
  }
    else
    {
    filePath = data;
    var options = {
        allowEdit: true,
        destinationType: destinationType.FILE_URI, 
        sourceType: pictureSource.PHOTOLIBRARY,
        quality: 200,
        // height: 130px,
        // width: 130px,
  };

      window.plugins.crop.promise(filePath, options)
      .then(function success (newPath) {
        console.log ('cropped image');
        console.log(newPath);
        $scope.group.img_path = newPath;
    localStorageService.set('grp_image_path',newPath);
      })
    
}
  }
  
  function cameraError(data)
  {
    //console.log(data);
  }
    ionicMaterialInk.displayEffect();
})

.controller('EditprofileCtrl', function($ionicLoading,$scope,$http, localStorageService, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $location) {
    // Set Header
    $scope.$parent.showHeader();
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

    ionicMaterialInk.displayEffect();
  
  var pictureSource;   // picture source
    var destinationType;
  var filePath;
  
  document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
  }
  
  $scope.user = {};
  $scope.user.user_id = localStorageService.get('details')['gen_user_id'];
  $scope.user.username = localStorageService.get('details')['username'];
  $scope.user.first_name = localStorageService.get('details')['first_name'];
  $scope.user.last_name = localStorageService.get('details')['last_name'];
  $scope.user.email = localStorageService.get('details')['email'];
  $scope.user.phone_no = parseInt(localStorageService.get('details')['phone_no']);
  $scope.user.short_desc = localStorageService.get('details')['short_desc'];
  $scope.user.img_path = localStorageService.get('details')['img_path'];
  $scope.user.gender = localStorageService.get('details')['gender'];
  $scope.user.age = parseInt(localStorageService.get('details')['age']);
  $scope.user.height = parseInt(localStorageService.get('details')['height']);
  $scope.user.weight = parseInt(localStorageService.get('details')['weight']);
  
  $scope.save_profile = function(formsub)
  {
    if(formsub.$valid)
    {
    $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
    var request1=$http({
    method: "post",
    url: fullPathURLTest+"editProfile",
    header: {'Access-Control-Allow-Origin':'*'},
    crossDomain: true,
    data: JSON.stringify($scope.user)
   });

  request1.success(function(data){  
    $ionicLoading.hide();
    //console.log(data);
  if(data['status'] == 'success'){
    localStorageService.set('details',data['details']);
    if(localStorageService.get('user_image_path') != null){
      $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
      var filePath = localStorageService.get('user_image_path').split("?")[0];
      var fileExtension = filePath.substr(filePath.lastIndexOf('.')+1);
      var image_name = localStorageService.get('details')['gen_user_id'];
      var file_name = image_name + "." + fileExtension;
      var options = new FileUploadOptions();
      options.fileKey="file";
      options.fileName = file_name;
      options.chunkedMode=false;
      var ft = new FileTransfer();
      ft.upload(filePath, encodeURI(fullPathURLTest+"profilePic"), win, fail, options);
      
      
    }
    else
      $location.path("app/dashboard");
  }
  else{
    $ionicLoading.hide();
    $scope.validationError = data['status'];
  }
   
  });
  
  
  request1.error(function(data){
    $ionicLoading.hide();
    //console.log(error);
  });
  }
  }
  function win (r) {
    $scope.duser={};
    $scope.duser.user_id=localStorageService.get('details')['gen_user_id'];
        $ionicLoading.hide();
        //console.log(r);
        localStorageService.remove('user_image_path');
        var request1=$http({
          method: "post",
          url: fullPathURLTest+"getUserDetailsById",
          header: {'Access-Control-Allow-Origin':'*'},
          crossDomain: true,
          data: JSON.stringify($scope.duser)
         });

        request1.success(function(data)
        {    
          $ionicLoading.hide();
          
            localStorageService.set('details',data['details']);
            $location.path("app/dashboard");

        });
        
        request1.error(function(data){
          $ionicLoading.hide();
          //console.log(data);
        });
      }

  function fail(error) {
        $ionicLoading.hide();
        //console.log(error);
      }
  $scope.selectPic = function()
  {
    navigator.camera.getPicture(cameraSuccess, cameraError, { quality: 20,
        destinationType: destinationType.FILE_URI, sourceType: pictureSource.PHOTOLIBRARY });
  }
  
  function cameraSuccess(data)
  {
    if (data.startsWith("content://")) {
    //We have a native file path (usually returned when a user gets a file from their Android gallery)
    //Let's convert to a fileUri that we can consume properly
    window.FilePath.resolveNativePath(data, function(localFileUri) {
    window.resolveLocalFileSystemURL(localFileUri,
   function (fileEntry) {
       console.log(fileEntry.toURL());
       var urlc=fileEntry.toURL();
       filePath = urlc;
       var options = {
        allowEdit: true,
        destinationType: destinationType.FILE_URI, 
        sourceType: pictureSource.PHOTOLIBRARY,
        quality: 200,
        // height: 130px,
        // width: 130px,
  };

      window.plugins.crop.promise(filePath, options)
      .then(function success (newPath) {
        console.log ('cropped image');
        console.log(newPath);
        $scope.user.img_path = newPath;
    localStorageService.set('user_image_path',newPath);
      })
      .catch(function fail (err) {
        console.log('image not cropped. Try again');
      })
  // window.plugins.crop(function success () {

  //  console.log ('cropped image');

  //    }, function fail () {
  //      console.log('image not cropped. Try again');

  //    }, filePath, options)
    //console.log(data);
    //$('#userPic').find('i').remove();
    //$('#userPic').css('background','url('+data+')');
    //$('#userPic').css('background-size','cover');
    
       //console.log(fileEntry.fullPath);
   },
   function () { });
  },
   function () { });  
  }
  else
  {
    filePath = data;
      var options = {
        allowEdit: true,
        destinationType: destinationType.FILE_URI, 
        sourceType: pictureSource.PHOTOLIBRARY,
        quality: 200,
        // height: 130px,
        // width: 130px,
  };

      window.plugins.crop.promise(filePath, options)
      .then(function success (newPath) {
        console.log ('cropped image');
        console.log(newPath);
        $scope.user.img_path = newPath;
    localStorageService.set('user_image_path',newPath);
      })

    //console.log(data);
    //$('#userPic').find('i').remove();
    //$('#userPic').css('background','url('+data+')');
    //$('#userPic').css('background-size','cover');
    // $scope.user.img_path = data;
    // localStorageService.set('user_image_path',filePath);
  }
  }
  function cameraError(data)
  {
    //console.log(data);
  }
})

.controller('ViewprofileCtrl', function($scope,$ionicLoading, localStorageService, $location, $stateParams, $timeout, ionicMaterialInk, $ionicPopup, ionicMaterialMotion) {
    // Set Header
  //$ionicNavBarDelegate.showBackButton(true);
    $scope.$parent.showHeader();
   // $scope.$parent.clearFabs();
   // $scope.$parent.setHeaderFab('left');

   $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });

     $('#imageonload').load (function(){
      //alert('hii');
      $ionicLoading.hide();
      
   });

    $scope.user = {};
  $scope.user.img_path = localStorageService.get('details')['img_path'];
    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);
  
  $scope.user = {};
  $scope.user.user_id = localStorageService.get('details')['gen_user_id'];
  $scope.user.username = localStorageService.get('details')['username'];
  $scope.user.first_name = localStorageService.get('details')['first_name'];
  $scope.user.last_name = localStorageService.get('details')['last_name'];
  $scope.user.email = localStorageService.get('details')['email'];
  $scope.user.phone_no = parseInt(localStorageService.get('details')['phone_no']);
  $scope.user.short_desc = localStorageService.get('details')['short_desc'];
  $scope.user.img_path = localStorageService.get('details')['img_path'];
  $scope.user.gender = localStorageService.get('details')['gender'];
  $scope.user.age = localStorageService.get('details')['age'];
  $scope.user.height = localStorageService.get('details')['height'];
  $scope.user.weight = localStorageService.get('details')['weight'];
    // Set Motion
    //ionicMaterialMotion.fadeSlideInRight();
  
  $scope.logout = function()
  { 
    var confirmPopup = $ionicPopup.confirm({
       title: '',
       cssClass: 'abc',
       template: 'Are you sure you want to logout?',
       buttons: [
      {text: 'Yes', type: 'button-positive',
       onTap: function(e){ 
        localStorageService.clearAll();
        $location.path("/app/login");
        //if(cordova.plugins.backgroundMode.isEnabled())
    //cordova.plugins.backgroundMode.disable();
      }},{text: '<b>No</b>', type: ''}]
    });
  }
  
    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope,localStorageService, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
  $scope.user = {};
  $scope.user.img_path = localStorageService.get('details')['img_path'];
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

   

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('Forgotctrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

})

.controller('NotificationlistCtrl', function($scope, $stateParams, $http, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

   ionicMaterialInk.displayEffect();

//  var abcdate = new Date();
// $scope.nowdate = abcdate;

//       $scope.notificationdata = [
//           {
//             notificationtext : 'Congratulation you have sucessfully completed the task',
//           },
//           {
//             notificationtext : 'Congratulation you have sucessfully completed the task',
//           }  
//       ];



//         $scope.currentdate = {};
//         $scope.currentdate.nowdate =$scope.nowdate ;
//         $scope.notificationdata.push($scope.currentdate);
//                console.log($scope.notificationdata);

   var notificationrequest=$http({
          method: "post",
          url: fullPathURLTest+"notification",
          header: {'Access-Control-Allow-Origin':'*'},
          crossDomain: true,
          //data: JSON.stringify($scope.group)
         });

        notificationrequest.success(function(data){ 
          console.log('notification success', data);
          $scope.notificationdata = data;
        });
        
        notificationrequest.error(function(data){
          console.log('notification error', data);
          //$ionicLoading.hide();
        });

})

// New UI
.controller('NewdashboardCtrl', function($http,localStorageService,$location, $interval, $scope, $timeout, $stateParams, ionicMaterialInk , $ionicModal, $ionicPopover, myservice) {

 $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);

      $('.counter').counterUp({
            delay: 10,
            time: 1000
        });

     $(".GaugeMeter").gaugeMeter();


     $("#owl-example2").owlCarousel({
        items : 3,
         itemsMobile : [479,3],
     });
        
  $scope.labels = ["00:00","02:00","04:00","06:00","08:00","09:00","10:00", "12:00","14:00","16:00", "18:00","20:00","22:00","24:00"];
  $scope.series = ['Steps'];
  $scope.data = [
    [10, 2, 4, 6, 9, 0, 3,10, 2, 4, 6, 9, 3]
  ];
  $scope.onClick = function (points, evt) {
    //console.log(points, evt);
  };
   $scope.colors = ['#f27f20'];
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' , borderWidth: 3}, { yAxisID: 'y-axis-2' , borderWidth: 1,}];

  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          //type: 'linear',
          display: false,
          position: 'right'
        }
      ]
    }
  };    


  //new knob


// $(".dial").knob({
//                  'change' : function (v) { console.log(v); }
//     });

var c4 = $('.forth.circless');

c4.circleProgress({
  startAngle: -Math.PI / 4 * 3,
  value: 0.5,
  lineCap: 'round',
  fill: {color: '#f27f20'}
});

setTimeout(function() { c4.circleProgress('value', 0.7); }, 0);
  //new knob


  var c4 = $('.forth1.circless');

c4.circleProgress({
  startAngle: -Math.PI / 4 * 3,
  value: 0.5,
  lineCap: 'round',
  fill: {color: '#a43723'}
});

setTimeout(function() { c4.circleProgress('value', 0.7); }, 0);
  //new knob


    var currentDate = new Date();
    var date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 23);
    $scope.date = date;

    $scope.myFunction = function (date) {
        alert(date);
    };

    $scope.onezoneDatepicker = {
        date: date
    };

     $scope.showDatepicker = function () {
        $scope.onezoneDatepicker.showDatepicker = true;
    };




})

.controller('NewviewprofileCtrl', function($scope,localStorageService, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {

   $scope.$parent.showHeader();
   // $scope.$parent.clearFabs();
   // $scope.$parent.setHeaderFab('left');
  
    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

    // Set Motion
    //ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

})

.controller('settingCtrl', function($scope,$ionicPopup,$location,localStorageService, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {

   $scope.$parent.showHeader();
   // $scope.$parent.clearFabs();
   // $scope.$parent.setHeaderFab('left');
  
    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

  
  
    ionicMaterialInk.displayEffect();

})

.controller('NewactivityCtrl', function($ionicLoading, $scope,$interval,localStorageService,$http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
  $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
      $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);
  
  $scope.activity = {};
  $scope.activity.total_time = '';
  $scope.activity.stepCount = '';
  $scope.activity.distance = '';
  $scope.activity.calories = '';
  $scope.activity.pace = '';
  $scope.activity.gen_user_id = localStorageService.get('details')['gen_user_id'];
  $scope.activity.showme = false;
  $scope.activity.stop = true;
  $scope.activity.playicon = 'playicon';
  $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
  var clock;
  $timeout(function() {
  
    clock = $('.clock').FlipClock({
      clockFace: 'HourlyCounter',
      autoStart: false,
      callbacks: {
        
        interval: function() {
          var time = this.factory.getTime().time;
          
          if(time) {
            localStorageService.set('seconds',time);
            $scope.timerUp = secondsTimeSpanToHMS(localStorageService.get('seconds'));
          }
        }
      }
    });
     }, 0);
    var promise;
    var prevSteps = 0;
    var prevDist = 0;
    var refreshEveryThreeSecond = 0; 
    
    function secondsTimeSpanToHMS(s) {
      var h = Math.floor(s/3600); //Get whole hours
      s -= h*3600;
      var m = Math.floor(s/60); //Get remaining minutes
      s -= m*60;
      return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
    }
    
    var request1=$http({
        method: "post",
        url: fullPathURLTest+"getActivitiesByUsers",
        header: {'Access-Control-Allow-Origin':'*'},
        crossDomain: true,
        data: JSON.stringify($scope.activity)
       });

      request1.success(function(data){
        $ionicLoading.hide();
        if(data['status'] == 'success')
        {
          $scope.activityList = data['details'];
          angular.forEach($scope.usersList, function(value, key) {
            value.isShow=false;           
          });
          
        }
      });
      
      request1.error(function(data){
        $ionicLoading.hide();
        //console.log(data);
      });
      
    $scope.startActivity = function()
    {
      clock.setTime(0);
      clock.setCountdown(false);
      clock.start();
      
      
      
     promise = $interval(function()
          {
            stepcounter.getHistory(function(historyData)
            {
              success(historyData);
            },
              failure
            );
          }, 1000);

      function getFormattedDate() {
          var date = new Date();
          var str = date.getFullYear() + "-" + getFormattedPartTime(date.getMonth() + 1) + "-" + getFormattedPartTime(date.getDate());

          return str;
        }
        
        function getFormattedPartTime(partTime){
          if (partTime<10)
             return "0"+partTime;
          return partTime;
        }
  
      function success(data)
      {
        var todayDate;
        
        todayDate = getFormattedDate();
        
        var todaysStep = 1;
        $.each(data, function(key, value){
          if (key.indexOf(todayDate) === 0) {
            todaysStep += value.steps;
          }
        });
        
        if(localStorageService.get('initialCount') == null)
          localStorageService.set('initialCount',todaysStep);
        
        todaysStep -= localStorageService.get('initialCount');
        //console.log(localStorageService.get('initialCount'));
       
        
        var dist = 0.0;
        if(todaysStep > 0)
          dist = (todaysStep) / 1250;
      
        //var time = parseFloat(parseInt(localStorageService.get('seconds')) / 3600);
        var time = parseFloat(3 / 3600);
        $scope.activity.stepCount = todaysStep;
        $scope.activity.distance = dist.toFixed(2);
        $scope.activity.calories = (todaysStep * 0.044).toFixed(2);
        
        refreshEveryThreeSecond++;
        
        if(refreshEveryThreeSecond % 3 == 0)
        {
          var stepsInThreeSec = 0;
          var distInThreeSec = 0;
          prevSteps = prevSteps == 0 ? 0.01 : prevSteps;
          prevDist = prevDist == 0 ? 0 : prevDist;
          
          stepsInThreeSec = todaysStep - prevSteps;
          distInThreeSec = dist - prevDist;
          
            if(time > 0 && distInThreeSec > 0 && ((dist / time) / 3) < 100)
              $scope.activity.pace = ((dist / time) / 3).toFixed();
            else
              $scope.activity.pace = "0";
            
          prevSteps = todaysStep;
          prevDist = dist;
        }
      }
    
      function failure(data)
      {
        //console.log('error',data);
      }
      
    }
    
    $scope.stopActivity = function()
    { 
      clock.stop();
      $interval.cancel(promise);
      $scope.activity.stop = false;
      $scope.activity.playicon = '';
    }
    
    $scope.exitActivity = function()
    { 
      localStorageService.remove('seconds');
      localStorageService.remove('initialCount');
      $scope.activity.showme = false;
      $scope.activity.stop = true;
      $scope.activity.playicon = 'playicon';
    }

    $scope.saveActivity = function()
    { 
      $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
      var time = parseFloat(parseInt(localStorageService.get('seconds')) / 3600);
      $scope.activity.pace = (parseFloat($scope.activity.distance) / time).toFixed(2);
      $scope.activity.total_time = secondsTimeSpanToHMS(parseInt(localStorageService.get('seconds')));
      
      var request1=$http({
        method: "post",
        url: fullPathURLTest+"create_activity",
        header: {'Access-Control-Allow-Origin':'*'},
        crossDomain: true,
        data: JSON.stringify($scope.activity)
       });

      request1.success(function(data){ 
        $ionicLoading.hide();
        if(data['status'] == 'success')
        {
          localStorageService.remove('seconds');
          localStorageService.remove('initialCount');
          $scope.activityList = data['details'];
          angular.forEach($scope.usersList, function(value, key) {
            value.isShow=false;           
          });
          $scope.activity.showme = false;
          $scope.activity.stop = true;
          $scope.activity.playicon = 'playicon';
        }
      });
      
      request1.error(function(data){
        $ionicLoading.hide();
        //console.log(data);
      });
    }
    
   ionicMaterialInk.displayEffect();
})

//new dashboard 1

.controller('Newdashboard1Ctrl', function($http,$ionicLoading, $ionicPopup, localStorageService,$location, $interval, $scope, $timeout, $stateParams, ionicMaterialInk , $ionicModal, $ionicPopover, myservice) {
  
  
    document.addEventListener("backbutton", function (e) {
      e.preventDefault();
      e.stopPropagation();
    }, false );

    // $ionicLoading.show({
    //         template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
    //   });
  
  $scope.groupsList = [
  {
    ranks : "Rank 1",
  },
  {
    ranks : "Rank 2",
  },
  {
    ranks : "Rank 3",
  }];

  // $scope.rank_num1 = Rank 1;
  // $scope.rank_num2 = 2;
  // $scope.rank_num3 = 3;

 $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);

      $('.counter').counterUp({
            delay: 10,
            time: 1000
        });

     $(".GaugeMeter").gaugeMeter();

  var c4 = $('.forth.circless');
 $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });

 if (localStorageService.get('stepCount') == undefined){
             $scope.stepCount = 0;
             $scope.distance = 0;
             $scope.calories = 0;
             $scope.progress = 0;
 }
  else
  {
    $scope.stepCount = localStorageService.get('stepCount');
            $(".stepcountmeter").html($scope.stepCount);
      $scope.distance = localStorageService.get('distance');
      $(".distancemeter").html($scope.distance);
        $scope.calories = localStorageService.get('calories');
        $(".calaoriesmeter").html($scope.calories);
      $scope.progress = localStorageService.get('progress');
  }


c4.circleProgress({
  startAngle: -Math.PI / 4 * 3,
  value: parseFloat($scope.progress),
  lineCap: 'round',
  fill: {color: '#f27f20'},
   animation: { duration: 7000},
}).on('circle-animation-end', function(event) {
               console.log('animation-end');
               $ionicLoading.hide();
});

setTimeout(function() { c4.circleProgress('value', 0); }, 0);

     $("#owl-example2").owlCarousel({
        items : 3,
         itemsMobile : [479,3],
     });
        
    $scope.loadComplete=function()
      { 
    }; 
    
    
        
  $scope.sendSync = {};
  $scope.sync = {};
  $scope.sync.activity_time = '';
  $scope.sync.steps = 0;
  $scope.sendSync.gen_user_id = localStorageService.get('details')['gen_user_id'];
  $scope.sendSync.historyData = [];
  $scope.sendSync.historyData = [];
  
    stepcounter.getHistory(function(historyData){
    successSyncSteps(historyData);
      },
      failureSyncSteps
    );
  $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
  $scope.stepCount = "";
  $scope.distance = "";
  $scope.calories = "";
  $scope.stepPercentage = '';
  $scope.getDate = 0;
  $scope.dataPercent = 0;
  $scope.goalSteps = 0;
   var startingOffset = 0;
   var startGuageCounter = 0;
   var db;
   var prevData = 0;
   var preProg = 0;
   var obj = {};
  
  function successSyncSteps(data)
  {
    $ionicLoading.hide();
    $.each(data, function(key, value){
      if(key.length == 13){
        obj = {};
        obj.steps = value.steps;
        obj.activity_time = key + ":00:00";
        $scope.sendSync.historyData.push(obj);
      }
    });
    
    var request=$http({
      method: "post",
      url: fullPathURLTest+"step_data",
      header: {'Access-Control-Allow-Origin':'*'},
      crossDomain: true,
      async: false,
      data: JSON.stringify($scope.sendSync)
     });

    request.success(function(data){ 
      console.log("Data synced");
    });
    
    request.error(function(data){
      console.log(data);
    });
  }
  
  function failureSyncSteps(data)
  {
    //console.log("Step Counter ");
    //console.log(data);
  }
    
  document.addEventListener('deviceready', function () {
    // Android customization
   // cordova.plugins.backgroundMode.setDefaults({ text:'Calculating...',icon:'ic_notify',color:'f27f20'});
    // Enable background mode
  //   if(localStorageService.get('details')!=undefined)
  // {
  // if(!cordova.plugins.backgroundMode.isEnabled())
  //   cordova.plugins.backgroundMode.enable();
  // }
  // else
  // {
  // if(cordova.plugins.backgroundMode.isEnabled())
  //   cordova.plugins.backgroundMode.disable(); 
  // }

  var todayDate;
 var abc = new Date();
$scope.xyz = abc;
$scope.xyz = getFormattedDateByValue(abc);
todayDate=$scope.xyz;

    $interval(function(){
        $scope.sendSync.historyData = [];
        if (($scope.getDate == todayDate) || ($scope.getDate == undefined) || ($scope.getDate == 0)){
stepcounter.getHistory(function(historyData){
        successSyncSteps(historyData);
          },
          failureSyncSteps
        );
        } else{
          console.log('no execution');
        }
      }, 900000);
    
    $interval(function(){
       //if (($scope.getDate == todayDate) || ($scope.getDate == undefined)){
          stepcounter.getHistory(function(historyData){
        success(historyData);
          },
          failure
        );
     //  }
      }, 1000);
  
    stepcounter.deviceCanCountSteps(function(historyData){
        successCallback(historyData);
          },
          errorCallback
        );

    function successCallback(data){
      console.log('success');
        if(data == false){
      var confirmPopup = $ionicPopup.confirm({
       title: '',
       cssClass: 'stepcountpopup',
       template: 'Step counting is not available.<br>Sensor is not present.',
    });
    }
    else{
      console.log('Step counting is available');
    }
    }

    function errorCallback(data){
     console.log('fail');     
    }

    function successCallback1(data)
    {
      //console.log("Step Counter "+data);
    }
    
    function errorCallback1(data)
    {
      //console.log("Step Counter ");
      //console.log(data);
    }

    function getFormattedDate() {
        var date = new Date();
        var str = date.getFullYear() + "-" + getFormattedPartTime(date.getMonth() + 1) + "-" + getFormattedPartTime(date.getDate());

        return str;
      }
      
      function getFormattedPartTime(partTime){
      if (partTime<10)
         return "0"+partTime;
      return partTime;
      }
    
    function success(data)
    {
      //console.log("Historical data ");
      console.log(data);
      startingOffset = 0;
      stepcounter.start(0, successCallback1, errorCallback1);
      var todayDate;
      if($scope.getDate == 0)
        todayDate = getFormattedDate();
      else
        todayDate = $scope.getDate;
      var todaysStep = 1;
      $.each(data, function(key, value){
        if (key.indexOf(todayDate) === 0) {
          //console.log(key + ' = ' + value.steps);
          todaysStep += value.steps;
        }
      });
      
      var dist = 1.0;
      if(todaysStep > 0)
        dist = (todaysStep) / 1250;
    
      $scope.stepCount = todaysStep;
      $scope.distance = dist;
      $scope.calories = ((todaysStep) * 0.044);
      localStorageService.set('stepCount',$scope.stepCount);
      localStorageService.set('distance',$scope.distance.toFixed(2));
      localStorageService.set('calories',$scope.calories.toFixed(2));
      localStorageService.set('goalsteps',$scope.goalSteps);
      //$scope.stepPercentage = (todaysStep) / 100; 
      if(localStorageService.get('goal'+todayDate) != null)
      {
        todaysStep = todaysStep == 0 ? 1 : todaysStep;
        var getStep = localStorageService.get('goal'+todayDate);
        $scope.todaysGoal = getStep;
        localStorageService.set('todaysgoal',$scope.todaysGoal);
        
        var progress = parseFloat((todaysStep / (parseInt(getStep.replace(/\,/g,'')))).toFixed(2));
        localStorageService.set('progress', progress);
        if(preProg != progress)
          $('.circless').circleProgress({ value: progress }).on('circle-animation-end', function(event) {
               console.log('animation-end');
           // $(this).circleProgress({ value: 1.0});
          $ionicLoading.hide();
            });
        $scope.goalSteps = (progress * 100).toFixed();
        preProg = progress;
      }
      else
      {
        $scope.stepPercentage = (todaysStep) / 100;
        $scope.dataPercent = '100';
        var progress = parseFloat((todaysStep / 8000).toFixed(2));
        localStorageService.set('progress', progress);
        if(preProg != progress)
          $('.circless').circleProgress({ value: progress }).on('circle-animation-end', function(event) {
               console.log('animation-end');
           // $(this).circleProgress({ value: 1.0});
          $ionicLoading.hide();
          });
        $scope.goalSteps = (progress * 100).toFixed();
        localStorageService.set('goalsteps',$scope.goalSteps);
        $scope.todaysGoal = 8000;
        preProg = progress;
      }
      
      if(prevData != todaysStep)
      {
        
      }
      prevData = todaysStep;
      
        
      //   if(localStorageService.get('details')!=undefined)
      //   {
      // if(!cordova.plugins.backgroundMode.isEnabled())
      //   cordova.plugins.backgroundMode.enable();
        
      // cordova.plugins.backgroundMode.configure({
      //   text:'Steps: ' + todaysStep + ', cal: ' + ((todaysStep) * 0.044).toFixed(2) + ', km:  ' + dist.toFixed(2)
      // });
      // }
      // else
      // {
      //   if(cordova.plugins.backgroundMode.isEnabled())
      //   cordova.plugins.backgroundMode.disable();
      // }
      
      $scope.stepCount = todaysStep-1;
      $scope.calories = ((todaysStep-1) * 0.044);
      $ionicLoading.hide();
    }
    
    function failure(data)
    {
      $ionicLoading.hide();
      //console.log("Failure "+data);
    }
    }, false);
    
    // $ionicLoading.show({
    //         template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
    //   });
    $scope.grpdistance='34';
  $scope.groupsList = '';
  
  var request=$http({
    method: "post",
    url: fullPathURLTest+"trendingGroup",
    header: {'Access-Control-Allow-Origin':'*'},
    crossDomain: true,
    data: JSON.stringify($scope.group)
   });

    request.success(function(data){  
      //$ionicLoading.hide();
      data['groups'][0]['img_path']= 'img/1.png';
      data['groups'][1]['img_path']= 'img/2.png';
      data['groups'][2]['img_path']= 'img/3.png';
      $scope.groupsList = data['groups'];

    });
    
    request.error(function(data){
     // $ionicLoading.hide();
      //console.log(data);
    });
    
  $scope.onClick = function (points, evt) {
    //console.log(points, evt);
  };
   $scope.colors = ['#f27f20'];
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' , borderWidth: 3}, { yAxisID: 'y-axis-2' , borderWidth: 1,}];

  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          //type: 'linear',
          display: false,
          position: 'right'
        }
      ]
    }
  };    

    var currentDate = new Date();
    var date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 23);
    $scope.date = currentDate;



    $scope.myFunction = function (date) {
        alert(date);
    };

       var todayDate;
 var abc = new Date();
$scope.xyz = abc;
$scope.xyz = getFormattedDateByValue(abc);
todayDate=$scope.xyz;

    $scope.onezoneDatepicker = {
        date: new Date(),
    callback: function(value){
    $scope.getDate = getFormattedDateByValue(value);
     $scope.getstepsbydate = {};
     $scope.getstepsbydate.emp_id = localStorageService.get('details')['gen_user_id'];
     $scope.getstepsbydate.input_date = $scope.getDate;
   
      if (($scope.getDate == todayDate) || ($scope.getDate == undefined)){
     stepcounter.getHistory(function(historyData){
        successSyncSteps(historyData);
          },
          failureSyncSteps
        );
    }else{
            var request=$http({
                method: "post",
                url: fullPathURLTest+"get_steps_by_date",
                header: {'Access-Control-Allow-Origin':'*', 'Content-Type':'application/x-www-form-urlencoded'},
                crossDomain: true,
                data: JSON.stringify($scope.getstepsbydate)
                //data: $scope.emp_id
            });

            request.success(function(data){  
              console.log('success', data);
              $scope.stepCount = data.steps_count_total;
              $scope.distance = data.kms_count_total;
              $scope.calories = data.calories_count_total;
             var getStep = localStorageService.get('goal'+todayDate);
            $scope.todaysGoal = getStep;
            localStorageService.set('todaysgoal',$scope.todaysGoal);
            var progress = parseFloat((data.steps_count_total / (parseInt(getStep.replace(/\,/g,'')))).toFixed(2));
            localStorageService.set('progress', progress);
            if(preProg != progress)
              $('.circless').circleProgress({ value: progress }).on('circle-animation-end', function(event) {
                   console.log('animation-end');
            });
              $scope.goalSteps = (progress * 100).toFixed();
              preProg = progress;
              
            });
            
            request.error(function(data){
              console.log('error', data);
            });
    }
    }
    };

     function getFormattedDateByValue(date) {
      var str = date.getFullYear() + "-" + getFormattedPartTime(date.getMonth() + 1) + "-" + getFormattedPartTime(date.getDate());

      return str;
    }

    function getFormattedPartTime(partTime){
      if (partTime<10)
         return "0"+partTime;
      return partTime;
    }

    setTimeout(function(){
   
},100);
     $scope.showDatepicker = function () {
        $scope.onezoneDatepicker.showDatepicker = true;
    };
})


.controller('ChangepasswordCtrl', function($http,$ionicLoading, localStorageService,$location, $interval, $scope, $timeout, $stateParams, ionicMaterialInk , $ionicModal, $ionicPopover, myservice) {
  
  $scope.user = {};
  $scope.user.user_id = localStorageService.get('details')['gen_user_id'];
  $scope.user.old_pass = '';
  $scope.user.new_pass = '';
  $scope.user.confirm_pass = '';
  
  $scope.password_submit = function(){
  $ionicLoading.show({
            template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></strong>'
      });
    var request1=$http({
        method: "post",
        url: fullPathURLTest+"changePassword",
        header: {'Access-Control-Allow-Origin':'*'},
        crossDomain: true,
        data: JSON.stringify($scope.user)
       });

      request1.success(function(data){ 
        $ionicLoading.hide();
        if(data['status'] == 'success')
        {
          $location.path('/app/viewprofile'); 
        }
        else
        {
          $scope.validationError = data['status'];
        }
      });
      
      request1.error(function(data){
        $ionicLoading.hide();
        //console.log(data);
      });
  
  }
});  
