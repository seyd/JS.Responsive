# How to contribute

It's important to us that you feel you can contribute towards the evolution of JS.Responsive. This can take many forms: from helping to fix bugs or improve the docs, to adding in new features to the source. This guide should help you in making that process as smooth as possible.

Before contributing, please read the [code of conduct](https://github.com/seyd/JS.Responsive/blob/master/CODE_OF_CONDUCT.md).

## Reporting issues

[GitHub Issues][0] is the place to report bugs you may have found in either the core library or any of the examples that are part of the repository. When submitting a bug please do the following:

**1. Search for existing issues.** Your bug may have already been fixed or addressed in a development branch version of Dragular, so be sure to search the issues first before putting in a duplicate issue.

**2. Not sure if it's a bug?.** Then please ask via issues and tag it [question].

**3. Create an isolated and reproducible test case.** If you are reporting a bug, make sure you also have a minimal, runnable, code example that reproduces the problem you have.

**4. Include a live example.** After narrowing your code down to only the problem areas, make use of [jsFiddle][1], [jsBin][2], or a link to your live site so that we can view a live example of the problem. (you can start by forking [this fiddle](http://jsfiddle.net/luckylooke/afv234uh/4/))

**5. Share as much information as possible.** Include browser version affected, your OS, version of the library, steps to reproduce, etc. "X isn't working!!!1!" will probably just be closed.


## Making Changes

You can download node.js from [nodejs.org][3].

After that you can clone the repository and run `npm i` inside the cloned folder. This will install dependencies necessary for building the project.

### Developing

There are several gulp tasks that are used for generating different builds:

* `npm run build` - produces production version of your library under the `lib` folder
* `npm run dev` - produces development version of your library and runs a watcher
* `npm run test` - well ... it runs the tests :)

### Linting

- `gulp lint` & `gulp lint:docs` - Lint JavaScript files.

### Making a pull request

Once that is ready, make your changes and submit a Pull Request:

- **Send Pull Requests directly to `master` branch.

- **Ensure changes are eslint validated.**

- **Only commit relevant changes.** Don't include changes that are not directly relevant to the fix you are making. The more focused a PR is, the faster it will get attention and be merged. Extra files changing only whitespace or trash files will likely get your PR closed.


Dependencies for building from source and running tests:


## Coding style preferences are not contributions

If your PR is doing little more than changing the JS.Responsive source code into a format / coding style that you prefer then we will automatically close it. All PRs must adhere to the coding style already set-out across the lines of code in Dragular. Your personal preferences for how things should "look" or be structured do not apply here, sorry. PRs should fix bugs, fix documentation or add features. No changes for the sake of change.


## I don't really like git / node.js, but I can fix this bug

That is fine too. While Pull Requests are the best thing in the world for us, they are not the only way to help. You're welcome to post fixes to our forum or even just email them to us. All we ask is that you still adhere to the guidelines presented here re: JSHint, etc.


[0]: https://github.com/seyd/JS.Responsive/issues
[1]: http://jsfiddle.net
[2]: http://jsbin.com/
[3]: http://nodejs.org