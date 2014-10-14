var log = require('libs/log')(module);

function Hand(dealer, numPlayers, indButton){
  this._seats = this.SEATS.slice(-numPlayers);
  var button = this._seats.indexOf('BU');
  button = button++ ? button : this._seats.indexOf('BB');
  if(button != indButton){
      var afterButton = numPlayers - indButton - 1;
      this._seats = this._seats.slice(button + afterButton + 1).concat(this._seats.slice(0, button + afterButton + 1));
  }
  this._hands = new Array(this._seats.length);
  this._dealer = dealer;
  this._bank = 0;
  this._actions = []; //Actions
  this._board = [];
  this._currentStage = null;

}

function Action(player, type, sum, stage){
  this._type = type;
  this._player = player;
  this._sumForBank = sum;
  this._stage = stage;


}
Hand.prototype.SEATS = ['UTG1', 'UTG2', 'UTG3', 'MP1', 'MP2', 'MP3', 'CO', 'BU', 'SB', 'BB'];
Hand.prototype.STAGES = ['preflop', 'flop', 'turn', 'river', 'showdown'];
Hand.prototype.ACTION_TYPES = ['smallBlind', 'bigBlind', 'fold', 'check', 'call', 'raise'];

Hand.prototype.deal = function(){
  switch(this._currentStage){
    //preflop
    case this.STAGES[0]:
      var dealer = this._dealer;
      for(var i=0; i<this._hands.length; i++){
        this._hands[i] = dealer.deal(2);
      }
      break;

    //flop
    case this.STAGES[1]:
      this._board = this._board.concat(this._dealer.deal(3));
      break;

    //turn, river
    case this.STAGES[2]:
    case this.STAGES[3]:
      this._board = this._board.concat(this._dealer.deal(1));
      break;

    default:
      break;
  }
  log.debug('dealing '+this._currentStage);
  log.debug('hands: '+ this._hands);
  log.debug('board: '+ this._board);
}

Hand.prototype.getState = function(indHand){
  var state = {
    myHand: this._hands[0].toString(),
    board: this._board.toString(),
    hisHand: this._hands[1].toString()
  };

  return JSON.stringify(state);
}

Hand.prototype.goOn = function(){
  if(!this._currentStage) {
    var indStage = 0;
    this._currentStage = this.STAGES[0];
  }
  else{
    indStage = this.STAGES.indexOf(this._currentStage);
    indStage++;
    this._currentStage = this.STAGES[indStage];
  }
  if(indStage < this.STAGES.length-1){
    this.deal();
    return true;
  } else {
    log.debug('end of game');
    return false;
  }
};

module.exports = Hand;
