# Balla Botond Personal Website

A modern, multilingual personal portfolio website built with Astro, featuring internationalization support and privacy-focused calendar availability.

## 🚀 Features

- **Multilingual Support**: English, Hungarian, Italian, Japanese, and Chinese
- **Privacy-Focused Calendar**: Shows availability without revealing event details
- **Modern Design**: Elegant UI with smooth animations and responsive layout
- **Project Showcase**: Display your work and achievements
- **Professional Resume**: Multi-language resume pages
- **SEO Optimized**: Built-in SEO best practices

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 📅 Calendar Setup

The calendar feature shows your availability for the next 4 weeks without revealing private event details.

### Setting up Calendar URLs

1. Copy `.env.example` to `.env`:
   ```sh
   cp .env.example .env
   ```

2. Add your calendar ICS URLs to the `.env` file:
   ```env
   PUBLIC_CALENDAR_URLS=https://calendar.google.com/calendar/ical/YOUR_ID/public/basic.ics
   ```

3. For multiple calendars, use comma-separated URLs:
   ```env
   PUBLIC_CALENDAR_URLS=https://example.com/cal1.ics,https://example.com/cal2.ics
   ```

### Getting Google Calendar ICS URL

1. Open Google Calendar settings
2. Select the calendar you want to share
3. Scroll to "Integrate calendar"
4. Copy the "Public URL to this calendar" in iCal format
5. Make sure the calendar is set to public (or use a secret address)

### For GitHub Pages Deployment

When deploying to GitHub Pages, set the calendar URLs in your repository secrets:

1. Go to your repository Settings → Secrets and variables → Actions
2. Add a new repository secret named `PUBLIC_CALENDAR_URLS`
3. Set the value to your comma-separated ICS URLs

Then update your deployment workflow to include:
```yaml
env:
  PUBLIC_CALENDAR_URLS: ${{ secrets.PUBLIC_CALENDAR_URLS }}
```

### Privacy Note

The calendar feature is designed with privacy in mind:
- ✅ Shows only availability status (Available/Busy)
- ✅ Displays date and time when you're occupied
- ❌ Never shows event titles, descriptions, or attendees
- ❌ No location or other private details are revealed

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
