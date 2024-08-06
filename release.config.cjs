/**
 * ## Config Semantic-release
 * @type {import('semantic-release').GlobalConfig}
 */
const config = {
  branches: [
    "main", // Основная ветка для стабильных релизов
    {
      name: "next", // Ветка для следующей версии
      prerelease: true, // Включает предварительные версии, например, 1.0.0-next.1
    },
    {
      name: "beta", // Ветка для бета-версий
      prerelease: true, // Включает предварительные версии, например, 1.0.0-beta.1
      channel: "beta", // Публикация на beta канал
    },
    {
      name: "develop", // Ветка для разработки
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
        pkgRoot: 'dist'
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ["dist/*.js", "dist/*.js.map"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          { path: 'dist/*.zip', label: 'Distribution' },
          { path: 'build/coverage.xml', label: 'Coverage Report' },
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
