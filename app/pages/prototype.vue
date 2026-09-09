<script setup lang="ts">
const resources = [
  {
    name: 'South Dallas Counseling Center',
    specialty: 'Anxiety, Depression, Trauma',
    insurance: 'Aetna, BCBS, Medicaid',
    mode: 'In Person',
    distance: '1.4 mi',
  },
  {
    name: 'Oak Cliff Community Wellness',
    specialty: 'Men’s Mental Health, Family Support',
    insurance: 'Cigna, UnitedHealthcare',
    mode: 'In Person + Virtual',
    distance: '2.1 mi',
  },
  {
    name: 'North Texas Therapy Collective',
    specialty: 'Stress, Grief, Life Transitions',
    insurance: 'BCBS, Self-pay',
    mode: 'Virtual',
    distance: '3.8 mi',
  },
]
</script>

<template>
  <div class="min-h-screen bg-[#f7f2e7] text-[#1e2b22]">
    <!-- Header -->
    <header class="border-b border-[#dfd6c3] bg-[#123d27] text-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 class="text-2xl font-semibold">Care Before Crisis</h1>
          <p class="text-sm text-green-100">Mental Health Resource Directory</p>
        </div>

        <nav class="flex gap-5 text-sm">
          <a href="#find" class="hover:underline">Find Care</a>
          <a href="#map" class="hover:underline">Map</a>
          <a href="#submit" class="hover:underline">Submit Resource</a>
          <a href="#admin" class="hover:underline">Admin</a>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section id="find" class="mx-auto max-w-7xl px-6 py-14">
      <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p class="mb-3 text-sm font-semibold uppercase tracking-wide text-[#1a5c3a]">
            Care before crisis
          </p>

          <h2 class="max-w-xl text-5xl font-bold leading-tight">
            Find mental health support near you.
          </h2>

          <p class="mt-5 max-w-xl text-lg text-gray-700">
            Search trusted mental health resources by location, insurance,
            specialty, and care format.
          </p>
        </div>

        <UCard class="bg-white">
          <template #header>
            <div>
              <h3 class="text-xl font-semibold">Find support</h3>
              <p class="mt-1 text-sm text-gray-500">
                Use your location or enter a ZIP code.
              </p>
            </div>
          </template>

          <div class="space-y-4">
            <UButton block color="success" label="Use My Location" />

            <div>
              <label class="mb-1 block text-sm font-medium">ZIP code</label>
              <UInput placeholder="e.g. 75211" class="w-full" />
            </div>

            <div class="grid gap-3 md:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium">Specialty</label>
                <USelect
                  class="w-full"
                  :items="[
                    'Any specialty',
                    'Anxiety',
                    'Depression',
                    'Trauma',
                    'Men’s Mental Health',
                    'Family Support',
                  ]"
                />
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium">Insurance</label>
                <USelect
                  class="w-full"
                  :items="[
                    'Any insurance',
                    'Aetna',
                    'BCBS',
                    'Cigna',
                    'Medicaid',
                    'UnitedHealthcare',
                  ]"
                />
              </div>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">Care format</label>
              <div class="flex flex-wrap gap-2">
                <UButton size="sm" variant="soft" label="Any" />
                <UButton size="sm" variant="soft" label="In Person" />
                <UButton size="sm" variant="soft" label="Virtual" />
                <UButton size="sm" variant="soft" label="Both" />
              </div>
            </div>

            <UButton block color="success" label="Find Resources" />
          </div>
        </UCard>
      </div>
    </section>

    <!-- Results -->
    <section class="border-y border-[#dfd6c3] bg-white">
      <div class="mx-auto max-w-7xl px-6 py-12">
        <div class="mb-6 flex items-end justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-[#1a5c3a]">Nearby resources</p>
            <h2 class="text-3xl font-bold">Closest services</h2>
          </div>

          <UButton variant="soft" color="success" label="View Map" />
        </div>

        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <UCard v-for="resource in resources" :key="resource.name">
            <div class="space-y-3">
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-lg font-semibold">{{ resource.name }}</h3>
                <UBadge color="success" variant="soft">
                  {{ resource.distance }}
                </UBadge>
              </div>

              <div>
                <p class="text-xs font-semibold uppercase text-gray-500">Specialty</p>
                <p>{{ resource.specialty }}</p>
              </div>

              <div>
                <p class="text-xs font-semibold uppercase text-gray-500">Insurance</p>
                <p>{{ resource.insurance }}</p>
              </div>

              <div>
                <p class="text-xs font-semibold uppercase text-gray-500">Format</p>
                <p>{{ resource.mode }}</p>
              </div>

              <div class="flex gap-2 pt-2">
                <UButton size="sm" color="success" label="View Details" />
                <UButton size="sm" variant="soft" label="View on Map" />
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Map -->
    <section id="map" class="mx-auto max-w-7xl px-6 py-12">
      <h2 class="text-3xl font-bold">Interactive Map</h2>
      <p class="mt-2 text-gray-600">
        Resources near your location or ZIP code will appear here.
      </p>

      <div
        class="mt-6 flex h-80 items-center justify-center rounded-xl border border-[#dfd6c3] bg-[#e7efe8]"
      >
        <p class="text-lg font-medium text-[#1a5c3a]">Map prototype area</p>
      </div>
    </section>

    <!-- Submission -->
    <section id="submit" class="bg-[#123d27] text-white">
      <div class="mx-auto max-w-7xl px-6 py-12">
        <div class="max-w-2xl">
          <p class="text-sm font-semibold uppercase text-green-200">For providers</p>
          <h2 class="mt-2 text-3xl font-bold">Submit a resource</h2>
          <p class="mt-3 text-green-100">
            Clinics, therapists, and community organizations can submit their information
            for review before appearing in the directory.
          </p>

          <UButton class="mt-6" color="neutral" label="Open Submission Form" />
        </div>
      </div>
    </section>

    <!-- Admin -->
    <section id="admin" class="mx-auto max-w-7xl px-6 py-12">
      <h2 class="text-3xl font-bold">Admin Review</h2>
      <p class="mt-2 text-gray-600">
        Submitted resources can be reviewed, approved, or rejected before publication.
      </p>

      <UCard class="mt-6 max-w-2xl">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="font-semibold">Dallas Community Therapy Center</h3>
            <p class="text-sm text-gray-500">Pending verification</p>
          </div>

          <div class="flex gap-2">
            <UButton size="sm" color="success" label="Approve" />
            <UButton size="sm" color="error" variant="soft" label="Reject" />
          </div>
        </div>
      </UCard>
    </section>
  </div>
</template>