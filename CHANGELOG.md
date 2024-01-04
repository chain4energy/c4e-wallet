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
## [1.2.3](https://github.com/chain4energy/c4e-wallet/releases/tag/1.2.3) - 2024-01-04

### Misc Improvements
* Twitter message corrections

## [1.2.2](https://github.com/chain4energy/c4e-wallet/releases/tag/1.2.2) - 2024-01-04

### Misc Improvements
* Styling corrections

## [1.2.1](https://github.com/chain4energy/c4e-wallet/releases/tag/1.2.1) - 2023-12-19

### Misc Improvements
* Styling corrections

### Features
* Airdrop - claiming support

## [1.1.12](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.12) - 2023-07-24

### Misc Improvements
* Styling corrections

## [1.1.11](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.11) - 2023-07-13

### Misc Improvements
* Configuration change - Set GasPriceStep Low to 0 

## [1.1.10](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.10) - 2023-07-12

### Bug fixes
* Airdrop - Check Allocation - Button function change to support all wallets

## [1.1.9](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.9) - 2023-07-12

### Features
* Leap wallet support
* Faucet for testnet

## [1.1.8](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.8) - 2023-04-13

### Misc Improvements
* Configuration update - Strategic Reserve poll

## [1.1.7](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.7) - 2023-04-12

### Misc Improvements
* Configuration update - Strategic Reserve poll - multiple addresses support

## [1.1.6](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.6) - 2023-04-12

### Features
* Cosmostation wallet support
* Cosmos-sdk version v0.46.10 support
* Support for new proposals types

### Bug fixes
* Wallet details view css corrections 
* Jailed voting power always 0% 
* Delegation problem (4671)

### Misc Improvements
* Proposals view improvements 
* Support for no internet access (4261)
* Toasts styling

## [1.1.5](https://github.com/chain4energy/c4e-wallet/releases/tag/1.1.5) - 2023-03-03

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
