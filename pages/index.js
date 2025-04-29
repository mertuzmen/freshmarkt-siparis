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

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firma, setFirma] = useState("");
  const [siparisler, setSiparisler] = useState([]);
  const [yeniSiparis, setYeniSiparis] = useState("");
  const [miktar, setMiktar] = useState("");
  const [not, setNot] = useState("");

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

  const siparisEkle = async (urun) => {
    const yeni = {
      firma: user.displayName,
      urun: urun.ad,
      miktar,
      birim: urun.birim,
      not,
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, "siparisler"), yeni);
    setMiktar("");
    setNot("");
    loadSiparisler();
  };

  const loadSiparisler = async () => {
    const snapshot = await getDocs(collection(db, "siparisler"));
    setSiparisler(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 p-4">
        <Image src={Logo} alt="Logo" width={120} height={120} className="mb-4" />
        <Input placeholder="Firma Adı" value={firma} onChange={(e) => setFirma(e.target.value)} className="mb-2" />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2" />
        <Input placeholder="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />
        <div className="flex gap-2">
          <Button onClick={kaydol}>Kaydol</Button>
          <Button onClick={girisYap}>Giriş Yap</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Hoşgeldin {user.displayName}</h1>
        <Button onClick={cikisYap}>Çıkış</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Sebzeler</h2>
          {sebzeler.map((urun) => (
            <Card key={urun.ad} className="mb-3">
              <CardContent className="flex items-center gap-4">
                <Image src={urun.resim} alt={urun.ad} width={60} height={60} className="rounded" />
                <div className="flex-1">
                  <div className="font-medium">{urun.ad}</div>
                  <Input placeholder={`Miktar (${urun.birim})`} value={miktar} onChange={(e) => setMiktar(e.target.value)} />
                  <Input placeholder="Not" value={not} onChange={(e) => setNot(e.target.value)} />
                </div>
                <Button onClick={() => siparisEkle(urun)}>Sepete Ekle</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Meyveler</h2>
          {meyveler.map((urun) => (
            <Card key={urun.ad} className="mb-3">
              <CardContent className="flex items-center gap-4">
                <Image src={urun.resim} alt={urun.ad} width={60} height={60} className="rounded" />
                <div className="flex-1">
                  <div className="font-medium">{urun.ad}</div>
                  <Input placeholder={`Miktar (${urun.birim})`} value={miktar} onChange={(e) => setMiktar(e.target.value)} />
                  <Input placeholder="Not" value={not} onChange={(e) => setNot(e.target.value)} />
                </div>
                <Button onClick={() => siparisEkle(urun)}>Sepete Ekle</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
