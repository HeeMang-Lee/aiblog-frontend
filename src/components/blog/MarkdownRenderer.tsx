import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react';
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
function fenceLanguage(children: ReactNode): string | null {
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

type ImageElement = ReactElement<{ src?: string; alt?: string }>;

/** 문단 안에 이미지 하나만 있는지. 앞뒤 공백 문자열은 무시한다. */
function loneImage(children: ReactNode): ImageElement | null {
  const kids = Children.toArray(children).filter(
    (child) => !(typeof child === 'string' && !child.trim())
  );
  if (kids.length !== 1) return null;
  const only = kids[0];
  if (!isValidElement(only) || only.type !== 'img') return null;
  return only as ImageElement;
}

/**
 * 이미지만 있는 문단은 `<figure>` 로 바꾸고 캡션을 화면에 보여 준다.
 *
 * 노션에서 이미지 아래에 쓴 캡션이 마크다운의 대체 텍스트로 넘어오는데,
 * 대체 텍스트는 눈에 보이지 않는다. 노션에서는 보이던 글이 사이트에서
 * 사라지는 셈이라 빠진 것처럼 읽힌다. 검색에도 눈에 보이는 캡션이 alt 보다
 * 강한 신호다.
 *
 * 캡션을 띄울 때는 이미지의 alt 를 비운다. 같은 문장이 캡션과 대체 텍스트에
 * 둘 다 있으면 화면 낭독기가 두 번 읽는다. figure 가 figcaption 을 그림의
 * 설명으로 묶어 주므로 alt 는 비어 있는 편이 맞다.
 *
 * p 안에 figure 를 넣을 수 없어서 문단 자체를 바꾼다. 브라우저가 p 를
 * 강제로 닫아 버려서 레이아웃이 어긋난다.
 */
function Paragraph({ children, ...rest }: ComponentPropsWithoutRef<'p'>) {
  const image = loneImage(children);
  if (!image) return <p {...rest}>{children}</p>;

  const caption = image.props.alt?.trim();
  if (!caption) return <p {...rest}>{children}</p>;

  return (
    <figure className="figure">
      {cloneElement(image, { alt: '' })}
      <figcaption>{caption}</figcaption>
    </figure>
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
        components={{ pre: Pre, p: Paragraph }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
