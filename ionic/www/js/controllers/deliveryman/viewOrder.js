angular
    .module('starter.controllers')
    .controller('DeliverymanViewOrderCtrl',
        ['$scope', '$stateParams', 'DeliverymanOrder', '$ionicLoading', '$ionicPopup', '$cordovaGeolocation',
            function ($scope, $stateParams, DeliverymanOrder, $ionicLoading, $ionicPopup, $cordovaGeolocation) {

                var watch;

                $scope.order = {};

                $ionicLoading.show({
                    template: 'Carregando...'
                });

                DeliverymanOrder.get({id: $stateParams.id, include: 'items,cupom'}, function (data) {
                    $scope.order = data.data;
                    $ionicLoading.hide();
                }, function (errorResponse) {
                    $ionicLoading.hide();
                });

                $scope.goToDelivery = function () {
                    $ionicPopup.alert({
                        title: 'Advertência',
                        template: 'Para para a localização dê ok.'
                    }).then(function () {
                        stopWatchPosition();
                    });

                    DeliverymanOrder.updateStatus({id: $stateParams.id}, {status: 1}, function (dataSuccess) {
                        var watchOptions = {
                            timeout: 3000,
                            enableHighAccuracy: false
                        };

                        watch = $cordovaGeolocation.watchPosition(watchOptions);
                        watch.then(null,
                            function (errorResponse) {
                                console.log(errorResponse);
                            }, function (position) {
                                DeliverymanOrder.geo({id: $stateParams.id}, {
                                    lat: position.coords.latitude,
                                    long: position.coords.longitude
                                });
                            });

                    });
                };

                function stopWatchPosition() {
                    if (watch && typeof watch == 'object' && watch.hasOwnProperty('watchID')) {
                        $cordovaGeolocation.clearWatch(watch.watchID);
                    }
                };

            }]);