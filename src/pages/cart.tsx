import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
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
import React from "react";
import Layout from "../components/Layout";
import {
  cartItemDecrement,
  cartItemIncrement,
  cartItemTrash,
  useAppSelector,
} from "../tools/store";
import { CartItemData } from "../types";
import "./menu.css";

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

export const Cart: React.FC = () => {
  const cartData = useAppSelector((state) => state.cart);

  return (
    <Layout pageName="Carrello">
      <IonList>
        {Object.values(cartData).map((item) => (
          <CartItem item={item} />
        ))}
      </IonList>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton>
          <IonIcon icon={sendOutline} />
        </IonFabButton>
      </IonFab>
    </Layout>
  );
};
