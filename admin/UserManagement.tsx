
import React from 'react';
import { supabase } from '../lib/supabase';

const UserManagement = ({ users, currentUser, onRefresh }: any) => {
  const isSuperAdmin = currentUser?.role === 'superadmin';

  // Privacy Masking Logic
  const maskEmail = (email: string) => {
    if (!email || isSuperAdmin) return email;
    const [local, domain] = email.split('@');
    if (local.length <= 4) return `${local[0]}****@${domain}`;
    return `${local.substring(0, 3)}****${local.substring(local.length - 2)}@${domain}`;
  };

  const maskName = (name: string) => {
    if (!name || isSuperAdmin || name === 'GUEST USER') return name;
    const parts = name.split(' ');
    return parts.map(part => {
        if (part.length <= 3) return part[0] + '**';
        return part.substring(0, 3) + '**' + part.substring(part.length - 2);
    }).join(' ');
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (currentUser.role !== 'superadmin') {
      alert("Unauthorized: Only Superadmins can reassign node roles.");
      return;
    }
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (!error) onRefresh();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
       <div className="p-10 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Identity_Registry</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Ownership Hierarchy</span>
       </div>
       <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                   <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol_Update</th>
                </tr>
             </thead>
             <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                     <td className="px-10 py-6">
                        <span className="font-black text-slate-900 tracking-tight uppercase text-sm">{maskName(u.full_name) || 'Unnamed Node'}</span>
                     </td>
                     <td className="px-10 py-6 text-slate-500 font-mono text-[13px]">{maskEmail(u.email)}</td>
                     <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                          u.role === 'superadmin' ? 'bg-rose-500 text-white' : 
                          u.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                           {u.role}
                        </span>
                     </td>
                     <td className="px-10 py-6">
                        <select 
                          disabled={currentUser.role !== 'superadmin' || u.id === currentUser.id}
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] outline-none disabled:opacity-40"
                        >
                           <option value="user">USER_NODE</option>
                           <option value="admin">ADMIN_PROTOCOL</option>
                           <option value="superadmin">SUPERADMIN_ROOT</option>
                        </select>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default UserManagement;
