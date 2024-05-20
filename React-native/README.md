# React Native

## Installation

```bash
npx create-expo-app myapp
cd myapp
npx expo start
```

## Publishing

```bash
npm install -g eas-cli
eas login
eas update:configure
eas update --branch production --message "Initial setup for EAS Update"
```
