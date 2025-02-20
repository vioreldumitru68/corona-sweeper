import React from 'react';
import classes from './Board.module.css';
import Cell from './Cell/Cell';

const board = (props) => {
    let boardClass = classes.Board;
    if(props.gameOver) boardClass = classes.GameOver;
    if(props.gameCompleted) boardClass = classes.GameCompleted;

    return (
        <div className={boardClass}>
        {props.cells.map((el, index) => (
            <Cell key={index}
                status={el.status}
                mined={el.mined}
                neighbors={el.neighbors}
                clicked={() => props.cellClicked(index)}
                rightClicked={(event) => props.cellRightClicked(event, index)} />
        ))}
        </div>
    )
};

export default board;