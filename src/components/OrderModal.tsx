import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useReducer, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AddressEditor from "../components/AddressEditor";
import { auth, putOrder } from "../tools/firestore";
import { useCartTotal } from "../tools/hooks";
import { emptyCart, useAppSelector } from "../tools/store";
import {
  Address,
  OrderDraft,
  OrderStatus,
  OrderType,
  PaymentType,
  WeekOpeningTimes,
} from "../types";
import "../pages/cart.css";

const OrderModal: React.FC<{
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
  // order data
  const [user] = useAuthState(auth);
  const currentAddress = useAppSelector((state) => state.address);

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
    userId: user?.uid ?? "",
  });

  // updates external to this component
  useEffect(() => {
    dispatchOrderData({ type: "plates", value: Object.values(cartData) });
  }, [cartData]);
  useEffect(() => {
    if (user) dispatchOrderData({ type: "userId", value: user.uid });
  }, [user]);

  // order state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);

  const [canSendOrder, setCanSendOrder] = useState(true);
  const sendOrder = async () => {
    try {
      if (!user) throw Error("User is not logged in.");

      setCanSendOrder(false);

      await putOrder(orderData);

      // UI feedback
      setShowSuccessToast(true);

      // resetting order data
      emptyCart();
      dispatchOrderData({ type: "notes", value: "" });

      // resetting UI
      setCanSendOrder(true);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      // UI feedback
      setShowFailureToast(true);

      // prevent user from spamming the send button
      setTimeout(() => setCanSendOrder(true), 2000);
    }
  };

  // date refresh
  const [editedDeliveryTime, setEditedDeliveryTime] = useState<boolean>(false);
  const [openRange, setOpenRange] = useState<{
    minTime?: Date;
    maxTime?: Date;
  }>({});
  const openingTimes = useAppSelector((state) => state.info?.openingTimes);

  useEffect(() => {
    if (openingTimes) {
      const { minTime, maxTime } = getOpeningTime(openingTimes);
      setOpenRange({ minTime, maxTime });
    }
  }, [openingTimes]);

  useEffect(() => {
    if (!editedDeliveryTime) {
      dispatchOrderData({
        type: "deliveryTime",
        value: suggestDeliveryTime(openRange.minTime, openRange.maxTime),
      });
    }
  }, [editedDeliveryTime, openRange]);

  // zip code validation
  const zipCodes = useAppSelector((state) => state.zipCodes);
  const [zipOk, setZipOk] = useState<boolean>(false);
  const [minOrderOk, setMinOrderOk] = useState<boolean>(false);

  useEffect(() => {
    const orderZip = orderData.deliveryAddress?.zip;

    setZipOk(!!zipCodes && !!orderZip && zipCodes[orderZip] !== undefined);
    setMinOrderOk(zipOk && zipCodes![orderZip!] <= orderTotal);
  }, [zipOk, zipCodes, orderTotal, orderData.deliveryAddress, minOrderOk]);

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
              cancelText="Annulla"
              doneText="Ok"
              value={orderData.deliveryTime.toString()}
              min={localISOString(openRange.minTime)}
              max={localISOString(openRange.maxTime)}
              onIonChange={(e) => {
                setEditedDeliveryTime(true);
                dispatchOrderData({
                  type: "deliveryTime",
                  value: new Date(e.detail.value!),
                });
              }}
            ></IonDatetime>
          </IonItem>
          {orderData.type === OrderType.Delivery && (
            <AddressEditor
              currentAddress={currentAddress}
              canConfirm={true}
              onConfirm={(addr: Address) => {
                dispatchOrderData({ type: "deliveryAddress", value: addr });
              }}
              liveEdit={true}
              toggleLabel="Usa un altro indirizzo per questo ordine"
            />
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
          {orderData.type === OrderType.Delivery && !minOrderOk && (
            <IonItem>
              <p style={{ color: "#ff0000" }}>
                {zipOk
                  ? `L'ordine minimo per questo CAP è ${
                      zipCodes![orderData.deliveryAddress?.zip!]
                    } €`
                  : "Siamo spiacenti. Non consegnamo in questo CAP."}
              </p>
            </IonItem>
          )}
          <IonButton
            expand="block"
            style={{ padding: "0 1rem" }}
            disabled={
              !canSendOrder ||
              (orderData.type === OrderType.Delivery && (!zipOk || !minOrderOk))
            }
            onClick={sendOrder}
          >
            Invia Ordine
          </IonButton>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default OrderModal;

/**
 * Returns strigified date with time zone offset.
 */
const localISOString = (date: Date | undefined) => {
  if (date === undefined) return undefined;

  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(date.getTime() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return localISOTime;
};

/**
 * Converts hh:mm format stored on db to two Date objects for the current lunch/dinner period.
 */
const getOpeningTime = (openingTimes: WeekOpeningTimes) => {
  const now = new Date();

  const currentWeekDay = now.getDay() as keyof WeekOpeningTimes;
  const currentOpeningData = openingTimes[currentWeekDay];

  const lunchEnd = new Date();
  lunchEnd.setHours(currentOpeningData.lunch.to.hour);
  lunchEnd.setMinutes(currentOpeningData.lunch.to.minute);

  const lunchIsOver = lunchEnd <= now;

  const minTime = new Date();
  const maxTime = new Date();
  const phase = lunchIsOver ? "dinner" : "lunch";

  minTime.setHours(currentOpeningData[phase].from.hour);
  minTime.setMinutes(currentOpeningData[phase].from.minute);
  maxTime.setHours(currentOpeningData[phase].to.hour);
  maxTime.setMinutes(currentOpeningData[phase].to.minute);

  return { minTime, maxTime };
};

/**
 * Used to display the default delivery time suggested to the user: which is now + 30 minutes.
 */
const suggestDeliveryTime = (min: Date | undefined, max: Date | undefined) => {
  const now = new Date();
  if (!min || !max) return now;

  const bottom = Math.max(min.getTime(), now.getTime());
  const clipped = Math.min(bottom + 60000 * 30, max.getTime());
  return new Date(clipped);
};

const orderDraftReducer = <K extends keyof OrderDraft>(
  state: OrderDraft,
  action: { type: K; value: OrderDraft[K] }
) => {
  return { ...state, [action.type]: action.value };
};
