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

Card.getValsString = function(cards){
	var arr = cards.map(function(card){
		return Card.prototype.VALS[card.val];
	});
	return arr.join('');
};

Card.getSuitsString = function(cards){
	var arr = cards.map(function(card){
		return Card.prototype.SUITS[card.suit];
	});
	return arr.join('');
};

Card.getValsInds = function(vals){
	var arr = [];
	for(var i=0, l=vals.length; i<l; i++){
		arr.push(Card.prototype.VALS.indexOf(vals[i]));
	}
	return arr;
};


// Card.prototype.compare = function(card){
// 	if(this.val > card.val) {
// 		return 1;
// 	} else if (this.val == card.val){
// 		return 0;
// 	} else {
// 		return -1;
// 	}
  
// }

// Card.compareVals = function(a, b){
// 	var aVal = Card.prototype.VALS.indexOf(a);
// 	var bVal = Card.prototype.VALS.indexOf(b);
// 	if(aVal > bVal){
// 		return 1;
// 	} else if(aVal == bVal){
// 		return 0;
// 	} else {
// 		return -1;
// 	}
// };

Card.sort = function(cards, byVal){
	
	if(byVal){
		var sortFunc = function(a, b){
			// var aVal = Card.prototype.VALS.indexOf(a.val);
			// var bVal = Card.prototype.VALS.indexOf(b.val);
			if( a.val > b.val || (a.val === b.val && a.suit > b.suit)) return 1;
			else return -1;
		};
	} else {
		sortFunc = function(a, b){
			// var aVal = Card.prototype.VALS.indexOf(a.val);
			// var bVal = Card.prototype.VALS.indexOf(b.val);
			//var aSuit = Card.prototype.SUITS.indexOf(a.suit);
			//var bSuit = Card.prototype.SUITS.indexOf(b.suit);
			if(a.suit > b.suit || (a.suit === b.suit && a.val > b.val)) return 1;
			else return -1;
		};
	}
	cards.sort(sortFunc);
}
module.exports = Card;
