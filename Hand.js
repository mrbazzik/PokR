var log = require('libs/log')(module);
var Player = require('Player');
var Card = require('Card');
var tables = require('tables');
var COMBS = tables.get('combs');
var COMBS_KEYS = Object.keys(COMBS);

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
  this._infoWin = "";
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
    if(seat == 'SB') {
      var sum = this._table.blinds[0];
      player.makeBet(sum);
      this._bank+=sum;
    }
    else if(seat == 'BB') {
      sum = this._table.blinds[1];
      player.makeBet(sum);
      this._bank+=sum;
    }
    player.seat = seat;
    player.currentChoice = this._getChoice(seat);
  }
};

Hand.prototype._initChoices = function(){
  for(var i=0, l=this._table.players.length; i<l; i++){
    var player = this._table.players[i];
    player.currentChoice = this._getChoice(player.seat);
    player.lastAction = "";
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

/**
 * edits players' info, setting combo, key cards, kickers and place
 */
Hand.prototype._getWinners = function(){
  var players = this._table.players;
  players.forEach(function(player){
    this._checkCombination(player);
  });
  var winners = players.map(function(player){
    return {
       player: player,
       place: players.length
    };
  });
  winners.sort(function(a,b){
    var aInfo = a.player.getComboInfo();
    var bInfo = b.player.getComboInfo();
    if(aInfo.combo.index > bInfo.combo.index){
      a.place--;
      return 1;
    } else if(aInfo.combo.index < bInfo.combo.index){
      b.place--;
      return -1;
    } else {
      for(var i=0, l=aInfo.keyCards.length; i<l; i++){
        var resCompare = Card.compare(aInfo.keyCards[i], bInfo.keyCards[i]);
        if(resCompare == 1){
          a.place--;
          return 1;
        } else if(resCompare == -1){
          b.place--;
          return -1;
        }
      }
      for(var i=0, l=aInfo.kickers.length; i<l; i++){
        var resCompare = Card.compare(aInfo.kickers[i], bInfo.kickers[i]);
        if(resCompare == 1){
          a.place--;
          return 1;
        } else if(resCompare == -1){
          b.place--;
          return -1;
        }
      }

    }
  });
  return winners;
  //var i = Math.round(Math.random()*(players.length-1));
  //return players.slice(i).concat(players.slice(0,i-1));

}


/**
 * Goes through all combinations and check them in player's hand
 * Extract index of combo, key cards of combo and kickers for easier later comparison
 * @param  {Player} player
 * @return {[type]}
 */
 Hand.prototype._checkCombination=function(player){

  var cards = this._board.concat(player.hand);
  var comboLength = 5;
  Card.sort(cards, true);
  var cardsVals = cards.map(function(item){
    return item.val;
  });

  cardsVals = cardsVals.join('');
  for(var i=0, l=COMBS_KEYS.length; i<l; i++){
    var combo = COMBS[COMBS_KEYS[i]];
    var keyCards = [];
    var valsFound = true;
    var cardsFound = [];
    if(combo.vals === 'order'){
      var numPossibilities = cards.length - comboLength;
      valsFound = false;
      for(var k=numPossibilities; k>=0; k--){
        var prevCard = cards[k];
        cardsFound.push(prevCard);
        
        for(var n=k+1; cardsFound.length<comboLength; n++){
          var resCompare = cards[n].compare(prevCard);
          if(resCompare >= 0){
            prevCard = cards[n];
            if(resCompare == 0){
              cardsFound.pop());  
            }
            cardsFound.push(cards[n]);
          } else {
            cardsFound = [];
            break;
          }
        }
        if(cardsFound.length > 0){
          keyCards.push(cards[n].val);
          valsFound = true;
          break;
        }
      }
      //checking order from Ace
      if(cardsFound.length == 0 && cards[0].val == '2' && cards[cards.length-1].val == 'A'){
        var prevCard = cards[0];
        for(var n=1; cardsFound.length<comboLength; n++){
          var resCompare = cards[n].compare(prevCard);
          if(resCompare >= 0){
            prevCard = cards[n];
            if(resCompare == 0){
              cardsFound.pop());  
            }
            cardsFound.push(cards[n]);
          } else {
            cardsFound = [];
            break;
          }
        }
        if(cardsFound.length > 0){
          keyCards.push(cards[n].val);
          valsFound = true;
          
        }     
      }

    } else {  //an array
      for(var k=0, v=combo.vals.length; k<v; k++){
        var val = combo.vals[k];
        var exp = new RegExp('(?=(.))\\1{'+val+'}', 'g');  //matches repeated values
        var comboParts = cardsVals.match(exp);
        if(comboParts === null) {
          valsFound = false;
          break;
        } else {
          var highPart = comboParts.pop();
          var indHighPart = cardsVals.lastIndexOf(highPart);
          cardsVals = cardsVals.replace(highPart,'');
          keyCards.push(highPart[0]);
          cardsFound.concat(cards.slice(indHighPart,indHighPart+val));
          
        }
        
      }

      if(valsFound){
        if(combo.suits){
          if(cardsFound.length === 0){
            Card.sort(cards, false);
            var cardsSuits = cards.map(function(item){
              return item.suit;
            });

            cardsSuits = cardsSuits.join('');
            var exp = new RegExp('(?=(.))\\1{'+comboLength+'}', 'g');
            var comboParts = cardsSuits.match(exp);
            if(comboParts !== null){
              var highPart = comboParts.pop();
              var indHighPart = cardsSuits.lastIndexOf(highPart);
              var comboInfo = {
                name: COMBS_KEYS[i],
                index: combo.index
              };
              keyCards.push(cards[indHighPart+comboLength-1].val);
              player.setComboInfo(comboInfo, keyCards, []);
              break;
            }
            Card.sort(cards, true);
          } else {
            var suit = null;
            var sameSuit = true;
            for(k=0, v=cardsFound.length; k<v; k++){
              if(suit === null){
                suit = cardsFound[i].suit;
              } else if(suit !== cardsFound[i].suit){
                 sameSuit = false;
                 break; 
              }
            }
            if(sameSuit){
              var comboInfo = {
                name: COMBS_KEYS[i],
                index: combo.index
              };
              player.setComboInfo(comboInfo, keyCards, []);
              break;
            }
            
          }

        } else {
          var comboInfo = {
            name: COMBS_KEYS[i],
            index: combo.index
          };
          var kickers = cardsVals.splice(-1, comboLength - cardsFound.length);
          player.setComboInfo(comboInfo, keyCards, kickers);
          break;
        }
      }
    }
  }

 }



