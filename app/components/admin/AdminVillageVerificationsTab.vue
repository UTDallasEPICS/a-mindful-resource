<script setup lang="ts">
  interface VillageAdminMember {
    userId: string
    name: string
    email: string
    userRole: string
    userCreatedAt?: string | Date
    hasImage: boolean
    phoneNumber: string | null
    credentials: string | null
    organization: string | null
    city: string | null
    preferredContactMethod: 'email' | 'phone' | null
    website: string | null
    reasonForJoining: string | null
    availability: 'available' | 'unavailable'
    applicationStatus: 'pending' | 'approved' | 'rejected'
    reviewedBy: string | null
    reviewerName: string | null
    reviewedAt: string | Date | null
    createdAt: string | Date
    updatedAt: string | Date
    roles: string[]
  }

  const toast = useToast()

  // Fetch village members
  const {
    data: members,
    pending,
    error,
    refresh,
  } = await useFetch<VillageAdminMember[]>('/api/admin/village/members')

  // Search & Filters
  const searchQuery = ref('')
  const statusFilter = ref<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const roleFilter = ref<string>('all')

  // Action state
  const actionLoadingId = ref<string | null>(null)
  const showRevokeModal = ref(false)
  const memberToRevoke = ref<VillageAdminMember | null>(null)
  const showDetailModal = ref(false)
  const selectedMember = ref<VillageAdminMember | null>(null)

  // Status counts
  const totalCount = computed(() => members.value?.length || 0)
  const pendingCount = computed(
    () => members.value?.filter((m) => m.applicationStatus === 'pending').length || 0
  )
  const approvedCount = computed(
    () => members.value?.filter((m) => m.applicationStatus === 'approved').length || 0
  )
  const rejectedCount = computed(
    () => members.value?.filter((m) => m.applicationStatus === 'rejected').length || 0
  )

  // Filtered members
  const filteredMembers = computed(() => {
    if (!members.value) return []
    let list = members.value

    // Status filter
    if (statusFilter.value !== 'all') {
      list = list.filter((m) => m.applicationStatus === statusFilter.value)
    }

    // Role filter
    if (roleFilter.value !== 'all') {
      list = list.filter((m) => m.roles.includes(roleFilter.value))
    }

    // Search query
    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.credentials && m.credentials.toLowerCase().includes(q)) ||
          (m.organization && m.organization.toLowerCase().includes(q)) ||
          (m.city && m.city.toLowerCase().includes(q))
      )
    }

    return list
  })

  // Role display helpers
  const roleLabels: Record<string, string> = {
    clinician: 'Clinician',
    wellness: 'Wellness Provider',
    coach: 'Coach',
    faith_leader: 'Faith Leader',
  }

  function getRoleLabel(role: string): string {
    return roleLabels[role] || role
  }

  function getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  function formatDate(val?: string | Date | null) {
    if (!val) return ''
    try {
      const d = new Date(val)
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return ''
    }
  }

  // Update status (Approve / Reject / Revoke)
  async function updateMemberStatus(
    userId: string,
    status: 'approved' | 'rejected' | 'pending',
    memberName: string
  ) {
    actionLoadingId.value = userId
    try {
      await $fetch('/api/admin/village/verify', {
        method: 'POST',
        body: { userId, status },
      })

      if (status === 'approved') {
        toast.add({
          title: 'Member Approved',
          description: `${memberName} has been granted access to the Village Directory.`,
          color: 'success',
        })
      } else if (status === 'rejected') {
        toast.add({
          title: 'Access Revoked',
          description: `Village membership access has been revoked for ${memberName}.`,
          color: 'warning',
        })
      }

      await refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update member status'
      toast.add({
        title: 'Update Failed',
        description: message,
        color: 'error',
      })
    } finally {
      actionLoadingId.value = null
    }
  }

  function promptRevoke(member: VillageAdminMember) {
    memberToRevoke.value = member
    showRevokeModal.value = true
  }

  async function confirmRevoke() {
    if (!memberToRevoke.value) return
    const mem = memberToRevoke.value
    showRevokeModal.value = false
    await updateMemberStatus(mem.userId, 'rejected', mem.name)
    memberToRevoke.value = null
  }

  function viewDetails(member: VillageAdminMember) {
    selectedMember.value = member
    showDetailModal.value = true
  }
</script>

