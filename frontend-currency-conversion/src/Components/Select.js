import React from "react";
import PropTypes from "prop-types";


const Select = props => (
  <select className="select round" value={props.value} onChange={props.handleChange}>
    {props.options}
  </select>
)

Select.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default Select;
