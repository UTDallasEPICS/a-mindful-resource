<script setup lang="ts">
  interface NavLink {
    label: string
    to: string
  }

  const navLinks: NavLink[] = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Programs', to: '/programs' },
    { label: 'Events', to: '/events' },
    { label: 'Resources', to: '/resources' },
    { label: 'The Village', to: '/the-village' },
    { label: 'Donate', to: '/donate' },
  ]

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/p/A-Mindful-Resource-61556651332086/',
      handle: 'A Mindful Resource',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/amindfulresource',
      handle: '@amindfulresource',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/dominiqueamr',
      handle: 'Dominique Johnson',
    },
  ]

  const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto border-t border-forest-line bg-forest-deep text-mist">
    <UContainer class="py-12">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <div class="space-y-3 md:col-span-6 lg:col-span-5">
          <h2 class="font-serif text-2xl font-bold tracking-tight text-paper">
            A Mindful Resource Inc.
          </h2>

          <div class="space-y-1 text-sm text-mist-muted">
            <p>Dallas, Texas</p>
            <p>
              <a href="tel:2145060691" class="transition-colors hover:text-paper">
                (214) 506-0691
              </a>
            </p>
            <p>
              <a href="mailto:info@amindfulresource.org" class="transition-colors hover:text-paper">
                info@amindfulresource.org
              </a>
            </p>
            <p>501(c)(3) Nonprofit · EIN: 93-4976788</p>
          </div>

          <div class="pt-1">
            <a
              href="https://maps.google.com/?q=Dallas,TX"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-gold-light transition-colors hover:text-gold"
            >
              <svg
                class="size-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Get Directions</span>
            </a>
          </div>
        </div>

        <!-- navigation -->
        <div class="space-y-3 md:col-span-3 lg:col-span-3">
          <h3 class="font-serif text-base font-semibold text-paper">Navigation</h3>
          <ul class="space-y-2 text-sm">
            <li v-for="link in navLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-mist-muted transition-colors hover:text-gold-light"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- socials -->
        <div class="space-y-3 md:col-span-3 lg:col-span-4">
          <h3 class="font-serif text-base font-semibold text-paper">Connect</h3>
          <ul class="space-y-2.5 text-sm">
            <li v-for="social in socialLinks" :key="social.url">
              <a
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group inline-flex items-center gap-2 text-mist-muted transition-colors hover:text-gold-light"
              >
                <!-- facebook icon -->
                <svg
                  v-if="social.name === 'Facebook'"
                  class="size-4 shrink-0 transition-colors group-hover:text-gold-light"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>

                <!-- instagram icon -->
                <svg
                  v-else-if="social.name === 'Instagram'"
                  class="size-4 shrink-0 transition-colors group-hover:text-gold-light"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </svg>

                <!-- linked in icon -->
                <svg
                  v-else-if="social.name === 'LinkedIn'"
                  class="size-4 shrink-0 transition-colors group-hover:text-gold-light"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.53-1.53c0-.85-.68-1.53-1.53-1.53a1.54 1.54 0 0 0-1.54 1.53c0 .85.69 1.53 1.54 1.53m1.39 9.74v-8.37H5.07v8.37h2.78z"
                  />
                </svg>

                <span>{{ social.name }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-forest-line pt-6 text-center">
        <p class="text-base text-mist">
          In crisis?
          <a
            href="tel:988"
            class="ml-1 font-bold text-gold-light underline underline-offset-4 transition-colors hover:text-gold"
          >
            Call or text 988
          </a>
        </p>
        <p class="mt-3 text-xs text-mist-muted">
          © {{ currentYear }} A Mindful Resource Inc. All rights reserved.
        </p>
      </div>
    </UContainer>
  </footer>
</template>
