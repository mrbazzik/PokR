function Player(id, stack, real){
  this._id = real ? id : "computer"+id;
  //this._user = {};
  this.real = real;
  this._stack = stack;
  this.hand = [];
  this.seat = '';
  this.currentChoice = {};
  this._putInBank = 0;
  this._winSum = 0;
  this.isWinner = false;
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
  this._winSum = 0;
  this.isWinner = false;
  //this._tradeRounds = 0;
}

Player.prototype.calcWinSum = function(players){
  var sum = 0;
  for(var i=0, l=players.length; i<l; i++){
    var pBankInput = players[i].getBankInput();
    if(pBankInput < this._putInBank){ //if exited in the middle of trade for example
      sum+=pBankInput;
    }else {
      sum+=this._putInBank;
    }
  }
  this._putInBank = 0;
  this._winSum+=sum;
}

Player.prototype.makeWin = function(sum, winner){
  this._stack+=sum;
  this.isWinner = winner;
  //this._winSum = 0;
  //return bank;
}

Player.prototype.getWinSum = function(){
  return this._winSum;
}

Player.prototype.makeBet = function(bet){
  this._stack-=bet;
  this._putInBank+=bet;
//  if(newRound) this._tradeRounds++;
}
module.exports = Player;
