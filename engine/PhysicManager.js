class PhysicManager {
    update(obj) {
        const tile_size = 64;

        // XXX: now the bullets don't disappear! fix!
        // Bullets "rockets" aren't really destroyed

        // check for "canLeaveGameView"
        // if true, call onLeftGameView
        // else, do this vvv

        if (obj.pos_x < 0 || obj.pos_x > 500 || obj.pos_y < 0 || obj.pos_y > 500)
            obj.onLeftGameView();

        gameManager.units.forEach(u => {
            if (Math.sqrt(Math.pow(obj.pos_x - u.pos_x, 2)
                + Math.pow(obj.pos_y - u.pos_y, 2)) < tile_size / 2) {
                if (u !== obj) {
                    obj.onTouchEntity(u);
                }
            }
        });
    }

}

var physicManager = new PhysicManager();