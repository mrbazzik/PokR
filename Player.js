function Player(id, stack, real){
  this._id = real ? id : "computer"+id;
  //this._user = {};
  this.real = real;
  this._stack = stack;
  this.hand = [];
  this.seat = '';
  this.currentChoice = {};
  this._putInBank = 0;
  //this._tradeRounds = 0;
}

Player.prototype.getId = function(){
  return this._id;
};

Player.prototype.getBankInput = function(){
  return this._putInBank;
}

Player.prototype.getStack = function(){
  return this._stack;
}

// Player.prototype.getTradeRounds = function(){
//   return this._tradeRounds;
// }

Player.prototype.initForHand = function(){
  this._putInBank = 0;
  //this._tradeRounds = 0;
}

Player.prototype.makeBet = function(bet){
  this._stack-=bet;
  this._putInBank+=bet;
//  if(newRound) this._tradeRounds++;
}
module.exports = Player;
