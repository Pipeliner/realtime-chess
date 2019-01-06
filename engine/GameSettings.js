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
        if (map === "map.json") {
            alert("win");
            window.location.href = '?map=map2.json';
        } else {
            this.saveAndShowRecords();
        }

    }

    saveAndShowRecords() {
        fs_global.root.getFile('log6.txt', {create: true}, function (fileEntry) {

            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function (fileWriter) {

                fileWriter.seek(fileWriter.length); // Start write position at EOF.

                // Create a new Blob and write it to log.txt.
                var blob = new Blob(["Player won this game:"+prompt("enter name", "potter") + "\n"],
                    {type: 'text/plain'});

                fileWriter.write(blob);

            }, errorHandler);

        }, errorHandler);


        setTimeout(function () {

            fs_global.root.getFile('log6.txt', {}, function (fileEntry) {

                // Get a File object representing the file,
                // then use FileReader to read its contents.
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function (e) {
                        alert(this.result);
                        window.location.href = '?map=map.json';
                    };

                    reader.readAsText(file);
                }, errorHandler);

            }, errorHandler);
        }, 1000);


    }

    onLevelLost() {
        gameManager.stop();
        alert("You've lost!");
        window.location.href = '?map=map.json';
    }
}


var gameSettings = new GameSettings();
