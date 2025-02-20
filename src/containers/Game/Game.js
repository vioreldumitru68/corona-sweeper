import React, { Component } from 'react';
import Board from '../../components/Board/Board';
import Score from '../../components/Score/Score';
import Timer from '../../components/Timer/Timer';
import ResetControl from '../../components/ResetControl/ResetControl';

const BOARD_SIZE = {
    small:  {lines: 10, columns:10, mines: 15},
    medium: {lines: 20, columns:20, mines: 44},
    large:  {lines: 30, columns:20, mines: 66}
    },
    COVERED = 0, UNCOVERED = 1, EXPLODED = 2, FLAGGED = 3, REVEALED = 4, FALSE_MATCHED = 5;

class Game extends Component {

    state = {
        cells: [],
        boardSize: BOARD_SIZE.small,
        gameOver: false,
        gameCompleted: false,
        flaggedMines: 0,
        timerOn: false
    }

    gameReset() {
        //create & reset the board
        const newCells = [],
            lines = this.state.boardSize.lines,
            columns = this.state.boardSize.columns;

        const boardCellsCount = lines * columns;
        for (let i=1; i<=boardCellsCount; i++){
            const status = COVERED;
            newCells.push({status: status, mined: false, neighbors:0});
        }

        // fill in the board using the bombs random generator
        for (let i=1; i<=this.state.boardSize.mines; i++){
            let index = 0;
            do { 
                index = Math.floor(Math.random()*boardCellsCount);
            } while (newCells[index].mined)
            newCells[index].mined = true
        }

        // compute the neighbors
        newCells.forEach((currentCell, index) => {
            let bombs = 0;
            if(index-columns-1 >= 0 && (index-columns-1) % columns !== columns-1)
                {if(newCells[index-columns-1].mined) { bombs++ }};
            if(index-columns   >= 0) {if(newCells[index-columns].mined) { bombs++ }};
            if(index-columns+1 >= 0 && (index-columns+1) % columns !== 0)
                {if(newCells[index-columns+1].mined) { bombs++ }};
            if(index-1 >= 0 && (index-1) % columns !== columns-1)
                {if(newCells[index-1].mined) { bombs++ }};
            if(index+1 <= boardCellsCount-1 && (index+1) % columns !== 0)
                {if(newCells[index+1].mined) { bombs++ }};
            if(index+columns-1 <= boardCellsCount-1 && (index+columns-1) % columns !== columns-1)
                {if(newCells[index+columns-1].mined) { bombs++ }};
            if(index+columns   <= boardCellsCount-1) {if(newCells[index+columns].mined) { bombs++ }};
            if(index+columns+1 <= boardCellsCount-1 && (index+columns+1) % columns !== 0)
                {if(newCells[index+columns+1].mined) { bombs++ }};
            currentCell.neighbors = bombs;
        })
        this.setState({cells: newCells,
            gameOver: false,
            gameCompleted: false,
            flaggedMines: 0,
            timerOn: false});
    }

    componentDidMount () {
        // create the board storage
        this.gameReset()
    }

    // componentDidUpdate() {
    //     if(this.state.gameOver) console.log("You've got corona-19 infection and will be quarantined for the next 14 days!");
    //     if(this.state.gameCompleted) console.log('Game completed!');
    // }

