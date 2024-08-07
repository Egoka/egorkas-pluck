/**
 * ## Config Semantic-release
 * @type {import('semantic-release').GlobalConfig}
 */
const config = {
  branches: [
    "lib", // Основная ветка для стабильных релизов
    {
      name: "library/next", // Ветка для следующей версии
      prerelease: true, // Включает предварительные версии, например, 1.0.0-next.1
    },
    {
      name: "library/beta", // Ветка для бета-версий
      prerelease: true, // Включает предварительные версии, например, 1.0.0-beta.1
      channel: "beta", // Публикация на beta канал
    },
    {
      name: "library/develop", // Ветка для разработки
      prerelease: "alpha", // Включает предварительные версии с префиксом alpha, например, 1.0.0-alpha.1
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
            console.log("commit: ", JSON.stringify(commit))
            console.log("context: ", JSON.stringify(context))
            let discard = true;
            const issues = [];

            commit.notes.forEach(note => {
              note.title = 'BREAKING CHANGES';
              discard = false;
            });

            if (commit.type === 'feat') {
              commit.type = 'Features';
            } else if (commit.type === 'fix') {
              commit.type = 'Bug Fixes';
            } else if (commit.type === 'perf') {
              commit.type = 'Performance Improvements';
            } else if (commit.type === 'revert') {
              commit.type = 'Reverts';
            } else if (discard) {
              return;
            } else if (commit.type === 'docs') {
              commit.type = 'Documentation';
            } else if (commit.type === 'style') {
              commit.type = 'Styles';
            } else if (commit.type === 'refactor') {
              commit.type = 'Code Refactoring';
            } else if (commit.type === 'test') {
              commit.type = 'Tests';
            } else if (commit.type === 'build') {
              commit.type = 'Build System';
            } else if (commit.type === 'ci') {
              commit.type = 'Continuous Integration';
            }

            if (commit.scope === '*') {
              commit.scope = '';
            }

            if (typeof commit.hash === 'string') {
              commit.hash = commit.hash.substring(0, 7);
            }

            if (typeof commit.subject === 'string') {
              commit.subject = commit.subject.substring(0, 80);
            }

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
