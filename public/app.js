(() => {
  "use strict";
  const config = window.BIRTHDAY_SITE || {};
  const $ = (id) => document.getElementById(id);
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Configure copy safely with textContent, never user-supplied HTML.
  if (config.recipientName && typeof config.recipientName === "string") {
    $("recipient-name").textContent = `, ${config.recipientName.trim()}`;
    document.title = `Happy Birthday, ${config.recipientName.trim()} · A Sky Full of Wishes`;
  }
  if (config.dateLabel) $("date-label").textContent = config.dateLabel;
  if (config.signature) $("signature").textContent = config.signature;
  if (Array.isArray(config.message) && config.message.length > 0) {
    const copy = $("letter-copy");
    copy.replaceChildren(...config.message.filter(x => typeof x === "string").map(message => {
      const p = document.createElement("p");
      p.textContent = message;
      return p;
    }));
  }

  // Gallery supports interleaved images and videos without extra libraries.
  const gallery = $("gallery-grid");
  const items = Array.isArray(config.gallery) ? config.gallery.filter(item => item && ["image", "video"].includes(item.type) && typeof item.src === "string" && item.src.trim()) : [];
  if (items.length) {
    gallery.replaceChildren();
    items.forEach((item, index) => {
      const card = document.createElement("figure");
      card.className = "memory-card" + ((index % 5 === 3) ? " wide" : "");
      card.style.margin = "0";
      if (item.type === "image") {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.alt || item.caption || `Birthday memory ${index + 1}`;
        img.loading = "lazy";
        img.decoding = "async";
        card.appendChild(img);
      } else {
        const video = document.createElement("video");
        video.src = item.src;
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.setAttribute("aria-label", item.caption || `Birthday video ${index + 1}`);
        if (item.poster) video.poster = item.poster;
        card.appendChild(video);
      }
      if (item.caption) {
        const caption = document.createElement("figcaption");
        caption.className = "media-caption";
        caption.textContent = item.caption;
        card.appendChild(caption);
      }
      gallery.appendChild(card);
    });
  }

  // Single, merged audio file: the personal voice note is followed by the song.
  // This is more reliable on iOS/Safari than programmatically starting a second sound.
  const soundtrack = $("intro-audio");
  const play = $("play-audio");
  const restart = $("restart-audio");
  const label = $("play-label");
  const icon = $("play-icon");
  const status = $("audio-status");
  const audioConfig = config.audio || {};
  const hasAudio = typeof audioConfig.soundtrack === "string" && !!audioConfig.soundtrack.trim();
  const voiceEndsAt = Number(audioConfig.voiceEndsAt) || 34.6;
  const fmt = secs => `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, "0")}`;
  if (hasAudio) {
    soundtrack.src = audioConfig.soundtrack;
    play.disabled = false;
    status.textContent = "A personal message, followed by a birthday song. Tap to listen! 💙";
    $("audio-note").textContent = "Tap play once; the voice message flows straight into the song. You can pause or replay anytime.";
  }
  const sync = () => {
    const isPlaying = !soundtrack.paused && !soundtrack.ended;
    label.textContent = isPlaying ? "Pause your surprise" : soundtrack.currentTime > 0 && !soundtrack.ended ? "Keep listening" : "Play your surprise";
    icon.textContent = isPlaying ? "Ⅱ" : "▶";
  };
  const tryPlay = async () => {
    if (!hasAudio) return;
    try { await soundtrack.play(); sync(); }
    catch { status.textContent = "Tap play to hear your recording. This browser may need another tap to start audio."; sync(); }
  };
  play.addEventListener("click", () => {
    if (!hasAudio) return;
    if (!soundtrack.paused) { soundtrack.pause(); sync(); return; }
    if (soundtrack.ended) soundtrack.currentTime = 0;
    tryPlay();
  });
  soundtrack.addEventListener("loadedmetadata", () => { if (Number.isFinite(soundtrack.duration)) $("duration").textContent = fmt(soundtrack.duration); });
  soundtrack.addEventListener("timeupdate", () => {
    const t = soundtrack.currentTime;
    $("elapsed").textContent = fmt(t);
    $("track-played").style.width = `${soundtrack.duration ? Math.min(100, t / soundtrack.duration * 100) : 0}%`;
    status.textContent = t < voiceEndsAt ? "🎙️ A personal birthday voice note, just for you" : "🎵 And now... the birthday song! Sing along, Mush!";
  });
  soundtrack.addEventListener("ended", () => { status.textContent = "Happy Birthday, Mush! Wishing you a beautiful year ahead. 🎂"; restart.hidden = false; sync(); });
  soundtrack.addEventListener("pause", sync);
  soundtrack.addEventListener("play", sync);
  soundtrack.addEventListener("error", () => { status.textContent = "The audio couldn't load. Check the media connection and try again."; sync(); });
  restart.addEventListener("click", () => {soundtrack.currentTime = 0; restart.hidden = true; tryPlay();});
  gallery.querySelectorAll("video").forEach(video => video.addEventListener("play", () => {
    soundtrack.pause();
    gallery.querySelectorAll("video").forEach(other => { if (other !== video) other.pause(); });
  }));

  // Lightweight confetti: no dependency, no network requests, respects reduced-motion settings.
  const palette = ["#74bdf0", "#f5a9c8", "#fff2a0", "#ffffff", "#347aaf", "#c4e8ff"];
  const layer = $("confetti-layer");
  function celebrate(count = 82) {
    if (reducedMotion) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const part = document.createElement("i");
      part.className = "confetti-piece" + (i % 4 === 0 ? " circle" : "");
      part.style.backgroundColor = palette[Math.floor(Math.random() * palette.length)];
      part.style.setProperty("--x", `${Math.random() * 100}%`);
      part.style.setProperty("--drift", `${(Math.random() - .5) * 260}px`);
      part.style.setProperty("--duration", `${2.2 + Math.random() * 2.7}s`);
      part.style.setProperty("--start-rotate", `${Math.random() * 180}deg`);
      part.style.setProperty("--end-rotate", `${480 + Math.random() * 560}deg`);
      part.addEventListener("animationend", () => part.remove(), { once: true });
      fragment.appendChild(part);
    }
    layer.appendChild(fragment);
  }
  $("open-surprise").addEventListener("click", () => {
    celebrate(92);
    $(hasAudio ? "listen" : "letter").scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
    if (hasAudio) {
      restart.hidden = true;
      soundtrack.currentTime = 0;
      tryPlay();
    }
  });
  $("more-confetti").addEventListener("click", () => celebrate(100));
  window.addEventListener("load", () => setTimeout(() => celebrate(55), 350), { once: true });
})();
