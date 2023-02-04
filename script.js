// DOM Elements
const domElements = (function elems(){
    const field = document.getElementsByTagName("field");
    const result = document.querySelector(".result");
    const restartBtn = document.getElementById("restartBtn");
    const undoBtn = document.getElementById("undoBtn");
    const restartModalBtn = document.getElementById("restartModalBtn");
    const endModal = document.getElementById("endModal");
    const gameSettingsModal = document.getElementById("gameSettingsModal");
    const playerSubmitModalBtn = document.getElementById("playerSubmitBtn");
    const computerSubmitModalBtn = document.getElementById("computerSubmitBtn");
    const playerTabBtn = document.getElementById("playerFormat");
    const computerTabBtn = document.getElementById("computerFormat");
    const playerTab = document.getElementById("player");
    const computerTab = document.getElementById("computer");
    const gameForm = document.getElementById("gameForm");
    return {
        field,
        result,
        restartBtn,
        undoBtn,
        restartModalBtn,
        endModal,
        gameSettingsModal,
        playerSubmitModalBtn,
        computerSubmitModalBtn,
        playerTabBtn,
        computerTabBtn,
        playerTab,
        computerTab,
        gameForm
    }
})();

// makes players
const playerFactory = (name, sign, status) => ({name, sign, status,});

const player1 = playerFactory("X", "x", 1);
const player2 = playerFactory("O", "o", 0);

// changes players' status
function changePlayersStatus(){
    player1.status = player1.status === 1 ? 0 : 1;
    player2.status = player2.status === 1 ? 0 : 1;
}

const gameBoard = (() => {
    // makes the board
    const board = [];
    for(let i = 0; i < 9; i+=1)
        board[i] = 0;

    const playersMoves = [];
    let lastPlayerMove = -1;
    let lastComputerMove = -1;

    // checks the score
    const checkScore = (gameboard) => {
        // checks rows
        for(let i = 0; i < 9; i+=3)
            if(gameboard[i] === gameboard[i+1] && gameboard[i+1] === gameboard[i+2] && gameboard[i] !== 0)
                return player1.sign === gameboard[i] ? 1 : -1;

        // checks columns
        for(let i = 0; i < 3; i+=1)
            if(gameboard[i] === gameboard[i+3] && gameboard[i+3] === gameboard[i+6] && gameboard[i] !== 0)
                return player1.sign === gameboard[i] ? 1 : -1; 

        // checks diagonals
        if((gameboard[0] === gameboard[4] && gameboard[4] === gameboard[8] && gameboard[0] !== 0) ||
           (gameboard[2] === gameboard[4] && gameboard[4] === gameboard[6] && gameboard[2] !== 0))
            return player1.sign === gameboard[4] ? 1 : -1;
        
        // checks if it is a draw
        if(domElements.result.textContent === ""){
            let i = 0;
            while(gameboard[i] !== 0 && i < 9)
                i+=1;

            if(i === 9)
                return 0;   
        }
        return 2;
    }

    // prints ending message
    const printScore = () =>{
        const result = gameBoard.checkScore(board);
        if(result !== 2){
            domElements.endModal.style.display = "block";
            if(result === 1)
                domElements.result.textContent = `${player1.name  } won! Congratulations!`;
            else if(result === -1)
                domElements.result.textContent = `${player2.name  } won! Congratulations!`;
            else if(result === 0)
                domElements.result.textContent = "Draw!";
        }
    }

    // puts players' moves in the array
    const playerMove = () => function funPlayerMove(e){
        if(board[e.target.id-1] === 0){
            e.target.setAttribute("listener", "false");
            playersMoves.push(e.target.id - 1);
            if(player1.status === 1){
                board[e.target.id-1] = player1.sign;
            }
            else if(player2.status === 1){
                board[e.target.id-1] = player2.sign;
            }
        }
    };

    // puts computer's random move in the array
    const randomComputerMove = () => function funRandomComputerMove(e){
        if(e.target.className === "firstSign"){
            let tmp = 0;
            for(let i = 0; i < 9; i+=1)
                if(board[i] !== 0)
                    tmp+=1;
            if(tmp !== 9 && domElements.result.textContent === ""){
                let computerMove = Math.floor(Math.random() * 8);       
                while(board[computerMove] === player1.sign || board[computerMove] === player2.sign)
                    computerMove = Math.floor(Math.random() * 8);

                board[computerMove] = player2.sign;
                lastComputerMove = computerMove;
                playersMoves.push(computerMove);
            }
        }
    };

    // minimax algorithm 
    function minimax(depth, maxPlayer){
        if(depth === 0)
            return 0;

        if(gameBoard.checkScore(board) !== 2)
            return 10 * gameBoard.checkScore(board);

        if(maxPlayer){
            let maxEval = -Infinity;

            for(let i = 0; i < 9; i+=1){
                if(board[i] === 0){
                    board[i] = player1.sign;
                    maxEval = Math.max(minimax(depth - 1, false), maxEval);
                    board[i] = 0;
                }
            } 
            return maxEval;
        } 

        let minEval = Infinity;
        for(let i = 0; i < 9; i+=1){
            if(board[i] === 0){
                board[i] = player2.sign;
                minEval = Math.min(minimax(depth - 1, true), minEval);
                board[i] = 0;
            }
        }
        return minEval;
    }

    // finds best computer move
    function bestMove() {
        let turn = 0;
        for(let i = 0; i < 9; i+=1)
            if(board[i] !== 0)
                turn += 1;

        let minEval = +Infinity;
        let index = -1;

        for(let i = 0; i < 9; i+=1) {
            if(board[i] === 0){
                board[i] = player2.sign;
                const moveEval = minimax(9 - turn, true);
                board[i] = 0;

                if(moveEval < minEval){
                    index = i;
                    minEval = moveEval;
                }
            }
        }
        return index;
    }
    
    // puts best computer move in the array
    const bestComputerMove = () => function funBestComputerMove(e){
        if(e.target.className === "firstSign"){
            let tmp = 0;
            for(let i = 0; i < 9; i+=1)
                if(board[i] !== 0)
                    tmp+=1;
            if(tmp !== 9){
                lastComputerMove = bestMove();
                board[lastComputerMove] = player2.sign;
                playersMoves.push(lastComputerMove);
            }
        }   
    };

    // clears the grid
    const clearBoard = () => function funClearBoard(){
        for(let i = 0; i < 9; i+=1)
            board[i] = 0;
        player1.status = 1;
        player2.status = 0;
    };

    // undoes player's move
    const undo = () => function funUndo(){
        if(playersMoves.length > 0){
            const undoField = playersMoves.pop();
            board[undoField] = 0;
            changePlayersStatus();
            lastPlayerMove = undoField;
        }
    };

    // undoes player's move vs computer
    const undoVsComputer = () => function funUndoVsComputer(){
        if(playersMoves.length > 0){
            let tmp = 0;
            for(let i = 0; i < 9; i+=1)
                if(board[i] !== 0)
                    tmp+=1;
            if(tmp !== 1){
                lastComputerMove = playersMoves.pop();
                board[lastComputerMove] = 0;
            }
            lastPlayerMove = playersMoves.pop();
            board[lastPlayerMove] = 0;
        }
    };

    // last players' move for display controller
    const getLastPlayerMove = () => lastPlayerMove;

    // computer's move for display controller
    const getLastComputerMove = () => lastComputerMove;

    return {
        playerMove,
        randomComputerMove,
        printScore,
        checkScore,
        bestComputerMove,
        clearBoard,
        undo,
        undoVsComputer,
        getLastPlayerMove,
        getLastComputerMove
    };
})();

