import React from "react";
import PropTypes from "prop-types";

// Components

const Result = props => (
  <div className="result-container">
    <button name="convert" className="button convert round" onClick={props.convert}>Convert</button>
    <span className="result">
      Result: {props.showResult ? <span>{props.result}</span> : null} {props.showResult ? props.currency : null}
    </span>
  </div>
)

Result.propTypes = {
  convert: PropTypes.func.isRequired,
  showResult: PropTypes.bool.isRequired,
  result: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired
};

export default Result;
