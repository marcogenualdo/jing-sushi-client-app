import { IonButton } from "@ionic/react";
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import React from "react";
import Layout from "../components/Layout";

const signIn = () => {
  const auth = firebase.auth();
  auth.languageCode = "it";
  const ui = new firebaseui.auth.AuthUI(auth);

  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (
        authResult: any,
        redirectUrl: any
      ) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function () {
        // The widget is rendered.
        // Hide the loader.
        /* document.getElementById("loader").style.display = "none"; */
      },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: "redirect",
    signInSuccessUrl: "/profile",
    signInOptions: [
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        defaultCountry: "IT",
      },
    ],
    /* // Terms of service url. */
    /* tosUrl: "<your-tos-url>", */
    /* // Privacy policy url. */
    /* privacyPolicyUrl: "<your-privacy-policy-url>", */
  };

  ui.start("#firebaseui-auth-container", uiConfig);
};

const Profile: React.FC = () => {
  return (
    <Layout pageName="Profilo">
      <IonButton expand="block" style={{ padding: "0 3%" }} onClick={signIn}>
        Accedi
      </IonButton>
      <div id="firebaseui-auth-container"></div>;
    </Layout>
  );
};

export default Profile;
