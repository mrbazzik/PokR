var log = require('libs/log')(module);
var Player = require('Player');

function Hand(table){
  //this._seats = this.SEATS.slice(-numPlayers);
  // var button = this._seats.indexOf('BU');
  // button = button++ ? button : this._seats.indexOf('BB');
  // if(button != indButton){
  //     var afterButton = numPlayers - indButton - 1;
  //     this._seats = this._seats.slice(button + afterButton + 1).concat(this._seats.slice(0, button + afterButton + 1));
  // }
  //this._hands = new Array(this._seats.length);
  this._table = table;
  this._bank = 0;
  this._actions = []; //Actions
  this._board = [];
  this._currentStage = null;
  this._tradePlayer = null;
  //this._makeSeats();
  this._numRaises = 0;

  this._table.players.forEach(function(item){
    item.initForHand();
  });

}

function Action(player, type, sum, stage){
  this.type = type;
  this.player = player;
  this.sumForBank = sum;
  this.stage = stage;


}

Action.prototype.toString = function(){
  var str = "Player "+this.player.getId()+" makes "+this.type;
  if(this.type != 'CHECK') str+= " for "+this.sumForBank;
  return str;
}

function Choice(actions, sum, answering){
    this.actions = actions;
    this.sum = sum;
    this.answering = answering;
}

Hand.prototype.SEATS = ['SB', 'BB', 'UTG1', 'UTG2', 'UTG3', 'MP1', 'MP2', 'MP3', 'CO', 'BU'];

//TODO: make constants?
Hand.prototype.STAGES = ['PREFLOP', 'FLOP', 'TURN', 'RIVER', 'SHOWDOWN'];
Hand.prototype.ACTIONS = ['SMALL_BLIND', 'BIG_BLIND', 'CHECK', 'BET', 'FOLD', 'CALL', 'RAISE'];
Hand.prototype.MAX_NUM_RAISES = 3;

Hand.prototype._getChoice = function(seat){
  if(this._currentStage == 'PREFLOP'){
    if(seat == 'SB'){
      return new Choice(this.ACTIONS.slice(-3), this._table.blinds[1] - this._table.blinds[0], true);
    }else if(seat == 'BB'){
      return new Choice(this.ACTIONS.slice(2,4), 0, true);
    }else{
      return new Choice(this.ACTIONS.slice(-3), this._table.blinds[1], true);
    }
  }else {
    return new Choice(this.ACTIONS.slice(2, 5), this._table.blinds[1], true);
  }

  return choices;
};

Hand.prototype._makeSeats = function(){
  var indSB = this._getNextSB();
  if(!indSB){
    indSB = Math.round(Math.random()*(this._table.players.length-1));
  }

  if(indSB == this._table.players.length-1) var correction = this._table.players.length;
  else correction = 0;
  for(var i=0; i<this._table.players.length; i++){
    var player = this._table.players[i];
    if(i == indSB) {
      var seat = 'SB';
      }
    else {
      seat = this.SEATS.slice(i - indSB + correction)[0];
    }
    if(seat == 'SB') player.makeBet(this._table.blinds[0]);
    else if(seat == 'BB') player.makeBet(this._table.blinds[1]);
    player.seat = seat;
    player.currentChoice = this._getChoice(seat);
  }
};

Hand.prototype._findSeat = function(seat){
  for(var i=0; i< this._table.players.length; i++){
    if(this._table.players[i].seat == seat) return i;
  }
  return null;
};

Hand.prototype._getNextSB = function(){
  for(var i=1; i<this.SEATS.length; i++){
    var indSB = this._findSeat(this.SEATS[i]);
    if(indSB != null) return indSB;
  }
};

Hand.prototype.deal = function(){
  switch(this._currentStage){
    //preflop
    case this.STAGES[0]:
      //var dealer = this._dealer;
      for(var i=0; i<this._table.players.length; i++){
        this._table.players[i].hand = this._table.getDealer().deal(2);
        //this._hands[i] = dealer.deal(2);
      }
      break;

    //flop
    case this.STAGES[1]:
      this._board = this._board.concat(this._table.getDealer().deal(3));
      break;

    //turn, river
    case this.STAGES[2]:
    case this.STAGES[3]:
      this._board = this._board.concat(this._table.getDealer().deal(1));
      break;

    default:
      break;
  }
  //log.debug('dealing '+this._currentStage);
  //log.debug('hands: '+ this._hands);
  //log.debug('board: '+ this._board);
};

