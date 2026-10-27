export default defineAppConfig({
  ui: {
    button: {
      // Paper text on gold fails contrast (2.6:1). Gold buttons use forest-deep text.
      compoundVariants: [
        {
          color: 'secondary',
          variant: 'solid',
          class: 'text-forest-deep hover:bg-gold-hover active:bg-gold-hover',
        },
      ],
    },
  },
})
