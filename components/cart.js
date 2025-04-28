// components/Cart.js

export default function Cart({ sepet, siparisVer }) {
  if (sepet.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Sepetiniz</h2>
      <ul className="border p-4">
        {sepet.map((item, idx) => (
          <li key={idx} className="mb-2">
            {item.kategori} - {item.ad} ({item.miktar})
          </li>
        ))}
      </ul>
      <button
        onClick={siparisVer}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Sipariş Ver
      </button>
    </div>
  );
}
