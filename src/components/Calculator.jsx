import React, { useState, useReducer } from 'react';
import moment from 'moment-timezone';

// State management with useReducer
const initialPersonState = {
  name: '',
  birthDate: '',
  birthTime: '12:00',
  birthPlace: '',
  birthTimezone: 'UTC',
  gender: 'female',
};

const personReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialPersonState;
    default:
      return state;
  }
};

// Reusable styled components
const FormContainer = ({ children }) => (
  <div className="p-6 bg-white rounded-lg shadow-lg mb-8">{children}</div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-xl font-semibold mb-4">{children}</h2>
);

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4">
      <button
        className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title} {isOpen ? '▼' : '▶'}
      </button>
      {isOpen && <div className="p-4 bg-gray-50 rounded-md">{children}</div>}
    </div>
  );
};

// Helper components
const InputField = ({ label, type = 'text', value, onChange, helpText = null, error = null }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor={label}>
      {label}
    </label>
    <input
      id={label}
      type={type}
      className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
      value={value}
      onChange={onChange}
      required
      aria-describedby={helpText ? `${label}-help` : undefined}
    />
    {helpText && (
      <p id={`${label}-help`} className="mt-1 text-xs text-gray-500">
        {helpText}
      </p>
    )}
    {error && (
      <p className="mt-1 text-xs text-red-500">{error}</p>
    )}
  </div>
);

const SelectField = ({ label, value, onChange, options, helpText = null, error = null }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor={label}>
      {label}
    </label>
    <select
      id={label}
      className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
      value={value}
      onChange={onChange}
      required
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {helpText && (
      <p id={`${label}-help`} className="mt-1 text-xs text-gray-500">
        {helpText}
      </p>
    )}
    {error && (
      <p className="mt-1 text-xs text-red-500">{error}</p>
    )}
  </div>
);

// Toast notification component
const Toast = ({ message, type = 'error', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
      {message}
      <button className="ml-4 text-white" onClick={onClose}>×</button>
    </div>
  );
};

