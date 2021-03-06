---
sidebar_position: 1
---

# Guidelines for Contributors

We have two branches which are required from development to deployment of the website.
1. **Main** - contains all the necessary code (docs, configurations files). This is the main working repository.
2. **gh-pages** - contains HTML files which will be rendered on the website.

## Procedure
First clone the repository. Then run the following commands:

```bsh
$ cd CodePrime && npm install
```

This will install all the required packages needed to run the website.

**Make sure your node version is >= 13.**

## Docs

In CodePrime, the folders name ```docs``` contain all the .md and folder configuration files.

After adding content in the ```docs``` folder, run the following command to build the HTML files.

```bsh
$ npm build
```

HTML files will be created in ```build``` folder.

After that, commit all the changes and push it to the ```main branch```. Once this done, push build HTML to ```gh-pages branch``` using the following command

```git
git subtree push --prefix build origin gh-pages
```
