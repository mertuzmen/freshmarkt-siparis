// YENİ TASARIM: Getir tarzı karşılama ekranı ve responsive giriş paneli eklendi

import { useState, useEffect, useMemo } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "../public/logo.png";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { format } from "date-fns";

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

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firma, setFirma] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const kaydol = async () => {
    if (email && password && firma) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: firma });
    }
  };

  const girisYap = async () => {
    if (email && password) {
      await signInWithEmailAndPassword(auth, email, password);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-purple-400 text-white relative">
        <div className="flex justify-between p-4">
          <div className="text-3xl font-bold">FreshMarkt</div>
          <div className="flex gap-4">
            <button className="font-medium hover:underline">Giriş Yap</button>
            <button className="font-medium hover:underline">Kayıt Ol</button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center px-4 md:px-0 mt-12">
          <Image src={Logo} alt="Logo" width={120} height={120} className="rounded-full shadow-md mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2 text-center">Dakikalar İçinde Kapında</h1>
          <div className="bg-white text-black p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Giriş yap veya kayıt ol</h2>
            <Input placeholder="Firma Adı" value={firma} onChange={(e) => setFirma(e.target.value)} className="mb-2" />
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2" />
            <Input placeholder="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />
            <div className="flex gap-2">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white w-full" onClick={kaydol}>Kayıt Ol</Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full" onClick={girisYap}>Giriş Yap</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-center text-xl font-semibold">Hoş geldin {user.displayName}</div>
  );
}
