import {
  IonBackButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ListStopper from "../components/ListStopper";
import { auth, listMyOrders } from "../tools/firestore";
import { Order, OrderStatus } from "../types";
import "./my-orders.css";

const MyOrders: React.FC = () => {
  const [user] = useAuthState(auth);
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      listMyOrders(user.uid).then((res) => setMyOrders(res));
    }
  }, [user]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>I miei ordini</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>
          {myOrders.map((order) => (
            <OrderItem orderData={order} key={order.creationTime.getTime()} />
          ))}
          <ListStopper />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MyOrders;

const orderStatusChip: Record<OrderStatus, { color: string; label: string }> = {
  PENDING: { color: "warning", label: "In Consegna" },
  ABORTED: { color: "danger", label: "Annullato" },
  COMPLETED: { color: "success", label: "Completato" },
};

const OrderItem: React.FC<{ orderData: Order }> = ({ orderData }) => {
  return (
    <IonItem detail>
      <IonNote slot="start" className="order-item-text">
        <strong>{orderData.creationTime.toLocaleString()}</strong>
        <p>{orderTotal(orderData).toFixed(2)} €</p>
      </IonNote>
      <IonChip
        slot="end"
        color={orderStatusChip[orderData.status].color}
        className="order-item-chip"
      >
        {orderStatusChip[orderData.status].label}
      </IonChip>
    </IonItem>
  );
};

const orderTotal = (order: Order) =>
  order.plates.reduce((res, item) => res + item.price, 0);
