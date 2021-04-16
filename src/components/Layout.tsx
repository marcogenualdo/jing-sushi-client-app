import {
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { cartOutline } from "ionicons/icons";
import React from "react";
import { useCartTotal } from "../tools/hooks";

const Layout: React.FC<{ pageName: string }> = ({ pageName, children }) => {
  const cartTotal = useCartTotal();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{pageName}</IonTitle>
          {cartTotal > 0 && (
            <IonTitle slot="end">
              <h1>
                <IonIcon icon={cartOutline} style={{ margin: "0 0.5rem" }} />
                {cartTotal.toFixed(2)} €
              </h1>
            </IonTitle>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{pageName}</IonTitle>
            <IonTitle slot="end">
              <h1>
                <IonIcon icon={cartOutline} style={{ margin: "0 0.5rem" }} />
                {cartTotal.toFixed(2)} €
              </h1>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        {children}
      </IonContent>
    </IonPage>
  );
};

export default Layout;
