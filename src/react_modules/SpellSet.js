import $ from "jquery";
import { Card, CardTitle } from 'react-toolbox/lib/card';
import React from 'react';
import SpellManager from './SpellManager';
import SpellNode from './SpellNode.js'

export default class SpellSet extends React.Component 
{  
  constructor(props) 
  {  
    super(props);
    
    this.loadSpellsFromServer = this.loadSpellsFromServer.bind(this);
    this.setSpells = this.setSpells.bind(this);
    this.populateSpells = this.populateSpells.bind(this);
    
    this.state = {
      class:props.class,
      level:props.level,
      spells: []
    }
  }
  
  loadSpellsFromServer() 
  {
    var url = "http://dnd.dsierra.io/api/classes/" + this.props.class + "/spells/" + this.props.level;
    
    if(this.props.upto) 
    {
      url += "/upto";
    }
    
    $.ajax({
      url: url,
      dataType: 'json',
      success: this.setSpells,
      error: function(xhr, status, err) {
        console.error("Error getting spell list", status, err.toString());
      }.bind(this)
    });
  }
  
  setSpells(data) 
  {
    
    if(data && data.length > 0) 
    {  
      this.populateSpells(data);
    } 
    else if(this.props.class == 0) 
    {  
      var data = SpellManager.getSpells();
      
      if(data.length > 0) 
      {  
        this.populateSpells(data);
      } 
      else
      {  
        this.setState({spells: [<Card key="error"><CardTitle title="Saved spells go here"/></Card>]});
      }
    }
    else 
    {
      this.setState({spells: [<Card key="error"><CardTitle title="This class has no spells"/></Card>]});
    }
  }
  
  populateSpells(data) 
  {  
    var spells = data.map(function(spellId) {
      return (
        <SpellNode spell={spellId} key={spellId}/>
      );
    });
    this.setState({spells: spells});
  }
  
  componentWillReceiveProps(nextProps) 
  {
    this.setState({
      class: nextProps.class,
      level: nextProps.level
    }, this.loadSpellsFromServer);
  }
  
  componentDidMount() 
  {
    this.loadSpellsFromServer();
  }
  
  render() 
  {
    return (
      <div className="spellSet">
        {this.state.spells}
      </div>
    );
  }
}
