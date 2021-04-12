export const getPlaceAutocomplete = (handlePlaceSelect: () => void) => {
  const ionInput = document.getElementById("address-input");
  const input = ionInput?.getElementsByTagName("input")[0] as HTMLInputElement;

  const options = {
    componentRestrictions: { country: "it" },
    fields: ["address_components", "geometry", "icon", "name"],
    strictBounds: false,
    types: ["address"],
  };

  const autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.addListener("place_changed", handlePlaceSelect);

  return autocomplete;
};
