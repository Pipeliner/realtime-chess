// http://stackoverflow.com/a/6969486/692528
const escapeRegExp = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

const chars = '.$[]#/%'.split('');
const charCodes = chars.map((c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

const charToCode = {};
const codeToChar = {};
chars.forEach((c, i) => {
    charToCode[c] = charCodes[i];
    codeToChar[charCodes[i]] = c;
});

const charsRegex = new RegExp(`[${escapeRegExp(chars.join(''))}]`, 'g');
const charCodesRegex = new RegExp(charCodes.join('|'), 'g');

const firebase_encode = (str) => str.replace(charsRegex, (match) => charToCode[match]);
const firebase_decode = (str) => str.replace(charCodesRegex, (match) => codeToChar[match]);

class GameSettings {

    constructor() {
        this.win = false;
    }

    checkGameConditions(units) {
        let enemiesCount = 0;
        let heroCount = 0;
        units.forEach(u => {
            if (u.type === "enemy") {
                enemiesCount++;
            }
            if (u.type === "hero") {
                heroCount++;
            }
        });

        if (enemiesCount === 0 || this.win) {
            this.onLevelCompleted();
        }
        if (heroCount === 0) {
            this.onLevelLost();
        }
    }


    onLevelCompleted() {
        gameManager.stop();
        this.win = false;
        this.saveAndShowRecords();
        if (map === "map.json") {
            // TODO: better routing between levels
            setTimeout("window.location.href = '?map=map2.json'", 1000);
        }
    }

    saveAndShowRecords() {
        let timeElapsed = performance.now() - gameManager.levelStartTime;
        let name = prompt("You won! Please enter your name");

        // TODO: better map-id detection scheme + better URLs
        let mapId = (map === "map.json" ? "0" : "1");

        if (name !== null) {
            let update = {};

            update[firebase_encode(name)] = Math.round(timeElapsed) / 1000;
            firebase.database().ref("leaderboard/" + mapId).update(update);
        }

        // TODO: better scoreboard display
        let textBoard = "Leader Board:\n";
        firebase.database().ref("leaderboard/" + mapId).once(
            "value",
            (b) => {
                let board = b.val();
                console.log(board);
                let timesSorted = Object.keys(board).sort((a, b) => board[a] - board[b]);
                for (let player of timesSorted) {
                    textBoard += firebase_decode(player) + ": " + board[player] + "s\n";
                }

                alert(textBoard);
            }
        );
    }

    onLevelLost() {
        gameManager.stop();
        alert("You've lost!");
        window.location.href = '?map=map.json';
    }
}


var gameSettings = new GameSettings();
