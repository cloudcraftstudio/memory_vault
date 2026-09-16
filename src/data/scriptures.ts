import { ScriptureVerse } from '../types';

export interface ScriptureTheme {
  id: string;
  name: string;
  description: string;
  iconName: 'rays' | 'cherub' | 'dove' | 'cross' | 'crown' | 'prayer' | 'thorns';
}

export const SCRIPTURE_THEMES: ScriptureTheme[] = [
  { id: 'all', name: 'All Scripture', description: 'Every inspirational passage', iconName: 'rays' },
  { id: 'light', name: 'Light & Glory', description: 'Heavenly illumination and radiance', iconName: 'rays' },
  { id: 'love', name: 'Love & Grace', description: 'Cherishing family and timeless bonds', iconName: 'cherub' },
  { id: 'peace', name: 'Peace & Serenity', description: 'Comfort and tranquil blessings', iconName: 'dove' },
  { id: 'faith', name: 'Faith & Cross', description: 'Steadfast hope and devotion', iconName: 'cross' },
  { id: 'glory', name: 'Crown & Victory', description: 'Living with eternal purpose', iconName: 'crown' },
  { id: 'creation', name: 'Creation & Majesty', description: 'Wonders of mountains, skies, and seas', iconName: 'prayer' },
];

export const BIBLE_VERSES: ScriptureVerse[] = [
  // Light & Glory
  {
    reference: 'Genesis 1:3',
    text: 'And God said, “Let there be light,” and there was light.',
    theme: 'light',
  },
  {
    reference: 'John 1:5',
    text: 'The light shines in the darkness, and the darkness has not overcome it.',
    theme: 'light',
  },
  {
    reference: 'Matthew 5:16',
    text: 'Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.',
    theme: 'light',
  },
  {
    reference: 'Psalm 119:105',
    text: 'Your word is a lamp for my feet, a light on my path.',
    theme: 'light',
  },
  {
    reference: 'Psalm 27:1',
    text: 'The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life.',
    theme: 'light',
  },
  {
    reference: '2 Corinthians 4:6',
    text: 'For God, who said, “Let light shine out of darkness,” made his light shine in our hearts to give us the light of the knowledge of God’s glory.',
    theme: 'light',
  },

  // Love, Family & Grace
  {
    reference: '1 Corinthians 13:4-8',
    text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud... Love never fails.',
    theme: 'love',
  },
  {
    reference: 'Colossians 3:14',
    text: 'And over all these virtues put on love, which binds them all together in perfect unity.',
    theme: 'love',
  },
  {
    reference: '1 John 4:19',
    text: 'We love because He first loved us.',
    theme: 'love',
  },
  {
    reference: 'Proverbs 17:17',
    text: 'A friend loves at all times, and a brother is born for a time of adversity.',
    theme: 'love',
  },
  {
    reference: 'Psalm 133:1',
    text: 'How good and pleasant it is when God’s people live together in unity!',
    theme: 'love',
  },

  // Peace & Serenity (Dove & Prayer)
  {
    reference: 'Numbers 6:24-26',
    text: 'The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace.',
    theme: 'peace',
  },
  {
    reference: 'Philippians 4:6-7',
    text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God will guard your hearts.',
    theme: 'peace',
  },
  {
    reference: 'John 14:27',
    text: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled.',
    theme: 'peace',
  },
  {
    reference: 'Psalm 23:1-3',
    text: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.',
    theme: 'peace',
  },
  {
    reference: 'Isaiah 26:3',
    text: 'You will keep in perfect peace those whose minds are steadfast, because they trust in you.',
    theme: 'peace',
  },

  // Faith, Devotion & The Cross
  {
    reference: 'Proverbs 3:5-6',
    text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    theme: 'faith',
  },
  {
    reference: 'Hebrews 11:1',
    text: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
    theme: 'faith',
  },
  {
    reference: 'Galatians 2:20',
    text: 'I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God.',
    theme: 'faith',
  },
  {
    reference: 'Romans 8:28',
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    theme: 'faith',
  },

  // Crown & Eternal Glory
  {
    reference: '2 Timothy 4:7-8',
    text: 'I have fought the good fight, I have finished the race, I have kept the faith. Now there is in store for me the crown of righteousness.',
    theme: 'glory',
  },
  {
    reference: 'James 1:12',
    text: 'Blessed is the one who perseveres under trial... they will receive the crown of life that the Lord has promised to those who love him.',
    theme: 'glory',
  },
  {
    reference: '1 Peter 5:4',
    text: 'And when the Chief Shepherd appears, you will receive the unfading crown of glory.',
    theme: 'glory',
  },
  {
    reference: 'Revelation 2:10',
    text: 'Be faithful, even to the point of death, and I will give you life as your victor’s crown.',
    theme: 'glory',
  },

  // Creation & Wonder (Places, Nature, Sky)
  {
    reference: 'Psalm 19:1',
    text: 'The heavens declare the glory of God; the skies proclaim the work of his hands.',
    theme: 'creation',
  },
  {
    reference: 'Ecclesiastes 3:11',
    text: 'He has made everything beautiful in its time. He has also set eternity in the human heart.',
    theme: 'creation',
  },
  {
    reference: 'Psalm 104:24',
    text: 'How many are your works, Lord! In wisdom you made them all; the earth is full of your creatures.',
    theme: 'creation',
  },
  {
    reference: 'Isaiah 40:31',
    text: 'Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    theme: 'creation',
  },
  {
    reference: 'Psalm 139:14',
    text: 'I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.',
    theme: 'love',
  },
];

export function getRandomScripture(): ScriptureVerse {
  const index = Math.floor(Math.random() * BIBLE_VERSES.length);
  return BIBLE_VERSES[index];
}

export function getScripturesByTheme(theme: string): ScriptureVerse[] {
  if (theme === 'all') return BIBLE_VERSES;
  return BIBLE_VERSES.filter((v) => v.theme === theme);
}

export function getSuggestedScriptureForPhoto(tags: string[], category?: string): ScriptureVerse {
  const tStr = tags.join(' ').toLowerCase();

  if (tStr.includes('sunset') || tStr.includes('goldenhour') || tStr.includes('light') || tStr.includes('sun')) {
    return BIBLE_VERSES[0]; // Genesis 1:3 "Let there be light"
  }
  if (tStr.includes('family') || tStr.includes('grandma') || tStr.includes('reunion') || tStr.includes('toast')) {
    return BIBLE_VERSES[6]; // 1 Corinthians 13:4-8 "Love is patient..."
  }
  if (tStr.includes('ocean') || tStr.includes('mountain') || tStr.includes('landscape') || tStr.includes('yosemite')) {
    return BIBLE_VERSES[22]; // Psalm 19:1 "The heavens declare the glory of God"
  }
  if (tStr.includes('stars') || tStr.includes('night') || tStr.includes('astrophotography')) {
    return BIBLE_VERSES[1]; // John 1:5 "The light shines in the darkness"
  }
  if (tStr.includes('autumn') || tStr.includes('zen') || tStr.includes('temple')) {
    return BIBLE_VERSES[23]; // Ecclesiastes 3:11 "Everything beautiful in its time"
  }
  if (tStr.includes('fjord') || tStr.includes('norway') || tStr.includes('nature')) {
    return BIBLE_VERSES[25]; // Isaiah 40:31 "Soar on wings like eagles"
  }
  return getRandomScripture();
}
