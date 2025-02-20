import React from 'react';
import classes from './ResetControl.module.css'

const resetControl = (props) => (
    <button className={classes.ResetControl} onClick={props.clicked}>Reset</button>
)

export default resetControl