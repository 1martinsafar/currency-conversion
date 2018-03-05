import React from "react";
import PropTypes from "prop-types";


const Swap = props => (
  <button name="swap" className="button swap round" onClick={props.handleSwap}>swap</button>
)

Swap.propTypes = {
  handleSwap: PropTypes.func.isRequired
};

export default Swap;