// controlling grid display
const displayController = (() => {    
    // shows players' inputs
    const showPlayerInput = () => function funShowPlayerInput(e){
        if(e.target.className === "notChosen"){
            if(player1.status === 1){
                e.target.className = "firstSign";
                changePlayersStatus();
                gameBoard.printScore();       
            }
            else if(player2.status === 1){
                e.target.className = "secondSign";
                changePlayersStatus();
                gameBoard.printScore();
            }
        }
    };

    // shows computer's inputs
    const showComputerInput = () => function funShowComputerInput(e){
        if(e.target.className === "firstSign"){
            const randomField = document.getElementById(gameBoard.getLastComputerMove()+1);
            randomField.className = "secondSign";
            changePlayersStatus();
            gameBoard.printScore();
        }
    };

    // clears display player vs player
    const clearDisplay = () => function funClearDisplay(){
        for (let i = 0; i < domElements.field.length; i+=1) {
            domElements.field[i].className = "notChosen";
            if(domElements.field[i].getAttribute("listener") !== "true"){
                domElements.field[i].addEventListener("click", gameBoard.playerMove(i), {once: true });
                domElements.field[i].addEventListener("click", displayController.showPlayerInput(i), {once: true });
                domElements.field[i].setAttribute("listener", "true");
            }
        }
        domElements.result.textContent = "";
    };

    // clears display vs random computer
    const clearDisplayVsRandomComputer = () => function funClearDisplayVsRandomComputer(){
        for (let i = 0; i < domElements.field.length; i+=1) {
            domElements.field[i].className = "notChosen";
            if(domElements.field[i].getAttribute("listener") !== "true"){
                domElements.field[i].addEventListener("click", gameBoard.playerMove(i), {once: true });
                domElements.field[i].addEventListener("click", displayController.showPlayerInput(i), {once: true });
                domElements.field[i].setAttribute("listener", "true");
                domElements.field[i].addEventListener("click", gameBoard.randomComputerMove(i), {once: true });
                domElements.field[i].addEventListener("click", displayController.showComputerInput(i), {once: true });
            }
        }
        domElements.result.textContent = "";
    };

    // clears display vs minimax computer
    const clearDisplayVsMinimaxComputer = () => function funClearDisplayVsMinimaxComputer(){
        for (let i = 0; i < domElements.field.length; i+=1) {
            domElements.field[i].className = "notChosen";
            if(domElements.field[i].getAttribute("listener") !== "true"){
                domElements.field[i].addEventListener("click", gameBoard.playerMove(i), {once: true });
                domElements.field[i].addEventListener("click", displayController.showPlayerInput(i), {once: true });
                domElements.field[i].setAttribute("listener", "true");
                domElements.field[i].addEventListener("click", gameBoard.bestComputerMove(i), {once: true });
                domElements.field[i].addEventListener("click", displayController.showComputerInput(i), {once: true });
            }
        }
        domElements.result.textContent = "";
    };

    // undoes field display player vs player
    const undoDisplay = () => function funUndoDisplay(){
        const fieldNumber = gameBoard.getLastPlayerMove();
        domElements.field[fieldNumber].className = "notChosen";
        domElements.field[fieldNumber].addEventListener("click", gameBoard.playerMove(fieldNumber), {once: true });
        domElements.field[fieldNumber].addEventListener("click", displayController.showPlayerInput(fieldNumber), {once: true });
        domElements.field[fieldNumber].setAttribute("listener", "true");
        const result = document.querySelector(".result");
        result.textContent = "";        
    }

    // undoes field display vs random computer
    const undoDisplayVsRandomComputer = () => function funUndoDisplayVsRandomComputer(){
        const playerFieldNumber = gameBoard.getLastPlayerMove();
        const computerFieldNumber = gameBoard.getLastComputerMove();


        domElements.field[playerFieldNumber].className = "notChosen";
        domElements.field[playerFieldNumber].setAttribute("listener", "true");
        domElements.field[playerFieldNumber].addEventListener("click", gameBoard.playerMove(playerFieldNumber), {once: true });
        domElements.field[playerFieldNumber].addEventListener("click", displayController.showPlayerInput(playerFieldNumber), {once: true });
        domElements.field[playerFieldNumber].addEventListener("click", gameBoard.randomComputerMove(playerFieldNumber), {once: true });
        domElements.field[playerFieldNumber].addEventListener("click", displayController.showComputerInput(playerFieldNumber), {once: true });
        domElements.field[computerFieldNumber].className = "notChosen";
  
        const result = document.querySelector(".result");
        result.textContent = "";        
    }

    // undoes field display vs minimax computer
    const undoDisplayVsMinimaxComputer = () => function funUndoDisplayVsMinimaxComputer(){
        const playerFieldNumber = gameBoard.getLastPlayerMove();
        const computerFieldNumber = gameBoard.getLastComputerMove();

        let tmp = 0;
            for(let i = 0; i < 9; i+=1)
                if(domElements.field[i].className !== "notChosen")
                    tmp+=1;

        if(tmp !== 1){
            domElements.field[computerFieldNumber].className = "notChosen";
        }

        domElements.field[playerFieldNumber].className = "notChosen";
        domElements.field[playerFieldNumber].setAttribute("listener", "true");
        domElements.field[playerFieldNumber].addEventListener("click", gameBoard.playerMove(playerFieldNumber), {once: true });
        domElements.field[playerFieldNumber].addEventListener("click", displayController.showPlayerInput(playerFieldNumber), {once: true });
        domElements.field[playerFieldNumber].addEventListener("click", gameBoard.bestComputerMove(playerFieldNumber), {once: true });
        domElements.field[playerFieldNumber].addEventListener("click", displayController.showComputerInput(playerFieldNumber), {once: true });
  
        const result = document.querySelector(".result");
        result.textContent = "";        
    }

    // stops displaying modal
    const modalToNone = () => function funModalToNone() {
        domElements.gameSettingsModal.style.display = "none";
        domElements.endModal.style.display = "none";
    };

    // changes tabs on the modal
    const changeModalTabs = (format) => function funChangeModalTabs() {
        domElements.playerTab.style.display = format === "player" ? "block" : "none";
        domElements.computerTab.style.display = format=== "computer" ? "block" : "none";
    };

    return {
        showPlayerInput,
        showComputerInput,
        clearDisplay,
        clearDisplayVsRandomComputer,
        clearDisplayVsMinimaxComputer,
        undoDisplay,
        undoDisplayVsRandomComputer,
        undoDisplayVsMinimaxComputer,
        modalToNone,
        changeModalTabs
    };
})();

