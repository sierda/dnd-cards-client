import Cookies from 'js-cookie';

export default class SpellManager 
{  
  static getSpells() 
  {  
    var spells = Cookies.getJSON('spells');
    
    if(spells == undefined) 
    {
      spells = new Array();
      this.saveSpells(spells);
    }
    
    return spells;
  }

  static saveSpells(spells) 
  {  
    Cookies.set('spells', spells, {expires: 365});
  }
  
  static addSpell(spell) 
  {  
    var spells = this.getSpells();
    var index = spells.indexOf(spell);
    
    if (index == -1) 
    {
      spells.push(spell);
    }
    
    this.saveSpells(spells);
  }
  
  static hasSpell(spell) 
  {  
    var spells = this.getSpells();
    var index = spells.indexOf(spell);
    
    return (index > -1)
  }
  
  static deleteSpell(spell) 
  {  
    var spells = this.getSpells();
    
    do 
    {
      var index = spells.indexOf(spell);
      if (index > -1) {
        spells.splice(index, 1);
      }
    } while(index > -1);
    
    this.saveSpells(spells);
  }
}
