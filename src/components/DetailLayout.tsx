import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

const DetailLayout: React.FC<{ pageName: string; backTo: string }> = ({
  pageName,
  backTo,
  children,
}) => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref={backTo} />
        </IonButtons>
        <IonTitle>{pageName}</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent fullscreen>{children}</IonContent>
  </IonPage>
);

export default DetailLayout;
