// pages/sepet.js - ARTIK FORM BAZLI YAKLAŞIMA GEÇİLDİ

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function SiparisFormu() {
  const [user, setUser] = useState(null);
  const [urun, setUrun] = useState("");
  const [miktar, setMiktar] = useState("");
  const [not, setNot] = useState("");
  const [gecmisSiparisler, setGecmisSiparisler] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/");
      else {
        setUser(user);
        siparisleriYukle(user.displayName);
      }
    });
    return () => unsubscribe();
  }, []);

  const siparisiGonder = async () => {
    if (!urun || !miktar) return alert("Lütfen tüm alanları doldurun.");
    await addDoc(collection(db, "siparisler"), {
      firma: user.displayName,
      urun,
      miktar,
      not,
      durum: "Alındı",
      createdAt: serverTimestamp()
    });
    alert("Siparişiniz başarıyla oluşturuldu.");
    setUrun("");
    setMiktar("");
    setNot("");
    siparisleriYukle(user.displayName);
  };

  const siparisleriYukle = async (firmaAdi) => {
    const snapshot = await getDocs(collection(db, "siparisler"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const filtreli = data.filter((s) => s.firma === firmaAdi);
    setGecmisSiparisler(filtreli);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Sipariş Formu</h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg mb-10">
        <Input placeholder="Ürün Adı" value={urun} onChange={(e) => setUrun(e.target.value)} className="mb-4" />
        <Input placeholder="Miktar (kg/adet)" value={miktar} onChange={(e) => setMiktar(e.target.value)} className="mb-4" />
        <Input placeholder="Not (opsiyonel)" value={not} onChange={(e) => setNot(e.target.value)} className="mb-4" />
        <Button onClick={siparisiGonder} className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-2 rounded-full">Siparişi Gönder</Button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Geçmiş Siparişlerim</h2>
      <div className="grid gap-4">
        {gecmisSiparisler.map((s, i) => (
          <Card key={i} className="bg-white shadow-sm p-4 rounded-lg">
            <CardContent>
              <p><strong>{s.urun}</strong> - {s.miktar}</p>
              {s.not && <p className="text-sm text-gray-600">Not: {s.not}</p>}
              <p className="text-sm text-gray-400">Durum: {s.durum}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
