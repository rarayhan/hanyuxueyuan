export interface AnnotatedWord {
  chinese: string;
  pinyin: string;
  english: string;
}

export interface Paragraph {
  words: AnnotatedWord[];
  englishTranslation: string;
}

export interface SinologyLesson {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  content: Paragraph[];
}

export interface SinologyModule {
  id: 'basic' | 'intermediate' | 'expert';
  title: string;
  description: string;
  lessons: SinologyLesson[];
}

export const SINOLOGY_MODULES: SinologyModule[] = [
  {
    "id": "basic",
    "title": "Basic: Architectural Components",
    "description": "Learn the fundamental building blocks of ancient Chinese architecture.",
    "lessons": [
      {
        "id": "b1",
        "title": "Wood and Brick (木和砖)",
        "description": "The foundational materials of ancient Chinese buildings.",
        "imageUrl": "https://storage.googleapis.com/aistudio-user-content/0-1711079143-20260412_090022_0.png",
        "content": [
          {
            "words": [
              { "chinese": "中国", "pinyin": "Zhōngguó", "english": "China" },
              { "chinese": "古", "pinyin": "gǔ", "english": "ancient" },
              { "chinese": "建筑", "pinyin": "jiànzhù", "english": "architecture" },
              { "chinese": "用", "pinyin": "yòng", "english": "uses" },
              { "chinese": "木头", "pinyin": "mùtou", "english": "wood" },
              { "chinese": "和", "pinyin": "hé", "english": "and" },
              { "chinese": "砖", "pinyin": "zhuān", "english": "brick" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Ancient Chinese architecture uses wood and bricks."
          },
          {
            "words": [
              { "chinese": "木头", "pinyin": "mùtou", "english": "wood" },
              { "chinese": "很", "pinyin": "hěn", "english": "very" },
              { "chinese": "长", "pinyin": "cháng", "english": "long" },
              { "chinese": "，", "pinyin": ",", "english": "," },
              { "chinese": "砖", "pinyin": "zhuān", "english": "brick" },
              { "chinese": "很", "pinyin": "hěn", "english": "very" },
              { "chinese": "重", "pinyin": "zhòng", "english": "heavy" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The wood is long, the bricks are heavy."
          },
          {
            "words": [
              { "chinese": "房子", "pinyin": "fángzi", "english": "house" },
              { "chinese": "很", "pinyin": "hěn", "english": "very" },
              { "chinese": "结实", "pinyin": "jiēshi", "english": "strong" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The house is very strong."
          }
        ]
      },
      {
        "id": "b2",
        "title": "The Courtyard (院子)",
        "description": "The central open space in traditional civil residences.",
        "imageUrl": "https://storage.googleapis.com/aistudio-user-content/0-1711079143-20260412_084552_1.png",
        "content": [
          {
            "words": [
              { "chinese": "这", "pinyin": "Zhè", "english": "This" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "一个", "pinyin": "yī gè", "english": "a" },
              { "chinese": "大", "pinyin": "dà", "english": "big" },
              { "chinese": "院子", "pinyin": "yuànzi", "english": "courtyard" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "This is a big courtyard."
          },
          {
            "words": [
              { "chinese": "院子", "pinyin": "yuànzi", "english": "courtyard" },
              { "chinese": "在", "pinyin": "zài", "english": "at/in" },
              { "chinese": "房子", "pinyin": "fángzi", "english": "house" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "中间", "pinyin": "zhōngjiān", "english": "middle" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The courtyard is in the middle of the house."
          },
          {
            "words": [
              { "chinese": "我们", "pinyin": "Wǒmen", "english": "We" },
              { "chinese": "喜欢", "pinyin": "xǐhuan", "english": "like" },
              { "chinese": "在", "pinyin": "zài", "english": "at/in" },
              { "chinese": "院子", "pinyin": "yuànzi", "english": "courtyard" },
              { "chinese": "里", "pinyin": "lǐ", "english": "inside" },
              { "chinese": "喝茶", "pinyin": "hē chá", "english": "drink tea" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "We like to drink tea in the courtyard."
          }
        ]
      },
      {
        "id": "b3",
        "title": "The Great Gate (大门)",
        "description": "The entrance architecture of government offices or large residences.",
        "imageUrl": "https://storage.googleapis.com/aistudio-user-content/0-1711079143-20260412_084552_3.png",
        "content": [
          {
            "words": [
              { "chinese": "这", "pinyin": "Zhè", "english": "This" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "古老", "pinyin": "gǔlǎo", "english": "ancient" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "大门", "pinyin": "dàmén", "english": "main gate" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "This is an ancient gate."
          },
          {
            "words": [
              { "chinese": "门", "pinyin": "Mén", "english": "door" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "红色", "pinyin": "hóngsè", "english": "red" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The door is red."
          },
          {
            "words": [
              { "chinese": "大门", "pinyin": "Dàmén", "english": "main gate" },
              { "chinese": "很", "pinyin": "hěn", "english": "very" },
              { "chinese": "高", "pinyin": "gāo", "english": "tall" },
              { "chinese": "，", "pinyin": ",", "english": "," },
              { "chinese": "也", "pinyin": "yě", "english": "also" },
              { "chinese": "很", "pinyin": "hěn", "english": "very" },
              { "chinese": "漂亮", "pinyin": "piàoliang", "english": "beautiful" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The main gate is very tall, and also very beautiful."
          }
        ]
      },
      {
        "id": "b4",
        "title": "Roof and Tiles (屋顶和瓦)",
        "description": "The iconic curved roofs of palaces and classic homes.",
        "imageUrl": "https://storage.googleapis.com/aistudio-user-content/0-1711079143-20260412_084552_0.png",
        "content": [
          {
            "words": [
              { "chinese": "古", "pinyin": "Gǔ", "english": "ancient" },
              { "chinese": "建筑", "pinyin": "jiànzhù", "english": "architecture" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "屋顶", "pinyin": "wūdǐng", "english": "roof" },
              { "chinese": "很", "pinyin": "hěn", "english": "very" },
              { "chinese": "特别", "pinyin": "tèbié", "english": "special" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The roof of ancient buildings is very special."
          },
          {
            "words": [
              { "chinese": "上面", "pinyin": "Shàngmiàn", "english": "on top" },
              { "chinese": "有", "pinyin": "yǒu", "english": "there are" },
              { "chinese": "很多", "pinyin": "hěn duō", "english": "many" },
              { "chinese": "瓦", "pinyin": "wǎ", "english": "tiles" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "There are many tiles on top."
          },
          {
            "words": [
              { "chinese": "瓦", "pinyin": "Wǎ", "english": "tiles" },
              { "chinese": "可以", "pinyin": "kěyǐ", "english": "can" },
              { "chinese": "挡雨", "pinyin": "dǎng yǔ", "english": "block rain" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Tiles can block the rain."
          }
        ]
      },
      {
        "id": "b5",
        "title": "The Stone Bridge (石桥)",
        "description": "Traditional bridge architecture.",
        "imageUrl": "https://storage.googleapis.com/aistudio-user-content/0-1711079143-20260412_084552_4.png",
        "content": [
          {
            "words": [
              { "chinese": "水上", "pinyin": "Shuǐ shàng", "english": "on the water" },
              { "chinese": "有", "pinyin": "yǒu", "english": "there is" },
              { "chinese": "一座", "pinyin": "yī zuò", "english": "a (measure word)" },
              { "chinese": "石桥", "pinyin": "shíqiáo", "english": "stone bridge" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "There is a stone bridge over the water."
          },
          {
            "words": [
              { "chinese": "石桥", "pinyin": "Shíqiáo", "english": "stone bridge" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "半圆形", "pinyin": "bànyuán xíng", "english": "semi-circular" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The stone bridge is semi-circular."
          },
          {
            "words": [
              { "chinese": "人们", "pinyin": "Rénmen", "english": "people" },
              { "chinese": "每天", "pinyin": "měitiān", "english": "every day" },
              { "chinese": "在", "pinyin": "zài", "english": "at/on" },
              { "chinese": "桥上", "pinyin": "qiáo shàng", "english": "bridge" },
              { "chinese": "走", "pinyin": "zǒu", "english": "walk" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "People walk on the bridge every day."
          }
        ]
      }
    ]
  },
  {
    "id": "intermediate",
    "title": "Intermediate: Regional Styles",
    "description": "Explore famous non-religious architectural sites and regional styles.",
    "lessons": [
      {
        "id": "i1",
        "title": "Fujian Tulou (福建土楼)",
        "description": "The unique earthen buildings of the Hakka people.",
        "imageUrl": "https://storage.googleapis.com/aistudio-user-content/0-1711079143-20260412_090022_0.png",
        "content": [
          {
            "words": [
              { "chinese": "福建", "pinyin": "Fújiàn", "english": "Fujian province" },
              { "chinese": "土楼", "pinyin": "tǔlóu", "english": "earthen building" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "大型", "pinyin": "dàxíng", "english": "large-scale" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "传统", "pinyin": "chuántǒng", "english": "traditional" },
              { "chinese": "民居", "pinyin": "mínjū", "english": "civil residence" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Fujian Tulou are large-scale traditional civil residences."
          }
        ]
      },
      {
        "id": "i2",
        "title": "Pingyao County Yamen (平遥县署)",
        "description": "The strict symmetry of feudal official architecture.",
        "content": [
          {
            "words": [
              { "chinese": "平遥", "pinyin": "Píngyáo", "english": "Pingyao" },
              { "chinese": "县署", "pinyin": "xiànshǔ", "english": "county yamen" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "古代", "pinyin": "gǔdài", "english": "ancient" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "官府", "pinyin": "guānfǔ", "english": "government office" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Pingyao County Yamen is an ancient government office."
          }
        ]
      },
      {
        "id": "i3",
        "title": "Huizhou Architecture (徽派建筑)",
        "description": "Elegant white walls and dark tiles in Anhui.",
        "content": [
          {
            "words": [
              { "chinese": "徽派", "pinyin": "Huīpài", "english": "Huizhou style" },
              { "chinese": "建筑", "pinyin": "jiànzhù", "english": "architecture" },
              { "chinese": "有", "pinyin": "yǒu", "english": "has" },
              { "chinese": "白墙", "pinyin": "báiqiáng", "english": "white walls" },
              { "chinese": "黑瓦", "pinyin": "hēiwǎ", "english": "black tiles" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Huizhou architecture has white walls and black tiles."
          }
        ]
      },
      {
        "id": "i4",
        "title": "Beijing Siheyuan (北京四合院)",
        "description": "Traditional courtyard houses of Beijing.",
        "content": [
          {
            "words": [
              { "chinese": "四合院", "pinyin": "sìhéyuàn", "english": "Siheyuan" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "北京", "pinyin": "Běijīng", "english": "Beijing" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "传统", "pinyin": "chuántǒng", "english": "traditional" },
              { "chinese": "民居", "pinyin": "mínjū", "english": "residence" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Siheyuan is a traditional residence in Beijing."
          }
        ]
      },
      {
        "id": "i5",
        "title": "Yaodong Cave Dwellings (窑洞)",
        "description": "Earth shelters in the Loess Plateau.",
        "content": [
          {
            "words": [
              { "chinese": "窑洞", "pinyin": "yáodòng", "english": "Yaodong" },
              { "chinese": "冬暖夏凉", "pinyin": "dōngnuǎnxiàliáng", "english": "warm in winter, cool in summer" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Yaodong is warm in winter and cool in summer."
          }
        ]
      },
      {
        "id": "i6",
        "title": "Jiangnan Water Towns (江南水乡)",
        "description": "Residences built along canals and rivers.",
        "content": [
          {
            "words": [
              { "chinese": "水乡", "pinyin": "shuǐxiāng", "english": "water town" },
              { "chinese": "民居", "pinyin": "mínjū", "english": "residence" },
              { "chinese": "建", "pinyin": "jiàn", "english": "built" },
              { "chinese": "在", "pinyin": "zài", "english": "at/on" },
              { "chinese": "河边", "pinyin": "hébiān", "english": "riverside" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Water town houses are built next to the river."
          }
        ]
      },
      {
        "id": "i7",
        "title": "Lingnan Architecture (岭南建筑)",
        "description": "Cantonese style adapted to hot climates.",
        "content": [
          {
            "words": [
              { "chinese": "岭南", "pinyin": "Lǐngnán", "english": "Lingnan" },
              { "chinese": "建筑", "pinyin": "jiànzhù", "english": "architecture" },
              { "chinese": "适应", "pinyin": "shìyìng", "english": "adapts to" },
              { "chinese": "炎热", "pinyin": "yánrè", "english": "hot" },
              { "chinese": "气候", "pinyin": "qìhòu", "english": "climate" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Lingnan architecture adapts to the hot climate."
          }
        ]
      },
      {
        "id": "i8",
        "title": "Shanxi Courtyards (晋商大院)",
        "description": "Grand compounds of wealthy merchants.",
        "content": [
          {
            "words": [
              { "chinese": "晋商", "pinyin": "Jìnshāng", "english": "Shanxi merchants" },
              { "chinese": "大院", "pinyin": "dàyuàn", "english": "courtyard" },
              { "chinese": "非常", "pinyin": "fēicháng", "english": "very" },
              { "chinese": "宏大", "pinyin": "hóngdà", "english": "grand" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Shanxi courtyards are very grand."
          }
        ]
      },
      {
        "id": "i9",
        "title": "Kaiping Diaolou (开平碉楼)",
        "description": "Fortified multi-story watchtower houses.",
        "content": [
          {
            "words": [
              { "chinese": "碉楼", "pinyin": "diāolóu", "english": "Diaolou" },
              { "chinese": "具有", "pinyin": "jùyǒu", "english": "possesses" },
              { "chinese": "防御", "pinyin": "fángyù", "english": "defensive" },
              { "chinese": "功能", "pinyin": "gōngnéng", "english": "function" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Diaolou has a defensive function."
          }
        ]
      },
      {
        "id": "i10",
        "title": "Hakka Walled Villages (客家围屋)",
        "description": "Large enclosed village structures.",
        "content": [
          {
            "words": [
              { "chinese": "围屋", "pinyin": "wéiwū", "english": "walled village" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "客家人", "pinyin": "Kèjiārén", "english": "Hakka people" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "家", "pinyin": "jiā", "english": "home" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Walled villages are the homes of the Hakka people."
          }
        ]
      }
    ]
  },
  {
    "id": "expert",
    "title": "Expert: Architectural Achievements",
    "description": "Detailed essays on major pre-1911 architectural engineering feats.",
    "lessons": [
      {
        "id": "e16",
        "title": "The Great Wall: Mountaintop Guardian (万里长城: 山顶的守护者)",
        "description": "The vastness of the wall and its integration with the mountainous landscape.",
        "imageUrl": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2000&auto=format&fit=crop",
        "content": [
          {
            "words": [
              { "chinese": "万里长城", "pinyin": "Wànlǐ Chángchéng", "english": "Great Wall of China" },
              { "chinese": "很", "pinyin": "hěn", "english": "very" },
              { "chinese": "高", "pinyin": "gāo", "english": "high" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The Great Wall is very high."
          },
          {
            "words": [
              { "chinese": "它", "pinyin": "tā", "english": "It" },
              { "chinese": "非常", "pinyin": "fēicháng", "english": "extremely" },
              { "chinese": "长", "pinyin": "cháng", "english": "long" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "It is extremely long."
          },
          {
            "words": [
              { "chinese": "长城", "pinyin": "Chángchéng", "english": "Great Wall" },
              { "chinese": "在", "pinyin": "zài", "english": "at/on" },
              { "chinese": "山上", "pinyin": "shān shàng", "english": "mountains" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The Great Wall is on the mountains."
          },
          {
            "words": [
              { "chinese": "中国", "pinyin": "Zhōngguó", "english": "China" },
              { "chinese": "人", "pinyin": "rén", "english": "people" },
              { "chinese": "以前", "pinyin": "yǐqián", "english": "in the past" },
              { "chinese": "在", "pinyin": "zài", "english": "at/on" },
              { "chinese": "山上", "pinyin": "shān shàng", "english": "mountains" },
              { "chinese": "建造", "pinyin": "jiànzào", "english": "built" },
              { "chinese": "它", "pinyin": "tā", "english": "it" },
              { "chinese": "，", "pinyin": ",", "english": "," },
              { "chinese": "为了", "pinyin": "wèile", "english": "in order to" },
              { "chinese": "保护", "pinyin": "bǎohù", "english": "protect" },
              { "chinese": "家", "pinyin": "jiā", "english": "home" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "In the past, Chinese people built it on mountains to protect their homes."
          },
          {
            "words": [
              { "chinese": "它", "pinyin": "tā", "english": "It" },
              { "chinese": "很", "pinyin": "hěn", "english": "very" },
              { "chinese": "古老", "pinyin": "gǔlǎo", "english": "old/ancient" },
              { "chinese": "，", "pinyin": ",", "english": "," },
              { "chinese": "很", "pinyin": "hěn", "english": "very" },
              { "chinese": "美", "pinyin": "měi", "english": "beautiful" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "It is very old and beautiful."
          },
          {
            "words": [
              { "chinese": "它", "pinyin": "tā", "english": "It" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "古代", "pinyin": "gǔdài", "english": "ancient" },
              { "chinese": "工程", "pinyin": "gōngchéng", "english": "engineering" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "奇迹", "pinyin": "qíjì", "english": "miracle" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "It is a miracle of ancient engineering."
          }
        ]
      },
      {
        "id": "e1",
        "title": "Zhaozhou Bridge (赵州桥)",
        "description": "The engineering marvel of ancient Chinese bridges.",
        "content": [
          {
            "words": [
              { "chinese": "赵州桥", "pinyin": "Zhàozhōu Qiáo", "english": "Zhaozhou Bridge" },
              { "chinese": "建于", "pinyin": "jiànyú", "english": "built in" },
              { "chinese": "隋代", "pinyin": "Suídài", "english": "Sui Dynasty" },
              { "chinese": "，", "pinyin": ",", "english": "," },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "著名", "pinyin": "zhùmíng", "english": "famous" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "石拱桥", "pinyin": "shígǒngqiáo", "english": "stone arch bridge" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Built in the Sui Dynasty, Zhaozhou Bridge is a famous stone arch bridge."
          }
        ]
      },
      {
        "id": "e2",
        "title": "The Forbidden City (故宫)",
        "description": "The pinnacle of imperial palace construction.",
        "content": [
          {
            "words": [
              { "chinese": "故宫", "pinyin": "Gùgōng", "english": "Forbidden City" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "明清", "pinyin": "Míng Qīng", "english": "Ming and Qing" },
              { "chinese": "两代", "pinyin": "liǎng dài", "english": "two dynasties" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "皇宫", "pinyin": "huánggōng", "english": "imperial palace" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The Forbidden City is the imperial palace of the Ming and Qing dynasties."
          }
        ]
      },
      {
        "id": "e3",
        "title": "Lugou Bridge (卢沟桥)",
        "description": "Also known as the Marco Polo Bridge.",
        "content": [
          {
            "words": [
              { "chinese": "卢沟桥", "pinyin": "Lúgōu Qiáo", "english": "Lugou Bridge" },
              { "chinese": "有", "pinyin": "yǒu", "english": "has" },
              { "chinese": "很多", "pinyin": "hěnduō", "english": "many" },
              { "chinese": "石狮子", "pinyin": "shíshīzi", "english": "stone lions" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Lugou Bridge has many stone lions."
          }
        ]
      },
      {
        "id": "e4",
        "title": "Luoyang Bridge (洛阳桥)",
        "description": "An ancient stone bridge in Quanzhou.",
        "content": [
          {
            "words": [
              { "chinese": "洛阳桥", "pinyin": "Luòyáng Qiáo", "english": "Luoyang Bridge" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "古代", "pinyin": "gǔdài", "english": "ancient" },
              { "chinese": "跨海", "pinyin": "kuàhǎi", "english": "sea-crossing" },
              { "chinese": "大桥", "pinyin": "dàqiáo", "english": "bridge" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Luoyang Bridge is an ancient sea-crossing bridge."
          }
        ]
      },
      {
        "id": "e5",
        "title": "Guangji Bridge (广济桥)",
        "description": "A historic pontoon bridge in Chaozhou.",
        "content": [
          {
            "words": [
              { "chinese": "广济桥", "pinyin": "Guǎngjì Qiáo", "english": "Guangji Bridge" },
              { "chinese": "可以", "pinyin": "kěyǐ", "english": "can" },
              { "chinese": "打开", "pinyin": "dǎkāi", "english": "open" },
              { "chinese": "让", "pinyin": "ràng", "english": "let" },
              { "chinese": "船", "pinyin": "chuán", "english": "ships" },
              { "chinese": "通过", "pinyin": "tōngguò", "english": "pass" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Guangji Bridge can open to let ships pass."
          }
        ]
      },
      {
        "id": "e6",
        "title": "Anping Bridge (安平桥)",
        "description": "The longest ancient stone bridge in China.",
        "content": [
          {
            "words": [
              { "chinese": "安平桥", "pinyin": "Ānpíng Qiáo", "english": "Anping Bridge" },
              { "chinese": "非常", "pinyin": "fēicháng", "english": "very" },
              { "chinese": "长", "pinyin": "cháng", "english": "long" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Anping Bridge is very long."
          }
        ]
      },
      {
        "id": "e7",
        "title": "Baodai Bridge (宝带桥)",
        "description": "The Precious Belt Bridge in Suzhou.",
        "content": [
          {
            "words": [
              { "chinese": "宝带桥", "pinyin": "Bǎodài Qiáo", "english": "Baodai Bridge" },
              { "chinese": "有", "pinyin": "yǒu", "english": "has" },
              { "chinese": "五十三个", "pinyin": "wǔshísān gè", "english": "fifty-three" },
              { "chinese": "桥孔", "pinyin": "qiáokǒng", "english": "arches" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Baodai Bridge has fifty-three arches."
          }
        ]
      },
      {
        "id": "e8",
        "title": "Shenyang Imperial Palace (沈阳故宫)",
        "description": "The early Qing dynasty imperial palace.",
        "content": [
          {
            "words": [
              { "chinese": "沈阳", "pinyin": "Shěnyáng", "english": "Shenyang" },
              { "chinese": "故宫", "pinyin": "Gùgōng", "english": "Imperial Palace" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "清代", "pinyin": "Qīngdài", "english": "Qing dynasty" },
              { "chinese": "早期", "pinyin": "zǎoqī", "english": "early" },
              { "chinese": "皇宫", "pinyin": "huánggōng", "english": "palace" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Shenyang Imperial Palace is an early Qing palace."
          }
        ]
      },
      {
        "id": "e9",
        "title": "Chengde Mountain Resort (避暑山庄)",
        "description": "The imperial summer resort.",
        "content": [
          {
            "words": [
              { "chinese": "皇帝", "pinyin": "huángdì", "english": "emperor" },
              { "chinese": "在", "pinyin": "zài", "english": "at" },
              { "chinese": "避暑山庄", "pinyin": "Bìshǔ Shānzhuāng", "english": "Mountain Resort" },
              { "chinese": "过夏", "pinyin": "guòxià", "english": "spend the summer" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The emperor spent the summer at the Mountain Resort."
          }
        ]
      },
      {
        "id": "e10",
        "title": "Summer Palace (颐和园)",
        "description": "A vast ensemble of lakes, gardens and palaces.",
        "content": [
          {
            "words": [
              { "chinese": "颐和园", "pinyin": "Yíhéyuán", "english": "Summer Palace" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "美丽", "pinyin": "měilì", "english": "beautiful" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "皇家", "pinyin": "huángjiā", "english": "imperial" },
              { "chinese": "园林", "pinyin": "yuánlín", "english": "garden" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The Summer Palace is a beautiful imperial garden."
          }
        ]
      },
      {
        "id": "e11",
        "title": "Old Summer Palace (圆明园)",
        "description": "The complex of palaces and gardens in Beijing.",
        "content": [
          {
            "words": [
              { "chinese": "圆明园", "pinyin": "Yuánmíngyuán", "english": "Old Summer Palace" },
              { "chinese": "曾经", "pinyin": "céngjīng", "english": "once" },
              { "chinese": "非常", "pinyin": "fēicháng", "english": "very" },
              { "chinese": "宏大", "pinyin": "hóngdà", "english": "grand" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "The Old Summer Palace was once very grand."
          }
        ]
      },
      {
        "id": "e12",
        "title": "Prince Gong's Mansion (恭王府)",
        "description": "A museum and tourist attraction in Beijing.",
        "content": [
          {
            "words": [
              { "chinese": "恭王府", "pinyin": "Gōngwángfǔ", "english": "Prince Gong's Mansion" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "著名", "pinyin": "zhùmíng", "english": "famous" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "府邸", "pinyin": "fǔdǐ", "english": "residence" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Prince Gong's Mansion is a famous residence."
          }
        ]
      },
      {
        "id": "e13",
        "title": "Wang Family Manor (王家大院)",
        "description": "One of the largest residential complexes.",
        "content": [
          {
            "words": [
              { "chinese": "王家大院", "pinyin": "Wángjiā Dàyuàn", "english": "Wang Family Manor" },
              { "chinese": "规模", "pinyin": "guīmó", "english": "scale" },
              { "chinese": "很大", "pinyin": "hěndà", "english": "very large" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Wang Family Manor is very large."
          }
        ]
      },
      {
        "id": "e14",
        "title": "Qiao Family Courtyard (乔家大院)",
        "description": "A famous historical residence in Shanxi.",
        "content": [
          {
            "words": [
              { "chinese": "乔家大院", "pinyin": "Qiáojiā Dàyuàn", "english": "Qiao Family Courtyard" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "北方", "pinyin": "běifāng", "english": "northern" },
              { "chinese": "民居", "pinyin": "mínjū", "english": "residence" },
              { "chinese": "杰作", "pinyin": "jiézuò", "english": "masterpiece" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Qiao Family Courtyard is a masterpiece of northern residences."
          }
        ]
      },
      {
        "id": "e15",
        "title": "Daming Palace (大明宫)",
        "description": "The imperial palace complex of the Tang dynasty.",
        "content": [
          {
            "words": [
              { "chinese": "大明宫", "pinyin": "Dàmínggōng", "english": "Daming Palace" },
              { "chinese": "是", "pinyin": "shì", "english": "is" },
              { "chinese": "唐朝", "pinyin": "Tángcháo", "english": "Tang dynasty" },
              { "chinese": "的", "pinyin": "de", "english": "possessive" },
              { "chinese": "中心", "pinyin": "zhōngxīn", "english": "center" },
              { "chinese": "。", "pinyin": ".", "english": "." }
            ],
            "englishTranslation": "Daming Palace was the center of the Tang dynasty."
          }
        ]
      }
    ]
  }
];
