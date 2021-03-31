import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  addOutline,
  removeOutline,
  sendOutline,
  trashOutline,
} from "ionicons/icons";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { useCartTotal } from "../tools/hooks";
import {
  cartItemDecrement,
  cartItemIncrement,
  cartItemTrash,
  useAppSelector,
} from "../tools/store";
import { CartItemData } from "../types";
import "./cart.css";

export const Cart: React.FC = () => {
  const cartData = useAppSelector((state) => state.cart);
  const [showOrderModal, setShowOrderModal] = useState(false);

  return (
    <Layout pageName="Carrello">
      <IonList>
        {Object.values(cartData).map((item) => (
          <CartItem item={item} />
        ))}
        <IonItemDivider />
        <IonItem lines="none">
          <h2>Sconti e offerte</h2>
        </IonItem>
        <IonItem>
          <ul className="cart-bottom-ad">
            <li>Ritiro: sconto del 10% per oridini maggiori di 20€</li>
            <li>
              Consegna: sconto del 10% per oridini maggiori di 50€ (esclusi cap
              00124, 00127)
            </li>
            <li>Una birra in omaggio per oridini superiori a 30€</li>
          </ul>
        </IonItem>
      </IonList>
      <IonFab
        vertical="bottom"
        horizontal="start"
        slot="fixed"
        onClick={() => setShowOrderModal(true)}
      >
        <IonFabButton>
          <IonIcon icon={sendOutline} />
        </IonFabButton>
      </IonFab>
      <OrderModal isOpen={showOrderModal} setIsOpen={setShowOrderModal} />
    </Layout>
  );
};

const CartItem: React.FC<{ item: CartItemData }> = ({ item }) => {
  const quantity = useAppSelector(
    (state) => state.cart[item.code]?.quantity ?? 0
  );

  return (
    <IonItem key={item.code}>
      <IonAvatar slot="start" style={{ marginRight: "10px" }}>
        <img
          src="https://i0.wp.com/www.candidafood.com/wp-content/uploads/2009/11/foods-to-eat-candida.jpg?resize=180%2C180"
          alt="null"
        />
      </IonAvatar>

      <IonNote className="menu-item-text">
        <h4>{item.name}</h4>
        <p>{item.description}</p>
      </IonNote>

      <IonLabel slot="end" style={{ paddingRight: "1rem", marginRight: 0 }}>
        <div style={{ display: "flex" }}>
          <h2 style={{ margin: "auto" }}>{item.price.toFixed(2)} €</h2>
          <IonButton onClick={() => cartItemTrash(item)}>
            <IonIcon icon={trashOutline} />
          </IonButton>
        </div>
        <IonButtons
          slot="secondary"
          style={{ justifyContent: "center", paddingTop: "1.5rem" }}
        >
          <IonButton onClick={() => cartItemDecrement(item)}>
            <IonIcon slot="icon-only" icon={removeOutline} />
          </IonButton>
          <h2>{quantity}</h2>
          <IonButton onClick={() => cartItemIncrement(item)}>
            <IonIcon slot="icon-only" icon={addOutline} />
          </IonButton>
        </IonButtons>
      </IonLabel>
    </IonItem>
  );
};

const OrderModal: React.FC<{
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
  const orderTotal = useCartTotal();

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ordine</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsOpen(false)}>Chiudi</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem lines="none">
            <IonLabel>
              <h1>Totale</h1>
            </IonLabel>
            <IonLabel>{orderTotal.toFixed(2)} €</IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>Modalità di pagamento</IonLabel>
          </IonItem>
          <IonItem>
            <IonSegment>
              <IonSegmentButton>Contanti</IonSegmentButton>
              <IonSegmentButton>Pos</IonSegmentButton>
            </IonSegment>
          </IonItem>
          <IonItemDivider />
          <IonItem lines="none">
            <IonLabel>
              <h1>Ritiro / Consegna</h1>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonSegment>
              <IonSegmentButton>Consegna</IonSegmentButton>
              <IonSegmentButton>Ritiro</IonSegmentButton>
            </IonSegment>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>Orario di consegna</IonLabel>
            <IonDatetime
              displayFormat="HH:mm"
              value={new Date().toString()}
              onIonChange={(e) => console.log(e.detail.value!)}
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <p>
              Ci riserviamo un mergine di tolleranza di +/- 10 minuti
              sull'orario di consegna/ritiro.
            </p>
          </IonItem>
          <IonItemDivider />
          <IonItem lines="none">
            <IonLabel>
              <h2>Note, Resti, Allergie</h2>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonTextarea
              rows={6}
              cols={20}
              placeholder="Scrivi qui..."
              value=""
              onIonChange={(e) => console.log(e.detail.value!)}
            ></IonTextarea>
          </IonItem>
          <IonButton expand="block" style={{ padding: "0 1rem" }}>
            Invia Ordine
          </IonButton>
        </IonList>
      </IonContent>
    </IonModal>
  );
};
