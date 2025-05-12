<div align="center">
  <h1>AI Text Extractor 📄✨</h1>
  <p><strong>AI Text Extractor</strong> is a React Native app built with <a href="https://expo.dev">Expo</a>, allowing users to scan documents using their <strong>camera or photo library</strong> and extract text using an <strong>AI-powered OCR model</strong> from <a href="https://replicate.com">Replicate</a>.</p>

  <img src=".github/ai-text-extractor.gif" alt="AI Text Extractor" width="50%" />
</div>

> ⚠️ The OCR model used is not free, but it's **very affordable**. Perfect for lightweight document parsing tasks.

---

## Features

- 📷 Pick or capture an image from your device
- 🧠 Extract text from the image using Replicate's OCR model
- 📝 Copy the result to your clipboard
- 🕓 View your prediction history via Replicate's API
- 🗒️ You need to run the app on physical device to use the camera

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a .env file from the provided template

```bash
cp .env.template .env
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

---

## ✌️ License

MIT – do what you want, just don’t forget to hydrate.
