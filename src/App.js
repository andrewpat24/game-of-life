import React, { Component, useRef } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    const numRows = 50;
    const numColumns = 50;

    this.state = {
      numRows,
      numColumns,
      grid: this.generateEmptyGrid(numRows, numColumns),
      running: false
    };
  }

  generateEmptyGrid(numRows, numColumns) {
    const rows = [];
    for (let ii = 0; ii < numRows; ii++) {
      rows.push(Array.from(Array(numColumns), () => 0));
    }
    return rows;
  }

  flipCellGridValue(row, col) {
    const newGrid = this.state.grid;
    newGrid[row][col] = newGrid[row][col] === 0 ? 1 : 0;
    this.setState({
      grid: newGrid
    });
  }

  generateGridMarkup(grid) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${this.state.numColumns}, 20px`,
          padding: '2%'
        }}
      >
        {grid.map((rows, ii) => {
          return rows.map((col, jj) => {
            return (
              <div
                key={`${ii}-${jj}`}
                onClick={() => {
                  if (!this.state.running) this.flipCellGridValue(ii, jj);
                }}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[ii][jj] ? 'black' : undefined,
                  border: '1px solid grey'
                }}
              ></div>
            );
          });
        })}
      </div>
    );
  }

  setRunningValue() {
    this.setState({
      running: this.state.running ? false : true
    });
  }

  surroundingCells = [
    [0, -1],
    [0, 1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1]
  ];

  computeNeighbors(row, col) {
    const grid = this.state.grid;

    if (grid[(row, col)] === 1) debugger;
    let neighbors = 0;
    for (let ii = 0; ii < this.surroundingCells.length; ii++) {
      let neighborVal = 0;

      // if current cell is on an edge a neighboring value may be undefined.
      if (
        row + this.surroundingCells[ii][0] >= 0 &&
        row + this.surroundingCells[ii][0] < this.state.numRows &&
        col + this.surroundingCells[ii][1] >= 0 &&
        col + this.surroundingCells[ii][1] < this.state.numColumns
      )
        neighborVal =
          grid[row + this.surroundingCells[ii][0]][
            col + this.surroundingCells[ii][1]
          ];

      neighbors += neighborVal;
    }

    return neighbors;
  }

  // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
  // Any live cell with two or three live neighbours lives on to the next generation.
  // Any live cell with more than three live neighbours dies, as if by overpopulation.
  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  // These rules, which compare the behavior of the automaton to real life, can be condensed into the following:

  // Any live cell with two or three neighbors survives.
  // Any dead cell with three live neighbors becomes a live cell.
  // All other live cells die in the next generation. Similarly, all other dead cells stay dead.

  runSimulation() {
    const _this = this;

    if (!_this.state.running) {
      console.log('_PROCESS ENDED_');
      return;
    }

    console.log(_this.state.running);

    for (let row = 0; row < _this.state.numRows; row++) {
      for (let col = 0; col < _this.state.numColumns; col++) {
        let neighbors = this.computeNeighbors(row, col);
        const isAlive = this.state.grid[row][col] === 1 ? true : false;
        if (isAlive && (neighbors < 2 || neighbors > 3)) {
          this.flipCellGridValue(row, col);
        } else if (!isAlive && neighbors === 3) {
          this.flipCellGridValue(row, col);
        }
      }
    }

    setTimeout(() => {
      this.runSimulation(this);
    }, 1000);
  }

  render() {
    return (
      <div className="App">
        <button
          onClick={async () => {
            this.setState(
              {
                running: !this.state.running
              },
              () => {
                console.log(this.state.running);
                this.runSimulation();
              }
            );
          }}
        >
          {this.state.running ? 'Stop' : 'Start'}
        </button>
        {this.generateGridMarkup(this.state.grid)}
      </div>
    );
  }
}

export default App;