<template>
  <div class="space-y-6">
    <!-- Header Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div
        class="cursor-pointer rounded-xl border p-5 shadow-xs transition-colors"
        :class="[
          statusFilter === 'pending'
            ? 'border-gold-deep bg-gold/10 ring-1 ring-gold-deep'
            : 'border-line bg-cream-light hover:border-sage',
        ]"
        @click="statusFilter = 'pending'"
      >
        <div class="flex items-center justify-between">
          <p class="text-xs font-medium tracking-wider text-gold-deep uppercase">Pending Review</p>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/20 text-gold-deep"
          >
            <UIcon name="i-heroicons-clock-20-solid" class="h-5 w-5" />
          </div>
        </div>
        <p class="mt-2 font-serif text-3xl font-bold text-gold-deep">{{ pendingCount }}</p>
        <p class="mt-1 text-xs text-ink-muted">Applications awaiting admin approval</p>
      </div>

      <div
        class="cursor-pointer rounded-xl border p-5 shadow-xs transition-colors"
        :class="[
          statusFilter === 'approved'
            ? 'border-forest bg-forest/10 ring-1 ring-forest'
            : 'border-line bg-cream-light hover:border-sage',
        ]"
        @click="statusFilter = 'approved'"
      >
        <div class="flex items-center justify-between">
          <p class="text-xs font-medium tracking-wider text-forest uppercase">Approved Members</p>
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-forest/15 text-forest">
            <UIcon name="i-heroicons-check-circle-20-solid" class="h-5 w-5" />
          </div>
        </div>
        <p class="mt-2 font-serif text-3xl font-bold text-forest-deep">{{ approvedCount }}</p>
        <p class="mt-1 text-xs text-ink-muted">Active members visible in Directory</p>
      </div>
    </div>

    <!-- Main Card -->
    <UCard class="w-full border border-line bg-cream-light shadow-sm">
      <template #header>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-shield-check-20-solid" class="h-5 w-5 text-forest" />
                <h2 class="font-serif text-lg font-semibold text-forest-deep">
                  Village Member Verifications
                </h2>
              </div>
              <p class="mt-0.5 text-xs text-ink-muted">
                Review applicant qualifications, approve village members, and manage or revoke
                directory access.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <UButton
                variant="outline"
                color="neutral"
                icon="i-heroicons-arrow-path-20-solid"
                size="sm"
                :loading="pending"
                label="Refresh"
                @click="() => refresh()"
              />
            </div>
          </div>

          <!-- Controls Bar: Search & Status Pills & Role Filter -->
          <div
            class="flex flex-col justify-between gap-3 border-t border-line pt-2 lg:flex-row lg:items-center"
          >
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                :class="[
                  statusFilter === 'all'
                    ? 'bg-forest text-paper shadow-xs'
                    : 'text-ink-muted hover:bg-sage-light/40 hover:text-forest-deep',
                ]"
                @click="statusFilter = 'all'"
              >
                All ({{ totalCount }})
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                :class="[
                  statusFilter === 'pending'
                    ? 'bg-gold-deep text-paper shadow-xs'
                    : 'text-ink-muted hover:bg-sage-light/40 hover:text-forest-deep',
                ]"
                @click="statusFilter = 'pending'"
              >
                <span>Pending</span>
                <span
                  v-if="pendingCount > 0"
                  class="py-0.2 rounded-full px-1.5 text-[10px] font-bold"
                  :class="[
                    statusFilter === 'pending'
                      ? 'bg-paper text-gold-deep'
                      : 'bg-gold/30 text-gold-deep',
                  ]"
                >
                  {{ pendingCount }}
                </span>
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                :class="[
                  statusFilter === 'approved'
                    ? 'bg-forest text-paper shadow-xs'
                    : 'text-ink-muted hover:bg-sage-light/40 hover:text-forest-deep',
                ]"
                @click="statusFilter = 'approved'"
              >
                Approved ({{ approvedCount }})
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                :class="[
                  statusFilter === 'rejected'
                    ? 'bg-red-700 text-paper shadow-xs'
                    : 'text-ink-muted hover:bg-sage-light/40 hover:text-forest-deep',
                ]"
                @click="statusFilter = 'rejected'"
              >
                Revoked ({{ rejectedCount }})
              </button>
            </div>

            <div class="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <!-- Role selector -->
              <div class="min-w-[150px]">
                <select
                  v-model="roleFilter"
                  class="w-full rounded-md border border-line bg-cream px-2.5 py-1.5 text-xs text-forest-deep focus:border-forest focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="clinician">Clinicians</option>
                  <option value="wellness">Wellness Providers</option>
                  <option value="coach">Coaches</option>
                  <option value="faith_leader">Faith Leaders</option>
                </select>
              </div>

              <!-- Search -->
              <div class="w-full sm:w-60">
                <UInput
                  v-model="searchQuery"
                  icon="i-heroicons-magnifying-glass-20-solid"
                  placeholder="Search by name, org, city..."
                  size="sm"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Loading skeleton -->
      <div v-if="pending" class="space-y-4 py-4">
        <div v-for="i in 3" :key="i" class="space-y-3 rounded-xl border border-line p-4">
          <div class="flex items-center gap-3">
            <USkeleton class="h-12 w-12 rounded-full" />
            <div class="flex-1 space-y-2">
              <USkeleton class="h-4 w-48" />
              <USkeleton class="h-3 w-32" />
            </div>
          </div>
          <USkeleton class="h-10 w-full" />
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="py-4">
        <UAlert
          icon="i-heroicons-exclamation-triangle-20-solid"
          color="error"
          variant="subtle"
          title="Error loading village members"
          :description="error.message"
        />
      </div>

      <!-- Members Verification List -->
      <div v-else class="space-y-4">
        <div
          v-for="m in filteredMembers"
          :key="m.userId"
          class="rounded-xl border border-line bg-cream/40 p-4 transition-shadow hover:shadow-sm sm:p-5"
        >
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <!-- Member Identity & Roles -->
            <div class="flex min-w-0 items-start gap-3.5">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-full border border-line bg-cream text-sm font-semibold text-forest-deep shadow-2xs"
              >
                {{ getInitials(m.name) }}
              </div>

              <div class="min-w-0 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="truncate font-serif text-base font-bold text-forest-deep">
                    {{ m.name }}
                  </h3>

                  <!-- Application Status Badge -->
                  <UBadge
                    v-if="m.applicationStatus === 'approved'"
                    size="xs"
                    color="success"
                    variant="subtle"
                    class="inline-flex items-center gap-1 font-medium"
                  >
                    <UIcon name="i-heroicons-check-circle-20-solid" class="h-3 w-3" />
                    Approved Member
                  </UBadge>
                  <span v-if="m.applicationStatus === 'approved'" class="text-xs text-ink-muted">
                    Approved by:
                    <span class="font-medium text-forest-deep">{{
                      m.reviewerName || 'Admin'
                    }}</span>
                  </span>
                  <UBadge
                    v-else-if="m.applicationStatus === 'pending'"
                    size="xs"
                    color="warning"
                    variant="subtle"
                    class="inline-flex items-center gap-1 bg-gold-light/30 font-medium text-gold-deep"
                  >
                    <UIcon name="i-heroicons-clock-20-solid" class="h-3 w-3" />
                    Pending Review
                  </UBadge>
                  <UBadge
                    v-else
                    size="xs"
                    color="error"
                    variant="subtle"
                    class="inline-flex items-center gap-1 font-medium"
                  >
                    <UIcon name="i-heroicons-no-symbol-20-solid" class="h-3 w-3" />
                    Access Revoked
                  </UBadge>
                </div>

                <p class="truncate text-xs text-ink-muted">{{ m.email }}</p>

                <!-- Roles badges -->
                <div class="flex flex-wrap gap-1 pt-1">
                  <span
                    v-for="r in m.roles"
                    :key="r"
                    class="inline-flex items-center rounded-md bg-sage-light/60 px-2 py-0.5 text-[11px] font-medium text-forest-deep"
                  >
                    {{ getRoleLabel(r) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons for Admins -->
            <div class="flex flex-wrap items-center gap-2 self-start lg:self-center">
              <UButton
                variant="outline"
                color="neutral"
                size="xs"
                icon="i-heroicons-information-circle-20-solid"
                label="Full Details"
                @click="viewDetails(m)"
              />

              <!-- Action: Approve Pending Member -->
              <UButton
                v-if="m.applicationStatus === 'pending'"
                color="primary"
                variant="solid"
                size="xs"
                icon="i-heroicons-check-20-solid"
                label="Approve Member"
                :loading="actionLoadingId === m.userId"
                @click="updateMemberStatus(m.userId, 'approved', m.name)"
              />

              <!-- Action: Deny Pending Member -->
              <UButton
                v-if="m.applicationStatus === 'pending'"
                color="error"
                variant="soft"
                size="xs"
                icon="i-heroicons-x-mark-20-solid"
                label="Deny"
                :loading="actionLoadingId === m.userId"
                @click="updateMemberStatus(m.userId, 'rejected', m.name)"
              />

              <!-- Action: Revoke Approved Member Access -->
              <UButton
                v-if="m.applicationStatus === 'approved'"
                color="error"
                variant="soft"
                size="xs"
                icon="i-heroicons-no-symbol-20-solid"
                label="Revoke Access"
                :loading="actionLoadingId === m.userId"
                @click="promptRevoke(m)"
              />

              <!-- Action: Reinstate / Approve Revoked Member -->
              <UButton
                v-if="m.applicationStatus === 'rejected'"
                color="primary"
                variant="outline"
                size="xs"
                icon="i-heroicons-arrow-path-20-solid"
                label="Re-Approve Access"
                :loading="actionLoadingId === m.userId"
                @click="updateMemberStatus(m.userId, 'approved', m.name)"
              />
            </div>
          </div>

          <!-- Professional & Verification Details Grid -->
          <div
            class="mt-4 grid grid-cols-1 gap-2.5 rounded-lg border border-line bg-cream-light p-3 text-xs sm:grid-cols-2 md:grid-cols-4"
          >
            <div>
              <span class="block text-ink-muted">Organization:</span>
              <span class="font-medium text-forest-deep">{{
                m.organization || 'Independent'
              }}</span>
            </div>

            <div>
              <span class="block text-ink-muted">Credentials:</span>
              <span class="font-medium text-forest-deep">{{
                m.credentials || 'Not specified'
              }}</span>
            </div>

            <div>
              <span class="block text-ink-muted">Location:</span>
              <span class="font-medium text-forest-deep">{{
                m.city || 'Remote / Unspecified'
              }}</span>
            </div>

            <div>
              <span class="block text-ink-muted">Contact Preference:</span>
              <span class="font-medium text-forest-deep capitalize">
                {{ m.preferredContactMethod || 'Email' }}
                <span v-if="m.phoneNumber" class="text-ink-muted">({{ m.phoneNumber }})</span>
              </span>
            </div>
          </div>

          <!-- Reason for Joining Snippet (if available) -->
          <div
            v-if="m.reasonForJoining"
            class="mt-3 rounded-md border border-line/60 bg-cream/70 p-2.5 text-xs text-ink-muted"
          >
            <span class="font-semibold text-forest-deep">Statement / Purpose:</span>
            <p class="mt-0.5 line-clamp-2 italic">"{{ m.reasonForJoining }}"</p>
          </div>

          <!-- Audit info footer -->
          <div
            class="mt-3 flex flex-wrap items-center justify-between border-t border-line/50 pt-2 text-[11px] text-ink-muted"
          >
            <div>Applied: {{ formatDate(m.createdAt) }}</div>
            <div v-if="m.reviewedAt">
              Reviewed {{ formatDate(m.reviewedAt) }}
              <span v-if="m.reviewerName">by {{ m.reviewerName }}</span>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredMembers.length === 0" class="py-12 text-center">
          <UIcon name="i-heroicons-user-group-20-solid" class="mx-auto h-10 w-10 text-sage" />
          <h3 class="mt-2 font-serif text-base font-semibold text-forest-deep">
            No village applications found
          </h3>
          <p class="mt-1 text-xs text-ink-muted">
            No applicant records match your current status or search filters.
          </p>
          <div class="mt-4">
            <UButton
              variant="outline"
              color="neutral"
              size="xs"
              label="Reset Filters"
              @click="
                () => {
                  statusFilter = 'all'
                  roleFilter = 'all'
                  searchQuery = ''
                }
              "
            />
          </div>
        </div>
      </div>
    </UCard>

    <!-- Confirmation Modal: Revoke Member Access -->
    <UModal v-model:open="showRevokeModal">
      <template #content>
        <div class="rounded-xl bg-cream-light p-6">
          <div class="mb-4 flex items-center gap-3 text-red-600">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100"
            >
              <UIcon
                name="i-heroicons-exclamation-triangle-20-solid"
                class="h-6 w-6 text-red-600"
              />
            </div>
            <div>
              <h3 class="font-serif text-lg font-bold text-forest-deep">Revoke Village Access</h3>
              <p class="text-xs text-ink-muted">Confirm member access revocation</p>
            </div>
          </div>

          <p class="mb-4 text-sm text-ink">
            Are you sure you want to revoke Village access for
            <strong class="text-forest-deep">{{ memberToRevoke?.name }}</strong>
            ({{ memberToRevoke?.email }})?
          </p>

          <p class="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-ink-muted">
            This will immediately remove their profile from the public and member Village Directory,
            and revoke their permission to browse member listings. You can re-approve them at any
            time.
          </p>

          <div class="flex justify-end gap-3">
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              label="Cancel"
              @click="showRevokeModal = false"
            />
            <UButton
              color="error"
              variant="solid"
              size="sm"
              icon="i-heroicons-no-symbol-20-solid"
              label="Confirm Revocation"
              :loading="actionLoadingId === memberToRevoke?.userId"
              @click="confirmRevoke"
            />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Detailed Applicant Modal -->
    <UModal v-model:open="showDetailModal">
      <template #content>
        <div
          v-if="selectedMember"
          class="max-h-[85vh] overflow-y-auto rounded-xl bg-cream-light p-6"
        >
          <div class="mb-4 flex items-center justify-between border-b border-line pb-4">
            <div>
              <h3 class="font-serif text-xl font-bold text-forest-deep">
                {{ selectedMember.name }}
              </h3>
              <p class="text-xs text-ink-muted">{{ selectedMember.email }}</p>
            </div>
            <UButton
              icon="i-heroicons-x-mark-20-solid"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="showDetailModal = false"
            />
          </div>

          <div class="space-y-4 text-xs">
            <div>
              <span class="mb-1 block font-semibold text-forest-deep">Status:</span>
              <UBadge
                :color="
                  selectedMember.applicationStatus === 'approved'
                    ? 'success'
                    : selectedMember.applicationStatus === 'pending'
                      ? 'warning'
                      : 'error'
                "
                variant="subtle"
                size="sm"
              >
                {{ selectedMember.applicationStatus.toUpperCase() }}
              </UBadge>
            </div>

            <div>
              <span class="mb-1 block font-semibold text-forest-deep">Roles:</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="r in selectedMember.roles"
                  :key="r"
                  class="rounded bg-sage-light/60 px-2 py-0.5 font-medium text-forest-deep"
                >
                  {{ getRoleLabel(r) }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <span class="block text-ink-muted">Organization:</span>
                <span class="font-medium text-forest-deep">{{
                  selectedMember.organization || 'None'
                }}</span>
              </div>
              <div>
                <span class="block text-ink-muted">Credentials:</span>
                <span class="font-medium text-forest-deep">{{
                  selectedMember.credentials || 'None'
                }}</span>
              </div>
              <div>
                <span class="block text-ink-muted">City:</span>
                <span class="font-medium text-forest-deep">{{
                  selectedMember.city || 'Unspecified'
                }}</span>
              </div>
              <div>
                <span class="block text-ink-muted">Phone:</span>
                <span class="font-medium text-forest-deep">{{
                  selectedMember.phoneNumber || 'None'
                }}</span>
              </div>
              <div>
                <span class="block text-ink-muted">Preferred Contact:</span>
                <span class="font-medium text-forest-deep capitalize">{{
                  selectedMember.preferredContactMethod || 'Email'
                }}</span>
              </div>
              <div>
                <span class="block text-ink-muted">Availability:</span>
                <span class="font-medium text-forest-deep capitalize">{{
                  selectedMember.availability
                }}</span>
              </div>
            </div>

            <div v-if="selectedMember.website">
              <span class="block text-ink-muted">Website:</span>
              <a
                :href="selectedMember.website"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium break-all text-forest hover:underline"
              >
                {{ selectedMember.website }}
              </a>
            </div>

            <div v-if="selectedMember.reasonForJoining">
              <span class="mb-1 block font-semibold text-forest-deep"
                >Reason for Joining / Purpose:</span
              >
              <div class="rounded-lg border border-line bg-cream p-3 leading-relaxed text-ink">
                {{ selectedMember.reasonForJoining }}
              </div>
            </div>

            <div class="space-y-1 border-t border-line pt-2 text-[11px] text-ink-muted">
              <div>Submitted: {{ formatDate(selectedMember.createdAt) }}</div>
              <div v-if="selectedMember.reviewedAt">
                Reviewed: {{ formatDate(selectedMember.reviewedAt) }}
                <span v-if="selectedMember.reviewerName">({{ selectedMember.reviewerName }})</span>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-2 border-t border-line pt-4">
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              label="Close"
              @click="showDetailModal = false"
            />
            <UButton
              v-if="selectedMember.applicationStatus === 'pending'"
              color="primary"
              size="sm"
              icon="i-heroicons-check-20-solid"
              label="Approve Member"
              @click="
                () => {
                  showDetailModal = false
                  updateMemberStatus(selectedMember!.userId, 'approved', selectedMember!.name)
                }
              "
            />
            <UButton
              v-if="selectedMember.applicationStatus === 'approved'"
              color="error"
              variant="soft"
              size="sm"
              icon="i-heroicons-no-symbol-20-solid"
              label="Revoke Access"
              @click="
                () => {
                  showDetailModal = false
                  promptRevoke(selectedMember!)
                }
              "
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