Hand.prototype.getState = function(player, withChoice, withLastAction){
  if(!(player instanceof Player)) player = this._table.getPlayer(player);
  var state = {
    id: player.getId(),
    real: player.real,
    hand: player.hand.toString(),
    board: this._board.toString(),
    seat: player.seat,
    stacks: [],
    bank: this._bank,
    choicer: this._tradePlayer.getId(),
    winner: player.isWinner,
    winSum: player.getWinSum(),
    infoWin: this._infoWin
  };
  if(withLastAction && this._actions.length > 0) state.lastAction = this._actions[this._actions.length-1].toString()
  if(withChoice) state.choice = player.currentChoice;

  for(var i=0, l=this._table.players.length; i<l; i++){
    var player = this._table.players[i];
     var obj={};
     obj[player.getId()] = player.getStack();

    state.stacks.push(obj);
  }
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

/**
 * Handles all stages of hand, determing seats and dealing cards
 * At the end it divides bank among players acordingly to their win place and amount of money they have contibuted in the bank
 * (potential win sum of each player is calculated at the end of every trade round, considering the amount of money each player put in the bank)
 * @return {[type]}
 */
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
    this._initChoices();
  }
  //this._makeSeats();

  if(indStage < this.STAGES.length-1){
    this.deal();
    this._tradePlayer = null;
    this._numRaises = 0;
  //  this._bank = 0;
    return this._currentStage;
    //trade round
    // var player = this._getFirstPlayerForTrade();
    // return this.getState(player, true);
  } else {
    var winners = this._getWinners();
    var arrWin = [];
    for(var i=0, l=winners.length; i<l && this._bank>0; i++){
      var winner = winners[i];
      var winSum = winner.player.getWinSum();
      var divider = 1;
      for(var k = i+1; k<l; k++){
        if(winners[k].place == winner.place){
          divider++;
        } else{
          break;
        }
      }
      var bankPart = this._bank/divider;
      var curSum = (bankPart <= winSum) ? bankPart : winSum;
      winner.player.makeWin(curSum, (i==0));
      arrWin.push(winner.player.getId()+" won "+curSum);
      this._bank -= curSum;
    }
    this._infoWin = arrWin.join('\n');
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

Hand.prototype.getStates = function(withLastAction){
  if(!this._tradePlayer){
    this._tradePlayer = this._getFirstPlayerForTrade();
  } else {
    this._tradePlayer = this._nextPlayer(this._tradePlayer);
  }
  var states = [];
  for(var i=0; i<this._table.players.length; i++){
    var player = this._table.players[i];
    if(player == this._tradePlayer && player.currentChoice.answering){
      states.push(this.getState(player, true, withLastAction));
    } else{
      states.push(this.getState(player, false, withLastAction));
    }

  }
  return states;
}

Hand.prototype.handleDecision = function(message){
    var action = new Action(this._table.getPlayer(message.id), message.action, +message.sum, this._currentStage);
    this._actions.push(action);

    if(message.action == 'RAISE') this._numRaises++;
    action.player.makeBet(+message.sum);
    this._bank+=(+message.sum);

    this._editChoices(action);
    return this._checkTrade();
}

Hand.prototype._checkTrade = function(){

  for(var i=0; i<this._table.players.length; i++){
    var player = this._table.players[i];
      if(player.currentChoice.answering){
      return true;
    }
  }
  for(var i=0; i<this._table.players.length; i++){
    var player = this._table.players[i];
    player.calcWinSum(this._table.players);
  }

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
