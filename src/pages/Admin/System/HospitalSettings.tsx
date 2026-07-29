import { useState } from "react";
import { Settings, Save, Building, Phone, Mail, MapPin } from "lucide-react";

export default function HospitalSettings() {
  const [settings, setSettings] = useState({
    hospitalName: "City General Hospital",
    address: "123 Healthcare Blvd, Medical District",
    phone: "+1 234-567-8900",
    email: "contact@citygeneral.com",
    taxRate: "18",
    currencySymbol: "₹",
    autoPrintReceipts: true
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully.");
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Hospital Settings</h1>
          <p className="text-slate-500 mt-1">Configure global application parameters.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
        >
          <Save size={20} /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Building size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">General Information</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Hospital Name</label>
              <input 
                type="text" 
                name="hospitalName"
                value={settings.hospitalName}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Hospital Address</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input 
                  type="text" 
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input 
                  type="text" 
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Support Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input 
                  type="email" 
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Settings size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Financial & System</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Default Tax Rate (%)</label>
              <input 
                type="number" 
                name="taxRate"
                value={settings.taxRate}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Currency Symbol</label>
              <input 
                type="text" 
                name="currencySymbol"
                value={settings.currencySymbol}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" 
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                <input 
                  type="checkbox" 
                  name="autoPrintReceipts"
                  checked={settings.autoPrintReceipts}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-semibold text-slate-800">Auto-Print Receipts</div>
                  <div className="text-sm text-slate-500">Automatically prompt printing after successful payment transactions.</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
