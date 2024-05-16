import rangeParser from 'parse-numeric-range';
import { FC } from 'react';
import Markdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import remarkGfm from 'remark-gfm';

type MarkdownProps = {
  markdown: string & { content?: string };
};

// MarkdownComponent is a functional component that renders markdown content with code syntax highlighting.
const MarkdownComponent: FC<MarkdownProps> = ({ markdown }) => {
  const syntaxTheme = dracula;

  const MarkdownComponents: object = {
    code({ node, inline, className, ...props }: any) {
      const hasLang = /language-(\w+)/.exec(className || '');
      const hasMeta = node?.data?.meta;

      const applyHighlights: object = (applyHighlights: number) => {
        if (hasMeta) {
          const RE = /{([\d,-]+)}/;
          const metadata = node.data.meta?.replace(/\s/g, '');
          const strlineNumbers = RE?.test(metadata) ? RE?.exec(metadata)![1] : '0';
          const highlightLines = rangeParser(strlineNumbers);
          const highlight = highlightLines;
          const data = highlight.includes(applyHighlights) ? 'highlight' : null;
          return { data };
        } else {
          return {};
        }
      };

      return hasLang ? (
        <SyntaxHighlighter
          style={syntaxTheme}
          language={hasLang[1]}
          PreTag="div"
          className="codeStyle"
          showLineNumbers={true}
          wrapLines={hasMeta}
          useInlineStyles={true}
          lineProps={applyHighlights}
        >
          {props.children}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props} />
      );
    },
  };

  return (
    <Markdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
      {markdown}
    </Markdown>
  );
};

export default MarkdownComponent;
