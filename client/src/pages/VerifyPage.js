import React, { useState } from "react";
import axios from "axios";

const VerifyPage = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!uniqueId.trim()) {
      setError("Please enter a valid Unique ID");
      setCertificate(null);
      return;
    }

    setLoading(true);
    setError("");
    setCertificate(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/verify/${uniqueId}`
      );
      setCertificate(res.data.certificate);
      setError("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Certificate not found");
      }
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">
        Certificate Verification
      </h1>

      <input
        type="text"
        value={uniqueId}
        onChange={(e) => setUniqueId(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter Unique ID"
        className="border rounded p-2 w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className={`mt-4 px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      {error && (
        <p className="text-red-600 mt-4 font-semibold">❌ {error}</p>
      )}

      {certificate && (
        <div className="mt-6 p-4 border rounded-lg shadow-lg w-full max-w-md bg-white">
          <h2 className="text-xl font-semibold mb-2 text-green-700">
            ✅ Certificate Verified!
          </h2>
          <div className="space-y-1">
            <p><strong>Full Name:</strong> {certificate.fullName}</p>
            <p><strong>Email:</strong> {certificate.email}</p>
            <p><strong>Course:</strong> {certificate.course}</p>
            {certificate.mentor && <p><strong>Mentor:</strong> {certificate.mentor}</p>}
            {certificate.duration && <p><strong>Duration:</strong> {certificate.duration}</p>}
            {certificate.college && <p><strong>College:</strong> {certificate.college}</p>}
            {certificate.location && <p><strong>Location:</strong> {certificate.location}</p>}
            <p><strong>Unique ID:</strong> {certificate.uniqueId}</p>
            {certificate.createdAt && (
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(certificate.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
