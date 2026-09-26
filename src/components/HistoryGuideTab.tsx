import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Camera, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown
} from 'lucide-react';

type GuideSubTab = 'HISTORY' | 'GIZA' | 'GEM' | 'LUXOR';

export const HistoryGuideTab: React.FC = () => {
  const [subTab, setSubTab] = useState<GuideSubTab>('HISTORY');
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const [expandAll, setExpandAll] = useState<boolean>(false);

  const isOpen = (key: string) => expandedKeys[key] ?? expandAll;

  const toggleKey = (key: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !(prev[key] ?? expandAll),
    }));
  };

  const handleToggleExpandAll = () => {
    setExpandAll(!expandAll);
    setExpandedKeys({});
  };

  return (
    <div className="space-y-3.5 max-w-4xl mx-auto pb-6">
      {/* Compact Header & Expand All Button */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>🏛️</span> 이집트 역사 & 핵심 가이드
          </h2>
          <p className="text-[11px] text-slate-500">
            항목을 눌러 상세 해설과 관람 팁을 펼쳐보세요.
          </p>
        </div>

        <button
          onClick={handleToggleExpandAll}
          className="shrink-0 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition shadow-2xs"
        >
          <ChevronsUpDown className="w-3.5 h-3.5 text-blue-600" />
          <span>{expandAll ? '모두 접기' : '모두 펼치기'}</span>
        </button>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setSubTab('HISTORY')}
          className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition min-h-[38px] active:scale-95 ${
            subTab === 'HISTORY'
              ? 'bg-white text-blue-700 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">역사·상징</span>
        </button>

        <button
          onClick={() => setSubTab('GIZA')}
          className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition min-h-[38px] active:scale-95 ${
            subTab === 'GIZA'
              ? 'bg-white text-blue-700 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🏜️</span>
          <span className="truncate">기자 피라미드</span>
        </button>

        <button
          onClick={() => setSubTab('GEM')}
          className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition min-h-[38px] active:scale-95 ${
            subTab === 'GEM'
              ? 'bg-white text-blue-700 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🏛️</span>
          <span className="truncate">GEM 대박물관</span>
        </button>

        <button
          onClick={() => setSubTab('LUXOR')}
          className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition min-h-[38px] active:scale-95 ${
            subTab === 'LUXOR'
              ? 'bg-white text-blue-700 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>⛵</span>
          <span className="truncate">룩소르 포인트</span>
        </button>
      </div>

      {/* SUB-TAB 1: HISTORY OVERVIEW */}
      {subTab === 'HISTORY' && (
        <div className="space-y-3.5">
          {/* 4 Symbols Section */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>벽화가 바로 읽히는 고대 이집트 4대 상징</span>
              </h3>
              <span className="text-[11px] text-slate-400">탭하여 상세 보기</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                {
                  key: 'sym_cartouche',
                  icon: '📿',
                  title: '카르투슈 (Cartouche)',
                  sub: '파라오의 이름을 지키는 타원형 테두리',
                  desc: [
                    '밧줄을 묶어 만든 타원형 고리 안에 파라오의 즉위명과 탄생명이 상형문자로 새겨집니다.',
                    '신전 벽화에서 타원형 테두리를 찾으면 그것이 바로 파라오의 공식 서명입니다.',
                  ],
                },
                {
                  key: 'sym_ankh',
                  icon: '☥',
                  title: '앙크 (Ankh)',
                  sub: '영원한 생명(Life)의 열쇠',
                  desc: [
                    '고리 달린 십자가 형태로, 신들이 파라오의 콧구멍에 대고 생명의 숨결을 불어넣는 모습으로 벽화에 자주 등장합니다.',
                    '사후세계에서의 부활과 영생을 상징합니다.',
                  ],
                },
                {
                  key: 'sym_eye',
                  icon: '𓂀',
                  title: '우제트의 눈 (Eye of Horus)',
                  sub: '치유와 보호의 호루스 눈',
                  desc: [
                    '매의 머리를 한 천공의 신 호루스의 눈. 악신 세트와의 결투에서 잃었다가 지혜의 신 토트에 의해 치유된 눈입니다.',
                    '액운을 막고 건강과 완전함을 지켜주는 최상급 부적으로 미라 붕대 속에도 넣었습니다.',
                  ],
                },
                {
                  key: 'sym_scarab',
                  icon: '🪲',
                  title: '스카라베 (Scarab)',
                  sub: '태양신의 탄생과 부활의 쇠똥구리',
                  desc: [
                    '똥을 굴리는 모습이 매일 아침 태양을 하늘 위로 굴려 올리는 케프리(Khepri) 신과 같다고 여겨졌습니다.',
                    '부활과 변형의 상징으로 심장 스카라베 부적으로 사용되었습니다.',
                  ],
                },
              ].map((sym) => {
                const open = isOpen(sym.key);
                return (
                  <div
                    key={sym.key}
                    onClick={() => toggleKey(sym.key)}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{sym.icon}</span>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{sym.title}</h4>
                          <span className="text-[11px] text-slate-500 block truncate">{sym.sub}</span>
                        </div>
                      </div>
                      <span className="text-slate-400 shrink-0">
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>

                    {open && (
                      <ul className="text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-200/70 space-y-1 leading-relaxed">
                        {sym.desc.map((line, i) => (
                          <li key={i}>• {line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chronological Era Timeline */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>⏳</span> 고대 이집트 3천 년 핵심 연대표
            </h3>

            <div className="relative pl-5 space-y-2.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {[
                {
                  key: 'era_1',
                  dotColor: 'bg-amber-500',
                  title: '1. 고왕국 시대 (BC 2686 ~ BC 2181)',
                  tag: '피라미드 황금기',
                  bullets: [
                    '수도: 멤피스(현재 카이로 남부)',
                    '핵심 사건: 제4왕조에 쿠푸, 카프레, 멘카우레의 기자 3대 피라미드 건설.',
                    '특징: 파라오는 태양신 라(Ra)의 아들이자 살아있는 신으로 절대권력 행사. 미라 제작 및 사후세계 신앙 체계화.',
                  ],
                },
                {
                  key: 'era_2',
                  dotColor: 'bg-blue-500',
                  title: '2. 중왕국 시대 (BC 2055 ~ BC 1650)',
                  tag: '예술·문학 르네상스',
                  bullets: [
                    '수도: 테베(룩소르)와 이타위',
                    '핵심 변화: 오시리스(부활과 사후세계의 신) 신앙 대중화. 파라오뿐 아니라 귀족과 일반인도 도덕적 심판을 거쳐 영생 가능.',
                    '문학: 고대 이집트 문학의 고전이라 불리는 시누헤 이야기 등이 번영.',
                  ],
                },
                {
                  key: 'era_3',
                  dotColor: 'bg-indigo-600',
                  title: '3. 신왕국 시대 (BC 1550 ~ BC 1069)',
                  tag: '이집트 제국 전성기 · 룩소르 주 무대',
                  highlight: true,
                  bullets: [
                    '하트셉수트 여왕 (BC 1479~1458): 최초의 여성 파라오 중 한 명으로 무역과 건축 진흥(룩소르 서안 3단 장제전 건립).',
                    '아케나톤 (BC 1353~1336): 아몬 신관들의 권력을 꺾기 위해 태양원반 유일신 아톤 숭배 종교개혁 단행.',
                    '투탕카멘 (BC 1332~1323): 소년왕. 전통 다신교 복귀 후 19세에 요절, 도굴되지 않은 5,000점의 순금 보물을 남김.',
                    '람세스 2세 (BC 1279~1213): 66년간 재위하며 100명 이상의 자녀를 둠. 카르나크 대열주실, 아부심벨 신전 완성.',
                  ],
                },
                {
                  key: 'era_4',
                  dotColor: 'bg-slate-500',
                  title: '4. 프톨레마이오스 왕조 & 로마 (BC 305 ~ AD 641)',
                  tag: '헬레니즘 융합',
                  bullets: [
                    '알렉산더 대왕 사후 마케도니아계 그리스 장군 프톨레마이오스가 왕조 창시.',
                    '지중해의 중심 알렉산드리아 도서관 및 등대 건설.',
                    '마지막 여왕 클레오파트라 7세 사망 후 로마 제국의 직할 속주로 편입.',
                  ],
                },
              ].map((era) => {
                const open = isOpen(era.key);
                return (
                  <div key={era.key} className="relative">
                    <span className={`absolute -left-5 top-3 w-3.5 h-3.5 rounded-full ${era.dotColor} ring-3 ring-slate-100`} />
                    <div
                      onClick={() => toggleKey(era.key)}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        era.highlight
                          ? 'bg-blue-50/40 border-blue-200 hover:border-blue-300'
                          : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-blue-600 block">
                            {era.tag}
                          </span>
                          <h4 className="font-bold text-slate-900 text-xs mt-0.5 truncate">
                            {era.title}
                          </h4>
                        </div>
                        <span className="text-slate-400 shrink-0">
                          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </div>

                      {open && (
                        <ul className="mt-2 pt-2 border-t border-slate-200/70 text-xs text-slate-600 space-y-1.5 leading-relaxed">
                          {era.bullets.map((b, idx) => (
                            <li key={idx}>• {b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GIZA PYRAMIDS GUIDE */}
      {subTab === 'GIZA' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  🏜️ 기자 피라미드 투어 핵심 가이드
                </h3>
                <p className="text-[11px] text-slate-500">
                  DAY 2 오전 투어 · 기본 입장료 700 EGP (신용카드 전용)
                </p>
              </div>
            </div>

            {/* Expandable Cards for Giza */}
            <div className="space-y-2">
              {/* 1. 3 Pyramids */}
              <div
                onClick={() => toggleKey('giza_3pyramids')}
                className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        1. 기자 3대 피라미드 (쿠푸·카프레·멘카우레) 구별법
                      </h4>
                      <p className="text-[11px] text-slate-500">꼭대기 외장석과 크기로 한눈에 구분하는 법</p>
                    </div>
                  </div>
                  {isOpen('giza_3pyramids') ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>

                {isOpen('giza_3pyramids') && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs mt-3 pt-2.5 border-t border-slate-200/70">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-amber-900 block mb-1">1. 쿠푸 대피라미드</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        • 세계 7대 불가사의 중 유일 현존.<br />
                        • 높이 약 139m, 2.5톤 석재 230만 개.<br />
                        • 꼭대기가 뭉툭하게 깎여 있음.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-blue-900 block mb-1">2. 카프레 피라미드</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        • 쿠푸의 아들 카프레의 무덤.<br />
                        • <strong>꼭대기 1/3에 매끄러운 석회암 외장석</strong>이 남아있어 쉽게 구별 가능.<br />
                        • 스핑크스와 일직선 연결.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">3. 멘카우레 피라미드</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        • 카프레의 아들 멘카우레.<br />
                        • 높이 65m로 셋 중 가장 아담함.<br />
                        • 기단부에 아스완 붉은 화강암 흔적.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Interior Room Dilemma */}
              <div
                onClick={() => toggleKey('giza_interior')}
                className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      🚪 2. 쿠푸 피라미드 내부 입장(추가 900 EGP), 들어갈까 말까?
                    </h4>
                    <p className="text-[11px] text-slate-500">결론: 더위·폐소공포가 있다면 외부 관람만으로도 충분</p>
                  </div>
                  {isOpen('giza_interior') ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>

                {isOpen('giza_interior') && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 space-y-1.5 text-xs text-slate-600 leading-relaxed">
                    <p>• <strong>결론부터</strong>: 더위와 좁은 공간을 힘들어하신다면 <strong>외부 관람만으로도 충분</strong>합니다.</p>
                    <p>• <strong>내부 상태</strong>: 허리를 완전히 굽힌 채 좁고 가파른 오르막 경사로(대회랑)를 10여 분 올라가야 합니다.</p>
                    <p>• <strong>왕의 방 도착 시</strong>: 유물이나 벽화는 전혀 없으며, 텅 빈 붉은 화강암 석관 틀 하나만 놓여 있습니다.</p>
                    <p>• <strong>추천 대상</strong>: "고대 4,500년 전 피라미드의 심장부에 직접 서봤다"는 상징적 경험을 원하시는 분께만 권장합니다.</p>
                  </div>
                )}
              </div>

              {/* 3. Shuttles vs Camels */}
              <div
                onClick={() => toggleKey('giza_safety')}
                className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 hover:border-rose-300 transition cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-950">
                        3. 내부 이동 수단 & 호객꾼 대처 절대 원칙
                      </h4>
                      <p className="text-[11px] text-rose-700">공식 전기 셔틀 활용법 및 낙타·마차 삐끼 퇴치법</p>
                    </div>
                  </div>
                  {isOpen('giza_safety') ? <ChevronUp className="w-4 h-4 text-rose-400" /> : <ChevronDown className="w-4 h-4 text-rose-400" />}
                </div>

                {isOpen('giza_safety') && (
                  <ul className="mt-2.5 pt-2.5 border-t border-rose-200/70 text-xs text-rose-950 space-y-1.5 leading-relaxed">
                    <li>• <strong>공식 전기 카트/셔틀 (700 EGP) 추천</strong>: 매표소에서 공식 카드 결제로 이용 가능하며 파노라마 뷰포인트까지 바가지 없이 순환합니다.</li>
                    <li>• <strong>낙타/마차 삐끼 주의</strong>: "무료로 사진 찍어주겠다", "티켓 보여달라", "걸어가면 5시간 걸린다(거짓말)"며 접근합니다.</li>
                    <li>• <strong>대처법</strong>: 눈 마주치지 말고 단호하게 고개를 가로저으며 <strong>"라, 슈크란(La, Shukran)"</strong>을 말하고 앞만 보고 걸어가세요.</li>
                  </ul>
                )}
              </div>

              {/* 4. Photo Spots */}
              <div
                onClick={() => toggleKey('giza_photo')}
                className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        4. 놓치면 후회하는 기자 3대 포토 스팟
                      </h4>
                      <p className="text-[11px] text-slate-500">9 Pyramids 뷰포인트 · 스핑크스 · 피자헛 테라스</p>
                    </div>
                  </div>
                  {isOpen('giza_photo') ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>

                {isOpen('giza_photo') && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs mt-3 pt-2.5 border-t border-slate-200/70">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">📸 9 Pyramids 뷰포인트</span>
                      <p className="text-[11px] text-slate-600">
                        사막 언덕 너머로 9개의 피라미드가 겹쳐지는 파노라마 명당 (셔틀 정류장 인근).
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">📸 스핑크스 뽀뽀/손받침</span>
                      <p className="text-[11px] text-slate-600">
                        스핑크스 우측 관람로에서 원근법을 이용해 스핑크스 입술에 뽀뽀하거나 손바닥 위에 올리는 샷.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">📸 기자 피자헛 테라스</span>
                      <p className="text-[11px] text-slate-600">
                        스핑크스 정문 맞은편 피자헛 2층/옥상에서 피라미드와 스핑크스를 정면으로 보며 휴식.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GEM GRAND EGYPTIAN MUSEUM */}
      {subTab === 'GEM' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  🏛️ GEM (이집트 대박물관) 4단계 관람 동선
                </h3>
                <p className="text-[11px] text-slate-500">
                  입장료 1,500 EGP (사전 온라인 예약 필수 · 카드 전용)
                </p>
              </div>
            </div>

            {/* Compact Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">권장 소요시간</span>
                <span className="font-bold text-slate-800">3.5 ~ 4시간</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">추천 시간대</span>
                <span className="font-bold text-slate-800">13:00 ~ 15:00</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">결제 수단</span>
                <span className="font-bold text-rose-600">카드 전용</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">실내 복장</span>
                <span className="font-bold text-slate-800">가디건 필수 (냉방)</span>
              </div>
            </div>

            {/* 4 Steps Accordion */}
            <div className="space-y-2">
              {[
                {
                  key: 'gem_step1',
                  step: 'STEP 1',
                  title: '메인 아트리움 (Atrium) - 람세스 2세 거대 석상',
                  sub: '도착 즉시 마주하는 높이 11m, 무게 83톤의 붉은 화강암 석상',
                  bullets: [
                    '박물관 입구에 들어서면 높이 11m, 무게 83톤에 달하는 3,200년 된 람세스 2세의 거대한 붉은 화강암 조각상이 관람객을 압도합니다.',
                    '현대적인 삼각형 패턴의 유리 지붕에서 쏟아지는 자연광과 함께 기념사진을 촬영하세요.',
                  ],
                },
                {
                  key: 'gem_step2',
                  step: 'STEP 2',
                  title: '대계단 (Grand Staircase) & 피라미드 파노라마 뷰',
                  sub: '60여 점의 거대 석상 + 꼭대기 통유리창 피라미드 액자 뷰',
                  bullets: [
                    '4개의 테마(왕실의 형상 → 신성한 장소 → 종교적 신앙 → 사후세계로의 여정)로 배치된 60여 점의 거대 석상 사이를 걸어 올라갑니다.',
                    '★핵심 포인트: 대계단 꼭대기에 서면, 초대형 통유리창 너머로 실제 기자 피라미드가 액자처럼 펼쳐지는 장관을 조망할 수 있습니다.',
                  ],
                },
                {
                  key: 'gem_step3',
                  step: 'STEP 3',
                  title: '메인 갤러리 12개 관 (Main Galleries)',
                  sub: '선사시대부터 그리스-로마 시대까지 시대순 핵심 유물 탐방',
                  bullets: [
                    '선사시대부터 고왕국, 중왕국, 신왕국, 그리스-로마 시대까지 최첨단 조명과 전시 기법으로 구성되어 있습니다.',
                    '놓치지 말아야 할 보물: 제4왕조 피라미드 건설자들의 가족 조각상, 헤테페레스 여왕의 침대와 보석함, 완벽히 보존된 목조 채색상들.',
                  ],
                },
                {
                  key: 'gem_step4',
                  step: 'STEP 4',
                  title: '투탕카멘 특별 갤러리 (Tutankhamun Galleries)',
                  sub: '황금 마스크와 순금 속관 등 발굴 보물 5,000점 전체 전시',
                  bullets: [
                    '1922년 하워드 카터가 발굴한 투탕카멘 무덤의 부장품 전체가 사상 최초로 한자리에 모였습니다.',
                    '순금 110kg의 속관, 황금 마스크, 화려한 보석과 전차, 황금 의자 등 고대 이집트 금세공 기술의 정점을 마주할 수 있습니다.',
                  ],
                },
              ].map((s) => {
                const open = isOpen(s.key);
                return (
                  <div
                    key={s.key}
                    onClick={() => toggleKey(s.key)}
                    className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="font-extrabold text-blue-600 font-mono">{s.step}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-500 truncate">{s.sub}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                          {s.title}
                        </h4>
                      </div>
                      <span className="text-slate-400 shrink-0">
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>

                    {open && (
                      <ul className="mt-2.5 pt-2.5 border-t border-slate-200/70 text-xs text-slate-600 space-y-1.5 leading-relaxed">
                        {s.bullets.map((b, i) => (
                          <li key={i}>• {b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LUXOR POINTS GUIDE */}
      {subTab === 'LUXOR' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                🏛️ 룩소르 서안 & 동안 핵심 포인트
              </h3>
              <p className="text-[11px] text-slate-500">
                DAY 3 ~ DAY 5 · 각 유적지를 눌러 추천 무덤과 관람 포인트를 확인하세요.
              </p>
            </div>

            {/* West Bank */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-extrabold text-amber-700">서안 (West Bank)</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">태양이 지는 사자의 영역 (오전 투어 추천)</span>
              </div>

              {[
                {
                  key: 'lux_valley',
                  title: '1. 왕가의 계곡 (Valley of the Kings)',
                  meta: '750 EGP · 기본 3개 무덤 선택 관람',
                  bullets: [
                    '피라미드 도굴을 피하기 위해 바위산 깊숙이 굴을 파 만든 60여 개의 왕실 지하 무덤군.',
                    '추천 무덤: 람세스 4세(KV2) - 천장의 누트 여신 천문도 벽화가 환상적임. 람세스 9세(KV6) - 경사가 완만하고 색채 선명.',
                    '투탕카멘 무덤 (KV62, 추가 700 EGP): 다른 보물은 박물관에 있지만, 투탕카멘의 실제 미라 실물은 여전히 이 무덤 석관 안에 잠들어 있습니다.',
                  ],
                },
                {
                  key: 'lux_hatshepsut',
                  title: '2. 하트셉수트 여왕 장제전 (Deir el-Bahari)',
                  meta: '440 EGP · 절벽 아래 3단 테라스 건축의 극치',
                  bullets: [
                    '깎아지른 붉은 석회암 절벽을 배경으로 3개 층의 테라스가 이어진 독창적인 고대 건축물.',
                    '남성처럼 가짜 턱수염을 달고 파라오로 군림한 하트셉수트 여왕의 무역 원정 기록과 부조가 돋보입니다.',
                    '그늘이 전혀 없으므로 양산, 선글라스 필수입니다.',
                  ],
                },
                {
                  key: 'lux_memnon',
                  title: '3. 멤논의 거상 (Colossi of Memnon)',
                  meta: '무료 관람 · 서안 투어 초입 포토존',
                  bullets: [
                    '높이 18m의 거대한 아멘호테프 3세 석상 2기.',
                    '기원전 27년 지진 후 매일 새벽마다 바람이 석상 균열을 스치며 슬픈 노랫소리를 내어, 트로이 전쟁에서 전사한 멤논이 어머니(새벽의 여신)에게 인사하는 소리라 여겨졌습니다.',
                  ],
                },
              ].map((spot) => {
                const open = isOpen(spot.key);
                return (
                  <div
                    key={spot.key}
                    onClick={() => toggleKey(spot.key)}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] font-semibold text-amber-700 block">
                          {spot.meta}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                          {spot.title}
                        </h4>
                      </div>
                      <span className="text-slate-400 shrink-0">
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>

                    {open && (
                      <ul className="mt-2 pt-2 border-t border-slate-200/70 text-xs text-slate-600 space-y-1.5 leading-relaxed">
                        {spot.bullets.map((b, i) => (
                          <li key={i}>• {b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            {/* East Bank */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-extrabold text-blue-700">동안 (East Bank)</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">태양이 떠오르는 삶의 영역 (오후~야간 추천)</span>
              </div>

              {[
                {
                  key: 'lux_karnak',
                  title: '1. 카르나크 대신전 (Karnak Temple)',
                  meta: '450 EGP · 134개 대열주실 & 소원 스카라베',
                  bullets: [
                    '134개의 대열주실: 높이 21m, 둘레 10m의 거대한 파피루스 돌기둥들이 빽빽이 들어선 고대 건축의 기적.',
                    '하트셉수트 오벨리스크: 30m 높이의 단일 화강암으로 세워진 웅장한 기념비.',
                    '스카라베(쇠똥구리) 석상: 성스러운 호수 옆 석상을 시계 반대 방향으로 7바퀴 돌며 소원을 빌면 이루어진다는 전설이 있습니다.',
                  ],
                },
                {
                  key: 'lux_temple',
                  title: '2. 룩소르 신전 (Luxor Temple)',
                  meta: '400 EGP · 일몰 후 야경 필수 방문 코스',
                  bullets: [
                    '반드시 일몰 후(18:00~20:00) 야간 개장 때 방문하세요. 은은한 조명을 받은 람세스 2세 거대 석상들의 야경이 낮보다 훨씬 낭만적입니다.',
                    '오벨리스크의 짝: 원래 입구 좌우에 2기가 있었으나, 1기는 프랑스에 선물로 주어져 현재 파리 콩코르드 광장에 서 있습니다.',
                    '신전 상단에 지어진 아부 엘 하고그 모스크와의 공존도 독특한 관전 포인트입니다.',
                  ],
                },
                {
                  key: 'lux_felucca',
                  title: '3. 나일강 펠루카 (Felucca) 일몰 세일링',
                  meta: '배 1척 약 300~400 EGP · 16:30~17:30 골든아워',
                  bullets: [
                    '엔진 소리 없이 오직 바람과 나일강 물결에 몸을 맡기는 고대 전통 삼각 돛단배.',
                    '승선 시간: 일몰 직전 16:30 ~ 17:30에 승선하면 붉게 물드는 나일강 석양과 서안 산맥의 실루엣을 감상할 수 있습니다.',
                    '적정 요금: 1시간 대절 기준 약 300 ~ 400 EGP (배 1척 기준).',
                  ],
                },
              ].map((spot) => {
                const open = isOpen(spot.key);
                return (
                  <div
                    key={spot.key}
                    onClick={() => toggleKey(spot.key)}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] font-semibold text-blue-600 block">
                          {spot.meta}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                          {spot.title}
                        </h4>
                      </div>
                      <span className="text-slate-400 shrink-0">
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>

                    {open && (
                      <ul className="mt-2 pt-2 border-t border-slate-200/70 text-xs text-slate-600 space-y-1.5 leading-relaxed">
                        {spot.bullets.map((b, i) => (
                          <li key={i}>• {b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
