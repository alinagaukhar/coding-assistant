import { Button } from '@blueprintjs/core';
import rangeParser from 'parse-numeric-range';
import { FC, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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
      const [isCopied, setIsCopied] = useState(false);
      const setCopied = () => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      };

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
        <div style={{ position: 'relative' }}>
          <CopyToClipboard text={props.children}>
            <Button
              onClick={() => setCopied()}
              style={{ position: 'absolute', top: 5, right: 5, zIndex: 10, cursor: 'pointer' }}
              icon={isCopied ? 'confirm' : 'duplicate'}
              minimal
              large
            />
          </CopyToClipboard>
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
        </div>
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
