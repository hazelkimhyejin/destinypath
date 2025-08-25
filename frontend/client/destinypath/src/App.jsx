import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import PayPalButton from './components/PayPalButton';
import './index.css';

const stripePromise = loadStripe('your-stripe-publishable-key');

function App() {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState('welcome');
  const [loading, setLoading] = useState(false);
  const currencyMap = {
    en: 'usd', zh: 'twd', ko: 'krw', en_SG: 'sgd', en_MY: 'myr', ja: 'jpy'
  };
  const currency = currencyMap[i18n.language] || 'usd';

  const handlePayment = async (type) => {
    setLoading(true);
    const stripe = await stripePromise;
    const endpoint = type === 'subscription' ? '/api/create-subscription' : '/api/create-checkout-session';
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, currency })
    });
    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
    setLoading(false);
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = type === 'single' ? {
      name: formData.get('name'),
      dob: formData.get('dob'),
      time: formData.get('time'),
      gender: formData.get('gender'),
      country: formData.get('country')
    } : {
      user1: {
        name: formData.get('name1'),
        dob: formData.get('dob1'),
        time: formData.get('time1'),
        gender: formData.get('gender1'),
        country: formData.get('country1')
      },
      user2: {
        name: formData.get('name2'),
        dob: formData.get('dob2'),
        time: formData.get('time2'),
        gender: formData.get('gender2'),
        country: formData.get('country2')
      },
      compatibility: Math.floor(Math.random() * 100)
    };
    try {
      const response = await fetch(`http://localhost:3000/api/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        alert(t('data_saved'));
      } else {
        alert(t('data_save_error'));
      }
    } catch (err) {
      alert(t('data_save_error'));
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen starry-bg ${i18n.language === 'ja' ? 'japan-bg' : ''} text-white`}>
      <Helmet>
        <title>{t('app.title')}</title>
        <meta name="description" content={t('app.description')} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=your-ga-id"></script>
        <script>
          {`
                 window.dataLayer = window.dataLayer || [];
                 function gtag(){dataLayer.push(arguments);}
                 gtag('js', new Date());
                 gtag('config', 'your-ga-id');
               `}
        </script>
      </Helmet>
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-cinzel">{t('app.title')}</h1>
        <select
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="bg-silver text-black p-2 rounded"
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ko">한국어</option>
          <option value="ja">日本語</option>
        </select>
      </header>
      {page === 'welcome' && (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-4xl font-cinzel mb-4">{t('welcome.title')}</h2>
          <p className="text-lg mb-8">{t('welcome.description')}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => setPage('single')}
              className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition"
            >
              {t('welcome.single_button')}
            </button>
            <button
              onClick={() => setPage('couple')}
              className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition"
            >
              {t('welcome.couple_button')}
            </button>
            <button
              onClick={() => setPage('feedback')}
              className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition"
            >
              {t('feedback.title')}
            </button>
            <button
              onClick={() => handlePayment('subscription')}
              className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition"
            >
              {t('premium.subscription')}
            </button>
          </div>
        </div>
      )}
      {page === 'single' && (
        <div className="p-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-cinzel mb-4">{t('single.title')}</h2>
          <form className="space-y-4" onSubmit={(e) => handleSubmit(e, 'single')}>
            <input name="name" type="text" placeholder={t('single.name')} className="w-full p-2 rounded bg-silver text-black" title={t('single.name_help')} />
            <input name="dob" type="date" placeholder={t('single.dob')} className="w-full p-2 rounded bg-silver text-black" title={t('single.dob_help')} />
            <input name="time" type="time" placeholder={t('single.time')} className="w-full p-2 rounded bg-silver text-black" title={t('single.time_help')} />
            <select name="gender" className="w-full p-2 rounded bg-silver text-black">
              <option>{t('single.male')}</option>
              <option>{t('single.female')}</option>
            </select>
            <select name="country" className="w-full p-2 rounded bg-silver text-black">
              <option>Asia/Tokyo</option>
              <option>Asia/Singapore</option>
              <option>Asia/Seoul</option>
              <option>Asia/Taipei</option>
              <option>Australia/Sydney</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
              <option>Asia/Shanghai</option>
            </select>
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
            >
              {t('single.submit')}
            </button>
          </form>
          <div className="mt-4">
            <p>{t('single.result_placeholder')}</p>
            {loading ? (
              <div className="animate-spin h-8 w-8 border-4 border-purple-700 rounded-full"></div>
            ) : (
              <>
                <button
                  onClick={() => handlePayment('single')}
                  className="bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded mt-2"
                >
                  {t('premium.single')}
                </button>
                <p>{t('single.premium_prompt')}</p>
                <PayPalButton type="single" />
              </>
            )}
          </div>
        </div>
      )}
      {page == 'couple' && (
        <div className="p-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-cinzel mb-4">{t('couple.title')}</h2>
          <form className="space-y-4" onSubmit={(e) => handleSubmit(e, 'couple')}>
            <h3>{t('couple.person1')}</h3>
            <input name="name1" type="text" placeholder={t('couple.name1')} className="w-full p-2 rounded bg-silver text-black" title={t('couple.name_help')} />
            <input name="dob1" type="date" placeholder={t('couple.dob1')} className="w-full p-2 rounded bg-silver text-black" title={t('couple.dob_help')} />
            <input name="time1" type="time" placeholder={t('couple.time1')} className="w-full p-2 rounded bg-silver text-black" title={t('couple.time_help')} />
            <select name="gender1" className="w-full p-2 rounded bg-silver text-black">
              <option>{t('couple.male')}</option>
              <option>{t('couple.female')}</option>
            </select>
            <select name="country1" className="w-full p-2 rounded bg-silver text-black">
              <option>Asia/Tokyo</option>
              <option>Asia/Singapore</option>
              <option>Asia/Seoul</option>
              <option>Asia/Taipei</option>
              <option>Australia/Sydney</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
              <option>Asia/Shanghai</option>
            </select>
            <h3>{t('couple.person2')}</h3>
            <input name="name2" type="text" placeholder={t('couple.name2')} className="w-full p-2 rounded bg-silver text-black" title={t('couple.name_help')} />
            <input name="dob2" type="date" placeholder={t('couple.dob2')} className="w-full p-2 rounded bg-silver text-black" title={t('couple.dob_help')} />
            <input name="time2" type="time" placeholder={t('couple.time2')} className="w-full p-2 rounded bg-silver text-black" title={t('couple.time_help')} />
            <select name="gender2" className="w-full p-2 rounded bg-silver text-black">
              <option>{t('couple.male')}</option>
              <option>{t('couple.female')}</option>
            </select>
            <select name="country2" className="w-full p-2 rounded bg-silver text-black">
              <option>Asia/Tokyo</option>
              <option>Asia/Singapore</option>
              <option>Asia/Seoul</option>
              <option>Asia/Taipei</option>
              <option>Australia/Sydney</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
              <option>Asia/Shanghai</option>
            </select>
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
            >
              {t('couple.submit')}
            </button>
          </form>
          <div className="mt-4">
            <p>{t('couple.result_placeholder')}</p>
            {loading ? (
              <div className="animate-spin h-8 w-8 border-4 border-purple-700 rounded-full"></div>
            ) : (
              <>
                <button
                  onClick={() => handlePayment('couple')}
                  className="bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded mt-2"
                >
                  {t('premium.couple')}
                </button>
                <p>{t('couple.premium_prompt')}</p>
                <PayPalButton type="couple" />
              </>
            )}
          </div>
        </div>
      )}
      {page === 'feedback' && (
        <div className="p-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-cinzel mb-4">{t('feedback.title')}</h2>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const feedback = e.target.feedback.value;
            fetch('http://localhost:3000/api/feedback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ feedback, lang: i18n.language })
            }).then(() => alert(t('feedback.success')))
              .catch(() => alert(t('feedback.error')));
          }}>
            <textarea name="feedback" placeholder={t('feedback.prompt')} className="w-full p-2 rounded bg-silver text-black" />
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
            >
              {t('feedback.submit')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;