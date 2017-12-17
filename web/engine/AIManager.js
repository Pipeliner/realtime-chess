class AIAction {
    constructor(route = null, type = AIAction.NO_CHANGES_TYPE) {
        this.route = route;
        this.type = type;
    }
}

AIAction.NO_CHANGES_TYPE = 1;
AIAction.START_HUNT_TYPE = 2;
AIAction.WANDER_THE_MAP_TYPE = 3;
AIAction.GO_CLOSER_TO_HERO_TYPE = 4;
AIAction.ATTACK_LEFT_TYPE = 5;
AIAction.ATTACK_RIGTH_TYPE = 6;
AIAction.ATTACK_DOWN_TYPE = 7;
AIAction.ATTACK_UP_TYPE = 8;

AIAction.NO_CHANGES = new AIAction();
AIAction.ATTACK_LEFT = new AIAction(null, AIAction.ATTACK_LEFT_TYPE);
AIAction.ATTACK_RIGHT = new AIAction(null, AIAction.ATTACK_RIGHT_TYPE);
AIAction.ATTACK_DOWN = new AIAction(null, AIAction.ATTACK_DOWN_TYPE);
AIAction.ATTACK_UP = new AIAction(null, AIAction.ATTACK_UP_TYPE);

AIAction.ATTACK = [AIAction.ATTACK_LEFT, AIAction.ATTACK_RIGHT, AIAction.ATTACK_DOWN, AIAction.ATTACK_UP];

class AIManager {

    constructor(map_w, map_h, tile_size) {
        this.map_w = map_w;
        this.map_h = map_h;
        this.tile_size = tile_size;
        this.routeManager = new RouteManager(this.map_w, this.map_h);
    }

    nodeNum(pixel_coordinate) {
        return Math.floor(pixel_coordinate / this.tile_size);
    }

    routeIsStraight(from_x, from_y, to_x, to_y) {
        if (from_x === to_x) {
            return true;
        }
        if (from_y === to_y) {
            return true;
        }
        return false;
    };

    directEnemy(enemy, hero) {
        var nodeNum = (pixel_coordinate) => this.nodeNum(pixel_coordinate);

        if (enemy.state === UnitConstants.IDLE_STATE) {
            let route = this.routeManager.getRouteToRandomNode(
                nodeNum(enemy.pos_x),
                nodeNum(enemy.pos_y));

            return new AIAction(route, AIAction.WANDER_THE_MAP_TYPE);
        }

        if (enemy.state === UnitConstants.MOVING_STATE) {
            if (this.heroIsCloseToEnemy(hero, enemy)) {
                    if (Math.abs(hero.pos_x - enemy.pos_x) < this.tile_size) {
                        if (hero.pos_y < enemy.pos_y)
                            return AIAction.ATTACK_UP;
                        else
                            return AIAction.ATTACK_DOWN;
                    }

                    if (Math.abs(hero.pos_y - enemy.pos_y) < this.tile_size) {
                        if (hero.pos_x < enemy.pos_x)
                            return AIAction.ATTACK_LEFT;
                        else
                            return AIAction.ATTACK_RIGHT;
                    }
                }
            }

            let routeToHero = this.routeManager.getRoute(nodeNum(enemy.pos_x),
                nodeNum(enemy.pos_y),
                nodeNum(hero.pos_x),
                nodeNum(hero.pos_y));

            let nodeToPosX = x => x * 64 + Math.floor(64 / 2);
            let nodeToPosY = y => y * 64 + Math.floor(64 / 2);

            routeToHero.shift();


            return new AIAction(routeToHero, AIAction.GO_CLOSER_TO_HERO_TYPE);

        return AIAction.NO_CHANGES_TYPE;
    }

    heroIsCloseToEnemy(hero, enemy) {
        return Math.sqrt(Math.pow(enemy.pos_x - hero.pos_x, 2)
                + Math.pow(enemy.pos_y - hero.pos_y, 2)) < 64 * 10;
    }

}
