import type {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';
import type {Article, Person, WithContext} from 'schema-dts';
import Newsletter from '@site/src/components/Newsletter';

type Props = WrapperProps<typeof FooterType>;

const author: Person = {
  '@type': 'Person',
  '@id': 'https://www.araelespinosa.me/#person',
  name: 'Arael Espinosa',
  url: 'https://www.araelespinosa.me',
};

export default function FooterWrapper(props: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const {metadata} = useDoc();
  const url = `${siteConfig.url}${metadata.permalink}`;
  const article: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metadata.title,
    description: metadata.description,
    url,
    mainEntityOfPage: url,
    inLanguage: 'es',
    author,
    publisher: author,
    ...(metadata.lastUpdatedAt && {dateModified: new Date(metadata.lastUpdatedAt).toISOString()}),
  };

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(article)}</script>
      </Head>
      <Footer {...props} />
      <Newsletter compact />
    </>
  );
}
