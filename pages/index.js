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

const urunListesi = ["Elma", "Muz", "Domates", "Salatalık", "Portakal", "Patates", "Soğan"];

const kartRenk = {
  "Alındı": "bg-gray-100",
  "Hazırlanıyor": "bg-yellow-100",
  "Kargoya Verildi": "bg-blue-100",
  "Teslim Edildi": "bg-green-100"
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firma, setFirma] = useState("");
  const [siparisler, setSiparisler] = useState([]);
  const [yeniSiparis, setYeniSiparis] = useState("");
  const [miktar, setMiktar] = useState("");
  const [not, setNot] = useState("");
  const [arama, setArama] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        loadSiparisler();
      }
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
    setSiparisler([]);
  };

  const siparisEkle = async () => {
    if (yeniSiparis.trim() === "" || miktar.trim() === "") return;
    const yeni = {
      firma: user?.displayName || "Bilinmeyen Firma",
      urun: yeniSiparis,
      miktar: miktar,
      not: not,
      durum: "Alındı",
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, "siparisler"), yeni);
    setYeniSiparis("");
    setMiktar("");
    setNot("");
    loadSiparisler();
  };

  const loadSiparisler = async () => {
    const q = query(collection(db, "siparisler"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSiparisler(data);
  };

  const durumGuncelle = async (id, yeniDurum) => {
    const onay = confirm(`${yeniDurum} durumuna geçirmek istiyor musun?`);
    if (!onay) return;
    const siparisRef = doc(db, "siparisler", id);
    await updateDoc(siparisRef, { durum: yeniDurum });
    loadSiparisler();
  };

  const siparisSil = async (id) => {
    const siparisRef = doc(db, "siparisler", id);
    await deleteDoc(siparisRef);
    loadSiparisler();
  };

  const formatTarih = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return format(date, "dd/MM/yyyy");
  };

  const filtreliSiparisler = useMemo(() =>
    siparisler.filter((siparis) =>
      siparis.durum.toLowerCase().includes(arama.toLowerCase()) ||
      siparis.firma.toLowerCase().includes(arama.toLowerCase())
    ), [siparisler, arama]
  );

  const siparisleriGrupla = () => {
    const gruplar = {};
    filtreliSiparisler.forEach((siparis) => {
      const tarih = formatTarih(siparis.createdAt);
      if (!gruplar[tarih]) {
        gruplar[tarih] = [];
      }
      gruplar[tarih].push(siparis);
    });
    return gruplar;
  };

  const grupluSiparisler = siparisleriGrupla();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="Fresh Markt Logo" width={150} height={150} className="rounded-full shadow-lg" />
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
          <h1 className="text-3xl font-extrabold text-center mb-6 text-green-700">Fresh Markt Giriş</h1>
          <Input placeholder="Firma Adı" value={firma} onChange={(e) => setFirma(e.target.value)} className="mb-4" />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4" />
          <Input placeholder="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />
          <div className="flex gap-4">
            <Button className="flex-1 bg-green-500 hover:bg-green-600 transition-all hover:scale-105 text-white" onClick={kaydol}>Kaydol</Button>
            <Button className="flex-1 bg-blue-500 hover:bg-blue-600 transition-all hover:scale-105 text-white" onClick={girisYap}>Giriş Yap</Button>
          </div>
        </div>
      </div>
    );
  }

  if (user.email === "cmertuzmen@gmail.com") {
    return (
      <div className="p-4 grid gap-4">
        <h1 className="text-2xl font-bold text-center mb-4">FreshMarkt Admin Paneli</h1>
        <p className="text-center mb-4">Hoşgeldin {user.displayName}!</p>
        <Input placeholder="Duruma veya Firma Adına Göre Ara..." value={arama} onChange={(e) => setArama(e.target.value)} className="mb-4" />
        {Object.keys(grupluSiparisler).map((tarih) => (
          <div key={tarih}>
            <h2 className="text-xl font-semibold my-2">{tarih} Tarihli Siparişler</h2>
            {grupluSiparisler[tarih].map((siparis) => (
              <motion.div key={siparis.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }}>
                <Card className={`rounded-xl shadow-lg mt-2 ${kartRenk[siparis.durum] || 'bg-white'}`}>
                  <CardContent className="p-4 grid gap-2">
                    <div className="font-semibold">Firma: {siparis.firma}</div>
                    <div>Ürün: {siparis.urun}</div>
                    <div>Miktar: {siparis.miktar}</div>
                    {siparis.not && <div>Not: {siparis.not}</div>}
                    <div>Durum: {siparis.durum}</div>
                    <div className="flex gap-2 flex-wrap mt-2">
                      <Button className="transition-all hover:scale-105" onClick={() => durumGuncelle(siparis.id, 'Hazırlanıyor')}>Hazırlanıyor</Button>
                      <Button className="transition-all hover:scale-105" onClick={() => durumGuncelle(siparis.id, 'Kargoya Verildi')}>Kargoya Verildi</Button>
                      <Button className="transition-all hover:scale-105" onClick={() => durumGuncelle(siparis.id, 'Teslim Edildi')}>Teslim Edildi</Button>
                      <Button className="transition-all hover:scale-105" variant="destructive" onClick={() => siparisSil(siparis.id)}>Sil</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ))}
        <div className="flex justify-center mt-6">
          <Button className="bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105" onClick={cikisYap}>
            Çıkış Yap
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="p-4 grid gap-4">
        <h1 className="text-2xl font-bold text-center mb-4">FreshMarkt Müşteri Paneli</h1>
        <p className="text-center mb-4">Hoşgeldin {user.displayName}!</p>
        <div className="flex gap-2 mb-4 flex-wrap">
          <Select onChange={(e) => setYeniSiparis(e.target.value)} value={yeniSiparis}>
            <option value="">Ürün Seçin</option>
            {urunListesi.map((urun) => (
              <option key={urun} value={urun}>{urun}</option>
            ))}
          </Select>
          <Input placeholder="Miktar (kg/adet)" value={miktar} onChange={(e) => setMiktar(e.target.value)} />
          <Input placeholder="Sipariş Notu" value={not} onChange={(e) => setNot(e.target.value)} />
          <Button className="transition-all hover:scale-105" onClick={siparisEkle}>Sipariş Ekle</Button>
        </div>
        {siparisler.filter((s) => s.firma === user.displayName).map((siparis) => (
          <motion.div key={siparis.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }}>
            <Card className="rounded-xl shadow-lg mt-2 bg-white">
              <CardContent className="p-4 grid gap-2">
                <div>Ürün: {siparis.urun}</div>
                <div>Miktar: {siparis.miktar}</div>
                {siparis.not && <div>Not: {siparis.not}</div>}
                <div>Durum: {siparis.durum}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        <div className="flex justify-center mt-6">
          <Button className="bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105" onClick={cikisYap}>
            Çıkış Yap
          </Button>
        </div>
      </div>
    );
  }
}
