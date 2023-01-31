// DOM Elements
const domElements = (function elems(){
    const field = document.getElementsByTagName("field");
    const result = document.querySelector(".result");
    const restartBtn = document.getElementById("restartBtn");
    const undoBtn = document.getElementById("undoBtn");
    const gameSettingsModal = document.getElementById("gameSettingsModal");
    const playerSubmitModalBtn = document.getElementById("playerSubmitBtn");
    const computerSubmitModalBtn = document.getElementById("computerSubmitBtn");
    const playerTabBtn = document.getElementById("playerFormat");
    const computerTabBtn = document.getElementById("computerFormat");
    const playerTab = document.getElementById("player");
    const computerTab = document.getElementById("computer");
    return {
        field,
        result,
        restartBtn,
        undoBtn,
        gameSettingsModal,
        playerSubmitModalBtn,
        computerSubmitModalBtn,
        playerTabBtn,
        computerTabBtn,
        playerTab,
        computerTab
    }
})();


// makes players
const playerFactory = (name, sign, status) => ({name, sign, status,});

const player1 = playerFactory("Sally", "x", 1);
const player2 = playerFactory("Mater", "o", 0);

function changePlayersStatus(){
    player1.status = player1.status === 1 ? 0 : 1;
    player2.status = player2.status === 1 ? 0 : 1;
}

