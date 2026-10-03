import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Sparkles, 
  Camera, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2, 
  Circle,
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown,
  MapPin,
  ExternalLink,
  Clock,
  Eye,
  Search,
  Lightbulb,
  Building2,
  Navigation
} from 'lucide-react';
import { getGoogleMapsUrl } from './ItineraryTimeline';

// Import high-resolution travel photography assets
import gizaImg from '../assets/images/giza_pyramid_guide_1791032623827.jpg';
import gemImg from '../assets/images/gem_museum_grand_1791032635151.jpg';
import luxorWestImg from '../assets/images/luxor_west_bank_1791032646440.jpg';
import luxorEastImg from '../assets/images/luxor_karnak_temple_1791032659899.jpg';
import cairoCityImg from '../assets/images/cairo_citadel_mosque_1791032671268.jpg';

export type TourZone = 'GIZA' | 'GEM' | 'LUXOR_WEST' | 'LUXOR_EAST' | 'CAIRO_CITY' | 'SYMBOLS';

interface SpotGuide {
  id: string;
  stepNumber: number;
  spotName: string;
  spotQuery: string;
  subtitle: string;
  officialHistory: string[];
  storyAndLore: string[];
  photoSpot: string;
  practicalTip: string;
  badge?: string;
}

interface TourGuideSection {
  zone: TourZone;
  tabLabel: string;
  emoji: string;
  title: string;
  theme: string;
  heroImage: string;
  heroQuote: string;
  recommendedDuration: string;
  bestTime: string;
  ticketSummary: string;
  routeSummary: string;
  mapsQuery: string;
  overviewDesc: string;
  spots: SpotGuide[];
  keyTips: {
    title: string;
    desc: string;
    type: 'ALERT' | 'TIP' | 'CULTURE';
  }[];
}

