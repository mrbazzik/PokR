function Action(player, type, sum, stage){
  this.type = type;
  this.player = player;
  this.sumForBank = sum;
  this.stage = stage;


}

Action.prototype.toString = function(){
  var str = "Player "+this.player.getId()+" makes "+this.type;
  if(this.type != 'CHECK') str+= " for "+this.sumForBank;
  return str;
}
module.exports = Action;