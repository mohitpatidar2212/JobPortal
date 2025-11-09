import React, { useEffect, useState } from 'react';
import API from "../../services/api"
const AdminFAQManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try{
      const res = await API.get('/admin/faqs', {
        headers: {
        Authorization: `Bearer ${token}`,
        },
      });
      setFaqs(res.data);
      setMessageType("success")
    }
    catch (err){
      console.error("Failed to load FAQ:", err);
        if (err.response?.data?.detail) {
          setMessage(`Failed to load FAQ: ${err.response.data.detail}`);
        } else {
          setMessage("Failed to load FAQ.");
        }
        setMessageType("error")
        setTimeout(() => setMessage(""), 2500);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFAQ((prev) => ({ ...prev, [name]: value }));
  };

  const addFAQ = async () => {
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) {
      setMessage("Question and answer are required.");
      setMessageType("error")
      setTimeout(() => setMessage(""), 2500);
      return;
    }
    try {
      await API.post('/admin/faq', newFAQ, { headers: {
        Authorization: `Bearer ${token}`,
        },});
      setNewFAQ({ question: '', answer: '' });
      fetchFaqs();
      setMessage("Successfully added a FAQ")
      setMessageType("success")
      setTimeout(() => setMessage(""), 2500);
    }
    catch (err){
      console.error("Failed to add FAQ:", err);
        if (err.response?.data?.detail) {
          setMessage(`Failed to add FAQ: ${err.response.data.detail}`);
        } else {
          setMessage("Failed to add FAQ. Please try again.");
        }
        setMessageType("error")
        setTimeout(() => setMessage(""), 2500);
    }
  };

  const updateFAQ = async (id) => {
    if (!editingFAQ.question.trim() || !editingFAQ.answer.trim()) {
      setMessage("Question and answer are required.");
      setMessageType("error")
      setTimeout(() => setMessage(""), 2500);
      return;
    }
    try{
      await API.put(`/admin/faq/${id}`, editingFAQ, { headers: {
        Authorization: `Bearer ${token}`,
        },});
      setEditingFAQ(null);
      fetchFaqs();
      setMessage("Successfully updated the FAQ")
      setMessageType("success")
      setTimeout(() => setMessage(""), 2500);
    }
    catch (err){
      console.error("Failed to update FAQ:", err);
        if (err.response?.data?.detail) {
          setMessage(`Failed to update FAQ: ${err.response.data.detail}`);
        } else {
          setMessage("Failed to update FAQ. Please try again.");
        }
        setMessageType("error")
        setTimeout(() => setMessage(""), 2500);
    }
  };

  const deleteFAQ = async (id) => {
    try{
      await API.delete(`/admin/faq/${id}`, {headers: {
        Authorization: `Bearer ${token}`,
        },});
      fetchFaqs();
      setMessage("Successfully deleted the FAQ")
      setMessageType("success")
      setTimeout(() => setMessage(""), 2500);
    }
    catch (err){
      console.error("Failed to delete FAQ:", err);
        if (err.response?.data?.detail) {
          setMessage(`Failed to delete FAQ: ${err.response.data.detail}`);
        } else {
          setMessage("Failed to delete FAQ. Please try again.");
        }
        setMessageType("error")
        setTimeout(() => setMessage(""), 2500);
    }
  };

  return (
    <>
      {message && (
        <div className="fixed top-6 left-1/2 z-50">
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
            <div
              className={`px-6 py-4 rounded shadow-lg text-center max-w-md w-full ${
                messageType === "success"
                  ? "bg-green-100 text-green-800 border border-green-400"
                  : "bg-red-100 text-red-800 border border-red-400"
              }`}
            >
              <p>{message}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
          <p className="min-h-screen">Loading jobs...</p>
      ) :
        <div className=" min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-900">
          <div className="max-w-3xl mx-auto mt-10 mb-10 p-6 bg-white rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4">Manage FAQs</h2>

            <div className="mb-6">
              <input
                type="text"
                name="question"
                placeholder="Question"
                required
                value={newFAQ.question}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <textarea
                name="answer"
                placeholder="Answer"
                value={newFAQ.answer}
                required
                onChange={handleInputChange}
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
              <button onClick={addFAQ} className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition">Add FAQ</button>
            </div>

            <div>
              {faqs.map((faq) => (
                <div key={faq._id} className="mb-4 p-4 border border-gray-200 rounded-md shadow-sm">
                  {editingFAQ?._id === faq._id ? (
                    <div>
                      <input
                        type="text"
                        value={editingFAQ.question}
                        onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <textarea
                        value={editingFAQ.answer}
                        onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      ></textarea>
                      <button onClick={() => updateFAQ(faq._id)} className="bg-blue-500 text-white px-4 py-1 rounded-md mr-2 hover:bg-blue-700">Save</button>
                      <button onClick={() => setEditingFAQ(null)} className="bg-gray-300 px-4 py-1 rounded-md hover:bg-gray-500">Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <p><strong>Q:</strong> {faq.question}</p>
                      <p><strong>A:</strong> {faq.answer}</p>
                      <div className="mt-2">
                        <button onClick={() => setEditingFAQ(faq)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-700">Edit</button>
                        <button onClick={() => deleteFAQ(faq._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default AdminFAQManager;
