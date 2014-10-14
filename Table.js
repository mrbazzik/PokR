var Dealer = require('Dealer');
var Hand = require('Hand');

function Table(numPlayers, users, blinds, startStack){
  this.players = new Array(numPlayers);
  this._dealer = new Dealer();
  this._id = new Date().getTime();
  //this._currentHand
  this.startHand();
}

Table.prototype.getId = function(){
  return this._id;
}
Table.prototype.getDealer = function(){
  return this._dealer;
}

Table.prototype.getCurrentHand = function(){
  return this._currentHand;
}
Table.prototype.goOn = function(){
  if(this._currentHand){
    var result = this._currentHand.goOn();
    if(result) return this.getState();
    else {
      this._currentHand = null;
      return false;
    }
  }
};

Table.prototype.getState = function(){
  return this._currentHand.getState();
};

Table.prototype.startHand = function(){
  //var numPlayers = this.players.length;
  //this._button = Math.round(Math.random()*numPlayers);
  this._currentHand = new Hand(this);
  //if(this._button > numPlayers-1) this._button = 0;
  //this._currentHand.goOn();
}



module.exports = Table;
