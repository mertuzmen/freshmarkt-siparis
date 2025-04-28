import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import Cart from "../components/Cart";
import OrderHistory from "../components/OrderHistory";

const urunler = [
  { kategori: "Meyve", ad: "Elma" },
  { kategori: "Meyve", ad: "Portakal" },
  { kategori: "Sebze", ad: "Domates" },
  { kategori: "Sebze", ad: "Patates" }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firma, setFirma] = useState("");
  const [sepet, setSepet] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const kaydol = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const girisYap = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const cikisYap = async () => {
    await signOut(auth);
  };

  const sepeteEkle = (urun) => {
    const miktar = prompt("Miktar girin (örnek: 5 kg, 10 adet)");
    if (miktar) {
      setSepet([...sepet, { ...urun, miktar }]);
    }
  };

  const siparisVer = async () => {
    if (sepet.length === 0) return;
    await addDoc(collection(db, "siparisler"), {
      firma: user.email,
      sepet,
      createdAt: serverTimestamp(),
    });
    setSepet([]);
    alert("Siparişiniz başarıyla oluşturuldu!");
  };

  if (!user) {
    return (
      <div className="p-4">
        <h1>Giriş Yap veya Kayıt Ol</h1>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2" />
        <input placeholder="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2" />
        <div className="flex gap-2">
          <button onClick={kaydol} className="bg-green-500 text-white p-2">Kayıt Ol</button>
          <button onClick={girisYap} className="bg-blue-500 text-white p-2">Giriş Yap</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1>FreshMarkt Sipariş Sistemi</h1>
      <h2>Merhaba {user.email}</h2>
      <button onClick={cikisYap} className="bg-red-500 text-white p-2">Çıkış Yap</button>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {urunler.map((urun, idx) => (
          <div key={idx} className="border p-4">
            <h3>{urun.kategori} - {urun.ad}</h3>
            <button onClick={() => sepeteEkle(urun)} className="bg-green-400 text-white p-2 mt-2">Sepete Ekle</button>
          </div>
        ))}
      </div>

      <Cart sepet={sepet} siparisVer={siparisVer} />
      <OrderHistory user={user} />
    </div>
  );
}
