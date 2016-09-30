import $ from "jquery";
import { Checkbox, Dropdown, Snackbar } from 'react-toolbox';
import React from 'react';
import SpellSet from './SpellSet.js'

export default class ClassChooser extends React.Component 
{  
  constructor(props) 
  {
    super(props);
    
    this.handleLevelChange = this.handleLevelChange.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
    this.handleUptoChange = this.handleUptoChange.bind(this);
    
    this.loadClassesFromServer = this.loadClassesFromServer.bind(this);
    this.loadLevelsFromServer = this.loadLevelsFromServer.bind(this);
    
    this.getNewSpellSet = this.getNewSpellSet.bind(this);
    this.customDropItem = this.customDropItem.bind(this);
    
    this.showSnackBar = this.showSnackBar.bind(this);
    this.hideSnackBar = this.hideSnackBar.bind(this);
    
    this.setClasses = this.setClasses.bind(this);
    this.setLevels = this.setLevels.bind(this);
    
    this.state = {
      level:-1,
      levels:[],
      clazz:-1,
      classes:[],
      spellSet:[],
      tempClass:-1,
      upto:false,
      error:false
    }
  }
  
  loadClassesFromServer() 
  {
    $.ajax({
      url: "http://dsierra.io:3000/classes/all",
      dataType: 'json',
      success: this.setClasses,
      error: this.showSnackBar
    });    
  }
  
  loadLevelsFromServer() 
  {
    $.ajax({
      url: "http://dsierra.io:3000/classes/" + this.state.tempClass + "/spells",
      dataType: 'json',
      success: this.setLevels,
      error: this.showSnackBar
    });    
  }
  
  setClasses(data) 
  {
    var classes = [];
        
    for(var clazz in data)
    {
      var name = data[clazz].name;
      classes.push({
        value:clazz,
        label:name
      });
    }
    
    var fClass = Object.keys(data)[0];
    
    classes.unshift({value: 0, label:"Saved"});
    
    this.setState({
      classes:classes,
      tempClass:fClass
    }, this.loadLevelsFromServer);
  }
  
  setLevels(data) 
  {
    var level, levels;
        
    if(data && data.length)
    {
      level = data[0];
      levels = data.map(function(level) {
        return {value: level, label: level ? "Level " + level : "Cantrips (Level 0)"};
      });
    }
    else
    {
      level = 0;
      levels = [{value: 0, label: "Cantrips (Level 0)"}];
    }

    this.setState({
      clazz:this.state.tempClass,
      level:level,
      levels:levels,
      spellSet:[this.getNewSpellSet(level)]
    });
  }
  
  showSnackBar() 
  {
    this.setState({error:true});
  }
  
  hideSnackBar() 
  {
    this.setState({error:false});
  }
  
  handleClassChange(value) 
  {
    this.setState({tempClass: value}, this.loadLevelsFromServer);
  }
  
  handleLevelChange(value) 
  {
    this.setState({level: value, spellSet:this.getNewSpellSet(value)});
  }
  
  handleUptoChange(field, value) 
  {
    this.setState({upto: !this.state.upto}, function() {
      this.setState({spellSet:this.getNewSpellSet(this.state.level)});
    }.bind(this));
  }
  
  componentDidMount() 
  {
    this.loadClassesFromServer();
  } 
  
  getNewSpellSet(level) 
  {
    return (<SpellSet key="a" class={this.state.tempClass} level={level} upto={this.state.upto}/>);
  }
  
  customDropItem(item) 
  {
    return (
        <div className="dropdownItem">{item.label}</div>
    );
  }
  
  render() 
  {
    return (<div>
      <div className="dropdowns">
        <Dropdown 
          auto 
          template={this.customDropItem}
          className="dropdownClass"
          source={this.state.classes} 
          onChange={this.handleClassChange} 
          value={this.state.clazz}/>
        <Dropdown 
          auto 
          template={this.customDropItem}
          className="dropdownLevel"
          source={this.state.levels} 
          onChange={this.handleLevelChange} 
          value={this.state.level}/>
        <Checkbox
          className="checkboxUpto"
          checked={this.state.upto}
          label="Up to"
          onChange={this.handleUptoChange}
        />
      </div>
      <div>{this.state.spellSet}</div>
      <Snackbar
        active={this.state.error}
        label='Error contacting server'
        ref='snackbar'
        timeout={2000}
        onTimeout={this.hideSnackBar}
        type='warning'
      />
    </div>);
  }
}
