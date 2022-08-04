---
sidebar_position: 1
---

# Guidelines for Contributors

We welcome every kind of contribution that can help us improve the website.
We accept only the programming-related contribution.

---
## How to Contribute?

The following branches are required from development to deployment of the website.
1. **Main** - contains all the necessary code (docs, configurations files). This is the main working branch.
2. **gh-pages** - is the build version of the main branch.

## Procedure
First, clone the repository. Then run the following command:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="npm" label="npm">

```bsh
$ cd CodePrime && npm install
```
</TabItem>
<TabItem value="yarn" label="yarn">

```bsh
$ cd CodePrime && yarn install
```
</TabItem>
</Tabs>

This will install all the required packages needed to run the website.

**Make sure your node version is >= 13.**

## Docs

In CodePrime, the folders name ```docs``` contain all the .md and folder configuration files.

After adding content to the ```docs``` folder, run the following command to build the HTML files.


<Tabs>
<TabItem value="npm" label="npm">

```bsh
$ npm build
```
</TabItem>
<TabItem value="yarn" label="yarn">

```bsh
$ yarn build
```

</TabItem>
</Tabs>

The website's build version will be in the ``build``` folder.

After that, commit all the changes and push them to the ```main branch```. Once this is done, push build to ```gh-pages branch``` using the following command.

```git
git subtree push --prefix build origin gh-pages
```

