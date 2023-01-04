import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'High quality blogs on data structures and algorithms',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Our website features in-depth and expertly written blogs on various topics related to data structures and algorithms. These blogs are aimed at helping our readers understand these complex concepts in a more comprehensive and easy to follow manner.
      </>
    ),
  },
  {
    title: 'Text and code solution of questions asked in interviews and coding rounds',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Our website offers comprehensive solutions to various questions asked in coding interviews and rounds. These solutions come with detailed explanations and accompanying code, helping our readers understand the thought process behind solving these problems.
      </>
    ),
  },
  {
    title: 'Expert guidance and support',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Our team of experts is always available to provide guidance and support to our readers. Whether you have a question about a specific data structure or algorithm, or you need help with a coding problem, our experts are here to help you out.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container text--center">
        <h2>
          What we Offer
        </h2>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
