const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carContext = carCanvas.getContext('2d');
const networkContext = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI');

const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2)];

animate();

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        // sent empty because we don't want the traffic to interact with itself or with other traffic cars
        traffic[i].update(road.borders, []);
    }

    car.update(road.borders, traffic);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carContext.save();
    carContext.translate(0, -car.y + carCanvas.height * 0.7);

    road.draw(carContext);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carContext, 'red');
    }

    car.draw(carContext, 'blue');

    carContext.restore();

    networkContext.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkContext, car.brain);

    requestAnimationFrame(animate);
}
