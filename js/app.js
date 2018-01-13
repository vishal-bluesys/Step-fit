// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput','onezone-datepicker','chart.js'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

     .state('app.settingpopup', {
        url: '/settingpopup',
        views: {
            'menuContent': {
                templateUrl: 'templates/settingpopup.html'
               // controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

     
    .state('app.notificationlist', {
        url: '/notificationlist',
        views: {
            'menuContent': {
                templateUrl: 'templates/notificationlist.html',
                controller: 'NotificationlistCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.goals', {
        url: '/goals',
        views: {
            'menuContent': {
                templateUrl: 'templates/goals.html',
                controller: 'GoalsCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.dashboard', {
        url: '/dashboard',
        views: {
            'menuContent': {
                templateUrl: 'templates/newdashboard1.html',
                controller: 'Newdashboard1Ctrl'
            }
        }
    })


    .state('app.newdashboard', {
        url: '/newdashboard',
        views: {
            'menuContent': {
                templateUrl: 'templates/newdashboard.html',
                controller: 'NewdashboardCtrl'
            }
        }
    })

    .state('app.newdashboard1', {
        url: '/newdashboard1',
        views: {
            'menuContent': {
                templateUrl: 'templates/newdashboard1.html',
                controller: 'Newdashboard1Ctrl'
            }
        }
    })

      .state('app.grouplist', {
        url: '/grouplist',
        views: {
            'menuContent': {
                templateUrl: 'templates/grouplist.html',
                controller: 'GrouplistCtrl'
            }
        }
    })

     .state('app.creategroup', {
        url: '/creategroup',
        views: {
            'menuContent': {
                templateUrl: 'templates/creategroup.html',
                controller: 'CreategroupCtrl'
            }
        }
    }) 

     .state('app.editgroup', {
        url: '/editgroup',
        views: {
            'menuContent': {
                templateUrl: 'templates/editgroup.html',
                controller: 'EditgroupCtrl'
            }
        }
    }) 
      .state('app.editprofile', {
        url: '/editprofile',
        views: {
            'menuContent': {
                templateUrl: 'templates/editprofile.html',
                controller: 'EditprofileCtrl'
            }
        }
    }) 
    
    .state('app.viewprofile', {
        url: '/viewprofile',
        views: {
            'menuContent': {
                templateUrl: 'templates/viewprofile.html',
                controller: 'ViewprofileCtrl'
            }
        }
    }) 

    .state('app.newviewprofile', {
        url: '/newviewprofile',
        views: {
            'menuContent': {
                templateUrl: 'templates/newviewprofile.html',
                controller: 'NewviewprofileCtrl'
            }
        }
    })   

     .state('app.addmembers', {
        url: '/addmembers',
        views: {
            'menuContent': {
                templateUrl: 'templates/addmembers.html',
                controller: 'AddmembersCtrl'
            }
        }
    }) 

     .state('app.groupdetail', {
        url: '/groupdetail',
        views: {
            'menuContent': {
                templateUrl: 'templates/groupdetail.html',
                controller: 'GroupdetailCtrl'
            }
        }
    }) 

     .state('app.charts', {
        url: '/charts',
        views: {
            'menuContent': {
                templateUrl: 'templates/charts.html',
                controller: 'ChartsCtrl'
            }
        }
    })  

      .state('app.trends', {
        url: '/trends',
        views: {
            'menuContent': {
                templateUrl: 'templates/trends.html',
                controller: 'TrendsCtrl'
            }
        }
    }) 

     .state('app.me', {
        url: '/me',
        views: {
            'menuContent': {
                templateUrl: 'templates/me.html',
                controller: 'MeCtrl'
            }
        }
    }) 

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })
	.state('app.forgot', {
        url: '/forgot',
        views: {
            'menuContent': {
                templateUrl: 'templates/forgot.html',
                controller: 'Forgotctrl'
            }
        }
    })
	.state('app.newactivity', {
        url: '/newactivity',
        views: {
            'menuContent': {
                templateUrl: 'templates/newactivity.html',
                controller: 'NewactivityCtrl'
            }
        }
    }) 
	.state('app.changepassword', {
        url: '/changepassword',
        views: {
            'menuContent': {
                templateUrl: 'templates/changepassword.html',
                controller: 'ChangepasswordCtrl'
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
