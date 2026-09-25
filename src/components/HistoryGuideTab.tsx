import React, { useState } from 'react';
import { 
  Landmark, 
  Compass, 
  Sparkles, 
  MapPin, 
  Clock, 
  CreditCard, 
  Camera, 
  AlertTriangle, 
  ChevronRight, 
  BookOpen, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Footprints,
  Eye,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

type GuideSubTab = 'HISTORY' | 'GIZA' | 'GEM' | 'LUXOR';

export const HistoryGuideTab: React.FC = () => {
  const [subTab, setSubTab] = useState<GuideSubTab>('HISTORY');

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-6">
      {/* Top Title Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-lg">
              <span>🏛️</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">이집트 역사 & 핵심 가이드</h2>
              <p className="text-[11px] text-blue-100 font-medium">
                알고 보면 10배 더 감동적인 유적지 불렛포인트 치트시트
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/20 text-white font-bold backdrop-blur-xs">
            10주년 여행 맞춤
          </span>
        </div>
      </div>

      {/* Sub-tab Navigation Bar - Responsive 2x2 grid on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setSubTab('HISTORY')}
          className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition min-h-[38px] active:scale-95 ${
            subTab === 'HISTORY'
              ? 'bg-white text-blue-700 font-bold shadow-xs ring-1 ring-blue-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">이집트 역사·상징</span>
        </button>

        <button
          onClick={() => setSubTab('GIZA')}
          className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition min-h-[38px] active:scale-95 ${
            subTab === 'GIZA'
              ? 'bg-white text-blue-700 font-bold shadow-xs ring-1 ring-blue-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🏜️</span>
          <span className="truncate">1) 기자 피라미드</span>
        </button>

        <button
          onClick={() => setSubTab('GEM')}
          className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition min-h-[38px] active:scale-95 ${
            subTab === 'GEM'
              ? 'bg-white text-blue-700 font-bold shadow-xs ring-1 ring-blue-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🏛️</span>
          <span className="truncate">2) GEM 대박물관</span>
        </button>

        <button
          onClick={() => setSubTab('LUXOR')}
          className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition min-h-[38px] active:scale-95 ${
            subTab === 'LUXOR'
              ? 'bg-white text-blue-700 font-bold shadow-xs ring-1 ring-blue-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>⛵</span>
          <span className="truncate">3) 룩소르 주요포인트</span>
        </button>
      </div>

      {/* SUB-TAB 1: HISTORY OVERVIEW */}
      {subTab === 'HISTORY' && (
        <div className="space-y-4">
          {/* Quick symbols card */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>알고 가면 유적 벽화가 바로 보이는 4대 상징</span>
              </h3>
              <span className="text-[10px] text-blue-700 bg-blue-50 font-bold px-2 py-0.5 rounded-full">필수 지식</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📿</span>
                  <div>
                    <h4 className="font-bold text-xs text-amber-950">카르투슈 (Cartouche)</h4>
                    <span className="text-[10px] text-amber-800">파라오의 이름을 지키는 타원형 테두리</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-700 mt-1.5 leading-relaxed">
                  • 밧줄을 묶어 만든 타원형 고리 안에 파라오의 즉위명과 탄생명이 상형문자로 새겨집니다.<br />
                  • 신전 벽화에서 타원형 테두리를 찾으면 그것이 바로 파라오의 공식 서명입니다.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-xl">☥</span>
                  <div>
                    <h4 className="font-bold text-xs text-blue-950">앙크 (Ankh)</h4>
                    <span className="text-[10px] text-blue-800">영원한 생명(Life)의 열쇠</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-700 mt-1.5 leading-relaxed">
                  • 고리 달린 십자가 형태로, 신들이 파라오의 콧구멍에 대고 생명의 숨결을 불어넣는 모습으로 벽화에 자주 등장합니다.<br />
                  • 사후세계에서의 부활과 영생을 상징합니다.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-xl">𓂀</span>
                  <div>
                    <h4 className="font-bold text-xs text-emerald-950">우제트의 눈 (Eye of Horus)</h4>
                    <span className="text-[10px] text-emerald-800">치유와 보호의 호루스 눈</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-700 mt-1.5 leading-relaxed">
                  • 매의 머리를 한 천공의 신 호루스의 눈. 악신 세트와의 결투에서 잃었다가 지혜의 신 토트에 의해 치유된 눈입니다.<br />
                  • 액운을 막고 건강과 완전함을 지켜주는 최상급 부적으로 미라 붕대 속에도 넣었습니다.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪲</span>
                  <div>
                    <h4 className="font-bold text-xs text-purple-950">스카라베 (Scarab)</h4>
                    <span className="text-[10px] text-purple-800">태양신의 탄생과 부활의 쇠똥구리</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-700 mt-1.5 leading-relaxed">
                  • 똥을 굴리는 모습이 매일 아침 태양을 하늘 위로 굴려 올리는 케프리(Khepri) 신과 같다고 여겨졌습니다.<br />
                  • 부활과 변형의 상징으로 심장 스카라베 부적으로 사용되었습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Chronological Era Timeline */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>⏳</span> 고대 이집트 3천 년 핵심 연대표
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Era 1: Old Kingdom */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs">
                      1. 고왕국 시대 (Old Kingdom, BC 2686 ~ BC 2181)
                    </h4>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      피라미드 황금기
                    </span>
                  </div>
                  <ul className="mt-2 text-xs text-slate-600 space-y-1 leading-relaxed">
                    <li>• <strong>수도</strong>: 멤피스(현재 카이로 남부)</li>
                    <li>• <strong>핵심 사건</strong>: 제4왕조에 쿠푸, 카프레, 멘카우레의 <strong>기자 3대 피라미드</strong> 건설.</li>
                    <li>• <strong>특징</strong>: 파라오는 태양신 라(Ra)의 아들이자 살아있는 신으로 절대권력 행사. 미라 제작 및 사후세계 신앙 체계화.</li>
                  </ul>
                </div>
              </div>

              {/* Era 2: Middle Kingdom */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs">
                      2. 중왕국 시대 (Middle Kingdom, BC 2055 ~ BC 1650)
                    </h4>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      예술·문학 르네상스
                    </span>
                  </div>
                  <ul className="mt-2 text-xs text-slate-600 space-y-1 leading-relaxed">
                    <li>• <strong>수도</strong>: 테베(룩소르)와 이타위</li>
                    <li>• <strong>핵심 변화</strong>: 오시리스(부활과 사후세계의 신) 신앙 대중화. 파라오뿐 아니라 귀족과 일반인도 도덕적 심판을 거쳐 영생 가능.</li>
                    <li>• <strong>문학</strong>: 고대 이집트 문학의 고전이라 불리는 시누헤 이야기 등이 번영.</li>
                  </ul>
                </div>
              </div>

              {/* Era 3: New Kingdom */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-blue-950 text-xs">
                      3. 신왕국 시대 (New Kingdom, BC 1550 ~ BC 1069)
                    </h4>
                    <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                      이집트 제국 전성기
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-800 font-semibold mt-1">
                    ★ 이번 10주년 여행지(룩소르 왕가의 계곡, 카르나크, 룩소르 신전)의 주 무대!
                  </p>
                  <ul className="mt-2 text-xs text-slate-700 space-y-1.5 leading-relaxed">
                    <li>• <strong>하트셉수트 여왕 (BC 1479~1458)</strong>: 최초의 여성 파라오 중 한 명으로 무역과 건축 진흥(룩소르 서안 3단 장제전 건립).</li>
                    <li>• <strong>아케나톤 (BC 1353~1336)</strong>: 아몬 신관들의 권력을 꺾기 위해 태양원반 유일신 '아톤' 숭배 종교개혁 단행.</li>
                    <li>• <strong>투탕카멘 (BC 1332~1323)</strong>: 소년왕. 전통 다신교 복귀 후 19세에 요절, 도굴되지 않은 5,000점의 순금 보물을 남김.</li>
                    <li>• <strong>람세스 2세 (BC 1279~1213)</strong>: 66년간 재위하며 100명 이상의 자녀를 둠. 카르나크 대열주실, 아부심벨 신전 완성.</li>
                  </ul>
                </div>
              </div>

              {/* Era 4: Ptolemaic & Roman */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-500 ring-4 ring-slate-100" />
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs">
                      4. 프톨레마이오스 왕조 & 로마 (BC 305 ~ AD 641)
                    </h4>
                    <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      헬레니즘 융합
                    </span>
                  </div>
                  <ul className="mt-2 text-xs text-slate-600 space-y-1 leading-relaxed">
                    <li>• 알렉산더 대왕 사후 마케도니아계 그리스 장군 프톨레마이오스가 왕조 창시.</li>
                    <li>• 지중해의 중심 알렉산드리아 도서관 및 등대 건설.</li>
                    <li>• 마지막 여왕 <strong>클레오파트라 7세</strong> 사망 후 로마 제국의 직할 속주로 편입.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GIZA PYRAMIDS GUIDE */}
      {subTab === 'GIZA' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🏜️</span> 기자 피라미드 투어 완전 정복 가이드
                </h3>
                <p className="text-[11px] text-slate-500">
                  DAY 2 오전 투어 핵심 팁 & 호객 대처법
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                700 EGP (카드 전용)
              </span>
            </div>

            {/* 1. The 3 Main Pyramids & Sphinx */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                기자 3대 피라미드 & 스핑크스 구별법
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-1">1. 쿠푸 대피라미드 (Great)</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    • 세계 7대 불가사의 중 유일하게 현존.<br />
                    • 높이 약 139m, 평균 2.5톤 석재 230만 개.<br />
                    • 꼭대기가 뭉툭하게 깎여 있음.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <span className="font-bold text-blue-900 block mb-1">2. 카프레 피라미드</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    • 쿠푸의 아들 카프레의 무덤.<br />
                    • <strong>꼭대기 1/3 부분에 매끄러운 석회암 외장석</strong>이 남아있어 한눈에 구별 가능.<br />
                    • 스핑크스와 일직선상 연결.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">3. 멘카우레 피라미드</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    • 카프레의 아들 멘카우레.<br />
                    • 높이 65m로 셋 중 가장 아담함.<br />
                    • 기단부에 아스완 붉은 화강암을 둘렀던 흔적이 남아있음.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Entrance & Interior Room Dilemma */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span>🚪</span> 쿠푸 피라미드 내부 입장(추가 900 EGP), 들어갈까 말까?
              </h4>
              <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                <p>
                  • <strong>결론부터</strong>: 더위와 좁은 공간을 힘들어하신다면 <strong>외부 관람만으로도 충분</strong>합니다.
                </p>
                <p>
                  • <strong>내부 상태</strong>: 계단을 오르는 것이 아니라 허리를 완전히 굽힌 채 좁고 가파른 오르막 경사로(대회랑)를 10여 분 기어 올라가야 합니다.
                </p>
                <p>
                  • <strong>왕의 방 도착 시</strong>: 유물이나 벽화는 전혀 없으며, 텅 빈 붉은 화강암 석관 틀 하나만 덩그러니 놓여 있습니다. 실내가 매우 후텁지근하고 산소가 부족합니다.
                </p>
                <p>
                  • <strong>추천 대상</strong>: "고대 4,500년 전 피라미드의 심장부에 내 발로 서봤다"는 상징적 경험을 꼭 원하시는 분께만 권장합니다.
                </p>
              </div>
            </div>

            {/* 3. Transport inside: Shuttles vs Camels */}
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-rose-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>내부 이동 수단 & 호객꾼 대처 절대 원칙</span>
                </h4>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">안전 수칙</span>
              </div>
              <ul className="text-xs text-rose-950 space-y-1.5 leading-relaxed">
                <li>• <strong>공식 전기 카트/셔틀 (700 EGP) 추천</strong>: 매표소에서 공식 카드 결제로 이용 가능하며 파노라마 뷰포인트까지 시원하고 바가지 없이 순환합니다.</li>
                <li>• <strong>낙타/마차 삐끼 주의</strong>: "무료로 사진 찍어주겠다", "티켓 보여달라", "피라미드까지 걸어가면 5시간 걸린다(거짓말)"며 접근합니다.</li>
                <li>• <strong>대처법</strong>: 눈 마주치지 말고 단호하게 고개를 가로저으며 <strong>"라, 슈크란(La, Shukran)"</strong>을 1~2회 말하고 앞만 보고 걸어가세요. 말대꾸를 시작하면 끝까지 따라옵니다.</li>
              </ul>
            </div>

            {/* 4. Best Photo Spots */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                놓치면 후회하는 기자 3대 포토 스팟
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="font-bold text-slate-900 block mb-1">📸 9 Pyramids 뷰포인트</span>
                  <p className="text-[11px] text-slate-600">
                    사막 모래 언덕 너머로 9개의 피라미드가 겹쳐지는 파노라마 명당 (셔틀 정류장 인근).
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="font-bold text-slate-900 block mb-1">📸 스핑크스 뽀뽀/손받침</span>
                  <p className="text-[11px] text-slate-600">
                    스핑크스 우측 관람로에서 원근법을 이용해 스핑크스 입술에 뽀뽀하거나 손바닥 위에 올리는 클래식 샷.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="font-bold text-slate-900 block mb-1">📸 기자 피자헛 테라스</span>
                  <p className="text-[11px] text-slate-600">
                    스핑크스 정문 맞은편 피자헛 2층/옥상에서 피라미드와 스핑크스를 정면으로 보며 피자/콜라 즐기기.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GEM GRAND EGYPTIAN MUSEUM */}
      {subTab === 'GEM' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🏛️</span> GEM (이집트 대박물관) 완벽 관람 동선
                </h3>
                <p className="text-[11px] text-slate-500">
                  세계 최대 고고학 박물관을 가장 알차게 둘러보는 4단계 코스
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                1,500 EGP (사전예약 필수)
              </span>
            </div>

            {/* Quick Visit Tips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">권장 소요시간</span>
                <span className="font-bold text-slate-900">최소 3.5 ~ 4시간</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">추천 시간대</span>
                <span className="font-bold text-slate-900">오후 13:00 ~ 15:00</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">결제 수단</span>
                <span className="font-bold text-rose-600">카드 전용 (현금 불가)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">실내 복장</span>
                <span className="font-bold text-slate-900">가디건 필수 (강한 에어컨)</span>
              </div>
            </div>

            {/* Step-by-Step Viewing Sequence */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>추천 관람 순서 (Step 1 → Step 4)</span>
              </h4>

              {/* Step 1 */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">
                    STEP 1: 메인 아트리움 (Atrium) - 람세스 2세 거대 석상
                  </span>
                  <span className="text-[10px] bg-white text-blue-700 px-2 py-0.5 rounded-full font-bold">도착 즉시</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  • 박물관 입구에 들어서면 높이 11m, 무게 83톤에 달하는 3,200년 된 람세스 2세의 거대한 붉은 화강암 조각상이 관람객을 압도합니다.<br />
                  • 현대적인 삼각형 패턴의 유리 지붕에서 쏟아지는 자연광과 함께 기념사진을 촬영하세요.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950">
                    STEP 2: 대계단 (Grand Staircase) & 피라미드 파노라마 뷰
                  </span>
                  <span className="text-[10px] bg-white text-indigo-700 px-2 py-0.5 rounded-full font-bold">조각상 60점</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  • 4개의 테마(왕실의 형상 → 신성한 장소 → 종교적 신앙 → 사후세계로의 여정)로 배치된 60여 점의 거대 석상 사이를 걸어 올라갑니다.<br />
                  • <strong>★핵심 포인트</strong>: 대계단 꼭대기에 서면, 초대형 통유리창 너머로 실제 <strong>기자 피라미드가 액자처럼 펼쳐지는 장관</strong>을 조망할 수 있습니다.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">
                    STEP 3: 메인 갤러리 12개 관 (Main Galleries)
                  </span>
                  <span className="text-[10px] bg-white text-amber-800 px-2 py-0.5 rounded-full font-bold">시대순 탐방</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  • 선사시대부터 고왕국, 중왕국, 신왕국, 그리스-로마 시대까지 최첨단 조명과 전시 기법으로 구성되어 있습니다.<br />
                  • <strong>놓치지 말아야 할 보물</strong>: 제4왕조 피라미드 건설자들의 가족 조각상, 헤테페레스 여왕의 침대와 보석함, 완벽히 보존된 목조 채색상들.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">
                    STEP 4: 투탕카멘 특별 갤러리 (Tutankhamun Galleries)
                  </span>
                  <span className="text-[10px] bg-white text-emerald-800 px-2 py-0.5 rounded-full font-bold">황금 보물 5,000점</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  • 1922년 하워드 카터가 발굴한 투탕카멘 무덤의 부장품 전체가 사상 최초로 한자리에 모였습니다.<br />
                  • 순금 110kg의 속관, 황금 마스크, 화려한 보석과 전차, 황금 의자 등 고대 이집트 금세공 기술의 정점을 마주할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LUXOR POINTS GUIDE */}
      {subTab === 'LUXOR' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🏛️</span> 룩소르 주요 포인트별 핵심 가이드
                </h3>
                <p className="text-[11px] text-slate-500">
                  DAY 3 ~ DAY 5 서안(사자의 도시) & 동안(생자의 도시) 완벽 정리
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                세계 최대 야외 박물관
              </span>
            </div>

            {/* 1. West Bank (서안 투어) */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold">
                  서안 (West Bank)
                </span>
                <span className="text-xs text-slate-600 font-medium">태양이 지는 사자의 영역 (오전 투어 추천)</span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Valley of the Kings */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">1. 왕가의 계곡 (Valley of the Kings, 750 EGP)</span>
                    <span className="text-[10px] text-slate-500">기본 3개 무덤 관람</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    • 피라미드 도굴을 피하기 위해 바위산 깊숙이 굴을 파 만든 60여 개의 왕실 지하 무덤군.<br />
                    • <strong>추천 무덤</strong>: <strong>람세스 4세(KV2)</strong> - 천장의 누트 여신 천문도 벽화가 환상적임. <strong>람세스 9세(KV6)</strong> - 경사가 완만하고 색채 선명.<br />
                    • <strong>투탕카멘 무덤 (KV62, 추가 700 EGP)</strong>: 다른 보물은 박물관에 있지만, <strong>투탕카멘의 실제 미라 실물</strong>은 여전히 이 무덤 석관 안에 잠들어 있습니다.
                  </p>
                </div>

                {/* Hatshepsut Temple */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">2. 하트셉수트 여왕 장제전 (Deir el-Bahari, 440 EGP)</span>
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">건축의 극치</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    • 깎아지른 붉은 석회암 절벽을 배경으로 3개 층의 테라스가 이어진 독창적인 고대 현대주의 건축.<br />
                    • 남성처럼 가짜 턱수염을 달고 파라오로 군림한 하트셉수트 여왕의 무역 원정 기록과 부조가 돋보입니다.<br />
                    • 그늘이 전혀 없으므로 양산, 선글라스 필수입니다.
                  </p>
                </div>

                {/* Colossi of Memnon */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">3. 멤논의 거상 (Colossi of Memnon, 무료 관람)</span>
                    <span className="text-[10px] text-slate-500">포토존</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    • 높이 18m의 거대한 아멘호테프 3세 석상 2기.<br />
                    • 기원전 27년 지진 후 매일 새벽마다 바람이 석상 균열을 스치며 슬픈 노랫소리를 내어, 트로이 전쟁에서 전사한 멤논이 어머니(새벽의 여신)에게 인사하는 소리라 여겨졌습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. East Bank (동안 투어) */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-900 text-xs font-bold">
                  동안 (East Bank)
                </span>
                <span className="text-xs text-slate-600 font-medium">태양이 떠오르는 삶의 영역 (오후~야간 추천)</span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Karnak Temple */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">1. 카르나크 대신전 (Karnak Temple, 450 EGP)</span>
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full">세계 최대 신전</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    • <strong>134개의 대열주실</strong>: 높이 21m, 둘레 10m의 거대한 파피루스 돌기둥들이 빽빽이 들어선 고대 건축의 기적.<br />
                    • <strong>하트셉수트 오벨리스크</strong>: 30m 높이의 단일 화강암으로 세워진 웅장한 기념비.<br />
                    • <strong>스카라베(쇠똥구리) 석상</strong>: 성스러운 호수 옆 석상을 <strong>시계 반대 방향으로 7바퀴</strong> 돌며 소원을 빌면 이루어진다는 전설이 있습니다. 부부가 함께 돌아보세요!
                  </p>
                </div>

                {/* Luxor Temple */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950">2. 룩소르 신전 (Luxor Temple, 400 EGP)</span>
                    <span className="text-[10px] text-indigo-700 font-bold bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                      ★야경 필수 방문
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    • <strong>반드시 일몰 후(18:00~20:00) 야간 개장</strong> 때 방문하세요. 은은한 주황빛 조명을 받은 람세스 2세 거대 석상들의 야경이 낮보다 훨씬 낭만적입니다.<br />
                    • <strong>오벨리스크의 짝</strong>: 원래 입구 좌우에 2기가 있었으나, 1기는 프랑스에 선물로 주어져 현재 파리 콩코르드 광장에 우뚝 서 있습니다.<br />
                    • 신전 상단에 지어진 아부 엘 하고그 모스크와의 공존도 독특한 관전 포인트입니다.
                  </p>
                </div>

                {/* Felucca */}
                <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-950">3. 나일강 펠루카 (Felucca) 일몰 체험</span>
                    <span className="text-[10px] text-cyan-800 font-bold bg-white px-2 py-0.5 rounded-full border border-cyan-200">
                      낭만 골든아워
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    • 엔진 소리 없이 오직 바람과 나일강 물결에 몸을 맡기는 고대 전통 삼각 돛단배.<br />
                    • <strong>승선 시간</strong>: 일몰 직전 <strong>16:30 ~ 17:30</strong>에 승선하면 붉게 물드는 나일강 석양과 서안 산맥의 실루엣을 감상할 수 있습니다.<br />
                    • <strong>적정 요금</strong>: 1시간 대절 기준 약 300 ~ 400 EGP (배 1척 기준).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
