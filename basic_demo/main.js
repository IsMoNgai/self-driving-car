const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
// const car = new Car(road.getLaneCenter(1),100,30,50, "KEYS");
const N = 1;
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i != 0) {
            NerualNetwork.mutate(cars[i].brain, 0.05);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "NPC", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "NPC", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "NPC", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "NPC", 2),
    new Car(road.getLaneCenter(2), -500, 30, 50, "NPC", 2),
    new Car(road.getLaneCenter(0), -700, 30, 50, "NPC", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "NPC", 2)
];

animate();

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars=[];
    for(let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars;
}

function animate(time) {
    
    for(let i = 0; i < traffic.length; i++) {
        // we dont want traffic to get damage so 2nd arg is []
        traffic[i].update(road.borders, []);
    } 
    for(let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    // this part is what we call fitness function
    // it is identifying the min y coord to be best car
    // this is important since we need to make a 
    // way to identity best car (longest distance? no collision? ...)
    // maybe I will make the best car to be closest to my cursor
    bestCar = cars.find(
        c=>c.y == Math.min(...cars.map(c=>c.y))
    );

    carCanvas.height=window.innerHeight;
    networkCanvas.height = window.innerHeight;
    
    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "green");
    }
    
    carCtx.globalAlpha=0.2;

    for(let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "black");
    }

    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "black", true);
    
    carCtx.restore();
    
    // networkCtx.lineDashOffset=-time/20;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}