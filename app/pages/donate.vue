<template>
  <div>
    <!-- Hero Section -->
    <UPageHero
      title="Change the story. Fund the change."
      description="Mental wellness should not depend on your ZIP code, your income, or whether you know where to turn. Your gift helps A Mindful Resource Inc. bring trusted mental health education, community connection, and pathways to care into the neighborhoods that need them."
      headline="Care Before Crisis™ · A Mindful Resource Inc."
      :links="heroLinks"
      orientation="horizontal"
    >
      <NuxtImg
        src="/images/carefest/care-before-crisis-team.jpg"
        alt="A Mindful Resource team showing up for the community at CareFest"
        class="w-full rounded-lg"
        fit="inside"
        loading="lazy"
        decoding="async"
        priority
      />
    </UPageHero>

    <!-- Impact & Giving Console Section -->
    <UPageSection
      id="give"
      title="Real people. Real connection."
      headline="Your impact starts here"
      description="Your gift helps keep the next connection possible."
      :features="features"
      orientation="horizontal"
    >
      <UPageCard variant="subtle" title="Make a donation">
        <UForm :state="DonationState" class="space-y-4">
          <!-- Frequency -->
          <UFormField
            name="frequency"
            label="Frequency"
            description="Select how often you would like to donate"
            required
          >
            <URadioGroup
              v-model="DonationState.frequency"
              indicator="hidden"
              orientation="horizontal"
              variant="table"
              :items="frequencies"
              :ui="{ item: 'flex-1 justify-center' }"
            />
          </UFormField>

          <!-- Amount -->
          <UFormField
            name="preset"
            label="Amount"
            description="Select how much you would like to donate"
            required
          >
            <URadioGroup
              v-model="DonationState.preset"
              indicator="hidden"
              orientation="horizontal"
              variant="table"
              :items="amountPresets"
              :ui="{ item: 'flex-1 justify-center' }"
            />
          </UFormField>

          <UFormField
            v-if="DonationState.preset === 'custom'"
            name="customAmount"
            label="Custom Amount"
            description="Enter your custom donation amount"
            required
          >
            <UInputNumber
              v-model="DonationState.customAmount"
              :min="1"
              :step="0.01"
              placeholder="Enter amount"
              class="w-full"
            />
          </UFormField>

          <!-- Form submission -->
          <UButton
            type="submit"
            label="Donate"
            icon="i-heroicons-heart"
            trailing-icon="i-heroicons-arrow-up-right"
            data-gb-account="WIDGETACCOUNT_ID"
            data-gb-campaign="QeMcny"
            :frequency="DonationState.frequency"
            :amount="finalAmount"
          />
        </UForm>
      </UPageCard>
    </UPageSection>

    <!-- Real world impact: CareFest 2026 -->
    <UPageSection
      title="CareFest 2026"
      headline="Real world impacts"
      description="With your donations, we have been able to make events like CareFest 2026 possible."
      orientation="horizontal"
      :features="careFestStats"
    >
      <UCarousel v-slot="{ item }" arrows dots :items="careFestImages" autoplay>
        <NuxtImg :src="item" loading="lazy" decoding="async" />
      </UCarousel>
    </UPageSection>

    <!-- How does your donation help -->
    <UPageSection
      title="How does your donation help?"
      headline="Real world impacts"
      description="Gifts support Care Before Crisis™ programs where the need is greatest. Online gifts are not restricted to one program."
    >
      <UBlogPosts :posts="programs" orientation="vertical" />
    </UPageSection>

    <!-- Other Ways to donate -->
    <UPageSection
      title="Other ways to donate"
      description="Explore additional ways you or your organization can invest in mental wellness for Dallas."
    >
      <UPageGrid>
        <UPageCard
          v-for="item in otherWaysToGive"
          :key="item.title"
          :title="item.title"
          :description="item.description"
          :icon="item.icon"
          :to="item.to"
          variant="subtle"
        >
          <template v-if="item.footer" #footer>
            <p class="text-sm text-ink-muted">{{ item.footer }}</p>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <!-- FAQ Section -->
    <UPageSection title="Questions" headline="Everything you need to know" orientation="horizontal">
      <UCard variant="subtle">
        <UAccordion :items="faqItems" type="single" />
      </UCard>
    </UPageSection>

    <!-- Share This Cause Section -->
    <UPageSection
      title="Share This Cause"
      description="Pick a message, make it yours, then post it anywhere. The donation link is added automatically."
      orientation="horizontal"
    >
      <UCard variant="subtle" title="Spread the word">
        <UForm class="space-y-4" :state="messageState" @submit="handleMessageFormSubmission">
          <UFormField name="message" label="Message" required>
            <UTextarea
              v-model="messageState.message"
              class="w-full"
              color="primary"
              variant="outline"
              placeholder="Type message..."
              autoresize
            />
          </UFormField>

          <UButton type="submit" label="Share" icon="i-heroicons-share" v-if="sharingExists" />
          <UButton type="submit" label="Copy message" icon="i-heroicons-copy" v-else />
        </UForm>
      </UCard>
    </UPageSection>
  </div>
