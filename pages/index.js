// GÜNCEL TASARIM: Kategoriye Göre Ürün Yerleşimi (Sebze & Meyve)

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "../public/logo.png";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxf_pzt3WCqC6JcEgaWVJNwjiVM5mMpVc",
  authDomain: "fresh-markt-app.firebaseapp.com",
  projectId: "fresh-markt-app",
  storageBucket: "fresh-markt-app.appspot.com",
  messagingSenderId: "1042629550855",
  appId: "1:1042629550855:web:d6ad974cadc0bb0b7b5ba2"
};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const sebzeler = [
  { ad: "Maydanoz", birim: "adet", resim: "/urunler/maydanoz.jpg" },
  { ad: "Dereotu", birim: "adet", resim: "/urunler/dereotu.jpg" },
  { ad: "Marul", birim: "adet", resim: "/urunler/marul.jpg" },
  { ad: "Nane", birim: "adet", resim: "/urunler/nane.jpg" },
  { ad: "Roka", birim: "adet", resim: "/urunler/roka.jpg" },
  { ad: "Patates", birim: "kg", resim: "/urunler/patates.jpg" },
  { ad: "Soğan", birim: "kg", resim: "/urunler/sogan.jpg" },
  { ad: "Biber", birim: "kg", resim: "/urunler/biber.jpg" },
  { ad: "Salatalık", birim: "kg", resim: "/urunler/salatalik.jpg" }
];

const meyveler = [
  { ad: "Yerli Muz", birim: "kg", resim: "/urunler/yerli-muz.jpg" },
  { ad: "İthal Muz", birim: "kg", resim: "/urunler/ithal-muz.jpg" },
  { ad: "Portakal", birim: "kg", resim: "/urunler/portakal.jpg" },
  { ad: "Greyfurt", birim: "kg", resim: "/urunler/greyfurt.jpg" },
  { ad: "Elma", birim: "kg", resim: "/urunler/elma.jpg" },
  { ad: "Kivi", birim: "kg", resim: "/urunler/kivi.jpg" },
  { ad: "Mandalina", birim: "kg", resim: "/urunler/mandalina.jpg" }
];

// ... (kalan kodlar aynı şekilde devam eder)
