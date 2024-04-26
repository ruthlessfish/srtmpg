const controls = (player, socket) => {
    const getDirection = (keyCode) => {
        switch(keyCode) {
            case 87: // W
            case 38: // Up
                return 'up';
            case 83: // S
            case 40: // Down
                return 'down';
            case 65: // A
            case 37: // Left
                return 'left';
            case 68: // D
            case 39: // Right
                return 'right';
        }
        return null;
    };

    document.addEventListener('keydown', (e) => {
        const direction = getDirection(e.keyCode);
        if (direction) {
            player.movement[direction] = true;
            socket.emit('move-start', { direction, X: player.x, y: player.y });
        }
    });

    document.addEventListener('keyup', (e) => {
        const direction = getDirection(e.keyCode);
        if (direction) {
            player.movement[direction] = false;
            socket.emit('move-end', { direction, x: player.x, y: player.y });
        }
    });
};

export default controls;