angular
    .module('starter.controllers')
    .controller('ClientCheckoutCtrl',
        ['$scope', '$state', '$cart', 'ClientOrder', '$ionicLoading', '$ionicPopup', 'Cupom', '$cordovaBarcodeScanner',
            function ($scope, $state, $cart, ClientOrder, $ionicLoading, $ionicPopup, Cupom, $cordovaBarcodeScanner) {

                var cart = $cart.get();

                $scope.cupom = cart.cupom;
                $scope.items = cart.items;
                $scope.total = $cart.getTotalFinal();

                $scope.removeItem = function (i) {
                    $cart.removeItem(i);
                    $scope.items.splice(i, 1);
                    $scope.tatal = $cart.getTotalFinal();
                };

                $scope.openProductDetail = function (i) {
                    $state.go('client.checkout_item_detail', {index: i});
                };

                $scope.openListProducts = function () {
                    $state.go('client.view_products');
                };

                $scope.save = function () {
                    var o = {items: angular.copy($scope.items)};

                    angular.forEach(o.items, function (item) {
                        item.product_id = item.id
                    });

                    $ionicLoading.show({
                        template: 'Enviando pedido...'
                    });

                    if ($scope.cupom.value) {
                        o.cupom_code = $scope.cupom.code;
                    }

                    ClientOrder.save({id: null}, o, function (data) {
                        $ionicLoading.hide();
                        $state.go('client.checkout_successful');
                    }, function (errorResponse) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Erro',
                            template: 'Erro ao enviar pedido!'
                        });
                    });
                };

                $scope.readBarCode = function () {
                    document.addEventListener("deviceready", function () {
                        $cordovaBarcodeScanner
                            .scan()
                            .then(function (barcodeData) {
                                // Success! Barcode data is here
                                getValueCupom(barcodeData.text);
                            }, function (error) {
                                // An error occurred
                                $ionicPopup.alert({
                                    title: 'Advertência',
                                    template: 'Não foi possível ler o código de barras - Tente novamente'
                                });
                            });
                    }, false);
                };

                $scope.removeCupom = function () {
                    $cart.removeCupom();
                    $scope.cupom = $cart.get().cupom;
                    $scope.total = $cart.getTotalFinal();
                };

                function getValueCupom(code) {
                    $ionicLoading.show({
                        template: 'Carregando...'
                    });

                    Cupom.get(
                        {code: code},
                        function (data) {
                            $cart.setCupom(data.data.code, data.data.value);
                            $scope.cupom = $cart.get().cupom;
                            $scope.total = $cart.getTotalFinal();
                            $ionicLoading.hide();
                        },
                        function (responseError) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Advertência',
                                template: 'Cupom inválido'
                            });
                        });
                };
            }
        ]
    );