import React, { useState } from 'react';
import {
  Mail,
  Send,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Shield,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmailRecord, EmailType, Client, Policy } from '../../types';

interface CommunicationsHubProps {
  onComposeEmail: (client?: Client, policy?: Policy) => void;
}

export const CommunicationsHub: React.FC<CommunicationsHubProps> = ({ onComposeEmail }) => {
  const { emailRecords, clients, policies, settings, isGoogleConnected, googleEmail } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Sent' | 'Failed' | 'Draft'>('All');
  const [selectedRecord, setSelectedRecord] = useState<EmailRecord | null>(null);

  const filteredRecords = emailRecords.filter((rec) => {
    if (statusFilter !== 'All' && rec.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        rec.recipientEmail.toLowerCase().includes(term) ||
        rec.recipientName.toLowerCase().includes(term) ||
        rec.subject.toLowerCase().includes(term) ||
        rec.emailType.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-red-600" />
            <span>Communications Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit log of all client correspondence, automated notices, and test transmissions.
          </p>
        </div>

        <button
          onClick={() => onComposeEmail()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-red-700/25 active:scale-98 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Compose New Email</span>
        </button>
      </div>

      {/* Provider Status Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isGoogleConnected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          ></div>
          <div className="text-xs">
            <span className="font-bold text-slate-800">
              Active Provider: {settings.emailProvider}
            </span>
            <span className="text-slate-500 ml-1.5">
              {settings.emailProvider === 'Gmail' && isGoogleConnected
                ? `(Sending directly via ${googleEmail})`
                : '(Configured in Settings → Email)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Total Transmissions:</span>
          <span className="font-bold text-slate-800">{emailRecords.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Sent', 'Failed', 'Draft'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Email Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No email communication records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 border-b border-slate-200 uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className="hover:bg-slate-50/80 cursor-pointer group transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                        {rec.recipientName}
                      </p>
                      <p className="text-slate-400 text-[11px]">{rec.recipientEmail}</p>
                    </td>

                    <td className="py-3.5 px-4 max-w-[280px]">
                      <p className="font-semibold text-slate-800 truncate">{rec.subject}</p>
                      {rec.relatedPolicyNumber && (
                        <span className="text-[10px] text-slate-400">
                          Policy #{rec.relatedPolicyNumber}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {rec.emailType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">{rec.provider}</td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {rec.sentAt
                        ? new Date(rec.sentAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          rec.status === 'Sent'
                            ? 'bg-emerald-50 text-emerald-700'
                            : rec.status === 'Failed'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Email Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 lg:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Outbound Email Record
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {selectedRecord.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 border border-slate-100">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Recipient:</span>
                <span className="font-bold text-slate-900">
                  {selectedRecord.recipientName} ({selectedRecord.recipientEmail})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Delivery Status:</span>
                <span className="font-bold text-emerald-600">{selectedRecord.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Provider:</span>
                <span className="font-bold text-slate-900">{selectedRecord.provider}</span>
              </div>
              {selectedRecord.googleMessageId && (
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Message ID:</span>
                  <span className="text-slate-700">{selectedRecord.googleMessageId}</span>
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Rendered Content
              </span>
              <div
                className="p-4 border border-slate-200 rounded-xl bg-white max-h-80 overflow-y-auto shadow-inner"
                dangerouslySetInnerHTML={{ __html: selectedRecord.bodyHtml }}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
