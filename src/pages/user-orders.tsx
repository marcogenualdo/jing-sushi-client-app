import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { RouteComponentProps } from "react-router";
import ListStopper from "../components/ListStopper";
import { updateUserOrders, useAppSelector } from "../store/store";
import { auth, listMyOrders } from "../tools/firestore";
import { CartItemData, Order, OrderStatus } from "../types";
import "./user-orders.css";
import defaultImage from "../assets/menu-default.jpg";

const UserOrders: React.FC = () => {
  const [user] = useAuthState(auth);
  const userOrders = useAppSelector((state) => state.userOrders);

  useEffect(() => {
    if (user) {
      listMyOrders(user.uid).then((res) => updateUserOrders(res));
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
          {userOrders &&
            userOrders.map((order, index) => (
              <OrderItem
                orderData={order}
                orderNum={index}
                key={order.creationTime.getTime()}
              />
            ))}
          <ListStopper />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UserOrders;

const orderStatusChip: Record<OrderStatus, { color: string; label: string }> = {
  PENDING: { color: "warning", label: "In Consegna" },
  ABORTED: { color: "danger", label: "Annullato" },
  COMPLETED: { color: "success", label: "Completato" },
};

const OrderItem: React.FC<{ orderData: Order; orderNum: number }> = ({
  orderData,
  orderNum,
}) => {
  return (
    <IonItem detail routerLink={`/profile/userOrders/${orderNum}`}>
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

interface OrderDetailProps
  extends RouteComponentProps<{
    orderNum: string;
  }> {}

export const OrderDetail: React.FC<OrderDetailProps> = ({ match }) => {
  const orderNum = match.params.orderNum;
  const orders = useAppSelector((state) => state.userOrders);
  const orderData = orders && orders[Number(orderNum)];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>Ordine {orderData?.creationTime.toLocaleString()}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {orderData && (
          <IonList>
            {orderData.plates.map((dish) => (
              <DishItem dishData={dish} key={dish.code} />
            ))}
            <IonItem>
              <IonLabel slot="start">Totale</IonLabel>
              <IonLabel slot="end">
                {orderTotal(orderData).toFixed(2)} €
              </IonLabel>
            </IonItem>
            <ListStopper />
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

const DishItem: React.FC<{ dishData: CartItemData }> = ({ dishData }) => {
  return (
    <IonItem key={dishData.code}>
      <IonAvatar slot="start" style={{ marginRight: "10px" }}>
        <IonImg src={defaultImage} alt="null" />
      </IonAvatar>

      <IonNote className="menu-dishData-text">
        <h4>{dishData.name}</h4>
        <p>{dishData.description}</p>
      </IonNote>
      <IonLabel slot="end" style={{ fontSize: "1.4rem" }}>
        {dishData.quantity}
      </IonLabel>
    </IonItem>
  );
};
