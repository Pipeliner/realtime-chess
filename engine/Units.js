var UnitConstants = {
    IDLE_STATE: 1,
    MOVING_STATE: 2,
    KILLED_STATE: 3,
    SHOOTING_STATE: 4,


    TOP_DIRECTION: "top",
    BOTTOM_DIRECTION: "bottom",
    RIGHT_DIRECTION: "right",
    LEFT_DIRECTION: "left",

    DELAY_BETWEEN_SHOTS: 15
};


//100% copied from metoda
var Unit = {
    pos_x: 0,  //current middle
    pos_y: 0,
    size_x: 0, //size
    size_y: 0,
    direction: UnitConstants.TOP_DIRECTION, //where it looking
    speed: 1, //pixels per tic
    state: UnitConstants.IDLE_STATE,

    //100% from metoda
    fire: function (fire_type) {
        let rocket = Object.create(Rocket);
        rocket.name = 'rocket' + (++gameManager.fireNum);
        soundManager.play('music/fire.mp3', {looping: false, volume: 1});
        rocket.pos_x = this.pos_x;
        rocket.pos_y = this.pos_y;
        var direction;
        switch(fire_type) {
            case AIAction.ATTACK_LEFT_TYPE:
                direction = UnitConstants.LEFT_DIRECTION;
                break;

            case AIAction.ATTACK_RIGHT_TYPE:
                direction = UnitConstants.RIGHT_DIRECTION;
                break;

            case AIAction.ATTACK_UP_TYPE:
                direction = UnitConstants.TOP_DIRECTION;
                break;

            case AIAction.ATTACK_DOWN_TYPE:
                direction = UnitConstants.BOTTOM_DIRECTION;
                break;
        }

        rocket.direction = direction;
        const ROCKET_INITIAL_OFFSET = 50;
        switch (direction) {
            case UnitConstants.LEFT_DIRECTION: // выстрел влево
                rocket.pos_x = this.pos_x - ROCKET_INITIAL_OFFSET;
                break;
            case UnitConstants.RIGHT_DIRECTION: // выстрел вправо
                rocket.pos_x = this.pos_x + ROCKET_INITIAL_OFFSET;
                break;
            case UnitConstants.TOP_DIRECTION: // выстрел вверх
                rocket.pos_y = this.pos_y - ROCKET_INITIAL_OFFSET;
                break;
            case UnitConstants.BOTTOM_DIRECTION: // выстрел вниз
                rocket.pos_y = this.pos_y + ROCKET_INITIAL_OFFSET;
                break;
        }
        gameManager.units.push(rocket);
    },

    returnToView: function() {
        if (this.pos_x < 0)
            this.pos_x = 0;
        if (this.pos_x > 500) // TODO a const here
            this.pos_x = 500;

        if (this.pos_y < 0)
            this.pos_y = 0;
        if (this.pos_y > 500) // TODO a const here
            this.pos_y = 500;
    },

    extend: function (extendProto) { // расширение сущности
        var object = Object.create(this); // создание нового объекта
        for (var property in extendProto) { // для всех свойств нового объекта
            if (this.hasOwnProperty(property) || typeof object[property] === 'undefined') {
                // если свойства отсутствуют в родительском объекте, то добавляем
                object[property] = extendProto[property];
            }
        }
        return object;
    }
};


var Rocket = Unit.extend({
    speed: 15,
    tile_size: 64,
    type:"rocket",
    draw: function (ctx) {
        spriteManager.drawSprite(ctx, "rocket", null, this.pos_x, this.pos_y,);
    },
    update: function () {
        if (this.direction === UnitConstants.RIGHT_DIRECTION) {
            this.pos_x += this.speed;
        }
        if (this.direction === UnitConstants.LEFT_DIRECTION) {
            this.pos_x -= this.speed;
        }
        if (this.direction === UnitConstants.TOP_DIRECTION) {
            this.pos_y -= this.speed;
        }
        if (this.direction === UnitConstants.BOTTOM_DIRECTION) {
            this.pos_y += this.speed;
        }

        physicManager.update(this);
    },
    onTouchEntity: function (objectOnAWay) {
        this.kill();
        objectOnAWay.kill();
        soundManager.play('music/explosion.mp3', {looping: false, volume: 0.4});

    },

    onLeftGameView: function() {
        this.kill();
    },

    kill: function () {
        gameManager.kill(this);
    }

});

