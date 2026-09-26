import React from 'react';
import { FileText, Download, Plus, Search, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DocumentsView: React.FC = () => {
  const { documents, clients, openClientProfile, showToast, setActiveView } = useApp();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-red-600" />
            <span>Digital Document Archive</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Archived client policy contracts, e-proposals, proof of remittances, and KYC declaration forms.
          </p>
        </div>

        <button
          onClick={() => setActiveView('csv_templates')}
          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-2xs shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>View CSV Data Templates</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const client = clients.find((c) => c.id === doc.clientId);
          return (
            <div key={doc.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  PDF
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 bg-slate-100 rounded">
                  {doc.category}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Client:{' '}
                  <span
                    onClick={() => client && openClientProfile(client.id)}
                    className="text-red-600 font-semibold cursor-pointer hover:underline"
                  >
                    {client ? `${client.firstName} ${client.lastName}` : 'Client'}
                  </span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{doc.fileName} • {doc.fileSize}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{doc.uploadDate}</span>
                <button
                  onClick={() => showToast(`Downloaded ${doc.fileName}`, 'success')}
                  className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
