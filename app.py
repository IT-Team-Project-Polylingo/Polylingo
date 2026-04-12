import streamlit as st
import google.generativeai as genai
import pyttsx3
import random
from datetime import date

genai.configure(api_key="API HERE")

# Load Gemini 1.5 Flash model
model = genai.GenerativeModel('gemini-1.5-flash')


# Polish words of the day list (extendable)
polish_words = [
    {"word": "Dzień dobry", "meaning": "Good morning"},
    {"word": "Dziękuję", "meaning": "Thank you"},
    {"word": "Proszę", "meaning": "Please / You're welcome"},
    {"word": "Tak", "meaning": "Yes"},
    {"word": "Nie", "meaning": "No"},
    {"word": "Do widzenia", "meaning": "Goodbye"},
    {"word": "Przepraszam", "meaning": "Sorry / Excuse me"}
]

# Function to generate translation
def translate_text(text):
    prompt = f"Translate this sentence into Polish: '{text}'"
    response = model.generate_content(prompt)
    return response.text.strip()

# Function to get Word of the Day based on current date
def get_word_of_the_day():
    index = date.today().toordinal() % len(polish_words)
    return polish_words[index]

# Function to convert text to audio
def speak_text(text):
    engine.say(text)
    engine.runAndWait()

# Streamlit UI
st.set_page_config(page_title="Polylingo", page_icon="🌍")
st.title("🌍 Polylingo - Learn Polish with AI")
st.write("Enter a sentence in English to see its Polish translation and hear it!")

# Word of the Day
word_of_day = get_word_of_the_day()
st.subheader("📖 Polish Word of the Day")
st.markdown(f"**{word_of_day['word']}** — *{word_of_day['meaning']}*")

# Translation section
user_input = st.text_input("✏️ Enter English Sentence:")

if user_input:
    with st.spinner("Translating..."):
        translation = translate_text(user_input)
    st.success(f"🗣️ Polish Translation: {translation}")

    if st.button("🔊 Hear it in Polish"):
        speak_text(translation)
