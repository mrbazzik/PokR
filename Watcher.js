function Watcher(type, player){
  var playerN = player || null;
  this.player = playerN;
  this.type = type;

}

Watcher.prototype.TYPES = ['STRANGER', 'OUT', 'WAITING'];

module.exports = Watcher;
