import React from "react";
import PropTypes from "prop-types";

// Components

const Amount = props => (
  <div className="amount-container">
    <h2 className="amount">amount:</h2>
    <input type="text"
           name="amount"
           className="input round"
           onChange={props.updateAmount}
           required />
  </div>
)

Amount.propTypes = {
  updateAmount: PropTypes.func.isRequired
};

export default Amount;