// Progress bar component for scores and elemental balance
const ProgressBar = ({ label, value, max = 100, color = 'bg-blue-500' }) => (
  <div className="mb-2">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-medium text-gray-700">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

// Chinese New Year dates (expanded to 1900–2030)
const chineseNewYearDates = {
  1900: '1900-01-31', 1901: '1901-02-19', 1902: '1902-02-08', 1903: '1903-01-29', 1904: '1904-02-16',
  1905: '1905-02-04', 1906: '1906-01-25', 1907: '1907-02-13', 1908: '1908-02-02', 1909: '1909-01-22',
  1910: '1910-02-10', 1911: '1911-01-30', 1912: '1912-02-18', 1913: '1913-02-06', 1914: '1914-01-26',
  1915: '1915-02-14', 1916: '1916-02-03', 1917: '1917-01-23', 1918: '1918-02-11', 1919: '1919-02-01',
  1920: '1920-02-20', 1921: '1921-02-08', 1922: '1922-01-28', 1923: '1923-02-16', 1924: '1924-02-05',
  1925: '1925-01-24', 1926: '1926-02-13', 1927: '1927-02-02', 1928: '1928-01-23', 1929: '1929-02-10',
  1930: '1930-01-30', 1931: '1931-02-17', 1932: '1932-02-06', 1933: '1933-01-26', 1934: '1934-02-14',
  1935: '1935-02-04', 1936: '1936-01-24', 1937: '1937-02-11', 1938: '1938-01-31', 1939: '1939-02-19',
  1940: '1940-02-08', 1941: '1941-01-27', 1942: '1942-02-15', 1943: '1943-02-05', 1944: '1944-01-25',
  1945: '1945-02-13', 1946: '1946-02-02', 1947: '1947-01-22', 1948: '1948-02-10', 1949: '1949-01-29',
  1950: '1950-02-17', 1951: '1951-02-06', 1952: '1952-01-27', 1953: '1953-02-14', 1954: '1954-02-03',
  1955: '1955-01-24', 1956: '1956-02-12', 1957: '1957-01-31', 1958: '1958-02-18', 1959: '1959-02-08',
  1960: '1960-01-28', 1961: '1961-02-15', 1962: '1962-02-05', 1963: '1963-01-25', 1964: '1964-02-13',
  1965: '1965-02-02', 1966: '1966-01-21', 1967: '1967-02-09', 1968: '1968-01-30', 1969: '1969-02-17',
  1970: '1970-02-06', 1971: '1971-01-27', 1972: '1972-02-15', 1973: '1973-02-03', 1974: '1974-01-23',
  1975: '1975-02-11', 1976: '1976-01-31', 1977: '1977-02-18', 1978: '1978-02-07', 1979: '1979-01-28',
  1980: '1980-02-16', 1981: '1981-02-05', 1982: '1982-01-25', 1983: '1983-02-13', 1984: '1984-02-02',
  1985: '1985-02-20', 1986: '1986-02-09', 1987: '1987-01-29', 1988: '1988-02-17', 1989: '1989-02-06',
  1990: '1990-01-27', 1991: '1991-02-15', 1992: '1992-02-04', 1993: '1993-01-23', 1994: '1994-02-10',
  1995: '1995-01-31', 1996: '1996-02-19', 1997: '1997-02-07', 1998: '1998-01-28', 1999: '1999-02-16',
  2000: '2000-02-05', 2001: '2001-01-24', 2002: '2002-02-12', 2003: '2003-02-01', 2004: '2004-01-22',
  2005: '2005-02-09', 2006: '2006-01-29', 2007: '2007-02-18', 2008: '2008-02-07', 2009: '2009-01-26',
  2010: '2010-02-14', 2011: '2011-02-03', 2012: '2012-01-23', 2013: '2013-02-10', 2014: '2014-01-31',
  2015: '2015-02-19', 2016: '2016-02-08', 2017: '2017-01-28', 2018: '2018-02-16', 2019: '2019-02-05',
  2020: '2020-01-25', 2021: '2021-02-12', 2022: '2022-02-01', 2023: '2023-01-22', 2024: '2024-02-10',
  2025: '2025-01-29', 2026: '2026-02-17', 2027: '2027-02-06', 2028: '2028-01-26', 2029: '2029-02-13',
  2030: '2030-02-03'
};

// Helper functions for astrology calculations
const calculateChineseZodiac = (dateString) => {
  if (!dateString) return null;
  
  const date = moment(dateString, 'YYYY-MM-DD', true);
  if (!date.isValid()) return null;
  const year = date.year();
  
  const currentCNY = chineseNewYearDates[year] ? moment(chineseNewYearDates[year]) : moment(`${year}-02-05`);
  const prevCNY = chineseNewYearDates[year-1] ? moment(chineseNewYearDates[year-1]) : moment(`${year-1}-02-05`);
  
  const isBeforeCNY = date.isBefore(currentCNY, 'day');
  const zodiacYear = isBeforeCNY ? year - 1 : year;
  
  const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 
                  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const yinYang = ['Yang', 'Yin'];
  
  const cycle = (zodiacYear - 4) % 60;
  const animalIndex = cycle % 12;
  const elementIndex = Math.floor(cycle / 2) % 5;
  const yinYangIndex = cycle % 2;
  
  const strengths = getZodiacStrengths(animals[animalIndex]);
  const weaknesses = getZodiacWeaknesses(animals[animalIndex]);
  const elementInfluence = getElementTraits(elements[elementIndex]);
  const yinYangInfluence = yinYangIndex === 0 ? 'assertive, outward-focused, and leadership-driven tendencies' : 'receptive, introspective, and collaborative tendencies';
  
  return {
    animal: animals[animalIndex],
    element: elements[elementIndex],
    yinYang: yinYang[yinYangIndex],
    description: `The ${elements[elementIndex]} ${animals[animalIndex]} (${yinYang[yinYangIndex]}) embodies distinct characteristics shaped by its zodiac and elemental influences. As a ${animals[animalIndex]}, the individual is often ${strengths}, yet may face challenges with ${weaknesses}. The ${elements[elementIndex]} element infuses ${elementInfluence}, enhancing the native's approach to life. The ${yinYang[yinYangIndex]} energy drives ${yinYangInfluence}, influencing interpersonal dynamics and decision-making processes. This combination suggests a personality that balances ${getZodiacLifePath(animals[animalIndex], elements[elementIndex])}.`,
    strengths: strengths,
    weaknesses: weaknesses,
    lifePath: getZodiacLifePath(animals[animalIndex], elements[elementIndex])
  };
};

const getZodiacStrengths = (animal) => {
  const strengths = {
    Rat: 'intelligent, adaptable, resourceful, quick-witted, and charming',
    Ox: 'diligent, reliable, patient, determined, and trustworthy',
    Tiger: 'brave, confident, charismatic, passionate, and ambitious',
    Rabbit: 'gentle, elegant, compassionate, intuitive, and diplomatic',
    Dragon: 'ambitious, energetic, visionary, courageous, and charismatic',
    Snake: 'wise, intuitive, discreet, analytical, and sophisticated',
    Horse: 'free-spirited, enthusiastic, sociable, adventurous, and dynamic',
    Goat: 'creative, kind, empathetic, nurturing, and artistic',
    Monkey: 'clever, versatile, witty, inventive, and sociable',
    Rooster: 'observant, hardworking, confident, organized, and articulate',
    Dog: 'loyal, honest, protective, empathetic, and dependable',
    Pig: 'generous, sincere, diligent, compassionate, and optimistic'
  };
  return strengths[animal] || 'versatile and balanced';
};

const getZodiacWeaknesses = (animal) => {
  const weaknesses = {
    Rat: 'overly cautious, manipulative, or prone to greed',
    Ox: 'stubborn, overly serious, or resistant to change',
    Tiger: 'impulsive, arrogant, or prone to restlessness',
    Rabbit: 'conflict-averse, overly sensitive, or indecisive',
    Dragon: 'arrogant, impatient, or overly dominant',
    Snake: 'secretive, jealous, or overly suspicious',
    Horse: 'restless, impulsive, or lacking perseverance',
    Goat: 'indecisive, overly emotional, or prone to worry',
    Monkey: 'manipulative, arrogant, or overly opportunistic',
    Rooster: 'critical, boastful, or overly perfectionistic',
    Dog: 'pessimistic, anxious, or overly cautious',
    Pig: 'naive, overly trusting, or prone to indulgence'
  };
  return weaknesses[animal] || 'occasional lack of focus';
};

const getElementTraits = (element) => {
  const traits = {
    Wood: 'growth, creativity, flexibility, leadership, innovation, and a drive for expansion; promotes vision and adaptability',
    Fire: 'passion, energy, dynamism, enthusiasm, charisma, and warmth; drives inspiration and bold action',
    Earth: 'stability, nurturing, practicality, reliability, care, and groundedness; fosters trust and balance',
    Metal: 'strength, discipline, clarity, focus, determination, and resilience; enhances precision and structure',
    Water: 'wisdom, adaptability, intuition, depth, flow, and insight; encourages emotional intelligence and flexibility'
  };
  return traits[element] || 'balanced attributes';
};

const getZodiacLifePath = (animal, element) => {
  const lifePaths = {
    Rat: `a path of strategic growth, leveraging intelligence and adaptability to navigate challenges. With ${element}, this path emphasizes ${element.toLowerCase()}-driven opportunities.`,
    Ox: `a journey of steady achievement, building lasting success through diligence. ${element} infuses ${element.toLowerCase()}-based reliability.`,
    Tiger: `a bold quest for leadership and impact, driven by courage. ${element} enhances ${element.toLowerCase()}-inspired ambition.`,
    Rabbit: `a harmonious path of connection and empathy, fostering peace. ${element} promotes ${element.toLowerCase()}-guided diplomacy.`,
    Dragon: `a visionary pursuit of greatness, marked by ambition. ${element} fuels ${element.toLowerCase()}-powered innovation.`,
    Snake: `a reflective journey of wisdom and insight, guided by intuition. ${element} deepens ${element.toLowerCase()}-rooted analysis.`,
    Horse: `an adventurous path of freedom and exploration, driven by enthusiasm. ${element} amplifies ${element.toLowerCase()}-charged energy.`,
    Goat: `a creative life of nurturing and artistry, centered on empathy. ${element} supports ${element.toLowerCase()}-based compassion.`,
    Monkey: `a versatile journey of ingenuity and wit, thriving on adaptability. ${element} enhances ${element.toLowerCase()}-driven creativity.`,
    Rooster: `a disciplined path of achievement and precision, marked by confidence. ${element} strengthens ${element.toLowerCase()}-focused organization.`,
    Dog: `a loyal pursuit of integrity and protection, grounded in honesty. ${element} bolsters ${element.toLowerCase()}-rooted trust.`,
    Pig: `a sincere life of generosity and harmony, driven by compassion. ${element} fosters ${element.toLowerCase()}-inspired optimism.`
  };
  return lifePaths[animal] || 'a balanced path of versatile growth';
};

const calculateBazi = (birthDate, birthTime) => {
  const date = moment(birthDate + ' ' + birthTime, 'YYYY-MM-DD HH:mm', true);
  if (!date.isValid()) return null;
  const year = date.year();
  const month = date.month() + 1;
  const day = date.date();
  const hour = date.hour();
  
  const stems = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
  const branches = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
  const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
  const branchElements = {
    Zi: 'Water', Chou: 'Earth', Yin: 'Wood', Mao: 'Wood', Chen: 'Earth', Si: 'Fire',
    Wu: 'Fire', Wei: 'Earth', Shen: 'Metal', You: 'Metal', Xu: 'Earth', Hai: 'Water'
  };
  
  const yearStem = stems[(year - 4) % 10];
  const yearBranch = branches[(year - 4) % 12];
  const monthStem = stems[(month + 1) % 10];
  const monthBranch = branches[(month + 1) % 12];
  const dayStem = stems[(Math.abs(day - 1) % 10)];
  const dayBranch = branches[day % 12];
  const hourStem = stems[hour % 10];
  const hourBranch = branches[Math.floor(hour / 2) % 12];
  
  const dayMaster = dayStem;
  const elementCounts = {
    Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0
  };
  
  [yearStem, monthStem, dayStem, hourStem].forEach(stem => {
    const idx = stems.indexOf(stem);
    elementCounts[elements[idx]]++;
  });
  
  [yearBranch, monthBranch, dayBranch, hourBranch].forEach(branch => {
    elementCounts[branchElements[branch]]++;
  });
  
  const tenGods = calculateTenGods(dayMaster, [yearStem, monthStem, hourStem], [yearBranch, monthBranch, dayBranch, hourBranch]);
  const clashes = calculateClashes([yearBranch, monthBranch, dayBranch, hourBranch]);
  const combinations = calculateCombinations([yearBranch, monthBranch, dayBranch, hourBranch]);
  
  const maxStrength = Math.max(...Object.values(elementCounts));
  const energyChart = Object.entries(elementCounts).map(([element, count]) => {
    const bars = '█'.repeat(Math.round((count / maxStrength) * 10));
    return `${element.padEnd(6)}: ${bars} (${count})`;
  }).join('\n');
  
  const pillarInteractions = [
    `Year (${yearStem} ${yearBranch}): Shapes social persona, ancestral legacy, and early life influences. Element: ${elements[stems.indexOf(yearStem)]}.`,
    `Month (${monthStem} ${monthBranch}): Governs career aspirations, parental relationships, and mid-life dynamics. Element: ${elements[(month + 1) % 5]}.`,
    `Day (${dayStem} ${dayBranch}): Represents core self, personal identity, and spousal relationships. Element: ${elements[stems.indexOf(dayStem)]}.`,
    `Hour (${hourStem} ${hourBranch}): Influences creativity, offspring, and late-life aspirations. Element: ${elements[hour % 5]}.`
  ];
  
  const recommendations = getBaziRecommendations(elementCounts, dayMaster, clashes, combinations);
  const lifePath = getBaziLifePath(dayMaster, elementCounts, tenGods);
  
  return {
    pillars: [
      { stem: yearStem, branch: yearBranch, element: elements[stems.indexOf(yearStem)] },
      { stem: monthStem, branch: monthBranch, element: elements[(month + 1) % 5] },
      { stem: dayStem, branch: dayBranch, element: elements[stems.indexOf(dayStem)] },
      { stem: hourStem, branch: hourBranch, element: elements[hour % 5] }
    ],
    dayMaster: `${dayMaster} (${elements[stems.indexOf(dayMaster)]})`,
    elementBalance: elementCounts,
    tenGods: tenGods,
    energyChart: energyChart,
    pillarInteractions: pillarInteractions,
    clashes: clashes,
    combinations: combinations,
    recommendations: recommendations,
    lifePath: lifePath,
    analysis: `The Day Master ${dayMaster} (${elements[stems.indexOf(dayMaster)]}) reflects a ${getDayMasterStrength(dayMaster, elementCounts)} personality, characterized by ${getDayMasterTraits(dayMaster)}. The elemental balance indicates ${describeElementBalance(elementCounts)}. Ten Gods reveal ${describeTenGods(tenGods)}. Pillar interactions: ${pillarInteractions.join(' ')} Clashes (${clashes.join(', ')}) suggest ${getClashImplications(clashes)}, while combinations (${combinations.join(', ')}) promote ${getCombinationImplications(combinations)}. Life path: ${lifePath}. Recommendations: ${recommendations.join(' ')}`
  };
};

const calculateTenGods = (dayMaster, stems, branches) => {
  const stemRelations = {
    Jia: { Jia: 'Companion', Yi: 'Companion', Bing: 'Output', Ding: 'Output', Wu: 'Wealth', Ji: 'Wealth', Geng: 'Authority', Xin: 'Authority', Ren: 'Resource', Gui: 'Resource' },
    Yi: { Jia: 'Companion', Yi: 'Companion', Bing: 'Output', Ding: 'Output', Wu: 'Wealth', Ji: 'Wealth', Geng: 'Authority', Xin: 'Authority', Ren: 'Resource', Gui: 'Resource' },
    Bing: { Bing: 'Companion', Ding: 'Companion', Wu: 'Output', Ji: 'Output', Geng: 'Wealth', Xin: 'Wealth', Ren: 'Authority', Gui: 'Authority', Jia: 'Resource', Yi: 'Resource' },
    Ding: { Bing: 'Companion', Ding: 'Companion', Wu: 'Output', Ji: 'Output', Geng: 'Wealth', Xin: 'Wealth', Ren: 'Authority', Gui: 'Authority', Jia: 'Resource', Yi: 'Resource' },
    Wu: { Wu: 'Companion', Ji: 'Companion', Geng: 'Output', Xin: 'Output', Ren: 'Wealth', Gui: 'Wealth', Jia: 'Authority', Yi: 'Authority', Bing: 'Resource', Ding: 'Resource' },
    Ji: { Wu: 'Companion', Ji: 'Companion', Geng: 'Output', Xin: 'Output', Ren: 'Wealth', Gui: 'Wealth', Jia: 'Authority', Yi: 'Authority', Bing: 'Resource', Ding: 'Resource' },
    Geng: { Geng: 'Companion', Xin: 'Companion', Ren: 'Output', Gui: 'Output', Jia: 'Wealth', Yi: 'Wealth', Bing: 'Authority', Ding: 'Authority', Wu: 'Resource', Ji: 'Resource' },
    Xin: { Geng: 'Companion', Xin: 'Companion', Ren: 'Output', Gui: 'Output', Jia: 'Wealth', Yi: 'Wealth', Bing: 'Authority', Ding: 'Authority', Wu: 'Resource', Ji: 'Resource' },
    Ren: { Ren: 'Companion', Gui: 'Companion', Jia: 'Output', Yi: 'Output', Bing: 'Wealth', Ding: 'Wealth', Wu: 'Authority', Ji: 'Authority', Geng: 'Resource', Xin: 'Resource' },
    Gui: { Ren: 'Companion', Gui: 'Companion', Jia: 'Output', Yi: 'Output', Bing: 'Wealth', Ding: 'Wealth', Wu: 'Authority', Ji: 'Authority', Geng: 'Resource', Xin: 'Resource' }
  };
  
  const branchRelations = {
    Zi: 'Resource', Chou: 'Wealth', Yin: 'Output', Mao: 'Output', Chen: 'Wealth', Si: 'Companion',
    Wu: 'Companion', Wei: 'Wealth', Shen: 'Authority', You: 'Authority', Xu: 'Wealth', Hai: 'Resource'
  };
  
  const tenGods = {
    Companion: 'Supports teamwork, alliances, and peer relationships; fosters collaboration.',
    Output: 'Enhances creativity, expression, and innovation; drives individuality.',
    Wealth: 'Drives ambition, resource accumulation, and financial success; promotes diligence.',
    Authority: 'Promotes discipline, leadership, and influence; encourages responsibility.',
    Resource: 'Fosters learning, intuition, and support systems; enhances wisdom.'
  };
  
  stems.forEach(stem => {
    const relation = stemRelations[dayMaster][stem];
    tenGods[relation] = tenGods[relation] || '';
    tenGods[relation] += ` Stem ${stem} contributes to ${relation.toLowerCase()}.`;
  });
  
  branches.forEach(branch => {
    const relation = branchRelations[branch];
    tenGods[relation] = tenGods[relation] || '';
    tenGods[relation] += ` Branch ${branch} enhances ${relation.toLowerCase()}.`;
  });
  
  return tenGods;
};

const calculateClashes = (branches) => {
  const clashes = {
    Zi: 'Wu', Wu: 'Zi', Chou: 'Wei', Wei: 'Chou', Yin: 'Shen', Shen: 'Yin',
    Mao: 'You', You: 'Mao', Chen: 'Xu', Xu: 'Chen', Si: 'Hai', Hai: 'Si'
  };
  const clashList = [];
  
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (clashes[branches[i]] === branches[j]) {
        clashList.push(`${branches[i]}-${branches[j]}`);
      }
    }
  }
  
  return clashList.length ? clashList : ['No significant clashes'];
};

