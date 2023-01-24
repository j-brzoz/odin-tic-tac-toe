const playerFactory = (name, sign, status) => ({name, sign, status,});

const player1 = playerFactory("one", "x", 1);
const player2 = playerFactory("two", "o", 0);

function changePlayerStatus(){
    player1.status = player1.status === 1 ? 0 : 1;
    player2.status = player2.status === 1 ? 0 : 1;
}

const gameBoard = (() => {
    const board = [];
    for(let i = 0; i < 9; i+=1)
        board[i] = 0;
    
    const setFieldValue = () => function funSetFieldValue(e){
            if(player1.status === 1){
                board[e.target.id-1] = player1.sign;
            }
            else if(player2.status === 1){
                board[e.target.id-1] = player2.sign;
            }
        };
    return {
        setFieldValue
    };
})();


const displayController = (() => {    
    const changeFieldDisplay = () => function funChangeFieldDisplay(e){
        if(player1.status === 1){
            e.target.className = "firstSign";
            changePlayerStatus();        
        }
        else if(player2.status === 1){
            e.target.className = "secondSign";
            changePlayerStatus();
        }
    };
    return {
        changeFieldDisplay
    };
})();

function listen(){
    const field = document.getElementsByTagName("field");
    for (let i = 0; i < field.length; i+=1) {
        field[i].addEventListener("click", gameBoard.setFieldValue(i), {once: true });
        field[i].addEventListener("click", displayController.changeFieldDisplay(i), {once: true });
    } 
}

listen();