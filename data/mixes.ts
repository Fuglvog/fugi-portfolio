export interface Mix {
  id: string
  title: string
  duration: string
  genre: string
  date: string
  tracks: number
  art: string        // CSS gradient string for artwork
  audioUrl?: string  // Direct MP3 link (optional)
  embedUrl?: string  // SoundCloud / Mixcloud embed URL (optional)
}

export const mixes: Mix[] = [
  {
    id: 'fabric-live',
    title: 'Fabric Live',
    duration: '1:12:33',
    genre: 'Techno / Industrial',
    date: 'Mar 2024',
    tracks: 24,
    art: 'linear-gradient(135deg, #0c1a1f 0%, #09090b 100%)',
  },
  {
    id: 'ra-exchange',
    title: 'RA Exchange',
    duration: '0:58:14',
    genre: 'Deep Techno',
    date: 'Jan 2024',
    tracks: 18,
    art: 'linear-gradient(135deg, #0f172a 0%, #09090b 100%)',
  },
  {
    id: 'boiler-room-berlin',
    title: 'Boiler Room Berlin',
    duration: '1:45:02',
    genre: 'Experimental / EBM',
    date: 'Nov 2023',
    tracks: 31,
    art: 'linear-gradient(135deg, #1a0a00 0%, #09090b 100%)',
  },
  {
    id: 'dekmantel-podcast',
    title: 'Dekmantel Podcast',
    duration: '1:08:44',
    genre: 'Ambient Techno',
    date: 'Sep 2023',
    tracks: 20,
    art: 'linear-gradient(135deg, #042f2e 0%, #09090b 100%)',
  },
  {
    id: 'late-night-session',
    title: 'Late Night Session',
    duration: '2:03:17',
    genre: 'House / Techno',
    date: 'Jul 2023',
    tracks: 38,
    art: 'linear-gradient(135deg, #1c1917 0%, #09090b 100%)',
  },
  {
    id: 'sunrise-set',
    title: 'Sunrise Set',
    duration: '0:49:58',
    genre: 'Melodic Techno',
    date: 'Jun 2023',
    tracks: 15,
    art: 'linear-gradient(135deg, #083344 0%, #09090b 100%)',
  },
]
