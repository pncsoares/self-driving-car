document.getElementById('carCount').value =
    localStorage.getItem('carCount') || 1;
document.getElementById('mutationAmount').value =
    localStorage.getItem('mutationAmount') || '0.5';

const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 500;

const carContext = carCanvas.getContext('2d');
const networkContext = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const n = Number(document.getElementById('carCount').value);
const cars = generateCars(n);
let bestCar = cars[0];

propagateTestExperiment();

if (localStorage.getItem('bestBrain')) {
    for (let i = 0; i < cars.length; i++) {
        const theOne = localStorage.getItem('bestBrain');
        cars[i].brain = JSON.parse(theOne);

        if (i != 0) {
            NeuralNetwork.mutate(
                cars[i].brain,
                Number(document.getElementById('mutationAmount').value)
            );
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, 'DUMMY', 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -500, 30, 50, 'DUMMY', 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, 'DUMMY', 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, 'DUMMY', 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMY', 2, getRandomColor()),
];

animate();

function generateCars(n) {
    const cars = [];

    for (let i = 1; i <= n; i++) {
        const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI');
        cars.push(car);
    }

    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        // sent empty because we don't want the traffic to interact with itself or with other traffic cars
        traffic[i].update(road, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road, traffic);
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
        traffic[i].draw(carContext);
    }

    carContext.globalAlpha = 0.2;

    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carContext);
    }

    carContext.globalAlpha = 1;
    bestCar.draw(carContext, true);

    carContext.restore();

    networkContext.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkContext, bestCar.brain);

    requestAnimationFrame(animate);
}

function save() {
    const isToSave = confirm(
        "This will update the car's brain. Are you sure you want to do that?"
    );

    if (isToSave) {
        localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
    }
}

function discard() {
    const isToDelete = confirm(
        "This will update the car's brain. Are you sure you want to do that?"
    );

    if (isToDelete) {
        localStorage.removeItem('bestBrain');
    }
}

/**
 * Copy the same data from my test experiment to all users who visit the site for the first time
 */
function propagateTestExperiment() {
    if (
        !localStorage.getItem('beenHereBefore') ||
        localStorage.getItem('beenHereBefore') == 'false'
    ) {
        localStorage.setItem('beenHereBefore', true);

        loadJSON((response) => {
            localStorage.setItem('bestBrain', response);
        });
    }
}