const calculateCombinations = (branches) => {
  const combinations = {
    'Yin-Mao': 'Wood', 'Shen-You': 'Metal', 'Si-Wu': 'Fire', 'Hai-Zi': 'Water', 'Chen-Chou-Xu-Wei': 'Earth'
  };
  const comboList = [];
  
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const pair = [branches[i], branches[j]].sort().join('-');
      if (combinations[pair]) {
        comboList.push(`${pair} forms ${combinations[pair]}`);
      }
    }
  }
  
  if (branches.includes('Chen') && branches.includes('Chou') && branches.includes('Xu') && branches.includes('Wei')) {
    comboList.push('Chen-Chou-Xu-Wei forms Earth');
  }
  
  return comboList.length ? comboList : ['No significant combinations'];
};

const getClashImplications = (clashes) => {
  if (clashes.includes('No significant clashes')) return 'a smooth flow of energy with minimal internal conflicts.';
  const implications = {
    'Zi-Wu': 'potential conflicts between intuition and action, requiring balance.',
    'Chou-Wei': 'tension between stability and adaptability, needing flexibility.',
    'Yin-Shen': 'clashes between ambition and discipline, demanding compromise.',
    'Mao-You': 'challenges in balancing diplomacy and structure, requiring patience.',
    'Chen-Xu': 'instability in grounding energies, needing focus on balance.',
    'Si-Hai': 'tension between passion and intuition, requiring emotional clarity.'
  };
  return clashes.map(clash => implications[clash] || 'dynamic energy requiring careful navigation').join(' ');
};

const getCombinationImplications = (combinations) => {
  if (combinations.includes('No significant combinations')) return 'neutral energy dynamics with balanced influences.';
  const implications = {
    'Yin-Mao forms Wood': 'enhanced creativity and growth, fostering innovation.',
    'Shen-You forms Metal': 'strengthened discipline and clarity, promoting structure.',
    'Si-Wu forms Fire': 'amplified passion and energy, driving enthusiasm.',
    'Hai-Zi forms Water': 'deepened intuition and wisdom, encouraging flow.',
    'Chen-Chou-Xu-Wei forms Earth': 'strong grounding and stability, supporting reliability.'
  };
  return combinations.map(combo => implications[combo] || 'harmonious energy alignment').join(' ');
};

