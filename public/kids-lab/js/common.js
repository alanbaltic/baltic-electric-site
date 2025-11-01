
export const sfx = {
  click:new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_8a2be4e9cb.mp3?filename=whoosh-6316.mp3"),
  correct:new Audio("https://cdn.pixabay.com/download/audio/2021/09/14/audio_3ef0a2996f.mp3?filename=correct-2-46134.mp3"),
  wrong:new Audio("https://cdn.pixabay.com/download/audio/2021/09/14/audio_2a281f45ef.mp3?filename=wrong-buzzer-6268.mp3"),
  success:new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_6e192f50e7.mp3?filename=success-1-6297.mp3")
};
Object.values(sfx).forEach(a=>a.volume=0.25);