const gameModes = (() => {
    // getting input from player vs player
    const listenPlayer = () => function funListenPlayer(){
        for (let i = 0; i < domElements.field.length; i+=1) {
            domElements.field[i].setAttribute("listener", "true");
            domElements.field[i].addEventListener("click", gameBoard.playerMove(i), {once: true });
            domElements.field[i].addEventListener("click", displayController.showPlayerInput(i), {once: true });
        }
        
        // restart button
        domElements.restartBtn.addEventListener("click", gameBoard.clearBoard());
        domElements.restartBtn.addEventListener("click", displayController.clearDisplay());

        // undo button
        domElements.undoBtn.addEventListener("click", gameBoard.undo());
        domElements.undoBtn.addEventListener("click", displayController.undoDisplay());

        // restart button at the end of the game
        domElements.restartModalBtn.addEventListener("click", gameBoard.clearBoard());
        domElements.restartModalBtn.addEventListener("click", displayController.clearDisplay());
        domElements.restartModalBtn.addEventListener("click", displayController.modalToNone());
    }

    // getting input from player vs random computer
    function listenRandomComputer(){
        for (let i = 0; i < domElements.field.length; i+=1) {
            domElements.field[i].setAttribute("listener", "true");
            domElements.field[i].addEventListener("click", gameBoard.playerMove(i), {once: true });
            domElements.field[i].addEventListener("click", displayController.showPlayerInput(i), {once: true });
            domElements.field[i].addEventListener("click", gameBoard.randomComputerMove(i), {once: true });
            domElements.field[i].addEventListener("click", displayController.showComputerInput(i), {once: true });
        }
            // restart button
            domElements.restartBtn.addEventListener("click", gameBoard.clearBoard());
            domElements.restartBtn.addEventListener("click", displayController.clearDisplayVsRandomComputer());
        
            // undo button
            domElements.undoBtn.addEventListener("click", gameBoard.undoVsComputer());
            domElements.undoBtn.addEventListener("click", displayController.undoDisplayVsRandomComputer());

            // restart button at the end of the game
            domElements.restartModalBtn.addEventListener("click", gameBoard.clearBoard());
            domElements.restartModalBtn.addEventListener("click", displayController.clearDisplayVsRandomComputer());
            domElements.restartModalBtn.addEventListener("click", displayController.modalToNone());
    }

    // getting input from player vs minimax computer
    function listenMinimaxComputer(){
        for (let i = 0; i < domElements.field.length; i+=1) {
            domElements.field[i].setAttribute("listener", "true");
            domElements.field[i].addEventListener("click", gameBoard.playerMove(i), {once: true });
            domElements.field[i].addEventListener("click", displayController.showPlayerInput(i), {once: true });
            domElements.field[i].addEventListener("click", gameBoard.bestComputerMove(i), {once: true });
            domElements.field[i].addEventListener("click", displayController.showComputerInput(i), {once: true });
        }
            // restart button
            domElements.restartBtn.addEventListener("click", gameBoard.clearBoard());
            domElements.restartBtn.addEventListener("click", displayController.clearDisplayVsMinimaxComputer());
        
            // undo button
            domElements.undoBtn.addEventListener("click", gameBoard.undoVsComputer());
            domElements.undoBtn.addEventListener("click", displayController.undoDisplayVsMinimaxComputer());

            // restart button at the end of the game
            domElements.restartModalBtn.addEventListener("click", gameBoard.clearBoard());
            domElements.restartModalBtn.addEventListener("click", displayController.clearDisplayVsMinimaxComputer());
            domElements.restartModalBtn.addEventListener("click", displayController.modalToNone());
    }

    return{
        listenPlayer,
        listenRandomComputer,
        listenMinimaxComputer
    }
})();

// start settings modal
domElements.playerSubmitModalBtn.addEventListener("click", displayController.modalToNone());
domElements.computerSubmitModalBtn.addEventListener("click", displayController.modalToNone());
domElements.playerSubmitModalBtn.addEventListener("click", gameModes.listenPlayer());


// changing tabs on modal
domElements.playerTabBtn.addEventListener("click", displayController.changeModalTabs("player"));
domElements.computerTabBtn.addEventListener("click", displayController.changeModalTabs("computer"));


//  gets data from form regarding computer type
domElements.gameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // eslint-disable-next-line no-new
  new FormData(domElements.gameForm);
  displayController.modalToNone();
});

domElements.gameForm.addEventListener("formdata", (e) => {
    player1.name = "You";
    player2.name = "Computer";
    
    let computerType = 0;
    const data = e.formData;
    // eslint-disable-next-line no-restricted-syntax
    for (const value of data.values()) {
        if(value === "minimax")
            computerType += 1;   
    };
    if(computerType === 1)
        gameModes.listenMinimaxComputer();
    else
        gameModes.listenRandomComputer();

    domElements.gameForm.reset(); 
});