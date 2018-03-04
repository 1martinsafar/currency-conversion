import React from "react";


const Select = (props) => (
  <select className="select round" value={props.value} onChange={props.handleChange}>
    {props.options}
  </select>
)

export default Select;