const TOUR_GUIDES: TourGuideSection[] = [
  // 1. 기자 피라미드 & 스핑크스
  {
    zone: 'GIZA',
    tabLabel: '기자 피라미드',
    emoji: '🏜️',
    title: '기자 피라미드 & 대스핑크스 셀프투어',
    theme: '영원불멸을 꿈꾼 고대 고왕국 파라오들의 거대한 우주와 나일강의 기적',
    heroImage: gizaImg,
    heroQuote: '"인간은 시간을 두려워하고, 시간은 피라미드를 두려워한다." — 아랍 속담',
    recommendedDuration: '3.5 ~ 4시간 소요',
    bestTime: '아침 07:30 ~ 09:00 (단체 관광객 및 한낮 폭염 이전)',
    ticketSummary: '1인 700 EGP (카드 전용) + 내부 셔틀 전동카트 700 EGP',
    routeSummary: '메나하우스 북쪽 게이트 ➔ 쿠푸 대피라미드 ➔ 카프레 & 멘카우레 ➔ 9개 피라미드 파노라마 뷰 ➔ 대스핑크스 & 계곡신전 ➔ 스핑크스 뷰 피자헛 루프탑',
    mapsQuery: 'Giza Necropolis, Al Haram',
    overviewDesc: '기원전 2560년경 세워진 고대 세계 7대 불가사의 중 유일하게 현존하는 유적입니다. 단순한 무덤을 넘어 파라오가 오시리스와 태양신 라에게 도달하는 거대한 사다리이자, 나일강 범람기 백성들을 구제한 고대 복지 공공근로의 상징입니다.',
    keyTips: [
      {
        title: '셔틀 전동카트(700 EGP) 필수 활용',
        desc: '쿠푸 피라미드 뒤편에서 사막 안쪽 9개 피라미드 파노라마 뷰포인트까지 걸어가면 편도 25분 이상 모래바람을 맞아야 합니다. 셔틀 카트를 타면 5분 만에 시원하게 이동하며 체력을 아낄 수 있습니다.',
        type: 'TIP',
      },
      {
        title: '호객꾼 100% 원천 차단 아랍어',
        desc: '"무료로 사진 찍어준다", "티켓 검사원이다", "낙타 타봐라"며 다가오는 삐끼에게는 눈을 마주치지 말고 단호하고 나직하게 "라, 슈크란!(No thank you)"을 말하며 멈추지 말고 직진하세요.',
        type: 'ALERT',
      },
      {
        title: '피라미드 내부 입장(900 EGP)에 대한 솔직한 사견',
        desc: '쿠푸 피라미드 내부는 벽화가 전혀 없고 텅 빈 화강암 석관 하나뿐입니다. 좁고 가파른 1m 높이의 나무 경사로를 허리 굽혀 30분 동안 기어 올라가야 하므로, 무릎이 안 좋거나 밀실공포증이 있다면 밖에서 압도적인 외관을 음미하는 것이 훨씬 만족스럽습니다.',
        type: 'CULTURE',
      },
    ],
    spots: [
      {
        id: 'giza-spot-1',
        stepNumber: 1,
        spotName: '북쪽 게이트 진입 & 메나 하우스 뷰',
        spotQuery: 'Marriott Mena House, Cairo',
        subtitle: '피라미드가 눈앞에 솟아오르는 환상적인 입구',
        officialHistory: [
          '메리어트 메나 하우스 바로 옆 북쪽 게이트(Ticket Office)는 단체 대형 버스가 진입하는 동쪽 스핑크스 게이트보다 상대적으로 대기 줄이 짧고 쾌적합니다.',
          '매표소에서 1인 700 EGP를 오직 비자/마스터 신용카드로 결제 후 보안 검색대를 통과합니다.',
        ],
        storyAndLore: [
          '메나 하우스는 1869년 수에즈 운하 개통식에 참석한 프랑스 외제니 황후의 사냥용 별장으로 지어졌습니다. 처칠과 루스벨트, 장제스가 모여 카이로 선언을 발표한 역사적인 궁전이기도 합니다.',
          '아침 일찍 호텔에서 나와 피라미드를 향해 걸어 올라갈 때 햇살을 받으며 우뚝 서 있는 석회암의 위용은 평생 잊지 못할 전율을 선사합니다.',
        ],
        photoSpot: '매표소 통과 직후 완만한 오르막길에서 쿠푸 피라미드 거대한 모서리를 올려다보며 전신샷 촬영.',
        practicalTip: '물 1리터와 선글라스, 양산을 가방에서 미리 꺼내두세요. 게이트를 넘어서면 그늘이 거의 없습니다.',
        badge: '출발 포인트',
      },
      {
        id: 'giza-spot-2',
        stepNumber: 2,
        spotName: '쿠푸 대피라미드 (Great Pyramid of Khufu)',
        spotQuery: 'The Great Pyramid of Giza',
        subtitle: '230만 개 거석으로 쌓아 올린 고대 공학의 정점',
        officialHistory: [
          '기원전 2560년경 고왕국 제4왕조의 쿠푸(Khufu) 파라오를 위해 20년에 걸쳐 건립되었습니다.',
          '평균 2.5톤에 달하는 석회암 블록 약 230만 개가 사용되었으며, 원래 높이는 146.6m(현재 풍화로 138.8m)로 1311년 영국 링컨 대성당이 지어지기 전까지 3,800년 동안 인류가 만든 최고(Highest)의 건축물이었습니다.',
          '피라미드의 네 변은 오차 4분(0.06도) 이내로 정확하게 동서남북 진북을 가리키고 있습니다.',
        ],
        storyAndLore: [
          '★[역사 다시보기: 노예 노동설의 진실] 오랫동안 헤로도토스의 기록과 할리우드 영화 때문에 10만 명의 노예가 채찍을 맞으며 지었다고 알려졌으나, 1990년대 피라미드 노동자 거주지 발굴로 완전히 뒤집혔습니다. 노동자들은 맥주와 양질의 소고기, 양파와 마늘을 배급받았고, 결근 사유에 "아내 생일", "친구 미라 제작 돕기", "숙취" 등이 적힌 오스트라콘(토기 조각)이 출토되었습니다. 사실상 나일강 범람기(7~10월)에 농사를 지을 수 없던 농민들에게 일자리와 식량을 나누어준 국가 차원의 고대 뉴딜 복지 프로젝트였습니다.',
          '★[백색 외벽의 비밀] 원래 피라미드는 눈이 부시게 하얀 투라(Tura) 백색 석회암 마감재(Casing Stone)로 매끄럽게 덮여 있어 사막 한가운데서 거대한 거울처럼 빛났습니다. 그러나 1303년 카이로 대지진 때 떨어진 돌들을 카이로 술탄들이 성벽과 모스크를 짓는 데 뜯어가면서 현재의 울퉁불퉁한 계단형 블록이 노출되었습니다.',
        ],
        photoSpot: '피라미드 북서쪽 모퉁이의 거대한 기초 블록(성인 키보다 큼) 위에 살짝 손을 얹고 올려다보는 광각 앵글.',
        practicalTip: '외벽 돌을 함부로 기어오르는 것은 엄격히 금지되어 있으며 벌금이 부과됩니다. 지정된 지상 통로에서만 관람하세요.',
        badge: '세계 7대 불가사의',
      },
      {
        id: 'giza-spot-3',
        stepNumber: 3,
        spotName: '카프레 피라미드 & 멘카우레 피라미드',
        spotQuery: 'Pyramid of Khafre',
        subtitle: '꼭대기 모자가 남아있는 카프레와 아담한 멘카우레',
        officialHistory: [
          '카프레(Khafre, 쿠푸의 아들) 피라미드는 높이 136.4m로 쿠푸보다 3m 낮지만, 10m 더 높은 암반 지대 위에 지어져 시각적으로는 대피라미드보다 더 높아 보입니다.',
          '피라미드 꼭대기 약 45m 구간에는 도굴꾼들이 뜯어가지 못한 원래의 백색 매끄러운 카싱 스톤이 모자처럼 고스란히 남아있습니다.',
          '멘카우레(Menkaure) 피라미드는 65m로 셋 중 가장 작지만, 하단부는 단단하고 귀한 아스완 붉은 화강암으로 마감되었습니다.',
        ],
        storyAndLore: [
          '카프레는 아버지 쿠푸를 존경하면서도 자신을 돋보이게 하려고 지반이 높은 곳을 골라 경사각(53도)을 아버지 것(51도)보다 가파르게 설계하는 영리함을 발휘했습니다.',
          '멘카우레 피라미드 북쪽 면에 세로로 길게 파인 흉터는 12세기 살라딘의 아들인 술탄 알아지즈가 피라미드를 완전히 파괴하려고 8개월간 군사를 동원해 돌을 깼으나, 돌이 너무 무겁고 단단해 하루에 돌 1~2개 빼는 데 그치고 결국 국고만 탕진한 채 포기한 역사의 상흔입니다.',
        ],
        photoSpot: '쿠푸와 카프레 피라미드 사이의 도로변에서 카프레의 꼭대기 모자 마감재가 선명하게 보이는 구도로 촬영.',
        practicalTip: '이 구간에서 낙타 몰이꾼들이 가장 집요하게 접근합니다. 스마트폰을 꺼내 낙타를 찍으면 돈을 요구하니 주의하세요.',
      },
      {
        id: 'giza-spot-4',
        stepNumber: 4,
        spotName: '사막 9대 피라미드 파노라마 뷰포인트',
        spotQuery: 'Giza Plateau Panorama view point',
        subtitle: '지평선 위로 일렬로 늘어선 피라미드 군락의 절경',
        officialHistory: [
          '기자 고원 서쪽 사막 언덕 위에 위치하며, 쿠푸, 카프레, 멘카우레 대피라미드 3기와 왕비들의 작은 위성 피라미드 6기까지 총 9기가 한눈에 펼쳐지는 명소입니다.',
          '내부 전동 셔틀 카트가 정차하는 핵심 포인트입니다.',
        ],
        storyAndLore: [
          '사막 지평선 위로 끝없이 펼쳐지는 모래 언덕과 수천 년 전 피라미드가 오버랩되며 마치 타임머신을 타고 과거로 온 듯한 고요한 웅장함을 느낄 수 있습니다.',
          '현대 문명의 빌딩들이 전혀 보이지 않고 순수한 사막과 피라미드만 앵글에 담을 수 있는 유일한 장소입니다.',
        ],
        photoSpot: '손가락 끝으로 피라미드 꼭대기를 집어 올리는 착시 사진, 지평선을 배경으로 한 커플 전신 실루엣 샷.',
        practicalTip: '셔틀 카트 기사에게 10~15분 사진 촬영 시간을 달라고 하고 둘러보세요. 모래바람이 부니 카메라 렌즈 캡을 챙기세요.',
        badge: '인생샷 스팟',
      },
      {
        id: 'giza-spot-5',
        stepNumber: 5,
        spotName: '대스핑크스 & 계곡 신전 (Great Sphinx & Valley Temple)',
        spotQuery: 'Great Sphinx of Giza',
        subtitle: '사자의 몸과 파라오의 얼굴을 한 4,500년의 수호자',
        officialHistory: [
          '단일 석회암 암반을 깎아 만든 길이 73m, 높이 20m의 세계 최대 조각상입니다. 카프레 피라미드로 이어지는 참배로 입구를 지키고 있습니다.',
          '스핑크스 바로 앞의 계곡 신전(Valley Temple)은 파라오의 시신을 미라로 방부 처리하고 개구 의식(입을 열어 영혼을 불어넣는 의식)을 거행하던 신성한 석조 건물입니다.',
        ],
        storyAndLore: [
          '★[스핑크스 코의 진실: 나폴레옹 범인설의 거짓] 흔히 나폴레옹 군대가 대포 사격 연습으로 스핑크스의 코를 부쉈다는 이야기가 퍼져있지만 거짓입니다. 나폴레옹이 이집트에 오기 60년 전인 1737년 덴마크 화가 노르덴의 스케치에도 이미 코가 깨져 있었습니다. 15세기 아랍 역사가 알 마크리지의 기록에 따르면, 현지 농민들이 풍작을 기원하며 스핑크스에게 제물을 바치자, 이슬람 수피파 극단주의자 무함마드 사임 알다흐르가 "우상숭배를 멈추라"며 1378년 정으로 깎아 파괴했습니다.',
          '★[앞발 사이의 꿈의 비석(Dream Stele)] 스핑크스의 두 앞발 사이에는 높이 3.6m의 화강암 비석이 서 있습니다. 기원전 1400년경 투트모세 4세가 왕자 시절 사막에서 사냥하다가 지쳐 모래에 목만 나와 있던 스핑크스 그늘 아래서 낮잠을 잤는데, 스핑크스가 꿈에 나타나 "내 몸을 덮고 있는 모래를 파내주면 너를 파라오로 만들어주겠다"고 약속했고, 그가 모래를 치우자 실제로 왕위에 올랐다는 흥미로운 정치적 정통성 스토리입니다.',
        ],
        photoSpot: '스핑크스 오른쪽 관람 데크에서 옆모습과 원근감을 맞춰 스핑크스와 코를 맞대거나 입술을 맞추는 키스 샷.',
        practicalTip: '스핑크스 앞 데크는 단체 관광객이 몰려 붐빕니다. 데크 중간쯤에서 계곡 신전 돌기둥을 프레임 삼아 찍으면 훨씬 감각적입니다.',
      },
      {
        id: 'giza-spot-6',
        stepNumber: 6,
        spotName: '스핑크스 뷰 피자헛 루프탑 (Pizza Hut Giza)',
        spotQuery: 'Pizza Hut Giza',
        subtitle: '세상에서 가장 호사스러운 뷰를 자랑하는 피자 한 조각',
        officialHistory: [
          '스핑크스 동쪽 출구 바로 정면에 위치한 건물 3층 테라스입니다.',
          '전 세계 배낭여행자와 인플루언서들이 "인류 최고의 뷰를 가진 패스트푸드점"으로 손꼽는 명소입니다.',
        ],
        storyAndLore: [
          '수천 년 고대 유적 바로 맞은편에 21세기 자본주의의 상징 피자헛이 있다는 유쾌한 역설! 땀을 흠뻑 흘리고 시원한 에어컨 바람 아래 얼음 콜라와 피자를 먹으며 눈앞에 우뚝 솟은 스핑크스를 바라보는 감흥은 특별한 휴식을 줍니다.',
        ],
        photoSpot: '3층 테라스 창가에 피자 한 조각을 들고 스핑크스와 피라미드를 배경으로 건배하는 위트 있는 샷.',
        practicalTip: '주문 후 3층이나 옥상 루프탑 테라스 자리로 바로 올라가 창가 자리를 선점하세요. (2인 세트 약 450 EGP)',
        badge: '점심 & 힐링',
      },
    ],
  },

  // 2. GEM 대박물관
  {
    zone: 'GEM',
    tabLabel: 'GEM 대박물관',
    emoji: '🏛️',
    title: 'GEM 이집트 대박물관 (Grand Egyptian Museum)',
    theme: '20년 만에 인류 앞에 공개된 1조 원 규모의 세계 최대 고고학 보물창고',
    heroImage: gemImg,
    heroQuote: '"투탕카멘의 무덤 속으로 촛불을 들이밀자... 예, 믿을 수 없이 경이로운 것들이 보입니다!" — 하워드 카터 (1922년 발굴 당시)',
    recommendedDuration: '2.5 ~ 3.5시간 소요',
    bestTime: '오후 13:00 ~ 15:00 타임 (사전 온라인 예매 필수)',
    ticketSummary: '1인 1,590 EGP (공식 사이트 온라인 신용카드 예매)',
    routeSummary: '람세스 2세 공중 오벨리스크 광장 ➔ 1단계: 아트리움 11m 람세스 거대 석상 ➔ 2단계: 그랜드 스테어케이스 (대계단 64점) ➔ 3단계: 12개 메인 갤러리 ➔ 4단계: 투탕카멘 5천 점 전관 갤러리 ➔ 피라미드 축선 뷰 테라스',
    mapsQuery: 'Grand Egyptian Museum, Al Remayah',
    overviewDesc: '기존 타흐리르 박물관의 협소함을 극복하기 위해 20년의 공사와 1조 원 이상의 예산을 투입해 완공한 현대 건축의 기적입니다. 피라미드와 정확히 일치하는 기하학적 축선과 투탕카멘의 유물 5,000여 점을 사상 최초로 한자리에 모은 인류 최고의 문화유산 공간입니다.',
    keyTips: [
      {
        title: '반드시 사전 온라인 예매 (1-3시 타임 권장)',
        desc: '현장 티켓 창구에서는 당일 발권이 불가능하거나 조기 매진됩니다. 공식 웹사이트에서 미리 카드로 예매한 모바일 바코드를 준비하세요.',
        type: 'ALERT',
      },
      {
        title: '실내 에어컨 가디건/셔츠 지참',
        desc: '유물 보존을 위해 초대형 중앙 냉방 시스템이 가동되어 실내 온도가 20도 안팎으로 유지됩니다. 바깥 사막 더위에 맞춰 반팔만 입고 가면 1시간 뒤 으슬으슬 추워질 수 있습니다.',
        type: 'TIP',
      },
      {
        title: '대계단(Grand Staircase) 관람 요령',
        desc: '올라갈 때는 에스컬레이터를 타고 편안하게 올라가며 조각상들의 눈높이와 뒤태를 입체적으로 감상하고, 내려올 때 완만한 중앙 계단을 걸으며 테마별로 디테일을 확인하세요.',
        type: 'TIP',
      },
    ],
    spots: [
      {
        id: 'gem-spot-1',
        stepNumber: 1,
        spotName: '공중 오벨리스크 (Hanging Obelisk) 광장',
        spotQuery: 'Grand Egyptian Museum Hanging Obelisk',
        subtitle: '세계 최초로 공중에 띄워 밑바닥 카르투슈를 보는 오벨리스크',
        officialHistory: [
          'GEM 입구 광장에 세워진 람세스 2세의 화강암 오벨리스크입니다.',
          '네 개의 기둥으로 오벨리스크를 공중에 띄우고 그 아래로 관람객이 걸어 들어갈 수 있도록 설계되었습니다.',
        ],
        storyAndLore: [
          '오벨리스크를 세울 때 바닥에 숨겨져 3천 년 동안 아무도 보지 못했던 람세스 2세의 공식 카르투슈(이름 도장)를 오벨리스크 바로 아래 강화유리 바닥을 통해 올려다볼 수 있게 만든 기발한 현대 건축의 아이디어입니다.',
        ],
        photoSpot: '오벨리스크 밑으로 들어가 고개를 들고 바닥의 카르투슈를 배경으로 찍는 셀카.',
        practicalTip: '박물관 정문 보안 검색을 통과하기 전 광장에 위치하므로 입장 전후로 여유롭게 둘러보세요.',
        badge: '시작 포인트',
      },
      {
        id: 'gem-spot-2',
        stepNumber: 2,
        spotName: '아트리움 & 람세스 2세 거대 석상 (Colossus of Ramesses II)',
        spotQuery: 'Grand Egyptian Museum Atrium Ramesses II',
        subtitle: '3,200년 된 11m, 83톤의 붉은 화강암 파라오 입상',
        officialHistory: [
          '기원전 1200년대 신왕국 전성기를 이끈 람세스 2세의 거대한 붉은 화강암 조각상입니다.',
          '높이 11m, 무게 83톤에 달하며 원래 멤피스의 프타 신전 입구에 누워있던 것을 1954년 카이로 시내 람세스 기차역 광장에 세웠다가, 2006년 이곳으로 이전했습니다.',
        ],
        storyAndLore: [
          '★[83톤 석상의 밤샘 이사 드라마] 카이로 시내 매연과 지하철 진동으로 석상이 손상되자, 이집트 정부는 석상을 옮기기로 결정했습니다. 특수 제작된 트레일러에 실려 군악대의 연주와 전 국민의 생중계 속에 시속 5km로 밤새 카이로 시내를 행진했습니다. 박물관 건물을 짓기 전에 먼저 석상을 들여놓고, 그 주변으로 박물관 벽과 천장을 지어 올렸다는 놀라운 건축 비화가 있습니다.',
        ],
        photoSpot: '석상 정면 아래에서 광각으로 올려다보며 파라오의 근엄한 미소와 높은 천장 채광창을 함께 담기.',
        practicalTip: '조각상 옆에는 기둥에 새겨진 메르넵타(람세스 2세의 아들)의 전승비도 함께 있으니 함께 확인하세요.',
      },
      {
        id: 'gem-spot-3',
        stepNumber: 3,
        spotName: '그랜드 스테어케이스 (The Grand Staircase)',
        spotQuery: 'Grand Egyptian Museum Grand Staircase',
        subtitle: '고대 이집트 64점의 걸작 조각상이 늘어선 계단식 연대기',
        officialHistory: [
          '아트리움에서 메인 전시실로 이어지는 6층 높이의 웅장한 계단길입니다.',
          '총 4개 테마(1. 파라오의 왕권과 형상, 2. 신들의 처소와 신전 건축, 3. 신과 왕의 영적 결합, 4. 사후세계와 영생의 석관)로 구성되어 64점의 기념비적 조각상이 시대순으로 배치되어 있습니다.',
        ],
        storyAndLore: [
          '계단을 한 걸음씩 오를 때마다 고대 파라오와 신들이 계단 옆에서 관람객을 내려다보는 듯한 신성한 시선 처리가 압권입니다.',
          '계단의 최정상에 다다르면 거대한 통유리벽 너머로 2km 밖의 기자 피라미드가 정확한 축선(Axis)으로 눈앞에 펼쳐지는 드라마틱한 건축적 클라이맥스를 맞이합니다.',
        ],
        photoSpot: '계단 중간에서 아래쪽 아트리움과 위쪽 조각상들의 사선 구도를 살려 촬영.',
        practicalTip: '양옆에 설치된 무빙워크/에스컬레이터를 타고 올라가면 체력 소모 없이 감상할 수 있습니다.',
        badge: '건축의 정점',
      },
      {
        id: 'gem-spot-4',
        stepNumber: 4,
        spotName: '투탕카멘 갤러리 (Tutankhamun Gallery)',
        spotQuery: 'Grand Egyptian Museum Tutankhamun Gallery',
        subtitle: '1922년 발굴된 5,000여 점의 소년왕 보물 전관 최초 공개',
        officialHistory: [
          '18세에 요절한 제18왕조 소년 파라오 투탕카멘(기원전 1332~1323년경)의 무덤에서 출토된 5,398점의 보물이 역사상 최초로 100% 한 전시관에 집대성되었습니다.',
          '11kg의 순금 황금 마스크, 110kg 순금 안쪽 관, 황금 옥좌, 4채의 금박 목조 사당, 왕의 전차와 샌들까지 온전히 보존되어 있습니다.',
        ],
        storyAndLore: [
          '★[왜 투탕카멘만 털리지 않았을까?] 투탕카멘은 재위 기간이 짧고 업적이 적어 후대 파라오들의 관심 밖이었고, 훗날 람세스 6세의 무덤을 파면서 나온 흙더미가 투탕카멘 무덤 입구를 완전히 덮어버렸습니다. 3,300년 동안 완벽히 봉인된 덕분에 유일하게 도굴을 피한 파라오가 되었습니다. 가장 무명했던 파라오가 현대에 와서 가장 유명한 파라오가 된 역사의 거대한 아이러니!',
          '★[황금 마스크의 아우라] 실물 황금 마스크를 마주하면 수천 년 세월에도 한 치의 녹이나 변색 없이 방금 만든 것처럼 영롱하게 반짝이는 금빛과 라피스 라줄리(청금석)의 푸른빛에 숨이 멎을 듯한 감동을 줍니다.',
        ],
        photoSpot: '투탕카멘 황금 옥좌(사자 발과 부부애가 담긴 등받이 부조)와 황금 마스크 쇼케이스 앞.',
        practicalTip: '황금 마스크와 순금 관 앞은 대기 줄이 길 수 있으니, 입장 직후 투탕카멘 관부터 먼저 둘러보는 역주행 코스를 추천합니다.',
        badge: '하이라이트',
      },
      {
        id: 'gem-spot-5',
        stepNumber: 5,
        spotName: '피라미드 파노라마 테라스 & 뮤지엄 샵',
        spotQuery: 'Grand Egyptian Museum View of Pyramids',
        subtitle: '통유리창 너머로 실제 기자 피라미드를 품은 휴식처',
        officialHistory: [
          '박물관 옥상 테라스 및 통유리 라운지에서는 기자의 대피라미드 3기가 정확한 대각선 시야로 감상되도록 지형이 계산되었습니다.',
        ],
        storyAndLore: [
          '박물관 안에서 고대 유물들을 감상한 뒤, 창밖으로 실제 4,500년 된 피라미드를 바라보며 커피를 마시는 경험은 현대와 고대가 하나로 연결되는 마법 같은 순간입니다.',
        ],
        photoSpot: '피라미드 뷰 테라스 창문 앞에서 라떼 잔을 들고 피라미드를 응시하는 감성적인 뒷모습 샷.',
        practicalTip: '박물관 내부 카페(Ladurée 또는 로컬 카페)에서 시원한 음료를 마시며 다리를 쉬어가세요. 공식 기념품 샵의 파피루스 책갈피와 앙크 열쇠고리 퀄리티가 우수합니다.',
      },
    ],
  },

  // 3. 룩소르 서안 투어
  {
    zone: 'LUXOR_WEST',
    tabLabel: '룩소르 서안투어',
    emoji: '👑',
    title: '룩소르 서안 투어 (The West Bank of Luxor)',
    theme: '태양이 지는 사후세계, 절벽 지하 깊숙이 숨겨진 파라오들의 비밀 묘실',
    heroImage: luxorWestImg,
    heroQuote: '"오, 파라오여! 당신은 죽은 것이 아니라 영원한 태양과 함께 살아서 서쪽 지평선으로 가신 것입니다." — 피라미드 텍스트',
    recommendedDuration: '5.5 ~ 6.5시간 소요',
    bestTime: '새벽 06:30 ~ 11:30 (한낮 사막 기온 40도 폭염 이전)',
    ticketSummary: '왕가의 계곡(750 EGP) + 투탕카멘 무덤(700 EGP) + 하트셉수트(440 EGP) + 멤논의 거상(무료)',
    routeSummary: '멤논의 거상 ➔ 왕가의 계곡 (KV2, KV6, KV8 등 3개) ➔ 투탕카멘 묘실 (KV62) ➔ 하트셉수트 여왕 장제전 ➔ 메디넷 하부 신전 ➔ (선택) 라메세움',
    mapsQuery: 'Valley of the Kings, Luxor',
    overviewDesc: '나일강 서안은 고대 이집트인들에게 태양이 지고 죽은 자들이 안식하는 오시리스의 성지입니다. 도굴을 피하고자 거대한 피라미드를 포기하고 사막 바위 절벽 골짜기를 파고들어 만든 왕가의 계곡과 위대한 여성 파라오 하트셉수트의 테라스 장제전이 펼쳐집니다.',
    keyTips: [
      {
        title: '마일모아 족집게 팁: 새벽 6시 오픈 공략 & 룩소르 폭염 대비',
        desc: '룩소르는 카이로보다 훨씬 남쪽에 위치하여 한낮 기온이 5~10도 이상 높습니다(겨울 12월에도 반팔 필수). 서안 바위산은 그늘이 0%입니다. 대부분의 서안 유적지는 새벽 6시에 문을 열므로, 06:30~07:00에 도착해 11시 전 관람을 마치고 호텔 수영장으로 복귀하는 것이 고수들의 공통 정석입니다.',
        type: 'ALERT',
      },
      {
        title: '왕가의 계곡(KV) 무덤 선택 족보 & 특별 무덤 비교',
        desc: '기본 티켓(750 EGP)으로 3개 무덤을 봅니다: 1) KV2(람세스 4세 - 천장 누트 여신과 황금빛 천문도 천장), 2) KV6(람세스 9세 - 사자의 서 벽화 선명), 3) KV8(메르넵타 - 160m 깊이 화강암 대석관) 또는 KV11(람세스 3세 - 하프 연주자 벽화) 추천. 특별 유료 무덤 중에는 소년왕 실물 미라가 있는 KV62(투탕카멘 +700 EGP)가 필수입니다.',
        type: 'TIP',
      },
      {
        title: '하트셉수트 테라스: 푼트 원정대와 암소 귀 하토르',
        desc: '2층 테라스 남쪽 벽화에는 유향 나무 31그루를 화분에 뿌리째 담아 배로 실어와 신전 마당에 심은 인류 최초의 식물 원정 무역 기록(푼트 원정)과 암소 뿔을 가진 하토르 여신 기둥을 꼭 찾아보세요.',
        type: 'CULTURE',
      },
      {
        title: '무덤 내부 스마트폰 플래시 금지',
        desc: '3천 년 전 천연 광물과 식물 즙으로 칠한 벽화는 강한 인공 빛에 노출되면 색이 바랩니다. 스마트폰 촬영은 무료이지만 플래시는 엄격히 통제되니 카메라 설정을 미리 꺼두세요.',
        type: 'TIP',
      },
    ],
    spots: [
      {
        id: 'west-spot-1',
        stepNumber: 1,
        spotName: '멤논의 거상 (Colossi of Memnon)',
        spotQuery: 'Colossi of Memnon',
        subtitle: '새벽마다 신비로운 울음소리를 냈던 18m의 거상 쌍둥이',
        officialHistory: [
          '기원전 1350년경 제18왕조의 황금기를 이끈 아멘호테프 3세(투탕카멘의 할아버지)의 거대한 장제전 입구를 지키던 2기의 석상입니다.',
          '높이 18m, 무게 각 720톤에 달하는 거대한 규암(Quartzite) 단일 암석을 카이로 북쪽 채석장에서 600km 떨어진 룩소르까지 나일강 배로 운반해 세웠습니다.',
        ],
        storyAndLore: [
          '★[새벽에 노래하는 석상의 전설] 기원전 27년 대지진으로 북쪽 석상 상반신에 균열이 생겼는데, 그 후 매일 새벽 해가 뜰 무렵 이 석상에서 하프 줄이 끊어지는 듯한 애절한 휘파람 소리가 났습니다. 고대 그리스-로마인들은 트로이 전쟁의 영웅 멤논이 새벽의 여신(어머니 에오스)을 향해 아침 인사를 건네는 소리라고 믿고 로마 황제 하드리아누스 등 수많은 귀족이 소리를 들으러 성지순례를 왔습니다. 하지만 서기 199년 로마 황제 셉티미우스 세베루스가 석상을 보수하자 소리가 영원히 멈추어 버렸습니다. 실제로는 밤새 틈새에 맺힌 이슬이 아침 태양열에 증발하면서 수축과 팽창을 일으킨 음향 물리 현상이었습니다.',
        ],
        photoSpot: '거상 바로 앞 도로변 안전 펜스에 기대어 거인의 발끝과 하늘을 동시에 담는 수직 광각 샷.',
        practicalTip: '입장료가 무료이며 서안 투어 시작할 때 10~15분 들러 사진을 찍고 왕가의 계곡으로 향하기에 최적입니다.',
        badge: '무료 포토존',
      },
      {
        id: 'west-spot-2',
        stepNumber: 2,
        spotName: '왕가의 계곡 (Valley of the Kings)',
        spotQuery: 'Valley of the Kings, Luxor',
        subtitle: '천연 피라미드 산 아래 감춰진 파라오 63기의 지하 궁전',
        officialHistory: [
          '기원전 1500~1070년경 신왕국 제18~20왕조 파라오들이 묻힌 성스러운 계곡입니다.',
          '자연적으로 피라미드 모양을 띤 알 쿠른(Al-Qurn) 봉우리 아래 암반을 100m 이상 파고들어가 미로 같은 복도와 매장실을 만들고, 벽면 전체를 사후세계의 안내서인 <관문의 서>, <동굴의 서>, <사자의 서> 채색 부조로 가득 채웠습니다.',
          '기본 입장권(750 EGP)으로 당일 개방된 일반 무덤 중 3곳을 선택하여 관람할 수 있습니다. (전기 트램 20 EGP 별도)',
        ],
        storyAndLore: [
          '★[KV 번호의 유래] 무덤 번호 앞의 \'KV\'는 \'King\'s Valley(왕가의 계곡)\'의 약자입니다. 1827년 영국의 존 가드너 윌킨슨 경이 계곡을 조사하면서 입구에 붓과 페인트로 1번부터 번호를 매긴 것에서 유래했습니다.',
          '★[피라미드를 버리고 땅속으로 숨은 이유] 고왕국 시대의 거대한 피라미드는 도굴꾼들에게 "여기 금은보화가 가득하니 털어가시오"라고 외치는 거대한 간판과 같았습니다. 신왕국 파라오들은 도굴을 방지하기 위해 험준한 사막 계곡 지하 깊숙이 무덤을 파고 입구를 모래와 자갈로 완벽하게 위장했습니다. 비록 도굴꾼들의 끈질긴 추적에 대부분 털렸지만, 지하의 건조한 기후 덕분에 3천 년 전 천연 안료의 색채는 어제 칠한 것처럼 생생합니다.',
          '★[마일모아 추천 3대 일반 무덤 족보]:',
          '1) KV2 (람세스 4세): 입구와 가장 가깝고 경사가 완만하며, 천장에 펼쳐진 거대한 하늘의 여신 누트와 황금빛 천문도 천장이 숨 막히게 아름답습니다.',
          '2) KV6 (람세스 9세): 통로 폭이 넓고 시원하며, 사자의 서와 밤의 서 부조 벽화가 매우 선명합니다.',
          '3) KV8 (메르넵타): 람세스 2세의 13번째 아들로 깊이 160m를 깊숙이 파고 내려가는 웅장한 지하 통로와 거대한 화강암 석관이 압권입니다. (또는 KV11 람세스 3세: 하프 연주자 벽화와 무기/선박 벽화).',
          '★[참고: 특별 유료 무덤 3대장] KV9(람세스 5·6세, 완벽한 천문도 천장), KV17(세티 1세, 137m 최장 묘실과 최고 예술성), QV66(왕비의 계곡 네페르타리, 고대 이집트의 시스티나 성당).',
        ],
        photoSpot: '람세스 4세(KV2) 무덤 내부 천장 복도에서 황금빛 별들이 수놓아진 누트 여신 벽화를 올려다보며 촬영.',
        practicalTip: '무덤 입구에서 티켓 펀치를 뚫으므로 티켓을 잃어버리지 않게 잘 보관하세요. 매표소에서 전기 트램(Taf-Taf, 20 EGP) 티켓을 꼭 함께 구입하세요.',
        badge: '세계문화유산',
      },
      {
        id: 'west-spot-3',
        stepNumber: 3,
        spotName: '투탕카멘 무덤 (KV62 - Tutankhamun Tomb)',
        spotQuery: 'Tomb of Tutankhamun KV62',
        subtitle: '소년왕의 실물 미라가 아직도 잠들어 있는 기적의 공간',
        officialHistory: [
          '1922년 영국의 고고학자 하워드 카터가 발굴한 무덤으로, 거의 유일하게 도굴당하지 않은 온전한 상태로 발견되었습니다.',
          '별도의 추가 티켓(700 EGP)이 필요합니다.',
          '무덤 내 온도와 습도가 조절되는 특수 유리 케이스 안에 투탕카멘의 실제 미라가 안치되어 있습니다.',
        ],
        storyAndLore: [
          '무덤 내부는 왕의 명성에 비해 방이 4개뿐이고 벽화도 매장실 한 방에만 그려져 있어 소박합니다. 18세 어린 나이에 갑작스럽게 죽었기 때문에 70일간의 장례 기간 내에 급히 대신관 아이(Ay)를 위해 파두었던 작은 무덤을 개조했기 때문입니다.',
          '카터가 봉인된 문틈으로 촛불을 비추었을 때 황금빛 보물들이 가득 차 있던 그 자리에서, 지금은 흑갈색으로 마른 소년 파라오의 실제 얼굴과 발끝을 직접 마주하는 순간은 형언할 수 없는 전율을 줍니다.',
        ],
        photoSpot: '매장실 입구에서 투탕카멘 미라가 안치된 유리관과 벽면의 12마리 개코원숭이 부조를 함께 앵글에 담기.',
        practicalTip: '방이 좁아 한 번에 소수 인원만 들어가므로, 단체 관람객이 빠져나간 틈을 타 입장하세요.',
        badge: '실물 미라 영구 보존',
      },
      {
        id: 'west-spot-4',
        stepNumber: 4,
        spotName: '하트셉수트 여왕 장제전 (Temple of Hatshepsut)',
        spotQuery: 'Mortuary Temple of Hatshepsut',
        subtitle: '석회암 절벽과 완벽한 조화를 이루는 3단 테라스 고대 건축의 걸작',
        officialHistory: [
          '기원전 1470년경 이집트 역사상 가장 성공적인 여성 파라오 하트셉수트(Hatshepsut)를 위해 왕실 건축가 센무트(Senenmut)가 설계한 신전입니다.',
          '붉은 바위 절벽 데이르 엘 바하리(Deir el-Bahari)를 깎아 뒤편으로 품고 3단 테라스로 세워진 현대 건축미의 극치입니다.',
        ],
        storyAndLore: [
          '★[턱수염을 붙인 여왕 파라오] 하트셉수트는 남성 중심 사회에서 파라오의 정통성을 인정받기 위해 가짜 턱수염을 붙이고 남성 왕의 복장을 입었습니다. 또한 자신이 태양신 아문의 직접적인 딸이라고 선포했습니다.',
          '★[기록말살형(Damnatio Memoriae)의 비극] 그녀 사후 의붓아들이자 정복 군주인 투트모세 3세는 그녀의 모든 조각상을 부수고 벽화에서 하트셉수트의 이름(카르투슈)과 얼굴을 정으로 쪼아 지워버렸습니다. 그러나 오히려 벽을 둘러치거나 지우려 했던 흔적 덕분에 3,500년 뒤 역사학자들에게 그녀의 위대한 권력 투쟁이 더욱 생생히 밝혀졌습니다.',
          '★[2층 테라스: 푼트 원정대 무역 벽화] 여왕이 홍해를 건너 신비의 땅 푼트(Punt, 현재 소말리아 인근)로 원정대를 보내 유향 나무 31그루를 화분에 뿌리째 담아 배로 실어와 신전 앞마당에 심은 인류 최초의 식물 원정대 기록이 생생합니다. 비만형 체형을 가진 푼트 여왕의 독특한 모습과 암소 뿔을 가진 자애로운 하토르(Hathor) 여신 예배당 기둥을 꼭 찾아보세요.',
        ],
        photoSpot: '장제전 진입로 중앙 슬로프 아래에서 뒤편 병풍 같은 거대한 석회암 절벽과 3단 열주를 정면 대칭으로 담는 웅장한 샷.',
        practicalTip: '그늘이 전혀 없는 백색 대리석 바닥이 햇빛을 강하게 반사하므로 선글라스와 양산이 필수입니다.',
        badge: '절벽의 걸작',
      },
      {
        id: 'west-spot-5',
        stepNumber: 5,
        spotName: '메디넷 하부 신전 (Medinet Habu - 람세스 3세 장제전)',
        spotQuery: 'Medinet Habu, Luxor',
        subtitle: '바다 민족과의 대전투와 깊게 파인 채색 상형문자',
        officialHistory: [
          '신왕국 제20왕조의 마지막 위대한 파라오 람세스 3세의 거대한 요새형 장제전입니다.',
          '외벽에는 고대 지중해 세계를 붕괴시켰던 미스터리한 침략자 바다 민족(Sea Peoples)과의 대규모 육상 및 해상 전투 장면이 파노라마로 새겨져 있습니다.',
        ],
        storyAndLore: [
          '★[후대 왕들이 이름을 못 뺏게 만든 깊은 음각] 신전 기둥의 상형문자를 보면 손가락 두 마디 깊이(10~15cm)로 믿을 수 없을 만큼 깊게 파여 있습니다. 후대 파라오들이 자기 이름을 덧씌우거나 깎아내지 못하도록 람세스 3세가 일부러 엄청나게 깊게 파도록 명령했기 때문입니다. 그 덕분에 3천 년이 지난 지금도 완벽한 천연 채색과 음각이 그대로 보존되어 있습니다.',
        ],
        photoSpot: '제2 안뜰의 거대한 파피루스 기둥 천장 아래에서 선명한 파란색과 황금색 천장 문양을 올려다보며 촬영.',
        practicalTip: '왕가의 계곡과 하트셉수트에 비해 관광객이 적어 매우 한적하고 고요하게 고대 신전의 감동을 느낄 수 있습니다.',
      },
      {
        id: 'west-spot-6',
        stepNumber: 6,
        spotName: '라메세움 (Ramesseum - 람세스 2세 장제전)',
        spotQuery: 'Ramesseum, Luxor',
        subtitle: '셸리의 시 <오지만디아스>의 배경인 쓰러진 1,000톤 거상',
        officialHistory: [
          '위대한 정복자 람세스 2세가 아문 신과 자신을 위해 세운 기념비적 장제전입니다.',
          '신전 안뜰에는 무게 1,000톤에 달하던 단일 화강암 거대 좌상이 무너져 거대한 조각들로 누워있습니다.',
        ],
        storyAndLore: [
          '★[시인 셸리의 <오지만디아스>] 영국의 낭만파 시인 퍼시 비시 셸리는 이 쓰러진 람세스 2세 석상을 보고 불멸의 시를 썼습니다: "내 이름은 오지만디아스, 만왕의 왕이로다. 나의 위업을 보라, 그리고 절망하라!... 그러나 그 곁엔 아무것도 남아있지 않네. 둥글게 부서진 거대한 잔해 주위로 외롭고 평평한 모래만이 아득히 뻗어있을 뿐." 권력의 덧없음과 시간의 무상함을 보여주는 가장 서정적인 유적지입니다.',
        ],
        photoSpot: '산산조각 난 거대한 석상의 발가락과 가슴 블록 옆에서 세월의 무상함을 느끼는 샷.',
        practicalTip: '단체 관광객 코스에서 벗어나 있어 고요한 사색을 즐기기에 최고입니다.',
        badge: '문학 속의 유적',
      },
    ],
  },

  // 4. 룩소르 동안 투어
  {
    zone: 'LUXOR_EAST',
    tabLabel: '룩소르 동안투어',
    emoji: '⛵',
    title: '룩소르 동안 & 나일강 투어 (The East Bank & Nile)',
    theme: '살아있는 파라오들의 거대한 신전과 나일강 바람을 품은 일몰 세일링',
    heroImage: luxorEastImg,
    heroQuote: '"하늘의 신전이 땅으로 내려와 머무는 곳, 테베(룩소르)의 태양은 결코 지지 않는다."',
    recommendedDuration: '4.5 ~ 5시간 소요',
    bestTime: '늦은 오후 16:00 ~ 저녁 21:00 (신전 일몰 & 조명 라이트업)',
    ticketSummary: '카르나크 신전(450 EGP) + 룩소르 신전(400 EGP) + 펠루카 1척(300~400 EGP)',
    routeSummary: '카르나크 대신전 (134개 대열주실 & 하트셉수트 오벨리스크) ➔ 스핑크스 참도 ➔ 나일강 펠루카 전통 돛단배 일몰 세일링 ➔ 룩소르 신전 야경 라이트업',
    mapsQuery: 'Karnak, Luxor',
    overviewDesc: '해가 떠오르는 나일강 동안은 삶(Life)과 영광의 중심지입니다. 인류 역사상 가장 거대한 신전 복합체인 카르나크의 대열주실 기둥 숲을 걷고, 무동력 전통 돛단배 펠루카를 타고 나일강 황금빛 석양을 누린 뒤, 밤에 조명이 켜진 룩소르 신전의 람세스 2세 거석상을 만납니다.',
    keyTips: [
      {
        title: '마일모아 추천: 도착일 vs 둘째 날 동선 황금 분배',
        desc: '1일 차(도착일): 낮 룩소르 공항 도착 ➔ 힐튼 체크인 & 휴식 ➔ 16:00 카르나크 신전 (1.5~2시간) ➔ 18:30~19:30 룩소르 신전 (야경 조명 라이트업 1시간) ➔ 저녁 식사 (Fish House). 2일 차: 06:00 열기구 ➔ 07:00 서안 투어 (11시 전 완료) ➔ 오후 힐튼 인피니티 풀 수영 ➔ 16:30 나일강 펠루카 일몰 세일링.',
        type: 'TIP',
      },
      {
        title: '하트셉수트 오벨리스크의 세계적 위상 (이집트 1위, 세계 2위)',
        desc: '카르나크 신전의 하트셉수트 오벨리스크는 높이 29.56m, 무게 323톤으로 현존 이집트 영토 내 서 있는 오벨리스크 중 가장 높고 거대하며 전 세계 2위입니다! (세계 1위 로마 라테라노 32m도 원래 카르나크 신전 것을 약탈해 간 것).',
        type: 'CULTURE',
      },
      {
        title: '펠루카 적정 시세 (300~400 EGP / 1척)',
        desc: '배 1척을 단독으로 대여하는 1시간 일몰 세일링의 적정 시세는 300~400 EGP입니다. 호객꾼을 통하지 말고 선장(Ragab, Mimo)과 왓츠앱으로 직접 시간과 선착장을 약속하세요.',
        type: 'TIP',
      },
      {
        title: '쇠똥구리(스카라베) 소원 빌기',
        desc: '카르나크 성스러운 호수 옆 커다란 화강암 스카라베 석상 주위를 시계 반대 방향으로 7바퀴 돌면 사랑과 행운, 부부 금슬의 소원이 이루어진다는 오랜 전설이 있습니다.',
        type: 'CULTURE',
      },
    ],
    spots: [
      {
        id: 'east-spot-1',
        stepNumber: 1,
        spotName: '카르나크 대신전 (Karnak Temple)',
        spotQuery: 'Karnak, Luxor',
        subtitle: '2,000년 동안 30여 명의 왕이 증축한 지구상 최대의 종교 신전',
        officialHistory: [
          '고대 이집트 수도 테베의 주신인 아문-라(Amun-Ra)에게 바쳐진 거대한 신전 복합체입니다.',
          '중왕국부터 프톨레마이오스 왕조까지 무려 2,000년 동안 역대 파라오들이 앞다투어 자신의 탑문과 기둥, 오벨리스크를 증축하여 총면적이 100헥타르(바티칸 성 베드로 대성당의 12배)에 달합니다.',
        ],
        storyAndLore: [
          '입구 양쪽에 도열한 수십 기의 양 머리 스핑크스(아문 신의 상징)는 파라오를 품에 안고 수호하는 자애로운 형상입니다.',
          '파라오들은 즉위할 때마다 신에게 자신의 충성을 증명하기 위해 이전 왕의 건물 옆에 더 큰 탑문(Pylon)을 세우는 경쟁을 벌였습니다.',
        ],
        photoSpot: '제1 탑문을 지나 양 머리 스핑크스 참길 가운데 서서 웅장한 탑문을 배경으로 촬영.',
        practicalTip: '신전 규모가 방대하므로 물을 지참하고 관람 동선을 대열주실과 성스러운 호수 중심으로 콤팩트하게 잡으세요.',
        badge: '인류 최대 신전',
      },
      {
        id: 'east-spot-2',
        stepNumber: 2,
        spotName: '대열주실 & 하트셉수트 오벨리스크 (이집트 1위)',
        spotQuery: 'Karnak Great Hypostyle Hall',
        subtitle: '높이 21m 파피루스 기둥 134개와 이집트에서 가장 높은 323톤 오벨리스크',
        officialHistory: [
          '세티 1세와 람세스 2세가 완성한 가로 102m, 세로 53m의 초대형 열주실입니다. 중앙 기둥 12기는 높이 21m(건물 7층 높이), 둘레 10m로 성인 6명이 팔을 벌려야 안을 수 있습니다.',
          '신전 안쪽에는 하트셉수트 여왕이 세운 높이 29.56m, 무게 323톤의 단일 아스완 화강암 오벨리스크가 서 있습니다. 현존 이집트 내 최고 높이이자 전 세계 2위입니다.',
        ],
        storyAndLore: [
          '★[스타워즈와 트랜스포머의 촬영지] 거대한 기둥 사이로 쏟아지는 사막의 빛줄기는 마치 숲속에 들어온 듯 경이롭습니다. 영화 <트랜스포머: 패자의 역습>과 007 시리즈의 배경이 되었습니다.',
          '★[벽으로 가려서 보존된 오벨리스크의 역설] 투트모세 3세는 하트셉수트 여왕의 오벨리스크를 차마 부수지는 못하고(신에게 바친 물건이라 저주가 두려워) 탑 주변에 높은 석조 벽을 쌓아 시야를 가려버렸습니다. 그러나 역설적으로 그 벽 덕분에 3,500년 동안 사막의 비바람과 모래폭풍을 막아주어 오늘날 가장 완벽한 황금빛 화강암 결로 보존되었습니다.',
          '★[오벨리스크 표면 부조] 오벨리스크 꼭대기 부조를 자세히 보면 태양신 아문-라가 무릎을 꿇은 하트셉수트 여왕의 머리에 직접 파라오의 왕관을 씌워주는 감동적인 대관식 장면이 선명히 새겨져 있습니다.',
        ],
        photoSpot: '중앙 통로에서 쏟아지는 오후 역광을 받으며 기둥 사이에 서 있는 실루엣 샷.',
        practicalTip: '기둥 아래쪽에 깊게 파인 람세스 2세의 카르투슈를 손으로 만져보며 고대 장인의 석조 기술을 느껴보세요.',
        badge: '이집트 최고 높이',
      },
      {
        id: 'east-spot-3',
        stepNumber: 3,
        spotName: '나일강 펠루카 (Felucca) 전통 돛단배 일몰 세일링',
        spotQuery: 'Nile Felucca Luxor',
        subtitle: '오직 바람과 강물 소리만 흐르는 5천 년 전 방식의 무동력 항해',
        officialHistory: [
          '고대 파라오 시대부터 나일강을 오가던 전통 목조 삼각 돛단배입니다.',
          '엔진 모터가 전혀 없으며 오직 선장의 노련한 돛 조종과 나일강의 자연 바람, 조류만을 이용해 조용하게 미끄러지듯 나아갑니다.',
        ],
        storyAndLore: [
          '시끄러운 모터보트 엔진 소리 대신 찰랑이는 나일강 물결 소리와 바람에 펄럭이는 하얀 삼각 돛 소리만 귓가에 맴돕니다.',
          '서쪽 테베 산맥 너머로 붉게 타오르며 떨어지는 일몰(16:30~17:30)을 나일강 한가운데 펠루카 갑판 위 푹신한 매트리스에 누워 감상할 때, 이집트 여행 중 가장 평화롭고 로맨틱한 순간이 완성됩니다.',
        ],
        photoSpot: '하얀 삼각 돛과 붉게 물든 나일강 수면, 서안의 야자수 실루엣이 한 프레임에 담기는 일몰 샷.',
        practicalTip: '선장에게 부탁해 배 위에서 따뜻한 이집트 홍차(샤이) 한 잔을 마시며 일몰을 즐겨보세요. (팁 50~100 EGP 별도 준비)',
        badge: '낭만 일몰 힐링',
      },
      {
        id: 'east-spot-4',
        stepNumber: 4,
        spotName: '룩소르 신전 (Luxor Temple) 야경',
        spotQuery: 'Luxor Temple',
        subtitle: '어둠 속에 황금빛 조명으로 부활하는 람세스 2세의 거상들',
        officialHistory: [
          '아멘호테프 3세가 짓고 람세스 2세가 증축한 도심 한가운데의 신전입니다.',
          '매년 나일강 범람기에 카르나크 신전의 아문 신상을 배에 태워 룩소르 신전으로 모셔오는 오페트 축제(Opet Festival)의 종착지였습니다.',
          '신전 입구에는 높이 15m에 달하는 람세스 2세의 좌상 2기와 입상들이 위풍당당하게 도열해 있습니다.',
        ],
        storyAndLore: [
          '★[파리 콩코드 광장으로 간 오벨리스크의 비밀] 룩소르 신전 정문에는 오벨리스크가 하나만 외롭게 서 있습니다. 원래 25m짜리 쌍둥이였으나, 1833년 이집트 총독 무함마드 알리가 프랑스에 우호의 선물로 하나를 보냈고, 현재 파리 콩코드 광장 한복판에 서 있는 것이 바로 그 오벨리스크입니다. 당시 프랑스 국왕 루이 필리프가 감사의 뜻으로 답례한 황동 벽시계는 카이로 시타델에 걸려있는데, 도착하자마자 고장 나서 190년 동안 단 한 번도 작동한 적이 없다는 재미있는 외교사 비화가 있습니다.',
          '밤에 조명이 켜지면 거대한 기둥과 람세스 2세의 얼굴에 극적인 그림자가 드리워지며 낮보다 백배는 더 신비롭고 살아 숨 쉬는 듯한 위용을 뿜어냅니다.',
        ],
        photoSpot: '정문 앞 람세스 2세 거대 좌상 아래에서 오벨리스크와 조명 기둥을 함께 올려다보는 야간 샷.',
        practicalTip: '저녁 7시 이후 신전 내부를 천천히 걸어보세요. 조명 덕분에 부조의 음각과 상형문자가 훨씬 선명하게 읽힙니다.',
        badge: '밤의 하이라이트',
      },
      {
        id: 'east-spot-5',
        stepNumber: 5,
        spotName: '2.7km 스핑크스 참도 (Avenue of Sphinxes)',
        spotQuery: 'Avenue of Sphinxes, Luxor',
        subtitle: '카르나크와 룩소르 신전을 잇던 1,057기 스핑크스의 성스러운 길',
        officialHistory: [
          '룩소르 신전과 카르나크 신전 사이 2.7km를 일직선으로 연결하던 고대 축제의 행렬로입니다.',
          '인간의 얼굴을 한 스핑크스와 양 머리 스핑크스 총 1,057기가 양옆으로 늘어서 있었으며, 수천 년간 모래와 도심 건물 밑에 묻혀있다가 2021년 이집트 정부의 대대적인 발굴 복원으로 세상에 모습을 드러냈습니다.',
        ],
        storyAndLore: [
          '고대 오페트 축제 때 파라오와 사제들이 황금빛 아문 신의 나룻배를 메고 수천 명의 악사와 무희들의 환호 속에 행진하던 화려한 고대의 샹젤리제 거리였습니다.',
        ],
        photoSpot: '룩소르 신전 북쪽 끝에서 끝없이 뻗어 나간 스핑크스 조각상 길을 배경으로 촬영.',
        practicalTip: '야간에 조명이 참도를 따라 켜져 있어 가볍게 산책하며 고대 축제의 분위기를 상상하기 좋습니다.',
      },
    ],
  },

  // 5. 카이로 시내 유적
  {
    zone: 'CAIRO_CITY',
    tabLabel: '카이로 시내유적',
    emoji: '🕌',
    title: '카이로 시내 역사 & 종교 투어 (Historic Cairo)',
    theme: '모카탐 바위산 천연동굴부터 십자군 요새와 2천 년 아기 예수 피난 성지',
    heroImage: cairoCityImg,
    heroQuote: '"카이로를 보지 못한 자는 세상을 보지 못한 것이다. 그 흙은 금이요, 나일강은 기적이며, 그 여인들은 천국의 눈동자를 지녔다." — 아라비안 나이트',
    recommendedDuration: '5.5 ~ 6.5시간 소요',
    bestTime: '오전 08:00 ~ 오후 16:00',
    ticketSummary: '성 시몬 동굴 교회(무료) + 카이로 성채(550 EGP 카드 전용) + 올드 카이로(무료)',
    routeSummary: '성 시몬 동굴 교회 (자발린 재활용 마을 통과) ➔ 살라딘의 카이로 성채 & 모하메드 알리 모스크 ➔ 올드 카이로 콥트 지구 (공중 교회, 성 세르기우스 동굴) ➔ 칸 엘 칼릴리 바자르 & 엘 피샤위 카페',
    mapsQuery: 'Citadel of Saladin, Cairo',
    overviewDesc: '피라미드의 파라오 시대를 지나 이슬람 문명과 2천 년 콥트 기독교의 유산이 한 도시에 켜켜이 쌓여있는 살아있는 박물관입니다. 십자군을 물리친 살라딘의 거대한 요새와 모카탐 바위산을 직접 깎아 만든 2만 석 규모의 기적의 동굴 교회, 아기 예수가 피난했던 성지를 탐방합니다.',
    keyTips: [
      {
        title: '모스크 입장 복장 규정 (양말 필수)',
        desc: '모하메드 알리 모스크에 들어갈 때는 신발을 벗어야 합니다. 대리석 바닥이 차갑거나 먼지가 있을 수 있으니 깨끗하고 도톰한 양말을 신으세요. 여성은 머리를 가릴 얇은 스카프를 준비하세요.',
        type: 'ALERT',
      },
      {
        title: '자발린 마을 통과 시 팁',
        desc: '동굴 교회로 가려면 카이로 쓰레기 수거 마을인 자발린(Zabbaleen) 골목을 지나야 합니다. 특유의 분리수거 냄새가 날 수 있으니 마스크나 멘톨 캔디를 준비하세요. 산 정상 교회에 도착하면 경이로운 반전이 펼쳐집니다.',
        type: 'TIP',
      },
      {
        title: '칸 엘 칼릴리 시장 흥정의 법칙',
        desc: '상인들이 부르는 첫 가격은 보통 2~3배 부풀려져 있습니다. "비캄 다?(얼마예요?)" 묻고 웃는 얼굴로 40~50% 선을 제시하며 기분 좋은 밀당을 즐기세요.',
        type: 'CULTURE',
      },
    ],
    spots: [
      {
        id: 'cairo-spot-1',
        stepNumber: 1,
        spotName: '성 시몬 동굴 교회 (Monastery of Saint Simon)',
        spotQuery: 'Monastery of Saint Simon, Mokattam Mountain',
        subtitle: '모카탐 바위산을 손으로 깎아 만든 2만 석 중동 최대의 동굴 성전',
        officialHistory: [
          '카이로 동쪽 모카탐(Mokattam) 바위산 절벽을 깎아 1970년대부터 조성한 콥트 기독교 수도원 및 동굴 교회입니다.',
          '가장 큰 성 시몬 대성당은 자연 동굴 내부에 20,000석 규모의 야외 원형 극장 계단식 좌석을 갖추고 있어 중동 전체에서 가장 큰 기독교 예배당입니다.',
          '입장료는 무료입니다.',
        ],
        storyAndLore: [
          '★[산을 옮긴 기적의 전설] 10세기 이집트를 지배하던 파티마 왕조의 칼리프 알 무이즈가 유대인 랍비의 이간질에 넘어가 콥트 교황 아브라함에게 시험을 걸었습니다. "성경에 겨자씨만 한 믿음이 있으면 산더미를 옮길 수 있다고 쓰여 있으니, 모카탐 산을 옮겨보아라. 못 옮기면 기독교인들을 몰살하겠다!" 교인들이 사흘 밤낮을 금식 기도하자, 독실한 가죽 수선공 외눈박이 시몬(Simon the Tanner)이 나타나 기도를 이끌었고, 거대한 지진과 함께 모카탐 산이 세 번 공중으로 솟아올랐다는 전설이 깃들어 있습니다.',
          '★[자발린(Zabbaleen) 마을의 감동] 이 교회는 카이로 2천만 인구의 쓰레기 80%를 매일 손수 수거하여 85% 이상 재활용하는 세계 최고의 환경 영웅들이자 독실한 콥트교도인 자발린 사람들의 신앙 공동체입니다. 쓰레기 마을 골목 끝에서 만나는 장엄한 동굴 교회는 큰 영적 울림을 줍니다.',
        ],
        photoSpot: '2만 석 원형 관람석 맨 꼭대기에서 웅장한 바위 천장과 제단을 한 프레임에 담는 초광각 파노라마 샷.',
        practicalTip: '동굴 암벽 곳곳에 폴란드 출신 조각가 마리오가 조각한 성경 벽화 부조들을 찾아보세요.',
        badge: '중동 최대 천연 동굴',
      },
      {
        id: 'cairo-spot-2',
        stepNumber: 2,
        spotName: '카이로 살라딘 성채 (Citadel of Saladin)',
        spotQuery: 'Citadel of Saladin, Cairo',
        subtitle: '십자군을 막기 위해 피라미드 돌을 가져다 쌓은 천혜의 요새',
        officialHistory: [
          '1176년 십자군 전쟁의 영웅이자 아이유브 왕조의 창시자인 살라딘(Salah al-Din)이 카이로를 수호하기 위해 모카탐 언덕 고지대에 건설한 거대한 중세 성채입니다.',
          '1인 입장료 550 EGP (카드 전용 결제).',
          '살라딘은 요새 내부의 식수를 확보하기 위해 단단한 암반을 85m 깊이로 파 내려간 유명한 \'요셉의 우물(Well of Joseph)\'을 만들었습니다.',
        ],
        storyAndLore: [
          '살라딘은 성채의 성벽을 빠르게 쌓기 위해 기자 피라미드의 외벽 백색 석회암들을 뜯어와 축성에 사용했습니다.',
          '이 성채는 살라딘 이후 19세기 무함마드 알리 시대까지 약 700년 동안 이집트를 통치한 모든 술탄과 총독들의 최고 권력 중심지였습니다.',
        ],
        photoSpot: '성채 서쪽 요새 성벽 테라스에서 모스크의 실루엣과 카이로 시내 파노라마 전경을 담는 뷰.',
        practicalTip: '언덕 위에 있어 바람이 시원하게 붑니다. 날씨가 맑은 날에는 시내 너머 20km 밖 기자 피라미드까지 선명하게 보입니다.',
        badge: '십자군 영웅 요새',
      },
      {
        id: 'cairo-spot-3',
        stepNumber: 3,
        spotName: '모하메드 알리 모스크 (Mosque of Muhammad Ali)',
        spotQuery: 'Mosque of Muhammad Ali, Cairo',
        subtitle: '이스탄불 아야 소피아를 빼닮은 은빛 설화석고(Alabaster)의 사원',
        officialHistory: [
          '근대 이집트의 국부로 불리는 무함마드 알리가 1848년 숨진 아들을 기리기 위해 성채 정상에 세운 오스만 양식의 웅장한 모스크입니다.',
          '건물 안팎의 벽면을 고급 설화석고(Alabaster) 대리석으로 마감하여 \'알라바스터 모스크\'로도 불립니다.',
          '높이 52m의 거대한 중앙 돔과 84m에 이르는 두 개의 연필 모양 첨탑(미나렛)이 카이로 하늘을 지배합니다.',
        ],
        storyAndLore: [
          '모스크 안뜰 중앙의 시계탑에는 룩소르 신전의 오벨리스크를 프랑스 파리로 보내주고 루이 필리프 왕에게 답례로 받은 프랑스제 황동 시계가 걸려있습니다. 하지만 도착 당시부터 고장 나서 멈춰있는 역사의 해프닝을 직접 눈으로 확인할 수 있습니다.',
          '사원 내부로 들어서면 수백 개의 둥근 샹들리에 조명이 은은한 은하수처럼 천장을 가득 채우고 있어 고요하고 성스러운 평온함을 줍니다.',
        ],
        photoSpot: '사원 내부 붉은 카펫 바닥에 살짝 앉아 천장의 샹들리에 원형 불빛과 웅장한 돔 천장을 올려다보며 촬영.',
        practicalTip: '모스크 안뜰 분수대(우두, 세정 장소)에서 신발을 비닐봉지에 넣고 양말 차림으로 입장하세요.',
        badge: '카이로의 랜드마크',
      },
      {
        id: 'cairo-spot-4',
        stepNumber: 4,
        spotName: '올드 카이로 & 공중 교회 (The Hanging Church)',
        spotQuery: 'The Hanging Church, Coptic Cairo',
        subtitle: '로마군 바빌론 요새 게이트 위에 허공에 떠받쳐 지은 기적의 교회',
        officialHistory: [
          '올드 카이로 콥트 지구(Coptic Cairo)는 로마 제국의 트라야누스 황제가 세운 바빌론 요새(Babylon Fortress)의 성벽이 남아있는 곳입니다.',
          '성모 마리아 공중 교회(알 무알라카, The Hanging Church)는 서기 3~4세기경 요새의 두 개 성문 탑 위에 바닥을 띄워 허공에 걸쳐 지어졌기 때문에 \'공중(Hanging)\'이라는 이름이 붙었습니다.',
          '입장료는 무료입니다.',
        ],
        storyAndLore: [
          '교회 내부로 들어가면 천장이 거꾸로 뒤집힌 거대한 배 모양으로 나무로 짜여 있는데, 이는 노아의 방주(Noah\'s Ark)를 상징하여 성도들을 구원하는 교회를 뜻합니다.',
          '바닥의 작은 유리창을 내려다보면 교회 바닥 아래로 수 미터 깊이의 허공과 로마 요새 탑의 벽돌이 보여 왜 공중 교회인지 실감할 수 있습니다.',
        ],
        photoSpot: '교회 입구 야자수가 늘어선 하얀 대리석 모자이크 계단 통로에서 아치형 문을 배경으로 촬영.',
        practicalTip: '지하철 마르 기르기스(Mar Girgis) 역 바로 앞에 있어 이동이 매우 편리합니다.',
        badge: '로마 요새 위 성지',
      },
      {
        id: 'cairo-spot-5',
        stepNumber: 5,
        spotName: '성 세르기우스 동굴 교회 (Abu Serga)',
        spotQuery: 'Church of St Sergius and Bacchus, Cairo',
        subtitle: '아기 예수 피난 성지 - 성모 마리아와 요셉이 3개월간 숨어 살던 실제 지하 동굴',
        officialHistory: [
          '서기 4세기에 지어진 카이로에서 가장 오래된 콥트 교회 중 하나로, 성 세르기우스와 바쿠스에게 봉헌되었습니다.',
          '교회 본당 제단 아래 10m 깊이에 헤롯 왕의 유아 학살을 피해 이집트로 피난 온 성가족(아기 예수, 성모 마리아, 요셉)이 약 3개월간 숨어 지냈던 실제 지하 석굴(The Crypt)이 보존되어 있습니다.',
        ],
        storyAndLore: [
          '성경 마태복음 2장에 기록된 "헤롯이 아기를 찾아 죽이려 하니 일어나 아기와 그의 어머니를 데리고 이집트로 피하여..."라는 구절의 실제 무대입니다.',
          '지하 동굴의 성스러운 우물물과 2천 년 전 성가족이 누웠던 바위 침상을 바라볼 때 종교를 초월한 숭고한 역사의 숨결을 온몸으로 느낄 수 있습니다.',
        ],
        photoSpot: '교회 내부 12사도를 상징하는 대리석 기둥(유다의 기둥은 홀로 채색 없이 붉은 대리석)과 고대 이콘화 벽면.',
        practicalTip: '예배 중일 때는 정숙을 유지하고, 동굴로 내려가는 계단 입구의 성가족 피난 경로 지도를 꼭 살펴보세요.',
        badge: '성가족 피난 성지',
      },
      {
        id: 'cairo-spot-6',
        stepNumber: 6,
        spotName: '칸 엘 칼릴리 시장 & 엘 피샤위 카페 (El Fishawy)',
        spotQuery: 'Khan el-Khalili, El-Gamaleya',
        subtitle: '14세기부터 이어진 천일야화의 전통 바자르 & 250년 된 문호들의 아지트',
        officialHistory: [
          '1382년 맘루크 왕조의 자르카스 알 칼릴리 왕자가 지은 대상(카라반) 숙소에서 출발한 중동 최대 규모의 전통 바자르 시장입니다.',
          '미로 같은 골목에 수천 개의 금은 세공품, 카르투슈 목걸이, 황동 램프, 향신료, 파피루스 상점이 빼곡합니다.',
          '엘 피샤위(El Fishawy) 카페는 1773년에 문을 열어 250년 동안 하루도 쉬지 않고 24시간 불을 밝혀온 전설적인 카페입니다.',
        ],
        storyAndLore: [
          '노벨문학상 수상 작가 나기브 마푸즈가 매일 오후 이곳 구석진 거울 자리에 앉아 차를 마시며 대작 <자발라위의 아이들>과 <카이로 삼부작>을 집필했습니다.',
          '오래된 거울들이 벽면을 가득 채운 골목 테이블에 앉아 신선한 민트 잎을 듬뿍 넣은 뜨거운 홍차 \'샤이 비 나나(Shay bi Na\'na)\'를 한 모금 들이키면, 물담배(시샤) 연기와 상인들의 활기가 어우러져 아라비안나이트의 심장 속으로 빠져듭니다.',
        ],
        photoSpot: '엘 피샤위 카페의 고풍스러운 대형 거울과 황동 찻잔을 앞에 두고 골목의 정취를 담는 빈티지 샷.',
        practicalTip: '기념품으로 실버 카르투슈 목걸이를 주문하면 10~20분 만에 아내와 남편의 이름을 고대 상형문자로 즉석에서 은판에 새겨줍니다.',
        badge: '바자르 & 카페',
      },
    ],
  },
];

