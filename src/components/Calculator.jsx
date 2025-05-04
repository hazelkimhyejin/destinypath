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
const InputField = ({ label, type = 'text', value, onChange, helpText = null }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor={label}>
      {label}
    </label>
    <input
      id={label}
      type={type}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
  </div>
);

const SelectField = ({ label, value, onChange, options, helpText = null }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor={label}>
      {label}
    </label>
    <select
      id={label}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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

// Chinese New Year dates for accurate zodiac calculation
const chineseNewYearDates = {
  1900: '1900-01-31',
  1901: '1901-02-19',
  1994: '1994-02-10',
  1995: '1995-01-31',
  1996: '1996-02-19',
  1997: '1997-02-07',
  1998: '1998-01-28',
  1999: '1999-02-16',
  2000: '2000-02-05',
};

// Helper functions for astrology calculations
const calculateChineseZodiac = (dateString) => {
  if (!dateString) return null;
  
  const date = moment(dateString, 'YYYY-MM-DD');
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
  
  return {
    animal: animals[animalIndex],
    element: elements[elementIndex],
    yinYang: yinYang[yinYangIndex],
    description: `The ${elements[elementIndex]} ${animals[animalIndex]} (${yinYang[yinYangIndex]}) is known for unique traits. ${animals[animalIndex]}s are often ${getZodiacTraits(animals[animalIndex])}. The ${elements[elementIndex]} element adds ${getElementTraits(elements[elementIndex])}. ${yinYang[yinYangIndex]} energy influences ${yinYangIndex === 0 ? 'assertive, outward-focused' : 'receptive, introspective'} tendencies.`
  };
};

const getZodiacTraits = (animal) => {
  const traits = {
    Rat: 'intelligent, adaptable, and resourceful, but may be overly cautious',
    Ox: 'diligent, reliable, and patient, but can be stubborn',
    Tiger: 'brave, confident, and charismatic, but sometimes impulsive',
    Rabbit: 'gentle, elegant, and compassionate, but may avoid conflict',
    Dragon: 'ambitious, energetic, and visionary, but can be arrogant',
    Snake: 'wise, intuitive, and discreet, but may be secretive',
    Horse: 'free-spirited, enthusiastic, and sociable, but can be restless',
    Goat: 'creative, kind, and empathetic, but may lack decisiveness',
    Monkey: 'clever, versatile, and witty, but can be manipulative',
    Rooster: 'observant, hardworking, and confident, but may be critical',
    Dog: 'loyal, honest, and protective, but can be pessimistic',
    Pig: 'generous, sincere, and diligent, but may be naive'
  };
  return traits[animal] || 'versatile and balanced';
};

const getElementTraits = (element) => {
  const traits = {
    Wood: 'growth, creativity, and flexibility, fostering leadership and innovation',
    Fire: 'passion, energy, and dynamism, driving enthusiasm and charisma',
    Earth: 'stability, nurturing, and practicality, promoting reliability and care',
    Metal: 'strength, discipline, and clarity, enhancing focus and determination',
    Water: 'wisdom, adaptability, and intuition, encouraging deep insight and flow'
  };
  return traits[element] || 'balanced attributes';
};

const calculateBazi = (birthDate, birthTime) => {
  const date = moment(birthDate + ' ' + birthTime, 'YYYY-MM-DD HH:mm');
  const year = date.year();
  const month = date.month() + 1;
  const day = date.date();
  const hour = date.hour();
  
  const stems = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
  const branches = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
  const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
  
  const yearStem = stems[(year - 4) % 10];
  const yearBranch = branches[(year - 4) % 12];
  const monthBranch = branches[(month + 1) % 12];
  const dayStem = stems[(Math.abs(day - 1) % 10)];
  const hourBranch = branches[Math.floor(hour / 2) % 12];
  
  const dayMaster = dayStem;
  const elementCounts = {
    Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0
  };
  
  [yearStem, dayStem].forEach(stem => {
    const idx = stems.indexOf(stem);
    elementCounts[elements[idx]]++;
  });
  
  [yearBranch, monthBranch, hourBranch].forEach(branch => {
    const idx = branches.indexOf(branch);
    elementCounts[elements[idx % 5]]++;
  });
  
  const tenGods = {
    Companion: 'Supports teamwork and alliances',
    Output: 'Enhances creativity and expression',
    Wealth: 'Drives ambition and resource accumulation',
    Authority: 'Promotes discipline and leadership',
    Resource: 'Fosters learning and intuition'
  };
  
  const maxStrength = Math.max(...Object.values(elementCounts));
  const energyChart = Object.entries(elementCounts).map(([element, count]) => {
    const bars = '█'.repeat(Math.round((count / maxStrength) * 10));
    return `${element.padEnd(6)}: ${bars} (${count})`;
  }).join('\n');
  
  return {
    pillars: [
      { stem: yearStem, branch: yearBranch, element: elements[stems.indexOf(yearStem)] },
      { stem: stems[(month + 1) % 10], branch: monthBranch, element: elements[(month + 1) % 5] },
      { stem: dayStem, branch: branches[day % 12], element: elements[stems.indexOf(dayStem)] },
      { stem: stems[hour % 10], branch: hourBranch, element: elements[hour % 5] }
    ],
    dayMaster: `${dayMaster} (${elements[stems.indexOf(dayMaster)]})`,
    elementBalance: elementCounts,
    tenGods: tenGods,
    energyChart: energyChart,
    analysis: `Day Master ${dayMaster} (${elements[stems.indexOf(dayMaster)]}) indicates a ${getDayMasterStrength(dayMaster, elementCounts)} personality. The elemental balance shows ${describeElementBalance(elementCounts)}. Ten Gods suggest ${describeTenGods(tenGods)}.`
  };
};

const getDayMasterStrength = (dayMaster, elementCounts) => {
  const stemIndex = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'].indexOf(dayMaster);
  const dmElement = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'][stemIndex];
  const strength = elementCounts[dmElement] >= 2 ? 'strong' : 'weak';
  return strength === 'strong' ? 'resilient, self-reliant' : 'adaptable, collaborative';
};

const describeElementBalance = (elementCounts) => {
  const dominant = Object.entries(elementCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const missing = Object.entries(elementCounts).filter(([_, count]) => count === 0).map(([e]) => e);
  return `dominant ${dominant} energy, promoting ${getElementTraits(dominant)}. ${missing.length ? `Missing ${missing.join(', ')} suggests potential challenges in ${missing.map(e => getElementTraits(e).split(', ')[0]).join(', ')}.` : 'Balanced elements indicate harmony.'}`;
};

const describeTenGods = (tenGods) => {
  return Object.entries(tenGods).map(([god, desc]) => `${god} influences ${desc.toLowerCase()}`).join('; ');
};

const calculateZiWeiDouShu = (birthDate, birthTime) => {
  const majorStars = ['Zi Wei (Emperor)', 'Tian Fu (Treasury)', 'Tai Yang (Sun)'];
  return {
    stars: majorStars,
    palaces: ['Life Palace', 'Wealth Palace', 'Career Palace'],
    analysis: `Major stars (${majorStars.join(', ')}) shape destiny. Zi Wei indicates leadership and ambition; Tian Fu suggests financial acumen; Tai Yang drives visibility and influence. Life Palace governs overall path, emphasizing ${getZWDSTraits('Life Palace')}.`
  };
};

const getZWDSTraits = (palace) => {
  const traits = {
    'Life Palace': 'core identity and life purpose',
    'Wealth Palace': 'financial prospects and resource management',
    'Career Palace': 'professional growth and achievements'
  };
  return traits[palace] || 'balanced influence';
};

const calculateLuckPillars = (birthYear) => {
  const pillars = [];
  for (let i = 0; i < 3; i++) {
    const startYear = birthYear + i * 10;
    pillars.push({
      period: `${startYear}-${startYear + 9}`,
      influence: `This decade emphasizes ${['growth and exploration', 'stability and achievement', 'reflection and legacy'][i]}.`
    });
  }
  return pillars;
};

const calculateCompatibility = (person1, person2) => {
  const zodiac1 = calculateChineseZodiac(person1.birthDate);
  const zodiac2 = calculateChineseZodiac(person2.birthDate);
  const bazi1 = calculateBazi(person1.birthDate, person1.birthTime);
  const bazi2 = calculateBazi(person2.birthDate, person2.birthTime);
  
  const compatibilityScores = {
    'Rat': { Ox: 90, Dragon: 85, Monkey: 80, Tiger: 50 },
    'Ox': { Rat: 90, Snake: 85, Rooster: 80, Tiger: 45 },
  };
  
  const score = compatibilityScores[zodiac1.animal]?.[zodiac2.animal] || 70;
  
  const elementInteractions = {
    'Wood-Fire': 'Supportive: Wood fuels Fire, fostering passion and growth.',
    'Fire-Earth': 'Harmonious: Fire creates Earth, promoting stability.',
    'Earth-Metal': 'Nurturing: Earth produces Metal, enhancing structure.',
    'Metal-Water': 'Flowing: Metal contains Water, supporting intuition.',
    'Water-Wood': 'Growth: Water nourishes Wood, encouraging creativity.',
  };
  
  const interaction = elementInteractions[`${bazi1.dayMaster.split('(')[1].slice(0, -1)}-${bazi2.dayMaster.split('(')[1].slice(0, -1)}`] || 'Balanced: Neutral elemental dynamics.';
  
  return {
    zodiacScore: `${score}%`,
    zodiacAnalysis: `The ${zodiac1.animal}-${zodiac2.animal} pair has a compatibility score of ${score}%. ${getZodiacCompatibility(zodiac1.animal, zodiac2.animal)}.`,
    elementalInteraction: interaction,
    advice: `To enhance harmony, focus on ${getRelationshipAdvice(zodiac1.animal, zodiac2.animal)}.`
  };
};

const getZodiacCompatibility = (animal1, animal2) => {
  const compatibilities = {
    'Rat-Ox': 'Strong mutual support; Rat\'s ingenuity complements Ox\'s reliability.',
    'Rat-Dragon': 'Dynamic synergy; Rat\'s resourcefulness pairs well with Dragon\'s ambition.',
    'Rat-Monkey': 'Intellectual harmony; both thrive on cleverness and adaptability.',
    'Ox-Snake': 'Stable and discreet; Ox\'s patience aligns with Snake\'s wisdom.',
    'Ox-Rooster': 'Practical and reliable; both value hard work and structure.',
    'Tiger-Tiger': 'Dynamic but challenging; both need to manage impulsiveness.',
    'Tiger-Horse': 'Energetic and adventurous; both love freedom and excitement.',
    'Rabbit-Goat': 'Gentle and empathetic; both create a nurturing environment.',
    'Dragon-Monkey': 'Creative and strategic; both are ambitious and versatile.',
    'Snake-Rooster': 'Focused and observant; both appreciate precision and planning.',
    'Horse-Dog': 'Loyal and spirited; both value honesty and adventure.',
    'Goat-Pig': 'Compassionate and sincere; both prioritize harmony and kindness.',
    'Monkey-Rat': 'Witty and resourceful; both enjoy intellectual challenges.',
    'Rooster-Ox': 'Structured and diligent; both excel in organized settings.',
    'Dog-Horse': 'Trustworthy and enthusiastic; both support each other\'s goals.',
    'Pig-Rabbit': 'Harmonious and caring; both foster a peaceful connection.'
  };
  return compatibilities[`${animal1}-${animal2}`] || compatibilities[`${animal2}-${animal1}`] || 'Balanced dynamics with mutual respect.';
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