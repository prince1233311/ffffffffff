
import React, { useState } from 'react';
import { Layout, Wand2, Loader2, Globe, Diamond, ChevronRight, Download, Eye } from 'lucide-react';
import { generateWebLayout } from '../services/geminiService';
import { WebProject } from '../types';
import JSZip from 'jszip';

interface WebGenViewProps {
  spendDiamonds: (amount: number) => boolean;
  diamonds: number;
  isUnlimited?: boolean;
}

const WebGenView: React.FC<WebGenViewProps> = ({ spendDiamonds, diamonds, isUnlimited }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<WebProject | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    if (!spendDiamonds(15)) {
      alert("Not enough diamonds! Web generation costs 15 💎");
      return;
    }

    setLoading(true);
    try {
      const data = await generateWebLayout(prompt);
      setProject(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = async () => {
    if (!project) return;

    const zip = new JSZip();

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>${project.title}</h1>
            <p class="tagline">${project.description}</p>
        </div>
    </header>

    <main class="container">
        ${project.sections.map(section => `
            <section>
                <h2>${section.heading}</h2>
                <p>${section.content}</p>
            </section>
        `).join('')}
    </main>

    <footer>
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${project.title}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
    `.trim();

    const cssContent = `
:root {
    --primary-color: ${project.primaryColor};
    --text-color: #334155;
    --bg-color: #f8fafc;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: var(--text-color);
    background-color: var(--bg-color);
    line-height: 1.6;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 2rem;
}

header {
    background-color: var(--primary-color);
    color: white;
    padding: 4rem 0;
    text-align: center;
}

header h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.tagline {
    font-size: 1.25rem;
    opacity: 0.9;
}

main {
    padding: 4rem 0;
}

section {
    margin-bottom: 3rem;
}

section h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.5rem;
}

footer {
    background: #f1f5f9;
    padding: 2rem 0;
    text-align: center;
    font-size: 0.875rem;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
}
    `.trim();

    zip.file("index.html", htmlContent);
    zip.file("style.css", cssContent);

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}-website.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          AI Site Architect <Wand2 className="w-7 h-7 text-pink-500" />
        </h2>
        <p className="text-slate-500 mt-2">Professional websites in seconds. {isUnlimited ? 'Unlimited exports enabled.' : 'Now downloadable as ZIP.'}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[40px] border-4 border-white shadow-xl space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-pink-50 text-pink-600 text-xs font-bold rounded-full border border-pink-100">
                {isUnlimited ? 'UNLIMITED' : '15 DIAMONDS'} / PROJECT
              </span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your brand... e.g. 'A sleek portfolio for a digital artist named Luna'"
              className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-pink-50 text-slate-800 h-48 resize-none text-sm"
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-3xl shadow-lg hover:shadow-pink-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Globe className="w-5 h-5" /> Build Website</>}
            </button>

            {project && (
              <button
                onClick={downloadZip}
                className="w-full py-5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-3xl shadow-sm hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" /> Download .ZIP
              </button>
            )}
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[40px] space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" /> Live Preview
            </h4>
            <p className="text-xs text-slate-400">
              The preview window on the right shows a live rendering of your generated code.
            </p>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[40px] overflow-hidden border-[12px] border-slate-100 shadow-2xl relative min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-4 z-10 backdrop-blur-sm">
              <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-bold text-slate-700 text-xl tracking-tight">Coding your site...</p>
            </div>
          ) : project ? (
            <div className="h-full bg-white overflow-y-auto custom-scrollbar">
              <header className="p-10 text-white" style={{ backgroundColor: project.primaryColor }}>
                <h1 className="text-4xl font-black mb-4 tracking-tighter">{project.title}</h1>
                <p className="text-xl opacity-90 leading-relaxed max-w-2xl">{project.description}</p>
              </header>
              <div className="p-10 space-y-12">
                {project.sections.map((section, i) => (
                  <div key={i}>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2" style={{ borderColor: project.primaryColor + '44' }}>
                      {section.heading}
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-lg">{section.content}</p>
                  </div>
                ))}
              </div>
              <footer className="p-10 bg-slate-50 text-center border-t border-slate-100">
                <p className="text-slate-400 text-sm font-medium">© {new Date().getFullYear()} {project.title}.</p>
              </footer>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-50/50">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center">
                 <Layout className="w-10 h-10 opacity-20" />
              </div>
              <p className="font-medium italic text-slate-300">Enter a description to preview your site</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebGenView;
