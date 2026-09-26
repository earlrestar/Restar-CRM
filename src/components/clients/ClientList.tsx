import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Calendar,
  MoreVertical,
  Archive,
  ChevronRight,
  Shield,
  Phone,
  UserCheck,
  Crown,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Client } from '../../types';

interface ClientListProps {
  onOpenAddClient: () => void;
  onSelectClient: (client: Client) => void;
  onComposeEmail: (client: Client) => void;
  onScheduleAppointment: (client: Client) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  onOpenAddClient,
  onSelectClient,
  onComposeEmail,
  onScheduleAppointment,
}) => {
  const { clients, policies, unarchiveClient, archiveClient, setActiveView } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'active' | 'amorsolo_circle' | 'prospect' | 'inactive' | 'archived'
  >('all');

  // Filter logic
  const filteredClients = clients.filter((client) => {
    // Tab filter
    if (activeFilter === 'archived') {
      if (!client.isArchived) return false;
    } else {
      if (client.isArchived) return false;
      if (activeFilter === 'active' && client.clientStatus !== 'Active') return false;
      if (
        activeFilter === 'amorsolo_circle' &&
        client.clientStatus !== 'Amorsolo Circle' &&
        (client.clientStatus as string) !== 'VIP'
      )
        return false;
      if (activeFilter === 'prospect' && client.clientStatus !== 'Prospect') return false;
      if (activeFilter === 'inactive' && client.clientStatus !== 'Inactive') return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      const email = client.email.toLowerCase();
      const phone = client.mobileNumber;
      const occupation = client.occupation.toLowerCase();
      const tags = client.tags.join(' ').toLowerCase();

      return (
        fullName.includes(term) ||
        email.includes(term) ||
        phone.includes(term) ||
        occupation.includes(term) ||
        tags.includes(term)
      );
    }

    return true;
  });

  const getClientPolicyCount = (clientId: string) => {
    return policies.filter((p) => p.clientId === clientId).length;
  };

  const getClientFundValue = (clientId: string) => {
    return policies
      .filter((p) => p.clientId === clientId)
      .reduce((sum, p) => sum + p.fundValue, 0);
  };

  // Counts
  const counts = {
    all: clients.filter((c) => !c.isArchived).length,
    active: clients.filter((c) => !c.isArchived && c.clientStatus === 'Active').length,
    amorsolo_circle: clients.filter(
      (c) =>
        !c.isArchived &&
        (c.clientStatus === 'Amorsolo Circle' || (c.clientStatus as string) === 'VIP')
    ).length,
    prospect: clients.filter((c) => !c.isArchived && c.clientStatus === 'Prospect').length,
    inactive: clients.filter((c) => !c.isArchived && c.clientStatus === 'Inactive').length,
    archived: clients.filter((c) => c.isArchived).length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Client Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your InLife client relationships, policy histories, and communication profiles.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveView('csv_templates')}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 shadow-2xs transition-all"
            title="Download CSV templates or bulk import client data"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>CSV Templates & Import</span>
          </button>

          <button
            onClick={onOpenAddClient}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-700/25 active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Client</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Clients', count: counts.all },
            { id: 'active', label: 'Active', count: counts.active },
            { id: 'amorsolo_circle', label: 'Amorsolo Circle', count: counts.amorsolo_circle, isVip: true },
            { id: 'prospect', label: 'Prospects', count: counts.prospect },
            { id: 'inactive', label: 'Inactive', count: counts.inactive },
            { id: 'archived', label: 'Archived Clients', count: counts.archived },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : tab.isVip
                  ? 'text-amber-800 bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.isVip && <Crown className="w-3 h-3 text-amber-600" />}
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeFilter === tab.id
                    ? 'bg-blue-700/50 text-white'
                    : tab.isVip
                    ? 'bg-amber-200 text-amber-900 font-black'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Clients Table / List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredClients.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Users className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
            <p className="text-sm font-medium">No clients found matching the selected criteria.</p>
            {activeFilter !== 'archived' && (
              <button
                onClick={onOpenAddClient}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold"
              >
                + Add Client Now
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 border-b border-slate-200 uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">InLife Policies</th>
                  <th className="py-3 px-4">Fund Value</th>
                  <th className="py-3 px-4">Client Since</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => {
                  const policyCount = getClientPolicyCount(client.id);
                  const fundValue = getClientFundValue(client.id);

                  return (
                    <tr
                      key={client.id}
                      onClick={() => onSelectClient(client)}
                      className="hover:bg-slate-50/80 cursor-pointer group transition-colors"
                    >
                      {/* Name & Occupation */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 border border-blue-100 text-xs">
                            {client.firstName[0]}
                            {client.lastName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                              {client.firstName} {client.lastName}
                            </p>
                            <p className="text-slate-400 text-[11px] truncate max-w-[180px]">
                              {client.occupation}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-700">{client.email}</p>
                          <p className="text-slate-400">{client.mobileNumber}</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {client.isArchived ? (
                          <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-slate-200 text-slate-700">
                            Archived
                          </span>
                        ) : client.clientStatus === 'Amorsolo Circle' || (client.clientStatus as string) === 'VIP' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-gradient-to-r from-amber-100 via-amber-200/90 to-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                            <Crown className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>Amorsolo Circle</span>
                          </span>
                        ) : client.clientStatus === 'Active' ? (
                          <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        ) : client.clientStatus === 'Prospect' ? (
                          <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-blue-100 text-blue-800">
                            Prospect
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-slate-100 text-slate-700">
                            {client.clientStatus}
                          </span>
                        )}
                      </td>

                      {/* Policies */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <Shield className="w-3.5 h-3.5 text-blue-600" />
                          <span>{policyCount} {policyCount === 1 ? 'Policy' : 'Policies'}</span>
                        </div>
                      </td>

                      {/* Fund Value */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900">
                          ₱{fundValue.toLocaleString()}
                        </span>
                      </td>

                      {/* Client Since */}
                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {new Date(client.clientSince).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onComposeEmail(client)}
                            title="Send Email"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onScheduleAppointment(client)}
                            title="Schedule Meeting"
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                          {client.isArchived ? (
                            <button
                              onClick={() => unarchiveClient(client.id)}
                              title="Restore Client"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => archiveClient(client.id)}
                              title="Archive Client"
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onSelectClient(client)}
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
