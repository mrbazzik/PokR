var Card = require('Card');

function checkComboTest(hand, player){
	
	//pair
	var arr=[];
	arr[0] = new Card(5,2);
	arr[1] = new Card(1,1);
	arr[2] = new Card(9,3);
	arr[3] = new Card(5,0);
	arr[4] = new Card(11,2);
	arr[5] = new Card(6,2);
	arr[6] = new Card(7,3);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========pair===========");
	console.log(player.getComboInfo());
	//two pairs
	var arr=[];
	arr[0] = new Card(8,0);
	arr[1] = new Card(4,1);
	arr[2] = new Card(12,3);
	arr[3] = new Card(12,2);
	arr[4] = new Card(4,0);
	arr[5] = new Card(0,1);
	arr[6] = new Card(11,2);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========two pairs===========");
	console.log(player.getComboInfo());
	//three
	var arr=[];
	arr[0] = new Card(3,3);
	arr[1] = new Card(5,1);
	arr[2] = new Card(4,2);
	arr[3] = new Card(10,3);
	arr[4] = new Card(3,2);
	arr[5] = new Card(0,0);
	arr[6] = new Card(3,1);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========three===========");
	console.log(player.getComboInfo());
	//straight
	var arr=[];
	arr[0] = new Card(3,3);
	arr[1] = new Card(4,1);
	arr[2] = new Card(4,2);
	arr[3] = new Card(7,3);
	arr[4] = new Card(7,1);
	arr[5] = new Card(6,0);
	arr[6] = new Card(5,3);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========straight===========");
	console.log(player.getComboInfo());
	//straight
	var arr=[];
	arr[0] = new Card(1,3);
	arr[1] = new Card(2,1);
	arr[2] = new Card(2,2);
	arr[3] = new Card(12,3);
	arr[4] = new Card(12,1);
	arr[5] = new Card(0,0);
	arr[6] = new Card(3,3);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========straight===========");
	console.log(player.getComboInfo());
	//flush
	var arr=[];
	arr[0] = new Card(2,3);
	arr[1] = new Card(4,3);
	arr[2] = new Card(4,2);
	arr[3] = new Card(7,3);
	arr[4] = new Card(7,2);
	arr[5] = new Card(6,3);
	arr[6] = new Card(5,3);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========flush===========");
	console.log(player.getComboInfo());
	//full house
	var arr=[];
	arr[0] = new Card(3,3);
	arr[1] = new Card(4,3);
	arr[2] = new Card(4,2);
	arr[3] = new Card(7,0);
	arr[4] = new Card(7,1);
	arr[5] = new Card(6,0);
	arr[6] = new Card(7,3);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========full house===========");
	console.log(player.getComboInfo());
	//four
	var arr=[];
	arr[0] = new Card(7,2);
	arr[1] = new Card(11,3);
	arr[2] = new Card(9,2);
	arr[3] = new Card(7,0);
	arr[4] = new Card(7,1);
	arr[5] = new Card(6,0);
	arr[6] = new Card(7,3);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========four===========");
	console.log(player.getComboInfo());
	//straight flush
	var arr=[];
	arr[0] = new Card(7,3);
	arr[1] = new Card(11,2);
	arr[2] = new Card(9,2);
	arr[3] = new Card(8,2);
	arr[4] = new Card(7,2);
	arr[5] = new Card(6,0);
	arr[6] = new Card(10,2);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========straight flush===========");
	console.log(player.getComboInfo());//straight flush
	//flush
	var arr=[];
	arr[0] = new Card(7,3);
	arr[1] = new Card(12,2);
	arr[2] = new Card(9,2);
	arr[3] = new Card(8,2);
	arr[4] = new Card(7,2);
	arr[5] = new Card(6,0);
	arr[6] = new Card(10,2);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========flush===========");
	console.log(player.getComboInfo());
	//straight
	var arr=[];
	arr[0] = new Card(7,3);
	arr[1] = new Card(12,2);
	arr[2] = new Card(9,1);
	arr[3] = new Card(8,2);
	arr[4] = new Card(7,2);
	arr[5] = new Card(6,0);
	arr[6] = new Card(10,2);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========straight===========");
	console.log(player.getComboInfo());
	//straight flush
	var arr=[];
	arr[0] = new Card(7,3);
	arr[1] = new Card(12,2);
	arr[2] = new Card(2,2);
	arr[3] = new Card(0,2);
	arr[4] = new Card(3,2);
	arr[5] = new Card(6,0);
	arr[6] = new Card(1,2);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========straight flush===========");
	console.log(player.getComboInfo());
	//High card
	var arr=[];
	arr[0] = new Card(7,3);
	arr[1] = new Card(12,2);
	arr[2] = new Card(2,2);
	arr[3] = new Card(0,2);
	arr[4] = new Card(3,2);
	arr[5] = new Card(6,0);
	arr[6] = new Card(5,1);
	hand._board = arr.slice(0,5);
	player.hand = arr.slice(5);
	hand._checkCombination(player);
	console.log("===========high card===========");
	console.log(player.getComboInfo());
}

module.exports.checkComboTest = checkComboTest;