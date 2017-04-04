import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const style = {
  width: "33%"
}

const DateOfBirth = (props) => {

  // Generate drop down values

  let days = [];
  for(let i = 1; i < 32; i++) {
    days.push(i);
  }

  var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

  let thisYear = new Date().getFullYear();
  let years = [];
  for(let i = 13; i < 113; i++) {
    years.push(thisYear - i);
  }

  let selectedDate = new Date(props.value);

  return (
    <div style={{position: "relative", marginTop: "40px"}}>

      <label style={{position:"absolute",lineHeight:"22px",top:"10px",transition:"all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",zIndex:"1",transform:"scale(0.75) translate(0px, -28px)",transformOrigin:"left top 0px",pointerEvents:"none",userSelect:"none",color:"rgba(0, 0, 0, 0.298039)"}}>Date of Birth</label>

      <SelectField
        value={props.value === null ? null : selectedDate.getDate()}
        onChange={(e, index, value) => {
          selectedDate.setDate(value);
          props.onChange(selectedDate.toISOString());
          }}
        maxHeight={200}
        style={style}
        errorText={props.errorText}
      >
        {days.map((value, index) => {
          return <MenuItem value={value} primaryText={value} key={index} />
        })}
      </SelectField>

      <SelectField
        value={props.value === null ? null : selectedDate.getMonth()}
        style={style}
        maxHeight={200}
        errorText={props.errorText}
          onChange={(e, index, value) => {
          selectedDate.setMonth(value);
          props.onChange(selectedDate.toISOString());
        }}>
        {months.map((value, index) => {
          return <MenuItem value={index + 1} primaryText={value} key={index} label={value.substring(0, 3)} />
        })}
      </SelectField>

      <SelectField value={props.value === null ? null : selectedDate.getFullYear()}
      maxHeight={200}
      style={style}
      errorText={props.errorText}
      onChange={(e, index, value) => {
        selectedDate.setFullYear(value);
        props.onChange(selectedDate.toISOString());
      }}>
        {years.map((value, index) => {
          return <MenuItem value={value} primaryText={value} key={index} />
        })}
      </SelectField>

    </div>
  )
}

export default DateOfBirth;
