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



class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("change", function () {
      inputElevation
        .closest(".form__row")
        .classList.toggle("form__row--hidden");
      inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    });
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert("Couldnt fetch the datat");
      }
    );
  }
  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    console.log(`https://www.google.pt/maps/@${longitude},${longitude} aavash`);
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
  _toggleElevationField() {}
  _newWorkout(e) {
    e.preventDefault();
    inputDistance.focus();
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";
    console.log(mapEvent);
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
          .setPopupContent("Workout")
          .openPopup()
      );
  }
}

const app = new App();
app._getPosition();
