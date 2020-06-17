# Contributing
1. Fork this repository and clone it to your machine
2. Run `npm install`
3. Run `npm run serve` to start the app
4. Make your changes conforming to our code style
    - We recommend enabling ESLint in your editor to make this easier.
    - Add/update unit tests if necessary.
5. Commit, keeping the following rules in mind:
    - We use [Conventional Commits] and [semantic-release] to simplify the process of releasing updates by automating release notes and changelogs based on the rules of [@commitlint/config-conventional].
    - If your commit messages aren't formatted according to these rules, Git hooks will prevent you from committing your changes.
6. Create a pull request
   - Keep your pull requests focused on single subjects.
   - Please explain what you changed and why.
   - We will check your code and thoroughly test it before merging.

[Conventional Commits]: https://www.conventionalcommits.org/en/v1.0.0/#summary
[@commitlint/config-conventional]: https://github.com/conventional-changelog/commitlint
[semantic-release]: https://github.com/semantic-release/semantic-release
