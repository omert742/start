var NodeAngularApp = angular.module('NodeAngularApp',['ngRoute'])



NodeAngularApp.config(function($routeProvider,$locationProvider){
             
$routeProvider
.when('/',{
    templateUrl: 'login.html',
    controller: 'mainController'
})
.when('/register',{
    templateUrl: 'register.html',
    controller: 'mainController'
})
.when('/login',{
    templateUrl: 'login.html',
    controller: 'mainController'
})
.when('/add',{
        templateUrl: 'add.html',
        controller: 'secondController'
})

    
});

NodeAngularApp.controller('mainController',function($scope,$log,$location){
            $log.info("mainController")

    $scope.name = 'Omer Tamir2'
    $scope.occuption = 'Gamer'
    
    $scope.getname = function(){
        return $scope.name;
    }
     $scope.getname();
        
            
});


NodeAngularApp.controller('secondController',function($scope,$log,$location){
            $log.info("secondController")

    $scope.name = 'Omer Tamir'
    $scope.occuption = 'Coder'
    
    $scope.getname = function(){
        return $scope.name;
    }
     $scope.getname();
    
        
            
});









