// pages/sepet.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function SepetSayfasi() {
  const [sepet, setSepet] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("sepet");
    if (data) setSepet(JSON.parse(data));

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/");
      else setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const siparisiOnayla = async () => {
    for (const item of sepet) {
      await addDoc(collection(db, "siparisler"), {
        firma: user.displayName,
        urun: item.ad,
        miktar: item.miktar,
        not: item.not || "",
        durum: "Alındı",
        createdAt: serverTimestamp()
      });
    }
    alert("Sipariş alındı! Yöneticiye bildirim gönderilecek.");
    localStorage.removeItem("sepet");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Sepetim</h1>
      {sepet.length === 0 ? (
        <p className="text-center text-gray-500">Sepetiniz boş.</p>
      ) : (
        <div className="grid gap-4">
          {sepet.map((item, index) => (
            <Card key={index} className="bg-white p-4 shadow-md rounded-xl">
              <CardContent>
                <p><strong>{item.ad}</strong> - {item.miktar} {item.birim}</p>
                {item.not && <p className="text-sm text-gray-600">Not: {item.not}</p>}
              </CardContent>
            </Card>
          ))}
          <Button
            onClick={siparisiOnayla}
            className="bg-lime-600 hover:bg-lime-700 text-white font-semibold px-4 py-2 rounded-full"
          >
            Siparişi Onayla
          </Button>
        </div>
      )}
    </div>
  );
}
