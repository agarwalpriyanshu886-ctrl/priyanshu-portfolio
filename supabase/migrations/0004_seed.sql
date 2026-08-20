-- ============================================================
-- 0004_seed.sql — Default Seed Data for Priyanshu Agarwal Portfolio
-- ============================================================

-- Site Settings Default Row
insert into public.site_settings (
  site_name,
  site_title,
  site_description,
  owner_name,
  email,
  phone,
  location,
  timezone,
  maintenance_mode,
  github_username,
  github_enabled
) values (
  'Priyanshu Agarwal',
  'Priyanshu Agarwal — AI/ML Engineer & Full-Stack Developer',
  'Building intelligent, scalable and visually impressive digital experiences with AI and modern software engineering.',
  'Priyanshu Agarwal',
  'agarwalpriyanshu@gmail.com',
  '+91 75684 41942',
  'Jaipur, Rajasthan, India',
  'Asia/Kolkata',
  false,
  'agarwalpriyanshu886-ctrl',
  true
) on conflict do nothing;

-- Homepage Sections Default Visibility & Ordering
insert into public.homepage_sections (section_key, title, subtitle, is_visible, display_order) values
  ('hero', 'Hero Banner', 'Top introduction and primary CTAs', true, 1),
  ('about', 'About Me', 'Biography, background, and passions', true, 2),
  ('skills', 'Skills & Technologies', 'Technical capabilities & experience levels', true, 3),
  ('projects', 'Featured Projects', 'Selected portfolio project showcase', true, 4),
  ('experience', 'Work Experience', 'Career history and technical roles', true, 5),
  ('education', 'Education', 'Academic achievements and degrees', true, 6),
  ('certifications', 'Certifications', 'Verified credentials and certifications', true, 7),
  ('services', 'Services Offered', 'Professional engineering services', true, 8),
  ('testimonials', 'Testimonials', 'Client & peer recommendations', true, 9),
  ('blog', 'Blog Articles', 'Latest research and technical articles', true, 10),
  ('contact', 'Contact Form', 'Get in touch inbox and links', true, 11)
on conflict (section_key) do nothing;

-- Navigation Items
insert into public.navigation_items (label, url, is_visible, display_order) values
  ('Home', '#home', true, 1),
  ('About', '#about', true, 2),
  ('Skills', '#skills', true, 3),
  ('Projects', '#projects', true, 4),
  ('Experience', '#experience', true, 5),
  ('Education', '#education', true, 6),
  ('Certifications', '#certifications', true, 7),
  ('GitHub', '#github', true, 8),
  ('Contact', '#contact', true, 9)
on conflict do nothing;

-- Social Links
insert into public.social_links (platform, url, icon, is_visible, display_order) values
  ('GitHub', 'https://github.com/agarwalpriyanshu886-ctrl', 'FaGithub', true, 1),
  ('LinkedIn', 'https://www.linkedin.com/in/', 'FaLinkedinIn', true, 2),
  ('Instagram', 'https://www.instagram.com/priyanshu0.112', 'FaInstagram', true, 3)
on conflict do nothing;

-- Skill Categories
insert into public.skill_categories (name, slug, display_order) values
  ('AI & Machine Learning', 'ai-ml', 1),
  ('Full-Stack Web', 'full-stack', 2),
  ('Programming Languages', 'programming', 3),
  ('Databases & Tools', 'databases-tools', 4)
on conflict do nothing;

-- 100% Dynamic Sample Education Records
insert into public.education (degree, institution, field, start_date, end_date, current_status, description, display_order, is_published) values
  ('B.Tech', 'NIMS University Jaipur', 'Artificial Intelligence & Machine Learning', '2024', '2028', 'Undergraduate', 'Core undergraduate engineering education focusing on computer science, AI algorithms, data structures, full-stack development, and software engineering.', 1, true),
  ('M.Tech', 'NIMS University Jaipur', 'Artificial Intelligence & Machine Learning', '2028', '2029', 'Postgraduate (Upcoming)', 'Specialized master degree research in advanced neural network architectures, deep learning models, natural language processing, and AI system design.', 2, true)
on conflict do nothing;
