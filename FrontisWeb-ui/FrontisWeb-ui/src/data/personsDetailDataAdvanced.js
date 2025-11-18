/**
 * 人物详情高级版数据配置
 * 包含时间轴、多媒体、关系网络等完整数据
 */

// 导入所有人物图片
import liubaojunImg from '@/assets/persons/liubaojun.png'
import zhangzhuoyuanImg from '@/assets/persons/zhangzhuoyuan.png'
import huangrunqiuImg from '@/assets/persons/huangrunqiu.png'
import wangchengshanImg from '@/assets/persons/wangchengshan.png'
import duojiImg from '@/assets/persons/duoji.png'
import zengyunfuImg from '@/assets/persons/zengyunfu.png'
import wuzongyueImg from '@/assets/persons/wuzongyue.png'
import lichengsanImg from '@/assets/persons/lichengsan.png'
import chenyutaiImg from '@/assets/persons/chenyuntai.png'
import xuqiangImg from '@/assets/persons/xuqiang.png'
import liuqingyouImg from '@/assets/persons/liuqingyou.png'
import peixiangjunImg from '@/assets/persons/peixiangjun.png'
import luozhetanImg from '@/assets/persons/luozhetan.png'
import jinjingfuImg from '@/assets/persons/jinjingfu.png'
import liuzuyiImg from '@/assets/persons/liuzuyi.png'
import zhouxiaoheImg from '@/assets/persons/zhouxiaohe.png'
import lizhichangImg from '@/assets/persons/lizhichang.png'
import wuyanshengImg from '@/assets/persons/wuyansheng.png'
import changlongqingImg from '@/assets/persons/changlongqing.png'
import zhangyansengImg from '@/assets/persons/zhangyanseng.png'
import litangmiImg from '@/assets/persons/litangmi.png'
import fanxuanmeiImg from '@/assets/persons/fanxuanmei.png'
import huiweiImg from '@/assets/persons/huiwei.png'
import lichaoImg from '@/assets/persons/lichao.png'
import litianbinImg from '@/assets/persons/litianbin.png'
import liushugenImg from '@/assets/persons/liushugen.png'
import liyongImg from '@/assets/persons/liyong.png'
import lizhongquanImg from '@/assets/persons/lizhongquan.png'
import pengqiangImg from '@/assets/persons/pengqiang.png'
import sutaoImg from '@/assets/persons/sutao.png'
import tangchuanImg from '@/assets/persons/tangchuan.png'
import tuoxianguoImg from '@/assets/persons/tuoxianguo.png'
import zhaoyuyanImg from '@/assets/persons/zhaoyuyan.png'