    cellClickedHandler = (index) => {
//-----------
        function uncoverEmptyCell(newCells, index, columns) {
            
            //nothing to do if the cell is already un-covered
            if(newCells[index].status !== COVERED) return;

            //un-cover the cell
            newCells[index].status = UNCOVERED;
 
            //top-left
            if(index-columns-1 >= 0 && (index-columns-1) % columns !== columns-1 ) {
                if(newCells[index-columns-1].neighbors === 0) {
                    uncoverEmptyCell(newCells, index-columns-1, columns)
                } else if(!newCells[index-columns-1].mined) newCells[index-columns-1].status = UNCOVERED
            }
            //top-middle
            if(index-columns >= 0) {
                if(newCells[index-columns].neighbors === 0) {
                    uncoverEmptyCell(newCells, index-columns, columns)
                } else if(!newCells[index-columns].mined) newCells[index-columns].status = UNCOVERED
            }
            //top-right
            if(index-columns+1 >= 0 && (index-columns+1) % columns !== 0) {
                if(newCells[index-columns+1].neighbors === 0) {
                    uncoverEmptyCell(newCells, index-columns+1, columns)
                } else if(!newCells[index-columns+1].mined) newCells[index-columns+1].status = UNCOVERED
            }
            //left
             if(index-1 >= 0 && (index-1) % columns !== columns-1) {
                if(newCells[index-1].neighbors === 0) {
                    uncoverEmptyCell(newCells, index-1, columns)
                } else if(!newCells[index-1].mined) newCells[index-1].status = UNCOVERED
            } 
            //right
            if(index+1 <= newCells.length-1 && (index+1) % columns !== 0) {
                if(newCells[index+1].neighbors === 0) {
                    uncoverEmptyCell(newCells, index+1, columns)
                } else if(!newCells[index+1].mined) newCells[index+1].status = UNCOVERED
            }
            //bottom-left
             if(index+columns-1 <= newCells.length-1 && (index+columns-1) % columns !== columns-1) {
                if(newCells[index+columns-1].neighbors === 0) {
                    uncoverEmptyCell(newCells, index+columns-1, columns)
                } else if(!newCells[index+columns-1].mined) newCells[index+columns-1].status = UNCOVERED
            }
            //bottom-middle
            if(index+columns <= newCells.length-1) {
                if(newCells[index+columns].neighbors === 0) {
                    uncoverEmptyCell(newCells, index+columns, columns)
                } else if(!newCells[index+columns].mined) newCells[index+columns].status = UNCOVERED
            }
            //bottom-right
            if(index+columns+1 <= newCells.length-1 && (index+columns+1) % columns !== 0) {
                if(newCells[index+columns+1].neighbors === 0) {
                    uncoverEmptyCell(newCells, index+columns+1, columns)
                } else if(!newCells[index+columns+1].mined) newCells[index+columns+1].status = UNCOVERED
            } 
        }
//-----------
        function showGameOver(newCells, index){
            newCells[index].status = EXPLODED;
            const suspectedCells = newCells.filter(cell => 
                (cell.mined ^ cell.status === FLAGGED) && cell.status !== EXPLODED);
            suspectedCells.forEach(cell => 
                cell.status === FLAGGED ? cell.status = FALSE_MATCHED : cell.status = REVEALED)           
        }
//
        if(!this.state.gameCompleted && !this.state.gameOver) {
            const newCells = [...this.state.cells],
                columns = this.state.boardSize.columns;
    
            let gameOver = false;    
            //exit if cell is flagged
            if(newCells[index].status === FLAGGED) return; 
            if(newCells[index].mined) {
                //game failed
                gameOver = true;
                showGameOver(newCells, index);
            } else {
                //if empty then un-cover it along with all its empty close neighbors
                    if(newCells[index].neighbors === 0) {
                            uncoverEmptyCell(newCells, index, columns)
                    } else  newCells[index].status = UNCOVERED
            }
            this.setState({cells: newCells, gameOver: gameOver, timerOn: !gameOver});
        }      
    }

    cellRightClickedHandler = (event, index) => {

        event.preventDefault();
        if(!this.state.gameCompleted && !this.state.gameOver) {
    
            const newCells = [...this.state.cells]
               // cell = newCells[index]; 
            let cellStatus = newCells[index].status,
                flaggedMines = this.state.flaggedMines,
                gameCompleted = this.state.gameCompleted;

            //exit if right-click is not allowed for this cell
            if(cellStatus === UNCOVERED || cellStatus === EXPLODED) return;
            
            //toggle flagging the cell
            if(cellStatus === FLAGGED) {
                cellStatus = COVERED;
                flaggedMines--
            } else if(cellStatus === COVERED) {
                cellStatus = FLAGGED;
                flaggedMines++
                }

            //update the state
            newCells[index].status = cellStatus;

            //check if the game is completed
            gameCompleted = newCells.every(cell => cell.mined === (cell.status === FLAGGED));
            
            this.setState({ cells: newCells,
                            flaggedMines: flaggedMines,
                            gameCompleted: gameCompleted,
                            timerOn: !gameCompleted})
            }
        }

    resetControlClickedHandler = () => {
        this.gameReset()
    }

    render() {

        return (
            <div>
                <Board
                    cells={this.state.cells}
                    cellClicked={this.cellClickedHandler}
                    cellRightClicked={this.cellRightClickedHandler}
                    gameOver={this.state.gameOver}
                    gameCompleted={this.state.gameCompleted}/>
                <Score minesCounter={this.state.boardSize.mines - this.state.flaggedMines} />
                <ResetControl clicked={this.resetControlClickedHandler} />
                <Timer timerOn={this.state.timerOn} />
            </div> 
        )
    }
};

export default Game;
