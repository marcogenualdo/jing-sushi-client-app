import { IonButton, IonAlert } from "@ionic/react";
import "firebaseui/dist/firebaseui.css";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { signIn } from "../tools/auth";
import { auth } from "../tools/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export const SignIn: React.FC = () => (
  <div style={{ position: "relative" }}>
    <IonButton expand="block" style={{ padding: "0 1rem" }} onClick={signIn}>
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
        style={{ padding: "0 1rem" }}
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

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);

  return <Layout pageName="Profilo">{user ? <SignOut /> : <SignIn />}</Layout>;
};

export default Profile;
