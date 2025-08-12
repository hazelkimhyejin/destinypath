import streamlit as st
     import pyswisseph as swe
     import pytz
     from datetime import datetime
     from transformers import pipeline
     import i18n
     import os
     import requests

     # Initialize translations
     i18n.load_path.append('translations')
     i18n.set('locale', 'en')
     def t(key): return i18n.t(key)

     # Set pyswisseph ephemeris path
     os.environ['SE_EPHE_PATH'] = './ephe'

     # Initialize DistilBERT chatbot
     chatbot = pipeline('text-generation', model='distilbert-base-uncased', max_length=100, num_return_sequences=1)

     # Streamlit configuration
     st.set_page_config(page_title=t('app.title'), layout='wide')
     st.markdown("""
       <style>
       .stApp {
         background: linear-gradient(to bottom right, #2D1B4E, #1E3A8A);
         color: white;
       }
       h1, h2, h3 { font-family: 'Cinzel', serif; }
       body, p, label { font-family: 'Open Sans', sans-serif; }
       .stButton>button {
         background-color: #6B4EAA;
         color: white;
         border-radius: 8px;
         transition: background-color 0.3s;
       }
       .stButton>button:hover { background-color: #5A3F99; }
       .japan-bg { 
         background-image: url('/cherry-blossom.png'); 
         opacity: 0.3; 
         position: absolute;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         z-index: -1;
       }
       input, select {
         transition: box-shadow 0.3s;
       }
       input:hover, select:hover {
         box-shadow: 0 0 8px rgba(107, 78, 170, 0.5);
       }
       </style>
     """, unsafe_allow_html=True)

     # Navigation
     PAGES = {
       t('nav.welcome'): 'welcome',
       t('nav.single'): 'single',
       t('nav.couple'): 'couple',
       t('nav.feedback'): 'feedback'
     }
     st.sidebar.title(t('sidebar.title'))
     page = st.sidebar.radio(t('sidebar.nav'), list(PAGES.keys()))
     page_id = PAGES[page]

     # Language selector
     lang = st.sidebar.selectbox(t('sidebar.language'), ['en', 'zh', 'ko', 'ja'])
     i18n.set('locale', lang)
     if lang == 'ja':
       st.markdown('<div class="japan-bg"></div>', unsafe_allow_html=True)

     # Welcome page
     if page_id == 'welcome':
       st.title(t('welcome.title'))
       st.write(t('welcome.description'))
       col1, col2, col3 = st.columns(3)
       with col1:
         if st.button(t('welcome.single_button')):
           st.session_state.page = 'single'
       with col2:
         if st.button(t('welcome.couple_button')):
           st.session_state.page = 'couple'
       with col3:
         if st.button(t('premium.subscription')):
           currency = 'jpy' if lang == 'ja' else 'usd'
           st.markdown(f'<a href="https://destinypath.onrender.com/payment?type=subscription&currency={currency}" target="_blank">{t("premium.subscription")}</a>', unsafe_allow_html=True)

     # Single Calculator
     elif page_id == 'single':
       st.title(t('single.title'))
       with st.form('single_form'):
         name = st.text_input(t('single.name'), help=t('single.name_help'))
         dob = st.date_input(t('single.dob'), help=t('single.dob_help'))
         time = st.time_input(t('single.time'), help=t('single.time_help'))
         gender = st.selectbox(t('single.gender'), [t('single.male'), t('single.female')])
         country = st.selectbox(t('single.country'), ['Asia/Tokyo', 'Asia/Singapore', 'Asia/Seoul', 'Asia/Taipei', 'Australia/Sydney', 'Europe/London', 'America/New_York', 'Asia/Shanghai'])
         submit = st.form_submit_button(t('single.submit'))
     
       if submit:
         with st.spinner(t('single.calculating')):
           tz = pytz.timezone(country)
           dt = datetime.combine(dob, time)
           dt = tz.localize(dt)
           jd = swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute/60.0)
           saju = swe.calc_ut(jd, swe.SUN)[0]
           life_path = sum(int(d) for d in str(dob.day) + str(dob.month) + str(dob.year)) % 9 + 1
           st.write(f"{t('single.saju_result')}: {saju:.2f}")
           st.write(f"{t('single.numerology_result')}: {life_path}")
           if lang == 'ja':
             st.write("日本のために特別に調整された運命の洞察をご覧ください。")
           elif lang == 'ko':
             st.write("한국 전통에 깊이 뿌리내린 사주를 탐험하세요.")
           # Save to MongoDB
           try:
             response = requests.post('http://localhost:3000/api/single', json={
               'name': name,
               'dob': dob.isoformat(),
               'time': time.strftime('%H:%M'),
               'gender': gender,
               'country': country
             })
             if response.status_code == 200:
               st.write(t('data_saved'))
             else:
               st.error(t('data_save_error'))
           except:
             st.error(t('data_save_error'))
           if st.button(t('single.premium')):
             currency = 'jpy' if lang == 'ja' else 'usd'
             st.markdown(f'<a href="https://destinypath.onrender.com/payment?type=single&currency={currency}" target="_blank">{t("single.premium_prompt")}</a>', unsafe_allow_html=True)

     # Couple Calculator
     elif page_id == 'couple':
       st.title(t('couple.title'))
       with st.form('couple_form'):
         st.subheader(t('couple.person1'))
         name1 = st.text_input(t('couple.name1'), help=t('couple.name_help'))
         dob1 = st.date_input(t('couple.dob1'), help=t('couple.dob_help'))
         time1 = st.time_input(t('couple.time1'), help=t('couple.time_help'))
         gender1 = st.selectbox(t('couple.gender1'), [t('couple.male'), t('couple.female')])
         country1 = st.selectbox(t('couple.country1'), ['Asia/Tokyo', 'Asia/Singapore', 'Asia/Seoul', 'Asia/Taipei', 'Australia/Sydney', 'Europe/London', 'America/New_York', 'Asia/Shanghai'])
         st.subheader(t('couple.person2'))
         name2 = st.text_input(t('couple.name2'), help=t('couple.name_help'))
         dob2 = st.date_input(t('couple.dob2'), help=t('couple.dob_help'))
         time2 = st.time_input(t('couple.time2'), help=t('couple.time_help'))
         gender2 = st.selectbox(t('couple.gender2'), [t('couple.male'), t('couple.female')])
         country2 = st.selectbox(t('couple.country2'), ['Asia/Tokyo', 'Asia/Singapore', 'Asia/Seoul', 'Asia/Taipei', 'Australia/Sydney', 'Europe/London', 'America/New_York', 'Asia/Shanghai'])
         submit = st.form_submit_button(t('couple.submit'))
     
       if submit and gender1 != gender2:
         with st.spinner(t('couple.calculating')):
           tz1 = pytz.timezone(country1)
           dt1 = datetime.combine(dob1, time1)
           dt1 = tz1.localize(dt1)
           jd1 = swe.julday(dt1.year, dt1.month, dt1.day, dt1.hour + dt1.minute/60.0)
           saju1 = swe.calc_ut(jd1, swe.SUN)[0]
           tz2 = pytz.timezone(country2)
           dt2 = datetime.combine(dob2, time2)
           dt2 = tz2.localize(dt2)
           jd2 = swe.julday(dt2.year, dt2.month, dt2.day, dt2.hour + dt2.minute/60.0)
           saju2 = swe.calc_ut(jd2, swe.SUN)[0]
           compatibility = 100 - abs(saju1 - saju2) % 100
           st.write(f"{t('couple.compatibility')}: {compatibility}%")
           # Save to MongoDB
           try:
             response = requests.post('http://localhost:3000/api/couple', json={
               'user1': {'name': name1, 'dob': dob1.isoformat(), 'time': time1.strftime('%H:%M'), 'gender': gender1, 'country': country1},
               'user2': {'name': name2, 'dob': dob2.isoformat(), 'time': time2.strftime('%H:%M'), 'gender': gender2, 'country': country2},
               'compatibility': compatibility
             })
             if response.status_code == 200:
               st.write(t('data_saved'))
             else:
               st.error(t('data_save_error'))
           except:
             st.error(t('data_save_error'))
           if st.button(t('couple.premium')):
             currency = 'jpy' if lang == 'ja' else 'usd'
             st.markdown(f'<a href="https://destinypath.onrender.com/payment?type=couple&currency={currency}" target="_blank">{t("couple.premium_prompt")}</a>', unsafe_allow_html=True)

     # Feedback page
     elif page_id == 'feedback':
       st.title(t('feedback.title'))
       with st.form('feedback_form'):
         feedback = st.text_area(t('feedback.prompt'))
         submit = st.form_submit_button(t('feedback.submit'))
         if submit:
           try:
             response = requests.post('http://localhost:3000/api/feedback', json={'feedback': feedback, 'lang': lang})
             if response.status_code == 200:
               st.write(t('feedback.success'))
             else:
               st.error(t('feedback.error'))
           except:
             st.error(t('feedback.error'))

     # Chatbot
     st.sidebar.subheader(t('chatbot.title'))
     user_input = st.sidebar.chat_input(t('chatbot.prompt'))
     if user_input:
       response = chatbot(user_input)[0]['generated_text']
       st.sidebar.write(f"{t('chatbot.response')}: {response}")