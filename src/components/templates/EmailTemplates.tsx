import React, { useState } from 'react';
import {
  FileCode,
  FileSpreadsheet,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  Heading,
  Square,
  Minus,
  CheckCircle,
  Copy,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmailTemplate, EmailType, Client, Policy } from '../../types';

export const EmailTemplates: React.FC = () => {
  const {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    clients,
    policies,
    renderTemplate,
    sendCustomEmail,
    isGoogleConnected,
    settings,
    showToast,
    setActiveView,
    currentBrand,
  } = useApp();

  const brandColor = currentBrand?.primaryColor || '#00529B';

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Template Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<EmailType>('Premium Reminder');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');

  // Preview Modal State
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [previewClient, setPreviewClient] = useState<Client>(clients[0]);

  // Test Email Modal State
  const [testEmailTemplate, setTestEmailTemplate] = useState<EmailTemplate | null>(null);
  const [testRecipient, setTestRecipient] = useState(settings.advisorEmail || 'earlrestarpogi@gmail.com');
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Link Dialog State (Section 18)
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState('Schedule your policy review');
  const [linkUrl, setLinkUrl] = useState('{{review_link}}');
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(true);

  // Button Dialog State (Section 19)
  const [showButtonDialog, setShowButtonDialog] = useState(false);
  const [btnText, setBtnText] = useState('BOOK A CONSULTATION');
  const [btnUrl, setBtnUrl] = useState('{{calendar_link}}');
  const [btnAlign, setBtnAlign] = useState<'center' | 'left' | 'right'>('center');
  const [btnRadius, setBtnRadius] = useState('6px');

  const categories: Array<EmailType | 'All'> = [
    'All',
    'Birthday',
    'Premium Reminder',
    'Overdue Premium',
    'Policy Anniversary',
    'Annual Review',
    'Newsletter',
    'Holiday Greeting',
    'Appointment Confirmation',
    'Appointment Reminder',
    'Thank You',
    'Welcome',
    'Custom',
  ];

  const filteredTemplates = templates.filter((tpl) => {
    if (activeCategory === 'All') return true;
    return tpl.category === activeCategory;
  });

  const handleStartCreate = () => {
    setName('');
    setCategory('Premium Reminder');
    setSubject('InLife Notice: {{product_name}} (Policy #{{policy_number}})');
    setContent(`<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <p>Dear <strong>{{first_name}}</strong>,</p>
  <p>We hope this email finds you well. Here is an important update regarding your InLife protection portfolio.</p>
  <p>Warm regards,<br/><strong>{{advisor_name}}</strong></p>
</div>`);
    setDescription('Custom adviser template');
    setIsCreating(true);
    setEditingTemplate(null);
  };

  const handleStartEdit = (tpl: EmailTemplate) => {
    setEditingTemplate(tpl);
    setName(tpl.name);
    setCategory(tpl.category);
    setSubject(tpl.subject);
    setContent(tpl.content);
    setDescription(tpl.description);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) return;

    if (editingTemplate) {
      updateTemplate(editingTemplate.id, {
        name,
        category,
        subject,
        content,
        description,
      });
    } else {
      addTemplate({
        name,
        category,
        subject,
        content,
        description,
      });
    }
    setIsCreating(false);
    setEditingTemplate(null);
  };

  // Merge tag inserter
  const insertMergeTag = (tag: string) => {
    setContent((prev) => prev + tag);
    showToast(`Inserted variable ${tag}`, 'info');
  };

  // Insert Link from dialog
  const handleInsertLink = () => {
    const target = linkOpenNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const linkHtml = `<a href="${linkUrl}"${target} style="color: ${brandColor}; text-decoration: underline; font-weight: bold;">${linkText}</a>`;
    setContent((prev) => prev + linkHtml);
    setShowLinkDialog(false);
    showToast('Hyperlink inserted into template!', 'success');
  };

  // Insert Button from dialog
  const handleInsertButton = () => {
    const buttonHtml = `
<div style="text-align: ${btnAlign}; margin: 24px 0;">
  <a href="${btnUrl}" target="_blank" rel="noopener noreferrer" style="background-color: ${brandColor}; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: ${btnRadius}; font-weight: bold; display: inline-block; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">${btnText}</a>
</div>`;
    setContent((prev) => prev + buttonHtml);
    setShowButtonDialog(false);
    showToast('Call-to-action button inserted!', 'success');
  };

  // Handle Send Test Email (Section 23)
  const handleSendTestEmail = async () => {
    if (!testEmailTemplate) return;

    if (!isGoogleConnected && settings.emailProvider === 'Gmail') {
      showToast('Gmail is not connected. Connect your Google account to send email.', 'error');
      return;
    }

    setIsSendingTest(true);
    const sampleClient = previewClient || clients[0];
    const samplePolicy = policies.find((p) => p.clientId === sampleClient.id) || policies[0];

    const { renderedSubject, renderedBody } = renderTemplate(
      testEmailTemplate.content,
      testEmailTemplate.subject,
      sampleClient,
      samplePolicy
    );

    const res = await sendCustomEmail({
      recipientEmail: testRecipient,
      recipientName: 'Test Recipient',
      subject: `[TEST] ${renderedSubject}`,
      htmlBody: renderedBody,
      emailType: testEmailTemplate.category,
    });

    setIsSendingTest(false);
    if (res.success) {
      showToast(`Test email sent successfully to ${testRecipient}!`, 'success');
      setTestEmailTemplate(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Template Suite Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            style={{ backgroundColor: currentBrand.primaryColor }}
            className="px-4 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-default"
          >
            <FileCode className="w-4 h-4 text-white" />
            <span>Email Templates</span>
          </button>
          <button
            onClick={() => setActiveView('csv_templates')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>CSV Templates & Import</span>
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
          {currentBrand.name} Adviser Template Hub
        </span>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileCode className="w-6 h-6 text-blue-600" />
            <span>Email Template Builder</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Craft rich email communications with customizable buttons, hyperlinks, and dynamic merge tags.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          style={{ backgroundColor: currentBrand.primaryColor }}
          className="px-4 py-2 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md active:scale-98 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Template</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={isActive ? { backgroundColor: currentBrand.primaryColor, color: '#ffffff' } : undefined}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {tpl.category}
                </span>
                {tpl.isDefault && (
                  <span className="text-[10px] font-bold text-slate-400">{currentBrand.shortName} Official</span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{tpl.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{tpl.description}</p>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Subject:</span>
                <p className="text-xs text-slate-800 font-medium truncate">{tpl.subject}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setPreviewTemplate(tpl);
                    setPreviewClient(clients[0]);
                  }}
                  className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded font-semibold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => {
                    setTestEmailTemplate(tpl);
                  }}
                  className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 rounded font-bold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  <span>Send Test</span>
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(tpl)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                  title="Edit Template"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                {!tpl.isDefault && (
                  <button
                    onClick={() => deleteTemplate(tpl.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete Template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Editor Drawer / Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 lg:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {editingTemplate ? `Edit Template: ${editingTemplate.name}` : 'New Email Template'}
                </h2>
                <p className="text-xs text-slate-500">
                  Compose HTML email with dynamic merge fields, rich buttons, and hyperlinks.
                </p>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 uppercase">Template Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amorsolo Circle Birthday Greeting"
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EmailType)}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase">Email Subject Line *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. InLife Reminder for {{first_name}}"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase">Template Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief explanation of when to trigger this template..."
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Rich Editing Toolbar (Buttons, Links, Formatting, Merge Variables) */}
              <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-700 uppercase text-[11px]">
                    Editor Tools & Interactive Elements
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Hyperlink Dialog Button */}
                    <button
                      type="button"
                      onClick={() => setShowLinkDialog(true)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>🔗 Insert Link</span>
                    </button>

                    {/* Email Button Dialog */}
                    <button
                      type="button"
                      onClick={() => setShowButtonDialog(true)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>+ Email Button</span>
                    </button>
                  </div>
                </div>

                {/* Merge Variables Palette */}
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1.5">
                    Click to Insert Dynamic Merge Variables:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '{{first_name}}',
                      '{{last_name}}',
                      '{{preferred_name}}',
                      '{{product_name}}',
                      '{{policy_number}}',
                      '{{premium_amount}}',
                      '{{due_date}}',
                      '{{fund_value}}',
                      '{{advisor_name}}',
                      '{{advisor_email}}',
                      '{{advisor_phone}}',
                      '{{birthday}}',
                      '{{client_since}}',
                      '{{review_link}}',
                      '{{calendar_link}}',
                      '{{payment_link}}',
                      '{{policy_portal_link}}',
                      '{{website_link}}',
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertMergeTag(tag)}
                        className="px-2 py-0.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded font-mono text-[11px] transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Template Body */}
              <div>
                <label className="font-bold text-slate-700 uppercase">Template Body (HTML / Formatted Text)</label>
                <textarea
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full mt-1 p-3 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Save Email Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hyperlink Dialog (Section 18) */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-blue-600" />
              <span>Insert Clickable Hyperlink</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase">Display Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Schedule your policy review"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase">Destination URL or Merge Field</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or {{review_link}}"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                />
                <div className="flex gap-1.5 mt-1.5">
                  <span className="text-[10px] text-slate-400">Quick:</span>
                  {['{{review_link}}', '{{payment_link}}', '{{calendar_link}}'].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setLinkUrl(q)}
                      className="text-[10px] text-blue-600 hover:underline"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={linkOpenNewTab}
                  onChange={(e) => setLinkOpenNewTab(e.target.checked)}
                  className="rounded text-blue-600 accent-blue-600 w-4 h-4"
                />
                <span className="font-semibold text-slate-700">Open link in new tab</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Button Dialog (Section 19) */}
      {showButtonDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Square className="w-4 h-4 text-blue-600" />
              <span>Insert Call-To-Action Button</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase">Button Label</label>
                <input
                  type="text"
                  value={btnText}
                  onChange={(e) => setBtnText(e.target.value)}
                  placeholder="e.g. BOOK A CONSULTATION"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none uppercase font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase">Button URL</label>
                <input
                  type="text"
                  value={btnUrl}
                  onChange={(e) => setBtnUrl(e.target.value)}
                  placeholder="https://example.com/appointment or {{calendar_link}}"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 uppercase">Alignment</label>
                  <select
                    value={btnAlign}
                    onChange={(e) => setBtnAlign(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase">Border Radius</label>
                  <select
                    value={btnRadius}
                    onChange={(e) => setBtnRadius(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="6px">Rounded (6px)</option>
                    <option value="12px">Soft (12px)</option>
                    <option value="999px">Pill (Full)</option>
                    <option value="0px">Square (0px)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowButtonDialog(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertButton}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
              >
                Insert Button
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal (Section 22) */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 lg:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Email Live Preview</h3>
                <p className="text-xs text-slate-500">
                  Rendered with real client information and custom links.
                </p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Client Picker for Preview */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase">Preview As Client:</span>
              <select
                value={previewClient?.id}
                onChange={(e) => {
                  const c = clients.find((item) => item.id === e.target.value);
                  if (c) setPreviewClient(c);
                }}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-semibold focus:outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Rendered Subject */}
            {(() => {
              const samplePolicy = policies.find((p) => p.clientId === previewClient?.id) || policies[0];
              const { renderedSubject, renderedBody } = renderTemplate(
                previewTemplate.content,
                previewTemplate.subject,
                previewClient,
                samplePolicy
              );

              return (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-100 rounded-lg text-xs">
                    <span className="font-bold text-slate-500 uppercase">Subject:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{renderedSubject}</p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 bg-white max-h-96 overflow-y-auto shadow-inner">
                    <div dangerouslySetInnerHTML={{ __html: renderedBody }} />
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Test Email Modal (Section 23) */}
      {testEmailTemplate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              <span>Send Test Email</span>
            </h3>
            <p className="text-xs text-slate-500">
              Send a test delivery of <strong>"{testEmailTemplate.name}"</strong> using {settings.emailProvider}.
            </p>

            {!isGoogleConnected && settings.emailProvider === 'Gmail' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>Gmail is not connected. Connect your Google account in Settings to send email.</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Recipient Email Address</label>
              <input
                type="email"
                required
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                placeholder="e.g. your-email@gmail.com"
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setTestEmailTemplate(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTest}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingTest ? 'Sending...' : 'Send Test Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