const gameBoard = (() => {
    // makes the board
    const board = [];
    for(let i = 0; i < 9; i+=1)
        board[i] = 0;

    const playersPicks = [];
    let lastPlayerPick = -1;
    let lastComputerPick = -1;

    // checks the score
    const checkScore = () => {
        // checks rows
        for(let i = 0; i < 9; i+=3)
            if(board[i] === board[i+1] && board[i+1] === board[i+2] && board[i] !== 0)
                return player1.sign === board[i] ? 1 : -1;

        // checks columns
        for(let i = 0; i < 3; i+=1)
            if(board[i] === board[i+3] && board[i+3] === board[i+6] && board[i] !== 0)
                return player1.sign === board[i] ? 1 : -1; 

        // checks diagonals
        if((board[0] === board[4] && board[4] === board[8] && board[0] !== 0) ||
           (board[2] === board[4] && board[4] === board[6] && board[2] !== 0))
            return player1.sign === board[4] ? 1 : -1;
        
        // checks if it is a draw
        if(domElements.result.textContent === ""){
            let i = 0;
            while(board[i] !== 0 && i < 9)
                i+=1;

            if(i === 9)
                return 0;   
        }
        return 2;
    }

    // prints ending message
    const printScore = () =>{
        const result = gameBoard.checkScore();
        if(result === 1)
            domElements.result.textContent = `${player1.name  } won! Congratulations!`;
        else if(result === -1)
            domElements.result.textContent = `${player2.name  } won! Congratulations!`;
        else if(result === 0)
            domElements.result.textContent = "Draw!";
    }

    // puts players' choices in the array
    const playerChoice = () => function funPlayerChoice(e){
        if(board[e.target.id-1] === 0){
            e.target.setAttribute("listener", "false");
            playersPicks.push(e.target.id - 1);
            if(player1.status === 1){
                board[e.target.id-1] = player1.sign;
            }
            else if(player2.status === 1){
                board[e.target.id-1] = player2.sign;
            }
        }
    };

    // puts player's and computer's random choice in the array
    const randomComputerChoice = () => function funRandomComputerChoice(e){
        if(e.target.className === "firstSign"){
            let tmp = 0;
            for(let i = 0; i < 9; i+=1)
                if(board[i] !== 0)
                    tmp+=1;
            if(tmp !== 9 && domElements.result.textContent === ""){
                let computerChoice = Math.floor(Math.random() * 8);       
                while(board[computerChoice] === "x" || board[computerChoice] === "o")
                    computerChoice = Math.floor(Math.random() * 8);

                board[computerChoice] = player2.sign;
                lastComputerPick = computerChoice;
                playersPicks.push(computerChoice);
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

    // undoes player's choice
    const undo = () => function funUndo(){
        if(playersPicks.length > 0){
            const undoField = playersPicks.pop();
            board[undoField] = 0;
            changePlayersStatus();
            lastPlayerPick = undoField;
        }
    };

    // undoes player's choice vs computer
    const undoVsComputer = () => function funUndoVsComputer(){
        if(playersPicks.length > 0){
            lastComputerPick = playersPicks.pop();
            board[lastComputerPick] = 0;
            lastPlayerPick = playersPicks.pop();
            board[lastPlayerPick] = 0;
        }
    };

    // last players' pick for display controller
    const getLastPlayerPick = () => lastPlayerPick;

    // computer's choice for display controller
    const getLastComputerPick = () => lastComputerPick;

    return {
        playerChoice,
        randomComputerChoice,
        printScore,
        checkScore,
        clearBoard,
        undo,
        undoVsComputer,
        getLastPlayerPick,
        getLastComputerPick
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
            
            const randomField = document.getElementById(gameBoard.getLastComputerPick()+1);
            console.log(gameBoard.getLastComputerPick())
            randomField.className = "secondSign";
            changePlayersStatus();
            gameBoard.printScore();
        }
    };

    // clears display
    const clearDisplay = () => function funClearDisplay(){
        for (let i = 0; i < domElements.field.length; i+=1) {
            domElements.field[i].className = "notChosen";
            if(domElements.field[i].getAttribute("listener") !== "true"){
                domElements.field[i].addEventListener("click", gameBoard.playerChoice(i), {once: true });
                domElements.field[i].addEventListener("click", displayController.showPlayerInput(i), {once: true });
                domElements.field[i].setAttribute("listener", "true");
            }
        }
        domElements.result.textContent = "";
    };

    // clears display vs computer
    const clearDisplayVsComputer = () => function funClearDisplayVsComputer(){
        for (let i = 0; i < domElements.field.length; i+=1) {
            domElements.field[i].className = "notChosen";
            if(domElements.field[i].getAttribute("listener") !== "true"){
                domElements.field[i].addEventListener("click", gameBoard.playerChoice(i), {once: true });
                domElements.field[i].addEventListener("click", displayController.showPlayerInput(i), {once: true });
                domElements.field[i].setAttribute("listener", "true");
                domElements.field[i].addEventListener("click", gameBoard.randomComputerChoice(i), {once: true });
                domElements.field[i].addEventListener("click", displayController.showComputerInput(i), {once: true });
            }
        }
        domElements.result.textContent = "";
    };

    // undoes field display
    const undoDisplay = () => function funUndoDisplay(){
        const fieldNumber = gameBoard.getLastPlayerPick();
        domElements.field[fieldNumber].className = "notChosen";
        domElements.field[fieldNumber].addEventListener("click", gameBoard.playerChoice(fieldNumber), {once: true });
        domElements.field[fieldNumber].addEventListener("click", displayController.showPlayerInput(fieldNumber), {once: true });
        domElements.field[fieldNumber].setAttribute("listener", "true");
        const result = document.querySelector(".result");
        result.textContent = "";        
    }

    // undoes field display vs computer
    const undoDisplayVsComputer = () => function funUndoDisplayVsComputer(){
        const playerFieldNumber = gameBoard.getLastPlayerPick();
        const computerFieldNumber = gameBoard.getLastComputerPick();

        domElements.field[playerFieldNumber].className = "notChosen";
        domElements.field[playerFieldNumber].setAttribute("listener", "true");
        domElements.field[playerFieldNumber].addEventListener("click", gameBoard.playerChoice(playerFieldNumber), {once: true });
        domElements.field[playerFieldNumber].addEventListener("click", displayController.showPlayerInput(playerFieldNumber), {once: true });
        domElements.field[playerFieldNumber].addEventListener("click", gameBoard.randomComputerChoice(playerFieldNumber), {once: true });
        domElements.field[playerFieldNumber].addEventListener("click", displayController.showComputerInput(playerFieldNumber), {once: true });
        domElements.field[computerFieldNumber].className = "notChosen";
  
        const result = document.querySelector(".result");
        result.textContent = "";        
    }

    // stops displaying modal
    const modalToNone = () => function funModalToNone() {
    domElements.gameSettingsModal.style.display = "none";
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
        clearDisplayVsComputer,
        undoDisplay,
        undoDisplayVsComputer,
        modalToNone,
        changeModalTabs
    };
})();

const gameModes = (() => {
    // getting input from player vs player
    const listenPlayer = () => function funListenPlayer(){
        for (let i = 0; i < domElements.field.length; i+=1) {
            domElements.field[i].setAttribute("listener", "true");
            domElements.field[i].addEventListener("click", gameBoard.playerChoice(i), {once: true });
            domElements.field[i].addEventListener("click", displayController.showPlayerInput(i), {once: true });
        }
        
        // restart button
        domElements.restartBtn.addEventListener("click", gameBoard.clearBoard());
        domElements.restartBtn.addEventListener("click", displayController.clearDisplay());

        // undo button
        domElements.undoBtn.addEventListener("click", gameBoard.undo());
        domElements.undoBtn.addEventListener("click", displayController.undoDisplay());

    }

    // getting input from player vs computer
    const listenComputer = () => function funListenComputer(){
        player2.name = "computer";
        for (let i = 0; i < domElements.field.length; i+=1) {
            domElements.field[i].setAttribute("listener", "true");
            domElements.field[i].addEventListener("click", gameBoard.playerChoice(i), {once: true });
            domElements.field[i].addEventListener("click", displayController.showPlayerInput(i), {once: true });
            domElements.field[i].addEventListener("click", gameBoard.randomComputerChoice(i), {once: true });
            domElements.field[i].addEventListener("click", displayController.showComputerInput(i), {once: true });
        }
            // restart button
            domElements.restartBtn.addEventListener("click", gameBoard.clearBoard());
            domElements.restartBtn.addEventListener("click", displayController.clearDisplayVsComputer());
        
            // undo button
            domElements.undoBtn.addEventListener("click", gameBoard.undoVsComputer());
            domElements.undoBtn.addEventListener("click", displayController.undoDisplayVsComputer());
    }
    return{
        listenPlayer,
        listenComputer
    }
})();

// start settings modal
domElements.playerSubmitModalBtn.addEventListener("click", displayController.modalToNone());
domElements.computerSubmitModalBtn.addEventListener("click", displayController.modalToNone());
domElements.playerSubmitModalBtn.addEventListener("click", gameModes.listenPlayer());
domElements.computerSubmitModalBtn.addEventListener("click", gameModes.listenComputer());

// changing tabs on modal
domElements.playerTabBtn.addEventListener("click", displayController.changeModalTabs("player"));
domElements.computerTabBtn.addEventListener("click", displayController.changeModalTabs("computer"));