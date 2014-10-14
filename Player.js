function Player(stack, id, real){
  this._Id = real ? id : "computer"+id;
  //this._user = {};
  this._stack = stack;
  this.hand = [];
  this.seat = '';
  this._currentChoice = {};
}
