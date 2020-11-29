const lifeworld = {
    init(numCols, numRows) {
        this.numCols = numCols;
        this.numRows = numRows;
        this.world = this.buildArray();
        this.worldBuffer = this.buildArray();
        this.randomSetup();
    },

    buildArray() {
        let outerArray = [];
        for (let row = 0; row < this.numRows; row++) {
            let innerArray = [];
            for (let col = 0; col < this.numCols; col++) {
                innerArray.push(0);
            }
            outerArray.push(innerArray);
        }
        return outerArray;
    },

    randomSetup() {
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                this.world[row][col] = 0;
                if (Math.random() < .1) {
                    this.world[row][col] = 1;
                }
            }
        }
    },

    getLivingNeighbors(row, col) {
        if (row < 0 || col < 0 || row > numRows - 1 || col > numRows - 1) {
            return 0;
        }

        let count = 0;
        for (let rowOffset = -1; rowOffset < 2; rowOffset++) {
            for (let colOffset = -1; colOffset < 2; colOffset++) {
                let chkrow = row + rowOffset;
                let chkcol = col + colOffset;
                if (chkrow < 0 || chkcol < 0 || chkrow > numRows - 1 || chkcol > numRows - 1) {
                    continue;
                }
                if (rowOffset == 0 && colOffset == 0) {
                    continue;
                }
                count += this.world[chkrow][chkcol];
            }
        }
        return count;
    },

    step() {
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                let neighbors = this.getLivingNeighbors(row, col);
                if (this.world[row][col] == 1) {
                    if (neighbors < 2 || neighbors > 3) {
                        this.worldBuffer[row][col] = 0;
                    } else {
                        this.worldBuffer[row][col] = 1;
                    }
                } else {
                    if (neighbors == 3) {
                        this.worldBuffer[row][col] = 1;
                    } else {
                        this.worldBuffer[row][col] = 0;
                    }
                }
            }
        }
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                this.world[i][j] = this.worldBuffer[i][j];
            }
        }
    }
}