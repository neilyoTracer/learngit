/**
 * Created by neilyo on 2017/3/7.
 */
var app = angular.module('myApp',['ng']);

app.controller('myCtrl',["$scope",function($scope){
  $scope.list = [
    {name:'King',birthday:'2011-11-11',isSelected:false},
    {name:'Michael',birthday:'2012-12-12',isSelected:false},
    {name:'Jack',birthday:'2021-21-21',isSelected:false}
  ]
  $scope.select = false;
  //$scope.selectAll = false;
  //查看状态按钮事件绑定
  $scope.checkStatus = function(){
    var result = "";
    angular.forEach($scope.list,function(value,key){
      if(value.isSelected) result += value.name + '被选中\n';
    })
    if(result == '') result += '都未选中!';
    alert(result);
  }
  //单选控制全选事件
  $scope.funcClick = function(){
    for(var i=0;i<$scope.list.length;i++){
      if(!$scope.list[i].isSelected){
        $scope.select = false;
        return;
      }
    }
    $scope.select = true;
  }
  //全选控制单选事件
  $scope.checkAll = function(){
    $scope.select = !$scope.select;//这里一定要先取反
    angular.forEach($scope.list,function(value,key){
      value.isSelected = $scope.select;
    })
  }
}])