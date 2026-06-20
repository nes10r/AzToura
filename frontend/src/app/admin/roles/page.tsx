import { Shield, Check, X } from 'lucide-react';

const ROLES = [
  { name: 'Super Admin', color: 'bg-violet-600', desc: 'Full access to everything' },
  { name: 'Content Manager', color: 'bg-blue-600', desc: 'Manage content, no settings' },
  { name: 'Booking Manager', color: 'bg-emerald-600', desc: 'Manage bookings and users' },
  { name: 'SEO Manager', color: 'bg-amber-600', desc: 'Edit SEO fields and metadata' },
  { name: 'Editor', color: 'bg-slate-600', desc: 'Create and edit content drafts' },
];

const PERMISSIONS = ['View', 'Create', 'Edit', 'Delete', 'Publish', 'Approve', 'Settings'];

const ACCESS: Record<string, boolean[]> = {
  'Super Admin':      [true,  true,  true,  true,  true,  true,  true ],
  'Content Manager':  [true,  true,  true,  false, true,  false, false],
  'Booking Manager':  [true,  false, true,  false, false, true,  false],
  'SEO Manager':      [true,  false, true,  false, false, false, true ],
  'Editor':           [true,  true,  true,  false, false, false, false],
};

export default function RolesPage() {
  return (
    <div className="max-w-5xl space-y-4">
      <div><h1 className="text-2xl font-bold text-slate-800">Roles & Permissions</h1><p className="text-slate-500 text-sm mt-0.5">Manage admin roles and access control</p></div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Permission Matrix</h2>
          <p className="text-xs text-slate-400 mt-0.5">Current role configuration (editing coming soon)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Role</th>
                {PERMISSIONS.map(p => (
                  <th key={p} className="px-4 py-3 text-center text-xs font-medium text-slate-500">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map(role => (
                <tr key={role.name} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${role.color}`} />
                      <div>
                        <p className="font-medium text-slate-800">{role.name}</p>
                        <p className="text-xs text-slate-400">{role.desc}</p>
                      </div>
                    </div>
                  </td>
                  {(ACCESS[role.name] || []).map((has, i) => (
                    <td key={i} className="px-4 py-4 text-center">
                      {has
                        ? <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                        : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ROLES.map(role => (
          <div key={role.name} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${role.color} flex items-center justify-center`}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{role.name}</p>
                <p className="text-xs text-slate-400">{role.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
