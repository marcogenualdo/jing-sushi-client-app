import {
  IonAlert,
  IonButton,
  IonItem,
  IonItemDivider,
  IonToast,
} from "@ionic/react";
import "firebaseui/dist/firebaseui.css";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AddressEditor from "../components/AddressEditor";
import Layout from "../components/Layout";
import { signIn } from "../tools/auth";
import { auth, setUserAddress } from "../tools/firestore";
import { updateAddress, useAppSelector } from "../tools/store";
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

  // UI state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [canSendAddress, setCanSendAddress] = useState(true);

  const sendAddress = async (address: Address | null) => {
    if (!user || !address) {
      console.warn(
        "Could not send the address, no user/address data provided."
      );
      return;
    }

    setCanSendAddress(false);
    try {
      await setUserAddress(user, address);
      setCanSendAddress(true);
      setShowSuccessToast(true);
      updateAddress(address);
    } catch (err) {
      console.error(err);
      setShowFailureToast(true);
      setTimeout(() => setCanSendAddress(true), 2000);
    }
  };

  return (
    <>
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
      <AddressEditor
        currentAddress={currentAddress}
        canConfirm={canSendAddress}
        onConfirm={sendAddress}
        liveEdit={false}
        toggleLabel="Modifica indirizzo di default."
      />

      {!currentAddress?.address && (
        <p className="asterisk-note">
          Aggiungendo un indirizzo predefinito non dovrai inserirlo ogni volta
          nel form di ordinazione.
        </p>
      )}
      <IonItemDivider />
      <IonItem detail routerLink={`/profile/myorders`}>
        I miei ordini
      </IonItem>
      <IonItemDivider />
      <SignOut />
    </>
  );
};

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);

  return <Layout pageName="Profilo">{user ? <SignedIn /> : <SignIn />}</Layout>;
};

export default Profile;
