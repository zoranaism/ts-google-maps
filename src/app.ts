import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyDzotL1qLxLSMMMDapOANZ2Fp1jLDjcso8";

// google not available globaly because it's JS, not TS
// had to be declared
// declare var google: any;
// const requestURL =
//   "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY";

type GoogleGeocodingResponse = {
  // type alias
  results: { geometry: { location: { lat: number; lng: number } } }[];
  // common Google API response status values
  status: "OK" | "ZERO_RESULTS";
  // we can also add here other values if we need from API
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  //built in browser, available in modern broswers, we can use it to send requests in URL, tho error handleing can be a bit cluncky
  //   fetch();
  // or we can use third part library like axios to send HTTP requests

  // encodeURI - JS built-in function converting to URL compatible string
  axios
    .get<GoogleGeocodingResponse>( // adding a response type
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location!");
      }
      // typescript cannot guess what type of response is there, also no autocompletion
      const coordinates = response.data.results[0].geometry.location;

      const map = new google.maps.Map(document.getElementById("map")! as HTMLElement, {
        center: coordinates,
        zoom: 14,
      });

      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}
form.addEventListener("submit", searchAddressHandler)!;

// If we have any google API mistake, typescript & webpack wont report because we were not type specific
// So we wont get any console error, just an error when sending a request
// We can ensure that Types knows Google with @types/googlemaps 
// Now we dont have to declare, we have autocompletion for functions