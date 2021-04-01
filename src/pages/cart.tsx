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
  IonToggle,
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
  const cartData = useAppSelector((state) => state.cart);
  const orderTotal = useCartTotal();

  const [orderData, setOrderData] = useState<OrderDraft>({
    type: OrderType.Delivery,
    paymentType: PaymentType.Cash,
    status: OrderStatus.Pending,
    notes: "",
    deliveryAddress: "Indirizzo di prova, 00126, Roma",
    plates: Object.values(cartData),
    deliveryTime: new Date(),
    userId: "",
  });

  const [editAddress, setEditAddress] = useState(false);
  const toggleAddress = () => setEditAddress(!editAddress);

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
            <IonSegment
              value={orderData.paymentType}
              onIonChange={(e) =>
                setOrderData({
                  ...orderData,
                  paymentType: e.detail.value as PaymentType,
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
              onIonChange={(e) =>
                setOrderData({
                  ...orderData,
                  type: e.detail.value as OrderType,
                })
              }
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
              {orderData.type === OrderType.Delivery ? "consegna" : "ritiro"}
            </IonLabel>
            <IonDatetime
              displayFormat="HH:mm"
              value={orderData.deliveryTime.toString()}
              onIonChange={(e) =>
                setOrderData({
                  ...orderData,
                  deliveryTime: new Date(e.detail.value!),
                })
              }
            ></IonDatetime>
          </IonItem>
          {orderData.type === OrderType.Delivery ? (
            <>
              <IonItem lines="none">
                <IonLabel position="stacked">Indirizzo di consegna</IonLabel>
                <IonInput
                  value={orderData.deliveryAddress}
                  onIonChange={(e) =>
                    setOrderData({
                      ...orderData,
                      deliveryAddress: e.detail.value!,
                    })
                  }
                  disabled={!editAddress}
                ></IonInput>
              </IonItem>
              <IonItem lines="none">
                <IonItem>
                  <IonLabel>Modifica indirizzo</IonLabel>
                  <IonToggle
                    checked={editAddress}
                    onIonChange={toggleAddress}
                    color="primary"
                  />
                </IonItem>
              </IonItem>
            </>
          ) : (
            <></>
          )}
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
              onIonChange={(e) =>
                setOrderData({ ...orderData, notes: e.detail.value! })
              }
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
