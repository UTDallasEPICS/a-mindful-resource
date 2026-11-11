<script setup lang="ts">
  import { z } from 'zod'
  import { authClient } from '../utils/auth-client'

  const toast = useToast()
  const route = useRoute()

  const mode = ref<'login' | 'signup'>(route.query.mode === 'signup' ? 'signup' : 'login')
  const isLoading = ref(false)

  const state = reactive({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  })

  const signupSchema = z
    .object({
      email: z.string().email('Please enter a valid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })

  const currentSchema = computed(() => (mode.value === 'login' ? loginSchema : signupSchema))

  function toggleMode(newMode: 'login' | 'signup') {
    mode.value = newMode
    state.password = ''
    state.confirmPassword = ''
  }

  async function handleSubmit() {
    isLoading.value = true
    const redirect = (route.query.redirect as string) || '/'

    try {
      if (mode.value === 'login') {
        const { error } = await authClient.signIn.email({
          email: state.email.trim(),
          password: state.password,
        })

        if (error) {
          toast.add({
            title: 'Sign in failed',
            description: error.message || 'Invalid email or password',
            color: 'error',
          })
        } else {
          toast.add({
            title: 'Welcome back!',
            description: 'You have signed in successfully.',
            color: 'success',
          })
          await navigateTo(redirect, { external: true })
        }
      } else {
        const derivedName = state.email.split('@')[0] || 'User'
        const { error } = await authClient.signUp.email({
          email: state.email.trim(),
          password: state.password,
          name: derivedName,
        })

        if (error) {
          toast.add({
            title: 'Sign up failed',
            description: error.message || 'Unable to create account',
            color: 'error',
          })
        } else {
          toast.add({
            title: 'Account created!',
            description: 'A verification link has been sent to your email address.',
            color: 'success',
          })
          await navigateTo(redirect, { external: true })
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      toast.add({
        title: 'Error',
        description: message,
        color: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }
</script>

<template>
  <div class="flex min-h-[calc(100vh-16rem)] w-full items-center justify-center px-4 py-12">
    <div class="w-full max-w-md rounded-2xl border border-line bg-cream-light p-6 shadow-sm sm:p-8">
      <!-- header / toggle -->
      <div class="mb-6 text-center">
        <h1 class="font-serif text-2xl font-bold text-forest-deep sm:text-3xl">
          {{ mode === 'login' ? 'Sign in to your account' : 'Create your account' }}
        </h1>
        <p class="mt-2 text-sm text-ink-muted">
          {{
            mode === 'login'
              ? 'Access site resources and The Village network.'
              : 'Sign up with just your email and password.'
          }}
        </p>

        <!-- mode tabs -->
        <div class="mt-5 grid grid-cols-2 rounded-lg border border-line bg-cream p-1">
          <button
            type="button"
            class="rounded-md py-1.5 text-xs font-semibold transition-colors sm:text-sm"
            :class="
              mode === 'login'
                ? 'bg-forest text-paper shadow-xs'
                : 'text-ink-muted hover:text-forest-deep'
            "
            @click="toggleMode('login')"
          >
            Log In
          </button>
          <button
            type="button"
            class="rounded-md py-1.5 text-xs font-semibold transition-colors sm:text-sm"
            :class="
              mode === 'signup'
                ? 'bg-forest text-paper shadow-xs'
                : 'text-ink-muted hover:text-forest-deep'
            "
            @click="toggleMode('signup')"
          >
            Sign Up
          </button>
        </div>
      </div>

      <!-- form -->
      <UForm :schema="currentSchema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Email Address" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
            class="w-full"
            autocomplete="email"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
          :hint="mode === 'signup' ? 'Minimum 8 characters' : undefined"
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            class="w-full"
            autocomplete="current-password"
          />
        </UFormField>

        <UFormField v-if="mode === 'signup'" label="Confirm Password" name="confirmPassword">
          <UInput
            v-model="state.confirmPassword"
            type="password"
            placeholder="••••••••"
            class="w-full"
            autocomplete="new-password"
          />
        </UFormField>

        <UButton
          type="submit"
          color="primary"
          block
          size="lg"
          :loading="isLoading"
          class="mt-2 font-semibold"
        >
          {{ mode === 'login' ? 'Log In' : 'Create Account' }}
        </UButton>
      </UForm>

      <!-- footer switch -->
      <div class="mt-6 text-center text-xs text-ink-muted">
        <span v-if="mode === 'login'">
          Don't have an account?
          <button
            type="button"
            class="font-semibold text-gold-deep underline hover:text-forest"
            @click="toggleMode('signup')"
          >
            Sign up now
          </button>
        </span>
        <span v-else>
          Already have an account?
          <button
            type="button"
            class="font-semibold text-gold-deep underline hover:text-forest"
            @click="toggleMode('login')"
          >
            Log in instead
          </button>
        </span>
      </div>
    </div>
  </div>
</template>
