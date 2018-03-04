import React from "react";


const Select = (props) => (
  <select className="select" value={props.value} onChange={props.handleChange}>
    {props.options}
  </select>
)

export default Select;
