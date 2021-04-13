import { IonItem, IonList, IonPopover, IonSearchbar } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { Address } from "../types";

const AddressAutocomplete: React.FC<{
  address: Address | null;
  setAddress: (e: string) => void;
  canEditAddress: boolean;
}> = ({ address, setAddress, canEditAddress }) => {
  const autocomplete = useRef<null | google.maps.places.AutocompleteService>(
    null
  );
  useEffect(() => {
    autocomplete.current = new google.maps.places.AutocompleteService();
  }, []);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const putSuggestions = function (
    predictions: google.maps.places.QueryAutocompletePrediction[] | null,
    status: google.maps.places.PlacesServiceStatus
  ) {
    if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
      alert(status);
      return;
    }

    const newPredictions = predictions.map(
      (prediction) => prediction.description
    );
    setSuggestions(newPredictions);
  };
  useEffect(() => {
    if (!address) return;
    autocomplete.current?.getPlacePredictions(
      { input: address },
      putSuggestions
    );
  }, [address]);

  return (
    <>
      <IonSearchbar
        id="address-input"
        value={address ?? ""}
        placeholder={address ?? "Non hai ancora inserito un indirizzo."}
        onIonChange={(e) => {
          setAddress(e.detail.value!);
        }}
        onReset={() => setAddress("")}
        disabled={!canEditAddress}
      />
      {suggestions && (
        <IonList>
          {suggestions.map((item, index) => (
            <IonItem
              key={index}
              onClick={() => {
                setAddress(item);
                setSuggestions([]);
              }}
            >
              {item}
            </IonItem>
          ))}
        </IonList>
      )}
    </>
  );
};

export default AddressAutocomplete;
