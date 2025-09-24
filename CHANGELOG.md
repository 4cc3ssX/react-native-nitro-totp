# Changelog

## [2.0.0](https://github.com/4cc3ssX/react-native-nitro-totp/compare/v1.4.0...v2.0.0) (2025-09-24)

### 🚀 Features

* rename secret key length to secret key size + added COMPACT, STANDARD, and EXTENDED sizes ([8f8a422](https://github.com/4cc3ssX/react-native-nitro-totp/commit/8f8a422507c37da2ecba777f6f0c218978b90a03))

### 🐛 Bug Fixes

* add validation for window and counter options ([ff154e6](https://github.com/4cc3ssX/react-native-nitro-totp/commit/ff154e684c80bab9233b3430b457163b4be626f4))
* counter should allow zero values ([8235969](https://github.com/4cc3ssX/react-native-nitro-totp/commit/82359695f15c1cebc4b23cdb5953466fa8cf4ef7))
* improve secret generation + move isSecretKeyValid to NitroSecret class ([f455bf9](https://github.com/4cc3ssX/react-native-nitro-totp/commit/f455bf9bd531e1c5378ca9cf6efd775bf83c68cf))

### 🧹 Chore

* add assets to package.json files ([82d3547](https://github.com/4cc3ssX/react-native-nitro-totp/commit/82d35472b8f9ad8139b1b12f9f5042674af5db1a))
* improve example + README.md ([1d5832f](https://github.com/4cc3ssX/react-native-nitro-totp/commit/1d5832f6fad2df88f4d50c3914650541b5eb6f7f))
* override resolution for conventional-changelog-conventionalcommits ([2a218ae](https://github.com/4cc3ssX/react-native-nitro-totp/commit/2a218ae0d52069f553e8918d1ea2c80c5af8108a))
* remove --only-version flag from release-it ([8ab2c8a](https://github.com/4cc3ssX/react-native-nitro-totp/commit/8ab2c8a3b76fe17a49abafa4fd33fd0e914981ba))
* remove unnecessary comments ([73773ff](https://github.com/4cc3ssX/react-native-nitro-totp/commit/73773ff6ac6fe59195910779a076b09566c33edd))
* use release it json instead of package json config ([133a0d7](https://github.com/4cc3ssX/react-native-nitro-totp/commit/133a0d76fe6c661ff93e4f83054ea0a5d7324b21))

### 📚 Documentation

* update CHANGELOG.md with latest releases ([a0b52f6](https://github.com/4cc3ssX/react-native-nitro-totp/commit/a0b52f66e9e2444a827d07152119b3692c161983))
* update SECURITY.md file ([14a438e](https://github.com/4cc3ssX/react-native-nitro-totp/commit/14a438ea78f101a1114793ae0e6203be141e7727))

## [v1.4.0](https://github.com/4cc3ssX/react-native-nitro-totp/compare/v1.3.0...v1.4.0) (2025-09-23)

### 🚀 Features
- support `currentTime` option for TOTP generate and validate methods ([02dbcc2](https://github.com/4cc3ssX/react-native-nitro-totp/commit/02dbcc2))

### 🐛 Bug Fixes
- window is not working as `HybridNitroHotp::validate` used `counter` variable instead of `testCounter` while generating options ([da515c8](https://github.com/4cc3ssX/react-native-nitro-totp/pull/8/files#diff-a39bb2b98aff54a6825bf91ad472a1cd5507c65dc7b546d6308ef541eabe64d4R62))

### 📦 Refactor
- make nitro spec options non-optional arg ([da515c8](https://github.com/4cc3ssX/react-native-nitro-totp/commit/da515c8))

### 📚 Documentation
- update README for `currentTime` support ([cdaa2ae](https://github.com/4cc3ssX/react-native-nitro-totp/commit/cdaa2ae))

### 💄 Styles
- reindent files ([72886d5](https://github.com/4cc3ssX/react-native-nitro-totp/commit/72886d5))

### 🧹 Chore
- update example project with example ([6c0d93d](https://github.com/4cc3ssX/react-native-nitro-totp/commit/6c0d93d))


## [v1.3.0](https://github.com/4cc3ssX/react-native-nitro-totp/compare/v1.2.0...v1.3.0) (2025-09-23)

### 🚀 Features
- Expo SDK 54 support + refactoring by @4cc3ssX in #7

### 🐛 Bug Fixes
- android build issue ([18ea913](https://github.com/4cc3ssX/react-native-nitro-totp/commit/18ea913))
- example component ([9ce8eb5](https://github.com/4cc3ssX/react-native-nitro-totp/commit/9ce8eb5))
- minor changes ([7953a9a](https://github.com/4cc3ssX/react-native-nitro-totp/commit/7953a9a))

### 📦 Refactor
- use builder bob template + refactoring ([cbe3ccf](https://github.com/4cc3ssX/react-native-nitro-totp/commit/cbe3ccf))

### 📚 Documentation
- update README with enhanced features and usage examples ([f183e15](https://github.com/4cc3ssX/react-native-nitro-totp/commit/f183e15))

### 🧹 Chore
- update example project ([fd95889](https://github.com/4cc3ssX/react-native-nitro-totp/commit/fd95889))

## [1.2.0](https://github.com/4cc3ssX/react-native-nitro-totp/compare/v1.1.1...v1.2.0) (2025-04-20)

### 🚀 Features

* react native version upgrade to v0.79.1 ([66ed2bb](https://github.com/4cc3ssX/react-native-nitro-totp/commit/66ed2bb284ea2f75f6318451c651bc41daf5c4b2))

### 🧹 Chore

* minor changes ([9b555d9](https://github.com/4cc3ssX/react-native-nitro-totp/commit/9b555d989ee57fbc4885f84445291e50390ed395))
* upgrade nitro modules version ([2e53408](https://github.com/4cc3ssX/react-native-nitro-totp/commit/2e5340844288b6401ce0bcf34d0b5da73eddc875))

## [1.1.1](https://github.com/4cc3ssX/react-native-nitro-totp/compare/v1.1.0...v1.1.1) (2024-10-18)


### 🚀 Features

* upgrade nitro modules ([b3ef7fe](https://github.com/4cc3ssX/react-native-nitro-totp/commit/b3ef7fec4eb95953a1f1e2978a9826aaf45c03db))


### 🐛 Bug Fixes

* minor changes ([b2f102c](https://github.com/4cc3ssX/react-native-nitro-totp/commit/b2f102c76714770ef1c6fce9a72a61febd3e4fdb))


### 🧹 Chore

* removed openssl build script ([fe32055](https://github.com/4cc3ssX/react-native-nitro-totp/commit/fe32055ff1426cd6121c072dda4a94b66ac0bcad))
* upgrade openssl v3 ([70cc4e6](https://github.com/4cc3ssX/react-native-nitro-totp/commit/70cc4e61200294020a5bb16adc0838a92fdf7ebe))

## [1.1.0](https://github.com/4cc3ssX/react-native-nitro-totp/compare/v1.0.0...v1.1.0) (2024-10-17)


### 🐛 Bug Fixes

* cpp and nitrogen should be included in package.json ([c84a3cb](https://github.com/4cc3ssX/react-native-nitro-totp/commit/c84a3cbbe780e5055f819d3f01080c1fba5201d3))

## [1.0.0](https://github.com/4cc3ssX/react-native-nitro-totp/compare/0.1.1...v1.0.0) (2024-10-17)


### 🐛 Bug Fixes

* changed SupportedAlgorithm to enum instead ([492e793](https://github.com/4cc3ssX/react-native-nitro-totp/commit/492e79316461acf2404fc98705cbd030a868ec84))


### 🧹 Chore

* add openssl as git submodule ([4fd1b3c](https://github.com/4cc3ssX/react-native-nitro-totp/commit/4fd1b3c42e564c35f85d9b4618438aa1eb9fee60))
* added help section ([d336722](https://github.com/4cc3ssX/react-native-nitro-totp/commit/d336722b964ee09fa88037af8dcd20480dd963f2))
* create LICENSE ([48c317d](https://github.com/4cc3ssX/react-native-nitro-totp/commit/48c317d804fb804d4c0b0929a83e5e141eb095b7))
* issue templates ([fa90d52](https://github.com/4cc3ssX/react-native-nitro-totp/commit/fa90d52653b4034250816224a89e6dfdbdd6e576))
* minor changes ([8468088](https://github.com/4cc3ssX/react-native-nitro-totp/commit/8468088a1f7dfb6f5f8dcb900cf97ec1cc265a08))
* remove openssl from gitignore ([7c6bf31](https://github.com/4cc3ssX/react-native-nitro-totp/commit/7c6bf311bf37a546199cd03ae62696cccfc38adc))
* remove openssl submodule ([636d038](https://github.com/4cc3ssX/react-native-nitro-totp/commit/636d038c90f846b7dc37ed313c12e19d553e7088))
* removed unnecessary usage ([f341c15](https://github.com/4cc3ssX/react-native-nitro-totp/commit/f341c1524199ff92d75c4003dfe8b0d821f79aaf))
* update gradle and build script ([0bc90ae](https://github.com/4cc3ssX/react-native-nitro-totp/commit/0bc90aefb300218e15120a8b1208f91885a5d638))
* update readme ([c8b3053](https://github.com/4cc3ssX/react-native-nitro-totp/commit/c8b3053b1a370265dc327b4968191ab78ba43a84))
* update release it config ([875c847](https://github.com/4cc3ssX/react-native-nitro-totp/commit/875c8478b90e108e9710300997aadba813ebc677))
* upgrade example nitro modules ([07eeaa0](https://github.com/4cc3ssX/react-native-nitro-totp/commit/07eeaa09aec8174251299d1670ab0b88b5f08ee2))
* use yarn v4 instead of bun ([8608131](https://github.com/4cc3ssX/react-native-nitro-totp/commit/8608131ea9d6b3a1517d011ba06c940a22b3529d))


### 🛠 Build System

* link openssl for android ([9e84bee](https://github.com/4cc3ssX/react-native-nitro-totp/commit/9e84bee5cf2a818a6eb49f2dd981faaa94a89362))
* minor changes ([77a4d56](https://github.com/4cc3ssX/react-native-nitro-totp/commit/77a4d567da2350b442b96d3c685d526771e3e9dc))
* openssl maven repo added ([b9a1a89](https://github.com/4cc3ssX/react-native-nitro-totp/commit/b9a1a890266c2ab3f9e6f025da5978cfc88f28a4))

## [0.1.1](https://github.com/4cc3ssX/react-native-nitro-totp/compare/0.1.0...0.1.1) (2024-09-29)


### 🧹 Chore

* minor package details ([2968ab5](https://github.com/4cc3ssX/react-native-nitro-totp/commit/2968ab5c10e44e0b7cb7535416a5f6ea92914d1a))
* release it config ([54a2baf](https://github.com/4cc3ssX/react-native-nitro-totp/commit/54a2baf90ebcce6a57ce9385852297702ca5c2e3))
* release v0.1.1 ([913f03a](https://github.com/4cc3ssX/react-native-nitro-totp/commit/913f03a63aedcb29c790b8eea63c0027e74d6202))

## [0.1.0](https://github.com/4cc3ssX/react-native-nitro-totp/compare/e28b602c255927100fc099e0f6da7c62e4f16772...0.1.0) (2024-09-29)


### 🚀 Features

* totp/ hotp implementations ([62b104f](https://github.com/4cc3ssX/react-native-nitro-totp/commit/62b104f9f70aedff2c9ed3422315e12cd9c88664))


### 🧹 Chore

* example setup ([4c6784d](https://github.com/4cc3ssX/react-native-nitro-totp/commit/4c6784d23d5215234ff7e2d6937b876e7faa5895))
* generateAuthURL example ([dbe50db](https://github.com/4cc3ssX/react-native-nitro-totp/commit/dbe50dbe8ee5d75b3edf7035092fca925795ba2a))
* initial project ([e28b602](https://github.com/4cc3ssX/react-native-nitro-totp/commit/e28b602c255927100fc099e0f6da7c62e4f16772))
* minor changes ([c402fcf](https://github.com/4cc3ssX/react-native-nitro-totp/commit/c402fcfb9cbe1270efc5ca87935cd75c65474a0d))
* minor changes ([c46ce21](https://github.com/4cc3ssX/react-native-nitro-totp/commit/c46ce217bd5634d0be6b6fdc3135303703361745))
* minor changes ([9ec4a19](https://github.com/4cc3ssX/react-native-nitro-totp/commit/9ec4a19c221739d0756cef5a96a2a6d1bd8438d3))
* minor changes ([3dbad8b](https://github.com/4cc3ssX/react-native-nitro-totp/commit/3dbad8b4613b17abd737e96feff0e75fdd85e56b))
* nitro setup ([a8c01cf](https://github.com/4cc3ssX/react-native-nitro-totp/commit/a8c01cfc6c4ab83235ec507c4a106964ab851722))
* release v0.1.0 ([82d0cfd](https://github.com/4cc3ssX/react-native-nitro-totp/commit/82d0cfd77093dc17fd99686a9a1d59f927da79b2))
* update README.md ([6bc2118](https://github.com/4cc3ssX/react-native-nitro-totp/commit/6bc21187a35459692173e24c7bbad68bc42ffec3))

## [0.1.1](https://github.com/4cc3ssX/react-native-nitro-totp/compare/0.1.0...0.1.1) (2024-09-29)
