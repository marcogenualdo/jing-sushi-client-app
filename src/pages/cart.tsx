import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonFab,
  IonFabButton,
  IonIcon,
  IonImg,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonNote,
} from "@ionic/react";
import {
  addOutline,
  removeOutline,
  sendOutline,
  trashOutline,
} from "ionicons/icons";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import defaultImage from "../assets/menu-default.jpg";
import Layout from "../components/Layout";
import OrderModal from "../components/OrderModal";
import { auth } from "../tools/firestore";
import {
  cartItemDecrement,
  cartItemIncrement,
  cartItemTrash,
  useAppSelector,
} from "../tools/store";
import { CartItemData } from "../types";
import "./cart.css";

export const Cart: React.FC = () => {
  const [user] = useAuthState(auth);
  const cartData = useAppSelector((state) => state.cart);
  const [showOrderModal, setShowOrderModal] = useState(false);

  return (
    <Layout pageName="Carrello">
      <IonList>
        {Object.values(cartData).map((item) => (
          <CartItem item={item} key={item.code} />
        ))}
        <IonItemDivider />
        <IonItem lines="none">
          <h2>Sconti e offerte</h2>
        </IonItem>
        <IonItem>
          <ul className="cart-bottom-ad">
            <li>Ritiro: sconto del 10% per ordini maggiori di 20€</li>
            <li>
              Consegna: sconto del 10% per ordini maggiori di 50€ (esclusi cap
              00124, 00127)
            </li>
            <li>Una birra in omaggio per oridini superiori a 30€</li>
          </ul>
        </IonItem>
        {!user && (
          <IonLabel color="danger" style={{ padding: "2rem" }}>
            Registrati per effetturare un ordine.
          </IonLabel>
        )}
      </IonList>
      {user && (
        <IonFab
          vertical="bottom"
          horizontal="start"
          slot="fixed"
          onClick={() => setShowOrderModal(true)}
        >
          <IonFabButton className="cart-fab">
            <span>ORDINA</span> <IonIcon icon={sendOutline} />
          </IonFabButton>
        </IonFab>
      )}
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
        <IonImg src={defaultImage} alt="null" />
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
