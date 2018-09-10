/**
 * @author Prajyot Walali
 * @date 10th September, 2018
 * GITHUB :: github.com/prajyot-w
 */

var canvas = document.getElementById("game-field");
var context = canvas.getContext("2d");
var scoreElement = document.getElementById("score");

var globalGb = undefined;

var requestAnimationFrame = window.requestAnimationFrame || 
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame || 
                            window.msRequestAnimationFrame;

/**
 * Higher the gameSpeed, slower the game shall run.
 */
var gameSpeed = 150;

var configureBoard = function(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.context.lineWidth = 1;
    this.context.strokeStyle = "black";
}


class GameField {
    constructor(fieldContext, scoreContext, fieldDimension, fieldCellDimension) {
        this.fieldContext = fieldContext;
        this.scoreContext = scoreContext;
        this.score = 0;
        this.scoreContext.innerHTML = this.score;

        this.fieldDimension = fieldDimension;
        this.noOfCell = (fieldDimension/fieldCellDimension);
        this.box = fieldCellDimension;

        this.allDirections = ['RIGHT', 'LEFT', 'UP', 'DOWN'];

        this.food = undefined;
        this.snakeElement = undefined;
        this.snakeDirection = undefined;

        this.isGameOver = false;
    }

    updateScore() {
        this.score+=1;
        this.scoreContext.innerHTML = this.score;
    }

    strokeField(x, y, color) {
        if(color == undefined) {
            color = "black";
        }
        this.fieldContext.strokeStyle = color;
        this.fieldContext.strokeRect((x * this.box), (y * this.box), this.box, this.box);
    }

    fillField(x, y, color) {
        if(color == undefined) {
            color = "#474747";
        }
        this.fieldContext.fillStyle = color;
        this.fieldContext.fillRect((x * this.box), (y * this.box), this.box, this.box);
    }

    drawBoard() {
        for(var y = 0; y < this.noOfCell; y++ ) {
            for(var x = 0; x < this.noOfCell; x++ ) {
                this.fillField(x,y);
            }
        }


        if(this.food != undefined) {
            this.fillField(this.food.x, this.food.y, "red");
        }

        if(this.snakeElement != undefined) {
            this.drawSnake();
        }
    }

    drawSnake() {
        for(var i=0; i < this.snakeElement.length; i++) {
            this.fillField(this.snakeElement[i].x, this.snakeElement[i].y, "white");
        }
    }

    generateFood() {
        this.food = {
            x: Math.floor(Math.random()*this.noOfCell),
            y: Math.floor(Math.random()*this.noOfCell)
        }
    }

    generateSnake() {
        this.snakeElement = [];
        this.snakeElement.push(
            {
                x: Math.floor(Math.random()*this.noOfCell),
                y: Math.floor(Math.random()*this.noOfCell)
            }
        );

        this.snakeDirection = this.allDirections[Math.floor(Math.random()*this.allDirections.length)];

        switch(this.snakeDirection) {
            case 'RIGHT':
                this.snakeElement.push({
                    x: this.snakeElement[0].x-1,
                    y: this.snakeElement[0].y
                });
                break;
            case 'LEFT':
                this.snakeElement.push({
                    x: this.snakeElement[0].x+1,
                    y: this.snakeElement[0].y
                });
                break;
            case 'UP':
                this.snakeElement.push({
                    x: this.snakeElement[0].x,
                    y: this.snakeElement[0].y+1
                });
                break;
            case 'DOWN':
                this.snakeElement.push({
                    x: this.snakeElement[0].x,
                    y: this.snakeElement[0].y-1
                });
                break;
        }
    }


    wallCollision(newHead) {
        var isCollision = false;
        if(newHead.x < 0 || newHead.x > (this.noOfCell-1) || newHead.y < 0 || newHead.y > (this.noOfCell-1)) 
            isCollision = true;
        return isCollision;
    }

    selfCollision(newHead) {
        var isCollision = false;
        for(var i = 0; i < this.snakeElement.length; i++) {
            if(newHead.x == this.snakeElement[i].x && newHead.y == this.snakeElement[i].y){
                isCollision = true;
                break;
            }
        }

        return isCollision;
    }

    eatFood(newHead) {
        if(this.food.x == newHead.x && this.food.y == newHead.y) {
            return true;
        }
        
        return false;
    }

    proceed() {
        if(!this.isGameOver){
            switch(this.snakeDirection) {
                case 'RIGHT':
                    var newHead = {
                        x:this.snakeElement[0].x+1,
                        y:this.snakeElement[0].y
                    };
                    break;
                case 'LEFT':
                    var newHead = {
                        x:this.snakeElement[0].x-1,
                        y:this.snakeElement[0].y
                    };
                    break;
                case 'UP':
                    var newHead = {
                        x:this.snakeElement[0].x,
                        y:this.snakeElement[0].y-1
                    };
                    break;
                case 'DOWN':
                    var newHead = {
                        x:this.snakeElement[0].x,
                        y:this.snakeElement[0].y+1
                    };
                    break;
            }

            if(!this.wallCollision(newHead) && !this.selfCollision(newHead)){
                if(!this.eatFood(newHead)) {
                    this.snakeElement.pop();
                } else {
                    this.updateScore();
                    this.generateFood();
                }
                this.snakeElement.unshift(newHead);
                this.drawBoard();
            } else {
                this.isGameOver = true;
            }
        }
    }

    changeDirection(event) {
        if(!this.isGameOver) {
            switch(event.keyCode) {
                case 37:
                    if(this.snakeDirection != 'RIGHT'){
                        this.snakeDirection = 'LEFT';
                    }
                    break;
                case 38:
                    if(this.snakeDirection != 'DOWN') {
                        this.snakeDirection = 'UP';
                    }
                    break;
                case 39:
                    if(this.snakeDirection != 'LEFT') {
                        this.snakeDirection = 'RIGHT';
                    }
                    break;
                case 40:
                    if(this.snakeDirection != 'UP') {
                        this.snakeDirection = 'DOWN';
                    }
                    break;
            }
        }
    }
}

var gameLoop = function() {
    if(!this.globalGb.isGameOver) {
        this.globalGb.proceed();
        setTimeout(function(){
            this.requestAnimationFrame(this.gameLoop);
        }, this.gameSpeed);
    } else {
        alert("Game Over! ='( ");
    }
};

var init = function() {
    var boardDim = 400;
    var cellDim = 10;

    this.configureBoard(boardDim,boardDim);
    var gb = new GameField(this.context, this.scoreElement, boardDim, cellDim);
    gb.generateFood();
    gb.generateSnake();
    gb.drawBoard();

    this.globalGb = gb;

    document.addEventListener('keydown', function(e) {
        gb.changeDirection(e);
    });

    this.gameLoop();

};

init();