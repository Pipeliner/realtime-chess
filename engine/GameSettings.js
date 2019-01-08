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
            window.location.href = '?map=map2.json';
        }
    }

    saveAndShowRecords() {
        alert("win!");
    }

    onLevelLost() {
        gameManager.stop();
        alert("You've lost!");
        window.location.href = '?map=map.json';
    }
}


var gameSettings = new GameSettings();
