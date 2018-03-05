import React from "react";
import PropTypes from "prop-types";


const Stats = props => (
  <div className="stats-container">
    <h2 className="stats">{props.title}:</h2>
    <span className="data">{props.data}</span>
  </div>
)

Stats.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
};

export default Stats;
