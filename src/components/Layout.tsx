import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

const Layout: React.FC<{ pageName: string }> = ({ pageName, children }) => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>{pageName}</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Carrello</IonTitle>
        </IonToolbar>
      </IonHeader>
      {children}
    </IonContent>
  </IonPage>
);

export default Layout;
