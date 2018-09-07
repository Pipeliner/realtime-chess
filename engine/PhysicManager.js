class PhysicManager {
    update(obj) {
        const tile_size = 64;

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