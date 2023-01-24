// making players
const playerFactory = (name, sign, status) => ({name, sign, status,});

const player1 = playerFactory("Sally", "x", 1);
const player2 = playerFactory("Mater", "o", 0);

function changePlayerStatus(){
    player1.status = player1.status === 1 ? 0 : 1;
    player2.status = player2.status === 1 ? 0 : 1;
}

const gameBoard = (() => {
    // making the board
    const board = [];
    for(let i = 0; i < 9; i+=1)
        board[i] = 0;

    // checking the score
    const checkScore = () => {
        const result = document.querySelector(".result");
        let winner = "";
        // checking rows
        for(let i = 0; i < 9; i+=3){
            if(board[i] === board[i+1] && board[i+1] === board[i+2] && board[i] !== 0){
                winner = player1.sign === board[i] ? player1.name : player2.name;
                result.textContent = `${winner  } won! Congratulations!`;
            }
        }
        // checking columns
        for(let i = 0; i < 3; i+=1){
            if(board[i] === board[i+3] && board[i+3] === board[i+6] && board[i] !== 0){
                winner = player1.sign === board[i] ? player1.name : player2.name;
                result.textContent = `${winner  } won! Congratulations!`;
            }
        }
        // checking diagonals
        if((board[0] === board[4] && board[4] === board[8] && board[0] !== 0) ||
           (board[2] === board[4] && board[4] === board[6] && board[2] !== 0)){
            winner = player1.sign === board[4] ? player1.name : player2.name;
            result.textContent = `${winner  } won! Congratulations!`;
        }
        // checking if it is a draw
        if(winner === ""){
            let i = 0;
            while(board[i] !== 0 && i < 9)
                i+=1;
            if(i === 9)
                result.textContent = "Draw!";
        }
    }
    // putting players' choices in the "board:
    const setFieldValue = () => function funSetFieldValue(e){
            if(player1.status === 1){
                board[e.target.id-1] = player1.sign;
            }
            else if(player2.status === 1){
                board[e.target.id-1] = player2.sign;
            }
        };
    return {
        setFieldValue,
        checkScore
    };
})();

// controlling grid display
const displayController = (() => {    
    const changeFieldDisplay = () => function funChangeFieldDisplay(e){
        if(player1.status === 1){
            e.target.className = "firstSign";
            changePlayerStatus();
            gameBoard.checkScore();       
        }
        else if(player2.status === 1){
            e.target.className = "secondSign";
            changePlayerStatus();
            gameBoard.checkScore();
        }
    };
    return {
        changeFieldDisplay
    };
})();

// getting input from players
function listen(){
    const field = document.getElementsByTagName("field");
    for (let i = 0; i < field.length; i+=1) {
        field[i].addEventListener("click", gameBoard.setFieldValue(i), {once: true });
        field[i].addEventListener("click", displayController.changeFieldDisplay(i), {once: true });
    } 
}

listen();