const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carContext = carCanvas.getContext('2d');
const networkContext = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const n = 100;
const cars = generateCars(n);
let bestCar = cars[0];

if (localStorage.getItem('bestBrain')) {
    const theOne = localStorage.getItem('bestBrain');
    bestCar.brain = JSON.parse(theOne);
}

const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2)];

animate();

function generateCars(n) {
    const cars = [];

    for (let i = 0; i < n; i++) {
        const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI');
        cars.push(car);
    }

    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        // sent empty because we don't want the traffic to interact with itself or with other traffic cars
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(
        (c) =>
            c.y ==
            Math.min(
                // creates a new array with only the y axis value
                ...cars.map((c) => c.y)
            )
    );

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carContext.save();
    carContext.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carContext);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carContext, 'red');
    }

    carContext.globalAlpha = 0.2;

    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carContext, 'blue');
    }

    carContext.globalAlpha = 1;
    bestCar.draw(carContext, 'blue', true);

    carContext.restore();

    networkContext.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkContext, bestCar.brain);

    requestAnimationFrame(animate);
}

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}