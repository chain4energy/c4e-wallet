<!--
Guiding Principles:

Changelogs are for humans, not machines.
There should be an entry for every single version.
The same types of changes should be grouped.
Versions and sections should be linkable.
The latest version comes first.
The release date of each version is displayed.
Mention whether you follow Semantic Versioning.

Usage:

Change log entries are to be added to the Unreleased section under the
appropriate stanza (see below). Each entry should ideally include a tag and
the Github issue reference in the following format:

* (<tag>) \#<issue-number> message

The issue numbers will later be link-ified during the release process so you do
not have to worry about including a link manually, but you can if you wish.

Types of changes (Stanzas):

"Features" for new features.
"Improvements" for changes in existing functionality.
"Deprecated" for soon-to-be removed features.
"Bug Fixes" for any bug fixes.
"Client Breaking" for breaking CLI commands and REST routes used by end-users.
"API Breaking" for breaking exported APIs used by developers building on SDK.
"State Machine Breaking" for any changes that result in a different AppState 
given same genesisState and txList.
Ref: https://keepachangelog.com/en/1.0.0/
-->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Features

### Bug fixes

### Misc Improvements

## [1.1.6](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.5) - 2022-03-27

### Features
* Cosmostation wallet support
* Cosmos-sdk version v0.46.10 support

### Bug fixes
* Wallet details view css corrections 

### Misc Improvements
* Proposals view improvements 

## [1.1.5](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.5) - 2022-03-03

### Bug fixes
* fix mainnet config - reservedCoinsAmount set to 250000

## [1.1.4](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.4) - 2023-02-17

### Bug fixes
* Loading spinner debounce
* Proposal details chart percentage - correction
* Proposal auto refresh only for active voting
* Voted total correction (4391)

### Misc Improvements
* Added total inflation
* Added total APR
* Proposal chart shows quorum and threshold

## [1.1.3](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.3) - 2023-02-03

### Bug fixes
* Direct link to proposal  

### Misc Improvements
* Voting result auto refresh

## [1.1.2](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.2) - 2023-02-03
### Bug fixes
* External link to proposal correction (link to explorer)

## [1.1.1](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.1) - 2023-02-03
### Bug fixes
* Circulating supply algorithm correction

## [1.1.0](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.0) - 2023-02-03

### Features
* Airdrop allocation view
* Detailed proposal view

## 1.0.0 - 2022-09-22

Initial Release!
