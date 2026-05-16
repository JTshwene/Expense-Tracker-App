# Publishing to Google Play

This guide walks through producing a signed Android release build of Pula
Expense Tracker and submitting it to the Google Play Store.

The build itself cannot be produced in a restricted CI sandbox — run these
steps on your own machine (or an environment with internet access and,
for the local option, the Android SDK).

---

## 1. Prerequisites

- A **Google Play Developer account** — one-time US$25 registration at
  https://play.google.com/console
- **Node.js 18+** and this project installed (`npm install`)
- A **privacy policy hosted at a public URL** — the text is in
  [`PRIVACY.md`](./PRIVACY.md). Publish it somewhere reachable (GitHub Pages,
  a free host, your own site) and keep the URL for the store listing.
- Confirm app identity in [`app.json`](./app.json):
  - `android.package` — `com.pula.expensetracker` (permanent once published)
  - `version` — user-facing version, e.g. `1.0.0`
  - `android.versionCode` — integer, must increase with every upload

---

## 2. Build a signed release (`.aab`)

Google Play requires an **Android App Bundle** (`.aab`). Pick one option.

### Option A — EAS Build (recommended, no Android SDK needed)

EAS builds in the cloud and manages the signing key for you.

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Create `eas.json` in the project root if `build:configure` did not:

```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

Then build:

```bash
eas build --platform android --profile production
```

When prompted, let EAS **generate a new Android keystore** and keep it safe —
losing it means you can never update the app under the same listing. Download
the resulting `.aab` from the build page.

### Option B — Local Gradle build (full control, needs Android SDK)

```bash
npx expo prebuild --platform android
```

Generate an upload keystore (once, store it securely and back it up):

```bash
keytool -genkeypair -v -keystore upload.keystore \
  -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

Reference the keystore in `android/gradle.properties`, then build:

```bash
cd android
./gradlew bundleRelease
```

The bundle is written to
`android/app/build/outputs/bundle/release/app-release.aab`.

---

## 3. Create the app in Play Console

1. Go to https://play.google.com/console → **Create app**.
2. Set the app name (**Pula Expense Tracker**), default language, app type
   (App), and Free/Paid (Free).
3. Complete the **Dashboard** setup tasks:
   - **App access** — all content is available without login.
   - **Ads** — the app contains no ads.
   - **Content rating** — fill in the questionnaire (this is a finance/tools
     app with no sensitive content; it rates as suitable for everyone).
   - **Target audience** — choose the appropriate age groups.
   - **Data safety** — declare **no data collected and no data shared**
     (all data stays on the device); see [`PRIVACY.md`](./PRIVACY.md).
   - **Privacy policy** — paste the public URL where you hosted `PRIVACY.md`.

---

## 4. Store listing assets

Prepare these in Play Console → **Store presence → Main store listing**:

- **App icon** — 512×512 PNG. Use `assets/playstore-icon.png`.
- **Feature graphic** — 1024×500 PNG/JPG (required).
- **Phone screenshots** — at least 2 (capture from a device or emulator).
- **Short description** — up to 80 characters, e.g.
  _"Track your daily expenses in Botswana Pula — simple, private, offline."_
- **Full description** — what the app does and who it is for.

---

## 5. Release

1. Play Console → **Release → Testing → Internal testing**: upload the `.aab`,
   add your own email as a tester, and verify the app installs and runs.
2. Optionally promote to **Closed testing** for a wider group.
3. When ready, **Release → Production**: create a release, upload the `.aab`
   (or promote the tested one), add release notes, and roll out.
4. Google reviews the submission; first reviews can take a few days.

---

## 6. Shipping updates

For every new release:

1. Increase `android.versionCode` in `app.json` (e.g. `1` → `2`).
2. Update `version` if the user-facing version changed.
3. Rebuild the `.aab` (step 2) and upload it to a new release.

Always reuse the **same signing key / keystore** — Play rejects uploads
signed with a different key.
