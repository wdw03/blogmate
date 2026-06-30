
import React, { useState, useRef } from 'react';
import {
  Plus, Search, FileUp, Globe, Tag, DollarSign, Edit3, Trash2,
  Database, X, ArrowRight, BarChart3, Activity, ShieldCheck,
  Zap, Loader2, Info, CheckCircle2, ChevronRight, Hash,
  Clock, Languages, Link2, AlertCircle, FileSpreadsheet, Download,
  Terminal, HelpCircle, Eye, Upload
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface InventoryControlProps {
  domains: any[];
  onRefresh: () => void;
}

const InventoryControl: React.FC<InventoryControlProps> = ({ domains, onRefresh }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkData, setBulkData] = useState<any[]>([]);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detailed form state for single add/edit
  const [formData, setFormData] = useState({
    domain: '', category: 'Technology', da: 20, dr: 20, traffic: '10K',
    price_guest_post: 50, price_insertion: 40, price_mention: 25,
    language: 'English', tat: '3 Days', backlinks: 'Dofollow',
    ref_domains: 500, total_backlinks: 2000, total_keywords: 1000,
    auth_score: 30, spam_score: '1%', trust_flow: 15, citation_flow: 25, is_new: true
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      domain: '', category: 'Technology', da: 20, dr: 20, traffic: '10K',
      price_guest_post: 50, price_insertion: 40, price_mention: 25,
      language: 'English', tat: '3 Days', backlinks: 'Dofollow',
      ref_domains: 500, total_backlinks: 2000, total_keywords: 1000,
      auth_score: 30, spam_score: '1%', trust_flow: 15, citation_flow: 25, is_new: true
    });
    setShowAddModal(true);
  };

  const handleEditDomain = (d: any) => {
    setEditingId(d.id);
    setFormData({
      domain: d.domain || '',
      category: d.category || 'Technology',
      da: d.da || 20,
      dr: d.dr || 20,
      traffic: d.traffic || '10K',
      price_guest_post: d.price_guest_post || 50,
      price_insertion: d.price_insertion || 40,
      price_mention: d.price_mention || 25,
      language: d.language || 'English',
      tat: d.tat || '3 Days',
      backlinks: d.backlinks || 'Dofollow',
      ref_domains: d.ref_domains || 500,
      total_backlinks: d.total_backlinks || 2000,
      total_keywords: d.total_keywords || 1000,
      auth_score: d.auth_score || 30,
      spam_score: d.spam_score || '1%',
      trust_flow: d.trust_flow || 15,
      citation_flow: d.citation_flow || 25,
      is_new: d.is_new !== undefined ? d.is_new : true
    });
    setShowAddModal(true);
  };

  const filteredDomains = domains.filter((d: any) =>
    d.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.domain) return alert("Domain required!");
    setIsSubmitting(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('domains').update(formData).eq('id', editingId);
        if (error) throw error;
        alert("Asset Node Updated Successfully!");
      } else {
        const { error } = await supabase.from('domains').insert([formData]);
        if (error) throw error;
        alert("Asset Node Deployed Successfully!");
      }
      setShowAddModal(false);
      setEditingId(null);
      onRefresh();
      setFormData({
        domain: '', category: 'Technology', da: 20, dr: 20, traffic: '10K',
        price_guest_post: 50, price_insertion: 40, price_mention: 25,
        language: 'English', tat: '3 Days', backlinks: 'Dofollow',
        ref_domains: 500, total_backlinks: 2000, total_keywords: 1000,
        auth_score: 30, spam_score: '1%', trust_flow: 15, citation_flow: 25, is_new: true
      });
    } catch (err: any) { alert("Deployment Error: " + err.message); } finally { setIsSubmitting(false); }
  };

  const handleCSVTemplateDownload = () => {
    const headers = [
      "domain", "category", "da", "dr", "traffic", "price_guest_post",
      "price_insertion", "price_mention", "language", "tat", "backlinks",
      "ref_domains", "total_backlinks", "total_keywords", "auth_score",
      "spam_score", "trust_flow", "citation_flow"
    ];
    const example = [
      "example.com", "Technology", "45", "50", "25K", "120",
      "100", "60", "English", "2 Days", "Dofollow",
      "1200", "5000", "800", "35", "1%", "20", "40"
    ];
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), example.join(",")].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "DomIntel_Asset_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim() !== "");
      const headers = lines[0].split(",").map(h => h.trim());

      const parsedData = lines.slice(1).map(line => {
        const values = line.split(",");
        const obj: any = {};
        headers.forEach((header, i) => {
          let val: any = values[i]?.trim();
          // Type casting for numeric fields
          if (["da", "dr", "price_guest_post", "price_insertion", "price_mention", "ref_domains", "total_backlinks", "total_keywords", "auth_score", "trust_flow", "citation_flow"].includes(header)) {
            val = Number(val) || 0;
          }
          obj[header] = val;
        });
        return obj;
      });

      setBulkData(parsedData);
      setBulkError(null);
    };
    reader.readAsText(file);
  };

  const handleBulkInject = async () => {
    if (bulkData.length === 0) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('domains').insert(bulkData);
      if (error) throw error;
      alert(`${bulkData.length} Nodes Injected Successfully!`);
      setShowBulkModal(false);
      setBulkData([]);
      onRefresh();
    } catch (err: any) {
      setBulkError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, domainName: string) => {
    if (!confirm(`Are you sure you want to terminate Node: ${domainName}?`)) return;
    try {
      const { error } = await supabase.from('domains').delete().eq('id', id);
      if (error) throw error;
      onRefresh();
    } catch (e: any) { alert("Error: " + e.message); }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 min-w-0">
      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 sm:gap-2.5 bg-blue-600 text-white px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} /> Add_New_Asset
          </button>
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center justify-center gap-2 sm:gap-2.5 bg-slate-900 text-white px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg"
          >
            <FileSpreadsheet size={16} /> Bulk_Import_CSV
          </button>
        </div>
        <div className="relative w-full xl:w-96 group">
          <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search Node Registry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-14 pr-6 text-[11px] font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Manifest Table */}
      <div className="bg-white border border-slate-200 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-sm min-w-0">
        <div className="p-5 sm:p-8 md:p-10 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight italic">Inventory_Manifest</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredDomains.length} Nodes Synchronized</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar min-w-0">
          <table className="w-full text-left min-w-[650px]">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-5 sm:px-10 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset_Node</th>
                <th className="px-5 sm:px-10 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">SEO_Forensics</th>
                <th className="px-5 sm:px-10 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing_Module</th>
                <th className="px-5 sm:px-10 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDomains.map((d: any) => (
                <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                  <td className="px-5 sm:px-10 py-4 sm:py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-950 text-sm sm:text-base group-hover:text-blue-600 transition-colors">{d.domain}</span>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                        <span className="text-[8px] font-black bg-slate-900 text-white px-2 py-0.5 rounded uppercase tracking-widest">{d.category}</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">{d.language}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 sm:px-10 py-4 sm:py-6">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <div className="px-2 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[8px] sm:text-[9px] font-black">DA {d.da}</div>
                      <div className="px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[8px] sm:text-[9px] font-black">DR {d.dr}</div>
                      <div className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[8px] sm:text-[9px] font-black">{d.traffic}</div>
                    </div>
                  </td>
                  <td className="px-5 sm:px-10 py-4 sm:py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 min-w-[90px] sm:min-w-[100px]">
                        <span>Guest:</span>
                        <span className="text-slate-950 font-black">${d.price_guest_post}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                        <span>Insert:</span>
                        <span className="text-slate-950 font-black">${d.price_insertion}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 sm:px-10 py-4 sm:py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditDomain(d)} className="p-2 sm:p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 transition-all shadow-sm"><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(d.id, d.domain)} className="p-2 sm:p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-rose-500 transition-all shadow-sm"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SINGLE ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 md:p-8 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <form
            onSubmit={handleSaveDomain}
            className="w-full max-w-6xl bg-white rounded-[3.5rem] shadow-3xl border border-white/20 overflow-hidden flex flex-col h-full max-h-[94vh] animate-in zoom-in-95 duration-500"
          >
            <header className="px-10 py-8 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 transform rotate-3 italic font-black text-2xl">D</div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">{editingId ? 'Modify_Asset_Node' : 'Deploy_Asset_Node'}</h3>
                </div>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-slate-950 transition-all">
                <X size={24} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-12 bg-[#F8FAFC]/50 custom-scrollbar">
              {/* IDENTITY */}
              <section>
                <div className="flex items-center gap-3 mb-8 ml-2">
                  <Globe size={18} className="text-blue-500" />
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity_Protocol</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FormGroup label="Primary Domain Node" required>
                    <input type="text" placeholder="ex: tech-nexus.ai" value={formData.domain} onChange={e => setFormData({ ...formData, domain: e.target.value })} className="w-full bg-white border border-slate-200 rounded-2xl py-4.5 px-6 text-sm font-black text-slate-950 focus:border-blue-600 outline-none" />
                  </FormGroup>
                  <FormGroup label="Asset Niche Sector">
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white border border-slate-200 rounded-2xl py-4.5 px-6 text-sm font-black text-slate-950 outline-none">
                      {['Technology', 'Business', 'Health', 'Finance', 'Lifestyle', 'Real Estate', 'Crypto', 'SaaS'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                    </select>
                  </FormGroup>
                  <FormGroup label="Linguistic Gateway">
                    <input type="text" value={formData.language} onChange={e => setFormData({ ...formData, language: e.target.value })} className="w-full bg-white border border-slate-200 rounded-2xl py-4.5 px-6 text-sm font-black text-slate-950 outline-none" />
                  </FormGroup>
                </div>
              </section>

              {/* FORENSICS */}
              <section className="bg-slate-950 rounded-[3.5rem] p-4 sm:p-6 lg:p-10 relative overflow-hidden border border-white/5">
                <div className="flex items-center gap-3 mb-10 ml-2">
                  <Activity size={18} className="text-blue-400" />
                  <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em]">Forensic_Metrics</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10">
                  <DarkMetricInput label="Moz_DA" value={formData.da} onChange={v => setFormData({ ...formData, da: Number(v) })} />
                  <DarkMetricInput label="Ahrefs_DR" value={formData.dr} onChange={v => setFormData({ ...formData, dr: Number(v) })} />
                  <DarkMetricInput label="Monthly_Trf" value={formData.traffic} onChange={v => setFormData({ ...formData, traffic: v })} />
                  <DarkMetricInput label="Auth_Score" value={formData.auth_score} onChange={v => setFormData({ ...formData, auth_score: Number(v) })} />
                  <DarkMetricInput label="Trust_Flow" value={formData.trust_flow} onChange={v => setFormData({ ...formData, trust_flow: Number(v) })} />
                  <DarkMetricInput label="Spam_Score" value={formData.spam_score} onChange={v => setFormData({ ...formData, spam_score: v })} />
                </div>
              </section>

              {/* PRICING */}
              <section>
                <div className="flex items-center gap-3 mb-8 ml-2">
                  <DollarSign size={18} className="text-amber-500" />
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Pricing_Protocols</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <PriceCard label="Guest Post Value" icon={<Zap size={20} />} value={formData.price_guest_post} onChange={v => setFormData({ ...formData, price_guest_post: Number(v) })} />
                  <PriceCard label="Link Insertion Fee" icon={<Link2 size={20} />} value={formData.price_insertion} onChange={v => setFormData({ ...formData, price_insertion: Number(v) })} />
                  <PriceCard label="Brand Mention Unit" icon={<Hash size={20} />} value={formData.price_mention} onChange={v => setFormData({ ...formData, price_mention: Number(v) })} />
                </div>
              </section>
            </div>

            <footer className="px-10 py-8 border-t border-slate-100 bg-white flex items-center justify-end gap-4 shrink-0">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-10 py-5 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest italic">Abort</button>
              <button type="submit" disabled={isSubmitting} className="px-14 py-5 bg-slate-950 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] flex items-center gap-4 active:scale-95 disabled:opacity-50">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Database size={18} fill="currentColor" className="text-blue-400" /> {editingId ? 'Update Node' : 'Initialize Node'}</>}
              </button>
            </footer>
          </form>
        </div>
      )}

      {/* BULK IMPORT MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 md:p-8 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-7xl bg-white rounded-[4rem] shadow-3xl border border-white/20 overflow-hidden flex flex-col h-full max-h-[96vh] animate-in zoom-in-95 duration-500">
            <header className="px-10 py-10 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-slate-900 rounded-[1.75rem] flex items-center justify-center text-blue-400 shadow-2xl shadow-blue-500/20 transform -rotate-2">
                  <Terminal size={32} />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-4xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">Bulk_Injection_Terminal</h3>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Mass Registry Synchronization Node</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all">
                <X size={28} />
              </button>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#F8FAFC]">
              {/* Tutorial Sidebar */}
              <aside className="w-full lg:w-[320px] border-r border-slate-200 bg-white p-8 overflow-y-auto custom-scrollbar shrink-0">
                <div className="space-y-10">
                  <div>
                    <h4 className="flex items-center gap-3 text-xs font-black text-slate-950 uppercase tracking-widest mb-6">
                      <HelpCircle size={16} className="text-blue-500" /> Operational Guide
                    </h4>
                    <ul className="space-y-6">
                      <Step num="01" label="Format Headers" desc="CSV headers must exactly match our protocol names." />
                      <Step num="02" label="Data Integrity" desc="DA, DR and Prices must be integers only." />
                      <Step num="03" label="Domain Verification" desc="Include TLDs (e.g. site.com). Duplicate domains will be ignored." />
                    </ul>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-4">Required Tooling</span>
                    <button
                      onClick={handleCSVTemplateDownload}
                      className="w-full flex items-center justify-center gap-3 bg-white border-2 border-blue-200 py-4 rounded-2xl text-[10px] font-black uppercase text-blue-600 shadow-sm hover:shadow-xl transition-all active:scale-95"
                    >
                      <Download size={14} /> Download Template
                    </button>
                  </div>
                </div>
              </aside>

              <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-hidden flex flex-col">
                {bulkData.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-20 bg-white border-2 border-dashed border-slate-200 rounded-[3rem] shadow-inner group">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-8 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all duration-700">
                      <Upload size={48} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic mb-4">Ready For Payload Injection</h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-12 max-w-xs">Drop your formatted .CSV manifest here or click to browse</p>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".csv"
                      onChange={handleCSVUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-12 py-5 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all flex items-center gap-3"
                    >
                      <Plus size={16} /> Select_CSV_Manifest
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-8 px-2">
                      <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase">
                          <Eye size={14} className="inline mr-2" /> {bulkData.length} Nodes Loaded
                        </div>
                        <button
                          onClick={() => setBulkData([])}
                          className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                        >
                          Discard Payload
                        </button>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Preview Node</div>
                    </div>

                    <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl flex flex-col">
                      <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-900 text-white/40 border-b border-white/5">
                              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest">Domain</th>
                              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest">Cat</th>
                              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-center">DA</th>
                              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-center">DR</th>
                              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-right">GP_Price</th>
                              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-right">LI_Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {bulkData.slice(0, 100).map((row, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-[13px] font-black text-slate-900">{row.domain}</td>
                                <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">{row.category}</td>
                                <td className="px-6 py-4 text-[12px] font-black text-blue-600 text-center">{row.da}</td>
                                <td className="px-6 py-4 text-[12px] font-black text-indigo-600 text-center">{row.dr}</td>
                                <td className="px-6 py-4 text-[13px] font-black text-slate-900 text-right">${row.price_guest_post}</td>
                                <td className="px-6 py-4 text-[13px] font-black text-slate-900 text-right">${row.price_insertion}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {bulkData.length > 100 && (
                          <div className="p-6 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            + {bulkData.length - 100} More Nodes in Payload Buffer
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {bulkError && (
                  <div className="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-6 animate-in slide-in-from-bottom-2">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 shadow-sm"><AlertCircle size={20} /></div>
                    <div>
                      <h5 className="text-[10px] font-black text-rose-900 uppercase tracking-widest mb-1">Injection Error: PROTOCOL_VIOLATION</h5>
                      <p className="text-xs font-bold text-rose-500 opacity-80 uppercase">{bulkError}</p>
                    </div>
                  </div>
                )}
              </main>
            </div>

            <footer className="px-12 py-10 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
                  <Activity size={14} className="text-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registry Sync: Ready</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="px-10 py-5 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest italic active:scale-95"
                >
                  Abort_Sequence
                </button>
                <button
                  onClick={handleBulkInject}
                  disabled={bulkData.length === 0 || isSubmitting}
                  className="px-16 py-5 bg-slate-950 text-white rounded-2xl font-black text-[13px] uppercase tracking-[0.3em] shadow-3xl hover:bg-blue-600 transition-all flex items-center gap-4 active:scale-95 disabled:opacity-30"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Database size={18} fill="currentColor" className="text-blue-300" /> Start Mass Injection</>}
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}} />
    </div>
  );
};

// Internal Sub-Components
const FormGroup = ({ label, children, required }: any) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 ml-1">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      {required && <span className="text-rose-500 text-[10px]">*</span>}
    </div>
    {children}
  </div>
);

const DarkMetricInput = ({ label, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-center block">{label}</label>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-2 text-center text-xs font-black text-white focus:border-blue-500 outline-none transition-all"
    />
  </div>
);

const PriceCard = ({ label, icon, value, onChange }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
    <div className="flex items-center gap-3 mb-6 relative z-10">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
        {icon}
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <div className="relative">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black group-focus-within:text-blue-600">$</div>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-12 pr-6 text-xl font-black text-slate-900 focus:bg-white focus:border-blue-600 transition-all outline-none"
      />
    </div>
  </div>
);

const Step = ({ num, label, desc }: { num: string, label: string, desc: string }) => (
  <div className="flex gap-5 group">
    <div className="text-2xl font-black text-slate-200 group-hover:text-blue-500 transition-colors">{num}</div>
    <div className="pt-1">
      <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">{label}</h5>
      <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase opacity-70">{desc}</p>
    </div>
  </div>
);

export default InventoryControl;
