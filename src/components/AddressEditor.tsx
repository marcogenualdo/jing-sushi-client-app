import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonToggle,
} from "@ionic/react";
import "firebaseui/dist/firebaseui.css";
import React, { useEffect, useState } from "react";
import { Address } from "../types";
import "../pages/profile.css";

const AddressEditor: React.FC<{
  canConfirm: boolean;
  currentAddress: Address | null;
  onConfirm: (addr: Address) => void;
  liveEdit: boolean;
  toggleLabel: string;
}> = ({ currentAddress, canConfirm, onConfirm, liveEdit, toggleLabel }) => {
  const [canEditAddress, setCanEditAddress] = useState<boolean>(false);

  const [editedAddress, setEditedAddress] = useState<string | undefined>(
    currentAddress?.address
  );
  const [editedZip, setEditedZip] = useState<string | undefined>(
    currentAddress?.zip
  );

  const toggleAddress = () => setCanEditAddress(!canEditAddress);

  // reset address values
  useEffect(() => {
    if (!canEditAddress || !editedAddress)
      setEditedAddress(currentAddress?.address);
    if (!canEditAddress || !editedZip) setEditedZip(currentAddress?.zip);
  }, [currentAddress, editedAddress, editedZip, canEditAddress]);

  const updater = () => {
    if (liveEdit && editedAddress && editedZip)
      onConfirm({ address: editedAddress, zip: editedZip });
  };

  return (
    <IonList>
      <IonItem lines="none">
        <IonLabel position="stacked">Indirizzo di consegna</IonLabel>
        <IonInput
          value={editedAddress}
          placeholder={
            currentAddress?.address ?? "Non hai ancora inserito un indirizzo."
          }
          onIonChange={(e) => {
            setEditedAddress(e.detail.value!);
            updater();
          }}
          disabled={!canEditAddress}
        />
        <IonLabel position="stacked">CAP</IonLabel>
        <IonInput
          value={editedZip}
          placeholder={currentAddress?.zip ?? "Non hai ancora inserito un CAP."}
          onIonChange={(e) => {
            setEditedZip(e.detail.value!);
            updater();
          }}
          disabled={!canEditAddress}
        />
        {!liveEdit && canEditAddress && (
          <IonButton
            onClick={() => {
              if (
                !editedAddress ||
                !editedZip ||
                (editedAddress === currentAddress?.address &&
                  editedZip === currentAddress.zip)
              ) {
                return;
              }
              onConfirm({ address: editedAddress, zip: editedZip });
              setCanEditAddress(false);
            }}
            disabled={!canConfirm}
          >
            Conferma
          </IonButton>
        )}
      </IonItem>
      <IonItem>
        <IonLabel style={{ whiteSpace: "break-spaces" }}>
          {toggleLabel}
        </IonLabel>
        <IonToggle
          checked={canEditAddress}
          onIonChange={toggleAddress}
          color="primary"
        />
      </IonItem>
    </IonList>
  );
};

export default AddressEditor;
