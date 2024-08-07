function writerOpts() {
  return {
    ...base.writerOpts,

  };
}

/**
 * ## Config Semantic-release
 * @type {import('semantic-release').GlobalConfig}
 */
const config = {
  branches: [
    "lib", // Основная ветка для стабильных релизов
    {
      name: "library/next", // Ветка для следующей версии
      prerelease: "next" // Включает предварительные версии с префиксом next, например, 1.0.0-next.1
    },
    {
      name: "library/beta", // Ветка для бета-версий
      prerelease: "beta", // Включает предварительные версии с префиксом beta, например, 1.0.0-beta.1
      channel: "beta" // Публикация на beta канал
    },
    {
      name: "library/develop", // Ветка для разработки
      prerelease: "alpha" // Включает предварительные версии с префиксом alpha, например, 1.0.0-alpha.1
    }
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: "angular",
        releaseRules: [
          {type: 'build', release: 'patch'}, // Сборка
          {type: 'ci', release: 'patch'}, // Непрерывная интеграция
          {type: 'docs', release: 'patch'}, // Документация
          {type: 'refactor', release: 'patch'}, // Рефакторинг кода
          {type: 'chore', release: 'patch'}, // Внутренние изменения
          {type: 'revert', release: 'patch'}, // Отмена предыдущего коммита
          {type: 'style', release: 'patch'}, // Изменения в стиле кода
          {type: 'test', release: 'patch'}, // Добавление или исправление тестов
          {type: 'fix', release: 'patch'}, // Исправление ошибок
          {type: 'feat', release: 'minor'}, // Новая функциональность
          {type: 'perf', release: 'minor'}, // Улучшение производительности
          {breaking: true, release: 'major'}, // BREAKING CHANGE
          {scope: 'no-release', release: false},
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
        },
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "angular",
        writerOpts: {
          commitsSort: ['subject', 'scope'],
          transform: (commit, context) => {
            console.log("==========================================")
            console.log("commit.notes: ", JSON.stringify(commit.notes))
            console.log("commit.type: ", JSON.stringify(commit.type))
            console.log("commit.scope: ", JSON.stringify(commit.scope))
            console.log("commit.hash: ", JSON.stringify(commit.hash))
            console.log("commit.subject: ", JSON.stringify(commit.subject))
            console.log("commit.references: ", JSON.stringify(commit.references))
            console.log("context.repository: ", JSON.stringify(context.repository))
            console.log("context.host: ", JSON.stringify(context.host))
            console.log("context.owner: ", JSON.stringify(context.owner))
            console.log("context.repoUrl: ", JSON.stringify(context.repoUrl))
            console.log("==========================================")
            const issues = [];

            commit.notes.forEach(note => {
              note.title = `⚠️ BREAKING CHANGES`;
            });

            switch (commit.type) {
              case `feat`:
                commit.type = `🌟🚀 Features`;
                break;
              case `fix`:
                commit.type = `🐛 Bug Fixes`;
                break;
              case `perf`:
                commit.type = `🏃 Performance Improvements`;
                break;
              case `revert`:
                commit.type = `🦖 Reverts`;
                break;
              case `docs`:
                commit.type = `📖 Documentation`;
                break;
              case `polish`:
                commit.type = `💄 Polish`;
                break;
              case `refactor`:
                commit.type = `📦 Code Refactor`;
                break;
              case `test`:
                commit.type = `🔬 Tests`;
                break;
              case `build`:
              case `ci`:
                commit.type = `🔧 Build / Continuous Integration`;
                break;
              default:
                commit.type = `🧦 Miscellaneous`;
                break;
            }

            if (commit.scope === `*`) {
              commit.scope = ``;
            }

            if (typeof commit.hash === `string`) {
              commit.hash = commit.hash.substring(0, 7);
            }

            if (typeof commit.subject === `string`) {
              if (commit.subject.indexOf('skip-changelog') >= 0) {
                return;
              }
              if (commit.subject.indexOf('Merge pull request') >= 0) {
                return;
              }
              let url = context.repository
                ? `${context.host}/${context.owner}/${context.repository}`
                : context.repoUrl;
              if (url) {
                url = `${url}/issues/`;
                // Issue URLs.
                commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
                  issues.push(issue);
                  return `[#${issue}](${url}${issue})`;
                });
              }
              if (context.host) {
                // User URLs.
                commit.subject = commit.subject.replace(
                  /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
                  (_, username) => {
                    if (username.includes('/')) {
                      return `@${username}`;
                    }

                    return `[@${username}](${context.host}/${username})`;
                  }
                );
              }
            }

            // remove references that already appear in the subject
            commit.references = commit.references.filter(reference => {
              if (issues.indexOf(reference.issue) === -1) {
                return true;
              }

              return false;
            });

            return commit;
          }
        },
        presetConfig: {
          types: [
            {type: 'feat', section: 'Features', hidden: false},
            {type: 'fix', section: 'Bug Fixes', hidden: false},
            {type: 'chore', section: 'Chores', hidden: true},
            {type: 'docs', section: 'Documentation', hidden: false},
            {type: 'style', section: 'Styles', hidden: false},
            {type: 'refactor', section: 'Code Refactoring', hidden: false},
            {type: 'perf', section: 'Performance Improvements', hidden: false},
            {type: 'test', section: 'Tests', hidden: false},
            {type: 'build', section: 'Build System', hidden: false},
            {type: 'ci', section: 'Continuous Integration', hidden: false},
            {type: 'revert', section: 'Reverts', hidden: false},
          ],
        },
      }
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        changelogTitle: '# CHANGELOG'
      }
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'lib'
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json", "lib/package.json"],
        message: "release(${nextRelease.version}): [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {path: 'dist/*.zip', label: 'Distribution'},
          {path: 'build/coverage.xml', label: 'Coverage Report'},
        ],
        successComment: false,
        failComment: false,
        releasedLabels: ['released'],
        addReleases: 'bottom',
      },
    ],
  ]
}

module.exports = config
