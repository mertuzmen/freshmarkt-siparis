// components/OrderHistory.js

import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function OrderHistory({ user }) {
  const [siparisler, setSiparisler] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const q = query(collection(db, "siparisler"), where("firma", "==", user.email));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setSiparisler(data);
    };
    fetchOrders();
  }, [user]);

  if (siparisler.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Siparişlerim</h2>
      {siparisler.map((siparis, idx) => (
        <div key={idx} className="border p-4 mb-2">
          {siparis.sepet.map((urun, uidx) => (
            <div key={uidx}>
              {urun.kategori} - {urun.ad} ({urun.miktar})
            </div>
          ))}
          <p className="text-xs text-gray-500 mt-2">Sipariş Verildi</p>
        </div>
      ))}
    </div>
  );
}
