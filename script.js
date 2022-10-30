"use strict";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const deleteAllBtn = document.querySelector(".delete-btn");

let map;
let mapEvent;



class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;

  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
  }

  calcSpeed() {
    this.pace = this.distance / this.duraion / 60;
    return this.speed;
  }

}



const run1 = new Running([27, 83], 5.2, 24, 178);
const cycling1 = new Cycling([27, 83], 5.2, 24, 178);

console.log(run1, cycling1);

class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this.workouts = [];
    this._getPosition();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField)
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Couldnt fetch the datat");
        }
      );
  }
  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, 20);
    console.log(this.#map);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }
  _toggleElevationField() {
    inputElevation
      .closest(".form__row")
      .classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }
  _newWorkout(e) {
    const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp))
    const allPositive = (...inputs) => inputs.every(inp => inp > 0)
    e.preventDefault();

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (type == 'running') {
      const cadence = +inputCadence.value;

      if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence)) {
        return alert("inputs have to be positive numbers");
      }

      workout = new Running([lat, lng], distance, duration, cadence);
      this.#workouts.push(workout);
    }
    if (type == 'cycling') {
      const elevation = +inputElevation.value;
      if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration, elevation)) {
        return alert("inputs have to be positive numbers");
      }
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    this.#workouts.push(workout);
    this.renderWorkoutMarker(workout)
    inputDistance.focus();

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
      "";

  }

  renderWorkoutMarker(workout) {
    L.marker(workout.coords)
    .addTo(this.#map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${workout.type}-popup`,
      }))
        .setPopupContent('workout.distance')
        .openPopup()
    ;

  }
}

const app = new App();
