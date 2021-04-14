import firebase from "firebase";
import { Address, MenuCategoryData, Order, OrderDraft, User } from "../types";
import { updateMenu, updateZipCodes } from "./store";

const firebaseConfig = {
  apiKey: "AIzaSyBR3dh8ok7mxd4gqBIh4dw9BBYlUME7xBw",
  authDomain: "jing-sushi-app2.firebaseapp.com",
  projectId: "jing-sushi-app2",
  storageBucket: "jing-sushi-app2.appspot.com",
  messagingSenderId: "1049840345964",
  appId: "1:1049840345964:web:450c9f3746912dc70d4949",
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

export const auth = firebase.auth();

// login persisted when app is closed, until explicit signout
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
auth.languageCode = "it";

export const fetchMenu = async () => {
  const data = await firestore.collection("menu").get();

  const menuData = data.docs.map((doc) => doc.data()) as MenuCategoryData[];
  console.info("Fetched %s categories from firestore menu.", menuData.length);
  updateMenu(menuData);
};

export const fetchZipCodes = async () => {
  const data = await firestore.collection("zipCodes").get();

  const zipsData = data.docs.reduce((acc, doc) => {
    const item = doc.data() as { zip: string; minOrder: number };
    return { ...acc, [item.zip]: item.minOrder };
  }, {});
  console.info(
    "Fetched %s zip codes from firestore.",
    Object.keys(zipsData).length
  );
  updateZipCodes(zipsData);
};

export const getUserAddress = async (
  user: firebase.User
): Promise<Address | null> => {
  const item = await firestore.collection("users").doc(user.uid).get();

  if (item.exists) {
    console.info("Got user address.");
    const data = item.data() as User;
    return data.address;
  }

  console.info("No address found for this user.");
  return null;
};

export const setUserAddress = async (user: firebase.User, address: Address) => {
  await firestore.collection("users").doc(user.uid).set({ address });
  console.info("Successfully created new address.");
};

export const putOrder = async (orderDraft: OrderDraft) => {
  const order: Order = { ...orderDraft, creationTime: new Date() };

  await firestore.collection("orders").doc().set(order);
  console.info("Successfully created new order.");
};
