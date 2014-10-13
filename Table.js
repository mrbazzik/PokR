var Dealer = require('Dealer');
var id = 0;
function Table(numPlayers){
  this._players = new Array(numPlayers);
  this._dealer = new Dealer();
  this._Id = ++this.usedId;
}
Table.prototype.usedId = 0;
Table.prototype.runGame = function(){
  //ask players for blinds
  // deal flop
  // ask for trade round
  // deal turn
  // ask for trade round
  // deal river
  // ask for trade round
}
