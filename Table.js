var Dealer = require('Dealer');
var Hand = require('Hand');
var Player = require('Player');

function Table(numPlayers, users, blinds, startStack){
  this.players = new Array(numPlayers);
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
    this.players[i] = new Player(users[i].id, stack, true);

    }else{

    this.players[i] = new Player(i, stack, false);
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

Table.prototype.getStates = function(){
  if(this._currentHand){
    return this._currentHand.getStates();
  }
}

Table.prototype.startHand = function(){

  this._currentHand = new Hand(this);

}

Table.prototype.handleDecision = function(message){
  if(this._currentHand){
    return this._currentHand.handleDecision(message);
  }

}
Table.prototype.handleState = function(message){
  if(this._currentHand && message.choice){
    if(message.choice.actions.indexOf('CALL')+1) {
      var act = 'CALL';
      var sum = message.choice.sum;
    }
    else if (message.choice.actions.indexOf('RAISE')+1){
      act = 'RAISE';
      sum = 100;
    } else {
      act = 'CHECK';
      sum = 0;
    }

    var answer = {
      'id': 'computer1',
       'action': act ,
       'sum': sum
    };
    return this.handleDecision(answer);
  }
  else return null;
}



module.exports = Table;
