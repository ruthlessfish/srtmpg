const canvasWidth = 640;
const canvasHeight = 480;

const params = {
    playerWidth: 30,
    playerHeight: 30,
    border: 5,
    statusBar: 45
}

params.canvasSize = {
    width: canvasWidth,
    height: canvasHeight,
    playField: {
        minX: canvasWidth / 2 - (canvasWidth - 10) / 2,
        minY: canvasHeight / 2 - (canvasHeight - 100) / 2,
        maxX: canvasWidth - params.playerWidth - params.border,
        maxY: canvasHeight - params.playerHeight - params.border,
        width: canvasWidth - params.border * 2,
        height: canvasHeight - params.border * 2 - params.statusBar
    }
};

params.startPosition = (min, max, factor) => 
    Math.floor(Math.random() * ((max - min) / factor)) * factor + min;

export default params;