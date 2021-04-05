import React, { useEffect, useRef, useState } from "react";

const GPlaceAutocomplete = () => {
  const input = document.getElementById("address-input") as HTMLInputElement;
  const options = {
    componentRestrictions: { country: "it" },
    fields: ["address_components", "geometry", "icon", "name"],
    strictBounds: false,
    types: ["address"],
  };
  const autocomplete = new google.maps.places.Autocomplete(input, options);
};

export default GPlaceAutocomplete;
