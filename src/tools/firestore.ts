import firebase from "firebase";
import { Address, MenuCategoryData, Order, OrderDraft, User } from "../types";
import { updateMenu } from "./store";

const firebaseConfig = {
  apiKey: "AIzaSyBR3dh8ok7mxd4gqBIh4dw9BBYlUME7xBw",
  authDomain: "jing-sushi-app2.firebaseapp.com",
  projectId: "jing-sushi-app2",
  storageBucket: "jing-sushi-app2.appspot.com",
  messagingSenderId: "1049840345964",
  appId: "1:1049840345964:web:450c9f3746912dc70d4949",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

// login persisted when app is closed, until explicit signout
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
auth.languageCode = "it";

export const fetchMenu = async () => {
  const firestore = firebase.firestore();
  const data = await firestore.collection("menu").get();

  const menuData = data.docs.map((doc) => doc.data()) as MenuCategoryData[];
  console.info("Fetched %s categories from firestore menu.", menuData.length);
  updateMenu(menuData);
};

export const getUserAddress = async (
  user: firebase.User
): Promise<Address | null> => {
  const firestore = firebase.firestore();
  const item = await firestore.collection("addresses").doc(user.uid).get();

  if (item.exists) {
    console.info("Got user address.");
    const data = item.data() as User;
    return data.address;
  }

  console.info("No address found for this user.");
  return null;
};

export const setUserAddress = async (user: firebase.User, address: Address) => {
  const firestore = firebase.firestore();
  await firestore.collection("addresses").doc(user.uid).set({ address });
  console.log("Successfully created new address.");
};

export const putOrder = async (orderDraft: OrderDraft) => {
  const order: Order = { ...orderDraft, creationTime: new Date() };

  const firestore = firebase.firestore();
  await firestore.collection("orders").doc().set(order);
  console.log("Successfully created new order.");
};