export const HistoryGuideTab: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<TourZone>('GIZA');
  const [expandedSpots, setExpandedSpots] = useState<Record<string, boolean>>({
    'giza-spot-1': true,
    'giza-spot-2': true,
  });
  const [visitedSpots, setVisitedSpots] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('egypt_visited_spots');
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandAll, setExpandAll] = useState<boolean>(false);

  const activeTour = useMemo(() => {
    return TOUR_GUIDES.find(t => t.zone === selectedZone) || TOUR_GUIDES[0];
  }, [selectedZone]);

  const toggleSpot = (id: string) => {
    setExpandedSpots(prev => ({
      ...prev,
      [id]: !(prev[id] ?? expandAll),
    }));
  };

  const handleToggleVisited = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setVisitedSpots(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('egypt_visited_spots', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleToggleExpandAll = () => {
    const next = !expandAll;
    setExpandAll(next);
    if (next) {
      const all: Record<string, boolean> = {};
      activeTour.spots.forEach(s => {
        all[s.id] = true;
      });
      setExpandedSpots(all);
    } else {
      setExpandedSpots({});
    }
  };

  // Filter spots if search query entered
  const filteredSpots = useMemo(() => {
    if (!searchQuery.trim()) return activeTour.spots;
    const q = searchQuery.toLowerCase().trim();
    return activeTour.spots.filter(s => 
      s.spotName.toLowerCase().includes(q) ||
      s.subtitle.toLowerCase().includes(q) ||
      s.officialHistory.some(h => h.toLowerCase().includes(q)) ||
      s.storyAndLore.some(st => st.toLowerCase().includes(q)) ||
      s.practicalTip.toLowerCase().includes(q)
    );
  }, [activeTour, searchQuery]);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800 text-lg">🎧</span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                현장 셀프투어 오디오·역사 가이드
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                실제 동선에 맞춘 5대 핵심 유적지 심층 역사 & 비하인드 스토리 & 실전 꿀팁
              </p>
            </div>
          </div>
        </div>

        {/* Global Expand Toggle */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={handleToggleExpandAll}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition"
          >
            <ChevronsUpDown className="w-3.5 h-3.5 text-blue-600" />
            <span>{expandAll ? '모든 해설 접기' : '모든 해설 펼치기'}</span>
          </button>
        </div>
      </div>

      {/* 5 Main Zone Selector Navigation Pills */}
      <div className="overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {TOUR_GUIDES.map(tour => {
            const isActive = selectedZone === tour.zone;
            return (
              <button
                key={tour.zone}
                onClick={() => {
                  setSelectedZone(tour.zone);
                  setSearchQuery('');
                }}
                className={`py-2 px-3 rounded-2xl flex items-center gap-1.5 transition-all text-xs font-bold shrink-0 border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                <span>{tour.emoji}</span>
                <span>{tour.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Visual Card for Selected Destination */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Landmark Photo Hero Header with Gradient Overlay */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-slate-900">
          <img 
            src={activeTour.heroImage} 
            alt={activeTour.title}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          
          {/* Hero Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white space-y-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/90 text-white font-bold text-[10px] tracking-wide uppercase backdrop-blur-xs">
                {activeTour.emoji} 현장 동선 가이드
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/40 text-amber-300 font-semibold text-[10px] backdrop-blur-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activeTour.recommendedDuration}
              </span>
              <a
                href={getGoogleMapsUrl(activeTour.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium text-[10px] backdrop-blur-xs flex items-center gap-1 transition"
              >
                <MapPin className="w-3 h-3 text-red-400" />
                구글맵 열기
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
              {activeTour.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed">
              {activeTour.theme}
            </p>
          </div>
        </div>

        {/* Quick Facts & Movement Route Summary */}
        <div className="p-4 sm:p-5 space-y-3.5 bg-slate-50/50">
          {/* Quote Banner */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-950 text-xs italic font-medium flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{activeTour.heroQuote}</span>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                추천 관람 시간 & 티켓
              </span>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{activeTour.bestTime}</span>
              </div>
              <p className="text-[11px] text-slate-600 pt-0.5">
                🎫 {activeTour.ticketSummary}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                권장 이동 동선 코스
              </span>
              <div className="font-semibold text-slate-800 flex items-start gap-1.5 text-[11px] leading-relaxed">
                <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{activeTour.routeSummary}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed px-1">
            {activeTour.overviewDesc}
          </p>

          {/* Field Master Tips Section */}
          <div className="pt-2 border-t border-slate-200/70 space-y-2">
            <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              현장 방문 전 필수 꿀팁 & 안전 가이드
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeTour.keyTips.map((tip, idx) => (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                    tip.type === 'ALERT'
                      ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                      : tip.type === 'TIP'
                      ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                      : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <span className="font-bold block text-[11px]">
                    {tip.type === 'ALERT' ? '🚨 ' : tip.type === 'TIP' ? '💡 ' : '✨ '}
                    {tip.title}
                  </span>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spot Search Bar within selected tour */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`${activeTour.tabLabel} 내 스팟 또는 역사 키워드 검색 (예: 람세스, 투탕카멘, 셔틀, 피자헛...)`}
          className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 focus:outline-hidden focus:border-blue-600 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        )}
      </div>

      {/* Detailed Step-by-Step Walking Guide Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            동선 순서별 현장 해설 코스 ({filteredSpots.length}개 스팟)
          </span>
          <span className="text-[11px] text-slate-400">
            카드 클릭 시 심층 해설 펼침
          </span>
        </div>

        {filteredSpots.map((spot) => {
          const isOpened = expandedSpots[spot.id] ?? expandAll;
          const isVisited = visitedSpots[spot.id] ?? false;

          return (
            <div 
              key={spot.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isVisited 
                  ? 'bg-slate-50/80 border-slate-200 opacity-90' 
                  : isOpened 
                  ? 'bg-white border-blue-300 shadow-xs' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Spot Header Summary Bar (Always Visible) */}
              <div 
                onClick={() => toggleSpot(spot.id)}
                className="p-3.5 sm:p-4 cursor-pointer flex items-start justify-between gap-3 select-none"
              >
                <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
                  {/* Step Number Badge */}
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                    isVisited 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    {spot.stepNumber}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-slate-900 truncate">
                        {spot.spotName}
                      </h4>
                      {spot.badge && (
                        <span className="px-2 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                          {spot.badge}
                        </span>
                      )}
                      {isVisited && (
                        <span className="px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          관람 완료
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {spot.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right Action Icons: Visited Check & Expand Arrow */}
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  <button
                    onClick={(e) => handleToggleVisited(e, spot.id)}
                    className={`p-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                      isVisited
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title={isVisited ? '관람 취소' : '관람 완료 표시'}
                  >
                    {isVisited ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                  </button>

                  <a
                    href={getGoogleMapsUrl(spot.spotQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                    title="구글 맵스에서 위치 보기"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="text-slate-400 p-0.5">
                    {isOpened ? (
                      <ChevronUp className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Deep Dive History & Field Lore Content */}
              {isOpened && (
                <div className="px-3.5 pb-4 sm:px-4 space-y-3.5 text-xs text-slate-700 border-t border-slate-100 pt-3 bg-slate-50/30">
                  {/* 1. Official Historical Facts */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-white border border-slate-200/80">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      공식 역사 팩트 & 건축적 수치
                    </span>
                    <ul className="space-y-1 pl-4 list-disc marker:text-blue-500 leading-relaxed text-slate-600 text-[11px] sm:text-xs">
                      {spot.officialHistory.map((fact, idx) => (
                        <li key={idx}>{fact}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 2. Intriguing Story Lore & Perspectives */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/70">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      흥미진진한 비하인드 스토리 & 사견 (Story Lore)
                    </span>
                    <div className="space-y-1.5 text-amber-900 leading-relaxed text-[11px] sm:text-xs">
                      {spot.storyAndLore.map((story, idx) => (
                        <p key={idx} className="bg-white/60 p-2 rounded-lg border border-amber-100/70">
                          {story}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* 3. Photo Angle Guide */}
                  <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200/60 text-sky-950 flex items-start gap-2 text-[11px] leading-relaxed">
                    <Camera className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">📸 추천 포토 앵글: </strong>
                      <span>{spot.photoSpot}</span>
                    </div>
                  </div>

                  {/* 4. Practical Master Tip */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-950 flex items-start gap-2 text-[11px] leading-relaxed">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">💡 현장 실전 팁: </strong>
                      <span>{spot.practicalTip}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Egyptian Wall Symbols & Rosetta Lore Mini Reference */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>📿</span>
            벽화가 바로 읽히는 고대 이집트 4대 상징 퀵 치트시트
          </h3>
          <span className="text-[10px] text-slate-400">현장 벽화 해독용</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            {
              sym: '📿',
              name: '카르투슈 (Cartouche)',
              sub: '파라오의 이름 테두리',
              desc: '밧줄을 타원형으로 묶은 고리로 안쪽에 파라오의 즉위명이 상형문자로 들어감.',
            },
            {
              sym: '☥',
              name: '앙크 (Ankh)',
              sub: '영원한 생명의 열쇠',
              desc: '신들이 파라오의 코에 생명의 숨결을 불어넣을 때 쥐어주는 십자가 모양.',
            },
            {
              sym: '𓂀',
              name: '우제트의 눈 (Eye of Horus)',
              sub: '치유와 보호의 부적',
              desc: '세트에게 잃었다 되찾은 호루스의 눈. 액운을 막고 완전함을 지켜줌.',
            },
            {
              sym: '🪲',
              name: '스카라베 (Scarab)',
              sub: '부활과 태양의 쇠똥구리',
              desc: '아침마다 똥을 굴리듯 태양을 밀어 올린다고 믿은 부활과 재탄생의 상징.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{item.sym}</span>
                <span className="font-bold text-slate-900 text-[11px] truncate">{item.name}</span>
              </div>
              <span className="text-[10px] text-blue-700 font-semibold block">{item.sub}</span>
              <p className="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
