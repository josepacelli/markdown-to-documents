'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import remarkToc from 'remark-toc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { MermaidDiagram } from './MermaidDiagram';
import { limparDiagramaMermaid } from '@/lib/mermaid-cleaner';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return (
    <div className="markdown-preview prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkEmoji, remarkToc, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: (props: any) => <h1 className="text-3xl font-bold text-neutral-900 mt-8 mb-4 border-b-2 border-neutral-200 pb-2" {...props} />,
          h2: (props: any) => <h2 className="text-2xl font-bold text-neutral-800 mt-6 mb-3" {...props} />,
          h3: (props: any) => <h3 className="text-xl font-semibold text-neutral-700 mt-4 mb-2" {...props} />,
          p: (props: any) => <p className="text-neutral-600 leading-relaxed mb-4" {...props} />,
          strong: (props: any) => <strong className="font-semibold text-neutral-900" {...props} />,
          em: (props: any) => <em className="italic text-neutral-700" {...props} />,
          img: (props: any) => {
            const { src, alt, ...rest } = props;
            // Se src estiver vazio ou undefined, não renderizar
            if (!src) {
              return null;
            }
            const altFinal = alt || src?.split('/').pop()?.split('.')[0] || 'Imagem';
            return <img src={src} alt={altFinal} className="max-w-full h-auto rounded-lg my-4 border border-neutral-200" {...rest} />;
          },
          code: (props: any) => {
            const { className, children, ...rest } = props as any;
            const spreadProps = rest as React.HTMLAttributes<HTMLElement>;

            // Detectar se é backticks simples ou triplos pela presença de quebras de linha
            const temQuebrasDelinha = typeof children === 'string' && children.includes('\n');

            // Verificar se é um bloco de código Mermaid
            const linguagem = className?.replace(/language-/, '') || '';

            // Se tem quebras de linha (triplos) e é Mermaid
            if (temQuebrasDelinha && linguagem === 'mermaid' && typeof children === 'string') {
              // Limpar automaticamente <br/> do diagrama
              const diagramaLimpo = limparDiagramaMermaid(children);
              return <MermaidDiagram content={diagramaLimpo} />;
            }

            // Se NÃO tem quebras de linha, é backticks simples (inline)
            if (!temQuebrasDelinha) {
              return (
                <code className="bg-neutral-200 text-neutral-900 px-2 py-1 rounded font-bold text-sm whitespace-nowrap inline" {...spreadProps}>
                  {children}
                </code>
              );
            }

            // Se tem quebras de linha, é backticks triplos (bloco)
            return (
              <code className="bg-neutral-900 text-neutral-50 px-4 py-3 rounded-lg font-mono text-sm block my-4 overflow-x-auto whitespace-pre-wrap break-words" {...spreadProps}>
                {children}
              </code>
            );
          },
          pre: (props: any) => <pre className="bg-neutral-900 text-neutral-50 p-4 rounded-lg overflow-x-auto my-4 border border-neutral-700 whitespace-pre-wrap break-words" {...props} />,
          ul: (props: any) => <ul className="list-disc list-inside space-y-2 mb-4 text-neutral-600" {...props} />,
          ol: (props: any) => <ol className="list-decimal list-inside space-y-2 mb-4 text-neutral-600" {...props} />,
          li: (props: any) => <li className="text-neutral-600" {...props} />,
          blockquote: (props: any) => <blockquote className="border-l-4 border-neutral-300 pl-4 italic text-neutral-600 my-4" {...props} />,
          a: (props: any) => <a className="text-blue-600 hover:text-blue-700 underline hover:underline-offset-2" {...props} />,
          hr: (props: any) => <hr className="border-t border-neutral-200 my-6" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
