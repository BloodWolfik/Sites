# Сайты

Список сайтов для rule-providers [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev)

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Использование

### Конфигурация поставщиков правил

Добавьте этот блок в ваш конфигурационный файл:

```yaml
rule-providers:
  Site:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/BloodWolfik/Sites@main/Sites.yaml"
    path: ./ruleset/Sites.yaml
    interval: 86400
```

### Режим обхода цензуры

Если вы находитесь в регионе с интернет-ограничениями:

```yaml
rules:
  - RULE-SET,Site,PROXY
