import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import React, { useEffect, useReducer, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import DetailLayout from "../components/DetailLayout";
import { updateReviews, useAppSelector } from "../store/store";
import { auth, listReviews, putReview } from "../tools/firestore";
import { Review } from "../types";
import "./reviews.css";

/**
 * Redux objects must be immutable so dates are encoded as strings in the store.
 */
const deserializeReviewTime = (orders: Review[]) =>
  orders.map((item) => {
    return {
      ...item,
      creationTime: new Date(item.creationTime),
    };
  });

export const UserReviews: React.FC = () => {
  const [user] = useAuthState(auth);
  const userReviews = useAppSelector(
    (state) => state.reviews && deserializeReviewTime(state.reviews)
  );
  useEffect(() => {
    if (user) {
      listReviews(user.uid).then((res) => updateReviews(res));
    }
  }, [user]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>Le mie recensioni</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>
          {userReviews &&
            userReviews.map((item, index) => {
              return (
                <IonItem key={index}>
                  <IonNote>
                    <h4 className="review-title">{item.title}</h4>
                    <span className="review-name">{item.name}</span> -{" "}
                    <span>{item.creationTime.toLocaleDateString()}</span>
                    <p>{item.text}</p>
                  </IonNote>
                  <IonNote slot="end" className="review-rating">
                    <StarScore score={item.score} />
                  </IonNote>
                </IonItem>
              );
            })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

const rangeTo = (n: number) => Array.from(Array(n).keys());

const StarScore: React.FC<{ score: number }> = ({ score }) => {
  const clippedScore = Math.min(score, 5);
  const till5 = 5 - clippedScore;

  return (
    <div className="review-rating">
      {rangeTo(clippedScore).map((n) => (
        <IonIcon icon={star} key={n} />
      ))}
      {rangeTo(till5).map((n) => (
        <IonIcon icon={starOutline} key={n + 1} />
      ))}
    </div>
  );
};

const EditableStarScore: React.FC<{
  score: number;
  setScore: (score: number) => void;
}> = ({ score, setScore }) => {
  const clippedScore = Math.min(score, 5);
  const till5 = 5 - clippedScore;

  return (
    <div className="review-rating">
      {rangeTo(clippedScore).map((n) => (
        <IonIcon icon={star} onClick={() => setScore(n + 1)} key={n} />
      ))}
      {rangeTo(till5).map((n) => (
        <IonIcon
          icon={starOutline}
          onClick={() => setScore(clippedScore + n + 1)}
          key={clippedScore + n + 1}
        />
      ))}
    </div>
  );
};

export const CreateReview: React.FC = () => {
  const [user] = useAuthState(auth);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);

  const [reviewData, dispatchReviewData] = useReducer(reviewReducer, {
    creationTime: new Date(),
    userId: user?.uid ?? "",
    name: "",
    score: 0,
    title: "",
    text: "",
  });
  useEffect(() => {
    if (user) dispatchReviewData({ type: "userId", value: user.uid });
  }, [user]);

  const setScore = (score: number) =>
    dispatchReviewData({ type: "score", value: score });

  const sendReview = () => {
    try {
      putReview(reviewData);
      setShowSuccessToast(true);
    } catch (err) {
      console.error(err);
      setShowFailureToast(true);
    }
  };

  return (
    <DetailLayout pageName="Nuova recensione" backTo="/profile">
      <IonToast
        isOpen={showFailureToast}
        onDidDismiss={() => setShowFailureToast(false)}
        message="Si è verificato un errore nell'invio della recensione."
        color="danger"
        position="top"
        duration={1000}
      />
      <IonToast
        isOpen={showSuccessToast}
        onDidDismiss={() => setShowSuccessToast(false)}
        message="Recensione inviata con successo."
        color="primary"
        position="top"
        duration={1000}
      />
      <IonList>
        <IonItem lines="none">
          <IonLabel position="stacked">Nome</IonLabel>
          <IonInput
            value={reviewData.name}
            placeholder="Nome..."
            onIonChange={(e) => {
              dispatchReviewData({
                type: "name",
                value: e.detail.value!,
              });
            }}
          />
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Punteggio</IonLabel>
          <EditableStarScore score={reviewData.score} setScore={setScore} />
        </IonItem>
        <IonItemDivider />
        <IonItem lines="none">
          <IonLabel position="stacked">Titolo</IonLabel>
          <IonInput
            value={reviewData.title}
            placeholder="Titolo..."
            onIonChange={(e) => {
              dispatchReviewData({
                type: "title",
                value: e.detail.value!,
              });
            }}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Testo</IonLabel>
          <IonTextarea
            rows={6}
            cols={20}
            placeholder="Testo..."
            value={reviewData.text}
            onIonChange={(e) =>
              dispatchReviewData({
                type: "text",
                value: e.detail.value!,
              })
            }
          ></IonTextarea>
        </IonItem>
        <IonButton
          expand="block"
          style={{ padding: "0 1rem" }}
          onClick={sendReview}
        >
          Invia
        </IonButton>
      </IonList>
    </DetailLayout>
  );
};

const reviewReducer = <K extends keyof Review>(
  state: Review,
  action: { type: K; value: Review[K] }
) => {
  return { ...state, [action.type]: action.value };
};
