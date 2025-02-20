import React from 'react';
import classes from './Score.module.css'

const score = (props) => (

    <div className={classes.Score}>{props.minesCounter}</div>

)

export default score;