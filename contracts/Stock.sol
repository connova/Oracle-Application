// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
 contract Stock {
     struct stock {
     uint price;
     uint volume;
     }
     /// quotes by symbol
     mapping( bytes4 => stock) stockQuote;
     /// Contract owner
     address oracleOwner;
     function setStock(bytes4 symbol, uint _price, uint _volume) public {
         stock memory newStock;
         newStock.price = _price;
         newStock.volume = _volume;
         stockQuote[symbol] = newStock;
     }
     function getStockPrice(bytes4 symbol) public view returns (uint) {
         return stockQuote[symbol].price;
     }
     function getStockVolume(bytes4 symbol) public view returns (uint) {
         return stockQuote[symbol].volume;
     }
}