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
  IonImg,
  IonInput,
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
  IonToast,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import {
  addOutline,
  removeOutline,
  sendOutline,
  trashOutline,
} from "ionicons/icons";
import React, { useEffect, useReducer, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import defaultImage from "../assets/menu-default.jpg";
import Layout from "../components/Layout";
import { auth, putOrder } from "../tools/firestore";
import { useCartTotal } from "../tools/hooks";
import {
  cartItemDecrement,
  cartItemIncrement,
  cartItemTrash,
  emptyCart,
  useAppSelector,
} from "../tools/store";
import {
  CartItemData,
  OrderDraft,
  OrderStatus,
  OrderType,
  PaymentType,
} from "../types";
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
            <li>Ritiro: sconto del 10% per ordini maggiori di 20€</li>
            <li>
              Consegna: sconto del 10% per ordini maggiori di 50€ (esclusi cap
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

const orderDraftReducer = <K extends keyof OrderDraft>(
  state: OrderDraft,
  action: { type: K; value: OrderDraft[K] }
) => {
  return { ...state, [action.type]: action.value };
};

const OrderModal: React.FC<{
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
  // order data
  const [user] = useAuthState(auth);

  const cartData = useAppSelector((state) => state.cart);
  const userAddress = useAppSelector((state) => state.address);
  const orderTotal = useCartTotal();

  const [orderData, dispatchOrderData] = useReducer(orderDraftReducer, {
    type: OrderType.Delivery,
    paymentType: PaymentType.Cash,
    status: OrderStatus.Pending,
    notes: "",
    deliveryAddress: userAddress,
    plates: Object.values(cartData),
    deliveryTime: new Date(),
    userId: user!.uid,
  });
  useEffect(() => {
    dispatchOrderData({ type: "plates", value: Object.values(cartData) });
  }, [cartData]);

  // UI state
  const [editAddress, setEditAddress] = useState(false);
  const toggleAddress = () => setEditAddress(!editAddress);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);

  const [canSendOrder, setCanSendOrder] = useState(true);
  const sendOrder = async () => {
    try {
      setCanSendOrder(false);

      await putOrder(orderData);

      // UI feedback
      setShowSuccessToast(true);

      // resetting order data
      emptyCart();
      dispatchOrderData({ type: "notes", value: "" });

      // resetting UI
      setCanSendOrder(true);
      setEditAddress(false);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      // UI feedback
      setShowFailureToast(true);

      // prevent user from spamming the send button
      setTimeout(() => setCanSendOrder(true), 2000);
    }
  };

  return (
    <IonModal isOpen={isOpen}>
      <IonToast
        isOpen={showFailureToast}
        onDidDismiss={() => setShowFailureToast(false)}
        message="Si è verificato un errore nell'invio dell'ordine."
        color="danger"
        position="top"
        duration={1000}
      />
      <IonToast
        isOpen={showSuccessToast}
        onDidDismiss={() => setShowSuccessToast(false)}
        message="Ordine inviato con successo."
        color="primary"
        position="top"
        duration={1000}
      />

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
            <IonSegment
              value={orderData.paymentType}
              onIonChange={(e) =>
                dispatchOrderData({
                  type: "paymentType",
                  value: e.detail.value as PaymentType,
                })
              }
            >
              <IonSegmentButton value={PaymentType.Cash}>
                Contanti
              </IonSegmentButton>
              <IonSegmentButton value={PaymentType.Pos}>Pos</IonSegmentButton>
            </IonSegment>
          </IonItem>
          <IonItemDivider />
          <IonItem lines="none">
            <IonLabel>
              <h1>Ritiro / Consegna</h1>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonSegment
              value={orderData.type}
              onIonChange={(e) => {
                const value = e.detail.value as OrderType;
                dispatchOrderData({
                  type: "type",
                  value,
                });
                dispatchOrderData({
                  type: "deliveryAddress",
                  value: value === OrderType.Delivery ? userAddress : null,
                });
              }}
            >
              <IonSegmentButton value={OrderType.Delivery}>
                Consegna
              </IonSegmentButton>
              <IonSegmentButton value={OrderType.Pickup}>
                Ritiro
              </IonSegmentButton>
            </IonSegment>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>
              Orario di{" "}
              {orderData.type === OrderType.Delivery ? "consegna" : "ritiro"}*
            </IonLabel>
            <IonDatetime
              displayFormat="HH:mm"
              value={orderData.deliveryTime.toString()}
              onIonChange={(e) =>
                dispatchOrderData({
                  type: "deliveryTime",
                  value: new Date(e.detail.value!),
                })
              }
            ></IonDatetime>
          </IonItem>
          {orderData.type === OrderType.Delivery && (
            <>
              <IonItem lines="none">
                <IonLabel position="stacked">Indirizzo di consegna</IonLabel>
                <IonInput
                  value={orderData.deliveryAddress?.address}
                  placeholder="Nuovo indirizzo..."
                  onIonChange={(e) =>
                    dispatchOrderData({
                      type: "deliveryAddress",
                      value: e.detail.value!,
                    })
                  }
                  disabled={!editAddress}
                ></IonInput>
              </IonItem>
              <IonItem lines="none">
                <IonItem>
                  <IonLabel style={{ whiteSpace: "break-spaces" }}>
                    Usa un altro indirizzo per questo ordine
                  </IonLabel>
                  <IonToggle
                    checked={editAddress}
                    onIonChange={(e) => {
                      dispatchOrderData({
                        type: "deliveryAddress",
                        value: e.detail.checked ? "" : userAddress!,
                      });
                      toggleAddress();
                    }}
                    color="primary"
                  />
                </IonItem>
              </IonItem>
            </>
          )}
          <IonItem>
            <p>
              *Ci riserviamo un margine di tolleranza di +/- 10 minuti
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
              value={orderData.notes}
              onIonChange={(e) =>
                dispatchOrderData({
                  type: "notes",
                  value: e.detail.value!,
                })
              }
            ></IonTextarea>
          </IonItem>
          <IonButton
            expand="block"
            style={{ padding: "0 1rem" }}
            disabled={Object.keys(cartData).length === 0 || !canSendOrder}
            onClick={sendOrder}
          >
            Invia Ordine
          </IonButton>
        </IonList>
      </IonContent>
    </IonModal>
  );
};
