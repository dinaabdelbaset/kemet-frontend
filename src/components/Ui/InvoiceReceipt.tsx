import { useRef } from "react";
import { FaPrint, FaHome, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceProps {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  hotelName: string;
  roomNumber?: string;
  phone: string;
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod: string;
  items: InvoiceItem[];
  totalAmount: number;
  issuedAt: string;
}

const InvoiceReceipt = ({
  invoiceNumber,
  customerName,
  customerEmail,
  hotelName,
  roomNumber,
  phone,
  deliveryDate,
  deliveryTime,
  paymentMethod,
  items,
  issuedAt,
}: InvoiceProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * Number(item.price), 0);
  const serviceFee = subtotal * 0.05;
  const deliveryFee = 50;

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Kemat Invoice - ${invoiceNumber}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Segoe UI',sans-serif; font-size:12px; color:#1a1a2e; padding:24px; }
        .gold { background:linear-gradient(90deg,#D4AF37,#EB662B,#D4AF37); height:4px; }
        .header { display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:2px solid #D4AF37; margin-bottom:12px; }
        .logo { display:flex; align-items:center; gap:10px; }
        .logo-k { width:40px; height:40px; background:linear-gradient(135deg,#D4AF37,#EB662B); border-radius:8px; display:flex; align-items:center; justify-content:center; color:white; font-size:22px; font-weight:900; }
        .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px; }
        .box { background:#f9f9f9; border-radius:8px; padding:10px; font-size:11px; }
        .box-label { font-size:9px; font-weight:700; text-transform:uppercase; color:#999; margin-bottom:4px; letter-spacing:1px; }
        table { width:100%; border-collapse:collapse; font-size:11px; margin-bottom:10px; }
        th { background:#05073C; color:white; padding:8px; text-align:left; font-size:10px; }
        td { padding:7px 8px; border-bottom:1px solid #f0f0f0; }
        .totals { margin-left:auto; width:220px; font-size:11px; }
        .total-row { background:#05073C; color:white; padding:10px; border-radius:8px; display:flex; justify-content:space-between; font-weight:900; font-size:14px; margin-top:6px; }
        .total-row span:last-child { color:#D4AF37; }
        .footer { display:flex; justify-content:space-between; align-items:flex-end; margin-top:12px; padding-top:10px; border-top:2px dashed #eee; }
        .stamp { width:80px; height:80px; border:3px solid #D4AF37; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; transform:rotate(-12deg); }
        .stamp-paid { background:#EB662B; color:white; font-size:9px; font-weight:900; padding:2px 6px; border-radius:3px; }
        .note { font-size:10px; color:#999; max-width:300px; }
      </style></head>
      <body>${content.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f7f4, #fffbf0)", paddingTop: "72px", paddingBottom: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>

      {/* ===== COMPACT INVOICE ===== */}
      <div
        ref={printRef}
        style={{ width: "100%", maxWidth: "720px", background: "white", borderRadius: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.10)", overflow: "hidden", margin: "0 16px" }}
      >
        {/* Gold top bar */}
        <div style={{ height: "5px", background: "linear-gradient(90deg, #D4AF37, #EB662B, #D4AF37)" }} />

        <div style={{ padding: "20px 28px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #D4AF37", paddingBottom: "12px", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", background: "linear-gradient(135deg,#D4AF37,#EB662B)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="notranslate" style={{ color: "white", fontWeight: 900, fontSize: "24px", fontFamily: "serif" }}>K</span>
              </div>
              <div>
                <p className="notranslate" style={{ fontWeight: 900, fontSize: "16px", color: "#05073C", letterSpacing: "3px", textTransform: "uppercase" }}>KEMET</p>
                <p style={{ fontSize: "10px", color: "#9ca3af" }}>Egypt Tourism & Souvenirs</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "2px" }}>Official Invoice</p>
              <p style={{ fontWeight: 900, fontSize: "18px", color: "#05073C", fontFamily: "monospace" }}>{invoiceNumber}</p>
              <span style={{ background: "#d1fae5", color: "#065f46", fontSize: "10px", fontWeight: 700, padding: "2px 10px", borderRadius: "999px", display: "inline-block", marginTop: "3px" }}>✓ Confirmed</span>
              <p style={{ fontSize: "10px", color: "#9ca3af", marginTop: "2px" }}>{issuedAt}</p>
            </div>
          </div>

          {/* Bill To / Deliver To */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
            <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "10px 14px", border: "1px solid #f0f0f0" }}>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "5px" }}>Bill To</p>
              <p style={{ fontWeight: 700, color: "#05073C", fontSize: "13px" }}>{customerName}</p>
              <p style={{ fontSize: "11px", color: "#6b7280" }}>{customerEmail}</p>
              <p style={{ fontSize: "11px", color: "#6b7280" }}>📱 {phone}</p>
            </div>
            <div style={{ background: "#fffbeb", borderRadius: "10px", padding: "10px 14px", border: "1px solid #fde68a" }}>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "5px" }}>Deliver To</p>
              <p style={{ fontWeight: 700, color: "#05073C", fontSize: "13px" }}>{hotelName}</p>
              {roomNumber && <p style={{ fontSize: "11px", color: "#6b7280" }}>Room: {roomNumber}</p>}
              <p style={{ fontSize: "11px", color: "#6b7280" }}>📅 {deliveryDate} &nbsp;🕐 {deliveryTime}</p>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px", fontSize: "12px" }}>
            <thead>
              <tr style={{ background: "#05073C", color: "white" }}>
                <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Item</th>
                <th style={{ padding: "8px 12px", textAlign: "center", fontSize: "10px", fontWeight: 700 }}>Qty</th>
                <th style={{ padding: "8px 12px", textAlign: "right", fontSize: "10px", fontWeight: 700 }}>Unit Price</th>
                <th style={{ padding: "8px 12px", textAlign: "right", fontSize: "10px", fontWeight: 700 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? "white" : "#f9fafb", borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "7px 12px", fontWeight: 600, color: "#05073C" }}>{item.name}</td>
                  <td style={{ padding: "7px 12px", textAlign: "center", color: "#6b7280" }}>{item.quantity}</td>
                  <td style={{ padding: "7px 12px", textAlign: "right", color: "#6b7280" }}>${Number(item.price).toFixed(2)}</td>
                  <td style={{ padding: "7px 12px", textAlign: "right", fontWeight: 700, color: "#05073C" }}>${(item.quantity * Number(item.price)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals + Stamp */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px" }}>

            {/* Stamp */}
            <div className="notranslate" style={{ width: "90px", height: "90px", border: "3px solid #D4AF37", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(-12deg)", flexShrink: 0, position: "relative" }}>
              <div style={{ position: "absolute", inset: "5px", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "50%" }} />
              <p style={{ fontSize: "8px", fontWeight: 900, color: "#D4AF37", textTransform: "uppercase", letterSpacing: "1.5px" }}>KEMET Egypt</p>
              <p style={{ fontWeight: 900, fontSize: "20px", color: "#05073C", fontFamily: "serif", lineHeight: 1 }}>K</p>
              <div style={{ background: "#EB662B", color: "white", fontSize: "8px", fontWeight: 900, padding: "1px 7px", borderRadius: "3px", textTransform: "uppercase", letterSpacing: "1px" }}>PAID</div>
              <p style={{ fontSize: "7px", color: "#D4AF37", fontWeight: 700, marginTop: "2px" }}>Official Seal</p>
            </div>

            {/* Totals */}
            <div style={{ flex: 1, maxWidth: "260px", marginLeft: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f0f0f0", fontSize: "12px", color: "#6b7280" }}>
                <span>Subtotal</span><span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f0f0f0", fontSize: "12px", color: "#6b7280" }}>
                <span>Website Service Fee (5%)</span><span style={{ fontWeight: 600 }}>${serviceFee.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f0f0f0", fontSize: "12px", color: "#6b7280" }}>
                <span>Delivery Fee</span><span style={{ fontWeight: 600 }}>EGP {deliveryFee}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(90deg,#05073C,#0a0f7a)", color: "white", padding: "10px 14px", borderRadius: "10px", marginTop: "6px" }}>
                <div>
                  <span style={{ fontWeight: 900, fontSize: "13px", textTransform: "uppercase" }}>Total Due</span>
                  <p style={{ fontSize: "9px", opacity: 0.6, marginTop: "1px" }}>incl. service fee</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontWeight: 900, fontSize: "18px", color: "#D4AF37" }}>${(subtotal + serviceFee).toFixed(2)}</span>
                  <p style={{ fontSize: "9px", opacity: 0.7 }}>+ EGP {deliveryFee} delivery</p>
                </div>
              </div>
              <p style={{ fontSize: "10px", textAlign: "center", color: "#9ca3af", marginTop: "4px" }}>Payment: {paymentMethod}</p>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed #e5e7eb" }}>
            <p style={{ fontSize: "10px", color: "#9ca3af", lineHeight: 1.5 }}>
              This is an official electronic invoice from <strong className="notranslate">KEMET Egypt Tourism</strong>. Our team will contact you via WhatsApp to confirm delivery. For support: <span style={{ color: "#EB662B" }}>support@kemet-egypt.com</span>
            </p>
          </div>

        </div>

        {/* Gold bottom bar */}
        <div style={{ height: "5px", background: "linear-gradient(90deg, #D4AF37, #EB662B, #D4AF37)" }} />
      </div>

      {/* ===== Action Buttons BELOW invoice ===== */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
        <button
          onClick={handlePrint}
          style={{ background: "#05073C", color: "white", padding: "11px 22px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(5,7,60,0.25)" }}
        >
          <FaPrint /> Print / Save PDF
        </button>
        <Link
          to="/shop"
          style={{ background: "#EB662B", color: "white", padding: "11px 22px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", boxShadow: "0 4px 12px rgba(235,102,43,0.25)" }}
        >
          <FaShoppingBag /> Continue Shopping
        </Link>
        <Link
          to="/"
          style={{ background: "white", color: "#374151", padding: "11px 22px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", border: "1px solid #e5e7eb" }}
        >
          <FaHome /> Back to Home
        </Link>
      </div>

    </div>
  );
};

export default InvoiceReceipt;
