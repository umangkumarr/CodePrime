# Guidelines for contributors

We have two folders which are required from development to deployment of the website.
1. [CodePrime](https://github.com/umangkumarr/CodePrime) - contains all the necessary code (docs, configurations files). This is the main working repo.
2. [CP](https://github.com/umangkumarr/CP) - contains HTML files which will be rendered on the website.


---
## Procedure
First clone both the repositories. Then run the following commands:
```bsh
$ cd CodePrime && npm install
```
This will install all the required packages need to run the website.

**Make sure your node version is >= 13.**

## Docs

In CodePrime, the folders name ```docs``` will contain all the .md and folder configuration files.

After adding content in the ```docs``` folder run the following command to build the HTML files. Html files will be created in CodePrime/build folders.

```bsh
npm build
```

After that, replace all the HTML files in the CP folders by the HTML files in the CodePrime/build folder. Then push all the changes to github(CodePrime & CP).
