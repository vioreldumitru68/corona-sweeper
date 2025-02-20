import React from 'react';
import classes from './Cell.module.css';

const cell = (props) => {
    let cellStatusClass = classes.Covered;
    switch(props.status) {
        case 0:
            cellStatusClass = classes.Covered;
            break;
        case 1:
            cellStatusClass = classes.Uncovered;
            break;
        case 2:
            cellStatusClass = classes.Exploded;
            break;
        case 3:
            cellStatusClass = classes.Flagged;
            break;
        case 4:
            cellStatusClass = classes.Revealed;
            break;    
        case 5:
            cellStatusClass = classes.False_Matched;
            break;    
        default:
            cellStatusClass = classes.Covered;
    }
      
    return (
        <div className={[classes.Cell, cellStatusClass].join(' ')}
            onClick={props.clicked}
            onContextMenu={props.rightClicked}>
            {props.status === 1  && props.neighbors > 0 ? props.neighbors : '.'}
        </div>
    )
}

export default cell;