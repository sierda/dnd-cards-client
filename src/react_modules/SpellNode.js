import $ from "jquery";
import { Button, IconButton } from 'react-toolbox/lib/button';
import { Card, CardText, CardTitle, CardActions } from 'react-toolbox/lib/card';
import Markdown from 'react-remarkable';
import React from 'react';
import SpellManager from './SpellManager';

export default class SpellNode extends React.Component 
{
  constructor(props) 
  {  
    super(props);

    this.setData = this.setData.bind(this);
    this.actionString = this.actionString.bind(this);
    this.onButtonPress = this.onButtonPress.bind(this);
    
    var saved = SpellManager.hasSpell(props.spell);
    this.state = {
      spell: props.spell,
      spell_data: "",
      saved: saved
    }
  }

  loadSpellFromServer() 
  {  
    $.ajax({
      url: "http://dnd.dsierra.io/api/spells/" + this.state.spell,
      dataType: 'json',
      success: this.setData,
      error: function(xhr, status, err) {
        console.error("Error getting spell data", status, err.toString());
      }
    });
  }
  
  setData(data) 
  {      
    // move component details to tooltip
    if(data.components) 
    {  
      var paren = data.components.indexOf('(');
      if(paren > 0) 
      {  
        data.componentsDetail = data.components.substring(paren + 1, data.components.length - 1);
        data.components = data.components.substring(0, paren);
      }
    }
    
    this.setState({spell_data: data});
  }
  
  actionString() 
  {  
    return this.state.saved ? "Remove" : "Save";
  }
  
  onButtonPress(e)
  {
    // Only left click
    if(e.nativeEvent.which != 1)
      return;
    
    if(this.state.saved) 
    {  
       SpellManager.deleteSpell(this.state.spell);
    } 
    else 
    {  
      SpellManager.addSpell(this.state.spell);
    }

    this.setState({saved: !this.state.saved});
  }
  
  componentWillReceiveProps(nextProps) 
  {  
    this.setState({
      spell: nextProps.spell,
    }, this.loadSpellFromServer);
  }
  
  componentDidMount() 
  {  
    this.loadSpellFromServer();
  }
  
  render() 
  {  
    return (
      <Card raised style={{width:'425px', margin:'15px'}}>
        <CardTitle title={this.state.spell_data.name} subtitle={this.state.spell_data.type}/>
        <CardText className="cardFont"><div>
          Casting Time: <em>{this.state.spell_data.casting_time}</em><br/>
          Range: <em>{this.state.spell_data.range}</em><br/>
          Components: <em title={this.state.spell_data.componentsDetail}>{this.state.spell_data.components}</em><br/>
          Duration: <em>{this.state.spell_data.duration}</em><br/>
        </div></CardText>
        <CardText><div className="spellDesc cardFont" dangerouslySetInnerHTML={{__html:this.state.spell_data.primary_description}} /></CardText>
        <CardActions>
          <Button label={this.actionString()} onMouseUp={this.onButtonPress}/>
        </CardActions>
      </Card>
    );
  }
}
