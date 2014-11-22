var Dealer = require('Dealer');
var Hand = require('Hand');
var Player = require('Player');

function Table(numPlayers, users, blinds, startStack){
  this.players = new Array(numPlayers);
  this.watchers = [];
  this._dealer = new Dealer();
  this._id = new Date().getTime();
  this._currentHand = null;
  this.blinds = blinds;
  this._createPlayers(users, startStack);
  this.startHand();
}

Table.prototype._createPlayers = function(users, stack){
  for(var i=0; i<this.players.length; i++){
    if(i<users.length){
    this.players[i] = new Player(users[i].id, stack, true, i);

    }else{

    this.players[i] = new Player(i, stack, false, i);
    }
  }
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
Table.prototype.nextStage = function(){
  if(this._currentHand){
    return this._currentHand.nextStage();
  }
};

Table.prototype.getState = function(idPlayer){
  return this._currentHand.getState(idPlayer);
};

Table.prototype.getPlayer = function(idPlayer){
  for(var i=0; i<this.players.length; i++){
    if(this.players[i].getId() == idPlayer){
      return this.players[i];
    }
  }
}

Table.prototype.getStates = function(withLastAction){
  if(this._currentHand){
    return this._currentHand.getStates(withLastAction);
  }
}

Table.prototype.startHand = function(){

  this._dealer.shuffle();
  this._currentHand = new Hand(this);
}

Table.prototype.handleDecision = function(message){
  if(this._currentHand){
    return this._currentHand.handleDecision(message);
  }

}
Table.prototype.handleState = function(message){
  if(this._currentHand && message.choice){
    if(message.choice.actions.indexOf('CHECK')+1) {
      var act = 'CHECK';
      var sum = 0;
    }
    else if (message.choice.actions.indexOf('FOLD')+1){
      act = 'FOLD';
      sum = 0;
    } else {
      act = 'CALL';
      sum = message.choice.sum;
    }

    var answer = {
      'id': message.id,
       'action': act ,
       'sum': sum
    };
    return this.handleDecision(answer);
  }
  else return null;
}



module.exports = Table;
