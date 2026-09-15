# Faisal Mobile — Website + Admin Panel

This package keeps the existing Faisal Mobile look and adds a real product manager.

## What is included
- `index.html` — public shop
- `admin.html` — private admin login/product manager
- `admin.js` — add/edit/delete/upload logic
- `app.js` — loads products on the public website
- `style.css` — responsive design
- `config.js` — your Supabase connection
- `supabase_setup.sql` — database + image storage setup

## One-time setup
1. Create a Supabase project.
2. In Supabase SQL Editor, run all of `supabase_setup.sql`.
3. In Authentication, create your admin user with email + password.
4. Copy the Supabase Project URL and public `anon` key into `config.js`.
5. Upload these files to your GitHub repository.
6. Open `admin.html`, log in, and add phones.

Important: only use the public `anon` key in `config.js`. Never put a `service_role` key in website files.

## Existing business contact
WhatsApp / phone: 0310-5120312
Address: Lakki Bazar, Near Old Habib Bank