var Hero = Unit.extend({
    name: "hero",
    type:"hero",
    speed: 6,

    draw: function (ctx) {// прорисовка объекта
        spriteManager.drawSprite(ctx, this.type, null, this.pos_x, this.pos_y);
    },

    update: function (eventsManager, mapManager, hero) {
        if (eventsManager.action["up"]) this.pos_y = this.pos_y + (-1 * this.speed);
        if (eventsManager.action["down"]) this.pos_y = this.pos_y + (+1 * this.speed);
        if (eventsManager.action["left"]) this.pos_x = this.pos_x + (-1 * this.speed);
        if (eventsManager.action["right"]) this.pos_x = this.pos_x + (+1 * this.speed);

        physicManager.update(this);
    },

    //We can eat enemy pieces!
    onTouchEntity: function (objectOnAWay) {
        objectOnAWay.kill();
        soundManager.play('music/explosion.mp3', {looping: false, volume: 0.4});
    },

    kill: function () {
        gameManager.kill(this);
    },

    onLeftGameView: Unit.returnToView,
});

var Enemy = Unit.extend({
    name: "enemy",
    type:"enemy",
    route: [],
    lastFire:10,
    draw: function (ctx) {
        // прорисовка объекта
        spriteManager.drawSprite(ctx, this.type, null, this.pos_x, this.pos_y);
    },
    update: function (eventsManager, mapManager, hero) {
        physicManager.update(this);

        let aiManager = new AIManager(mapManager.xCount,
            mapManager.yCount,
            mapManager.tSize.x);

        let nextStep = aiManager.directEnemy(this, hero);

        if (AIAction.ATTACK.includes(nextStep)) {
            this.state = UnitConstants.SHOOTING_STATE;
            if (this.lastFire % UnitConstants.DELAY_BETWEEN_SHOTS == 0) {
                this.fire(nextStep.type);
            }
            this.lastFire=this.lastFire+1;
            return;
        }

        if (nextStep.type === AIAction.WANDER_THE_MAP_TYPE) {
            this.route = nextStep.route;
            this.state = UnitConstants.MOVING_STATE;
        }

        if (nextStep.type === AIAction.GO_CLOSER_TO_HERO_TYPE) {
            this.route = nextStep.route;
            this.state = UnitConstants.MOVING_STATE;
        }

        if (this.state = UnitConstants.MOVING_STATE) {
            if (this.route.length === 0) {
                this.state = UnitConstants.IDLE_STATE;
                return;
            }

            let nodeToPosX = x => x * mapManager.tSize.x + Math.floor(mapManager.tSize.x / 2);
            let nodeToPosY = y => y * mapManager.tSize.y + Math.floor(mapManager.tSize.y / 2);

            // дошли до нужного квадрата?
            if (nodeToPosX(this.route[0].x) === this.pos_x
                && nodeToPosY(this.route[0].y) === this.pos_y) {
                this.route.shift();
                return;
            }

            let x_direction = Math.sign(nodeToPosX(this.route[0].x) - this.pos_x);
            let y_direction = Math.sign(nodeToPosY(this.route[0].y) - this.pos_y);

            if (x_direction === 1 && y_direction === 0) {
                this.direction = UnitConstants.RIGHT_DIRECTION;
            }
            if (x_direction === -1 && y_direction === 0) {
                this.direction = UnitConstants.LEFT_DIRECTION;
            }
            if (x_direction === 0 && y_direction === 1) {
                this.direction = UnitConstants.BOTTOM_DIRECTION;
            }
            if (x_direction === 0 && y_direction === -1) {
                this.direction = UnitConstants.TOP_DIRECTION;
            }


            if (x_direction != 0 && y_direction != 0) {
                if (x_direction === 1) {
                    this.direction = UnitConstants.RIGHT_DIRECTION;
                }
                if (x_direction === -1) {
                    this.direction = UnitConstants.LEFT_DIRECTION;
                }
                this.pos_x += x_direction * this.speed;
            } else {
                this.pos_x += x_direction * this.speed;
                this.pos_y += y_direction * this.speed;
            }

        }

    },

    onTouchEntity: function (obj) {
    },

    onLeftGameView: Unit.returnToView,

    kill: function () {
        gameManager.kill(this);
    },
});