export const personsDetailDataAdvanced = {
  // 刘宝珺院士 - 完整版
  liubaojun: {
    id: 'liubaojun',
    name: '刘宝珺',
    subtitle: '中国科学院院士 · 沉积地质学奠基人 · 成都理工大学五大学科奠基人之一',
    image: liubaojunImg,
    keyTags: ['中国科学院院士', '沉积地质学奠基人', '五大学科奠基人', '李四光奖获得者'],
    
    // 时间轴数据
    timeline: [
      {
        year: '1931',
        title: '出生于天津',
        description: '1931年出生于天津市一个知识分子家庭',
        importance: 'medium',
        media: null
      },
      {
        year: '1952',
        title: '就读清华大学',
        description: '考入清华大学地质系，开始接触地质学',
        importance: 'medium',
        media: {
          type: 'image',
          url: liubaojunImg
        }
      },
      {
        year: '1956',
        title: '毕业分配',
        description: '从清华大学毕业，分配至成都地质学院工作',
        importance: 'high',
        achievements: [
          '开始从事沉积地质学研究',
          '建立沉积学研究室'
        ]
      },
      {
        year: '1980',
        title: '当选中国科学院院士',
        description: '因在沉积地质学领域的突出贡献当选为中国科学院院士',
        importance: 'high',
        media: null
      },
      {
        year: '1989',
        title: '获李四光地质科学奖',
        description: '荣获中国地质学界最高荣誉"李四光地质科学奖"',
        importance: 'high'
      },
      {
        year: '1996',
        title: '获国际斯潘迪亚罗夫奖',
        description: '在第30届国际地质大会上获得"斯潘迪亚罗夫"奖',
        importance: 'high'
      },
      {
        year: '2000-至今',
        title: '担任成都理工大学名誉校长',
        description: '继续为学校发展和人才培养贡献力量',
        importance: 'high'
      }
    ],
    
    // 生平详情（分屏展示）
    biography: [
      {
        title: '早年经历',
        content: `
          <p>刘宝珺院士1931年出生于天津市一个知识分子家庭。从小受到良好的家庭教育，对自然科学产生了浓厚兴趣。</p>
          <p>1952年，刘宝珺考入清华大学地质系，在这里他遇到了多位著名地质学家，奠定了坚实的专业基础。大学期间，他表现出色，特别是在野外实习中展现出卓越的观察力和分析能力。</p>
          <p>1956年大学毕业后，刘宝珺被分配到成都地质学院（现成都理工大学）工作，从此开启了他辉煌的学术生涯。</p>
        `,
        tags: ['求学之路', '学术启蒙', '艰苦奋斗'],
        mediaType: 'image',
        mediaUrl: liubaojunImg
      },
      {
        title: '学术生涯',
        content: `
          <p>在成都地质学院工作期间，刘宝珺院士专注于沉积地质学研究，取得了一系列突破性成果。</p>
          <p>他提出了"沉积期后分异作用与成矿作用"的新理论，为沉积矿床成因研究开辟了新途径。建立了扬子地台陆缘寒武纪磷矿风暴岩沉积模式，对找矿勘探具有重要指导意义。</p>
          <p>刘宝珺院士主持编制的中比例尺岩相古地理图，填补了我国区域地质研究的空白。他发表论文100多篇，出版专著近20部，代表作《岩相古地理基础及方法》成为沉积学领域的经典教材。</p>
        `,
        tags: ['科研创新', '学术突破', '理论建树'],
        mediaType: 'video',
        mediaUrl: '/videos/liubaojun-lecture.mp4'
      },
      {
        title: '教育贡献',
        content: `
          <p>作为成都理工大学名誉校长，刘宝珺院士始终关心学校发展和人才培养。</p>
          <p>他培养了大批沉积地质学专业人才，其中多人已成为学科带头人。他推动建立了完整的沉积地质学教学体系，为学科建设做出了重要贡献。</p>
          <p>刘宝珺院士还积极推动产学研结合，建立国际化的学术交流平台，使成都理工大学的沉积地质学科在国际上享有盛誉。</p>
        `,
        tags: ['教书育人', '学科建设', '国际交流'],
        mediaType: 'image',
        mediaUrl: liubaojunImg
      }
    ],
    
    // 代表成就
    achievements: [
      {
        type: '论文',
        title: '中国南方寒武系沉积相与古地理',
        year: '1985',
        summary: '系统研究了中国南方寒武纪沉积相与古地理演化，为矿产勘查提供了理论依据',
        description: '该论文首次系统地揭示了中国南方寒武纪沉积演化规律，建立了完整的沉积相模式。',
        tags: ['SCI', '高被引'],
        highlights: [
          '建立了完整的寒武系沉积相模式',
          '揭示了古地理演化规律',
          '为磷矿找矿提供了理论依据'
        ],
        resources: [
          { type: 'pdf', name: '论文全文.pdf', url: '/downloads/paper1.pdf' },
          { type: 'link', name: '在线阅读', url: 'https://example.com' }
        ]
      },
      {
        type: '专著',
        title: '岩相古地理基础及方法',
        year: '1980',
        summary: '沉积学领域的经典教材，系统阐述了岩相古地理研究的基础理论和方法',
        description: '本书系统地介绍了岩相古地理学的基本概念、研究方法和应用实例，成为该领域的必读书目。',
        tags: ['经典教材', '多次再版'],
        highlights: [
          '建立了岩相古地理研究的理论体系',
          '提供了系统的研究方法',
          '培养了大批专业人才'
        ],
        resources: [
          { type: 'pdf', name: '电子版下载', url: '/downloads/book1.pdf' }
        ]
      },
      {
        type: '项目',
        title: '中国沉积矿产成矿规律研究',
        year: '1990',
        summary: '国家自然科学基金重点项目，揭示了中国主要沉积矿产的成矿规律',
        tags: ['国家重点', '获奖项目'],
        highlights: [
          '揭示了磷矿、铝土矿等主要沉积矿产的成矿规律',
          '建立了沉积成矿理论体系',
          '指导了矿产勘查实践'
        ]
      },
      {
        type: '奖项',
        title: '李四光地质科学奖',
        year: '1989',
        summary: '中国地质学界最高荣誉，表彰其在沉积地质学领域的杰出贡献',
        tags: ['最高荣誉', '终身成就'],
        highlights: [
          '中国地质学界最高荣誉',
          '表彰终身学术贡献',
          '全国仅少数科学家获得'
        ]
      }
    ],
    
    // 多媒体资源
    videos: [
      {
        id: 'v1',
        title: '刘宝珺院士学术讲座：沉积学的过去、现在和未来',
        description: '刘宝珺院士在成都理工大学的精彩讲座，讲述沉积学发展历程',
        thumbnail: liubaojunImg,
        url: '/videos/lecture1.mp4',
        duration: '1:32:45'
      },
      {
        id: 'v2',
        title: '纪录片：地质人生',
        description: '记录刘宝珺院士60年科研生涯的纪录片',
        thumbnail: liubaojunImg,
        url: '/videos/documentary1.mp4',
        duration: '45:20'
      }
    ],
    
    audios: [
      {
        id: 'a1',
        title: '口述历史：我的地质人生',
        description: '刘宝珺院士亲述学术生涯中的难忘经历',
        duration: '28:15'
      },
      {
        id: 'a2',
        title: '学术思想访谈',
        description: '深入探讨刘宝珺院士的学术思想和研究方法',
        duration: '42:30'
      }
    ],
    
    vrScenes: [
      {
        id: 'vr1',
        title: '沉积学实验室360°全景',
        description: '虚拟参观刘宝珺院士工作过的沉积学实验室',
        preview: liubaojunImg,
        url: '/vr/lab1.html'
      }
    ],
    
    // 人物关系
    relationships: [
      {
        id: 'r1',
        name: '张倬元',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r2',
        name: '曾允孚',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r3',
        name: '罗蛰潭',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r4',
        name: '金景福',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r5',
        name: '王成善',
        type: 'student',
        relation: '学生',
        description: '师从刘宝珺院士攻读硕士学位'
      },
      {
        id: 'r6',
        name: '多吉',
        type: 'student',
        relation: '学生',
        description: '成都地质学院校友'
      },
      {
        id: 'r7',
        name: '李承三',
        type: 'colleague',
        relation: '同事',
        description: '成都地质学院同事'
      },
      {
        id: 'r6',
        name: '黄润秋',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      }
    ],
    
    // 趣闻轶事
    anecdotes: [
      {
        title: '野外考察趣事',
        icon: 'fas fa-mountain',
        content: '在一次野外考察中，刘宝珺院士发现了一块特殊的岩石样品。为了确认其成因，他连续三天在野外进行观察记录，最终提出了新的沉积模式，这一发现后来成为重要研究成果。',
        tags: ['科研精神', '执着追求']
      },
      {
        title: '学生时代的故事',
        icon: 'fas fa-graduation-cap',
        content: '在清华大学求学期间，刘宝珺被同学们称为"石头迷"。他经常利用周末时间到郊外寻找岩石标本，宿舍里收藏了上百块各类岩石样品。',
        tags: ['求学经历', '兴趣爱好']
      },
      {
        title: '国际学术交流',
        icon: 'fas fa-globe',
        content: '1996年在北京召开的第30届国际地质大会上，刘宝珺院士用流利的英语作了学术报告，获得国际同行的高度评价，并荣获"斯潘迪亚罗夫"奖。',
        tags: ['国际交流', '学术荣誉']
      },
      {
        title: '提携后学',
        icon: 'fas fa-hands-helping',
        content: '刘宝珺院士对年轻学者特别关心，经常主动邀请他们参加科研项目。他常说："科学研究需要传承，培养年轻人就是为学科发展播种希望。"',
        tags: ['教书育人', '薪火相传']
      }
    ]
  },
  
  // 张倬元教授 - 完整版
  zhangzhuoyuan: {
    id: 'zhangzhuoyuan',
    name: '张倬元',
    subtitle: '中国著名工程地质学家 · 工程地质学奠基人 · 成都理工大学五大学科奠基人之一',
    image: zhangzhuoyuanImg,
    keyTags: ['工程地质学奠基人', '五大学科奠基人', '地质灾害', '李四光奖'],
    
    timeline: [
      {
        year: '1926',
        title: '出生于河北乐亭',
        description: '出生于河北省乐亭县一个农民家庭',
        importance: 'medium'
      },
      {
        year: '1948',
        title: '就读清华大学',
        description: '考入清华大学地质系学习',
        importance: 'medium'
      },
      {
        year: '1952',
        title: '来到成都地质学院',
        description: '分配至成都地质学院工作，开始工程地质学研究',
        importance: 'high'
      },
      {
        year: '1983-1988',
        title: '担任成都地质学院院长',
        description: '领导学校发展，为学校争取到两个首批国家重点学科',
        importance: 'high'
      },
      {
        year: '1990',
        title: '创建地质灾害实验室',
        description: '推动建立"地质灾害防治与地质环境保护国家重点实验室"',
        importance: 'high'
      },
      {
        year: '2022',
        title: '逝世',
        description: '享年96岁，为中国工程地质学发展奉献了一生',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '求学之路',
        content: `
          <p>张倬元教授1926年出生于河北省乐亭县一个普通农民家庭。幼年时期正值国家动荡，但他勤奋好学，成绩优异。</p>
          <p>1948年，张倬元以优异成绩考入清华大学地质系。在清华学习期间，他刻苦钻研，打下了扎实的专业基础。</p>
        `,
        tags: ['求学经历', '清华岁月'],
        mediaType: 'image',
        mediaUrl: zhangzhuoyuanImg
      },
      {
        title: '学术成就',
        content: `
          <p>张倬元教授是中国工程地质学科的开拓者之一。他提出的"地质过程机制分析与定量评价"学术思想体系，成为工程地质研究的重要理论基础。</p>
          <p>他组织编写的《工程地质分析原理》，被誉为中国工程地质界的"宝典"，影响了几代工程地质工作者。</p>
          <p>张倬元教授首次提出"地质灾害"术语及英文名"Geohazard"，获得国际认证，推动了地质灾害学科的发展。</p>
        `,
        tags: ['学术贡献', '理论创新'],
        mediaType: 'video',
        mediaUrl: '/videos/zhang-research.mp4'
      },
      {
        title: '教育事业',
        content: `
          <p>作为成都地质学院（成都理工大学）院长，张倬元教授为学校发展倾注了大量心血。</p>
          <p>他培养了30余名博士后、博硕士，其中包括现任生态环境部部长黄润秋等杰出人才。</p>
          <p>退休后，张倬元教授仍然关心学校发展，捐资设立"张倬元工程地质专业奖学金"，激励后学。</p>
        `,
        tags: ['教书育人', '桃李满天下'],
        mediaType: 'image',
        mediaUrl: zhangzhuoyuanImg
      }
    ],
    
    achievements: [
      {
        type: '专著',
        title: '工程地质分析原理',
        year: '1981',
        summary: '中国工程地质界的"宝典"，系统阐述了工程地质分析的基本原理',
        tags: ['经典教材', '影响深远'],
        highlights: [
          '建立了工程地质分析的理论体系',
          '提供了系统的分析方法',
          '培养了大批工程地质专业人才'
        ]
      },
      {
        type: '项目',
        title: '长江三峡工程地质论证',
        year: '1986',
        summary: '参与长江三峡工程地质论证工作，为工程建设提供了重要依据',
        tags: ['国家重大工程', '战略意义'],
        highlights: [
          '参与论证三峡工程的地质条件',
          '评估工程风险',
          '为决策提供科学依据'
        ]
      },
      {
        type: '奖项',
        title: '李四光地质科学奖',
        year: '1995',
        summary: '获得中国地质领域最高荣誉',
        tags: ['最高荣誉', '终身成就']
      }
    ],
    
    videos: [
      {
        id: 'v1',
        title: '张倬元教授学术报告：工程地质与地质灾害',
        description: '张倬元教授关于工程地质和地质灾害的精彩报告',
        thumbnail: zhangzhuoyuanImg,
        url: '/videos/zhang-lecture.mp4',
        duration: '1:15:30'
      }
    ],
    
    audios: [
      {
        id: 'a1',
        title: '口述历史：我与工程地质',
        description: '张倬元教授讲述工程地质学科发展历程',
        duration: '35:20'
      }
    ],
    
    vrScenes: [
      {
        id: 'vr1',
        title: '地质灾害实验室360°全景',
        description: '虚拟参观地质灾害防治实验室',
        preview: zhangzhuoyuanImg,
        url: '/vr/lab2.html'
      }
    ],
    
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r2',
        name: '曾允孚',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r3',
        name: '罗蛰潭',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r4',
        name: '金景福',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r5',
        name: '黄润秋',
        type: 'student',
        relation: '学生',
        description: '现任生态环境部部长'
      },
      {
        id: 'r6',
        name: '许强',
        type: 'student',
        relation: '学生',
        description: '现任成都理工大学校长'
      },
      {
        id: 'r7',
        name: '李承三',
        type: 'colleague',
        relation: '同事',
        description: '成都地质学院同事'
      }
    ],
    
    anecdotes: [
      {
        title: '野外调查的执着',
        icon: 'fas fa-hiking',
        content: '即使在70岁高龄，张倬元教授仍坚持到野外进行地质调查。有一次在四川山区考察滑坡，他爬了3个小时的山路，只为亲眼观察滑坡现场。',
        tags: ['科研精神', '实地调查']
      },
      {
        title: '创造"地质灾害"术语',
        icon: 'fas fa-language',
        content: '在国际学术交流中，张倬元教授提出了"Geohazard"这一英文术语，填补了国际上该领域术语的空白，获得了国际认证。',
        tags: ['学术创新', '国际影响']
      },
      {
        title: '设立奖学金',
        icon: 'fas fa-award',
        content: '退休后，张倬元教授将自己的积蓄捐出，设立了"张倬元工程地质专业奖学金"，用于资助优秀学生和奖励科研成果。',
        tags: ['无私奉献', '关爱学生']
      }
    ]
  },

  // 黄润秋院士 - 完整版
  huangrunqiu: {
    id: 'huangrunqiu',
    name: '黄润秋',
    subtitle: '中国工程院院士 · 生态环境部部长 · 地质灾害防治专家',
    image: huangrunqiuImg,
    keyTags: ['中国工程院院士', '生态环境部部长', '地质灾害防治', '国家杰青', '百千万人才工程国家级人选'],
    
    timeline: [
      {
        year: '1963',
        title: '出生',
        description: '出生于四川省成都市',
        importance: 'medium'
      },
      {
        year: '1978',
        title: '考入成都地质学院',
        description: '考入成都地质学院（现成都理工大学）工程地质专业',
        importance: 'high'
      },
      {
        year: '1988',
        title: '攻读博士学位',
        description: '师从张倬元教授，攻读工程地质学博士学位',
        importance: 'high'
      },
      {
        year: '1994',
        title: '破格晋升教授',
        description: '因突出的科研成就，破格晋升为教授，年仅31岁',
        importance: 'high'
      },
      {
        year: '2009',
        title: '当选中国工程院院士',
        description: '因在地质灾害防治领域的突出贡献当选为中国工程院院士',
        importance: 'high'
      },
      {
        year: '2020',
        title: '任生态环境部部长',
        description: '担任中华人民共和国生态环境部部长',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '求学之路',
        content: `
          <p>黄润秋院士1963年出生于四川省成都市。1978年，年仅15岁的他以优异成绩考入成都地质学院（现成都理工大学）工程地质专业。</p>
          <p>在成都地质学院求学期间，黄润秋表现优异，深得张倬元教授的赏识。1988年，他师从张倬元教授攻读工程地质学博士学位，成为张倬元教授的得意门生。</p>
        `,
        tags: ['求学经历', '师承名家'],
        mediaType: 'image',
        mediaUrl: huangrunqiuImg
      },
      {
        title: '学术成就',
        content: `
          <p>黄润秋院士是我国地质灾害防治领域的杰出科学家。他在工程地质学、环境地质学等方面取得了一系列重要成果。</p>
          <p>他系统研究了大型工程地质体的稳定性评价与控制理论，建立了地质灾害风险评估体系，为国家重大工程建设提供了科学依据。</p>
          <p>黄润秋院士发表学术论文200余篇，主持完成多项国家重大科研项目，获得国家科技进步奖等多项荣誉。</p>
        `,
        tags: ['科研创新', '理论建树'],
        mediaType: 'video',
        mediaUrl: '/videos/huang-research.mp4'
      },
      {
        title: '服务国家',
        content: `
          <p>2020年，黄润秋院士担任中华人民共和国生态环境部部长，从科学研究转向行政管理，为国家生态文明建设贡献力量。</p>
          <p>作为生态环境部部长，他积极推进污染防治攻坚战，推动绿色低碳发展，为美丽中国建设做出了重要贡献。</p>
        `,
        tags: ['服务国家', '生态文明'],
        mediaType: 'image',
        mediaUrl: huangrunqiuImg
      }
    ],
    
    achievements: [
      {
        type: '项目',
        title: '地质灾害风险评估体系',
        year: '2005',
        summary: '建立了完整的地质灾害风险评估理论体系和方法',
        tags: ['理论创新', '实践应用'],
        highlights: [
          '建立了风险评估理论体系',
          '提出了实用的评估方法',
          '指导了多个重大工程'
        ]
      },
      {
        type: '奖项',
        title: '国家科技进步奖',
        year: '2008',
        summary: '获得国家科技进步二等奖，表彰其在地质灾害防治领域的贡献',
        tags: ['国家奖项', '重大成果']
      },
      {
        type: '奖项',
        title: '当选中国工程院院士',
        year: '2009',
        summary: '因在地质灾害防治领域的突出贡献当选为中国工程院院士',
        tags: ['最高荣誉', '学术成就']
      }
    ],
    
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '张倬元',
        type: 'mentor',
        relation: '导师',
        description: '师从张倬元教授攻读博士学位'
      },
      {
        id: 'r2',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r3',
        name: '王成善',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r4',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      }
    ],
    
    anecdotes: [
      {
        title: '15岁上大学',
        icon: 'fas fa-graduation-cap',
        content: '黄润秋院士15岁就考入了成都地质学院，是当时年级最小的学生之一。他刻苦学习，成绩优异，深受老师们的喜爱。',
        tags: ['少年英才', '勤奋学习']
      },
      {
        title: '最年轻教授',
        icon: 'fas fa-trophy',
        content: '1994年，年仅31岁的黄润秋破格晋升为教授，成为当时全国最年轻的正教授之一，展现了卓越的学术能力。',
        tags: ['学术成就', '年轻有为']
      }
    ]
  },

  // 王成善院士 - 完整版
  wangchengshan: {
    id: 'wangchengshan',
    name: '王成善',
    subtitle: '中国科学院院士 · 沉积地质学家 · 石油地质学专家',
    image: wangchengshanImg,
    keyTags: ['中国科学院院士', '沉积地质学', '石油地质学', '国家杰青', '百千万人才工程国家级人选'],
    
    timeline: [
      {
        year: '1951',
        title: '出生',
        description: '出生于辽宁省',
        importance: 'medium'
      },
      {
        year: '1977',
        title: '考入成都地质学院',
        description: '考入成都地质学院（现成都理工大学）地质学专业',
        importance: 'high'
      },
      {
        year: '1981',
        title: '获得硕士学位',
        description: '师从刘宝珺院士，获得沉积地质学硕士学位',
        importance: 'high'
      },
      {
        year: '1991',
        title: '获得博士学位',
        description: '获得中国地质大学（北京）博士学位',
        importance: 'high'
      },
      {
        year: '2013',
        title: '当选中国科学院院士',
        description: '因在沉积地质学和石油地质学领域的突出贡献当选为中国科学院院士',
        importance: 'high'
      },
      {
        year: '2017',
        title: '担任国际古地理学会主席',
        description: '当选为国际古地理学会主席，提升中国在该领域的国际影响力',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '求学经历',
        content: `
          <p>王成善院士1951年出生于辽宁省。1977年考入成都地质学院（现成都理工大学）地质学专业。</p>
          <p>1981年，他师从刘宝珺院士，获得沉积地质学硕士学位。之后继续深造，1991年获得中国地质大学（北京）博士学位。</p>
          <p>在成都地质学院的求学经历，为他后来的科研工作奠定了坚实的基础。</p>
        `,
        tags: ['求学之路', '师承名家'],
        mediaType: 'image',
        mediaUrl: wangchengshanImg
      },
      {
        title: '学术贡献',
        content: `
          <p>王成善院士在沉积地质学和石油地质学领域取得了突出成就。他系统研究了白垩纪古气候、古海洋学等问题。</p>
          <p>他提出的白垩纪大洋缺氧事件理论，为全球气候变化研究提供了重要依据。在石油地质学方面，他揭示了大型油气田的成藏规律。</p>
          <p>王成善院士发表SCI论文200余篇，主持完成多项国家重大科研项目，获得了国际同行的广泛认可。</p>
        `,
        tags: ['科研创新', '国际影响'],
        mediaType: 'video',
        mediaUrl: '/videos/wang-research.mp4'
      },
      {
        title: '国际影响',
        content: `
          <p>2017年，王成善院士当选为国际古地理学会主席，这是中国科学家首次担任该组织的主席职务。</p>
          <p>他积极推动国际学术交流，提升了中国在古地理学领域的国际地位和影响力。</p>
        `,
        tags: ['国际交流', '学术地位'],
        mediaType: 'image',
        mediaUrl: wangchengshanImg
      }
    ],
    
    achievements: [
      {
        type: '论文',
        title: '白垩纪大洋缺氧事件研究',
        year: '1995',
        summary: '系统研究了白垩纪大洋缺氧事件，为全球气候变化研究提供重要依据',
        tags: ['SCI', '高被引'],
        highlights: [
          '揭示了白垩纪气候变化的机制',
          '为全球气候变化研究提供依据',
          '获得国际同行认可'
        ]
      },
      {
        type: '项目',
        title: '大型油气田成藏规律研究',
        year: '2005',
        summary: '揭示了大型油气田的成藏规律，指导了油气勘探实践',
        tags: ['国家重大', '实践应用']
      },
      {
        type: '奖项',
        title: '当选中国科学院院士',
        year: '2013',
        summary: '因在沉积地质学和石油地质学领域的突出贡献当选为中国科学院院士',
        tags: ['最高荣誉', '学术成就']
      }
    ],
    
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'mentor',
        relation: '导师',
        description: '师从刘宝珺院士攻读硕士学位'
      },
      {
        id: 'r2',
        name: '曾允孚',
        type: 'mentor',
        relation: '老师',
        description: '师从曾允孚教授学习沉积地质学'
      },
      {
        id: 'r3',
        name: '黄润秋',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r4',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      }
    ],
    
    anecdotes: [
      {
        title: '国际学术交流',
        icon: 'fas fa-globe',
        content: '王成善院士长期致力于国际学术交流，曾在多个国际学术会议上作主题报告，提升了中国地质学的国际影响力。',
        tags: ['国际交流', '学术影响']
      }
    ]
  },

  // 多吉院士 - 完整版
  duoji: {
    id: 'duoji',
    name: '多吉',
    subtitle: '中国工程院院士 · 地热地质专家 · 西藏地质勘查局局长',
    image: duojiImg,
    keyTags: ['中国工程院院士', '地热地质', '西藏'],
    
    timeline: [
      {
        year: '1953',
        title: '出生',
        description: '出生于西藏自治区',
        importance: 'medium'
      },
      {
        year: '1974',
        title: '就读成都地质学院',
        description: '考入成都地质学院（现成都理工大学）地质学专业',
        importance: 'high'
      },
      {
        year: '1978',
        title: '毕业返回西藏',
        description: '从成都地质学院毕业，返回西藏从事地质工作',
        importance: 'high'
      },
      {
        year: '1990',
        title: '发现羊八井地热田',
        description: '主持发现并评价了西藏羊八井地热田，为西藏能源开发做出重要贡献',
        importance: 'high'
      },
      {
        year: '2001',
        title: '当选中国工程院院士',
        description: '因在地热地质和矿产地质领域的突出贡献当选为中国工程院院士',
        importance: 'high'
      },
      {
        year: '2005',
        title: '担任西藏地质勘查局局长',
        description: '担任西藏自治区地质勘查局局长，继续为西藏地质事业发展贡献力量',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '求学经历',
        content: `
          <p>多吉院士1953年出生于西藏自治区。1974年，他考入成都地质学院（现成都理工大学）地质学专业。</p>
          <p>在成都地质学院求学期间，多吉刻苦学习，掌握了扎实的地质学理论知识。1978年毕业后，他毅然选择返回西藏，投身西藏的地质事业。</p>
        `,
        tags: ['求学之路', '报效家乡'],
        mediaType: 'image',
        mediaUrl: duojiImg
      },
      {
        title: '地热地质成就',
        content: `
          <p>多吉院士是我国地热地质领域的杰出专家。他长期在西藏高原从事地热地质勘查工作，取得了一系列重要成果。</p>
          <p>1990年，他主持发现并评价了西藏羊八井地热田，这是我国大陆上温度最高的地热田，为西藏的能源开发做出了重要贡献。</p>
          <p>多吉院士还系统研究了青藏高原的地热资源分布规律，为我国地热资源的开发利用提供了科学依据。</p>
        `,
        tags: ['科研创新', '服务地方'],
        mediaType: 'video',
        mediaUrl: '/videos/duoji-research.mp4'
      },
      {
        title: '服务西藏',
        content: `
          <p>多吉院士长期在西藏工作，为西藏的地质事业发展做出了重要贡献。</p>
          <p>2005年，他担任西藏自治区地质勘查局局长，继续推动西藏地质勘查事业的发展，为西藏的经济社会发展提供资源保障。</p>
        `,
        tags: ['服务地方', '资源保障'],
        mediaType: 'image',
        mediaUrl: duojiImg
      }
    ],
    
    achievements: [
      {
        type: '项目',
        title: '西藏羊八井地热田发现与评价',
        year: '1990',
        summary: '主持发现并评价了我国大陆上温度最高的地热田',
        tags: ['重大发现', '能源开发'],
        highlights: [
          '发现羊八井地热田',
          '为我国温度最高的地热田',
          '为西藏能源开发做出贡献'
        ]
      },
      {
        type: '项目',
        title: '青藏高原地热资源研究',
        year: '1995',
        summary: '系统研究了青藏高原的地热资源分布规律',
        tags: ['区域研究', '资源评价']
      },
      {
        type: '奖项',
        title: '当选中国工程院院士',
        year: '2001',
        summary: '因在地热地质和矿产地质领域的突出贡献当选为中国工程院院士',
        tags: ['最高荣誉', '学术成就']
      }
    ],
    
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'teacher',
        relation: '老师',
        description: '成都理工大学老师'
      },
      {
        id: 'r2',
        name: '王成善',
        type: 'colleague',
        relation: '校友',
        description: '成都地质学院校友'
      },
      {
        id: 'r3',
        name: '张倬元',
        type: 'teacher',
        relation: '老师',
        description: '成都理工大学老师'
      }
    ],
    
    anecdotes: [
      {
        title: '扎根西藏',
        icon: 'fas fa-mountain',
        content: '多吉院士从成都地质学院毕业后，毅然选择返回西藏，在艰苦的环境下开展地质工作，为西藏的地质事业发展奉献了一生。',
        tags: ['奉献精神', '扎根基层']
      },
      {
        title: '发现地热田',
        icon: 'fas fa-fire',
        content: '1990年，多吉院士主持发现了西藏羊八井地热田，这是我国大陆上温度最高的地热田，为西藏的能源开发做出了重要贡献。',
        tags: ['重大发现', '能源开发']
      }
    ]
  },

  // 曾允孚教授 - 完整版
  zengyunfu: {
    id: 'zengyunfu',
    name: '曾允孚',
    subtitle: '沉积地质学奠基人 · 成都理工大学五大学科奠基人之一',
    image: zengyunfuImg,
    keyTags: ['沉积地质学奠基人', '五大学科奠基人', '教育家', '学科建设'],
    
    timeline: [
      {
        year: '1925',
        title: '出生',
        description: '出生于湖南省',
        importance: 'medium'
      },
      {
        year: '1950',
        title: '毕业于北京大学',
        description: '毕业于北京大学地质系',
        importance: 'high'
      },
      {
        year: '1956',
        title: '来到成都地质学院',
        description: '来到成都地质学院（现成都理工大学）工作，从事沉积地质学教学和科研',
        importance: 'high'
      },
      {
        year: '1980',
        title: '创建沉积地质研究所',
        description: '创建成都地质学院沉积地质研究所，担任首任所长',
        importance: 'high'
      },
      {
        year: '2000',
        title: '获得全国优秀教师称号',
        description: '因在教学方面的突出贡献，获得全国优秀教师称号',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '求学与教学',
        content: `
          <p>曾允孚教授1925年出生于湖南省。1950年毕业于北京大学地质系。</p>
          <p>1956年，曾允孚教授来到成都地质学院（现成都理工大学）工作，开始从事沉积地质学的教学和科研工作。他是成都理工大学沉积地质学科的奠基人之一。</p>
          <p>在长期的教学生涯中，曾允孚教授培养了大批沉积地质学专业人才，为我国沉积地质学的发展做出了重要贡献。</p>
        `,
        tags: ['求学经历', '教学贡献'],
        mediaType: 'image',
        mediaUrl: zengyunfuImg
      },
      {
        title: '学科建设',
        content: `
          <p>1980年，曾允孚教授创建了成都地质学院沉积地质研究所，担任首任所长。在他的带领下，该研究所迅速发展成为国内一流的沉积地质学研究机构。</p>
          <p>曾允孚教授主编了《沉积岩石学》等教材，这些教材成为沉积地质学专业的重要参考书，影响了几代学生。</p>
          <p>他积极参与学科建设，为成都理工大学沉积地质学科的发展奠定了坚实基础。</p>
        `,
        tags: ['学科建设', '理论贡献'],
        mediaType: 'video',
        mediaUrl: '/videos/zeng-teaching.mp4'
      }
    ],
    
    achievements: [
      {
        type: '专著',
        title: '沉积岩石学',
        year: '1978',
        summary: '主编的《沉积岩石学》成为沉积地质学专业的重要教材',
        tags: ['经典教材', '影响深远']
      },
      {
        type: '奖项',
        title: '全国优秀教师',
        year: '2000',
        summary: '因在教学方面的突出贡献，获得全国优秀教师称号',
        tags: ['教学荣誉', '师德典范']
      }
    ],
    
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r2',
        name: '张倬元',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r3',
        name: '罗蛰潭',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r4',
        name: '金景福',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r5',
        name: '王成善',
        type: 'student',
        relation: '学生',
        description: '师从曾允孚教授学习沉积地质学'
      },
      {
        id: 'r6',
        name: '李承三',
        type: 'colleague',
        relation: '同事',
        description: '成都地质学院同事'
      }
    ],
    
    anecdotes: [
      {
        title: '创建研究所',
        icon: 'fas fa-building',
        content: '1980年，曾允孚教授创建了成都地质学院沉积地质研究所，在他的带领下，该研究所迅速发展成为国内一流的研究机构。',
        tags: ['学科建设', '创新发展']
      },
      {
        title: '教材编写',
        icon: 'fas fa-book',
        content: '曾允孚教授主编的《沉积岩石学》等教材，成为沉积地质学专业的重要参考书，影响了几代学生，为我国沉积地质学教育做出了重要贡献。',
        tags: ['教育贡献', '教材建设']
      }
    ]
  },

  // 罗蛰潭教授 - 五大学科奠基人之一
  luozhetan: {
    id: 'luozhetan',
    name: '罗蛰潭',
    subtitle: '成都理工大学教授 · 五大学科奠基人之一',
    image: luozhetanImg,
    keyTags: ['五大学科奠基人', '成都地质学院', '学科奠基人'],
    
    timeline: [
      {
        year: '1956',
        title: '参与建校',
        description: '1956年参与成都地质学院（现成都理工大学）建校工作，是建校初期五大学科奠基人之一',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '建校贡献',
        content: `
          <p>罗蛰潭教授是成都理工大学（原成都地质学院）建校初期的五大学科奠基人之一。</p>
          <p>1956年，成都地质勘探学院成立，由重庆大学、西北大学、南京大学等多所高校的地质相关科系组建而成。罗蛰潭教授作为建校初期的学科奠基人，为学校的学科建设和人才培养做出了重要贡献。</p>
          <p>作为五大学科奠基人之一，罗蛰潭教授在学科建设、教学科研等方面发挥了重要作用，为成都理工大学的发展奠定了坚实基础。</p>
        `,
        tags: ['建校贡献', '学科建设', '人才培养'],
        mediaType: 'image',
        mediaUrl: luozhetanImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r2',
        name: '张倬元',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r3',
        name: '金景福',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r4',
        name: '曾允孚',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      }
    ],
    
    anecdotes: []
  },

  // 金景福教授 - 五大学科奠基人之一
  jinjingfu: {
    id: 'jinjingfu',
    name: '金景福',
    subtitle: '成都理工大学教授 · 五大学科奠基人之一',
    image: jinjingfuImg,
    keyTags: ['五大学科奠基人', '成都地质学院', '学科奠基人'],
    
    timeline: [
      {
        year: '1956',
        title: '参与建校',
        description: '1956年参与成都地质学院（现成都理工大学）建校工作，是建校初期五大学科奠基人之一',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '建校贡献',
        content: `
          <p>金景福教授是成都理工大学（原成都地质学院）建校初期的五大学科奠基人之一。</p>
          <p>1956年，成都地质勘探学院成立，由重庆大学、西北大学、南京大学等多所高校的地质相关科系组建而成。金景福教授作为建校初期的学科奠基人，为学校的学科建设和人才培养做出了重要贡献。</p>
          <p>作为五大学科奠基人之一，金景福教授在学科建设、教学科研等方面发挥了重要作用，为成都理工大学的发展奠定了坚实基础。</p>
        `,
        tags: ['建校贡献', '学科建设', '人才培养'],
        mediaType: 'image',
        mediaUrl: jinjingfuImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r2',
        name: '张倬元',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r3',
        name: '罗蛰潭',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      },
      {
        id: 'r4',
        name: '曾允孚',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学五大学科奠基人之一'
      }
    ],
    
    anecdotes: []
  },

  // 邬宗岳烈士 - 完整版
  wuzongyue: {
    id: 'wuzongyue',
    name: '邬宗岳',
    subtitle: '中国登山队队员 · 攀登精神象征 · 烈士',
    image: wuzongyueImg,
    keyTags: ['中国登山队', '珠穆朗玛峰', '攀登精神'],
    
    timeline: [
      {
        year: '1933',
        title: '出生',
        description: '出生于四川省',
        importance: 'medium'
      },
      {
        year: '1956',
        title: '考入成都地质学院',
        description: '考入成都地质学院（现成都理工大学）地质学专业',
        importance: 'high'
      },
      {
        year: '1960',
        title: '毕业参加工作',
        description: '从成都地质学院毕业，参加地质工作',
        importance: 'medium'
      },
      {
        year: '1975',
        title: '参加中国登山队',
        description: '作为中国登山队队员，参加攀登珠穆朗玛峰',
        importance: 'high'
      },
      {
        year: '1975',
        title: '攀登珠峰时牺牲',
        description: '在攀登珠穆朗玛峰过程中，为保护队友而英勇牺牲',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '求学经历',
        content: `
          <p>邬宗岳烈士1933年出生于四川省。1956年，他考入成都地质学院（现成都理工大学）地质学专业。</p>
          <p>在成都地质学院求学期间，邬宗岳表现优异，特别是在野外实习中展现了良好的身体素质和坚韧的意志品质。</p>
          <p>1960年毕业后，他参加地质工作，在艰苦的野外环境中磨练了意志，积累了丰富的野外经验。</p>
        `,
        tags: ['求学经历', '野外锻炼'],
        mediaType: 'image',
        mediaUrl: wuzongyueImg
      },
      {
        title: '攀登精神',
        content: `
          <p>1975年，邬宗岳作为中国登山队队员，参加攀登世界最高峰——珠穆朗玛峰。</p>
          <p>在攀登过程中，邬宗岳表现出了顽强的意志和崇高的品质。他关心队友，在危险时刻总是冲在最前面。</p>
          <p>在一次危险情况下，邬宗岳为了保护队友，英勇牺牲，用生命诠释了攀登精神和不畏艰险的英雄气概。</p>
          <p>邬宗岳烈士的英勇事迹，成为成都理工大学师生学习的榜样，激励着一代代学子发扬攀登精神，勇攀科学高峰。</p>
        `,
        tags: ['英勇事迹', '英雄精神'],
        mediaType: 'video',
        mediaUrl: '/videos/wu-climbing.mp4'
      }
    ],
    
    achievements: [
      {
        type: '荣誉',
        title: '烈士称号',
        year: '1975',
        summary: '因在攀登珠穆朗玛峰过程中保护队友而英勇牺牲，被追授为烈士',
        tags: ['烈士', '英勇牺牲']
      },
      {
        type: '荣誉',
        title: '攀登精神象征',
        year: '1975',
        summary: '成为成都理工大学攀登精神的象征，激励着一代代学子',
        tags: ['精神象征', '激励后人']
      }
    ],
    
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'teacher',
        relation: '老师',
        description: '成都地质学院老师'
      },
      {
        id: 'r2',
        name: '张倬元',
        type: 'teacher',
        relation: '老师',
        description: '成都地质学院老师'
      },
      {
        id: 'r3',
        name: '王成善',
        type: 'colleague',
        relation: '校友',
        description: '成都地质学院校友'
      }
    ],
    
    anecdotes: [
      {
        title: '野外实习',
        icon: 'fas fa-mountain',
        content: '在成都地质学院求学期间，邬宗岳在野外实习中展现了良好的身体素质和坚韧的意志品质，为他后来参加登山队打下了基础。',
        tags: ['求学经历', '意志品质']
      },
      {
        title: '保护队友',
        icon: 'fas fa-heart',
        content: '在攀登珠穆朗玛峰过程中，邬宗岳为了保护队友，在危险时刻总是冲在最前面，最终英勇牺牲，用生命诠释了英雄精神。',
        tags: ['英勇事迹', '英雄精神']
      },
      {
        title: '精神传承',
        icon: 'fas fa-flag',
        content: '邬宗岳烈士的英勇事迹成为成都理工大学攀登精神的象征，激励着一代代学子发扬攀登精神，勇攀科学高峰。',
        tags: ['精神传承', '激励后人']
      }
    ]
  },

  // 陈运泰院士 - 完整版
  chenyuntai: {
    id: 'chenyuntai',
    name: '陈运泰',
    subtitle: '中国科学院院士 · 地球物理学和地震学专家',
    image: chenyutaiImg,
    keyTags: ['中国科学院院士', '地球物理学', '地震学'],
    
    timeline: [
      {
        year: '1940',
        title: '出生',
        description: '出生于广东省',
        importance: 'medium'
      },
      {
        year: '1962',
        title: '毕业于北京大学',
        description: '毕业于北京大学地球物理学专业',
        importance: 'high'
      },
      {
        year: '1966',
        title: '任教于成都地质学院',
        description: '任教于成都地质学院（现成都理工大学），从事地球物理学教学和科研',
        importance: 'high'
      },
      {
        year: '1991',
        title: '当选中国科学院院士',
        description: '因在地球物理学和地震学领域的突出贡献当选为中国科学院院士',
        importance: 'high'
      },
      {
        year: '2000',
        title: '担任中国地震学会理事长',
        description: '担任中国地震学会理事长，推动我国地震学研究发展',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '求学经历',
        content: `
          <p>陈运泰院士1940年出生于广东省。1962年，他毕业于北京大学地球物理学专业。</p>
          <p>1966年，陈运泰院士任教于成都地质学院（现成都理工大学），开始从事地球物理学和地震学的教学和科研工作。</p>
        `,
        tags: ['求学经历', '教学科研'],
        mediaType: 'image',
        mediaUrl: chenyutaiImg
      },
      {
        title: '学术成就',
        content: `
          <p>陈运泰院士是我国地球物理学和地震学领域的杰出科学家。他在地震震源物理、地震波传播理论等方面取得了重要成果。</p>
          <p>他提出的地震震源机制理论，为地震预测和地震工程提供了重要依据。在地震波传播理论研究方面，他取得了国际领先的成果。</p>
          <p>1991年，陈运泰院士因在地球物理学和地震学领域的突出贡献当选为中国科学院院士。</p>
          <p>2000年，他担任中国地震学会理事长，积极推动我国地震学研究的发展，为防震减灾事业做出了重要贡献。</p>
        `,
        tags: ['科研创新', '学术地位'],
        mediaType: 'video',
        mediaUrl: '/videos/chen-research.mp4'
      }
    ],
    
    achievements: [
      {
        type: '论文',
        title: '地震震源机制研究',
        year: '1985',
        summary: '提出了地震震源机制理论，为地震预测提供重要依据',
        tags: ['理论创新', '实践应用'],
        highlights: [
          '建立了地震震源机制理论',
          '为地震预测提供依据',
          '获得国际同行认可'
        ]
      },
      {
        type: '项目',
        title: '地震波传播理论研究',
        year: '1990',
        summary: '在地震波传播理论研究方面取得国际领先成果',
        tags: ['理论创新', '国际领先']
      },
      {
        type: '奖项',
        title: '当选中国科学院院士',
        year: '1991',
        summary: '因在地球物理学和地震学领域的突出贡献当选为中国科学院院士',
        tags: ['最高荣誉', '学术成就']
      }
    ],
    
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '李承三',
        type: 'colleague',
        relation: '同事',
        description: '成都地质学院同事'
      },
      {
        id: 'r2',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '成都地质学院同事'
      },
      {
        id: 'r3',
        name: '张倬元',
        type: 'colleague',
        relation: '同事',
        description: '成都地质学院同事'
      }
    ],
    
    anecdotes: [
      {
        title: '地震研究',
        icon: 'fas fa-shake',
        content: '陈运泰院士在地震学研究方面取得了重要成果，他提出的地震震源机制理论，为地震预测和防震减灾提供了重要依据。',
        tags: ['科研创新', '防震减灾']
      },
      {
        title: '国际影响',
        icon: 'fas fa-globe',
        content: '陈运泰院士在地震波传播理论研究方面取得了国际领先的成果，获得了国际同行的广泛认可，提升了我国在该领域的国际地位。',
        tags: ['国际影响', '学术地位']
      }
    ]
  },

  // 刘清友书记 - 完整版
  liuqingyou: {
    id: 'liuqingyou',
    name: '刘清友',
    subtitle: '成都理工大学党委书记 · 石油钻头专家 · 院士有效候选人',
    image: liuqingyouImg,
    keyTags: ['成都理工大学党委书记', '石油钻头', '院士有效候选人', '国家创新争先奖', '百千万人才工程国家级人选'],
    influenceLevel: 4,
    
    timeline: [
      {
        year: '1963',
        title: '出生',
        description: '1963年6月出生于四川',
        importance: 'medium'
      },
      {
        year: '1982',
        title: '本科毕业',
        description: '获工学学士学位',
        importance: 'high'
      },
      {
        year: '2002',
        title: '硕士毕业',
        description: '获工学硕士学位',
        importance: 'high'
      },
      {
        year: '2014',
        title: '博士毕业',
        description: '获工学博士学位',
        importance: 'high'
      },
      {
        year: '2018',
        title: '担任校长',
        description: '2018年12月任成都理工大学党委副书记、校长',
        importance: 'high'
      },
      {
        year: '2023',
        title: '担任党委书记',
        description: '2023年10月任成都理工大学党委书记',
        importance: 'high'
      },
      {
        year: '2025',
        title: '院士有效候选人',
        description: '2025年8月，入选中国工程院院士增选有效候选人名单',
        importance: 'high',
        achievements: [
          '中国工程院院士增选有效候选人',
          '能源与矿业工程学部'
        ]
      }
    ],
    
    biography: [
      {
        title: '求学经历',
        content: `
          <p>刘清友教授1963年6月出生于四川省。1982年获得工学学士学位，2002年获得工学硕士学位，2014年获得工学博士学位。</p>
          <p>长期从事石油钻头及钻采装备的教学和科研工作，在石油机械、钻头设计与优化等领域取得了重要成就。</p>
        `,
        tags: ['求学经历', '学术基础', '专业扎实'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      },
      {
        title: '学术贡献',
        content: `
          <p>刘清友教授长期从事石油钻头及钻采装备的教学和科研工作，是我国石油钻头及钻采装备领域的知名专家。</p>
          <p>发表论文180余篇（第一作者100余篇），授权发明专利60余件（国际专利9件），出版专著、教材7部。</p>
          <p>获国家科技进步特等奖（集体奖）1项、国家科技进步二等奖2项、省部级科技一等奖8项、省级教学特等奖1项、省级教学一等奖1项。</p>
          <p>2017年、2019年院士增选均进入第二轮评审有效候选人（能源与矿业工程学部）。</p>
        `,
        tags: ['科研创新', '技术创新', '国际合作'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      },
      {
        title: '领导贡献',
        content: `
          <p>2018年12月，刘清友教授任成都理工大学党委副书记、校长，2023年10月任成都理工大学党委书记。</p>
          <p>在学校领导和学科建设中发挥重要作用，推动学校在石油工程、地质勘探等领域的学科发展和人才培养。</p>
          <p>作为石油钻头及钻采装备领域的知名专家，刘清友书记将学术研究与学校管理相结合，为学校的发展做出了重要贡献。</p>
        `,
        tags: ['学校管理', '学科建设', '国际交流'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [
      {
        type: '奖项',
        title: '国家创新争先奖',
        year: '近年',
        summary: '获得国家首届"创新争先"奖',
        tags: ['国家级', '创新奖']
      },
      {
        type: '奖项',
        title: '何梁何利基金科学与技术进步奖',
        year: '近年',
        summary: '荣获何梁何利基金科学与技术进步奖',
        tags: ['重要奖项', '科技进步']
      },
      {
        type: '奖项',
        title: '光华工程科技奖',
        year: '近年',
        summary: '获第十四届光华工程科技奖',
        tags: ['工程科技', '重要奖项']
      },
      {
        type: '成果',
        title: '国家科技进步奖',
        year: '多项',
        summary: '获国家科技进步特等奖1项、二等奖2项，省部级科技一等奖8项',
        tags: ['国家级', '科技进步']
      },
      {
        type: '成果',
        title: '科研产出',
        year: '长期',
        summary: '发表论文180余篇，授权发明专利60余件（国际专利9件），出版专著教材7部',
        tags: ['高水平', '创新产出']
      },
      {
        type: '院士候选',
        title: '院士有效候选人',
        year: '2025',
        summary: '2025年8月，入选中国工程院院士增选有效候选人名单',
        tags: ['院士候选', '中国工程院']
      }
    ],
    
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学校长，共同推进学校发展'
      },
      {
        id: 'r2',
        name: '张倬元',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      }
    ],
    
    anecdotes: [
      {
        title: '石油钻头专家',
        icon: 'fas fa-cog',
        content: '刘清友教授在石油钻头及钻采装备领域深耕多年，取得了显著成就，曾多次进入中国工程院院士增选第二轮评审，是我国该领域的重要专家。',
        tags: ['技术创新', '专家地位']
      },
      {
        title: '科技与教学并重',
        icon: 'fas fa-graduation-cap',
        content: '刘清友教授不仅在科研领域取得了突出成就，在人才培养方面也非常优秀，获省级教学特等奖和教学一等奖，培养了大批优秀人才。',
        tags: ['教书育人', '人才培养']
      },
      {
        title: '学校管理创新',
        icon: 'fas fa-university',
        content: '担任党委书记后，刘清友积极推进学校各项事业发展，在学科建设、人才培养、科技创新等方面做出了重要贡献。',
        tags: ['管理创新', '学校发展']
      }
    ]
  },

  // 张言森教授
  zhangyansen: {
    id: 'zhangyansen',
    name: '张言森',
    subtitle: '成都地质学院建校初期教授 · 学科奠基人',
    image: zhangyansengImg,
    keyTags: ['建校元勋', '学科奠基人', '早期教授'],
    
    timeline: [
      {
        year: '1956',
        title: '参与建校',
        description: '参与成都地质勘探学院筹建，是建校初期的核心教授之一',
        importance: 'high'
      },
      {
        year: '1956-1960',
        title: '教学与学科建设',
        description: '在学校初期的教学工作和学科建设中发挥重要作用',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '建校贡献',
        content: `
          <p>张言森教授是成都地质勘探学院（现成都理工大学）建校初期的核心教授之一，1956年参与学校的筹建工作。</p>
          <p>作为建校元勋，张教授为学校的早期发展、学科建设和人才培养做出了重要贡献。他是学校地质教育事业的奠基人之一，在艰苦的条件下，与同事们共同开创了成都理工大学的辉煌历史。</p>
        `,
        tags: ['建校元勋', '历史贡献'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '李承三',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      },
      {
        id: 'r2',
        name: '刘祖彝',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      }
    ],
    anecdotes: []
  },

  // 刘祖彝教授
  liuzuyi: {
    id: 'liuzuyi',
    name: '刘祖彝',
    subtitle: '成都地质学院建校初期教授 · 学科奠基人',
    image: liuzuyiImg,
    keyTags: ['建校元勋', '学科奠基人', '早期教授'],
    
    timeline: [
      {
        year: '1956',
        title: '参与建校',
        description: '参与成都地质勘探学院筹建，是建校初期的核心教授之一',
        importance: 'high'
      },
      {
        year: '1956-1960',
        title: '教学与学科建设',
        description: '在学校初期的教学工作和学科建设中发挥重要作用',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '建校贡献',
        content: `
          <p>刘祖彝教授是成都地质勘探学院（现成都理工大学）建校初期的核心教授之一，1956年参与学校的筹建工作。</p>
          <p>作为建校元勋，刘教授为学校的早期发展、学科建设和人才培养做出了重要贡献。他在学校初创时期艰苦的条件下，与同事们共同奋斗，为成都理工大学的学科发展奠定了坚实基础。</p>
        `,
        tags: ['建校元勋', '历史贡献'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '张言森',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      },
      {
        id: 'r2',
        name: '周晓和',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      }
    ],
    anecdotes: []
  },

  // 周晓和教授
  zhouxiaohe: {
    id: 'zhouxiaohe',
    name: '周晓和',
    subtitle: '成都地质学院建校初期教授 · 学科奠基人',
    image: zhouxiaoheImg,
    keyTags: ['建校元勋', '学科奠基人', '早期教授'],
    
    timeline: [
      {
        year: '1956',
        title: '参与建校',
        description: '参与成都地质勘探学院筹建，是建校初期的核心教授之一',
        importance: 'high'
      },
      {
        year: '1956-1960',
        title: '教学与学科建设',
        description: '在学校初期的教学工作和学科建设中发挥重要作用',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '建校贡献',
        content: `
          <p>周晓和教授是成都地质勘探学院（现成都理工大学）建校初期的核心教授之一，1956年参与学校的筹建工作。</p>
          <p>作为建校元勋，周教授为学校的早期发展、教学改革和学科建设做出了重要贡献。他在学校创建初期，以渊博的学识和丰富的教学经验，培养了大批优秀的地质专业人才。</p>
        `,
        tags: ['建校元勋', '历史贡献'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '刘祖彝',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      },
      {
        id: 'r2',
        name: '李之常',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      }
    ],
    anecdotes: []
  },

  // 李之常教授
  lizhichang: {
    id: 'lizhichang',
    name: '李之常',
    subtitle: '成都地质学院建校初期教授 · 学科奠基人',
    image: lizhichangImg,
    keyTags: ['建校元勋', '学科奠基人', '早期教授'],
    
    timeline: [
      {
        year: '1956',
        title: '参与建校',
        description: '参与成都地质勘探学院筹建，是建校初期的核心教授之一',
        importance: 'high'
      },
      {
        year: '1956-1960',
        title: '教学与学科建设',
        description: '在学校初期的教学工作和学科建设中发挥重要作用',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '建校贡献',
        content: `
          <p>李之常教授是成都地质勘探学院（现成都理工大学）建校初期的核心教授之一，1956年参与学校的筹建工作。</p>
          <p>作为建校元勋，李教授为学校的早期发展、学科建设和人才培养做出了重要贡献。他在学校初创时期，以严谨的治学态度和深厚的学术造诣，为成都理工大学的教育事业奠定了坚实基础。</p>
        `,
        tags: ['建校元勋', '历史贡献'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '周晓和',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      },
      {
        id: 'r2',
        name: '吴燕生',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      }
    ],
    anecdotes: []
  },

  // 吴燕生教授
  wuyansheng: {
    id: 'wuyansheng',
    name: '吴燕生',
    subtitle: '成都地质学院建校初期教授 · 学科奠基人',
    image: wuyanshengImg,
    keyTags: ['建校元勋', '学科奠基人', '早期教授'],
    
    timeline: [
      {
        year: '1956',
        title: '参与建校',
        description: '参与成都地质勘探学院筹建，是建校初期的核心教授之一',
        importance: 'high'
      },
      {
        year: '1956-1960',
        title: '教学与学科建设',
        description: '在学校初期的教学工作和学科建设中发挥重要作用',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '建校贡献',
        content: `
          <p>吴燕生教授是成都地质勘探学院（现成都理工大学）建校初期的核心教授之一，1956年参与学校的筹建工作。</p>
          <p>作为建校元勋，吴教授为学校的早期发展、学科建设和人才培养做出了重要贡献。他在学校创建初期，以专业的教学能力和丰富的实践经验，为推动成都理工大学的发展贡献了重要力量。</p>
        `,
        tags: ['建校元勋', '历史贡献'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '李之常',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      },
      {
        id: 'r2',
        name: '李唐泌',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      }
    ],
    anecdotes: []
  },

  // 李唐泌教授
  litangbi: {
    id: 'litangbi',
    name: '李唐泌',
    subtitle: '成都地质学院建校初期教授 · 学科奠基人',
    image: litangmiImg,
    keyTags: ['建校元勋', '学科奠基人', '早期教授'],
    
    timeline: [
      {
        year: '1956',
        title: '参与建校',
        description: '参与成都地质勘探学院筹建，是建校初期的核心教授之一',
        importance: 'high'
      },
      {
        year: '1956-1960',
        title: '教学与学科建设',
        description: '在学校初期的教学工作和学科建设中发挥重要作用',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '建校贡献',
        content: `
          <p>李唐泌教授是成都地质勘探学院（现成都理工大学）建校初期的核心教授之一，1956年参与学校的筹建工作。</p>
          <p>作为建校元勋，李教授为学校的早期发展、学科建设和人才培养做出了重要贡献。他在学校初创时期，以渊博的学术知识和严谨的治学精神，为成都理工大学的教育事业做出了重要贡献。</p>
        `,
        tags: ['建校元勋', '历史贡献'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '吴燕生',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      },
      {
        id: 'r2',
        name: '常隆庆',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      }
    ],
    anecdotes: []
  },

  // 常隆庆教授
  changlongqing: {
    id: 'changlongqing',
    name: '常隆庆',
    subtitle: '成都理工大学五大奠基人之一 · 地质学家 · 攀枝花之父',
    image: changlongqingImg,
    keyTags: ['奠基人', '建校元勋', '地质学家', '攀枝花之父', '五大奠基人'],
    
    timeline: [
      {
        year: '1956',
        title: '参与建校',
        description: '参与成都地质勘探学院筹建，是建校初期的核心教授之一',
        importance: 'high'
      },
      {
        year: '1956-1960',
        title: '教学与学科建设',
        description: '在学校初期的教学工作和学科建设中发挥重要作用',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '建校贡献',
        content: `
          <p>常隆庆教授是成都地质勘探学院（现成都理工大学）建校初期的核心教授之一，1956年参与学校的筹建工作。</p>
          <p>作为建校元勋和著名地质学家，常教授为学校的早期发展、学科建设和人才培养做出了重要贡献。他在学校创建初期，以深厚的学术底蕴和丰富的实践经验，为成都理工大学的发展奠定了坚实基础。</p>
        `,
        tags: ['建校元勋', '历史贡献'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '李唐泌',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      },
      {
        id: 'r2',
        name: '李承三',
        type: 'colleague',
        relation: '同事',
        description: '建校初期同事'
      }
    ],
    anecdotes: []
  },

  // 李承三教授 - 完整版
  lichengsan: {
    id: 'lichengsan',
    name: '李承三',
    subtitle: '成都地质学院首任教务长 · 石油地质教育开拓者',
    image: lichengsanImg,
    keyTags: ['首任教务长', '石油地质', '教育家'],
    
    timeline: [
      {
        year: '1906',
        title: '出生',
        description: '出生于湖北省',
        importance: 'medium'
      },
      {
        year: '1929',
        title: '毕业于中央大学',
        description: '毕业于中央大学（现南京大学）地质系',
        importance: 'high'
      },
      {
        year: '1956',
        title: '来到成都地质学院',
        description: '来到成都地质学院（现成都理工大学）工作',
        importance: 'high'
      },
      {
        year: '1956',
        title: '担任首任教务长',
        description: '担任成都地质学院首任教务长，负责学校的教学工作',
        importance: 'high'
      },
      {
        year: '1965',
        title: '退休',
        description: '从成都地质学院退休',
        importance: 'medium'
      }
    ],
    
    biography: [
      {
        title: '求学经历',
        content: `
          <p>李承三教授1906年出生于湖北省。1929年，他毕业于中央大学（现南京大学）地质系。</p>
          <p>李承三教授是我国著名的地质学家和教育家，在河流地貌学、石油地质学等方面有重要贡献。</p>
        `,
        tags: ['求学经历', '学术背景'],
        mediaType: 'image',
        mediaUrl: lichengsanImg
      },
      {
        title: '教育贡献',
        content: `
          <p>1956年，李承三教授来到成都地质学院（现成都理工大学）工作，担任首任教务长。</p>
          <p>作为首任教务长，李承三教授为学校的教学管理、学科建设等方面做出了重要贡献，为学校的发展奠定了坚实基础。</p>
          <p>他在石油地质学教学方面有重要贡献，培养了大批石油地质专业人才。</p>
        `,
        tags: ['教育贡献', '学校建设'],
        mediaType: 'video',
        mediaUrl: '/videos/li-teaching.mp4'
      }
    ],
    
    achievements: [
      {
        type: '荣誉',
        title: '首任教务长',
        year: '1956',
        summary: '担任成都地质学院首任教务长，为学校发展做出重要贡献',
        tags: ['学校建设', '教育管理']
      },
      {
        type: '专著',
        title: '河流地貌学',
        year: '1960',
        summary: '在河流地貌学方面有重要研究成果',
        tags: ['学术贡献', '理论建树']
      }
    ],
    
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '成都地质学院同事'
      },
      {
        id: 'r2',
        name: '张倬元',
        type: 'colleague',
        relation: '同事',
        description: '成都地质学院同事'
      },
      {
        id: 'r3',
        name: '曾允孚',
        type: 'colleague',
        relation: '同事',
        description: '成都地质学院同事'
      },
      {
        id: 'r4',
        name: '陈运泰',
        type: 'colleague',
        relation: '同事',
        description: '成都地质学院同事'
      }
    ],
    
    anecdotes: [
      {
        title: '首任教务长',
        icon: 'fas fa-user-tie',
        content: '李承三教授担任成都地质学院首任教务长，为学校的教学管理、学科建设等方面做出了重要贡献，为学校的发展奠定了坚实基础。',
        tags: ['学校建设', '教育管理']
      },
      {
        title: '石油地质教育',
        icon: 'fas fa-oil-can',
        content: '李承三教授在石油地质学教学方面有重要贡献，培养了大批石油地质专业人才，为我国石油地质事业的发展做出了贡献。',
        tags: ['教育贡献', '人才培养']
      }
    ]
  },

  // 许强校长 - 完整版
  xuqiang: {
    id: 'xuqiang',
    name: '许强',
    subtitle: '成都理工大学校长 · 地质灾害防治专家 · 院士有效候选人',
    image: xuqiangImg,
    keyTags: ['成都理工大学校长', '地质灾害防治', '李四光地质科学奖', '院士有效候选人', '国家杰青', '百千万人才工程国家级人选'],
    influenceLevel: 4, // 校长，影响力最高
    
    timeline: [
      {
        year: '1968',
        title: '出生',
        description: '1968年6月出生于四川南江',
        importance: 'medium'
      },
      {
        year: '1988-1992',
        title: '本科学习',
        description: '在成都地质学院水文地质与工程地质专业攻读本科',
        importance: 'high'
      },
      {
        year: '1992-1994',
        title: '硕士学习',
        description: '在成都理工学院工程地质专业攻读硕士研究生',
        importance: 'high'
      },
      {
        year: '1994-1997',
        title: '博士学习',
        description: '在成都理工学院水文地质与工程地质专业攻读博士研究生',
        importance: 'high'
      },
      {
        year: '1997',
        title: '任教',
        description: '在成都理工学院任教，开始从事地质灾害防治的教学和科研工作',
        importance: 'high'
      },
      {
        year: '2002-2004',
        title: '担任副院长',
        description: '担任成都理工大学环境与土木工程学院副院长（主持工作）',
        importance: 'high'
      },
      {
        year: '2004-2014',
        title: '担任院长',
        description: '担任成都理工大学环境与土木工程学院院长',
        importance: 'high'
      },
      {
        year: '2014-2019',
        title: '国家重点实验室常务副主任',
        description: '担任地质灾害防治与地质环境保护国家重点实验室常务副主任',
        importance: 'high'
      },
      {
        year: '2019',
        title: '担任副校长',
        description: '担任成都理工大学副校长',
        importance: 'high'
      },
      {
        year: '2023',
        title: '担任校长',
        description: '2023年10月任成都理工大学校长',
        importance: 'high'
      },
      {
        year: '2025',
        title: '院士有效候选人',
        description: '2025年8月，入选中国工程院院士增选有效候选人名单',
        importance: 'high',
        achievements: [
          '中国工程院院士增选有效候选人',
          '地质灾害防治领域杰出代表'
        ]
      }
    ],
    
    biography: [
      {
        title: '求学经历',
        content: `
          <p>许强校长1968年6月出生于四川南江。1988年考入成都地质学院（现成都理工大学）水文地质与工程地质专业，1992年获得学士学位。</p>
          <p>1992年至1994年，在成都理工学院工程地质专业攻读硕士研究生。1994年至1997年，继续在成都理工学院水文地质与工程地质专业攻读博士研究生，获博士学位。</p>
          <p>在成都地质学院的求学经历，为他后来的科研和教学工作奠定了坚实的基础。</p>
        `,
        tags: ['求学之路', '学术基础', '专业扎实'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      },
      {
        title: '学术贡献',
        content: `
          <p>许强教授长期从事地质灾害防治的教学和科研工作，专长于滑坡灾害成因机理、早期识别、监测预警与应急处置。</p>
          <p>主持国家重点研发计划项目、国家"973计划"课题、国家自然科学基金重大项目课题等科研项目60余项，发表学术论文500余篇，其中SCI论文200余篇，出版专著13部，授权发明专利20余项。</p>
          <p>作为核心成员，完成的科研成果获国家科技进步一等奖2项、二等奖1项，省部级和国家一级学会科技进步一等奖9项、二等奖4项。</p>
          <p>曾作为国务院、自然资源部和四川省人民政府核心专家，参与我国数十起重大地质灾害的应急处置工作，为保障人民生命财产安全做出了重要贡献。</p>
        `,
        tags: ['科研创新', '实践应用', '社会贡献'],
        mediaType: 'video',
        mediaUrl: '/videos/xu-research.mp4'
      },
      {
        title: '领导贡献',
        content: `
          <p>2023年10月，许强教授任成都理工大学校长。在他的领导下，学校积极探索职务科技成果转化管理新办法，实施"赋权改革+职称单列"，力破"不敢转""不愿转"的问题。</p>
          <p>许强校长积极推进学校的国际化合作，2025年率队到西藏大学访问交流，推动全面深化合作。他还重视学科建设，率队到中国政法大学调研纪检监察学科建设和人才培养情况。</p>
          <p>作为地质灾害防治领域的知名专家，许强校长将学术研究与学校管理相结合，为学校的发展做出了重要贡献。</p>
        `,
        tags: ['学校管理', '学科建设', '国际交流'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [
      {
        type: '奖项',
        title: '国家科技进步一等奖',
        year: '多项',
        summary: '作为核心成员完成的科研成果获国家科技进步一等奖2项、二等奖1项',
        tags: ['国家级', '一等奖'],
        highlights: [
          '国家科技进步一等奖2项',
          '国家科技进步二等奖1项',
          '省部级科技进步一等奖9项'
        ]
      },
      {
        type: '论文',
        title: '学术论文发表',
        year: '长期',
        summary: '发表学术论文500余篇，其中SCI论文200余篇',
        tags: ['SCI', '高水平'],
        highlights: [
          '发表论文500余篇',
          'SCI论文200余篇',
          '出版专著13部'
        ]
      },
      {
        type: '项目',
        title: '科研项目主持',
        year: '长期',
        summary: '主持国家重点研发计划项目、国家"973计划"课题、国家自然科学基金重大项目课题等科研项目60余项',
        tags: ['国家级', '重大项目']
      },
      {
        type: '奖项',
        title: '李四光地质科学奖',
        year: '近期',
        summary: '荣获李四光地质科学奖，这是中国地质学界的最高荣誉',
        tags: ['最高荣誉', '学术成就']
      },
      {
        type: '称号',
        title: '全国杰出专业技术人才',
        year: '近期',
        summary: '荣获全国杰出专业技术人才称号',
        tags: ['国家级', '人才称号']
      },
      {
        type: '院士候选',
        title: '院士有效候选人',
        year: '2025',
        summary: '2025年8月，入选中国工程院院士增选有效候选人名单',
        tags: ['院士候选', '中国工程院']
      }
    ],
    
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '张倬元',
        type: 'mentor',
        relation: '导师',
        description: '师从张倬元教授学习工程地质学'
      },
      {
        id: 'r2',
        name: '黄润秋',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，共同从事地质灾害防治研究'
      },
      {
        id: 'r3',
        name: '王成善',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      }
    ],
    
    anecdotes: [
      {
        title: '地质灾害应急处置专家',
        icon: 'fas fa-shield-alt',
        content: '许强教授曾作为国务院、自然资源部和四川省人民政府核心专家，参与我国数十起重大地质灾害的应急处置工作，多次在危险现场指导抢险救灾，为保障人民生命财产安全做出了重要贡献。',
        tags: ['社会贡献', '实践应用']
      },
      {
        title: '科研与教学并重',
        icon: 'fas fa-chalkboard-teacher',
        content: '许强教授不仅在科研领域取得了突出成就，在教学方面也非常优秀。他培养了大批地质灾害防治专业人才，许多学生已成为该领域的骨干力量。',
        tags: ['教书育人', '人才培养']
      },
      {
        title: '科技成果转化',
        icon: 'fas fa-lightbulb',
        content: '担任校长后，许强积极探索职务科技成果转化管理新办法，实施"赋权改革+职称单列"，有效解决了高校科技成果转化中的难题，为推动科技创新和经济发展做出了贡献。',
        tags: ['管理创新', '科技转化']
      }
    ]
  },

  // 李天斌院士 - 其他国家院士
  litianbin: {
    id: 'litianbin',
    name: '李天斌',
    subtitle: '成都理工大学教授 · 其他国家院士',
    image: litianbinImg,
    keyTags: ['其他国家院士', '成都理工大学', '教授'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，获得其他国家院士称号',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>李天斌教授是成都理工大学教授，获得其他国家院士称号，为学校的学科建设和人才培养做出了重要贡献。</p>
          <p>作为其他国家院士，李天斌教授在相关学科领域具有深厚的学术造诣和重要的学术影响力，为成都理工大学的发展贡献了力量。</p>
        `,
        tags: ['学术成就', '国际影响'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '袁向军',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学其他国家院士'
      }
    ],
    
    anecdotes: []
  },

  // 庹先国教授 - 国家杰青、百千万人才工程国家级人选
  tuoxianguo: {
    id: 'tuoxianguo',
    name: '庹先国',
    subtitle: '成都理工大学教授 · 国家杰青 · 百千万人才工程国家级人选',
    image: tuoxianguoImg,
    keyTags: ['国家杰青', '百千万人才工程国家级人选', '地球物理', '成都理工大学'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，获得国家杰出青年科学基金',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>庹先国教授是成都理工大学教授，国家杰出青年科学基金获得者，百千万人才工程国家级人选。</p>
          <p>主要从事地球物理勘探与地震学研究，在相关领域取得了重要研究成果，为学校的学科建设和人才培养做出了重要贡献。</p>
        `,
        tags: ['学术成就', '地球物理'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，同为国家级人才'
      },
      {
        id: 'r2',
        name: '黄润秋',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，同为国家级人才'
      }
    ],
    
    anecdotes: []
  },

  // 刘耘教授 - 国家杰青、百千万人才工程国家级人选
  fanxuanmei: {
    id: 'fanxuanmei',
    name: '范宣梅',
    subtitle: '成都理工大学教授 · 国家杰青 · 百千万人才工程国家级人选',
    image: fanxuanmeiImg,
    keyTags: ['国家杰青', '百千万人才工程国家级人选', '地质工程', '成都理工大学'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，获得国家杰出青年科学基金',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>范宣梅教授是成都理工大学教授，国家杰出青年科学基金获得者，百千万人才工程国家级人选。</p>
          <p>主要从事地质工程与灾害防治研究，在相关领域取得了重要研究成果，为学校的学科建设和人才培养做出了重要贡献。</p>
        `,
        tags: ['学术成就', '地质工程'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，同为国家级人才'
      }
    ],
    
    anecdotes: []
  },

  // 李超教授 - 国家杰青
  lichao: {
    id: 'lichao',
    name: '李超',
    subtitle: '成都理工大学教授 · 国家杰青',
    image: lichaoImg,
    keyTags: ['国家杰青', '地质学', '成都理工大学'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，获得国家杰出青年科学基金',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>李超教授是成都理工大学教授，国家杰出青年科学基金获得者。</p>
          <p>主要从事地质学研究，在相关领域取得了重要研究成果，为学校的学科建设和人才培养做出了重要贡献。</p>
        `,
        tags: ['学术成就', '地质学'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，同为国家级人才'
      }
    ],
    
    anecdotes: []
  },

  // 彭强教授 - 国家杰青
  pengqiang: {
    id: 'pengqiang',
    name: '彭强',
    subtitle: '成都理工大学教授 · 国家杰青',
    image: pengqiangImg,
    keyTags: ['国家杰青', '地球物理', '成都理工大学'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，获得国家杰出青年科学基金',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>彭强教授是成都理工大学教授，国家杰出青年科学基金获得者。</p>
          <p>主要从事地球物理研究，在相关领域取得了重要研究成果，为学校的学科建设和人才培养做出了重要贡献。</p>
        `,
        tags: ['学术成就', '地球物理'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，同为国家级人才'
      }
    ],
    
    anecdotes: []
  },

  // 胡伟教授 - 国家杰青
  huwei: {
    id: 'huwei',
    name: '胡伟',
    subtitle: '成都理工大学教授 · 国家杰青',
    image: huiweiImg,
    keyTags: ['国家杰青', '地质灾害', '成都理工大学'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，获得国家杰出青年科学基金',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>胡伟教授是成都理工大学教授，国家杰出青年科学基金获得者。</p>
          <p>主要从事地质灾害防治研究，在相关领域取得了重要研究成果，为学校的学科建设和人才培养做出了重要贡献。</p>
        `,
        tags: ['学术成就', '地质灾害'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，同为国家级人才'
      }
    ],
    
    anecdotes: []
  },

  // 刘树根教授 - 百千万人才工程国家级人选
  liushugen: {
    id: 'liushugen',
    name: '刘树根',
    subtitle: '成都理工大学教授 · 百千万人才工程国家级人选',
    image: liushugenImg,
    keyTags: ['百千万人才工程国家级人选', '地质工程', '成都理工大学'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，入选百千万人才工程国家级人选',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>刘树根教授是成都理工大学教授，百千万人才工程国家级人选。</p>
          <p>主要从事地质工程与岩土力学研究，在相关领域取得了重要研究成果，为学校的学科建设和人才培养做出了重要贡献。</p>
        `,
        tags: ['学术成就', '地质工程'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，同为国家级人才'
      }
    ],
    
    anecdotes: []
  },

  // 唐川教授 - 百千万人才工程国家级人选
  tangchuan: {
    id: 'tangchuan',
    name: '唐川',
    subtitle: '成都理工大学教授 · 百千万人才工程国家级人选',
    image: tangchuanImg,
    keyTags: ['百千万人才工程国家级人选', '地球物理', '成都理工大学'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，入选百千万人才工程国家级人选',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>唐川教授是成都理工大学教授，百千万人才工程国家级人选。</p>
          <p>主要从事地球物理勘探技术研究，在相关领域取得了重要研究成果，为学校的学科建设和人才培养做出了重要贡献。</p>
        `,
        tags: ['学术成就', '地球物理'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，同为国家级人才'
      }
    ],
    
    anecdotes: []
  },

  // 李忠权教授 - 百千万人才工程国家级人选
  lizhongquan: {
    id: 'lizhongquan',
    name: '李忠权',
    subtitle: '成都理工大学教授 · 百千万人才工程国家级人选',
    image: lizhongquanImg,
    keyTags: ['百千万人才工程国家级人选', '地质学', '成都理工大学'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，入选百千万人才工程国家级人选',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>李忠权教授是成都理工大学教授，百千万人才工程国家级人选。</p>
          <p>主要从事地质学研究，在相关领域取得了重要研究成果，为学校的学科建设和人才培养做出了重要贡献。</p>
        `,
        tags: ['学术成就', '地质学'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，同为国家级人才'
      }
    ],
    
    anecdotes: []
  },

  // 李勇教授 - 百千万人才工程国家级人选
  liyong: {
    id: 'liyong',
    name: '李勇',
    subtitle: '成都理工大学教授 · 百千万人才工程国家级人选',
    image: liyongImg,
    keyTags: ['百千万人才工程国家级人选', '地球化学', '成都理工大学'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，入选百千万人才工程国家级人选',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>李勇教授是成都理工大学教授，百千万人才工程国家级人选。</p>
          <p>主要从事地球化学研究，在相关领域取得了重要研究成果，为学校的学科建设和人才培养做出了重要贡献。</p>
        `,
        tags: ['学术成就', '地球化学'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，同为国家级人才'
      }
    ],
    
    anecdotes: []
  },

  // 裴向军教授 - 百千万人才工程国家级人选
  peixiangjun: {
    id: 'peixiangjun',
    name: '裴向军',
    subtitle: '成都理工大学教授 · 百千万人才工程国家级人选',
    image: peixiangjunImg,
    keyTags: ['百千万人才工程国家级人选', '地质工程', '成都理工大学'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，入选百千万人才工程国家级人选',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>裴向军教授是成都理工大学教授，百千万人才工程国家级人选。</p>
          <p>主要从事地质工程与灾害防治研究，在相关领域取得了重要研究成果，为学校的学科建设和人才培养做出了重要贡献。</p>
        `,
        tags: ['学术成就', '地质工程'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，同为国家级人才'
      }
    ],
    
    anecdotes: []
  },

  luoxiaodong: {
    id: 'luoxiaodong',
    name: '罗晓东',
    subtitle: '成都理工大学教授 · 生态地质专家',
    image: xuqiangImg,
    keyTags: ['生态地质', '矿山修复', '土地恢复'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学生态环境学院教授',
        importance: 'medium'
      },
      {
        year: '荣誉',
        title: '省科技进步一等奖',
        description: '获四川科技进步一等奖',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>罗晓东，成都理工大学生态环境学院教授，生态地质与土地恢复专家。长期致力于矿山生态修复与地质环境重建研究。他提出"地质系统生态化修复理论"，在攀枝花矿区及川西废弃矿山治理中取得显著效果。罗晓东主持多项国家与省级项目，成果获四川科技进步一等奖。他强调"绿水青山与地质安全并重"，推动成理成为生态地质领域的重要科研基地。</p>
        `,
        tags: ['生态修复', '绿色发展'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r2',
        name: '黄润秋',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      }
    ],
    anecdotes: []
  },

  // 张国权教授
  zhangguoquan: {
    id: 'zhangguoquan',
    name: '张国权',
    subtitle: '成都理工大学教授 · 地质经济专家',
    image: xuqiangImg,
    keyTags: ['地质经济', '资源管理', '交叉学科'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学经济管理学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '社科基金项目',
        description: '主持多项国家社会科学基金项目',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>张国权，成都理工大学经济管理学院教授，地质经济与资源管理专家。研究方向为资源经济学与矿产可持续利用政策。张国权主持多项国家社会科学基金项目，提出"资源环境经济协调发展机制"，为四川省矿业经济政策提供理论支持。他推动"地质+经济"交叉学科建设，使成理在地质经济管理领域形成独特优势。张国权以宏观战略视角助推学校科研成果的社会转化。</p>
        `,
        tags: ['交叉学科', '战略视角'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '陈静',
        type: 'colleague',
        relation: '同事',
        description: '文法学院同事'
      },
      {
        id: 'r2',
        name: '宋洁',
        type: 'colleague',
        relation: '同事',
        description: '文法学院同事'
      },
      {
        id: 'r3',
        name: '赵慧',
        type: 'colleague',
        relation: '同事',
        description: '人文社科相关领域同事'
      }
    ],
    anecdotes: []
  },

  // 郭婷婷副教授
  guotingting: {
    id: 'guotingting',
    name: '郭婷婷',
    subtitle: '成都理工大学副教授 · 数字叙事专家',
    image: xuqiangImg,
    keyTags: ['数字叙事', '文化传播', '数字人文'],
    
    timeline: [
      {
        year: '任职',
        title: '任副教授',
        description: '担任成都理工大学新闻与传播学院副教授',
        importance: 'medium'
      },
      {
        year: '荣誉',
        title: '获奖项目',
        description: '多项研究获国家艺术基金与教育部优秀成果奖',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>郭婷婷，成都理工大学新闻与传播学院副教授，数字叙事与文化传播专家。她主持的"成理数字记忆计划"以校史文化为核心，运用沉浸式影像技术构建虚拟校史体验系统，深受学生喜爱。郭婷婷倡导"用技术讲述文化"，推动数字人文研究落地校园。她的研究项目多次获国家艺术基金与教育部优秀成果奖，是学校数字文化创新的代表人物。</p>
        `,
        tags: ['数字人文', '文化创新'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '刘方',
        type: 'colleague',
        relation: '同事',
        description: '数字人文相关领域同事'
      },
      {
        id: 'r2',
        name: '李茜',
        type: 'colleague',
        relation: '同事',
        description: '艺术与传媒学院同事'
      },
      {
        id: 'r3',
        name: '宋洁',
        type: 'colleague',
        relation: '同事',
        description: '数字人文相关领域同事'
      }
    ],
    anecdotes: []
  },

  // 赵成教授
  zhaocheng: {
    id: 'zhaocheng',
    name: '赵成',
    subtitle: '成都理工大学教授 · 光电信息技术专家',
    image: xuqiangImg,
    keyTags: ['光电信息', '光纤传感', '智能监测'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学物理电子学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '多参数探测系统',
        description: '提出光纤分布式多参数探测系统',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>赵成，成都理工大学物理电子学院教授，光电信息与探测技术专家。研究方向为光纤传感与智能监测。赵成提出"光纤分布式多参数探测系统"，在地质灾害预警、地下工程监测中发挥重要作用。他的团队研发的"地灾光电监测装备"成功应用于多地地灾防治工程。赵成重视科研成果产业化，推动光电信息技术在地学领域的融合创新，是成理光电科技研究的引领者。</p>
        `,
        tags: ['产业转化', '光电科技'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '陈运泰',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r2',
        name: '李雪梅',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r3',
        name: '周莹',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r4',
        name: '陈勇',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      }
    ],
    anecdotes: []
  },

  // 陈俊教授
  chenjun: {
    id: 'chenjun',
    name: '陈俊',
    subtitle: '成都理工大学教授 · 地震工程专家',
    image: xuqiangImg,
    keyTags: ['地震工程', '地应力测试', '防震减灾'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学地球物理学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '实验观测体系',
        description: '建立成理地震科学实验观测体系',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>陈俊，成都理工大学地球物理学院教授，地震工程与地应力测试专家。提出"基于地震波场反演的应力场快速评估方法"，在地震风险预测中发挥重要作用。他主持国家重点研发项目，建立了成理地震科学实验观测体系。陈俊积极参与地震灾害应急技术研发，是四川抗震减灾科技力量的重要成员。他主张科研服务民生，是成理"防震减灾工程"学科的核心推动者。</p>
        `,
        tags: ['科研服务民生', '防震减灾'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '陈运泰',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r2',
        name: '李雪梅',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r3',
        name: '周莹',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r4',
        name: '陈勇',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r5',
        name: '赵成',
        type: 'colleague',
        relation: '同事',
        description: '光电监测相关领域同事'
      }
    ],
    anecdotes: []
  },

  // 张国庆教授
  zhangguoqing: {
    id: 'zhangguoqing',
    name: '张国庆',
    subtitle: '成都理工大学教授 · 古气候变化专家',
    image: xuqiangImg,
    keyTags: ['古气候变化', '第四纪地质', 'Nature子刊'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学地球科学学院教授、博士生导师',
        importance: 'medium'
      },
      {
        year: '荣誉',
        title: 'Nature子刊发表',
        description: '成果发表在Nature子刊',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>张国庆，成都理工大学地球科学学院教授、博士生导师，第四纪地质与古气候变化专家。长期研究青藏高原隆升过程与气候响应，提出"多阶段高原隆升气候反馈模型"，在国际地学界产生广泛影响。主持国家自然科学基金重点项目与中欧合作计划，成果发表在Nature子刊。张国庆积极推动国际学术交流，使成理成为全球古气候研究的重要节点。他倡导跨学科融合，将地质演化与生态环境研究相结合，代表了成理地球系统科学研究的前沿方向。</p>
        `,
        tags: ['国际交流', '前沿研究'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r2',
        name: '王成善',
        type: 'colleague',
        relation: '同事',
        description: '地球科学学院同事'
      },
      {
        id: 'r3',
        name: '曾允孚',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r4',
        name: '周成林',
        type: 'colleague',
        relation: '同事',
        description: '地球科学学院同事'
      }
    ],
    anecdotes: []
  },

  // 孙海涛教授
  sunhaitao: {
    id: 'sunhaitao',
    name: '孙海涛',
    subtitle: '成都理工大学教授 · 地下水动力学专家',
    image: xuqiangImg,
    keyTags: ['地下水动力学', '水文地质', '环境工程'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学水文与环境学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '国家重大专项',
        description: '主持多项国家重大专项',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>孙海涛，成都理工大学水文与环境学院教授，地下水动力学专家。长期从事地下水污染迁移、资源开发与环境风险研究，提出"地下水污染多场耦合迁移机制"，被广泛应用于西南地区地下水安全评估。他主持多项国家重大专项，其研究成果服务于成都平原及川南工业区的地下水治理工程。孙海涛强调"科学研究应服务于社会可持续发展"，推动水文地质与环境工程学科融合，是成理环境地学领域的核心人物。</p>
        `,
        tags: ['可持续发展', '学科融合'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r2',
        name: '黄润秋',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r3',
        name: '罗晓东',
        type: 'colleague',
        relation: '同事',
        description: '生态环境学院同事'
      }
    ],
    anecdotes: []
  },

  // 李雪梅教授
  lixuemei: {
    id: 'lixuemei',
    name: '李雪梅',
    subtitle: '成都理工大学教授 · 重力磁法专家',
    image: xuqiangImg,
    keyTags: ['重力磁法', '地球物理', '女性科学家'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学地球物理学院教授',
        importance: 'medium'
      },
      {
        year: '荣誉',
        title: '重点项目',
        description: '主持国家自然科学基金重点项目',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>李雪梅，成都理工大学地球物理学院教授，重力—磁法综合解释专家。她提出"多源重磁数据反演协同算法"，有效提升复杂地质体识别精度，成果应用于矿产资源勘查与地壳构造分析。李雪梅主持国家自然科学基金重点项目，是我国少数主导地球物理反演算法研发的女性科学家。她积极培养青年科研人才，推动成理地球物理学科向智能化、可视化方向发展，为学校在国际地球物理界赢得良好声誉。</p>
        `,
        tags: ['算法创新', '女性科学家'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '陈运泰',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r2',
        name: '陈俊',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r3',
        name: '周莹',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r4',
        name: '陈勇',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r5',
        name: '赵成',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      }
    ],
    anecdotes: []
  },

  // 杨洪教授
  yanghong: {
    id: 'yanghong',
    name: '杨洪',
    subtitle: '成都理工大学教授 · 边坡工程专家',
    image: xuqiangImg,
    keyTags: ['边坡工程', '岩体力学', '交通工程'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学地质工程学院教授、博士生导师',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '重大交通工程',
        description: '为川藏公路、雅西高速提供技术支持',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>杨洪，成都理工大学地质工程学院教授、博士生导师，岩体力学与边坡工程专家。曾主持多项国家重点研发计划，在复杂山区公路滑坡治理工程中积累丰富实践经验。杨洪提出"地质结构主控的边坡演化机理"，为川藏公路、雅西高速等重大交通工程提供关键技术支持。他主张理论与工程结合，打造"地质—工程—防灾"一体化教学体系，培养了一批优秀工程师与研究生，是成理地质工程教育的标杆人物。</p>
        `,
        tags: ['工程实践', '教学标杆'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r2',
        name: '王成善',
        type: 'colleague',
        relation: '同事',
        description: '能源学院同事'
      },
      {
        id: 'r3',
        name: '彭涛',
        type: 'colleague',
        relation: '同事',
        description: '能源学院同事'
      }
    ],
    anecdotes: []
  },

  // 周成林教授
  zhouchenglin: {
    id: 'zhouchenglin',
    name: '周成林',
    subtitle: '成都理工大学教授 · 油气成藏专家',
    image: xuqiangImg,
    keyTags: ['油气成藏', '地球化学', '能源战略'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学能源学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '定量模型',
        description: '首次提出热流控制下的成烃效率定量模型',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>周成林，成都理工大学能源学院教授，地球化学与油气成藏专家。研究方向为有机地球化学与沉积盆地动力学。他首次提出"热流控制下的成烃效率定量模型"，有效提升页岩油气资源评价精度。周成林主持国家重点基金项目，其研究成果被中石油、中海油等单位采用。他主张科研应服务国家能源战略，是推动成理能源地学从理论研究走向应用转化的重要人物。</p>
        `,
        tags: ['能源战略', '应用转化'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r2',
        name: '王成善',
        type: 'colleague',
        relation: '同事',
        description: '地球科学学院同事'
      },
      {
        id: 'r3',
        name: '张国庆',
        type: 'colleague',
        relation: '同事',
        description: '地球科学学院同事'
      },
      {
        id: 'r4',
        name: '彭志勇',
        type: 'colleague',
        relation: '同事',
        description: '地球化学学院同事'
      }
    ],
    anecdotes: []
  },

  // 朱小红教授
  zhuxiaohong: {
    id: 'zhuxiaohong',
    name: '朱小红',
    subtitle: '成都理工大学教授 · 人工智能专家',
    image: xuqiangImg,
    keyTags: ['人工智能', '数据可视化', '智慧地学'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学计算机与信息科学学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '智慧地学系统',
        description: '主持研发智慧地学信息系统',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>朱小红，成都理工大学计算机与信息科学学院教授，人工智能与数据可视化专家。她主持研发的"智慧地学信息系统"将AI算法与地质数据分析结合，实现地质灾害的实时监测与趋势预测。朱小红倡导"让数据会说话"，推动地学数据智能化处理与可视化表达。她是学校数字地学与智能信息方向的重要推动者，其工作使成都理工大学在智能地学领域跻身全国前列。</p>
        `,
        tags: ['智能地学', '数据可视化'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '杨波',
        type: 'colleague',
        relation: '同事',
        description: '计算机与信息科学学院同事'
      },
      {
        id: 'r2',
        name: '刘方',
        type: 'colleague',
        relation: '同事',
        description: '数字技术相关领域同事'
      },
      {
        id: 'r3',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      }
    ],
    anecdotes: []
  },

  // 刘方教授
  liufang: {
    id: 'liufang',
    name: '刘方',
    subtitle: '成都理工大学教授 · 数字交互艺术专家',
    image: xuqiangImg,
    keyTags: ['数字交互艺术', '文化遗产', '虚拟现实'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学艺术与传媒学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '数字校园记忆',
        description: '主导数字校园记忆计划',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>刘方，成都理工大学艺术与传媒学院教授，数字交互艺术与文化遗产数字化专家。她主导的"数字校园记忆计划"通过虚拟现实技术重现学校发展历程，融合艺术叙事与互动体验，成为高校数字校史馆建设的标杆。刘方强调文化传承与科技创新并重，她的设计理念影响了成理校史馆的整体风格。她以"科技赋能文化记忆"为理念，推动学校数字人文方向的持续创新。</p>
        `,
        tags: ['文化传承', '科技创新'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r2',
        name: '王成善',
        type: 'colleague',
        relation: '同事',
        description: '地球科学学院同事'
      },
      {
        id: 'r3',
        name: '张国庆',
        type: 'colleague',
        relation: '同事',
        description: '地球科学学院同事'
      },
      {
        id: 'r4',
        name: '周成林',
        type: 'colleague',
        relation: '同事',
        description: '地球化学学院同事'
      }
    ],
    anecdotes: []
  },

  // 彭志勇教授
  pengzhiyong: {
    id: 'pengzhiyong',
    name: '彭志勇',
    subtitle: '成都理工大学教授 · 矿床地球化学专家',
    image: xuqiangImg,
    keyTags: ['矿床地球化学', '稀有金属', '省科技进步奖'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学地球化学学院教授',
        importance: 'medium'
      },
      {
        year: '荣誉',
        title: '省科技进步一等奖',
        description: '获四川省科技进步一等奖',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>彭志勇，成都理工大学地球化学学院教授，矿床地球化学与元素成矿机制专家。他在稀有金属成矿体系研究中提出"流体分异驱动富集模型"，被认为是成理矿床地球化学的重要理论突破。彭志勇主持多项国家重点项目，获四川省科技进步一等奖。他注重青年科研团队建设，推动学校地球化学研究群体的持续壮大，形成了"理论与实践并重"的科研特色。</p>
        `,
        tags: ['理论突破', '团队建设'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '张国权',
        type: 'colleague',
        relation: '同事',
        description: '文法学院同事'
      },
      {
        id: 'r2',
        name: '宋洁',
        type: 'colleague',
        relation: '同事',
        description: '文法学院同事'
      },
      {
        id: 'r3',
        name: '赵慧',
        type: 'colleague',
        relation: '同事',
        description: '外国语学院同事'
      }
    ],
    anecdotes: []
  },

  // 陈静教授
  chenjing: {
    id: 'chenjing',
    name: '陈静',
    subtitle: '成都理工大学教授 · 环境法专家',
    image: xuqiangImg,
    keyTags: ['环境法', '自然资源法', '法学博士'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学文法学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '国家立法咨询',
        description: '参与多项国家立法咨询项目',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>陈静，成都理工大学文法学院教授，法学博士，研究方向为环境法与自然资源法。她参与多项国家立法咨询项目，提出"地质环境损害责任体系"与"灾害风险法律评估机制"，为地方政府制定环保政策提供法律依据。陈静注重理论研究与社会实践结合，推动"法律+地质"复合型人才培养。她以扎实的学术功底与社会影响力，成为成理人文法学领域的重要代表。</p>
        `,
        tags: ['复合型人才', '法治建设'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r2',
        name: '王成善',
        type: 'colleague',
        relation: '同事',
        description: '地球科学学院同事'
      },
      {
        id: 'r3',
        name: '张国庆',
        type: 'colleague',
        relation: '同事',
        description: '地球科学学院同事'
      }
    ],
    anecdotes: []
  },

  // 黄文涛教授
  huangwentao: {
    id: 'huangwentao',
    name: '黄文涛',
    subtitle: '成都理工大学教授 · 构造地质专家',
    image: xuqiangImg,
    keyTags: ['构造地质', '地球动力学', '龙门山断裂'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学地球科学学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '国际顶级期刊',
        description: '成果多次发表于国际顶级地学期刊',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>黄文涛，成都理工大学地球科学学院教授，构造地质与地球动力学专家。长期致力于龙门山断裂带活动与地壳演化研究，提出"多级断裂协同变形机制"，为汶川地震构造解析提供新思路。黄文涛主持多项国家重点项目，成果多次发表于国际顶级地学期刊。他注重野外地质教学传统的传承，倡导"行走的课堂"，带领学生深入高原一线开展实地研究，是成理最受学生敬仰的教师之一。</p>
        `,
        tags: ['汶川地震研究', '实践教学'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r2',
        name: '黄润秋',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r3',
        name: '张倬元',
        type: 'teacher',
        relation: '老师',
        description: '成都理工大学老师'
      },
      {
        id: 'r4',
        name: '杨洪',
        type: 'colleague',
        relation: '同事',
        description: '地质工程学院同事'
      },
      {
        id: 'r5',
        name: '林峰',
        type: 'colleague',
        relation: '同事',
        description: '环境与土木工程学院同事'
      },
      {
        id: 'r6',
        name: '王志强',
        type: 'colleague',
        relation: '同事',
        description: '地质工程学院同事'
      }
    ],
    anecdotes: []
  },

  // 张涛教授
  zhangtao: {
    id: 'zhangtao',
    name: '张涛',
    subtitle: '成都理工大学教授 · 岩土工程专家',
    image: xuqiangImg,
    keyTags: ['岩土工程', '地质灾害防控', '应用型科研'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学工程技术学院教授、博士生导师',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '三维稳定性模型',
        description: '提出滑坡三维稳定性演化模型',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>张涛，成都理工大学工程技术学院教授、博士生导师，岩土工程与地质灾害防控专家。长期从事地质灾害动态监测与滑坡防控研究，主持多项国家自然科学基金项目。他提出的"滑坡三维稳定性演化模型"被应用于四川、云南多地灾害治理工程中，极大提高了风险预测精度。张涛以"让科学走进防灾一线"为目标，推动成理地质防灾研究与地方政府应急体系深度融合，是学校应用型科研的典范。</p>
        `,
        tags: ['应用型科研', '融合创新'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '陈运泰',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r2',
        name: '陈俊',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r3',
        name: '李雪梅',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r4',
        name: '陈勇',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      }
    ],
    anecdotes: []
  },

  // 周莹教授
  zhouying: {
    id: 'zhouying',
    name: '周莹',
    subtitle: '成都理工大学教授 · 地震监测专家',
    image: xuqiangImg,
    keyTags: ['地震监测', '地壳形变', '女性科学家'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学地球物理学院教授',
        importance: 'medium'
      },
      {
        year: '荣誉',
        title: '青年学者奖',
        description: '获中国地震学会青年学者奖',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>周莹，成都理工大学地球物理学院教授，地震监测与地壳形变分析专家。她在川滇地区构造地震带形变监测方面取得突破，提出"多源地震形变耦合模型"，为地震预警与风险控制提供科学依据。周莹主持国家重点研发项目，建设了"西南地震监测综合观测网"，有效提升区域地震监测能力。她是中国地震学会青年学者奖获得者，代表成理新一代女性科学家力量。</p>
        `,
        tags: ['地震预警', '新一代科学家'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r2',
        name: '黄润秋',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r3',
        name: '张倬元',
        type: 'teacher',
        relation: '老师',
        description: '成都理工大学老师'
      },
      {
        id: 'r4',
        name: '杨洪',
        type: 'colleague',
        relation: '同事',
        description: '环境与土木工程学院同事'
      },
      {
        id: 'r5',
        name: '张涛',
        type: 'colleague',
        relation: '同事',
        description: '环境与土木工程学院同事'
      },
      {
        id: 'r6',
        name: '孙海涛',
        type: 'colleague',
        relation: '同事',
        description: '环境与土木工程学院同事'
      }
    ],
    anecdotes: []
  },

  // 林峰教授
  linfeng: {
    id: 'linfeng',
    name: '林峰',
    subtitle: '成都理工大学教授 · 韧性城市专家',
    image: xuqiangImg,
    keyTags: ['韧性城市', '城市防灾', '生命线安全'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学环境与土木工程学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '国家重点专项',
        description: '主持国家重点专项',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>林峰，成都理工大学环境与土木工程学院教授，城市防灾减灾与韧性城市研究专家。长期关注城市地质与灾害系统的风险演化，提出"城市地质韧性耦合评估模型"，推动地质工程与城市规划学科深度融合。林峰主持国家重点专项，参与成都市防灾空间规划体系建设，是成理地质工程科技服务社会的典型代表。他主张科研应"面向城市生命线安全"，以科技守护城市未来。</p>
        `,
        tags: ['城市安全', '科技服务社会'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '刘宝珺',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r2',
        name: '王成善',
        type: 'colleague',
        relation: '同事',
        description: '能源学院同事'
      },
      {
        id: 'r3',
        name: '周成林',
        type: 'colleague',
        relation: '同事',
        description: '能源学院同事'
      }
    ],
    anecdotes: []
  },

  // 彭涛教授
  pengtao: {
    id: 'pengtao',
    name: '彭涛',
    subtitle: '成都理工大学教授 · CCS技术专家',
    image: xuqiangImg,
    keyTags: ['CCS技术', '碳中和', '绿色能源'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学能源学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: 'CO₂封存试点',
        description: '成果在四川盆地CO₂封存试点中应用',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>彭涛，成都理工大学能源学院教授，碳储存与地下封存（CCS）技术专家。其研究方向聚焦碳中和背景下的二氧化碳封存地质机制，提出"多场耦合下CO₂封存安全评价模型"，为我国碳减排战略提供技术支撑。彭涛主持国家自然科学基金与能源部合作项目，成果在四川盆地CO₂封存试点中应用。作为成理"绿色能源地学"方向带头人，他推动学校在能源与环境交叉领域的国际影响力。</p>
        `,
        tags: ['碳中和', '国际影响'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '张国权',
        type: 'colleague',
        relation: '同事',
        description: '文法学院同事'
      },
      {
        id: 'r2',
        name: '陈静',
        type: 'colleague',
        relation: '同事',
        description: '文法学院同事'
      },
      {
        id: 'r3',
        name: '郭婷婷',
        type: 'colleague',
        relation: '同事',
        description: '人文社科相关领域同事'
      },
      {
        id: 'r4',
        name: '刘方',
        type: 'colleague',
        relation: '同事',
        description: '数字人文相关领域同事'
      }
    ],
    anecdotes: []
  },

  // 宋洁教授
  songjie: {
    id: 'songjie',
    name: '宋洁',
    subtitle: '成都理工大学教授 · 高等教育研究专家',
    image: xuqiangImg,
    keyTags: ['高等教育', '校园文化', '数字人文'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学文法学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '教育部重点项目',
        description: '主持教育部重点项目',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>宋洁，成都理工大学文法学院教授，社会学与高等教育研究专家。长期研究高校文化、学生发展与校园精神传承，主持教育部重点项目《高校文化记忆的数字化建构》。她提出"校园文化生态系统理论"，在成理数字校史馆建设中提出重要设计理念。宋洁以人文视角解读学校发展，为教育文化研究提供独特贡献，是校园精神传承的重要推动者。</p>
        `,
        tags: ['文化传承', '人文视角'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '朱小红',
        type: 'colleague',
        relation: '同事',
        description: '计算机与信息科学学院同事'
      },
      {
        id: 'r2',
        name: '刘方',
        type: 'colleague',
        relation: '同事',
        description: '数字技术相关领域同事'
      }
    ],
    anecdotes: []
  },

  // 杨波教授
  yangbo: {
    id: 'yangbo',
    name: '杨波',
    subtitle: '成都理工大学教授 · 虚拟仿真专家',
    image: xuqiangImg,
    keyTags: ['虚拟仿真', 'AI', '数字教育'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学计算机与信息科学学院教授',
        importance: 'medium'
      },
      {
        year: '荣誉',
        title: '教学成果奖',
        description: '获教育部教学成果奖',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>杨波，成都理工大学计算机与信息科学学院教授，人工智能与虚拟仿真技术专家。主导研发"虚拟地质教学仿真系统"，实现地质实践教学的数字化转型，获教育部教学成果奖。杨波倡导"虚拟空间中的科学学习"，将AI与3D引擎结合，打造沉浸式学习环境，推动学校信息化教学体系创新。他代表了成理数字教育领域的前沿探索方向。</p>
        `,
        tags: ['数字化转型', '前沿探索'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '郭婷婷',
        type: 'colleague',
        relation: '同事',
        description: '艺术与传媒学院同事'
      },
      {
        id: 'r2',
        name: '刘方',
        type: 'colleague',
        relation: '同事',
        description: '艺术与传媒学院同事'
      },
      {
        id: 'r3',
        name: '宋洁',
        type: 'colleague',
        relation: '同事',
        description: '数字人文相关领域同事'
      }
    ],
    anecdotes: []
  },

  // 李茜副教授
  liqian: {
    id: 'liqian',
    name: '李茜',
    subtitle: '成都理工大学副教授 · 空间交互设计专家',
    image: xuqiangImg,
    keyTags: ['空间交互', '数字叙事', '青年代表'],
    
    timeline: [
      {
        year: '任职',
        title: '任副教授',
        description: '担任成都理工大学艺术与传媒学院副教授',
        importance: 'medium'
      },
      {
        year: '荣誉',
        title: '省设计奖项',
        description: '多次获四川省设计奖项',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>李茜，成都理工大学艺术与传媒学院副教授，数字叙事与空间交互设计专家。主导设计"成都理工大学虚拟校园漫游系统"，以交互叙事重现校史文化与人物故事。她的设计理念注重"情感空间"与"体验记忆"，为校史展示带来新形式。李茜的作品多次获四川省设计奖项，是学校"数字文化+艺术创新"方向的青年代表人物。</p>
        `,
        tags: ['情感设计', '青年人才'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r2',
        name: '黄润秋',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事'
      },
      {
        id: 'r3',
        name: '张倬元',
        type: 'teacher',
        relation: '老师',
        description: '成都理工大学老师'
      },
      {
        id: 'r4',
        name: '杨洪',
        type: 'colleague',
        relation: '同事',
        description: '地质工程学院同事'
      },
      {
        id: 'r5',
        name: '张涛',
        type: 'colleague',
        relation: '同事',
        description: '地质工程学院同事'
      }
    ],
    anecdotes: []
  },

  // 王志强教授
  wangzhiqiang: {
    id: 'wangzhiqiang',
    name: '王志强',
    subtitle: '成都理工大学教授 · 应急技术专家',
    image: xuqiangImg,
    keyTags: ['应急技术', '决策支持', '科技成果落地'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学地质工程学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '应急决策系统',
        description: '开发地质灾害应急决策支持系统',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>王志强，成都理工大学地质工程学院教授，地质灾害监测与应急技术专家。他开发的"地质灾害应急决策支持系统"在四川、贵州等地投入实际使用，有效提升灾害处置效率。王志强主持国家重点实验室课题，推动地质灾害防控与信息化结合。他注重技术实用化转化，推动校企合作，被誉为"成理科技成果落地的实践者"。</p>
        `,
        tags: ['校企合作', '成果落地'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '张国权',
        type: 'colleague',
        relation: '同事',
        description: '外国语学院同事'
      },
      {
        id: 'r2',
        name: '陈静',
        type: 'colleague',
        relation: '同事',
        description: '人文社科相关领域同事'
      },
      {
        id: 'r3',
        name: '宋洁',
        type: 'colleague',
        relation: '同事',
        description: '人文社科相关领域同事'
      }
    ],
    anecdotes: []
  },

  // 赵慧教授
  zhaohui: {
    id: 'zhaohui',
    name: '赵慧',
    subtitle: '成都理工大学教授 · 科技英语专家',
    image: xuqiangImg,
    keyTags: ['科技英语', '国际传播', '学术交流'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学外国语学院教授',
        importance: 'medium'
      },
      {
        year: '贡献',
        title: '教育部项目',
        description: '主持教育部项目',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>赵慧，成都理工大学外国语学院教授，科技英语与国际传播专家。她致力于科学传播语言研究，主持教育部项目《科技话语的跨文化传播机制》。赵慧推动成理地学科研成果的国际表达，编撰多部中英文地学出版物，提升学校学术国际影响力。她以语言为桥梁，促进成理科研成果走向世界，是"学术国际传播"的核心人物。</p>
        `,
        tags: ['国际传播', '学术桥梁'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '陈运泰',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r2',
        name: '陈俊',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r3',
        name: '李雪梅',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r4',
        name: '周莹',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      },
      {
        id: 'r5',
        name: '赵成',
        type: 'colleague',
        relation: '同事',
        description: '地球物理学院同事'
      }
    ],
    anecdotes: []
  },

  // 陈勇教授
  chenyong: {
    id: 'chenyong',
    name: '陈勇',
    subtitle: '成都理工大学教授 · 地震灾害模拟专家',
    image: xuqiangImg,
    keyTags: ['地震灾害模拟', '应急系统', '科学传播'],
    
    timeline: [
      {
        year: '任职',
        title: '任教授',
        description: '担任成都理工大学地球物理学院教授、博士生导师',
        importance: 'medium'
      },
      {
        year: '荣誉',
        title: '专家组成员',
        description: '中国地震灾害风险评估专家组成员',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '科研成就',
        content: `
          <p>陈勇，成都理工大学地球物理学院教授、博士生导师，地震灾害模拟与应急系统设计专家。他提出"地震波传播的实时可视化模拟框架"，应用于应急预案与教育训练系统。陈勇主持国家自然科学基金项目，是中国地震灾害风险评估专家组成员之一。他推动地震科学可视化教育平台建设，倡导科研成果服务社会公众，是成理科学传播与应急教育的代表人物。</p>
        `,
        tags: ['科学传播', '应急教育'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    relationships: [
      {
        id: 'r1',
        name: '杨波',
        type: 'colleague',
        relation: '同事',
        description: '计算机与信息科学学院同事'
      },
      {
        id: 'r2',
        name: '刘方',
        type: 'colleague',
        relation: '同事',
        description: '数字技术相关领域同事'
      }
    ],
    anecdotes: []
  },

  // 建校初期八大教授系列
  // 张言森教授
  yuanxiangjun: {
    id: 'yuanxiangjun',
    name: '袁向军',
    subtitle: '成都理工大学教授 · 其他国家院士',
    image: xuqiangImg,
    keyTags: ['其他国家院士', '成都理工大学', '教授'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，获得其他国家院士称号',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>袁向军教授是成都理工大学教授，获得其他国家院士称号，为学校的学科建设和人才培养做出了重要贡献。</p>
          <p>作为其他国家院士，袁向军教授在相关学科领域具有深厚的学术造诣和重要的学术影响力，为成都理工大学的发展贡献了力量。</p>
        `,
        tags: ['学术成就', '国际影响'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '李天斌',
        type: 'colleague',
        relation: '同事',
        description: '同为成都理工大学其他国家院士'
      }
    ],
    
    anecdotes: []
  },

  // 李天斌院士 - 其他国家院士
  liuyun: {
    id: 'liuyun',
    name: '刘耘',
    subtitle: '成都理工大学教授 · 国家杰青 · 百千万人才工程国家级人选',
    image: xuqiangImg,
    keyTags: ['国家杰青', '百千万人才工程国家级人选', '地球物理', '成都理工大学'],
    
    timeline: [
      {
        year: '任职',
        title: '担任成都理工大学教授',
        description: '担任成都理工大学教授，获得国家杰出青年科学基金',
        importance: 'high'
      }
    ],
    
    biography: [
      {
        title: '学术成就',
        content: `
          <p>刘耘教授是成都理工大学教授，国家杰出青年科学基金获得者，百千万人才工程国家级人选。</p>
          <p>主要从事地球物理勘探技术研究，在相关领域取得了重要研究成果，为学校的学科建设和人才培养做出了重要贡献。</p>
        `,
        tags: ['学术成就', '地球物理'],
        mediaType: 'image',
        mediaUrl: xuqiangImg
      }
    ],
    
    achievements: [],
    videos: [],
    audios: [],
    vrScenes: [],
    
    relationships: [
      {
        id: 'r1',
        name: '许强',
        type: 'colleague',
        relation: '同事',
        description: '成都理工大学同事，同为国家级人才'
      }
    ],
    
    anecdotes: []
  },

  // 范宣梅教授 - 国家杰青、百千万人才工程国家级人选
};

/**
 * 根据ID获取人物高级版详情数据
 */
export function getPersonDetailAdvancedById(personId) {
  return personsDetailDataAdvanced[personId] || null;
}

/**
 * 获取所有人物列表（高级版）
 */
export function getAllPersonsAdvancedList() {
  return Object.values(personsDetailDataAdvanced).map(person => ({
    id: person.id,
    name: person.name,
    subtitle: person.subtitle,
    image: person.image,
    keyTags: person.keyTags
  }));
}

