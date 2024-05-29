# React Native

## Installation

```bash
npx create-expo-app myapp
cd myapp
npx expo start / npm start
```

## Native wind Installation

```bash
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
npx tailwindcss init
```

## Publishing

```bash
npm install -g eas-cli
eas login
eas update:configure
eas update --branch branchname --message "Initial setup for EAS Update"
```
