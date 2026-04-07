// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DocumentFormModal from "../components/DataEntryModal";

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState("users");
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   // ✅ Your backend base URL
//   const BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:5000") + "/api/admin";

//   // Fetch data when tab changes
//   useEffect(() => {
//     fetchData(activeTab);
//   }, [activeTab]);

//   // ✅ FIXED fetchData to use correct backend routes
//   const fetchData = async (type) => {
//     setLoading(true);
//     try {
//       let endpoint = "";

//       if (type === "users") endpoint = `${BASE_URL}/users`;
//       else if (type === "enrollments") endpoint = `${BASE_URL}/enrollments`;
//       else if (type === "certificates") endpoint = `${BASE_URL}/certificates`;

//       const res = await axios.get(endpoint);
//       const result = res.data;

//       // Support both { success, data } and raw array
//       if (result.success && Array.isArray(result.data)) {
//         setData(result.data);
//       } else if (Array.isArray(result)) {
//         setData(result);
//       } else {
//         setData([]);
//       }
//     } catch (err) {
//       console.error(`❌ Error fetching ${type}:`, err);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Updated CSV download logic
//   const handleDownload = (type) => {
//     let endpoint = "";

//     if (type === "users") endpoint = `${BASE_URL}/export-users`;
//     else if (type === "enrollments") endpoint = `${BASE_URL}/export-enrollments`;
//     else if (type === "certificates") endpoint = `${BASE_URL}/export-certificates`;

//     window.open(endpoint, "_blank");
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = "/";
//   };

//   const renderTable = () => {
//     if (!data.length)
//       return <p className="text-gray-500 text-center text-lg">No records found.</p>;

//     const keys = Object.keys(data[0]).filter(
//       (k) => !["_id", "__v", "updatedAt"].includes(k)
//     );

//     return (
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300 rounded-xl">
//           <thead className="bg-gray-100">
//             <tr>
//               {keys.map((key) => (
//                 <th key={key} className="px-4 py-2 text-left capitalize">
//                   {key.replace(/([A-Z])/g, " $1")}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, i) => (
//               <tr key={i} className="border-t hover:bg-gray-50">
//                 {keys.map((k) => (
//                   <td key={k} className="px-4 py-2 text-sm">
//                     {row[k]?.toString()}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
//             Admin Dashboard
//           </h2>

//           <div className="flex gap-3">
//             <button
//               onClick={() => setShowModal(true)}
//               className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
//             >
//               Data Entry
//             </button>

//             <button
//               onClick={handleLogout}
//               className="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-semibold shadow hover:bg-gray-400 transition"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-3 mb-6">
//           {["users", "enrollments", "certificates"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-4 py-2 rounded-lg font-semibold ${
//                 activeTab === tab
//                   ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}

//           <button
//             onClick={() => handleDownload(activeTab)}
//             className="ml-auto bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
//           >
//             Download CSV
//           </button>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="text-center text-gray-500">Loading...</div>
//         ) : (
//           renderTable()
//         )}
//       </div>

//       {/* Modal for Certificate Form */}
//       {showModal && <DocumentFormModal onClose={() => setShowModal(false)} />}
//     </div>
//   );
// };

// export default AdminDashboard;




import React, { useEffect, useState } from "react";
import axios from "axios";
import DocumentFormModal from "../components/DataEntryModal";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ✅ Updated QR state (simplified)
  const [qrData, setQrData] = useState(null); // Store QR + link

  const BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:5000") + "/api/admin";

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (type) => {
    setLoading(true);
    try {
      let endpoint = "";

      if (type === "users") endpoint = `${BASE_URL}/users`;
      else if (type === "enrollments") endpoint = `${BASE_URL}/enrollments`;
      else if (type === "certificates") endpoint = `${BASE_URL}/certificates`;

      const res = await axios.get(endpoint);
      const result = res.data;

      if (result.success && Array.isArray(result.data)) {
        setData(result.data);
      } else if (Array.isArray(result)) {
        setData(result);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(`❌ Error fetching ${type}:`, err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (type) => {
    let endpoint = "";

    if (type === "users") endpoint = `${BASE_URL}/export-users`;
    else if (type === "enrollments") endpoint = `${BASE_URL}/export-enrollments`;
    else if (type === "certificates") endpoint = `${BASE_URL}/export-certificates`;

    window.open(endpoint, "_blank");
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ✅ Simplified QR generation (fetch + display)
  const handleGenerateQR = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/generate-qr/${id}`);
      const data = await response.json();

      if (data.success) {
        setQrData({
          qr: data.qr,
          link: data.link,
        });
      } else {
        alert("Failed to generate QR");
      }
    } catch (err) {
      console.error("❌ QR Generation Error:", err);
      alert("QR generation failed");
    }
  };

  // ✅ Optional: download QR image
  const downloadQR = () => {
    const a = document.createElement("a");
    a.href = qrData.qr;
    a.download = "certificate_qr.png";
    a.click();
  };

  const renderTable = () => {
    if (!data.length)
      return <p className="text-gray-500 text-center text-lg">No records found.</p>;

    const keys = Object.keys(data[0]).filter(
      (k) => !["_id", "__v", "updatedAt"].includes(k)
    );

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              {keys.map((key) => (
                <th key={key} className="px-4 py-2 text-left capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </th>
              ))}
              {/* ✅ Add QR Button Header only for certificates */}
              {activeTab === "certificates" && <th className="px-4 py-2">QR</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                {keys.map((k) => (
                  <td key={k} className="px-4 py-2 text-sm">
                    {row[k]?.toString()}
                  </td>
                ))}
                {/* ✅ Add QR Button */}
                {activeTab === "certificates" && (
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleGenerateQR(row._id)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600"
                    >
                      Generate QR
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
            >
              Data Entry
            </button>

            <button
              onClick={handleLogout}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-semibold shadow hover:bg-gray-400 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {["users", "enrollments", "certificates"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === tab
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

          <button
            onClick={() => handleDownload(activeTab)}
            className="ml-auto bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
          >
            Download CSV
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          renderTable()
        )}

        {/* ✅ QR Code + URL shown below certificate section */}
        {qrData && (
          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              backgroundColor: "#f9fafb",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3 className="text-xl font-semibold mb-3 text-indigo-600">
              QR Code Generated
            </h3>
            <img
              src={qrData.qr}
              alt="QR Code"
              style={{ width: "200px", height: "200px", margin: "auto" }}
            />
            <p className="mt-3">
              <strong>Verification URL:</strong>{" "}
              <a
                href={qrData.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {qrData.link}
              </a>
            </p>
            <button
              onClick={downloadQR}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Download QR
            </button>
          </div>
        )}
      </div>

      {/* Modal for Certificate Form */}
      {showModal && <DocumentFormModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AdminDashboard;
