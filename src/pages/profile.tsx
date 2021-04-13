import {
  IonAlert,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonToast,
  IonToggle,
} from "@ionic/react";
import firebase from "firebase";
import "firebaseui/dist/firebaseui.css";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Layout from "../components/Layout";
import { signIn } from "../tools/auth";
import { auth, setUserAddress } from "../tools/firestore";
import { updateAddress, useAppSelector } from "../tools/store";
import "./profile.css";
import { Address } from "../types";
import "./profile.css";
import { getPlaceAutocomplete } from "../tools/gmaps";
import AddressAutocomplete from "../components/AddressAutocomplete";

export const SignIn: React.FC = () => (
  <div style={{ position: "relative" }}>
    <IonButton expand="block" className="full-width-button" onClick={signIn}>
      Accedi
    </IonButton>
    <div
      id="firebaseui-auth-container"
      style={{ position: "absolute", top: 0 }}
    />
  </div>
);

export const SignOut: React.FC = () => {
  const [showSignOutAlert, setShowSignOutAlert] = useState(false);

  return (
    <>
      <IonButton
        expand="block"
        className="full-width-button"
        onClick={() => setShowSignOutAlert(true)}
      >
        Log Out
      </IonButton>
      <IonAlert
        isOpen={showSignOutAlert}
        onDidDismiss={() => setShowSignOutAlert(false)}
        header={"Logout"}
        subHeader={"Sei sicuro di voler uscire dal tuo account?"}
        buttons={[
          { text: "OK", handler: () => auth.signOut() },
          { text: "Annulla", handler: () => setShowSignOutAlert(false) },
        ]}
      />
    </>
  );
};

const SignedIn = () => {
  // address data
  const [user] = useAuthState(auth);

  const currentAddress = useAppSelector((state) => state.address);
  const [canEditAddress, setCanEditAddress] = useState<boolean>(false);
  const [editedAddress, setEditedAddress] = useState<string | null>(
    currentAddress
  );
  const toggleAddress = () => {
    if (canEditAddress) setEditedAddress(currentAddress);
    setCanEditAddress(!canEditAddress);
  };

  // UI state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [canSendAddress, setCanSendAddress] = useState(true);

  const sendAddress = async (
    user: firebase.User | null | undefined,
    address: Address | null
  ) => {
    if (!user || !address) {
      console.warn(
        "Could not send the address, no user/address data provided."
      );
      return;
    }
    if (address === currentAddress) return;

    setCanSendAddress(false);
    try {
      await setUserAddress(user, address);
      setCanSendAddress(true);
      setShowSuccessToast(true);
      updateAddress(address);
      setCanEditAddress(false);
    } catch (err) {
      console.error(err);
      setShowFailureToast(true);
      setTimeout(() => setCanSendAddress(true), 2000);
    }
  };

  return (
    <IonList>
      <IonToast
        isOpen={showFailureToast}
        onDidDismiss={() => setShowFailureToast(false)}
        message="Si è verificato un errore."
        color="danger"
        position="top"
        duration={1000}
      />
      <IonToast
        isOpen={showSuccessToast}
        onDidDismiss={() => setShowSuccessToast(false)}
        message="Indirizzo salvato."
        color="primary"
        position="top"
        duration={1000}
      />

      <IonItem lines="none">
        <IonLabel position="stacked">Indirizzo di consegna</IonLabel>
        <AddressAutocomplete
          address={editedAddress}
          setAddress={setEditedAddress}
          canEditAddress={canEditAddress}
        />
        {canEditAddress && (
          <IonButton
            onClick={() => sendAddress(user, editedAddress)}
            disabled={!canSendAddress}
          >
            Conferma
          </IonButton>
        )}
        {currentAddress === null && (
          <p className="asterisk-note">
            Aggiungendo un indirizzo predefinito non dovrai inserirlo ogni volta
            nel form di ordinazione.
          </p>
        )}
      </IonItem>
      <IonItem>
        <IonLabel style={{ whiteSpace: "break-spaces" }}>
          Modifica indirizzo di default.
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

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);

  return <Layout pageName="Profilo">{user ? <SignedIn /> : <SignIn />}</Layout>;
};

export default Profile;