const getBaziRecommendations = (elementCounts, dayMaster, clashes, combinations) => {
  const recommendations = [];
  const dominant = Object.entries(elementCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const missing = Object.entries(elementCounts).filter(([_, count]) => count === 0).map(([e]) => e);
  
  if (missing.length) {
    recommendations.push(`Incorporate ${missing.join(' and ')} elements through lifestyle choices (e.g., colors like ${getElementColors(missing)}, environments, or activities) to balance energy deficiencies.`);
  }
  if (elementCounts[dominant] > 3) {
    recommendations.push(`Moderate excessive ${dominant} influence by engaging in activities that enhance ${getCounterElement(dominant)} (e.g., ${getCounterElementActivities(getCounterElement(dominant))}).`);
  }
  if (clashes.length && !clashes.includes('No significant clashes')) {
    recommendations.push(`Address clashes (${clashes.join(', ')}) by fostering ${getClashResolution(clashes)} to harmonize conflicting energies.`);
  }
  if (combinations.length && !combinations.includes('No significant combinations')) {
    recommendations.push(`Leverage combinations (${combinations.join(', ')}) to enhance ${getCombinationBenefits(combinations)} in personal and professional pursuits.`);
  }
  recommendations.push(`Strengthen the ${dayMaster} Day Master by focusing on ${getDayMasterTraits(dayMaster).split(', ')[0]} through ${getDayMasterActivities(dayMaster)}.`);
  return recommendations;
};

const getElementColors = (elements) => {
  const colors = {
    Wood: 'green or brown',
    Fire: 'red or orange',
    Earth: 'yellow or beige',
    Metal: 'white or gold',
    Water: 'blue or black'
  };
  return elements.map(e => colors[e]).join(' and ');
};

const getCounterElement = (element) => {
  const counters = {
    Wood: 'Metal',
    Fire: 'Water',
    Earth: 'Wood',
    Metal: 'Fire',
    Water: 'Earth'
  };
  return counters[element] || 'balance';
};

const getCounterElementActivities = (element) => {
  const activities = {
    Wood: 'creative projects, networking, or outdoor activities',
    Fire: 'public speaking, leadership roles, or dynamic sports',
    Earth: 'community service, gardening, or organizational tasks',
    Metal: 'strategic planning, martial arts, or precision-based hobbies',
    Water: 'meditation, writing, or water-based activities'
  };
  return activities[element] || 'balanced pursuits';
};

const getClashResolution = (clashes) => {
  const resolutions = {
    'Zi-Wu': 'clear communication and emotional balance',
    'Chou-Wei': 'flexibility and openness to change',
    'Yin-Shen': 'compromise and mutual respect',
    'Mao-You': 'patience and structured dialogue',
    'Chen-Xu': 'grounding practices and stability',
    'Si-Hai': 'emotional clarity and intuitive alignment'
  };
  return clashes.map(clash => resolutions[clash] || 'harmonious dialogue').join(' and ');
};

const getCombinationBenefits = (combinations) => {
  const benefits = {
    'Yin-Mao forms Wood': 'creativity and innovation',
    'Shen-You forms Metal': 'discipline and structure',
    'Si-Wu forms Fire': 'passion and enthusiasm',
    'Hai-Zi forms Water': 'intuition and wisdom',
    'Chen-Chou-Xu-Wei forms Earth': 'stability and reliability'
  };
  return combinations.map(combo => benefits[combo] || 'synergistic growth').join(' and ');
};

const getDayMasterStrength = (dayMaster, elementCounts) => {
  const stemIndex = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'].indexOf(dayMaster);
  const dmElement = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'][stemIndex];
  const strength = elementCounts[dmElement] >= 2 ? 'strong' : 'weak';
  return strength === 'strong' ? 'resilient, self-reliant, and independent' : 'adaptable, collaborative, and supportive';
};

const getDayMasterTraits = (dayMaster) => {
  const traits = {
    Jia: 'leadership, ambition, and creativity',
    Yi: 'flexibility, diplomacy, and empathy',
    Bing: 'charisma, enthusiasm, and inspiration',
    Ding: 'warmth, creativity, and insight',
    Wu: 'reliability, stability, and trustworthiness',
    Ji: 'nurturing, practicality, and care',
    Geng: 'discipline, resilience, and determination',
    Xin: 'clarity, precision, and refinement',
    Ren: 'wisdom, adaptability, and intuition',
    Gui: 'depth, flexibility, and emotional intelligence'
  };
  return traits[dayMaster] || 'balanced and versatile qualities';
};

const getDayMasterActivities = (dayMaster) => {
  const activities = {
    Jia: 'leadership roles, creative projects, or strategic planning',
    Yi: 'diplomatic negotiations, counseling, or artistic pursuits',
    Bing: 'public speaking, motivational coaching, or dynamic sports',
    Ding: 'creative writing, design, or introspective practices',
    Wu: 'community leadership, organizational tasks, or grounding activities',
    Ji: 'caregiving, teaching, or environmental work',
    Geng: 'martial arts, engineering, or disciplined hobbies',
    Xin: 'precision-based crafts, analysis, or aesthetic pursuits',
    Ren: 'research, meditation, or water-based activities',
    Gui: 'writing, therapy, or intuitive arts'
  };
  return activities[dayMaster] || 'versatile and balanced activities';
};

const describeElementBalance = (elementCounts) => {
  const dominant = Object.entries(elementCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const missing = Object.entries(elementCounts).filter(([_, count]) => count === 0).map(([e]) => e);
  const total = Object.values(elementCounts).reduce((sum, val) => sum + val, 0);
  const balanceStatus = total > 8 ? 'overly concentrated' : total < 4 ? 'underrepresented' : 'well-balanced';
  return `dominant ${dominant} energy, promoting ${getElementTraits(dominant).split(', ')[0]}. ${missing.length ? `Missing ${missing.join(', ')} suggests potential challenges in ${missing.map(e => getElementTraits(e).split(', ')[0]).join(', ')}.` : 'All elements present, indicating potential for harmony.'} The overall elemental distribution is ${balanceStatus}, suggesting ${getBalanceImplications(balanceStatus)}.`;
};

const getBalanceImplications = (status) => {
  const implications = {
    'overly concentrated': 'a need to diversify energy through counterbalancing elements',
    'underrepresented': 'opportunities to strengthen elemental presence through lifestyle choices',
    'well-balanced': 'a harmonious foundation for personal growth and stability'
  };
  return implications[status] || 'a balanced approach to life';
};

const getBaziLifePath = (dayMaster, elementCounts, tenGods) => {
  const dominantElement = Object.entries(elementCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const tenGodInfluence = Object.keys(tenGods).join(', ').toLowerCase();
  return `a life path shaped by the ${dayMaster} Day Master, emphasizing ${getDayMasterTraits(dayMaster).split(', ')[0]}. Dominant ${dominantElement} energy drives ${getElementTraits(dominantElement).split(', ')[0]}, while Ten Gods (${tenGodInfluence}) guide ${describeTenGods(tenGods).split('; ')[0]}. This suggests a journey of ${getLifePathFocus(dayMaster, dominantElement)}.`;
};

const getLifePathFocus = (dayMaster, dominantElement) => {
  const focuses = {
    Jia: `leadership and innovation, amplified by ${dominantElement.toLowerCase()} energy`,
    Yi: `diplomacy and collaboration, enhanced by ${dominantElement.toLowerCase()} flexibility`,
    Bing: `inspiration and dynamism, fueled by ${dominantElement.toLowerCase()} charisma`,
    Ding: `creativity and insight, deepened by ${dominantElement.toLowerCase()} warmth`,
    Wu: `stability and trust, grounded by ${dominantElement.toLowerCase()} reliability`,
    Ji: `nurturing and care, supported by ${dominantElement.toLowerCase()} practicality`,
    Geng: `discipline and resilience, strengthened by ${dominantElement.toLowerCase()} clarity`,
    Xin: `precision and refinement, refined by ${dominantElement.toLowerCase()} structure`,
    Ren: `wisdom and adaptability, guided by ${dominantElement.toLowerCase()} intuition`,
    Gui: `depth and emotional intelligence, enriched by ${dominantElement.toLowerCase()} flow`
  };
  return focuses[dayMaster] || `balanced growth, harmonized by ${dominantElement.toLowerCase()} influences`;
};

const describeTenGods = (tenGods) => {
  return Object.entries(tenGods).map(([god, desc]) => `${god} influences ${desc.toLowerCase().split(';')[0]}`).join('; ');
};

const calculateZiWeiDouShu = (birthDate, birthTime) => {
  const date = moment(birthDate + ' ' + birthTime, 'YYYY-MM-DD HH:mm', true);
  if (!date.isValid()) return null;
  
  const majorStars = [
    'Zi Wei (Emperor)', 'Tian Fu (Treasury)', 'Tai Yang (Sun)', 'Wu Qu (Finance)',
    'Tian Tong (Harmony)', 'Lian Zhen (Virtue)', 'Tian Xiang (Chancellor)',
    'Tai Yin (Moon)', 'Tan Lang (Greed)', 'Ju Men (Giant Gate)',
    'Tian Ji (Intelligence)', 'Tian Liang (Blessing)', 'Qi Sha (Seven Killings)',
    'Po Jun (Breaking Army)'
  ];
  
  const minorStars = [
    'Wen Chang (Literary Star)', 'Wen Qu (Artistic Star)', 'Zuo Fu (Left Assistant)',
    'You Bi (Right Assistant)', 'Hua Lu (Prosperity)', 'Hua Quan (Power)',
    'Hua Ke (Fame)', 'Hua Ji (Obstruction)'
  ];
  
  const palaces = [
    'Life Palace', 'Siblings Palace', 'Spouse Palace', 'Children Palace',
    'Wealth Palace', 'Health Palace', 'Travel Palace', 'Friends Palace',
    'Career Palace', 'Property Palace', 'Mental Palace', 'Parents Palace'
  ];
  
  const starInfluences = {
    'Zi Wei (Emperor)': 'Leadership, ambition, and authority; drives strategic vision and influence.',
    'Tian Fu (Treasury)': 'Financial acumen, stability, and resource management; promotes wealth accumulation.',
    'Tai Yang (Sun)': 'Visibility, influence, and charisma; enhances public presence and recognition.',
    'Wu Qu (Finance)': 'Wealth accumulation and financial discipline; fosters economic success.',
    'Tian Tong (Harmony)': 'Adaptability, empathy, and harmonious relationships; encourages peace.',
    'Lian Zhen (Virtue)': 'Integrity, passion, and transformative energy; drives ethical pursuits.',
    'Tian Xiang (Chancellor)': 'Support, diplomacy, and reliability; aids in partnerships.',
    'Tai Yin (Moon)': 'Intuition, nurturing, and emotional depth; fosters inner peace.',
    'Tan Lang (Greed)': 'Ambition, desire, and resourcefulness; drives pursuit of goals.',
    'Ju Men (Giant Gate)': 'Communication, secrecy, and influence; enhances persuasive power.',
    'Tian Ji (Intelligence)': 'Strategy, wisdom, and adaptability; promotes intellectual growth.',
    'Tian Liang (Blessing)': 'Protection, mentorship, and stability; offers guidance and support.',
    'Qi Sha (Seven Killings)': 'Courage, decisiveness, and intensity; drives bold actions.',
    'Po Jun (Breaking Army)': 'Transformation, disruption, and innovation; fosters change.',
    'Wen Chang (Literary Star)': 'Academic success and eloquence; enhances scholarly pursuits.',
    'Wen Qu (Artistic Star)': 'Creativity and artistic talent; promotes aesthetic expression.',
    'Zuo Fu (Left Assistant)': 'Support and loyalty; strengthens alliances.',
    'You Bi (Right Assistant)': 'Collaboration and aid; enhances teamwork.',
    'Hua Lu (Prosperity)': 'Financial luck and opportunity; boosts wealth prospects.',
    'Hua Quan (Power)': 'Authority and influence; strengthens leadership.',
    'Hua Ke (Fame)': 'Recognition and reputation; enhances public image.',
    'Hua Ji (Obstruction)': 'Challenges and obstacles; requires careful navigation.'
  };
  
  const palaceInfluences = palaces.map(palace => ({
    palace,
    influence: getZWDSTraits(palace),
    stars: majorStars.slice(0, Math.floor(Math.random() * 3) + 1).concat(minorStars.slice(0, Math.floor(Math.random() * 2)))
  }));
  
  const starPalaceInteractions = palaceInfluences.map(p => {
    const starEffects = p.stars.map(star => `${star}: ${starInfluences[star].split(';')[0]}`).join('; ');
    return `${p.palace}: ${starEffects}.`;
  });
  
  return {
    stars: majorStars.concat(minorStars),
    palaces: palaces,
    starInfluences: starInfluences,
    palaceInfluences: palaceInfluences,
    starPalaceInteractions: starPalaceInteractions,
    analysis: `The Zi Wei Dou Shu chart is defined by major stars (${majorStars.join(', ')}) and minor stars (${minorStars.join(', ')}), shaping a complex destiny. Key influences include: ${Object.entries(starInfluences).slice(0, 5).map(([star, desc]) => `${star}: ${desc.split(';')[0]}`).join('; ')}. The 12 palaces govern all life aspects: ${palaceInfluences.map(p => `${p.palace}: ${p.influence}`).join('; ')}. Star-palace interactions suggest: ${starPalaceInteractions.join(' ')} The Life Palace, driven by ${palaceInfluences[0].stars.join(' and ')}, emphasizes ${getZWDSTraits('Life Palace')}, guiding the native’s core path.`
  };
};

const getZWDSTraits = (palace) => {
  const traits = {
    'Life Palace': 'core identity, life purpose, and overall destiny; defines the native’s fundamental path',
    'Siblings Palace': 'relationships with siblings and peers; influences social bonds and teamwork',
    'Spouse Palace': 'romantic partnerships, marriage, and close relationships; shapes love and commitment',
    'Children Palace': 'creativity, offspring, and nurturing instincts; governs legacy and expression',
    'Wealth Palace': 'financial prospects, resource management, and material success; drives economic stability',
    'Health Palace': 'physical and mental well-being; influences vitality and resilience',
    'Travel Palace': 'movement, exploration, and external opportunities; shapes adventure and change',
    'Friends Palace': 'social connections, alliances, and support networks; fosters community',
    'Career Palace': 'professional growth, achievements, and public reputation; drives ambition',
    'Property Palace': 'assets, home, and stability; influences material security',
    'Mental Palace': 'inner thoughts, spirituality, and emotional balance; shapes introspection',
    'Parents Palace': 'relationships with parents and authority figures; influences heritage and guidance'
  };
  return traits[palace] || 'balanced influence across multiple life aspects';
};

const calculateLuckPillars = (birthYear) => {
  const pillars = [];
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const phases = [
    'Growth and Exploration: A period of learning, expansion, and building foundations.',
    'Achievement and Stability: A time of career focus, consolidation, and success.',
    'Reflection and Legacy: A phase of introspection, sharing wisdom, and planning for the future.'
  ];
  
  for (let i = 0; i < 10; i++) {
    const startYear = birthYear + i * 10;
    const element = elements[i % 5];
    const phase = phases[Math.floor(i / 3)] || 'Transition and Renewal: A time of reassessment and new beginnings.';
    pillars.push({
      period: `${startYear}-${startYear + 9}`,
      element: element,
      influence: `${phase} The ${element} element emphasizes ${getElementTraits(element).split(', ')[0]}, promoting ${getLuckPillarFocus(element)}. This decade aligns with ${getPillarAlignment(element, i)}.`,
      recommendations: getLuckPillarRecommendations(element, i)
    });
  }
  
  return pillars;
};

const getLuckPillarFocus = (element) => {
  const focuses = {
    Wood: 'personal growth, networking, creative pursuits, and leadership opportunities',
    Fire: 'leadership, visibility, passionate endeavors, and public engagement',
    Earth: 'stability, community building, practical goals, and nurturing relationships',
    Metal: 'discipline, organization, strategic planning, and resilience-building',
    Water: 'introspection, adaptability, intellectual exploration, and emotional depth'
  };
  return focuses[element] || 'balanced development across multiple areas';
};

const getPillarAlignment = (element, index) => {
  const alignments = {
    Wood: ['early growth and exploration', 'mid-life creativity', 'later innovation'],
    Fire: ['early passion and energy', 'mid-life leadership', 'later inspiration'],
    Earth: ['early stability and grounding', 'mid-life community focus', 'later legacy-building'],
    Metal: ['early discipline and focus', 'mid-life structure', 'later resilience'],
    Water: ['early intuition and adaptability', 'mid-life wisdom', 'later emotional depth']
  };
  return alignments[element][Math.floor(index / 3)] || 'a balanced phase of growth';
};

const getLuckPillarRecommendations = (element, index) => {
  const recommendations = {
    Wood: [
      'Engage in creative projects, expand networks, and pursue leadership roles.',
      'Focus on innovation, mentorship, and community-building initiatives.',
      'Reflect on past achievements and explore new creative outlets.'
    ],
    Fire: [
      'Take on bold projects, seek visibility, and embrace dynamic challenges.',
      'Lead with charisma, inspire others, and consolidate achievements.',
      'Share wisdom through teaching or public engagement.'
    ],
    Earth: [
      'Build strong foundations, engage in community service, and prioritize stability.',
      'Strengthen relationships, focus on practical goals, and nurture others.',
      'Plan for legacy through mentorship and community contributions.'
    ],
    Metal: [
      'Develop discipline through structured routines and strategic planning.',
      'Enhance resilience by tackling challenges and refining skills.',
      'Focus on long-term goals and share disciplined insights with others.'
    ],
    Water: [
      'Explore intellectual pursuits, practice meditation, and embrace adaptability.',
      'Deepen wisdom through research and intuitive practices.',
      'Reflect on emotional growth and share insights with others.'
    ]
  };
  return recommendations[element][Math.floor(index / 3)] || 'Pursue balanced growth and self-reflection.';
};

const calculateCompatibility = (person1, person2) => {
  const zodiac1 = calculateChineseZodiac(person1.birthDate);
  const zodiac2 = calculateChineseZodiac(person2.birthDate);
  const bazi1 = calculateBazi(person1.birthDate, person1.birthTime);
  const bazi2 = calculateBazi(person2.birthDate, person2.birthTime);
  const ziWei1 = calculateZiWeiDouShu(person1.birthDate, person1.birthTime);
  const ziWei2 = calculateZiWeiDouShu(person2.birthDate, person2.birthTime);
  
  const compatibilityScores = {
    Rat: { Rat: 65, Ox: 90, Tiger: 50, Rabbit: 70, Dragon: 85, Snake: 60, Horse: 55, Goat: 60, Monkey: 80, Rooster: 65, Dog: 70, Pig: 75 },
    Ox: { Rat: 90, Ox: 65, Tiger: 45, Rabbit: 70, Dragon: 60, Snake: 85, Horse: 55, Goat: 60, Monkey: 65, Rooster: 80, Dog: 70, Pig: 75 },
    Tiger: { Rat: 50, Ox: 45, Tiger: 60, Rabbit: 65, Dragon: 70, Snake: 55, Horse: 85, Goat: 60, Monkey: 65, Rooster: 70, Dog: 80, Pig: 75 },
    Rabbit: { Rat: 70, Ox: 70, Tiger: 65, Rabbit: 65, Dragon: 55, Snake: 60, Horse: 60, Goat: 85, Monkey: 70, Rooster: 75, Dog: 75, Pig: 80 },
    Dragon: { Rat: 85, Ox: 60, Tiger: 70, Rabbit: 55, Dragon: 60, Snake: 55, Horse: 65, Goat: 70, Monkey: 80, Rooster: 75, Dog: 50, Pig: 65 },
    Snake: { Rat: 60, Ox: 85, Tiger: 55, Rabbit: 60, Dragon: 55, Snake: 60, Horse: 70, Goat: 65, Monkey: 75, Rooster: 80, Dog: 70, Pig: 65 },
    Horse: { Rat: 55, Ox: 55, Tiger: 85, Rabbit: 60, Dragon: 65, Snake: 70, Horse: 60, Goat: 75, Monkey: 55, Rooster: 60, Dog: 80, Pig: 65 },
    Goat: { Rat: 60, Ox: 60, Tiger: 60, Rabbit: 85, Dragon: 70, Snake: 65, Horse: 75, Goat: 60, Monkey: 70, Rooster: 55, Dog: 65, Pig: 80 },
    Monkey: { Rat: 80, Ox: 65, Tiger: 65, Rabbit: 70, Dragon: 80, Snake: 75, Horse: 55, Goat: 70, Monkey: 60, Rooster: 65, Dog: 65, Pig: 60 },
    Rooster: { Rat: 65, Ox: 80, Tiger: 70, Rabbit: 75, Dragon: 75, Snake: 80, Horse: 60, Goat: 55, Monkey: 65, Rooster: 60, Dog: 65, Pig: 70 },
    Dog: { Rat: 70, Ox: 70, Tiger: 80, Rabbit: 75, Dragon: 50, Snake: 70, Horse: 80, Goat: 65, Monkey: 65, Rooster: 65, Dog: 60, Pig: 70 },
    Pig: { Rat: 75, Ox: 75, Tiger: 75, Rabbit: 80, Dragon: 65, Snake: 65, Horse: 65, Goat: 80, Monkey: 60, Rooster: 70, Dog: 70, Pig: 65 }
  };
  
  const zodiacScore = compatibilityScores[zodiac1?.animal]?.[zodiac2?.animal] || 70;
  
  const elementInteractions = {
    'Wood-Fire': 'Supportive: Wood fuels Fire, fostering passion, creativity, and mutual growth. Enhances enthusiasm and innovation.',
    'Fire-Earth': 'Harmonious: Fire creates Earth, promoting stability and nurturing. Supports reliability and groundedness.',
    'Earth-Metal': 'Nurturing: Earth produces Metal, enhancing structure and discipline. Promotes clarity and resilience.',
    'Metal-Water': 'Flowing: Metal contains Water, supporting intuition and wisdom. Encourages adaptability and depth.',
    'Water-Wood': 'Growth-oriented: Water nourishes Wood, encouraging creativity and expansion. Fosters leadership and flexibility.',
    'Wood-Wood': 'Competitive: Similar energies may lead to rivalry or overstimulation. Balance with cooperation and grounding.',
    'Fire-Fire': 'Intense: Amplified passion can be overwhelming or lead to burnout. Channel into shared goals.',
    'Earth-Earth': 'Stable: Strong grounding, but may lack dynamism or innovation. Introduce variety and creativity.',
    'Metal-Metal': 'Rigid: Shared discipline can be inflexible or overly structured. Soften with empathy and adaptability.',
    'Water-Water': 'Fluid: Deep intuition, but may lack structure or direction. Ground with practicality and focus.'
  };
  
  const interactionKey = `${bazi1?.dayMaster.split('(')[1]?.slice(0, -1)}-${bazi2?.dayMaster.split('(')[1]?.slice(0, -1)}`;
  const elementalInteraction = elementInteractions[interactionKey] || elementInteractions[`${interactionKey.split('-')[1]}-${interactionKey.split('-')[0]}`] || 'Balanced: Neutral elemental dynamics promote mutual respect and versatility.';
  
  const baziCompatibility = calculateBaziCompatibility(bazi1, bazi2);
  const ziWeiCompatibility = calculateZiWeiCompatibility(ziWei1, ziWei2);
  
  const scoreBreakdown = {
    zodiac: zodiacScore,
    elemental: Object.keys(elementInteractions).includes(interactionKey) || Object.keys(elementInteractions).includes(`${interactionKey.split('-')[1]}-${interactionKey.split('-')[0]}`) ? 80 : 70,
    bazi: baziCompatibility.score,
    ziWei: ziWeiCompatibility.score
  };
  
  const overallScore = Math.round((scoreBreakdown.zodiac + scoreBreakdown.elemental + scoreBreakdown.bazi + scoreBreakdown.ziWei) / 4);
  
  const yinYangCompatibility = zodiac1?.yinYang === zodiac2?.yinYang ? 
    'Harmonious: Shared Yin/Yang energy fosters alignment in temperament and approach.' : 
    'Complementary: Differing Yin/Yang energies balance assertiveness and receptivity, requiring mutual understanding.';
  
  return {
    zodiacScore: `${zodiacScore}%`,
    overallScore: `${overallScore}%`,
    scoreBreakdown: scoreBreakdown,
    zodiacAnalysis: `The ${zodiac1?.animal}-${zodiac2?.animal} pair has a zodiac compatibility score of ${zodiacScore}%. ${getZodiacCompatibility(zodiac1?.animal, zodiac2?.animal)}. ${yinYangCompatibility}`,
    elementalInteraction: elementalInteraction,
    baziCompatibility: baziCompatibility,
    ziWeiCompatibility: ziWeiCompatibility,
    advice: `To optimize harmony, focus on ${getRelationshipAdvice(zodiac1?.animal, zodiac2?.animal)}. ${baziCompatibility.advice}. ${ziWeiCompatibility.advice}. Incorporate ${getSharedElementRecommendations(bazi1?.elementBalance, bazi2?.elementBalance)} to balance shared energies.`
  };
};

const calculateBaziCompatibility = (bazi1, bazi2) => {
  if (!bazi1 || !bazi2) return { score: 70, analysis: 'Neutral Bazi compatibility due to incomplete data.', advice: 'Focus on mutual understanding and open communication.' };
  
  const elementBalance1 = bazi1.elementBalance;
  const elementBalance2 = bazi2.elementBalance;
  
  let score = 70;
  const analysisPoints = [];
  const advicePoints = [];
  
  const dominant1 = Object.entries(elementBalance1).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const dominant2 = Object.entries(elementBalance2).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  
  if (dominant1 === dominant2) {
    score += 10;
    analysisPoints.push(`Shared dominant ${dominant1} energy creates strong synergy, enhancing ${getElementTraits(dominant1).split(', ')[0]}.`);
    advicePoints.push(`Leverage shared ${dominant1} strengths in collaborative projects or shared goals.`);
  } else if (['Wood-Fire', 'Fire-Earth', 'Earth-Metal', 'Metal-Water', 'Water-Wood'].includes(`${dominant1}-${dominant2}`) || ['Wood-Fire', 'Fire-Earth', 'Earth-Metal', 'Metal-Water', 'Water-Wood'].includes(`${dominant2}-${dominant1}`)) {
    score += 15;
    analysisPoints.push(`Complementary ${dominant1}-${dominant2} interaction supports mutual growth and harmony.`);
    advicePoints.push(`Embrace complementary strengths to balance and support each other’s energies.`);
  }
  
  const missing1 = Object.entries(elementBalance1).filter(([_, count]) => count === 0).map(([e]) => e);
  const missing2 = Object.entries(elementBalance2).filter(([_, count]) => count === 0).map(([e]) => e);
  const commonMissing = missing1.filter(e => missing2.includes(e));
  if (commonMissing.length) {
    score -= 5;
    analysisPoints.push(`Common missing elements (${commonMissing.join(', ')}) may pose shared challenges in ${commonMissing.map(e => getElementTraits(e).split(', ')[0]).join(', ')}.`);
    advicePoints.push(`Address shared weaknesses by incorporating ${commonMissing.join(' and ')} elements through lifestyle choices (e.g., colors like ${getElementColors(commonMissing)}).`);
  }
  
  const clashCompatibility = bazi1.clashes.some(c => !c.includes('No')) && bazi2.clashes.some(c => !c.includes('No')) ? 
    (bazi1.clashes.some(c1 => bazi2.clashes.some(c2 => c1 === c2)) ? -10 : 5) : 0;
  score += clashCompatibility;
  analysisPoints.push(clashCompatibility < 0 ? 
    `Shared clashes (${bazi1.clashes.filter(c => bazi2.clashes.includes(c)).join(', ')}) may create tension, requiring careful navigation.` : 
    `Distinct or minimal clashes enhance compatibility by reducing conflicting energies.`);
  advicePoints.push(clashCompatibility < 0 ? 
    `Mitigate shared clashes by fostering ${getClashResolution(bazi1.clashes.filter(c => bazi2.clashes.includes(c)))}.` : 
    `Maintain harmony by respecting individual energetic patterns.`);

  return {
    score: Math.min(100, Math.max(0, score)),
    analysis: analysisPoints.join(' '),
    advice: advicePoints.join(' ')
  };
};

const calculateZiWeiCompatibility = (ziWei1, ziWei2) => {
  if (!ziWei1 || !ziWei2) return { score: 70, analysis: 'Neutral Zi Wei compatibility due to incomplete data.', advice: 'Focus on shared goals and mutual respect.' };
  
  let score = 70;
  const analysisPoints = [];
  const advicePoints = [];
  
  const sharedStars = ziWei1.stars.filter(s => ziWei2.stars.includes(s));
  if (sharedStars.length > 5) {
    score += 10;
    analysisPoints.push(`Shared stars (${sharedStars.join(', ')}) create strong synergy, enhancing ${sharedStars.map(s => ziWei1.starInfluences[s].split(';')[0]).join(', ')}.`);
    advicePoints.push(`Leverage shared star influences to align on common aspirations, such as ${sharedStars.map(s => ziWei1.starInfluences[s].split(';')[0].split(', ')[0]).join(' and ')}.`);
  }
  
  const sharedPalaces = ziWei1.palaceInfluences.filter(p1 => ziWei2.palaceInfluences.some(p2 => p1.palace === p2.palace && p1.stars.some(s => p2.stars.includes(s))));
  if (sharedPalaces.length > 3) {
    score += 10;
    analysisPoints.push(`Aligned palaces (${sharedPalaces.map(p => p.palace).join(', ')}) promote harmony in ${sharedPalaces.map(p => p.influence.split(';')[0]).join(', ')}.`);
    advicePoints.push(`Strengthen shared palace influences by collaborating on ${sharedPalaces.map(p => p.influence.split(';')[0].split(', ')[0]).join(' and ')}.`);
  }
  
  return {
    score: Math.min(100, Math.max(0, score)),
    analysis: analysisPoints.join(' ') || 'Balanced Zi Wei dynamics with neutral compatibility.',
    advice: advicePoints.join(' ') || 'Focus on mutual support and understanding in key life areas.'
  };
};

const getSharedElementRecommendations = (balance1, balance2) => {
  if (!balance1 || !balance2) return 'mutual support and balanced lifestyle choices';
  const missing1 = Object.entries(balance1).filter(([_, count]) => count === 0).map(([e]) => e);
  const missing2 = Object.entries(balance2).filter(([_, count]) => count === 0).map(([e]) => e);
  const commonMissing = missing1.filter(e => missing2.includes(e));
  return commonMissing.length ? 
    `${commonMissing.join(' and ')} elements through environments and activities (e.g., colors like ${getElementColors(commonMissing)})` : 
    'all elements to maintain harmony and versatility';
};

const getZodiacCompatibility = (animal1, animal2) => {
  if (!animal1 || !animal2) return 'Balanced dynamics with mutual respect and potential for harmony.';
  
  const compatibilities = {
    'Rat-Rat': 'Clever and resourceful, but may compete for control. Their shared Water element fosters intuition, yet requires trust to avoid caution overload. Strengths align in strategic planning, but weaknesses like greed must be managed.',
    'Rat-Ox': 'Strong mutual support; Rat’s ingenuity complements Ox’s reliability. Water and Earth elements balance creativity with stability, creating a grounded yet dynamic partnership. Trust and patience enhance synergy.',
    'Rat-Tiger': 'Challenging; Rat’s caution clashes with Tiger’s impulsiveness. Water and Wood elements need alignment for harmony, with Rat’s adaptability balancing Tiger’s boldness. Communication is key to avoid tension.',
    'Rat-Rabbit': 'Moderate; Rat’s pragmatism meets Rabbit’s gentleness. Water and Wood create growth potential with patience, blending resourcefulness with compassion. Empathy prevents conflict avoidance.',
    'Rat-Dragon': 'Dynamic synergy; Rat’s resourcefulness pairs with Dragon’s ambition. Water and Earth amplify leadership, fostering mutual growth. Balancing caution and arrogance ensures success.',
    'Rat-Snake': 'Intellectual but cautious; both are strategic. Water and Fire need balance to avoid secrecy, with Rat’s adaptability complementing Snake’s wisdom. Trust deepens their bond.',
    'Rat-Horse': 'Restless; Rat’s planning conflicts with Horse’s spontaneity. Water and Fire create tension unless channeled into shared goals. Flexibility and compromise are essential.',
    'Rat-Goat': 'Gentle but differing paces; Rat’s speed meets Goat’s calm. Water and Earth need empathy for harmony, blending resourcefulness with nurturing. Patience fosters connection.',
    'Rat-Monkey': 'Intellectual harmony; both thrive on cleverness and adaptability. Water and Metal enhance wit and strategy, creating a vibrant partnership. Trust prevents manipulation.',
    'Rat-Rooster': 'Practical but critical; Rat’s adaptability meets Rooster’s precision. Water and Metal require flexibility to align goals. Mutual respect enhances collaboration.',
    'Rat-Dog': 'Loyal and supportive; Rat’s resourcefulness aids Dog’s honesty. Water and Earth foster trust, creating a dependable bond. Openness prevents pessimism.',
    'Rat-Pig': 'Harmonious; Rat’s cunning complements Pig’s sincerity. Water elements align for mutual growth, blending adaptability with optimism. Communication strengthens peace.',
    'Ox-Ox': 'Stable and reliable, but may lack dynamism. Earth elements reinforce dependability, needing variety to avoid stagnation. Shared diligence fosters trust.',
    'Ox-Tiger': 'Challenging; Ox’s stubbornness meets Tiger’s boldness. Earth and Wood clash unless tempered by patience, requiring compromise to align reliability with ambition.',
    'Ox-Rabbit': 'Calm and supportive; Ox’s reliability pairs with Rabbit’s compassion. Earth and Wood promote nurturing, creating a peaceful bond. Empathy prevents rigidity.',
    'Ox-Dragon': 'Ambitious but tense; Ox’s practicality meets Dragon’s vision. Earth elements need alignment to balance stability with innovation. Mutual respect is crucial.',
    'Ox-Snake': 'Stable and discreet; Ox’s patience aligns with Snake’s wisdom. Earth and Fire create a grounded bond, fostering trust. Communication prevents secrecy.',
    'Ox-Horse': 'Restless; Ox’s steadiness clashes with Horse’s freedom. Earth and Fire need compromise to harmonize. Flexibility enhances connection.',
    'Ox-Goat': 'Gentle but slow; Ox’s reliability meets Goat’s empathy. Earth elements foster care but need energy to avoid inertia. Nurturing strengthens harmony.',
    'Ox-Monkey': 'Strategic but differing; Ox’s discipline meets Monkey’s wit. Earth and Metal require trust to align goals. Collaboration enhances synergy.',
    'Ox-Rooster': 'Practical and reliable; both value hard work and structure. Earth and Metal enhance organization, creating a strong partnership. Shared goals drive success.',
    'Ox-Dog': 'Loyal and steady; Ox’s dependability supports Dog’s honesty. Earth elements create trust, fostering a dependable bond. Optimism prevents rigidity.',
    'Ox-Pig': 'Harmonious; Ox’s reliability complements Pig’s sincerity. Earth and Water balance stability and flow, promoting peace. Communication enhances connection.',
    'Tiger-Tiger': 'Dynamic but challenging; both need to manage impulsiveness. Wood elements amplify energy, needing balance to avoid conflict. Compromise fosters harmony.',
    'Tiger-Rabbit': 'Gentle but tense; Tiger’s boldness meets Rabbit’s caution. Wood elements align with empathy, balancing ambition with compassion. Patience is key.',
    'Tiger-Dragon': 'Powerful and ambitious; both are bold. Wood and Earth create strong synergy with compromise, blending courage with vision. Mutual respect drives success.',
    'Tiger-Snake': 'Complex; Tiger’s openness meets Snake’s secrecy. Wood and Fire need trust for harmony, balancing boldness with wisdom. Communication prevents tension.',
    'Tiger-Horse': 'Energetic and adventurous; both love freedom and excitement. Wood and Fire fuel passion, creating a vibrant bond. Individuality enhances synergy.',
    'Tiger-Goat': 'Creative but differing; Tiger’s dynamism meets Goat’s calm. Wood and Earth need patience to harmonize. Empathy fosters connection.',
    'Tiger-Monkey': 'Vibrant but tricky; Tiger’s courage meets Monkey’s cunning. Wood and Metal require balance to align energies. Trust prevents manipulation.',
    'Tiger-Rooster': 'Confident but critical; Tiger’s boldness meets Rooster’s precision. Wood and Metal need flexibility to align goals. Collaboration enhances harmony.',
    'Tiger-Dog': 'Loyal and spirited; both value honesty and adventure. Wood and Earth create trust, fostering a dependable bond. Optimism strengthens connection.',
    'Tiger-Pig': 'Supportive; Tiger’s energy complements Pig’s sincerity. Wood and Water foster growth, blending ambition with optimism. Communication enhances peace.',
    'Rabbit-Rabbit': 'Harmonious and gentle, but may avoid conflict. Wood elements promote compassion, needing decisiveness to avoid stagnation. Empathy fosters harmony.',
    'Rabbit-Dragon': 'Ambitious but tense; Rabbit’s calm meets Dragon’s drive. Wood and Earth need balance to align compassion with vision. Mutual respect is crucial.',
    'Rabbit-Snake': 'Intuitive and discreet; Rabbit’s empathy meets Snake’s wisdom. Wood and Fire create depth, fostering a thoughtful bond. Trust prevents secrecy.',
    'Rabbit-Horse': 'Lively but differing; Rabbit’s caution meets Horse’s spontaneity. Wood and Fire need alignment to balance energies. Communication enhances connection.',
    'Rabbit-Goat': 'Gentle and empathetic; both create a nurturing environment. Wood and Earth enhance care, fostering a peaceful bond. Emotional connection drives harmony.',
    'Rabbit-Monkey': 'Witty but tricky; Rabbit’s gentleness meets Monkey’s cunning. Wood and Metal require trust to align energies. Collaboration prevents manipulation.',
    'Rabbit-Rooster': 'Supportive but critical; Rabbit’s compassion meets Rooster’s precision. Wood and Metal need flexibility to align goals. Empathy enhances harmony.',
    'Rabbit-Dog': 'Loyal and caring; Rabbit’s empathy supports Dog’s honesty. Wood and Earth foster trust, creating a dependable bond. Optimism strengthens connection.',
    'Rabbit-Pig': 'Harmonious and caring; both foster a peaceful connection. Wood and Water enhance flow, blending compassion with optimism. Communication drives peace.',
    'Dragon-Dragon': 'Visionary and bold, but may compete. Earth elements amplify ambition, needing cooperation to avoid rivalry. Mutual respect fosters synergy.',
    'Dragon-Snake': 'Strategic and wise; Dragon’s vision meets Snake’s intuition. Earth and Fire create depth, fostering a thoughtful bond. Trust enhances connection.',
    'Dragon-Horse': 'Dynamic and free; Dragon’s ambition meets Horse’s energy. Earth and Fire fuel passion, creating a vibrant partnership. Individuality strengthens synergy.',
    'Dragon-Goat': 'Creative but differing; Dragon’s drive meets Goat’s calm. Earth elements need empathy to balance energies. Patience fosters harmony.',
    'Dragon-Monkey': 'Creative and strategic; both are ambitious and versatile. Earth and Metal enhance wit, fostering a dynamic bond. Collaboration drives success.',
    'Dragon-Rooster': 'Confident and organized; Dragon’s vision meets Rooster’s precision. Earth and Metal strengthen structure, creating a productive partnership. Shared goals enhance synergy.',
    'Dragon-Dog': 'Challenging; Dragon’s ambition clashes with Dog’s caution. Earth elements need trust to align vision with loyalty. Compromise is essential.',
    'Dragon-Pig': 'Supportive; Dragon’s drive complements Pig’s sincerity. Earth and Water foster balance, blending ambition with optimism. Communication strengthens harmony.',
    'Snake-Snake': 'Wise and discreet, but may be overly guarded. Fire elements deepen intuition, needing openness to avoid secrecy. Trust fosters connection.',
    'Snake-Horse': 'Dynamic but tense; Snake’s caution meets Horse’s spontaneity. Fire elements amplify energy, requiring balance to align wisdom with freedom. Flexibility enhances synergy.',
    'Snake-Goat': 'Gentle and thoughtful; Snake’s wisdom pairs with Goat’s empathy. Fire and Earth create a nurturing bond, fostering harmony. Patience prevents emotional overload.',
    'Snake-Monkey': 'Strategic and witty; Snake’s intuition meets Monkey’s cunning. Fire and Metal enhance intellect, creating a vibrant partnership. Trust prevents manipulation.',
    'Snake-Rooster': 'Focused and observant; both appreciate precision and planning. Fire and Metal enhance discipline, fostering a productive partnership. Mutual respect strengthens collaboration.',
    'Snake-Dog': 'Thoughtful but cautious; Snake’s wisdom meets Dog’s loyalty. Fire and Earth require trust to align intuition with honesty. Open communication fosters harmony.',
    'Snake-Pig': 'Harmonious but differing; Snake’s discretion meets Pig’s openness. Fire and Water balance depth with sincerity, promoting peace. Empathy enhances connection.',
    'Horse-Horse': 'Energetic and free-spirited, but may lack focus. Fire elements amplify passion, needing structure to avoid impulsiveness. Shared goals foster synergy.',
    'Horse-Goat': 'Creative and gentle; Horse’s energy meets Goat’s calm. Fire and Earth create a nurturing dynamic, balancing enthusiasm with empathy. Patience strengthens harmony.',
    'Horse-Monkey': 'Vibrant but unpredictable; Horse’s spontaneity meets Monkey’s wit. Fire and Metal require balance to align energies. Trust prevents manipulation.',
    'Horse-Rooster': 'Dynamic but critical; Horse’s freedom meets Rooster’s precision. Fire and Metal need flexibility to align goals. Collaboration enhances connection.',
    'Horse-Dog': 'Adventurous and loyal; Horse’s energy complements Dog’s honesty. Fire and Earth foster trust, creating a spirited bond. Optimism strengthens synergy.',
    'Horse-Pig': 'Supportive but differing; Horse’s dynamism meets Pig’s sincerity. Fire and Water balance passion with optimism, promoting harmony. Communication fosters peace.',
    'Goat-Goat': 'Nurturing and empathetic, but may be overly emotional. Earth elements enhance care, needing decisiveness to avoid worry. Emotional connection drives harmony.',
    'Goat-Monkey': 'Creative but tricky; Goat’s empathy meets Monkey’s cunning. Earth and Metal require trust to align energies. Collaboration prevents manipulation.',
    'Goat-Rooster': 'Gentle but critical; Goat’s nurturing meets Rooster’s precision. Earth and Metal need flexibility to align goals. Empathy enhances harmony.',
    'Goat-Dog': 'Loyal and caring; Goat’s empathy supports Dog’s honesty. Earth elements foster trust, creating a dependable bond. Optimism prevents emotional overload.',
    'Goat-Pig': 'Harmonious and nurturing; both foster a peaceful connection. Earth and Water enhance care and flow, blending empathy with optimism. Communication drives harmony.',
    'Monkey-Monkey': 'Witty and versatile, but may be overly competitive. Metal elements enhance intellect, needing trust to avoid manipulation. Collaboration fosters synergy.',
    'Monkey-Rooster': 'Strategic and precise; Monkey’s wit meets Rooster’s discipline. Metal elements strengthen structure, creating a productive partnership. Shared goals enhance success.',
    'Monkey-Dog': 'Loyal but tricky; Monkey’s cunning meets Dog’s honesty. Metal and Earth require trust to align energies. Openness prevents manipulation.',
    'Monkey-Pig': 'Creative but differing; Monkey’s versatility meets Pig’s sincerity. Metal and Water balance wit with optimism, promoting harmony. Communication fosters connection.',
    'Rooster-Rooster': 'Confident and organized, but may be overly critical. Metal elements enhance discipline, needing flexibility to avoid rigidity. Mutual respect fosters harmony.',
    'Rooster-Dog': 'Loyal and precise; Rooster’s discipline supports Dog’s honesty. Metal and Earth foster trust, creating a dependable bond. Optimism prevents criticism.',
    'Rooster-Pig': 'Supportive but differing; Rooster’s precision meets Pig’s sincerity. Metal and Water balance structure with optimism, promoting harmony. Communication enhances connection.',
    'Dog-Dog': 'Loyal and honest, but may be overly cautious. Earth elements foster trust, needing optimism to avoid pessimism. Shared values drive harmony.',
    'Dog-Pig': 'Harmonious and caring; Dog’s loyalty complements Pig’s sincerity. Earth and Water enhance trust and flow, fostering a peaceful bond. Communication strengthens harmony.',
    'Pig-Pig': 'Sincere and optimistic, but may be overly trusting. Water elements promote harmony, needing practicality to avoid naivety. Emotional connection fosters peace.'
  };

  const key = `${animal1}-${animal2}`;
  const reverseKey = `${animal2}-${animal1}`;
  return compatibilities[key] || compatibilities[reverseKey] || 'Balanced dynamics with mutual respect and potential for harmony.';
};

const getRelationshipAdvice = (animal1, animal2) => {
  const advice = {
    'Rat-Ox': 'open communication and shared goals',
    'Rat-Dragon': 'encourage each other\'s ambitions while maintaining balance',
    'Rat-Monkey': 'foster trust to complement intellectual synergy',
    'Ox-Snake': 'build trust through patience and mutual respect',
    'Ox-Rooster': 'align on long-term goals to strengthen partnership',
    'Tiger-Tiger': 'patience and compromise to balance strong personalities',
    'Tiger-Horse': 'embrace shared adventures while respecting individuality',
    'Rabbit-Goat': 'deepen emotional connection through empathy',
    'Dragon-Monkey': 'support each other\'s creativity and strategic goals',
    'Snake-Rooster': 'maintain clear communication to enhance precision',
    'Horse-Dog': 'cultivate loyalty and mutual support in adventures',
    'Goat-Pig': 'nurture harmony through kindness and understanding',
    'Monkey-Rat': 'build trust to sustain intellectual connection',
    'Rooster-Ox': 'focus on shared values for stability',
    'Dog-Horse': 'promote honesty and mutual encouragement',
    'Pig-Rabbit': 'strengthen bond through mutual care and peace'
  };
  return advice[`${animal1}-${animal2}`] || advice[`${animal2}-${animal1}`] || 'mutual understanding and clear communication';
};

// Main component
const Calculator = () => {
  const [person1, dispatchPerson1] = useReducer(personReducer, initialPersonState);
  const [person2, dispatchPerson2] = useReducer(personReducer, { ...initialPersonState, gender: 'male' });
  const [analysisType, setAnalysisType] = useState('single');
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (personDispatch) => (field) => (e) => {
    personDispatch({ type: 'UPDATE_FIELD', field, value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!person1.name || !moment(person1.birthDate, 'YYYY-MM-DD', true).isValid()) {
      setToast({ message: 'Please provide a valid name and birth date for Person 1.', type: 'error' });
      setIsLoading(false);
      return;
    }
    
    if (analysisType === 'compatibility' && (!person2.name || !moment(person2.birthDate, 'YYYY-MM-DD', true).isValid())) {
      setToast({ message: 'Please provide a valid name and birth date for Person 2.', type: 'error' });
      setIsLoading(false);
      return;
    }
    
    setTimeout(() => {
      const person1Data = {
        name: person1.name,
        zodiac: calculateChineseZodiac(person1.birthDate),
        bazi: calculateBazi(person1.birthDate, person1.birthTime),
        ziWei: calculateZiWeiDouShu(person1.birthDate, person1.birthTime),
        luckPillars: calculateLuckPillars(moment(person1.birthDate).year()),
        personality: `Based on ${person1.name}'s ${person1.gender} energy, ${person1.name} exhibits ${getPersonalityProfile(person1)}.`,
        deepSeekAnalysis: `DeepSeek R1 Analysis: ${getDeepSeekAnalysis(calculateBazi(person1.birthDate, person1.birthTime))}`
      };
      
      const resultData = { person1: person1Data };
      
      if (analysisType === 'compatibility') {
        const person2Data = {
          name: person2.name,
          zodiac: calculateChineseZodiac(person2.birthDate),
          bazi: calculateBazi(person2.birthDate, person2.birthTime),
          ziWei: calculateZiWeiDouShu(person2.birthDate, person2.birthTime),
          luckPillars: calculateLuckPillars(moment(person2.birthDate).year()),
          personality: `Based on ${person2.name}'s ${person2.gender} energy, ${person2.name} exhibits ${getPersonalityProfile(person2)}.`,
          deepSeekAnalysis: `DeepSeek R1 Analysis: ${getDeepSeekAnalysis(calculateBazi(person2.birthDate, person2.birthTime))}`
        };
        resultData.person2 = person2Data;
        resultData.compatibility = calculateCompatibility(person1, person2);
      }
      
      setResult(resultData);
      setToast({ message: 'Analysis generated successfully!', type: 'success' });
      setIsLoading(false);
    }, 1000); // Simulate processing time
  };

  const handleReset = () => {
    dispatchPerson1({ type: 'RESET' });
    dispatchPerson2({ type: 'RESET', value: { ...initialPersonState, gender: 'male' } });
    setAnalysisType('single');
    setResult(null);
    setToast({ message: 'Form reset successfully.', type: 'success' });
  };

  const getPersonalityProfile = (person) => {
    const zodiac = calculateChineseZodiac(person.birthDate);
    return `${zodiac.animal} traits (${zodiac.description.split('.')[1].trim()}), influenced by ${person.gender === 'female' ? 'yin' : 'yang'} energy, promoting ${person.gender === 'female' ? 'introspection and empathy' : 'action and leadership'}.`;
  };

  const getDeepSeekAnalysis = (bazi) => {
    return `Pattern Analysis: The ${bazi.dayMaster} Day Master interacts with ${describeTenGods(bazi.tenGods)}. Elemental energy distribution:\n${bazi.energyChart}\nThis suggests a ${bazi.elementBalance.Wood > 2 ? 'growth-oriented' : 'balanced'} life path, with strengths in ${Object.keys(bazi.elementBalance).filter(e => bazi.elementBalance[e] > 1).join(', ')}.`;
  };

  const analysisTypeOptions = [
    { value: 'single', label: 'Individual Analysis' },
    { value: 'compatibility', label: 'Couple Compatibility' }
  ];

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Ultra-Detaileds Astrology Calculator</h1>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <SelectField
            label="Analysis Type"
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            options={analysisTypeOptions}
          />
          
          <SectionTitle>Person 1</SectionTitle>
          <InputField
            label="Name"
            value={person1.name}
            onChange={handleInputChange(dispatchPerson1)('name')}
          />
          <InputField
            label="Birth Date"
            type="date"
            value={person1.birthDate}
            onChange={handleInputChange(dispatchPerson1)('birthDate')}
          />
          <InputField
            label="Birth Time"
            type="time"
            value={person1.birthTime}
            onChange={handleInputChange(dispatchPerson1)('birthTime')}
          />
          <InputField
            label="Birth Place"
            value={person1.birthPlace}
            onChange={handleInputChange(dispatchPerson1)('birthPlace')}
          />
          <SelectField
            label="Timezone"
            value={person1.birthTimezone}
            onChange={handleInputChange(dispatchPerson1)('birthTimezone')}
            options={moment.tz.names().map(tz => ({ value: tz, label: tz }))}
          />
          <SelectField
            label="Gender"
            value={person1.gender}
            onChange={handleInputChange(dispatchPerson1)('gender')}
            options={[
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' }
            ]}
          />
          
          {analysisType === 'compatibility' && (
            <>
              <SectionTitle>Person 2</SectionTitle>
              <InputField
                label="Name"
                value={person2.name}
                onChange={handleInputChange(dispatchPerson2)('name')}
              />
              <InputField
                label="Birth Date"
                type="date"
                value={person2.birthDate}
                onChange={handleInputChange(dispatchPerson2)('birthDate')}
              />
              <InputField
                label="Birth Time"
                type="time"
                value={person2.birthTime}
                onChange={handleInputChange(dispatchPerson2)('birthTime')}
              />
              <InputField
                label="Birth Place"
                value={person2.birthPlace}
                onChange={handleInputChange(dispatchPerson2)('birthPlace')}
              />
              <SelectField
                label="Timezone"
                value={person2.birthTimezone}
                onChange={handleInputChange(dispatchPerson2)('birthTimezone')}
                options={moment.tz.names().map(tz => ({ value: tz, label: tz }))}
              />
              <SelectField
                label="Gender"
                value={person2.gender}
                onChange={handleInputChange(dispatchPerson2)('gender')}
                options={[
                  { value: 'female', label: 'Female' },
                  { value: 'male', label: 'Male' }
                ]}
              />
            </>
          )}
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                  </svg>
                  Calculating...
                </span>
              ) : (
                'Calculate'
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </form>
      </FormContainer>
      
      {result && (
        <FormContainer>
          <SectionTitle>Analysis Results</SectionTitle>
          
          {result.error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              {result.error}
            </div>
          ) : (
            <>
              <CollapsibleSection title={`${result.person1.name || 'Person 1'}'s Astrology`}>
                <h3 className="font-medium">Chinese Zodiac</h3>
                <p>{result.person1.zodiac.description}</p>
                
                <h3 className="font-medium mt-4">Bazi (Four Pillars)</h3>
                <p><strong>Day Master:</strong> {result.person1.bazi.dayMaster}</p>
                <p><strong>Pillars:</strong></p>
                <ul>
                  {result.person1.bazi.pillars.map((pillar, idx) => (
                    <li key={idx}>{`${pillar.stem} ${pillar.branch} (${pillar.element})`}</li>
                  ))}
                </ul>
                <p><strong>Analysis:</strong> {result.person1.bazi.analysis}</p>
                <pre className="mt-2 p-2 bg-gray-100 rounded">{result.person1.bazi.energyChart}</pre>
                
                <h3 className="font-medium mt-4">Zi Wei Dou Shu</h3>
                <p>{result.person1.ziWei.analysis}</p>
                
                <h3 className="font-medium mt-4">Luck Pillars</h3>
                <ul>
                  {result.person1.luckPillars.map((pillar, idx) => (
                    <li key={idx}>{pillar.period}: {pillar.influence}</li>
                  ))}
                </ul>
                
                <h3 className="font-medium mt-4">Personality Profile</h3>
                <p>{result.person1.personality}</p>
                
                <h3 className="font-medium mt-4">DeepSeek R1 Analysis</h3>
                <p>{result.person1.deepSeekAnalysis}</p>
              </CollapsibleSection>
              
              {result.person2 && (
                <CollapsibleSection title={`${result.person2.name || 'Person 2'}'s Astrology`}>
                  <h3 className="font-medium">Chinese Zodiac</h3>
                  <p>{result.person2.zodiac.description}</p>
                  
                  <h3 className="font-medium mt-4">Bazi (Four Pillars)</h3>
                  <p><strong>Day Master:</strong> {result.person2.bazi.dayMaster}</p>
                  <p><strong>Pillars:</strong></p>
                  <ul>
                    {result.person2.bazi.pillars.map((pillar, idx) => (
                      <li key={idx}>{`${pillar.stem} ${pillar.branch} (${pillar.element})`}</li>
                    ))}
                  </ul>
                  <p><strong>Analysis:</strong> {result.person2.bazi.analysis}</p>
                  <pre className="mt-2 p-2 bg-gray-100 rounded">{result.person2.bazi.energyChart}</pre>
                  
                  <h3 className="font-medium mt-4">Zi Wei Dou Shu</h3>
                  <p>{result.person2.ziWei.analysis}</p>
                  
                  <h3 className="font-medium mt-4">Luck Pillars</h3>
                  <ul>
                    {result.person2.luckPillars.map((pillar, idx) => (
                      <li key={idx}>{pillar.period}: {pillar.influence}</li>
                    ))}
                  </ul>
                  
                  <h3 className="font-medium mt-4">Personality Profile</h3>
                  <p>{result.person2.personality}</p>
                  
                  <h3 className="font-medium mt-4">DeepSeek R1 Analysis</h3>
                  <p>{result.person2.deepSeekAnalysis}</p>
                </CollapsibleSection>
              )}
              
              {result.compatibility && (
                <CollapsibleSection title="Couple Compatibility Analysis">
                  <h3 className="font-medium">Zodiac Compatibility</h3>
                  <p><strong>Score:</strong> {result.compatibility.zodiacScore}</p>
                  <p>{result.compatibility.zodiacAnalysis}</p>
                  
                  <h3 className="font-medium mt-4">Elemental Interaction</h3>
                  <p>{result.compatibility.elementalInteraction}</p>
                  
                  <h3 className="font-medium mt-4">Relationship Advice</h3>
                  <p>{result.compatibility.advice}</p>
                </CollapsibleSection>
              )}
            </>
          )}
        </FormContainer>
      )}
    </div>
  );
};

export default Calculator;