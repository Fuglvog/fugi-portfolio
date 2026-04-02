export interface Event {
  id: string
  day: string
  month: string
  year: string
  venue: string
  city: string
  country: string
  ticketUrl?: string
  soldOut?: boolean
}

export const events: Event[] = [
  {
    id: '1',
    day: '15',
    month: 'APR',
    year: '2024',
    venue: 'Fabric',
    city: 'London',
    country: 'UK',
    ticketUrl: '#',
  },
  {
    id: '2',
    day: '03',
    month: 'MAY',
    year: '2024',
    venue: 'Berghain',
    city: 'Berlin',
    country: 'DE',
    soldOut: true,
  },
  {
    id: '3',
    day: '17',
    month: 'MAY',
    year: '2024',
    venue: 'Tresor',
    city: 'Berlin',
    country: 'DE',
    ticketUrl: '#',
  },
  {
    id: '4',
    day: '08',
    month: 'JUN',
    year: '2024',
    venue: 'De School',
    city: 'Amsterdam',
    country: 'NL',
    ticketUrl: '#',
  },
  {
    id: '5',
    day: '22',
    month: 'JUN',
    year: '2024',
    venue: 'Printworks',
    city: 'London',
    country: 'UK',
    ticketUrl: '#',
  },
  {
    id: '6',
    day: '12',
    month: 'JUL',
    year: '2024',
    venue: 'Bassiani',
    city: 'Tbilisi',
    country: 'GE',
    ticketUrl: '#',
  },
]
