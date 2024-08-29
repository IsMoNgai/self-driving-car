class Start extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);
        this.type = "start";

        this.img = new Image();
        // this.img.src = "car.png";
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector)-Math.PI/2);
        
        ctx.beginPath();
        ctx.rect(-15, -15, 30, 30);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        
        // ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);

        ctx.restore();
    }
}