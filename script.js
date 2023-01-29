// DOM Elements
const domElements = (function(){
    const field = document.getElementsByTagName("field");
    const result = document.querySelector(".result");
    const restartBtn = document.getElementById("restartBtn");
    const undoBtn = document.getElementById("undoBtn");
    return {
        field,
        result,
        restartBtn,
        undoBtn
    }
})();


// making players
const playerFactory = (name, sign, status) => ({name, sign, status,});

const player1 = playerFactory("Sally", "x", 1);
const player2 = playerFactory("Mater", "o", 0);

function changePlayersStatus(){
    player1.status = player1.status === 1 ? 0 : 1;
    player2.status = player2.status === 1 ? 0 : 1;
}

const gameBoard = (() => {
    // making the board
    const board = [];
    for(let i = 0; i < 9; i+=1)
        board[i] = 0;

    const playersPicks = [];
    let lastPick = -1;

    // checking the score
    const checkScore = () => {
        let winner = "";
        // checking rows
        for(let i = 0; i < 9; i+=3){
            if(board[i] === board[i+1] && board[i+1] === board[i+2] && board[i] !== 0){
                winner = player1.sign === board[i] ? player1.name : player2.name;
                domElements.result.textContent = `${winner  } won! Congratulations!`;
            }
        }
        // checking columns
        for(let i = 0; i < 3; i+=1){
            if(board[i] === board[i+3] && board[i+3] === board[i+6] && board[i] !== 0){
                winner = player1.sign === board[i] ? player1.name : player2.name;
                domElements.result.textContent = `${winner  } won! Congratulations!`;
            }
        }
        // checking diagonals
        if((board[0] === board[4] && board[4] === board[8] && board[0] !== 0) ||
           (board[2] === board[4] && board[4] === board[6] && board[2] !== 0)){
            winner = player1.sign === board[4] ? player1.name : player2.name;
            domElements.textContent = `${winner  } won! Congratulations!`;
        }
        // checking if it is a draw
        if(winner === ""){
            let i = 0;
            while(board[i] !== 0 && i < 9)
                i+=1;
            if(i === 9)
            domElements.textContent = "Draw!";
        }
    }
    // putting players' choices in the "board:
    const setFieldValue = () => function funSetFieldValue(e){
        e.target.setAttribute("listener", "false");
        playersPicks.push(e.target.id - 1);
        if(player1.status === 1){
            board[e.target.id-1] = player1.sign;
        }
        else if(player2.status === 1){
            board[e.target.id-1] = player2.sign;
        }
    };

    // clearing the board
    const clearBoard = () => function funClearBoard(){
        for(let i = 0; i < 9; i+=1)
            board[i] = 0;
        player1.status = 1;
        player2.status = 0;
    };

    // undoing
    const undo = () => function funUndo(){
        if(playersPicks.length > 0){
            const undoField = playersPicks.pop();
            board[undoField] = 0;
            changePlayersStatus();
            lastPick = undoField;
        }
    };

    // last pick for display controller
    const getLastPick = () => lastPick;

    return {
        setFieldValue,
        checkScore,
        clearBoard,
        undo,
        getLastPick,
    };
})();

// controlling grid display
const displayController = (() => {    
    // show user input
    const changeFieldDisplay = () => function funChangeFieldDisplay(e){
        if(player1.status === 1){
            e.target.className = "firstSign";
            changePlayersStatus();
            gameBoard.checkScore();       
        }
        else if(player2.status === 1){
            e.target.className = "secondSign";
            changePlayersStatus();
            gameBoard.checkScore();
        }
    };

    // clear display
    const clearDisplay = () => function funClearDisplay(){
        for (let i = 0; i < domElements.field.length; i+=1) {
            domElements.field[i].className = "notChosen";
            if(domElements.field[i].getAttribute("listener") !== "true"){
                domElements.field[i].addEventListener("click", gameBoard.setFieldValue(i), {once: true });
                domElements.field[i].addEventListener("click", displayController.changeFieldDisplay(i), {once: true });
                domElements.field[i].setAttribute("listener", "true");
            }
        }
        const result = document.querySelector(".result");
        result.textContent = "";
    };

    // undoing display
    const undoDisplay = () => function funUndoDisplay(){
        const fieldNumber = gameBoard.getLastPick();
        domElements.field[fieldNumber].className = "notChosen";
        domElements.field[fieldNumber].addEventListener("click", gameBoard.setFieldValue(fieldNumber), {once: true });
        domElements.field[fieldNumber].addEventListener("click", displayController.changeFieldDisplay(fieldNumber), {once: true });
        domElements.field[fieldNumber].setAttribute("listener", "true");
        const result = document.querySelector(".result");
        result.textContent = "";        
    }

    return {
        changeFieldDisplay,
        clearDisplay,
        undoDisplay
    };
})();

// getting input from players
function listen(){
    for (let i = 0; i < domElements.field.length; i+=1) {
        domElements.field[i].setAttribute("listener", "true");
        domElements.field[i].addEventListener("click", gameBoard.setFieldValue(i), {once: true });
        domElements.field[i].addEventListener("click", displayController.changeFieldDisplay(i), {once: true });
    }
    
    
    domElements.restartBtn.addEventListener("click", gameBoard.clearBoard());
    domElements.restartBtn.addEventListener("click", displayController.clearDisplay(domElements.field));

    
    domElements.undoBtn.addEventListener("click", gameBoard.undo());
    domElements.undoBtn.addEventListener("click", displayController.undoDisplay());

}

listen();