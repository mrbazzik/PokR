function Card(val, suit){
  this.val = val;
  this.suit = suit;
}
Card.prototype.SUITS = [String.fromCharCode(9824), String.fromCharCode(9827), String.fromCharCode(9830), String.fromCharCode(9829)]; //'spades', 'clubs', 'diamonds', 'hearts'

Card.prototype.VALS = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];

Card.prototype.toString = function(){
  return this.VALS[this.val]+this.SUITS[this.suit];
}

Card.prototype.isEqual = function(card){
  return (this.val == card.val && this.suit == card.suit);
}
module.exports = Card;
