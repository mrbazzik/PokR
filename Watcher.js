function Watcher(type, player){
  var playerN = player || null;
  this._player = playerN;
  this._type = type;

}

Watcher.prototype.TYPES = ['STRANGER', 'OUT', 'WAITING'];

module.exports = Watcher;
