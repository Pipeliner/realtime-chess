var eventsManager = {
    bind: [], // сопоставление клавиш действиям
    action: [], // действия

    setup: function () { // настройка сопоставления
        // стрелки
        this.bind[38] = ['up'];   
        this.bind[37] = ['left']; 
        this.bind[40] = ['down']; 
        this.bind[39] = ['right'];

        this.bind[87] = ['up'];    // w - двигаться вверх
        this.bind[65] = ['left'];  // a - двигаться влево
        this.bind[83] = ['down'];  // s - двигаться вниз
        this.bind[68] = ['right']; // d - двигаться вправо

        this.bind[81] = ['up', 'left'];   // q - влево-вверх
        this.bind[69] = ['up', 'right']   // e - вправо-вверх
        this.bind[90] = ['down', 'left']  // z - вправо-вверх
        this.bind[67] = ['down', 'right'] // c - вправо-вверх
        

        // контроль событий клавиатуры
        document.body.addEventListener("keydown", this.onKeyDown);
        document.body.addEventListener("keyup", this.onKeyUp);
    },

    onKeyDown: function (event) {
        var actions = eventsManager.bind[event.keyCode];
        if (actions){
            for (const action of actions)
                eventsManager.action[action] = true;
        }

    },

    onKeyUp: function (event) {
        var actions = eventsManager.bind[event.keyCode];
        if (actions){
            for (const action of actions)
                eventsManager.action[action] = false;
        }
    }
};
