var Card  = require('card');
function Dealer(){
  this._dealed = [];

}



Dealer.prototype._isDealed = function(card){
  for(var i=0; i<this._dealed.length; i++){
    if(card.isEqual(this._dealed[i])){
      return true;
    }
  }
  return false;
};

Dealer.prototype._getCard = function(){
  var cardValue = Math.round(Math.random()*(Card.prototype.VALS.length-1));
  var cardSuit = Math.round(Math.random()*(Card.prototype.SUITS.length-1));
  return new Card(cardValue, cardSuit);

};


Dealer.prototype.deal = function(numOfCards){
  var cards = [];
  for(var i=0; i< numOfCards; i++){
    var card = this._getCard();
    while(this._isDealed(card)){
      card = this._getCard();
    }
    this._dealed.push(card);
    cards.push(card);
  }
  return cards;

};
Dealer.prototype.shuffle = function(){
  this._dealed = [];
};

module.exports = Dealer;
