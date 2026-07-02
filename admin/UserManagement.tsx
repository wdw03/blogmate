
import React from 'react';
import { supabase } from '../lib/supabase';

const UserManagement = ({ users, currentUser, onRefresh }: any) => {
  const isSuperAdmin = currentUser?.role === 'superadmin';

  // Privacy Masking Logic
  const maskEmail = (email: string) => {
    return email || 'No Email';
  };

  const maskName = (name: string) => {
    return name || 'User';
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
    <div className="bg-white border border-slate-200 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-sm min-w-0">
       <div className="p-5 sm:p-8 md:p-10 border-b border-slate-100">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight italic">Identity_Registry</h3>
          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Ownership Hierarchy</span>
       </div>
       <div className="overflow-x-auto custom-scrollbar min-w-0">
          <table className="w-full text-left min-w-[550px]">
             <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                   <th className="px-4 sm:px-10 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</th>
                   <th className="px-4 sm:px-10 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway</th>
                   <th className="px-4 sm:px-10 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier</th>
                   <th className="px-4 sm:px-10 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol_Update</th>
                </tr>
             </thead>
             <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                     <td className="px-4 sm:px-10 py-4 sm:py-6">
                        <span className="font-black text-slate-900 tracking-tight uppercase text-xs sm:text-sm">{maskName(u.full_name) || 'User'}</span>
                     </td>
                     <td className="px-4 sm:px-10 py-4 sm:py-6 text-slate-500 font-mono text-xs sm:text-[13px]">{maskEmail(u.email)}</td>
                     <td className="px-4 sm:px-10 py-4 sm:py-6">
                        <span className={`px-3 sm:px-4 py-1.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-sm ${
                          u.role === 'superadmin' ? 'bg-rose-500 text-white' : 
                          u.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                           {u.role}
                        </span>
                     </td>
                     <td className="px-4 sm:px-10 py-4 sm:py-6">
                        <select 
                          disabled={currentUser.role !== 'superadmin' || u.id === currentUser.id}
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] outline-none disabled:opacity-40"
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
