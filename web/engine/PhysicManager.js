class PhysicManager {
    update(obj) {

        let nodeNum = k => Math.floor(k / 64);
        let x = nodeNum(obj.pos_x);
        let y = nodeNum(obj.pos_y);

        gameManager.units.forEach(u => {
            if (x === nodeNum(u.pos_x) && y === nodeNum(u.pos_y)) {
                if (u !== obj) {
                    obj.onTouchEntity(u);
                }
            }
        });
    }

}

var physicManager = new PhysicManager();