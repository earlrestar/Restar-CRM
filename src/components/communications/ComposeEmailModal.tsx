import React, { useState, useEffect } from 'react';
import { X, Send, Mail, User, Shield, FileText, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Client, Policy, EmailType } from '../../types';

interface ComposeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedClient?: Client;
  preselectedPolicy?: Policy;
}

export const ComposeEmailModal: React.FC<ComposeEmailModalProps> = ({
  isOpen,
  onClose,
  preselectedClient,
  preselectedPolicy,
}) => {
  const {
    clients,
    policies,
    templates,
    renderTemplate,
    sendCustomEmail,
    settings,
    isGoogleConnected,
  } = useApp();

  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [clientId, setClientId] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [emailType, setEmailType] = useState<EmailType>('Custom');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (preselectedClient) {
      setClientId(preselectedClient.id);
      setRecipientEmail(preselectedClient.email);
      setRecipientName(`${preselectedClient.firstName} ${preselectedClient.lastName}`);
    }
    if (preselectedPolicy) {
      setPolicyId(preselectedPolicy.id);
    }
  }, [preselectedClient, preselectedPolicy]);

  if (!isOpen) return null;

  const handleClientChange = (cId: string) => {
    setClientId(cId);
    const c = clients.find((item) => item.id === cId);
    if (c) {
      setRecipientEmail(c.email);
      setRecipientName(`${c.firstName} ${c.lastName}`);
      const clientPols = policies.filter((p) => p.clientId === c.id);
      if (clientPols.length > 0) {
        setPolicyId(clientPols[0].id);
      }
    }
  };

  const handleTemplateSelect = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;

    setEmailType(tpl.category);

    const client = clients.find((c) => c.id === clientId) || clients[0];
    const policy = policies.find((p) => p.id === policyId);

    const { renderedSubject, renderedBody } = renderTemplate(
      tpl.content,
      tpl.subject,
      client,
      policy
    );
    setSubject(renderedSubject);
    setBodyHtml(renderedBody);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !subject || !bodyHtml) return;

    setIsSending(true);
    const pol = policies.find((p) => p.id === policyId);

    const res = await sendCustomEmail({
      recipientEmail,
      recipientName: recipientName || recipientEmail,
      subject,
      htmlBody: bodyHtml,
      emailType,
      relatedClientId: clientId || undefined,
      relatedPolicyId: policyId || undefined,
      relatedPolicyNumber: pol?.policyNumber,
    });

    setIsSending(false);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 lg:p-8 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Compose Client Email</h2>
              <p className="text-xs text-slate-500">
                Transmitted directly via {settings.emailProvider} API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isGoogleConnected && settings.emailProvider === 'Gmail' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Gmail Not Connected:</span> Connect your Google Account in
              Settings → Integrations to send programmatic emails from your Gmail account.
            </div>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4 text-xs">
          {/* Select Client & Policy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 uppercase">Select Client</label>
              <select
                value={clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                <option value="">Manual email address...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 uppercase">Load Pre-Built Template</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                <option value="">Choose a template to populate...</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.category}] {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 uppercase">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Maria Santos"
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 uppercase">Recipient Email *</label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="client@gmail.com"
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <label className="font-bold text-slate-700 uppercase">Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. InLife Policy Review & Fund Update"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          {/* Body */}
          <div>
            <label className="font-bold text-slate-700 uppercase">Email Content (HTML)</label>
            <textarea
              rows={8}
              required
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              className="w-full mt-1 p-3 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 active:scale-98"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending via Gmail...' : 'Send Email Now'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
