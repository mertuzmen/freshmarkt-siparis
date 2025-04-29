""// GÜNCEL TASARIM: Getir Benzeri Arayüz ile FreshMarkt Sipariş Sayfası

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
  { ad: "Yerli Muz", miktar: "750 g", resim: "/urunler/yerli-muz.png" },
  { ad: "İthal Muz Paket", miktar: "650 g", resim: "/urunler/ithal-muz.png" },
  { ad: "Yaban Mersini Paket", miktar: "125 g", resim: "/urunler/yabanmersini.png" },
  { ad: "Portakal", miktar: "1 kg", resim: "/urunler/portakal.png" },
  { ad: "Greyfurt", miktar: "1 kg", resim: "/urunler/greyfurt.png" },
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
      <div className="min-h-screen bg-gradient-to-b from-[#d1f2eb] to-[#a3e4d7] text-white flex flex-col items-center justify-center p-4">
        <div className="mb-6 text-center">
          <Image src={Logo} alt="Logo" width={100} height={100} className="mx-auto rounded-full" />
          <h1 className="text-3xl font-extrabold text-green-900 mt-4">FreshMarkt</h1>
        </div>
        <Card className="w-full max-w-sm text-black shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <Input placeholder="Firma Adı" value={firma} onChange={(e) => setFirma(e.target.value)} />
              <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="flex gap-2">
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
    <div className="min-h-screen bg-[#f4f6f6] p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Merhaba, {user.displayName}</h1>
        <div className="relative">
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{sepet.length}</span>
          <button className="text-2xl">🛒</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {urunler.map((urun, i) => (
          <div key={i} className="bg-white shadow rounded-xl p-4 text-center hover:shadow-lg transition-all">
            <Image src={urun.resim} alt={urun.ad} width={120} height={120} className="mx-auto mb-2 rounded" />
            <p className="font-bold text-sm text-gray-900 mt-1">{urun.ad}</p>
            <p className="text-xs text-gray-500 mb-2">{urun.miktar}</p>
            <button onClick={() => sepeteEkle(urun.ad)} className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1 rounded-full">Sepete Ekle</button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Sepetim</h2>
        {sepet.length === 0 ? (
          <p className="text-gray-500">Sepetiniz boş</p>
        ) : (
          <ul className="space-y-2">
            {sepet.map((item, index) => (
              <li key={index} className="flex justify-between bg-white shadow p-3 rounded-md">
                <span>{item}</span>
                <button onClick={() => sepettenCikar(index)} className="text-red-500 hover:underline">Kaldır</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <Button onClick={cikisYap} className="bg-red-600 hover:bg-red-700 text-white">Çıkış Yap</Button>
      </div>
    </div>
  );
}
