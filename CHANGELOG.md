# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.4] - 2023-07-07

### Fixed

- Validate userId from owner entity when creating a `Owner -> ASSIGNED -> Role`
  relationship.

## [1.0.3] - 2023-02-20

### Fixed

- Consume all user records using pagination.

## [1.0.2] - 2022-08-10

### Fixed

- Updated scopes to replace `contacts` scope.

## [1.0.1] - 2022-05-20

### Fixed

- Updated to fix errors with NPM package creation and publish.
- Added missing questions file.

## [1.0.0] - 2022-05-20

### Added

Initial release. Ingesting the following items:

### Entities

| Resources       | Entity `_type`    | Entity `_class` |
| --------------- | ----------------- | --------------- |
| HubSpot Account | `hubspot_account` | `Account`       |
| HubSpot Company | `hubspot_company` | `Organization`  |
| HubSpot Role    | `hubspot_role`    | `AccessRole`    |
| HubSpot User    | `hubspot_user`    | `User`          |

### Relationships

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `hubspot_account`     | **HAS**               | `hubspot_company`     |
| `hubspot_account`     | **HAS**               | `hubspot_role`        |
| `hubspot_account`     | **HAS**               | `hubspot_user`        |
| `hubspot_user`        | **ASSIGNED**          | `hubspot_role`        |