Hand.prototype.getState = function(player, withChoice){
  if(!(player instanceof Player)) player = this._table.getPlayer(player);
  var state = {
    id: player.getId(),
    real: player.real,
    hand: player.hand.toString(),
    board: this._board.toString(),
    seat: player.seat,
    stack: player.getStack(),
  };
  if(this._actions.length > 0) state.lastAction = this._actions[this._actions.length-1].toString()
  if(withChoice) state.choice = player.currentChoice;

  return state;
};

Hand.prototype._getFirstPlayerForTrade = function(){
  if(this._currentStage == this.STAGES[0]){
    var indPlayer = this._findSeat('BB');
    var player = this._nextPlayer(indPlayer);
  }else{
    player = this._table.players[this._findSeat('SB')];
  }
  return player;
};

Hand.prototype.nextStage = function(){

  if(!this._currentStage) {
    var indStage = 0;
    this._currentStage = this.STAGES[0];
    this._makeSeats();
  }
  else{
    indStage = this.STAGES.indexOf(this._currentStage);
    indStage++;
    this._currentStage = this.STAGES[indStage];
    //this._makeSeats();
  }
  //this._makeSeats();

  if(indStage < this.STAGES.length-1){
    this.deal();
    this._tradePlayer = null;
    this._numRaises = 0;
    return this._currentStage;
    //trade round
    // var player = this._getFirstPlayerForTrade();
    // return this.getState(player, true);
  } else {
    log.debug('end of game');
    return false;
  }
};

Hand.prototype._nextPlayer = function(player){
  if(player instanceof Player){
    player = this._table.players.indexOf(player);
  }
  if(player == this._table.players.length-1) player = 0;
  else player++;

  return this._table.players[player];
}

Hand.prototype.getStates = function(){
  if(!this._tradePlayer){
    this._tradePlayer = this._getFirstPlayerForTrade();
  } else {
    this._tradePlayer = this._nextPlayer(this._tradePlayer);
  }
  var states = [];
  for(var i=0; i<this._table.players.length; i++){
    if(this._table.players[i] == this._tradePlayer){
      states.push(this.getState(this._table.players[i], true));
    } else{
      states.push(this.getState(this._table.players[i], false));
    }

  }
  return states;
}

Hand.prototype.handleDecision = function(message){
    var action = new Action(this._table.getPlayer(message.id), message.action, +message.sum, this._currentStage);
    this._actions.push(action);

    if(message.action == 'RAISE') this._numRaises++;
    action.player.makeBet(+message.sum);

    this._editChoices(action);
    return this._checkTrade();
}

Hand.prototype._checkTrade = function(){
  var bank = 0;
//  var tradeRound = null;
  //var bankInput = null;
  for(var i=0; i<this._table.players.length; i++){
    //var player = this._table.players[i];
    // pTradeRound = player.getTradeRounds();
    // pBankInput = player.getBankInput();
    // if(tradeRound == null){
    //   tradeRound = pTradeRound;
    //   bankInput = pBankInput;
    //} else
      if(this._table.players[i].currentChoice.answering){
      return true;
    } else {
      bank+=this._table.players[i].getBankInput();
    }
  }
  this._bank+=bank;
  return false;
}

Hand.prototype._editChoices = function(action){
    for(var i=0; i<this._table.players.length; i++){
      var player = this._table.players[i];
      var useRaise = (this._numRaises < this.MAX_NUM_RAISES);
      if(player == action.player){
        var actions = this.ACTIONS.slice(2, 5);
        //if(useRaise) actions.push('RAISE');
        player.currentChoice = new Choice(actions, 0, false);
      }else if(action.type == 'RAISE' || action.type == 'BET'){
        actions = ['FOLD', 'CALL'];
        if(useRaise) actions.push('RAISE');
        player.currentChoice = new Choice(actions, action.player.getBankInput() - player.getBankInput(), true);
      }
    }
}

module.exports = Hand;
