import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Reads the fence language off the `<code>` element react-markdown nests inside
 * `<pre>`. rehype-highlight writes it as `language-python`, and it is the only
 * place the language survives into the tree.
 */
function fenceLanguage(children: React.ReactNode): string | null {
  const first = Array.isArray(children) ? children[0] : children;
  if (!first || typeof first !== 'object' || !('props' in first)) return null;
  const className = (first as ReactElement<{ className?: string }>).props?.className;
  if (typeof className !== 'string') return null;
  return className.match(/language-([\w+#-]+)/)?.[1] ?? null;
}

/**
 * A code block gets editor chrome: a bar naming the language, then the code
 * pane. The shell of this site is an editor, so a fenced block that renders as
 * flat prose reads as a mistake.
 */
function Pre({ children, ...rest }: ComponentPropsWithoutRef<'pre'>) {
  const lang = fenceLanguage(children);

  return (
    <div className="code-block">
      {lang && (
        <div className="code-block__bar">
          <span className="code-block__lang">{lang}</span>
        </div>
      )}
      <pre {...rest}>{children}</pre>
    </div>
  );
}

/**
 * All article styling lives in the `.prose` block in globals.css so the
 * design system owns it in one place. Piling `prose-*` modifiers here is how
 * the old version ended up with radii and grays that fought the tokens.
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{ pre: Pre }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
