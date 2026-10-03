<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f8e22f4c-c225-44f3-a718-09efc997f1bf

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Admin image uploads

Set `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
`CLOUDINARY_API_SECRET` in the server environment. For Vercel, add them in the
project's environment settings as well as your local `.env`. Keep the API secret
server-side; do not give it a `VITE_` prefix.

In the admin Profile, Projects, or Blogs editor, choose **Upload image**. The
file goes to Cloudinary, and the editor receives its image URL. Click the form's
Save button to store that URL in MongoDB. Pasting an image URL still works.
