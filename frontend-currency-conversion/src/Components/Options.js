import React from "react";
import PropTypes from "prop-types";

// Components
import Select from "./Select";

const Options = props => (
    <div className="currency-container">
      <div className="currency" id={props.id}>{props.type}:</div>
      <div className="options">
        <Select options={props.options} value={props.value} handleChange={props.handleChange} />
      </div>
    </div>
)

Options.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default Options;
