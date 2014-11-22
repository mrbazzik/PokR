function Player(id, stack, real, tablePlace){
  this._id = real ? id : "computer"+id;
  //this._user = {};
  this.tablePlace = tablePlace;
  this.real = real;
  this._stack = stack;
  this.hand = [];
  this.seat = '';
  this.currentChoice = {};
  this._putInBank = 0;
  this._winSum = 0;
  this.isWinner = false;
  this._combination = null;
  this._keyCards=[];
  this._kickers=[];
  //this._tradeRounds = 0;
}

Player.prototype.getId = function(){
  return this._id;
};

Player.prototype.getBankInput = function(){
  return this._putInBank;
}

Player.prototype.setBankInput = function(sum){
  this._putInBank = sum;
}

Player.prototype.getStack = function(){
  return this._stack;
}

Player.prototype.setComboInfo = function(combo, keyCards, kickers){
  this._combination = combo;
  this._keyCards = keyCards;
  this._kickers = kickers;
}

Player.prototype.getComboInfo = function(){
  return {
    combo: this._combination,
    keyCards: this._keyCards,
    kickers: this._kickers
  };
  
}

// Player.prototype.getTradeRounds = function(){
//   return this._tradeRounds;
// }

Player.prototype.initForHand = function(){
  this._winSum = 0;
  this.isWinner = false;
  this._combination = null;
  this._keyCards=[];
  this._kickers=[];

  //this._tradeRounds = 0;
}

Player.prototype.calcWinSum = function(players, watchers){
  var sum = 0;
  var arr = [];
  for(var i=0, l=watchers.length; i<l; i++){
    var watcher = watchers[i];  
    if(watcher.type == 'WAITING' || watcher.type == 'OUT'){
      arr.push(watcher.player);
    }
  }
  var corPlayers = players.concat(arr);
  for(var i=0, l=corPlayers.length; i<l; i++){
    var pBankInput = corPlayers[i].getBankInput();
    if(pBankInput < this._putInBank){ //if exited in the middle of trade for example
      sum+=pBankInput;
    }else {
      sum+=this._putInBank;
    }
  }
  //this._putInBank = 0;
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
