import { SongItem, DanmakuMessage } from '../types';
import nightWeMetCover from '../assets/images/album_night_we_met_1789098894760.jpg';
import concertLiveBg from '../assets/images/concert_live_stage_1789098877222.jpg';

export { concertLiveBg, nightWeMetCover };

export const PRESET_CONCERT_PHOTOS = [
  {
    name: '紫色舞台追光与烟雾',
    url: concertLiveBg,
  },
  {
    name: '万人紫海大合唱',
    url: nightWeMetCover,
  },
  {
    name: '摇滚舞台热烈声场',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: '夜空荧光手环星海',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: '主唱前排特写光影',
    url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: '体育场顶棚激光交织',
    url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: '人群欢呼举手剪影',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: '音乐节晚霞与暗紫',
    url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop',
  },
];

export const SONGS: SongItem[] = [
  {
    id: 'song-1',
    title: 'The Night We Met',
    artist: 'Lord Huron',
    album: 'Live at Madison Square Garden',
    duration: 312,
    durationStr: '5:12',
    venue: 'Madison Square Garden',
    date: '2025.08.16',
    coverImg: nightWeMetCover,
    images: [
      nightWeMetCover,
      concertLiveBg,
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1000&auto=format&fit=crop',
    ],
    notes: '万人紫海大合唱，主唱声线一出全场静谧又热烈，那是属于纽约夏夜最难忘的共振。',
  },
  {
    id: 'song-2',
    title: '505',
    artist: 'Arctic Monkeys',
    album: 'Live at Wembley Stadium',
    duration: 253,
    durationStr: '4:13',
    venue: 'Wembley Stadium',
    date: '2025.06.18',
    coverImg: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
      concertLiveBg,
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop',
    ],
    notes: '爆裂的失真吉他与全场观众的呐喊，黑白复古声场直接把红温气氛顶到天花板。',
  },
  {
    id: 'song-3',
    title: 'Yellow',
    artist: 'Coldplay',
    album: 'Music of the Spheres Tour',
    duration: 266,
    durationStr: '4:26',
    venue: 'Tokyo Dome',
    date: '2025.01.26',
    coverImg: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
      concertLiveBg,
      nightWeMetCover,
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop',
    ],
    notes: '五万只可回收发光手环在夜空中幻化为紫色与金色星云，美到令人屏息。',
  },
];

export const INITIAL_DANMAKUS: DanmakuMessage[] = [
  {
    id: 'dm-1',
    user: 'Luna',
    avatarColor: '#ec4899',
    badge: '👑',
    text: '这首太好听了吧！',
    timeStr: '01:12',
  },
  {
    id: 'dm-2',
    user: '阿哲',
    avatarColor: '#a855f7',
    text: '现场比录音还好听',
    timeStr: '01:45',
  },
  {
    id: 'dm-3',
    user: '小鱼',
    avatarColor: '#c084fc',
    text: '眼泪都出来了...',
    timeStr: '02:04',
  },
  {
    id: 'dm-4',
    user: 'Sky',
    avatarColor: '#f59e0b',
    text: '2025.8.16 这辈子一定要再来一次',
    timeStr: '02:28',
  },
  {
    id: 'dm-5',
    user: '静静',
    avatarColor: '#38bdf8',
    text: '好想回到现场',
    timeStr: '02:40',
  },
  {
    id: 'dm-6',
    user: 'Dreamer',
    avatarColor: '#f43f5e',
    text: '永远的经典 💖',
    timeStr: '02:55',
  },
  {
    id: 'dm-7',
    user: '小橙子',
    avatarColor: '#fb923c',
    text: '这首歌太适合现场了',
    timeStr: '03:10',
  },
];
