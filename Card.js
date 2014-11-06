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

Card.prototype.compare = function(card){
	if(this.val > card.val) {
		return 1;
	} else if (this.val == card.val){
		return 0;
	} else {
		return -1;
	}
  return (this.val == card.val && this.suit == card.suit);
}

Card.compareVals = function(a, b){
	var aVal = Card.prototype.VALS.indexOf(a);
	var bVal = Card.prototype.VALS.indexOf(b);
	if(aVal > bVal){
		return 1;
	} else if(aVal == bVal){
		return 0;
	} else {
		return -1;
	}
};

Card.sort = function(cards, byVal){
	var byVal = byVal || true;
	if(byVal){
		var sortFunc = function(a, b){
			var aVal = Card.prototype.VALS.indexOf(a.val);
			var bVal = Card.prototype.VALS.indexOf(b.val);
			if( aVal > bVal) return 1;
			else return -1;
		};
	} else {
		sortFunc = function(a, b){
			var aVal = Card.prototype.VALS.indexOf(a.val);
			var bVal = Card.prototype.VALS.indexOf(b.val);
			var aSuit = Card.prototype.SUITS.indexOf(a.suit);
			var bSuit = Card.prototype.SUITS.indexOf(b.suit);
			if(aSuit > bSuit || (aSuit === bSuit && aVal > bVal)) return 1;
			else return -1;
		};
	}
	cards.sort(sortFunc);
}
module.exports = Card;
