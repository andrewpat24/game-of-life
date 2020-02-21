import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    const numRows = 100;
    const numColumns = 100;

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

  async flipCellGridValue(row, col) {
    const newGrid = this.state.grid;
    newGrid[row][col] = newGrid[row][col] === 0 ? 1 : 0;
    return await this.setState({
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
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
  ];

  computeNeighbors(row, col) {
    let neighbors = 0;

    for (let ii = 0; ii < this.surroundingCells.length; ii++) {
      let neighborVal = 0;
      const checkRow = row + this.surroundingCells[ii][0];
      const checkCol = col + this.surroundingCells[ii][1];

      // if current cell is on an edge a neighboring value may be undefined.
      if (
        checkRow >= 0 &&
        checkRow < this.state.numRows &&
        checkCol >= 0 &&
        checkCol < this.state.numColumns
      )
        neighborVal = this.state.grid[checkRow][checkCol];

      neighbors += neighborVal;
    }

    return neighbors;
  }

  runSimulation() {
    const _this = this;

    if (!_this.state.running) {
      console.log('_PROCESS ENDED_');
      return;
    }
    for (let row = 0; row < _this.state.numRows; row++) {
      for (let col = 0; col < _this.state.numColumns; col++) {
        let neighbors = this.computeNeighbors(row, col);
        const isAlive = this.state.grid[row][col] === 1 ? true : false;

        if (isAlive && (neighbors < 2 || neighbors > 3)) {
          this.flipCellGridValue(row, col).then(() => {
            setTimeout(() => {
              this.runSimulation(this);
            }, 500);
          });
        } else if (!isAlive && neighbors === 3) {
          this.flipCellGridValue(row, col).then(() => {
            setTimeout(() => {
              this.runSimulation(this);
            }, 500);
          });
        }
      }
    }
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
