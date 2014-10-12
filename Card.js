function Card(val, suit){
  this.val = val;
  this.suit = suit;
}
Card.prototype.SUITS = ['spades', 'clubs', 'diamonds', 'hearts'];

Card.prototype.VALS = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];

Card.prototype.toString = function(){
  return VALS[this.val]+SUITS[this.suit];
}

Card.prototype.isEqual = function(card){
  return (this.val == card.val && this.suit == card.suit);
}
module.exports = Card;
