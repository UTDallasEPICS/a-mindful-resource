<template>
  <UApp>
    <div class="flex min-h-screen flex-col bg-cream text-ink">
      <header class="sticky top-0 z-50 bg-forest-deep shadow-md">
        <UContainer class="flex h-16 items-center justify-between">
          <NuxtLink to="/" class="font-serif text-xl font-bold text-paper">
            A Mindful Resource
          </NuxtLink>
        </UContainer>
      </header>

      <main class="flex-1">
        <NuxtPage />
      </main>
    </div>
  </UApp>
</template>
