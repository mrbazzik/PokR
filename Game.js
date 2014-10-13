function Game(){
  this._seats = {};
  this._bank = 0;

  this._actions = []; //Actions
}

function Action(player, type, sum, stage){
  this._type = type;
  this._player = player;
  this._sumForBank = sum;
  this._stage = stage;

}

Game.prototype.STAGES = ['preflop', 'flop', 'turn', 'river'];
Game.prototype.ACTION_TYPES = ['smallBlind', 'bigBlind', 'fold', 'check', 'call', 'raise'];
