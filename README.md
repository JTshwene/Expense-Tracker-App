# Pula Expense Tracker

A cross-platform mobile app that helps people in **Botswana** track their daily
expenses in **Botswana Pula (BWP)**. Built with **Expo / React Native**, so a
single codebase runs on both **Android** and **iOS**.

## Features

- Record expenses in Pula (P) with amount, category, date and an optional note
- Botswana-relevant categories — Transport, Water & Electricity, Airtime & Data,
  School Fees, Family Support, Groceries, and more
- Monthly dashboard with a budget progress bar
- Set a monthly budget and see how much is left (or how far over)
- Statistics screen with a spending breakdown by category (this month / all time)
- All data is stored privately on the device (no account, no internet needed)
- Delete an expense with a long-press; clear all data from Settings

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- The **Expo Go** app on your phone (Android Play Store / iOS App Store), or an
  Android emulator / iOS simulator

## Getting started

```bash
npm install
npm start
```

Then:

- **On a phone:** scan the QR code shown in the terminal with Expo Go
- **Android emulator:** press `a` (or run `npm run android`)
- **iOS simulator (macOS only):** press `i` (or run `npm run ios`)

## Project structure

```
App.js                     App entry, tab navigation, data provider
index.js                   Registers the root component
src/
  theme.js                 Colours and spacing
  constants.js             Expense categories
  storage.js               AsyncStorage persistence
  utils/format.js          Pula currency and date formatting
  context/ExpenseContext.js  Global expense + budget state
  components/              TabBar, ExpenseItem, SummaryCard
  screens/                 Home, AddExpense, Stats, Settings
```

## Publishing

See [`PUBLISHING.md`](./PUBLISHING.md) for a step-by-step guide to building a
signed release and submitting the app to the Google Play Store. The app's
privacy policy is in [`PRIVACY.md`](./PRIVACY.md).
