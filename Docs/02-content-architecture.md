# Архитектура контента

## Цели структуры

- Один файл описывает одну самостоятельную сущность.
- Путь файла и идентификатор остаются стабильными при изменении названия.
- Русские и английские названия доступны как структурированные поля.
- Связи задаются идентификаторами, а не текстовыми URL.
- Новые игровые системы можно добавить без смешивания правил разных редакций.

## Предлагаемая структура

```text
src/
  content.config.ts
  content/
    cp2020/
      guides/
        character-creation.md
      roles/
        solo.md
      stats/
        empathy.md
      skills/
        awareness-notice.md
      lifepath/
        origins-and-personal-style.md
      rules/
        starting-funds.md
        humanity-and-empathy.md
      weapons/
        example-weapon.md
      armor/
        example-armor.md
      gear/
        example-item.md
      cyberware/
        example-cyberware.md
      sources/
        core-rulebook.md
```

Документация, решения и шаблоны хранятся отдельно:

```text
Docs/
  00-project-brief.md
  01-roadmap.md
  02-content-architecture.md
  03-content-guidelines.md
  Templates/
    role.md
    skill.md
    lifepath-table.md
    weapon.md
    armor.md
    gear.md
    cyberware.md
```

## Маршруты

```text
/                         главная проекта
/cp2020/                  главная Cyberpunk 2020
/cp2020/create/           порядок создания персонажа
/cp2020/roles/            список ролей
/cp2020/roles/solo/       страница роли
/cp2020/skills/           список навыков
/cp2020/skills/{id}/      страница навыка
/cp2020/lifepath/         навигация по Lifepath
/cp2020/{section}/{id}/   универсальная схема каталога
```

Префикс системы обязателен с первой версии. Он предотвращает конфликт URL при добавлении Cyberpunk RED.

## Общие поля frontmatter

```yaml
title: Соло
titleEn: Solo
summary: Краткое оригинальное описание материала.
system: cp2020
edition: '2.01'
source: core-rulebook
status: draft
aliases: []
tags: []
```

Идентификатор берётся из имени файла. Поле `slug` добавляется только при реальной необходимости отделить публичный URL от идентификатора.

## Специализированные поля

### Роль

```yaml
specialAbility: combat-sense
careerSkills:
  - awareness-notice
  - handgun
```

### Навык

```yaml
stat: intelligence
difficultyMultiplier: 1
isCareerSkillFor:
  - solo
```

### Таблица Lifepath

```yaml
die: 10
entries:
  - range: '1'
    result: Краткая формулировка результата.
```

Каждая логическая таблица Lifepath хранится отдельным Markdown-файлом. Структурированные результаты находятся во frontmatter, пояснения и порядок использования — в теле документа.

### Оружие

```yaml
category: handgun
concealability: jacket
accuracy: 0
availability: common
damage: 2d6+1
shots: 8
rateOfFire: 2
reliability: standard
rangeMeters: 50
priceEb: 100
```

### Броня

```yaml
category: body-armor
stoppingPower: 10
encumbranceValue: 0
locations:
  - torso
priceEb: 100
```

### Снаряжение

```yaml
category: electronics
priceEb: 100
availability: common
```

### Киберимплант

```yaml
category: neuralware
surgery: minor
humanityLoss: 1d6
priceEb: 100
requirements: []
```

Финальный набор полей сверяется с основной книгой до реализации схем. Примеры показывают направление модели, а не готовые игровые данные.

## Связи

- `source` ссылается на запись из `sources`.
- `stat` ссылается на характеристику.
- `specialAbility`, `careerSkills` и `isCareerSkillFor` используют стабильные идентификаторы.
- Ссылки внутри Markdown используют собственный компонент или helper, который проверяет существование цели при сборке.
- Обратные связи вычисляются при сборке и не дублируются вручную.

## Статусы публикации

- `draft` — незавершённый материал, доступен только в разработке.
- `review` — готов к проверке терминологии и механики.
- `published` — прошёл проверку и включается в production.

## Почему несколько коллекций

Роли, навыки, оружие и Lifepath имеют разные схемы. Отдельные коллекции дают точную валидацию, понятные шаблоны и удобные запросы без универсального frontmatter с десятками необязательных полей.
