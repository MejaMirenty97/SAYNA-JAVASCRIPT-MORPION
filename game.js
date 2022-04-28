const boxes = Array.from(document.getElementsByClassName("box"));
const cases = document.getElementById("cases");
const reset = document.getElementsByClassName("reset");
const newLocal = "this.id";
const onClick = document.getElementById(newLocal);

//  Tableau 
const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];
const jeugagné = [
    // Lignes
    ['0', '1', '2'],
    ['3', '4', '5'],
    ['6', '7', '8'],

    // Colonnes
    ['0', '3', '6'],
    ['1', '4', '7'],
    ['2', '5', '8'],

    // Diagonales
    ['0', '4', '8'],
    ['2', '4', '6']

];

const options = document.querySelectorAll("player-option");

const rows = document.querySelectorAll(".row");

const result = document.querySelector(".result");

//Option joueurs 
let CPU = "O";
let You = "X";
//évènement click
rows.forEach((e) => {
    const onClick = e.children[0].children[0];

    e.addEventListener("click", (f) => {
        const dataRow = +e.getAttribute("data-row");
        const dataColumn = +e.getAttribute("data-column");

        if (board[dataRow][dataColumn] === "") {
            onClick.innerHTML = human;
            board[dataRow][dataColumn] = human;
        }
    });
});
//Bot
const bestMove = () => {
    let meilleurScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == "") {
                board[i][j] = ai;
                let score = minimax(board, 0, false);
                board[i][j] = "";
                if (score > meilleurScore) {
                    meilleurScore = score;
                    move = { i, j };
                }
            }
        }
    }

    return move;
};


const minimax = (board, depth, isMaximizing) => {
    let result = gagnant();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let meilleurScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let m = 0; j < 3; m++) {
                if (board[i][m] == "") {
                    board[i][m] = ai;
                    let score = minimax(board, depth + 1, false);
                    board[i][m] = "";
                    meilleurScore = Math.max(score, meilleurScore);
                }
            }
        }
        return meilleurScore;
    } else {
        let meilleurScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == "") {
                    board[i][j] = human;
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = "";
                    meilleurScore = Math.min(score, meilleurScore);
                }
            }
        }
        return meilleurScore;
    }
};

const scores = {
    X: 10,
    O: -10,
    tie: 0,
};

const updateSelector = (value) => {
    if (value === "1") {
        human = "X";
        ai = "O";
    } else {
        human = "O";
        ai = "X";
    }

    //Mis-à-jour du score
    scores[human] = -10;
    scores[ai] = 10;
};

let start = options[0].value;
updateSelector(start);

options.forEach((e) => {
    e.addEventListener("change", (f) => {
        const { value } = f.target;
        updateSelector(value);
    });
});

const null3 = (a, b, c) => {
    return a == b && b == c && a != "";
};


const gagnant = () => {
    let winner = null;

    for (let i = 0; i < 3; i++) {
        if (null3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
        }
    }

    // Vertical
    for (let i = 0; i < 3; i++) {
        if (null3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
        }
    }

    // Diagonal
    if (null3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
    }
    if (null3(board[2][0], board[1][1], board[0][2])) {
        winner = board[2][0];
    }

    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == "") {
                openSpots++;
            }
        }
    }

    if (winner == null && openSpots == 0) {
        return "égalité";
    } else {
        return winner;
    }
};

rows.forEach((e) => {
    const onClick = e.children[0].children[0];
    e.addEventListener("click", (f) => {
        const dataRow = +e.getAttribute("data-row");
        const dataColumn = +e.getAttribute("data-column");

        if (board[dataRow][dataColumn] === "") {
            onClick.innerHTML = human;
            board[dataRow][dataColumn] = human;

            const botMove = bestMove();

            if (botMove) {
                board[botMove.i][botMove.j] = ai;
                const botPlace = document.querySelector(
                    `[data-row='${botMove.i}'][data-column='${botMove.j}'] onClick`
                );

                botPlace.innerHTML = ai;
            }

            const outcome = gagnant();
            if (outcome) {
                if (outcome === "égalité") {
                    result.innerHTML = outcome;
                } else {
                    result.innerHTML = `${outcome} gagné`;
                }
            }
        }
    });
});