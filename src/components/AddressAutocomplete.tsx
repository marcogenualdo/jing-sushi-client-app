import { IonItem, IonList, IonSearchbar } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import "../pages/profile.css";
import { Address } from "../types";

const AddressAutocomplete: React.FC<{
  oldAddress: Address | null;
  address: Address | null;
  setAddress: (e: string) => void;
  canEditAddress: boolean;
}> = ({ oldAddress, address, setAddress, canEditAddress }) => {
  const autocomplete = useRef<null | google.maps.places.AutocompleteService>(
    null
  );
  useEffect(() => {
    autocomplete.current = new google.maps.places.AutocompleteService();
  }, []);

  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<
    google.maps.places.QueryAutocompletePrediction[]
  >([]);
  const putSuggestions = function (
    predictions: google.maps.places.QueryAutocompletePrediction[] | null,
    status: google.maps.places.PlacesServiceStatus
  ) {
    if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
      alert(status);
      return;
    }

    setSuggestions(predictions);
  };
  useEffect(() => {
    if (!address || !showSuggestions) return;
    autocomplete.current?.getPlacePredictions(
      { input: address },
      putSuggestions
    );
  }, [address, showSuggestions]);

  return (
    <>
      <IonSearchbar
        id="address-input"
        value={address ?? ""}
        placeholder={oldAddress ?? "Non hai ancora inserito un indirizzo."}
        onIonChange={(e) => {
          setAddress(e.detail.value!);
        }}
        onReset={() => setAddress("")}
        disabled={!canEditAddress}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && canEditAddress && (
        <IonList>
          {suggestions.map((item, index) => (
            <IonItem
              key={index}
              onClick={() => {
                console.log(item);

                setAddress(item.description);
                setShowSuggestions(false);
              }}
              className="suggestion"
            >
              {item.description}
            </IonItem>
          ))}
        </IonList>
      )}
    </>
  );
};

export default AddressAutocomplete;
