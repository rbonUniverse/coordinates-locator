import axios from "../node_modules/axios/index";

const form = document.querySelector("form") as HTMLFormElement;
const addressInput = document.getElementById("address") as HTMLInputElement;

const GOOGLE_API_KEY = "YOUR_GOOGLE_KEY";

async function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enterAddress = addressInput.value;
  const { Map } = (await google.maps.importLibrary(
    "maps"
  )) as google.maps.MapsLibrary;

  type googleGeocodingResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
    status: "OK" | "ZERO_RESULTS";
  };

  try {
    const res = await axios.get<googleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enterAddress
      )}&key=${GOOGLE_API_KEY}`
    );
    if (res.data.status !== "OK") {
      throw new Error("Location not found!!!");
    }
    const coordinates = res.data.results[0].geometry.location;
    const map = new Map(document.getElementById("map"), {
      center: coordinates,
      zoom: 8,
    });
    new google.maps.Marker({
      position: coordinates,
      map: map,
    });
  } catch (err) {
    alert(err);
    console.log(err);
  }
}

form.addEventListener("submit", searchAddressHandler);