</template>

<script lang="ts" setup>
  import type { BlogPostProps, ButtonProps, PageFeatureProps, RadioGroupItem } from '@nuxt/ui'

  interface DonationForm {
    frequency: 'one-time' | 'monthly'
    preset: number | 'custom'
    customAmount?: number
  }

  const DonationState = reactive<DonationForm>({
    frequency: 'one-time',
    preset: 25,
    customAmount: 50,
  })

  const finalAmount = computed(() => {
    return DonationState.preset === 'custom'
      ? (DonationState.customAmount ?? 0)
      : DonationState.preset
  })

  const frequencies = ref<RadioGroupItem[]>([
    { label: 'One-time', value: 'one-time' },
    { label: 'Monthly', value: 'monthly' },
  ])

  const amountPresets = ref<RadioGroupItem[]>([
    { label: '$25', value: 25 },
    { label: '$50', value: 50 },
    { label: '$100', value: 100 },
    { label: '$250', value: 250 },
    { label: 'Custom', value: 'custom' },
  ])

  // Hero Links
  const heroLinks = ref<ButtonProps[]>([
    {
      label: 'Give today. Make care possible.',
      to: '#give',
      color: 'secondary',
      icon: 'i-heroicons-heart',
    },
  ])

  const features = ref<PageFeatureProps[]>([
    {
      title: '1,885+ people connected',
      description:
        '1,885+ people connected to care or resources so far in 2026 through our programs, community outreach, and events.',
      icon: 'i-heroicons-user-plus',
    },
    {
      title: 'Join the Care Before Crisis™ Collective',
      description: 'Monthly gifts help us plan ahead. One-time gifts matter just as much.',
      icon: 'i-heroicons-heart',
    },
  ])

  // CareFest 2026 Statistics
  const careFestStats = ref<PageFeatureProps[]>([
    {
      title: '288',
      description: 'people connected to resources',
    },
    {
      title: '200',
      description: 'meals served',
    },
    {
      title: '97',
      description: 'families received groceries',
    },
    {
      title: '28',
      description: 'people connected to culturally aligned care',
    },
  ])

  const careFestImages = [
    '/images/carefest/free.jpg',
    '/images/carefest/vote.jpg',
    '/images/carefest/food.jpg',
    '/images/carefest/dominique-speech.jpg',
    '/images/carefest/fist-bump.jpg',
    '/images/carefest/cpr.jpg',
    '/images/carefest/bro-chill-speech.jpg',
    '/images/carefest/circle.jpg',
    '/images/carefest/speech-side-view.jpg',
  ]

  // Four Ways Your Gift Moves (Programs)
  const programs = ref<BlogPostProps[]>([
    {
      title: 'Bro Chill™',
      description:
        'Circles where Black men show up, speak real, and leave with brothers and resources.',
      image: '/images/carefest/bro-chill-group.jpg',
      to: '/programs/bro-chill',
    },
    {
      title: 'Youth education',
      description: 'Coping skills and mental health basics for students, families, and schools.',
      image: '/images/carefest/torch-teens.jpg',
      to: '/programs/school-programs',
    },
    {
      title: 'Community response',
      description:
        'Pop-ups, health fairs, and trainings like First 5 Minutes that meet people where they are.',
      image: '/images/carefest/care-before-crisis-team.jpg',
      to: '/events',
    },
    {
      title: 'Care navigation',
      description:
        'Connecting neighbors to culturally aligned providers. We connect to care; we do not provide therapy.',
      image: '/images/carefest/resource-conversation.jpg',
      to: '/programs/care-connections',
    },
  ])

  // Other Ways to Give
  const otherWaysToGive = [
    {
      title: 'Corporate & faith partners',
      description: 'Sponsor a program, workshop, or community health fair.',
      icon: 'i-heroicons-building-office-2',
      to: '/sponsors',
    },
    {
      title: 'Volunteer',
      description: 'Help at community events, circles, and resource pop-ups.',
      icon: 'i-heroicons-user-group',
      to: '/volunteer',
    },
    {
      title: 'Mail a check',
      description: 'Payable to A Mindful Resource Inc.',
      footer: '201 W Belt Line Rd, C600,Cedar Hill, TX 75104',
      icon: 'i-heroicons-envelope',
    },
    {
      title: 'Donor-advised fund',
      description: 'Recommend a grant to A Mindful Resource Inc., EIN 93-4976788.',
      footer: 'info@amindfulresource.org',
      icon: 'i-heroicons-banknotes',
      to: 'mailto:info@amindfulresource.org',
    },
  ]

  // FAQ Items
  const faqItems = [
    {
      label: 'Is my payment secure?',
      content:
        'Donations are processed by Givebutter, our third-party giving platform. We never see or store your card details.',
    },
    {
      label: 'Is my gift tax-deductible?',
      content:
        'A Mindful Resource Inc. is a 501(c)(3) nonprofit (EIN 93-4976788). Gifts are tax-deductible to the extent allowed by law. Check with your tax advisor.',
    },
    {
      label: 'Can I change or cancel a monthly gift?',
      content:
        "Yes. Monthly gifts are managed through Givebutter and can be changed or cancelled according to Givebutter's processes. Email info@amindfulresource.org if you need help.",
    },
    {
      label: 'Can I designate my gift?',
      content:
        'Gifts support Care Before Crisis™ programs where the need is greatest. To ask about a specific program, email info@amindfulresource.org before giving.',
    },
    {
      label: 'Can I dedicate my gift?',
      content:
        "Yes. Write your dedication in the gift box above, then add it in the dedication or note field on Givebutter's checkout. We copy it for you so you can paste it in.",
    },
    {
      label: 'Does A Mindful Resource provide therapy?',
      content:
        'No. We provide education, community programs and care navigation, and connect people to licensed, culturally aligned providers.',
    },
  ]

  // Share This Cause
  const donateUrl = 'https://www.amindfulresourceinc.org/donate'

  const sharingExists = typeof navigator !== 'undefined' && navigator.share

  interface MessageForm {
    message: string
  }

  const messageState = reactive<MessageForm>({
    message:
      "I'm backing A Mindful Resource to help support mental health wellness in black and brown communities. Please considering donating to help support their cause:",
  })

  async function handleMessageFormSubmission() {
    const toast = useToast()
    const message = `${messageState.message} ${donateUrl}`

    if (sharingExists) {
      try {
        await navigator.share({
          title: 'A Mindful Resource Inc.',
          text: message,
        })
      } catch {
        // Cancelled or failed
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(message)
      toast.add({
        title: 'Copied to clipboard',
        icon: 'i-heroicons-clipboard-copied',
      })
    } else {
      toast.add({
        title: 'Uh oh! Something went wrong.',
        description: 'Unable to copy message to clipboard.',
        color: 'error',
      })
    }
  }
</script>
