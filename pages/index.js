// YENİ TASARIM: FreshMarkt giriş ekranı kurumsal tasarımı ve gelişmiş sepet yönetimi

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

const urunler = [
  { ad: "Elma", aciklama: "Taze kırmızı elma", birim: "kg", resim: "/urunler/elma.png" },
  { ad: "Domates", aciklama: "Organik domates", birim: "kg", resim: "/urunler/domates.png" },
  { ad: "Muz", aciklama: "İthal muz", birim: "kg", resim: "/urunler/muz.png" },
  { ad: "Salatalık", aciklama: "Seradan taze salatalık", birim: "kg", resim: "/urunler/salatalik.png" },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firma, setFirma] = useState("");
  const [sepet, setSepet] = useState([]);

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

  const cikisYap = async () => {
    await signOut(auth);
    setSepet([]);
  };

  const sepeteEkle = (urun) => {
    setSepet([...sepet, urun]);
  };

  const sepettenCikar = (index) => {
    const yeniSepet = [...sepet];
    yeniSepet.splice(index, 1);
    setSepet(yeniSepet);
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
      <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-500 text-white flex flex-col items-center justify-center p-4">
        <div className="mb-4">
          <Image src={Logo} alt="Logo" width={120} height={120} className="rounded-full shadow-md" />
        </div>
        <Card className="w-full max-w-md text-black">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-center text-green-700">Giriş yap veya kayıt ol</h2>
            <div className="flex flex-col gap-3">
              <Input placeholder="Firma Adı" value={firma} onChange={(e) => setFirma(e.target.value)} />
              <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="flex gap-2 pt-2">
                <Button className="bg-green-500 hover:bg-green-600 text-white w-full" onClick={kaydol}>Kayıt Ol</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full" onClick={girisYap}>Giriş Yap</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hoşgeldin, {user.displayName}</h1>
        <div className="relative">
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{sepet.length}</span>
          <button className="text-lg">🛒</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {urunler.map((urun, i) => (
          <Card key={i} className="shadow-md">
            <CardContent className="p-4">
              <Image src={urun.resim} alt={urun.ad} width={100} height={100} className="mb-2" />
              <h3 className="font-semibold text-lg">{urun.ad}</h3>
              <p className="text-sm text-gray-600">{urun.aciklama}</p>
              <p className="text-sm">Birim: {urun.birim}</p>
              <Button className="mt-2 w-full bg-green-600 text-white" onClick={() => sepeteEkle(urun.ad)}>Sepete Ekle</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Sepetim</h2>
        {sepet.length === 0 ? (
          <p className="text-gray-600">Sepetiniz boş</p>
        ) : (
          <ul className="space-y-2">
            {sepet.map((item, index) => (
              <li key={index} className="flex justify-between bg-gray-100 rounded px-4 py-2">
                <span>{item}</span>
                <button onClick={() => sepettenCikar(index)} className="text-red-600 hover:underline">Kaldır</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <Button onClick={cikisYap} className="bg-red-500 hover:bg-red-600 text-white">Çıkış Yap</Button>
      </div>
    </div>
  );
}
