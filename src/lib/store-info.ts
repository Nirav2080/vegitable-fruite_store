export const storeInfo = {
  name: 'Richmond Vege Mart',
  tagline: 'A symphony of flavours',
  email: 'contact@richmondvegemart.co.nz',
  phone: '+64 3 123 4567',
  address: {
    line1: '123 Queen Street',
    suburb: 'Richmond',
    city: 'Nelson',
    region: 'Tasman',
    postcode: '7020',
    country: 'New Zealand',
  },
  hours: [
    { days: 'Monday – Friday', time: '8:00 am – 7:00 pm' },
    { days: 'Saturday', time: '8:00 am – 6:00 pm' },
    { days: 'Sunday', time: '9:00 am – 4:00 pm' },
  ],
  social: {
    facebook: '#',
    instagram: '#',
  },
} as const;
