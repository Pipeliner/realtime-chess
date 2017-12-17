var eventsManager = {
    bind: [], // сопоставление клавиш действиям
    action: [], // действия

    //100% copied from metoda
    setup: function () { // настройка сопоставления
        this.bind[38] = 'up'; // w - двигаться вверх
        this.bind[37] = 'left'; // a - двигаться влево
        this.bind[40] = 'down'; // s - двигаться вниз
        this.bind[39] = 'right'; // d - двигаться вправо
        this.bind[13] = 'fire'; // пробел - выстрелить

        // контроль событий клавиатуры
        document.body.addEventListener("keydown", this.onKeyDown);
        document.body.addEventListener("keyup", this.onKeyUp);
    },
    //100% copied from metoda
    onKeyDown: function (event) {
        var action = eventsManager.bind[event.keyCode];
        if(action){
            eventsManager.action[action] = true;
        }

    },
    //100% copied from metoda
    onKeyUp: function (event) {
        var action = eventsManager.bind[event.keyCode];
        if (action)
            eventsManager.action[action] = false; // отменили действие
    }
};
