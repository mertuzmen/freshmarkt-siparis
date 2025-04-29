// GÜNCEL TASARIM: Getir Benzeri Kartlar, Ürün Bilgisi (kg/adet), Arka Plan Beyaz + Sepet Sayfası ve Bildirim Hazırlığı

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "../public/logo.png";
import Link from "next/link";
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

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firma, setFirma] = useState("");
  const [siparisler, setSiparisler] = useState([]);
  const [sepet, setSepet] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadSiparisler();
    });
    return () => unsubscribe();
  }, []);

  const kaydol = async () => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: firma });
  };

  const girisYap = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const cikisYap = async () => {
    await signOut(auth);
  };

  const siparisEkle = (urun, miktar, not) => {
    if (!miktar) return;
    setSepet((prev) => [...prev, { ...urun, miktar, not }]);
  };

  const loadSiparisler = async () => {
    const snapshot = await getDocs(collection(db, "siparisler"));
    setSiparisler(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-lime-100 to-lime-200 p-4">
        <Image src={Logo} alt="Logo" width={120} height={120} className="mb-4" />
        <Input placeholder="Firma Adı" value={firma} onChange={(e) => setFirma(e.target.value)} className="mb-2" />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2" />
        <Input placeholder="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />
        <div className="flex gap-2">
          <Button onClick={kaydol} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4">Kaydol</Button>
          <Button onClick={girisYap} className="bg-lime-600 hover:bg-lime-700 text-white font-semibold px-4">Giriş Yap</Button>
        </div>
      </div>
    );
  }

  const UrunKart = ({ urun }) => {
    const [miktar, setMiktar] = useState("");
    const [not, setNot] = useState("");

    return (
      <Card key={urun.ad} className="mb-4 shadow-md border rounded-xl bg-white">
        <CardContent className="text-center p-4">
          <Image src={urun.resim} alt={urun.ad} width={80} height={80} className="mx-auto mb-2" />
          <div className="font-semibold text-base mb-1">{urun.ad}</div>
          <div className="text-sm text-gray-500 mb-2">Birim: {urun.birim}</div>
          <Input placeholder={`Miktar (${urun.birim})`} value={miktar} onChange={(e) => setMiktar(e.target.value)} className="mb-2" />
          <Input placeholder="Not" value={not} onChange={(e) => setNot(e.target.value)} className="mb-2" />
          <Button onClick={() => siparisEkle(urun, miktar, not)} className="bg-lime-500 hover:bg-lime-600 text-white font-medium px-4 py-2 rounded-full">Sepete Ekle</Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <Image src={Logo} alt="FreshMarkt" width={100} height={100} />
        <div className="flex items-center gap-4">
          <Link href="/sepet" className="relative">
            <span className="absolute -top-2 -right-2 bg-lime-600 text-white text-xs px-1 rounded-full">{sepet.length}</span>
            🛒
          </Link>
          <Button onClick={cikisYap} className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-full">Çıkış Yap</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-lime-700 mb-4">Sebzeler</h2>
          {sebzeler.map((urun) => (
            <UrunKart key={urun.ad} urun={urun} />
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold text-yellow-700 mb-4">Meyveler</h2>
          {meyveler.map((urun) => (
            <UrunKart key={urun.ad} urun={urun} />
          ))}
        </div>
      </div>
    </div>
  );
}
