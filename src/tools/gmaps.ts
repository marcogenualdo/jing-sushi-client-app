// API key of the google map
const GOOGLE_MAP_API_KEY = "<YOUR_GOOGLE_MAP_API_KEY>";

// load google map script
export const loadGoogleMapScript = () => {
  return new Promise((resolve) => {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", resolve);
  });
};
