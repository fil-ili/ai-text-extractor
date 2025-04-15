# AI Text Extractor 📄✨

**AI Text Extractor** is a React Native app built with [Expo](https://expo.dev), allowing users to scan documents using their **camera or photo library** and extract text using an **AI-powered OCR model** from [Replicate](https://replicate.com).

> ⚠️ The OCR model used is not free, but it's **very affordable**. Perfect for lightweight document parsing tasks.

---

## Features

- 📷 Pick or capture an image from your device
- 🧠 Extract text from the image using Replicate's OCR model
- 📝 Copy the result to your clipboard
- 🕓 View your prediction history via Replicate's API

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a .env file from the provided template

```bash
cp .env.example .env
```

Then fill in your Replicate API token:

```bash
EXPO_PUBLIC_REPLICATE_API_TOKEN=your_replicate_token_here
```

Get your token from [replicate.com/account](http://replicate.com/account)

### 3. Run the app

```bash
npm run start
```

### ✌️ License

MIT – do what you want, just don’t forget to hydrate.
