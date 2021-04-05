import {
  IonAlert,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonToggle,
} from "@ionic/react";
import firebase from "firebase";
import "firebaseui/dist/firebaseui.css";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Layout from "../components/Layout";
import { signIn } from "../tools/auth";
import { auth, setUserAddress } from "../tools/firestore";
import { useAppSelector } from "../tools/store";
import { Address } from "../types";
import "./profile.css";

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
  const [user] = useAuthState(auth);

  const currentAddress = useAppSelector((state) => state.address);
  const [editAddress, setEditAddress] = useState<boolean>(false);
  const [defaultAddress, setDefaultAddress] = useState<string | null>(
    currentAddress
  );
  const toggleAddress = () => {
    if (editAddress) setDefaultAddress(currentAddress);
    setEditAddress(!editAddress);
  };

  const sendAddress = (
    user: firebase.User | null | undefined,
    address: Address | null
  ) => {
    if (!user || !address) return;
    setUserAddress(user, address);
  };

  return (
    <IonList>
      <IonItem lines="none">
        <IonLabel position="stacked">Indirizzo di consegna</IonLabel>
        <IonInput
          value={defaultAddress}
          id="address-input"
          type="text"
          placeholder="Non hai ancora inserito un indirizzo."
          onIonChange={(e) => setDefaultAddress(e.detail.value!)}
          disabled={!editAddress}
        />
        {editAddress && (
          <IonButton onClick={() => sendAddress(user, defaultAddress)}>
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
          checked={editAddress}
          onIonChange={toggleAddress}
          color="primary"
        />
      </IonItem>
    </IonList>
  );
};

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Layout pageName="Profilo">{!user ? <SignedIn /> : <SignIn />}</Layout>
  );
};

export default Profile;
