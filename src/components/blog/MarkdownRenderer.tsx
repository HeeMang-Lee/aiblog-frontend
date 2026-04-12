import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose prose-lg max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-accent prose-strong:text-text-primary prose-code:rounded prose-code:bg-bg-code prose-code:px-1.5 prose-code:py-0.5 prose-code:text-text-primary prose-pre:bg-bg-code prose-pre:text-text-secondary prose-blockquote:border-accent prose-blockquote:text-text-secondary prose-li:text-text-secondary prose-hr:border-border-primary prose-th:text-text-primary prose-td:text-text-secondary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
