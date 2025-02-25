(function () {
  // Global styles
  const empowermentStyles = `
    /* input error indication */
    .input-error {
      transition: background-color 300ms ease-in-out;
      background-color: #6b2f2f !important;
    }
    /* chat length popup on field type with dynamic movement horizontally */
    .length-field-popup {
      position: absolute;
      font: bold 12px Montserrat;
      bottom: 40px;
      transition: left 100ms ease-out;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px 4px;
      margin: 2px;
      opacity: 0;
    }

    .bounce-in {
      animation: bounceIn 500ms forwards;
    }

    @keyframes bounceIn {
      0% { transform: translateY(0); opacity: 0; }
      50% { transform: translateY(-10px); opacity: 1; }
      100% { transform: translateY(0); opacity: 1; }
    }

    .bounce-out {
      animation: bounceOut 500ms forwards;
    }

    @keyframes bounceOut {
      0% { transform: translateY(0); opacity: 1; }
      50% { transform: translateY(-10px); opacity: 1; }
      100% { transform: translateY(0); opacity: 0; }
    }

    /* catalogs panel && personal messages panel messages anchors color */
    .chat-logs-panel .message-text a,
    .cached-messages-panel .message-text a {
      color: burlywood !important;
      transition: color 0.15s ease-in-out;
    }

    .chat-logs-panel .message-text a:hover,
    .cached-messages-panel .message-text a:hover {
      color: lightgoldenrodyellow !important;
    }

    /* clickable thumbnail hover effect */
    .thumbnail {
      opacity: 1;
      transition: opacity 0.15s ease-in-out;
    }
    .thumbnail:hover {
      opacity: 0.8;
    }
    
    /* element animations */
    .pulse-effect {
      animation: pulse 500ms ease-out; 
    }

    @keyframes pulse {
      0% { filter: brightness(1); }
      50% { filter: brightness(1.5); }
      100% { filter: brightness(1); }
    }

    .shake-effect {
      animation: shake 500ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }

    @keyframes shake {
      0% { transform: translateX(0); }
      10% { transform: translateX(-4px); }
      20% { transform: translateX(6px); }
      30% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      50% { transform: translateX(-6px); }
      60% { transform: translateX(5px); }
      70% { transform: translateX(-3px); }
      80% { transform: translateX(2px); }
      90% { transform: translateX(-1px); }
      100% { transform: translateX(0); }
    }
  `;

  const boxShadow = `
    0 8px 30px rgba(0, 0, 0, 0.12),
    0 4px 6px rgba(0, 0, 0, 0.04),
    0 2px 2px rgba(0, 0, 0, 0.08)
  `;

  // Create a <style> element for the empowerment-styles class
  const empowermentStylesElement = document.createElement('style');
  empowermentStylesElement.classList.add('empowerment-global-styles');
  // Set the inner HTML of the <style> element with the class-based CSS
  empowermentStylesElement.innerHTML = empowermentStyles;
  // Append the <style> element to the <head> of the document
  document.head.appendChild(empowermentStylesElement);

  // Actual nickname to use it as an exclusion for the message beep and voice notifications
  const myNickname = document.querySelector('.userpanel .user-block .user-dropdown .name span').textContent;
  // Extract the user ID from the href attribute of the mail link for chat, direct profile, or messaging navigation
  const myUserId = document.querySelector('a.drop-btn.mail')?.href?.match(/\/u\/#\/(\d+)\/messages\//)?.[1];
  // create today's date in the format 'YYYY-MM-DD'
  const today = new Intl.DateTimeFormat('en-CA').format(new Date());

  // Function to dynamically append font link to the head
  function appendFontLink(fontFamily, fontWeights) {
    // Check if the font link element with the specified class already exists
    const existingFont = document.querySelector(`.font-${fontFamily.replace(/\s/g, '-')}`);

    // If it doesn't exist, create a new link element and append it to the document head
    if (!existingFont) {
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s/g, '+')}:wght@${fontWeights.join(';')}&display=swap`;
      fontLink.classList.add(`font-${fontFamily.replace(/\s/g, '-')}`);

      // Append the font link element to the document head
      document.head.appendChild(fontLink);
    }
  }

  // Specify the font weights you want to include
  const montserratFontWeights = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
  const orbitronFontWeights = ['400', '500', '600', '700', '800', '900'];
  const robotoMonoFontWeights = ['100', '200', '300', '400', '500', '600', '700'];

  // Call the function to append Montserrat font link
  appendFontLink('Montserrat', montserratFontWeights);

  // Call the function to append Orbitron font link
  appendFontLink('Orbitron', orbitronFontWeights);

  // Call the function to append Roboto Mono font link
  appendFontLink('Roboto Mono', robotoMonoFontWeights);

  // Define voice speed limits
  const minVoiceSpeed = 0;
  const maxVoiceSpeed = 2.5;

  // Define voice pitch limits
  const minVoicePitch = 0;
  const maxVoicePitch = 2.0;

  // Define default voice speed and pitch
  const defaultVoiceSpeed = 1.5;
  const defaultVoicePitch = 1.0;

  // Retrieve KG_Chat_Empowerment from localStorage or create an object with empty voiceSettings if it doesn't exist
  // This is the main key for the settings
  let KG_Chat_Empowerment = JSON.parse(localStorage.getItem('KG_Chat_Empowerment'));

  // If KG_Chat_Empowerment doesn't exist in localStorage, create it with an empty voiceSettings object
  if (!KG_Chat_Empowerment) {
    KG_Chat_Empowerment = {
      voiceSettings: {
        voiceSpeed: defaultVoiceSpeed, // Set default values for voiceSpeed
        voicePitch: defaultVoicePitch, // Set default values for voicePitch
      },
      messageSettings: {},
    };
    localStorage.setItem('KG_Chat_Empowerment', JSON.stringify(KG_Chat_Empowerment));
  }

  // Define the default voice speed and pitch
  let voiceSpeed = KG_Chat_Empowerment.voiceSettings.voiceSpeed !== null
    ? KG_Chat_Empowerment.voiceSettings.voiceSpeed
    : defaultVoiceSpeed; // Default value if KG_Chat_Empowerment.voiceSettings.voiceSpeed is null

  let voicePitch = KG_Chat_Empowerment.voiceSettings.voicePitch !== null
    ? KG_Chat_Empowerment.voiceSettings.voicePitch
    : defaultVoicePitch; // Default value if KG_Chat_Empowerment.voiceSettings.voicePitch is null

  // Define the base URL for user profiles
  const profileBaseUrl = 'https://klavogonki.ru/u/#/';

  // Define the users to track and notify with popup and audio
  let usersToTrack = [
    { name: 'Даниэль', gender: 'Male', pronunciation: 'Даниэль', state: 'thawed' }
  ];

  // Notify if someone addresses me using these aliases (case-insensitive)
  let mentionKeywords = [];

  // Define username replacements for pronunciation
  let usernameReplacements = [];

  // Define a list of moderator whose new user nicknames in the chat list should have a shield icon.
  let moderator = [];

  // Define user list of users whose messages should be hidden
  let ignored = [];

  // Define empty array for the toggle settings
  let toggle = [];

  // Check and load settings from localStorage if available and not empty
  const storedUsersToTrack = JSON.parse(localStorage.getItem('usersToTrack')) || [];
  const storedMentionKeywords = JSON.parse(localStorage.getItem('mentionKeywords')) || [];
  const storedUsernameReplacements = JSON.parse(localStorage.getItem('usernameReplacements')) || [];
  const storedModerators = JSON.parse(localStorage.getItem('moderator')) || [];
  const storedIgnored = JSON.parse(localStorage.getItem('ignored')) || [];

  // Replace values with stored ones if they exist and are not empty
  usersToTrack = storedUsersToTrack?.length ? storedUsersToTrack : usersToTrack;
  mentionKeywords = storedMentionKeywords?.length ? storedMentionKeywords : mentionKeywords;
  usernameReplacements = storedUsernameReplacements?.length ? storedUsernameReplacements : usernameReplacements;
  moderator = storedModerators?.length ? storedModerators : moderator;
  ignored = storedIgnored?.length ? storedIgnored : ignored;

  mentionKeywords.push(myNickname); // Actual nickname

  // Key Events: CTRL and ALT

  // Initialize global variables to track the state of Ctrl and Alt keys
  let isCtrlKeyPressed = false, isAltKeyPressed = false;

  // Helper function to set key states
  const setKeyState = (key, value) => {
    if (key === 'Control') isCtrlKeyPressed = value;
    if (key === 'Alt') isAltKeyPressed = value;
  };

  // Add event listeners for keydown and keyup events
  ['keydown', 'keyup'].forEach(eventType =>
    document.addEventListener(eventType, (event) => setKeyState(event.key, eventType === 'keydown'))
  );

  // Reset key states when focus or blur events occur
  ['blur', 'focus'].forEach(eventType =>
    document.addEventListener(eventType, () => {
      if (isCtrlKeyPressed || isAltKeyPressed) {
        console.log(`${isCtrlKeyPressed ? 'Ctrl ' : ''}${isAltKeyPressed ? 'Alt ' : ''}key was true`);
        isCtrlKeyPressed = isAltKeyPressed = false;
      }
    })
  );

  // SCROLL BUTTONS

  // Helper function to apply common styles to a scroll button
  function applyScrollButtonStyles(button) {
    button.style.width = '48px';
    button.style.height = '48px';
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
    button.style.alignItems = 'center';
    button.style.cursor = 'pointer';
    button.style.setProperty('border-radius', '0.2em', 'important');
    button.style.backgroundColor = '#282b2f';
    button.style.margin = '0.5em 0';
    button.style.filter = 'brightness(1)';
    button.style.transition = 'filter 0.3s ease';
  }

  // Global function to update button opacity using a single configuration object
  function updateScrollButtonOpacity({ container, buttons }) {
    const tolerance = 3,
      isAtTop = container.scrollTop === 0,
      isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - tolerance;
    [buttons.fullScrollUpButton, buttons.partialScrollUpButton].forEach(button => {
      button.style.opacity = isAtTop ? '0.3' : '1';
      button.style.pointerEvents = isAtTop ? 'none' : 'auto';
    });
    [buttons.fullScrollDownButton, buttons.partialScrollDownButton].forEach(button => {
      button.style.opacity = isAtBottom ? '0.3' : '1';
      button.style.pointerEvents = isAtBottom ? 'none' : 'auto';
    });
  }

  // New function to update the visibility of the scroll buttons container
  function updateScrollButtonsVisibility({ container, scrollButtonsContainer }) {
    // If the container is scrollable, show the buttons container; otherwise, hide it.
    if (container.scrollHeight > container.clientHeight) {
      scrollButtonsContainer.style.display = 'flex';
    } else {
      scrollButtonsContainer.style.display = 'none';
    }
  }

  function createScrollButtons(container) {
    // Create container for the scroll buttons
    const scrollButtonsContainer = document.createElement('div');
    scrollButtonsContainer.className = 'scroll-buttons-container';
    scrollButtonsContainer.style.display = 'flex';
    scrollButtonsContainer.style.justifyContent = 'center';
    scrollButtonsContainer.style.gridArea = 'scroll';
    scrollButtonsContainer.style.flexDirection = 'column';
    scrollButtonsContainer.style.height = 'calc(100% - 1em)';
    scrollButtonsContainer.style.padding = '1em';

    // Create each scroll button
    const fullScrollUpButton = document.createElement('div');
    fullScrollUpButton.innerHTML = chevronsUpSVG;
    applyScrollButtonStyles(fullScrollUpButton);
    fullScrollUpButton.title = 'Scroll Up (Full)';
    scrollButtonsContainer.appendChild(fullScrollUpButton);

    const partialScrollUpButton = document.createElement('div');
    partialScrollUpButton.innerHTML = chevronUpSVG;
    applyScrollButtonStyles(partialScrollUpButton);
    partialScrollUpButton.title = 'Scroll Up (Partial)';
    scrollButtonsContainer.appendChild(partialScrollUpButton);

    const partialScrollDownButton = document.createElement('div');
    partialScrollDownButton.innerHTML = chevronDownSVG;
    applyScrollButtonStyles(partialScrollDownButton);
    partialScrollDownButton.title = 'Scroll Down (Partial)';
    scrollButtonsContainer.appendChild(partialScrollDownButton);

    const fullScrollDownButton = document.createElement('div');
    fullScrollDownButton.innerHTML = chevronsDownSVG;
    applyScrollButtonStyles(fullScrollDownButton);
    fullScrollDownButton.title = 'Scroll Down (Full)';
    scrollButtonsContainer.appendChild(fullScrollDownButton);

    // Bundle buttons into an object for easy reference
    const buttons = {
      fullScrollUpButton: fullScrollUpButton,
      partialScrollUpButton: partialScrollUpButton,
      partialScrollDownButton: partialScrollDownButton,
      fullScrollDownButton: fullScrollDownButton
    };

    // Generic function to scroll the container
    function scrollContainer(direction, isFullScroll) {
      const scrollAmount = isFullScroll ? container.scrollHeight : container.clientHeight;
      container.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      updateScrollButtonOpacity({ container: container, buttons: buttons });
    }

    // Attach click events
    fullScrollUpButton.addEventListener('click', () => scrollContainer('up', true));
    partialScrollUpButton.addEventListener('click', () => scrollContainer('up', false));
    partialScrollDownButton.addEventListener('click', () => scrollContainer('down', false));
    fullScrollDownButton.addEventListener('click', () => scrollContainer('down', true));

    // Initial update of opacity and container visibility
    updateScrollButtonOpacity({ container, buttons });
    updateScrollButtonsVisibility({ container, scrollButtonsContainer });

    // Update on scroll
    container.addEventListener('scroll', () => {
      updateScrollButtonOpacity({ container, buttons });
      updateScrollButtonsVisibility({ container, scrollButtonsContainer });
    });

    // Return an object containing the scroll buttons container and each individual button
    return { scrollButtonsContainer, ...buttons };
  }

  // SOUND NOTIFICATION

  // Function to create the audio context and return a Promise that resolves when the context is ready
  function createAudioContext() {
    const audioContext = new AudioContext();
    return new Promise(resolve => {
      audioContext.onstatechange = function () {
        if (audioContext.state === 'running') {
          resolve(audioContext);
        }
      };
    });
  }

  // Create the audio context and wait for it to be ready
  const audioContextPromise = createAudioContext();

  // List of frequencies to play for "User Left" && "User Entered" && "New Messages"
  const userEnteredFrequencies = [300, 600];
  const userLeftFrequencies = [600, 300];
  const usualMessageFrequencies = [500];
  const mentionMessageFrequencies = [600, 800];

  // Volume of the reader voice
  const voiceVolume = 0.8;
  // Volume of the beep signal
  const beepVolume = 0.2;
  // Duration for each frequency
  const duration = 80;
  // Smooth inception and termination for each note
  const fade = 10;
  // Space between each note to make noticeable pauses
  const delay = 100;

  // Function to play a beep given a list of frequencies
  function playBeep(frequencies, volume) {
    audioContextPromise.then(audioContext => {
      for (let i = 0; i < frequencies.length; i++) {
        const frequency = frequencies[i];
        if (frequency === 0) {
          // Rest note
          setTimeout(() => { }, duration);
        } else {
          // Play note
          const oscillator = audioContext.createOscillator();
          const gain = audioContext.createGain();
          oscillator.connect(gain);
          oscillator.frequency.value = frequency;
          oscillator.type = "sine";

          // Create low pass filter to cut frequencies below 250Hz
          const lowPassFilter = audioContext.createBiquadFilter();
          lowPassFilter.type = 'lowpass';
          lowPassFilter.frequency.value = 250;
          oscillator.connect(lowPassFilter);

          // Create high pass filter to cut frequencies above 16kHz
          const highPassFilter = audioContext.createBiquadFilter();
          highPassFilter.type = 'highpass';
          highPassFilter.frequency.value = 16000;
          lowPassFilter.connect(highPassFilter);

          gain.connect(audioContext.destination);
          gain.gain.setValueAtTime(0, audioContext.currentTime);
          gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + fade / 1000);
          oscillator.start(audioContext.currentTime + i * delay / 1000);
          oscillator.stop(audioContext.currentTime + (i * delay + duration) / 1000);
          gain.gain.setValueAtTime(volume, audioContext.currentTime + (i * delay + (duration - fade)) / 1000);
          gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + (i * delay + duration) / 1000);
        }
      }
    });
  }

  // Create a promise that will resolve when the list of available voices is populated
  const awaitVoices = new Promise(resolve => {
    // Create a speech synthesis object
    const synth = window.speechSynthesis;
    // Retrieve the list of available voices
    let voices = synth.getVoices();

    // Define the voice names for Pavel and Irina
    const pavelVoiceName = 'Microsoft Pavel - Russian (Russia)';
    const irinaVoiceName = 'Microsoft Irina - Russian (Russia)';

    // Find and store Pavel's voice
    let pavelVoice = voices.find(voice => voice.name === pavelVoiceName);
    // Find and store Irina's voice
    let irinaVoice = voices.find(voice => voice.name === irinaVoiceName);

    // If either voice is not found or the voices list is empty, wait for it to populate
    if (!pavelVoice || !irinaVoice || voices.length === 0) {
      synth.addEventListener('voiceschanged', () => {
        voices = synth.getVoices();
        pavelVoice = voices.find(voice => voice.name === pavelVoiceName);
        irinaVoice = voices.find(voice => voice.name === irinaVoiceName);

        // If both voices are found, continue with the initialization
        if (pavelVoice && irinaVoice) {
          // Define the utterance object as a global variable
          const utterance = new SpeechSynthesisUtterance();
          // Set the "lang" property of the utterance object to 'ru-RU'
          utterance.lang = 'ru-RU';
          // Set the "voice" property of the utterance object to Pavel's voice
          utterance.voice = irinaVoice;
          // Resolve the promise
          resolve({ synth, utterance, voices, pavelVoice, irinaVoice });
        }
      });
    } else {
      // Define the utterance object as a global variable
      const utterance = new SpeechSynthesisUtterance();
      // Set the "lang" property of the utterance object to 'ru-RU'
      utterance.lang = 'ru-RU';
      // Set the "voice" property of the utterance object to (Needed) voice
      utterance.voice = irinaVoice;
      // Resolve the promise
      resolve({ synth, utterance, voices, pavelVoice, irinaVoice });
    }
  });

  async function cleanText(text) {
    return text
      // Replace all hyphens (- U+002D), minus signs (− U+2212), and underscores (_) with spaces
      .replace(/[-−_]/g, ' ')
      // Replace URLs with just the domain name, removing "https://", "http://", and "www."
      .replace(/https?:\/\/(?:www\.)?([a-zA-Z0-9.-]+)(\/.*)?/g, (_, p1) => p1)
      .replace(/\s(?=[?!,.:;@])/g, '')
      // Remove all other symbols completely
      .replace(/["#$%&'()*+\/<=>[\\\]^`{|}~]/g, '')
      // Remove extra spaces and format text
      .split(' ').filter(Boolean).join(' ').trim();
  }

  // Split text into language blocks (Russian vs. English) based on per-word detection.
  const detectLanguageBlocks = text =>
    text.split(/\s+/).reduce((blocks, word) => {
      const lang = /[А-Яа-яЁё0-9]/.test(word) ? 'ru' : 'en';
      if (blocks.length && blocks[blocks.length - 1].lang === lang) {
        blocks[blocks.length - 1].text += ' ' + word;
      } else {
        blocks.push({ lang, text: word });
      }
      return blocks;
    }, []);

  // Fallback: Web Speech API TTS
  async function webTextToSpeech(text, voiceSpeed = voiceSpeed) {
    const { synth, utterance, voice } = await awaitVoices;
    Object.assign(utterance, { text, rate: voiceSpeed, volume: voiceVolume, pitch: voicePitch, voice });
    return new Promise(resolve => { utterance.onend = resolve; synth.speak(utterance); });
  }

  // Main TTS function: plays each language block in order.
  async function textToSpeech(text, voiceSpeed = voiceSpeed) {
    const shouldUseGoogleTTS = shouldEnableSetting('sound', 'gTTS');
    // Clean the text using the new cleanText function asynchronously
    const cleanedText = await cleanText(text);

    // If Google TTS is enabled, use it. Otherwise, fallback to Web Speech API.
    if (shouldUseGoogleTTS) {
      const blocks = detectLanguageBlocks(cleanedText);
      try {
        for (const { lang, text } of blocks) {
          await new Promise((resolve, reject) => {
            fetch(`http://127.0.0.1:5000/speak?text=${encodeURIComponent(text)}&lang=${lang}`)
              .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.arrayBuffer(); })
              .then(buffer => {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const audio = new Audio(URL.createObjectURL(new Blob([buffer], { type: 'audio/mp3' })));
                const source = audioContext.createMediaElementSource(audio);
                const gainNode = audioContext.createGain();

                gainNode.gain.value = 2.0; // Boost volume

                // Connect the audio source to the gain node and the gain node to the destination (speakers)
                source.connect(gainNode);
                gainNode.connect(audioContext.destination);

                audio.onended = resolve;
                audio.onerror = reject;
                audio.play();
              })
              .catch(reject);
          });
        }
      } catch (error) {
        console.error("Server TTS failed:", error);
      }
    } else {
      // If Google TTS isn't enabled, fallback to Web Speech API
      await webTextToSpeech(text, voiceSpeed);
    }
  }

  const verbs = {
    Male: { enter: 'зашёл', leave: 'вышел' },
    Female: { enter: 'зашла', leave: 'вышла' }
  };

  function getUserGender(userName) {
    const user = usersToTrack.find((user) => user.name === userName);
    return user ? user.gender : null;
  }

  // Handles user entering and leaving actions
  function userAction(user, actionType, userGender) {
    const shouldPlayAction = shouldEnableSetting('sound', 'presence');
    // If neither beep and voice is enabled, exit early.
    if (!shouldPlayAction) return;

    const gender = userGender || 'Male'; // Default to 'Male' if no gender provided
    const userToTrack = usersToTrack.find(userToTrack => userToTrack.name === user);
    const action = actionType === "enter" ? verbs[gender].enter : verbs[gender].leave;
    const frequencies = actionType === "enter" ? userEnteredFrequencies : userLeftFrequencies;

    playBeep(frequencies, beepVolume);
    setTimeout(() => textToSpeech(`${userToTrack.pronunciation} ${action}`, voiceSpeed), 300);
  }

  // POPUPS

  // Generate HSL color with optional parameters for hue, saturation, lightness
  function getHSLColor(hue = 180, saturation = 50, lightness = 50) {
    return `hsl(${hue},${saturation}%,${lightness}%)`;
  }

  // Helper for pausing execution
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function purgeStaticChatNotifications(
    removalDelay = 40,
    scrollDuration = 600,
    animationDuration = 140
  ) {
    const chat = document.querySelector(".messages-content");
    if (!chat) return;

    // Save original scroll behavior and set to smooth once
    const originalScrollBehavior = chat.style.scrollBehavior;
    chat.style.scrollBehavior = 'smooth';

    const elements = [...document.querySelectorAll('.static-chat-notification')].reverse();

    for (const el of elements) {
      const needsScroll = !isVisibleInContainer(el, chat);

      if (needsScroll) {
        // Smooth scroll to element
        chat.scrollTop = el.offsetTop - chat.offsetTop - chat.clientHeight / 2;
        await sleep(scrollDuration);
      }

      Object.assign(el.style, {
        transition: [
          `opacity ${animationDuration / 1000}s cubic-bezier(.3,.1,1,.1)`,
          `transform ${animationDuration / 1000}s cubic-bezier(0,.7,.3,0.95)`
        ].join(','),
        opacity: 0,
        transformOrigin: 'left',
        transform: 'translateX(8em) skewX(-20deg)'
      });

      // Wait for animation to complete before removal
      await sleep(animationDuration);
      el.remove();

      // Standard delay between elements
      await sleep(removalDelay);
    }

    // Final scroll to bottom only if needed
    const isAtBottom = chat.scrollHeight - chat.scrollTop <= chat.clientHeight;
    if (!isAtBottom) {
      chat.scrollTop = chat.scrollHeight;
      await sleep(scrollDuration);
    }

    // Restore original scroll behavior
    chat.style.scrollBehavior = originalScrollBehavior;
  }

  function isVisibleInContainer(el, container) {
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return (
      elRect.top >= containerRect.top &&
      elRect.bottom <= containerRect.bottom
    );
  }

  const svgUrl = "http://www.w3.org/2000/svg";
  const iconStrokeWidth = 2;
  const iconSize = 28;

  // SVG icon for entering
  const enterSVGStrokeColor = "currentColor";
  const enterSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 12}"
      height="${iconSize - 12}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${enterSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="icon-enter icon-feather icon-log-in">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <polyline points="10 17 15 12 10 7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>`;

  // SVG icon for leaving
  const leaveSVGStrokeColor = "currentColor";
  const leaveSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 12}"
      height="${iconSize - 12}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${leaveSVGStrokeColor}" stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="icon-leave icon-feather icon-log-out">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>`;

  // SVG icon for the moderator with gradient
  const moderatorSVGStopColorStart = "rgb(255, 215, 0)";
  const moderatorSVGStopColorEnd = "rgb(255, 140, 0)";
  const moderatorSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 10}"
      height="${iconSize - 10}"
      viewBox="0 0 24 24"
      fill="url(#moderatorGradient)"  <!-- Use a gradient fill -->
      stroke="none"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-shield">
    <!-- Define the gradient -->
    <defs>
        <linearGradient id="moderatorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color: ${moderatorSVGStopColorStart}; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: ${moderatorSVGStopColorEnd}; stop-opacity: 1" />
        </linearGradient>
    </defs>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>`;

  // SVG icon for the tracked with gradient stroke
  const trackedSVGStopColorStart = "rgb(135, 206, 250)";
  const trackedSVGStopColorEnd = "rgb(0, 191, 255)";
  const trackedSVG = `
  <svg xmlns="${svgUrl}"
       width="${iconSize - 12}"
       height="${iconSize - 12}"
       viewBox="0 0 24 24"
       fill="url(#trackedGradient)"  <!-- Use a gradient fill -->
       class="feather feather-star">
      <!-- Define the gradient for the fill -->
    <defs>
      <linearGradient id="trackedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color: ${trackedSVGStopColorStart}; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: ${trackedSVGStopColorEnd}; stop-opacity: 1" />
      </linearGradient>
    </defs>
    <!-- Use the gradient for the fill -->
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      stroke="url(#trackedGradient)"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round">
    </polygon>
  </svg>`;

  // SVG icon for ignored users
  const ignoredSVGStrokeColor = "rgb(255, 160, 122)";
  const ignoredSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 12}"
      height="${iconSize - 12}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${ignoredSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-slash">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
  </svg>`;

  // SVG markup for a clock icon
  const clockSVGStrokeColor = "currentColor";
  const clockSVG = `
  <svg xmlns="${svgUrl}"
       width="${iconSize - 12}"
       height="${iconSize - 12}"
       viewBox="0 0 24 24"
       fill="none"
       stroke="${clockSVGStrokeColor}"
       stroke-width="${iconStrokeWidth}"
       stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>`;

  // SVG for the "chevron right" icon, used in a popup chat messages
  const actionSVGStrokeColor = "currentColor";
  const actionSVG = `
    <svg xmlns="${svgUrl}"
        width="${iconSize - 12}"
        height="${iconSize - 12}"
        viewBox="0 0 24 24"
        fill="none"
        stroke="${actionSVGStrokeColor}"
        stroke-width="${iconStrokeWidth}"
        stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>`;

  // SVG markup for a user icon
  const userSVGStrokeColor = "currentColor";
  const userSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 12}"
      height="${iconSize - 12}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${userSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-user">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>`;

  // Button SVG icons "silence", "beep", "voice" representation
  const silenceSVGStrokeColor = "hsl(355, 80%, 65%)";
  const beepSVGStrokeColor = "hsl(55, 80%, 65%)";
  const voiceSVGStrokeColor = "hsl(80, 80%, 40%)";
  const silenceSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize}"
      height="${iconSize}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${silenceSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>`;

  const beepSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize}"
      height="${iconSize}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${beepSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" opacity="0.3"></path>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>`;

  const voiceSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize}"
      height="${iconSize}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${voiceSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>`;

  // Icons for message mode button
  // Button SVG icons "every", "mention" representation
  const modeEverySVGStrokeColor = "hsl(100, 50%, 50%)";
  const iconModeEvery = `
  <svg xmlns="${svgUrl}"
      width="${iconSize}"
      height="${iconSize}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${modeEverySVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>`;

  const modeMentionSVGStrokeColor = "hsl(180, 60%, 50%)";
  const modeMentionSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize}"
      height="${iconSize}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${modeMentionSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>`;

  // Icon for the out of range value
  const rangeisOutSVGStrokeColor = "currentColor";
  const iconRangeisOut = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 12}"
      height="${iconSize - 12}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${rangeisOutSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-slash">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
  </svg>`;

  // Icon for userlistCache
  const userlistCacheSVGStrokeColor = "rgb(180, 213, 131)";
  const userlistCacheSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize}"
      height="${iconSize}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${userlistCacheSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-database">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>`;

  // Icon for personal messages
  const personalMessagesSVGStrokeColor = "rgb(255, 160, 122)";
  const personalMessagesSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize}"
      height="${iconSize}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${personalMessagesSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>`;

  // Icon for chat logs
  const chatLogsSVGStrokeColor = "rgb(100, 149, 237)";
  const chatLogsSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize}"
      height="${iconSize}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${chatLogsSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle">
      <path 
          d="M21 11.5 a8.38 8.38 0 0 1 -.9 3.8 a8.5 8.5 0 0 1 -7.6 4.7 a8.38 8.38 0 0 1 -3.8 -.9
          L3 21 l1.9 -5.7 a8.38 8.38 0 0 1 -.9 -3.8 a8.5 8.5 0 0 1 4.7 -7.6
          a8.38 8.38 0 0 1 3.8 -.9 h.5 a8.48 8.48 0 0 1 8 8 v.5 z">
      </path>
  </svg>`;

  // Icon for media messages
  const mediaMessagesSVGStrokeColor = "rgb(113, 196, 196)";
  const mediaMessagesSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${mediaMessagesSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-film">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
    <line x1="7" y1="2" x2="7" y2="22"></line>
    <line x1="17" y1="2" x2="17" y2="22"></line>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="7" x2="7" y2="7"></line>
    <line x1="2" y1="17" x2="7" y2="17"></line>
    <line x1="17" y1="17" x2="22" y2="17"></line>
    <line x1="17" y1="7" x2="22" y2="7"></line>
  </svg>`;

  // Icon for the disabled chat button
  const deniedSVGStrokeColor = "rgb(255, 100, 100)";
  const deniedSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 12}"
      height="${iconSize - 12}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${deniedSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-slash">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
  </svg>`;

  // Inline SVG source for the settings icon
  const settingsSVGStrokeColor = "rgb(255, 228, 196)";
  const settingsSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${settingsSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-sliders">
    <line x1="4" y1="21" x2="4" y2="14"></line>
    <line x1="4" y1="10" x2="4" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12" y2="3"></line>
    <line x1="20" y1="21" x2="20" y2="16"></line>
    <line x1="20" y1="12" x2="20" y2="3"></line>
    <line x1="1" y1="14" x2="7" y2="14"></line>
    <line x1="9" y1="8" x2="15" y2="8"></line>
    <line x1="17" y1="16" x2="23" y2="16"></line>
  </svg>`;

  // Inline SVG source for the "x" icon (close button)
  const closeSVGStrokeColor = "rgb(144, 238, 144)";
  const closeSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${closeSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>`;

  // Inline SVG source for the "chevrons up" icon
  const chevronsSVGStrokeColor = "rgb(211, 211, 211)";
  const chevronsUpSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${chevronsSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevrons-up">
    <polyline points="17 11 12 6 7 11"></polyline>
    <polyline points="17 18 12 13 7 18"></polyline>
  </svg>`;

  // Inline SVG source for the "chevron up" icon
  const chevronUpSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${chevronsSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>`;

  // Inline SVG source for the "chevron down" icon
  const chevronDownSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${chevronsSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>`;

  // Inline SVG source for the "chevrons down" icon
  const chevronsDownSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${chevronsSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevrons-down">
    <polyline points="7 13 12 18 17 13"></polyline>
    <polyline points="7 6 12 11 17 6"></polyline>
  </svg>`;

  // Inline SVG source for the "toggle-right" icon
  const toggleRightSVGStrokeColor = "rgb(137, 187, 255)";
  const toggleRightSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 25 25"
      fill="none"
      stroke="${toggleRightSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-toggle-right">
    <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
    <circle cx="16" cy="12" r="3"></circle>
  </svg>`;

  // Inline SVG source for the "toggle-left" icon
  const toggleLeftSVGStrokeColor = "rgb(137, 187, 255)";
  const toggleLeftSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 25 25"
      fill="none"
      stroke="${toggleLeftSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-toggle-left">
    <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
    <circle cx="8" cy="12" r="3"></circle>
  </svg>`;

  // Inline SVG source for the "calendar" icon
  const calendarSVGStrokeColor = "rgb(176, 196, 222)";
  const calendarSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${calendarSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>`;

  // Inline SVG source for the "clipboard" icon
  const clipboardSVGStrokeColor = "rgb(176, 196, 222)";
  const clipboardSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${clipboardSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-clipboard">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>`;

  // SVG for the "chevron left" icon, used to change chat logs one day backward
  const chevronLeftSVGStrokeColor = "rgb(28, 229, 229)";
  const chevronLeftSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${chevronLeftSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>`;

  // SVG for the "chevron right" icon, used to change chat logs one day forward
  const chevronRightSVGStrokeColor = "rgb(28, 229, 229)";
  const chevronRightSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${chevronRightSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right">
      <polyline points="9 18 15 12 9 6"></polyline>
  </svg>`;

  // SVG for the "shuffle" icon, used to select a random year, month, and day
  const shuffleSVGStrokeColor = "rgb(169, 155, 255)";
  const shuffleSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${shuffleSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-shuffle">
    <polyline points="16 3 21 3 21 8"></polyline>
    <line x1="4" y1="20" x2="21" y2="3"></line>
    <polyline points="21 16 21 21 16 21"></polyline>
    <line x1="15" y1="15" x2="21" y2="21"></line>
    <line x1="4" y1="4" x2="9" y2="9"></line>
  </svg>`;

  // Inline SVG source for the trash icon
  const trashSVGStrokeColor = "rgb(255, 140, 0)";
  const trashSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${trashSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>`;

  // Inline SVG source for the users icon
  const usersSVGStrokeColor = "currentColor";
  const usersSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${usersSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-users">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>`;

  // Inline SVG source for the "import" icon (export button)
  const importSVGStrokeColor = "rgb(209, 144, 238)";
  const importSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${importSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-download">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>`;

  // Inline SVG source for the "export" icon (import button)
  const exportSVGStrokeColor = "rgb(144, 185, 238)";
  const exportSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${exportSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}" stroke-linecap="round"
      stroke-linejoin="round" class="feather feather-upload">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>`;

  // Inline SVG source for the "save" icon (save button)
  const saveSVGStrokeColor = "rgb(144, 238, 220)";
  const saveSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 4}"
      height="${iconSize - 4}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${saveSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-save">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>`;

  // Inline SVG source for the "remove" icon (remove button)
  const removeSVGStrokeColor = "rgb(238, 144, 144)";
  const removeSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 12}"
      height="${iconSize - 12}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${removeSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>`;

  // Inline SVG source for the "snowflake" icon
  const snowflakeSVGStrokeColor = "rgb(176, 196, 222)";
  const snowflakeSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 8}"
      height="${iconSize - 8}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${snowflakeSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-snowflake">
    <g id="snowflake">
      <line x1="12.06" y1="2.74" x2="12.06" y2="12.06" />
      <line x1="20.12" y1="7.4" x2="12.06" y2="12.06" />
      <line x1="20.12" y1="16.71" x2="12.06" y2="12.06" />
      <line x1="12.06" y1="21.37" x2="12.06" y2="12.06" />
      <line x1="3.99" y1="16.71" x2="12.06" y2="12.06" />
      <line x1="3.99" y1="7.4" x2="12.06" y2="12.06" />
      <polyline points="8.96,4.67 12.06,7.77 15.16,4.67"/>
      <polyline points="16.9,5.68 15.76,9.92 20,11.05"/>
      <polyline points="20,13.06 15.76,14.2 16.9,18.43"/>
      <polyline points="15.16,19.44 12.06,16.34 8.96,19.44"/>
      <polyline points="7.21,18.43 8.35,14.2 4.11,13.06"/>
      <polyline points="4.11,11.05 8.35,9.92 7.21,5.68"/>
    </g>
  </svg>`;

  // Inline SVG source for the "add" icon (add button)
  const addSVGStrokeColor = "rgb(209, 144, 238)";
  const addSVG = `
  <svg xmlns="${svgUrl}"
      width="${iconSize - 12}"
      height="${iconSize - 12}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${addSVGStrokeColor}"
      stroke-width="${iconStrokeWidth}"
      stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>`;

  // Function to check if a specific setting should be enabled based on localStorage settings
  function shouldEnableSetting(settingType, specificType) {
    const toggleData = JSON.parse(localStorage.getItem('toggle')) || []; // Retrieve toggle settings or default to empty array

    // Define toggle names for different setting types
    const toggleNames = {
      notifications: {
        static: 'showChatStaticNotifications',
        dynamic: 'showGlobalDynamicNotifications'
      },
      sound: {
        presence: 'enableBeepOnChatJoinLeave',
        gTTS: 'switchToGoogleTTSEngine'
      }
    };

    const settingName = toggleNames[settingType];

    if (!settingName || !settingName[specificType]) return false;

    // Check if the specified setting toggle is set to 'yes'
    return toggleData.some(toggle =>
      toggle.name === settingName[specificType] && toggle.option === 'yes'
    );
  }

  // Helper function to get current time formatted as [HH:MM:SS]
  function getCurrentTimeFormatted() {
    return new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function getUserChatDuration(username, actionTime) {
    // Retrieve stored user data and find the target user by login
    const user = Object.values(JSON.parse(localStorage.getItem('fetchedUsers') || '[]'))
      .find(u => u?.login === username);
    if (!user) return `❌ User "${username}" not found`;

    const actionLog = user.actionLog || [];
    const current = actionLog.find(entry => entry.timestamp === actionTime);
    if (!current) return `Action not found at ${actionTime}`;

    const actionIndex = actionLog.indexOf(current);
    if (actionIndex === 0) return `🙌 ${username}'s first action`;

    // Find the most recent action before the current one that has a different type
    const prev = actionLog.slice(0, actionIndex).reverse().find(a => a.type !== current.type);
    if (!prev) return `❌ No valid previous action found for ${actionTime}`;

    // Calculate the duration between the two timestamps
    const duration = calculateDuration(prev.timestamp, current.timestamp);
    return current.type === 'leave'
      ? `🛑 ${username} stayed in chat for ${duration}`
      : `✅ ${username} was absent for ${duration}`;
  }

  function calculateDuration(start, end) {
    const toSeconds = t => t.split(':').reduce((acc, val, i) =>
      acc + val * [3600, 60, 1][i], 0); // Convert HH:MM:SS to total seconds

    const diff = Math.abs(toSeconds(end) - toSeconds(start)); // Get absolute difference in seconds

    return [
      Math.floor(diff / 3600), // Hours
      Math.floor((diff % 3600) / 60), // Minutes
      diff % 60 // Seconds
    ].map(n => n.toString().padStart(2, '0')).join(':'); // Format as HH:MM:SS
  }

  let tooltipInstance = null;
  let tooltipHideTimeout = null;
  let tooltipShowTimeout = null;
  let isTooltipVisible = false;
  let isTooltipShown = false;
  let currentElement = null;

  const tooltipMousemoveHandler = (e) => {
    if (tooltipInstance) {
      tooltipInstance.style.left = `${e.clientX + 0}px`;
      tooltipInstance.style.top = `${e.clientY + 18}px`;
    }
  };

  // Global hide function
  const hideTooltip = () => {
    isTooltipVisible = false;
    currentElement = null;
    clearTimeout(tooltipShowTimeout);
    tooltipShowTimeout = null;

    clearTimeout(tooltipHideTimeout);
    tooltipHideTimeout = setTimeout(() => {
      if (tooltipInstance) {
        tooltipInstance.style.opacity = '0';
        isTooltipShown = false;
        setTimeout(() => {
          if (!isTooltipVisible && tooltipInstance) {
            tooltipInstance.style.display = 'none';
            document.removeEventListener('mousemove', tooltipMousemoveHandler);
          }
        }, 50);
      }
    }, 100);
  };

  // MutationObserver to check element removal
  const observer = new MutationObserver(() => {
    if (currentElement && !document.contains(currentElement)) {
      hideTooltip();
    }
  });
  observer.observe(document, { childList: true, subtree: true });

  function createCustomTooltip(element, tooltipText) {
    if (element.classList.contains('events-included')) return;
    element.classList.add('events-included');

    tooltipInstance ||= (() => {
      const tooltipElement = document.createElement('div');
      tooltipElement.classList.add("tooltip");
      Object.assign(tooltipElement.style, {
        position: 'fixed',
        background: 'rgb(22, 22, 22)',
        color: 'rgb(222, 222, 222)',
        padding: '0.5em',
        zIndex: 1200,
        fontSize: '0.9em',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        opacity: 0,
        transition: 'opacity 0.1s',
        display: 'none',
        left: 0,
        top: 0
      });
      tooltipElement.style.setProperty('border', '1px solid rgb(60, 60, 60)', 'important');
      tooltipElement.style.setProperty('border-radius', '4px', 'important');
      tooltipElement.style.setProperty('box-shadow', '0 2px 5px rgba(0,0,0,0.3)', 'important');
      document.body.appendChild(tooltipElement);
      return tooltipElement;
    })();

    const showTooltip = (e) => {
      isTooltipVisible = true;
      currentElement = element;
      clearTimeout(tooltipShowTimeout);
      clearTimeout(tooltipHideTimeout);
      tooltipInstance.textContent = tooltipText;

      document.addEventListener('mousemove', tooltipMousemoveHandler);
      tooltipMousemoveHandler(e);

      if (!isTooltipShown) {
        tooltipShowTimeout = setTimeout(() => {
          tooltipInstance.style.display = 'flex';
          tooltipInstance.style.opacity = '1';
          isTooltipShown = true;
        }, 600);
      }
    };

    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  }

  // Timeout before the dynamicChatNotification should be removed
  const dynamicChatNotificationTimeout = 5000;
  // Set the initial top distance for the first dynamicChatNotification
  const dynamicChatNotificationTopOffset = 160;

  // Creates the action icon element
  function createActionIcon(iconType) {
    const actionIcon = document.createElement('div');
    actionIcon.classList.add('action-icon');
    actionIcon.style.margin = '0 4px';
    actionIcon.style.setProperty('border', 'none', 'important');
    actionIcon.innerHTML = iconType;
    return actionIcon;
  }

  // Function to create and display a static notification
  function createStaticNotification(user, iconType, time, presence, containerType) {
    // Define a mapping for container types to their respective selectors
    const containerSelectors = {
      generalChat: '.messages-content div', // For general chat notifications
      cachePanel: '.fetched-users .action-log' // For cache notifications
    };

    // Get the container based on the passed containerType
    const containerSelector = containerSelectors[containerType];

    // If the container selector is not defined, return
    if (!containerSelector) {
      console.error("Invalid or missing container. Please provide 'generalChat' or 'cachePanel'.");
      return;
    }

    const staticNotificationsContainer = document.querySelector(containerSelector);
    if (!staticNotificationsContainer) {
      console.error("Container not found in DOM.");
      return;
    }

    // Add a class to the container based on the container type
    staticNotificationsContainer.classList.add(
      containerType === 'generalChat'
        ? 'static-chat-notifications-container'
        : 'static-cache-notifications-container'
    );

    // Create the action icon based on the iconType provided
    const staticChatNotification = document.createElement('div');
    staticChatNotification.classList.add('static-chat-notification');

    // Add double-click listener to purge notifications only if using the generalChat container
    if (containerType === 'generalChat') {
      staticChatNotification.addEventListener('dblclick', () => {
        purgeStaticChatNotifications();
      });
    }

    // Create the user element
    const userElement = document.createElement('span');
    userElement.classList.add("action-user");
    userElement.textContent = user;

    // Create the action icon based on the iconType provided
    const actionIcon = createActionIcon(iconType);

    // Create the time element
    const timeElement = document.createElement('span');
    timeElement.classList.add("action-time");
    timeElement.textContent = time;

    // Append elements in order: user span, action icon, time span
    staticChatNotification.appendChild(userElement);
    staticChatNotification.appendChild(actionIcon);
    staticChatNotification.appendChild(timeElement);

    // Store username and time as data attributes for easy access later
    staticChatNotification.dataset.username = user;
    staticChatNotification.dataset.time = time;

    // Style based on presence
    if (presence) {
      staticChatNotification.classList.add('user-entered');
      staticChatNotification.style.color = getHSLColor(100, 50, 50);
      staticChatNotification.style.backgroundColor = getHSLColor(100, 50, 10);
      staticChatNotification.style.setProperty('border', `1px solid ${getHSLColor(100, 50, 25)}`, 'important');
    } else {
      staticChatNotification.classList.add('user-left');
      staticChatNotification.style.color = getHSLColor(0, 50, 70);
      staticChatNotification.style.backgroundColor = getHSLColor(0, 50, 15);
      staticChatNotification.style.setProperty('border', `1px solid ${getHSLColor(0, 50, 40)}`, 'important');
    }

    // Set layout styles
    staticChatNotification.style.cursor = 'default';
    staticChatNotification.style.whiteSpace = 'nowrap';
    staticChatNotification.style.padding = '8px';
    staticChatNotification.style.display = 'inline-flex';
    staticChatNotification.style.flex = 'auto';
    staticChatNotification.style.justifyContent = 'center';
    staticChatNotification.style.margin = '4px';
    staticChatNotification.style.fontSize = '1em';
    staticChatNotification.style.alignItems = 'center';
    staticChatNotification.style.setProperty('border-radius', '4px', 'important');

    // Append the notification to the selected container
    staticNotificationsContainer.appendChild(staticChatNotification);

    // Use the custom tooltip when the user enters the static notification
    staticChatNotification.addEventListener('mouseover', () => {
      // Use dataset to get the username and time from the static notification
      const usernameData = staticChatNotification.dataset.username;
      const timeData = staticChatNotification.dataset.time;
      // Get the user chat duration and pass it to the custom tooltip
      const title = getUserChatDuration(usernameData, timeData);
      // Create and display the custom tooltip
      createCustomTooltip(staticChatNotification, title);
    });
  }

  // Function to create and animate a dynamic notification
  function createDynamicNotification(user, iconType, time, presence) {
    let dynamicChatNotificationsContainer = document.querySelector('.dynamic-chat-notifications-container');
    // Create container if it doesn't exist
    if (!dynamicChatNotificationsContainer) {
      dynamicChatNotificationsContainer = document.createElement('div');
      dynamicChatNotificationsContainer.classList.add('dynamic-chat-notifications-container');

      Object.assign(dynamicChatNotificationsContainer.style, {
        zIndex: '1000',
        width: '0',
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        paddingTop: dynamicChatNotificationTopOffset + 'px',
      });

      document.body.appendChild(dynamicChatNotificationsContainer);
    }

    // Create the notification element
    const dynamicChatNotification = document.createElement('div');
    dynamicChatNotification.classList.add('dynamic-chat-notification');

    // Create user element
    const userElement = document.createElement('span');
    userElement.classList.add("action-user");
    userElement.textContent = user;

    // Create the action icon based on the iconType provided
    const actionIcon = createActionIcon(iconType);

    // Create time element
    const timeElement = document.createElement('span');
    timeElement.classList.add("action-time");
    timeElement.textContent = time;

    // Append elements in order: user span, action icon, time span
    dynamicChatNotification.appendChild(userElement);
    dynamicChatNotification.appendChild(actionIcon);
    dynamicChatNotification.appendChild(timeElement);

    // Store username and time as data attributes for easy access later
    dynamicChatNotification.dataset.username = user;
    dynamicChatNotification.dataset.time = time;

    // Set initial styles and position (off-screen)
    dynamicChatNotification.style.cursor = 'default';
    dynamicChatNotification.style.whiteSpace = 'nowrap';
    dynamicChatNotification.style.position = 'relative';
    dynamicChatNotification.style.alignItems = 'center';
    dynamicChatNotification.style.width = 'fit-content';
    dynamicChatNotification.style.display = 'flex';
    dynamicChatNotification.style.marginBottom = '0.2em';
    dynamicChatNotification.style.padding = '8px 16px 8px 12px';
    dynamicChatNotification.style.left = '0';
    dynamicChatNotification.style.transform = 'translateX(-100%)';
    dynamicChatNotification.style.opacity = '1';
    dynamicChatNotification.style.transition =
      'transform 0.3s cubic-bezier(0.83, 0, 0.17, 1), opacity 0.3s cubic-bezier(0.83, 0, 0.17, 1)';

    // Set colorization based on presence
    if (presence) {
      dynamicChatNotification.style.color = getHSLColor(100, 50, 50);
      dynamicChatNotification.style.backgroundColor = getHSLColor(100, 50, 10);
      dynamicChatNotification.style.border = `1px solid ${getHSLColor(100, 50, 25)}`;
    } else {
      dynamicChatNotification.style.color = getHSLColor(0, 50, 70);
      dynamicChatNotification.style.backgroundColor = getHSLColor(0, 50, 15);
      dynamicChatNotification.style.border = `1px solid ${getHSLColor(0, 50, 40)}`;
    }
    dynamicChatNotification.style.setProperty('border-radius', '0 4px 4px 0', 'important');

    // Append to the container
    dynamicChatNotificationsContainer.appendChild(dynamicChatNotification);

    // Use the custom tooltip when the user enters the static notification
    dynamicChatNotification.addEventListener('mouseover', () => {
      // Use dataset to get the username and time from the static notification
      const usernameData = dynamicChatNotification.dataset.username;
      const timeData = dynamicChatNotification.dataset.time;
      // Get the user chat duration and pass it to the custom tooltip
      const title = getUserChatDuration(usernameData, timeData);
      // Create and display the custom tooltip
      createCustomTooltip(dynamicChatNotification, title);
    });

    // Animate: slide in, then slide out and remove
    setTimeout(() => {
      dynamicChatNotification.style.transform = 'translateX(0)';
      setTimeout(() => {
        dynamicChatNotification.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          dynamicChatNotificationsContainer.removeChild(dynamicChatNotification);
        }, 300); // after slide-out animation
      }, dynamicChatNotificationTimeout);
    }, 300);
  }

  // Main function which now calls the appropriate notification function(s)
  function showUserAction(user, iconType, presence) {
    // Check if the user is tracked and in the correct state
    const isTrackedUser = usersToTrack.some(
      (trackedUser) => trackedUser.name === user && trackedUser.state === 'thawed'
    );

    const shouldShowStatic = isTrackedUser && shouldEnableSetting('notifications', 'static');
    const shouldShowDynamic = shouldEnableSetting('notifications', 'dynamic');

    // If neither notification is enabled, exit early.
    if (!shouldShowStatic && !shouldShowDynamic) return;

    // Get current time formatted as [HH:MM:SS]
    const time = getCurrentTimeFormatted();

    if (shouldShowStatic && isTrackedUser) {
      createStaticNotification(user, iconType, time, presence, 'generalChat');
      scrollMessagesToBottom();
    }

    if (shouldShowDynamic) {
      createDynamicNotification(user, iconType, time, presence);
    }
  }

  // FUNCTIONALITY

  /*
     * Converts links to images in chat messages by creating a thumbnail and a big image on click.
     * Looks for links that contain ".jpg" or ".jpeg" or ".png" or ".gif" or "webp" extension and creates a thumbnail with the image.
     * If a thumbnail already exists, it skips the link and looks for the next one.
     * When a thumbnail is clicked, it creates a dimming layer and a big image that can be closed by clicking on the dimming layer or the big image itself.
     * Allows navigation through images using the left (<) and right (>) arrow keys.
     */

  // Define global variables for the current big image
  let bigImage = null;

  // Define an array to store all the thumbnail links and their corresponding image URLs
  const thumbnailLinks = [];
  let currentImageIndex = 0;
  const imageChangeDelay = 50; // Prevent double slide by single press adding slight delay
  let isChangingImage = false; // Flag to track if an image change is in progress

  const imageExtensionEmoji = '📸'; // Emoji for the image extension
  const videoExtensionEmoji = '🎥'; // Emoji for video extension
  const webDomainEmoji = '🖥️'; // Emoji for the web domain
  const untrustedEoji = '💀️️';

  // List of allowed image extensions
  const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

  // List of trusted domains
  const trustedDomains = [
    'klavogonki.ru',
    'youtube.com', // youtube main
    'youtu.be', // youtube share
    'imgur.com',
    'pikabu.ru',
    'userapi.com', // vk.com
    'ibb.co', // imgbb.com
    'yaplakal.com',
    'freepik.com'
  ];

  /**
   * Checks if a given URL has an allowed image extension.
   * @param {string} url - The URL to check.
   * @returns {{allowed: boolean, extension: string}} - If the extension is allowed and its type.
   */
  function isAllowedImageExtension(url) {
    // Shared extension extraction logic
    const getExtension = (str) =>
      (str.match(/\.([^?#.]+)(?:[?#]|$)/i)?.[1]?.toLowerCase() || '');

    try {
      const extension = getExtension(url);
      return {
        allowed: allowedImageExtensions.includes(extension),
        extension
      };
    } catch (error) {
      console.error("Error in isAllowedImageExtension:", error.message);
      return {
        allowed: false,
        extension: getExtension(String(url)) // Handle non-string URLs
      };
    }
  }

  /**
   * Checks if a given URL belongs to a trusted domain.
   * @param {string} url - The URL to check.
   * @returns {{isTrusted: boolean, domain: string}} - Whether the domain is trusted and the extracted domain.
   */
  function isTrustedDomain(url) {
    try {
      const parsedURL = new URL(url);
      const hostnameParts = parsedURL.hostname.toLowerCase().split('.');
      const domain = hostnameParts.length > 2 ? hostnameParts.slice(-2).join('.') : parsedURL.hostname;
      return { isTrusted: trustedDomains.includes(domain), domain };
    } catch (error) {
      console.error("Error in isTrustedDomain:", error.message);
      return { isTrusted: false, domain: url }; // Return original URL as domain in case of error
    }
  }

  function convertImageLinksToImage(containerType) {
    const containerSelectors = {
      generalMessages: ".messages-content div",
      chatlogsMessages: ".chat-logs-container",
      personalMessages: ".messages-container-wrapper"
    }

    const container = document.querySelector(containerSelectors[containerType]);
    if (!container) return;

    const links = container.querySelectorAll("a:not(.skipped):not(.processed-image)");
    if (!links.length) return;

    links.forEach(link => {
      if (!link.href || !link.href.startsWith("http")) return;

      const { allowed, extension } = isAllowedImageExtension(link.href);
      if (!allowed) return;

      // Add class media if allowed image extenstion
      link.classList.add("media");

      const { isTrusted, domain } = isTrustedDomain(link.href);
      link.title = isValidEncodedURL(link.href) ? decodeURL(link.href) : link.href;

      // Handle untrusted domains
      if (!isTrusted) {
        link.classList.add("skipped");
        link.textContent = `${imageExtensionEmoji} Image (${extension.toUpperCase()}) ${webDomainEmoji} Hostname (${domain}) ${untrustedEoji} Untrusted`;

        // Directly handle the image loading on link click
        link.addEventListener("click", e => {
          if (!link.classList.contains("processed-image")) {
            e.preventDefault(); // Prevent default behavior only if not processed yet
            link.classList.remove("skipped");
            link.classList.add("processed-image");
            createThumbnail(link, true); // Force thumbnail creation
          }
        })
      } else {
        link.textContent = `${imageExtensionEmoji} Image (${extension.toUpperCase()}) ${webDomainEmoji} Hostname (${domain})`;
        link.classList.add("processed-image");
        // Create thumbnail for trusted links directly
        createThumbnail(link, false);
      }
    })

    function createThumbnail(link, isUntrusted) {
      const thumbnail = document.createElement("div");
      Object.assign(thumbnail.style, {
        border: "none",
        width: "6vw",
        minWidth: "100px",
        maxHeight: "200px",
        height: "auto",
        cursor: "pointer",
        backgroundColor: "transparent",
        padding: "2px",
        margin: "6px",
        overflowY: "auto"
      })
      thumbnail.classList.add("thumbnail");

      const img = document.createElement("img");
      img.src = link.href;
      img.style.maxHeight = "100%";
      img.style.maxWidth = "100%";
      img.style.backgroundColor = "transparent";

      img.onload = () => {
        thumbnail.appendChild(img);
        link.parentNode.insertBefore(thumbnail, link.nextSibling);
        thumbnailLinks.push({ link, imgSrc: link.href });
        scrollMessagesToBottom(containerType);
      }

      img.onerror = () => {
        console.error("Failed to load image:", link.href);
        link.classList.add("skipped");
      }

      // Only show thumbnail on click for untrusted domains
      if (isUntrusted) {
        // Check if thumbnail already created, avoid creating again
        if (!link.querySelector(".thumbnail")) {
          link.addEventListener("click", e => {
            // Only create thumbnail once
            if (!link.querySelector(".thumbnail")) {
              thumbnail.appendChild(img); // Add image to thumbnail on user confirmation
              link.parentNode.insertBefore(thumbnail, link.nextSibling);
            }
          })
        }
      } else {
        // Show the thumbnail directly for trusted domains
        thumbnail.appendChild(img);
        link.parentNode.insertBefore(thumbnail, link.nextSibling);
      }

      thumbnail.addEventListener("click", e => {
        e.stopPropagation();

        bigImage = createBigImage(img.src);
        Object.assign(bigImage.style, {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(1)",
          position: "fixed",
          opacity: "0",
          zIndex: "999",
          transformOrigin: "center center"
        })
        triggerTargetElement(bigImage, "show");
        triggerDimmingElement("show");
      })
    }
  }

  // Object to store event handlers for big image
  const bigImageEvents = {};

  function addBigImageEventListeners() {
    Object.entries(bigImageEvents).forEach(([event, handler]) => {
      document.addEventListener(event, handler);
    })
  }

  function removeBigImageEventListeners() {
    Object.entries(bigImageEvents).forEach(([event, handler]) => {
      document.removeEventListener(event, handler);
    })
  }

  // Function to create a big image with a dimming layer
  function createBigImage(src) {
    const bigImage = document.createElement('img');
    bigImage.src = src;
    bigImage.classList.add('scaled-thumbnail');
    bigImage.style.maxHeight = '90vh';
    bigImage.style.maxWidth = '90vw';
    bigImage.style.cursor = "pointer";

    document.body.appendChild(bigImage);

    const removeBigImage = (bigImage) => {
      // Hide the big image and check if there are any popup panels open before hiding the dimming element
      triggerTargetElement(bigImage, 'hide');

      if (!document.querySelector('.popup-panel')) {
        triggerDimmingElement('hide');
      }
      // Remove all event listeners
      removeBigImageEventListeners();
    }

    // Close when clicking outside the big image
    bigImageEvents.unfocusedClick = function (event) {
      if (!bigImage.contains(event.target)) { // If clicked outside the image
        bigImage.remove(); // Directly remove the image from the DOM
        removeBigImageEventListeners(); // Clean up event listeners
      }
    }

    document.addEventListener('click', bigImageEvents.unfocusedClick);

    // Attach a keydown event listener for big image to close by ESC or Space and navigate with Arrow keys
    bigImageEvents.keydown = function (event) {
      if (event.code === 'Escape' || event.code === 'Space') { // Hide on ESC or Space
        event.preventDefault(); // Prevent default scrolling behavior for Space
        removeBigImage(bigImage);
      } else if (event.code === 'ArrowLeft') {
        navigateImages(-1);
      } else if (event.code === 'ArrowRight') {
        navigateImages(1);
      }
    }

    document.addEventListener('keydown', bigImageEvents.keydown);

    // ZOOM AND MOVE -- START

    // Set the initial zoom scale and scaling factor
    let zoomScale = 1;
    let scalingFactor = 0.1;

    // Set up variables for dragging
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let translateX = -50; // Initial translation in percentage
    let translateY = -50; // Initial translation in percentage

    // Define the movement speed
    const movementSpeed = 5;

    // Function to handle zooming
    bigImageEvents.wheel = function (event) {
      // Determine the direction of the mouse wheel movement
      const deltaY = event.deltaY;
      const direction = deltaY < 0 ? 1 : -1;

      // Update the zoom scale based on the direction and scaling factor
      zoomScale += direction * scalingFactor * zoomScale;

      // Clamp the zoom scale to a minimum of 1
      zoomScale = Math.max(zoomScale, 1);

      // Apply the new zoom scale and transform origin
      bigImage.style.transformOrigin = 'center center';
      bigImage.style.transform = `translate(${translateX}%, ${translateY}%) scale(${zoomScale})`;

      // Prevent the default scrolling behavior
      event.preventDefault();
    };

    // Function to update the image position smoothly
    bigImageEvents.mousemove = function (event) {
      if (isDragging) {
        // Calculate the distance moved since the last mousemove event
        const deltaX = (event.clientX - startX) / zoomScale * movementSpeed;
        const deltaY = (event.clientY - startY) / zoomScale * movementSpeed;

        // Update the translate values in percentages
        translateX += (deltaX / bigImage.clientWidth) * 100;
        translateY += (deltaY / bigImage.clientHeight) * 100;

        // Apply the new translate values in percentages
        bigImage.style.transform = `translate(${translateX}%, ${translateY}%) scale(${zoomScale})`;

        // Update the start position
        startX = event.clientX;
        startY = event.clientY;
      }
    };

    bigImageEvents.mousedown = function (event) {
      const { button, clientX, clientY, target, ctrlKey } = event;
      // Restrict LMB and RMB to image clicks only
      if ((button === 0 || button === 2) && target !== bigImage) return;
      let src = target.src; // Get the src from the clicked element

      if (button === 0) { // Left Mouse Button (LMB)
        ctrlKey ? window.open(src, "_blank") : navigateImages(-1);
      } else if (button === 2) { // Right Mouse Button (RMB)
        event.preventDefault();
        if (ctrlKey) {
          // Copy to clipboard and hide the big image
          navigator.clipboard.writeText(src).catch(console.error);
          removeBigImage(bigImage); // Close the big image after copying
        } else {
          navigateImages(1);
        }
      } else if (button === 1) { // Middle Mouse Button (MMB)
        isDragging = true;
        [startX, startY] = [clientX, clientY];
      }
    };

    bigImageEvents.mouseup = function () {
      isDragging = false; // Reset the dragging flag
    };

    // Add contextmenu listener to prevent right-click context menu
    bigImageEvents.contextmenu = function (event) {
      event.preventDefault(); // Prevent context menu from appearing
    };

    // Attach all event listeners
    addBigImageEventListeners();

    return bigImage;
  }

  // ZOOM AND MOVE -- END

  // Function to navigate between images within bounds
  function navigateImages(direction) {
    const newIndex = currentImageIndex + direction;

    // Ensure the new index stays within bounds
    if (newIndex >= 0 && newIndex < thumbnailLinks.length) {
      if (isChangingImage) {
        return; // If an image change is already in progress, do nothing
      }

      isChangingImage = true; // Set the flag to indicate image change is in progress

      // Update the bigImage with the new image URL
      if (bigImage) {
        bigImage.src = thumbnailLinks[newIndex].imgSrc;
      }

      // Set a timeout to reset the flag after a short delay
      setTimeout(() => {
        isChangingImage = false;
      }, imageChangeDelay); // Adjust the delay duration as needed (e.g., 50 milliseconds)

      // Update the current index
      currentImageIndex = newIndex;
    }
  }

  // List of allowed video extensions
  const allowedVideoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];

  /**
   * Checks if a given URL has an allowed video extension.
   * @param {string} url - The URL to check.
   * @returns {{allowed: boolean, extension: string}} - Indicates if the extension is allowed and returns the extension.
   */
  function isAllowedVideoExtension(url) {
    // Shared extension extraction logic
    const getExtension = (str) =>
      (str.match(/\.([^?#.]+)(?:[?#]|$)/i)?.[1]?.toLowerCase() || '');

    try {
      const extension = getExtension(url);
      return {
        allowed: allowedVideoExtensions.includes(extension),
        extension
      };
    } catch (error) {
      console.error("Error in isAllowedVideoExtension:", error.message);
      return {
        allowed: false,
        extension: getExtension(String(url)) // Handle non-string URLs
      };
    }
  }

  function convertVideoLinksToPlayer(containerType) {
    // Define container selectors for different message types
    const containerSelectors = {
      generalMessages: '.messages-content div',
      chatlogsMessages: '.chat-logs-container',
      personalMessages: '.messages-container-wrapper'
    };

    // Get the container selector based on the provided type
    const containerSelector = containerSelectors[containerType];
    if (!containerSelector) {
      console.error('Invalid container type specified');
      return;
    }

    // Select the container element
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Find all unprocessed links inside the container
    const links = container.querySelectorAll("a:not(.skipped):not(.processed-video)");
    if (!links.length) return;

    links.forEach(link => {
      const url = link.href;
      if (!url) return;

      // Get video details using our helper function
      const videoInfo = getVideoInfo(url);
      if (!videoInfo) return;

      // Add media class if youtube or video
      link.classList.add("media");

      // Check if the link's href includes a trusted domain
      const { isTrusted, domain } = isTrustedDomain(url);

      // For untrusted domains, add classes and update text before waiting for a click
      if (!isTrusted) {
        link.classList.add("skipped");
        link.textContent = `${videoExtensionEmoji} ${videoInfo.videoType} ${webDomainEmoji} Hostname (${domain}) ${untrustedEoji} Untrusted`;
        link.addEventListener("click", e => {
          if (!link.classList.contains("processed-video")) {
            e.preventDefault();
            link.classList.remove("skipped");
            processVideoLink(link, url, domain, videoInfo);
          }
        });
        return;
      }

      // For trusted links, process immediately
      processVideoLink(link, url, domain, videoInfo);
    });

    function processVideoLink(link, url, domain, videoInfo) {
      const { youtubeMatch, videoType, videoId } = videoInfo;
      // Use the helper function to check for allowed video extensions
      const videoCheck = isAllowedVideoExtension(url);
      if (!youtubeMatch && !videoCheck.allowed) return;

      // Add media and processed-video classes (if not already added)
      link.classList.add("processed-video");

      // Create a wrapper div for better structure
      const wrapper = document.createElement('div');
      Object.assign(wrapper.style, {
        display: 'flex',
        width: 'fit-content',
        flexDirection: 'column',
        gap: '6px',
        marginBottom: '10px'
      });

      // Create an appropriate embed element (iframe for YouTube, video for allowed formats)
      let embedElement = document.createElement(youtubeMatch ? 'iframe' : 'video');
      Object.assign(embedElement.style, {
        display: 'flex',
        border: 'none',
        height: '165px'
      });

      if (youtubeMatch) {
        // Update link text and set YouTube embed
        link.textContent = `${videoExtensionEmoji} ${videoType} ${webDomainEmoji} Hostname (${domain})`;
        embedElement.src = `https://www.youtube.com/embed/${videoId}`;
        embedElement.allowFullscreen = true;
      } else {
        // Update link text for MP4 videos
        link.textContent = `${videoExtensionEmoji} ${videoType} ${webDomainEmoji} Hostname (${domain})`;
        embedElement.src = url;
        embedElement.controls = true;
      }

      // Set link attributes and insert elements
      link.title = isValidEncodedURL(url) ? decodeURL(url) : url;
      link.style.display = 'inline-flex';
      link.parentNode.insertBefore(wrapper, link);
      wrapper.append(link, embedElement);

      // Scroll to the bottom of the container after processing links
      scrollMessagesToBottom(containerType);
    }

    // Helper function to get video information based on the URL
    function getVideoInfo(url) {
      const youtubeMatch = url.match(/(?:shorts\/|live\/|watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);

      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        const videoType = url.includes('shorts/') ? 'Shorts' :
          url.includes('live/') ? 'Live' :
            url.includes('watch?v=') ? 'Watch' :
              url.includes('youtu.be/') ? 'Share' : 'YouTube';
        return { youtubeMatch: true, videoId, videoType };
      }

      // Check if it's an MP4 or other video format
      const extension = url.split('.').pop().toLowerCase();
      if (allowedVideoExtensions.includes(extension)) {
        return { youtubeMatch: false, videoType: `Video (${extension.toUpperCase()})` };
      }

      return false; // Return false if no match
    }
  }

  // Function to check if a URL is valid and contains encoded characters
  function isValidEncodedURL(url) {
    const urlPattern = /^https?:\/\//; // Regex pattern to check if the value is a URL
    const encodedPattern = /%[0-9A-Fa-f]{2}/; // Regex pattern to check if the URL is encoded
    return urlPattern.test(url) && encodedPattern.test(url);
  }

  // Function to decode a URL and replace spaces with underscores
  function decodeURL(url) {
    const [base] = url.split('#'); // Split at the '#' symbol and take the base part
    return decodeURIComponent(base).replace(/ /g, '_'); // Decode and replace spaces with underscores
  }

  function processEncodedLinks(type) {
    // Select the appropriate container based on the 'type' parameter
    document.querySelector(({
      generalMessages: ".messages-content div", // General messages container
      chatlogsMessages: ".chat-logs-container", // Chat logs container
      personalMessages: ".messages-container-wrapper" // Personal messages container
    })[type])?.querySelectorAll('a:not(.media):not(.decoded)').forEach(link => { // Select all <a> links that haven't been decoded yet
      try {
        // Ensure the link is a valid encoded URL before decoding
        if (isValidEncodedURL(link.href)) {
          let decoded = decodeURL(link.href); // Decode the URL
          link.href = link.textContent = decoded; // Set the decoded URL as both the link href and text content
          link.classList.add('decoded'); // Mark the link as decoded by adding the 'decoded' class
        }
      } catch (error) {
        // If an error occurs during the decoding process, log the error and the link's href
        console.error('Error decoding link:', error, link.href); // Log error and link.href for debugging
      }
    });
  }

  const empowermentButtonsMargin = 4; // Margin for the empowerment buttons

  // Retrieve body element to inject this beast elements
  const bodyElement = document.querySelector('body');
  // Create parent container for the beast elements
  const empowermentButtonsPanel = document.createElement('div');
  empowermentButtonsPanel.classList.add('empowerment-panel');

  // Create chat user count container to store the user count number
  const chatUserCount = document.createElement('div');
  chatUserCount.title = 'Current Chat Users Count';
  chatUserCount.classList.add('chat-user-count');
  chatUserCount.style.filter = 'grayscale(100%)';
  chatUserCount.style.transition = '0.2s ease-in-out';
  chatUserCount.style.fontFamily = "'Orbitron', sans-serif";
  chatUserCount.style.fontSize = '24px';
  chatUserCount.style.color = '#83cf40';
  chatUserCount.style.backgroundColor = '#2b4317';
  chatUserCount.style.width = '48px';
  chatUserCount.style.height = '48px';
  chatUserCount.style.display = 'flex';
  chatUserCount.style.justifyContent = 'center';
  chatUserCount.style.alignItems = 'center';
  chatUserCount.style.border = '1px solid #4b7328';
  chatUserCount.style.margin = `${empowermentButtonsMargin}px`;
  // Set initial value as 0
  chatUserCount.innerHTML = '0';

  // Append user count element inside empowerment panel
  empowermentButtonsPanel.appendChild(chatUserCount);
  // Apply positioning styles for the empowerment panel
  empowermentButtonsPanel.style.position = 'fixed';
  empowermentButtonsPanel.style.top = '60px';
  empowermentButtonsPanel.style.right = '12px';
  empowermentButtonsPanel.style.padding = '6px';
  empowermentButtonsPanel.style.zIndex = '1000';
  // Append panel element inside the body
  bodyElement.appendChild(empowermentButtonsPanel);

  // Adjust element visibility with smooth opacity transition
  function adjustVisibility(element, action, opacity) {
    if (!element) return; // Exit if element doesn't exist

    // Force reflow to ensure initial state is recognized
    void element.offsetHeight;

    element.style.transition = 'opacity 0.3s'; // Apply smooth transition for both show and hide
    element.style.opacity = action === 'show' ? opacity : '0'; // Set target opacity

    // If hiding, wait for transition to finish before removing the element
    if (action === 'hide') {
      element.addEventListener('transitionend', () => {
        if (element.style.opacity === '0') element.remove(); // Remove only when opacity reaches 0
      }, { once: true }); // Ensure the event runs only once
    }
  }

  // Function to create and fade the dimming element
  function triggerDimmingElement(action) {
    // Check if the dimming element already exists
    let dimming = document.querySelector('.dimming-background');
    // Check if the scaled scaled thumbnail already exists
    let scaledThumbnail = document.querySelector('.scaled-thumbnail');

    // If the action is 'hide' and the dimming element doesn't exist, return
    if (action === 'hide' && !dimming) return;

    // Create the dimming element only if it doesn't exist
    if (!dimming) {
      dimming = document.createElement('div');
      dimming.classList.add('dimming-background');
      dimming.style.background = 'black';
      dimming.style.top = '0';
      dimming.style.left = '0';
      dimming.style.right = '0';
      dimming.style.bottom = '0';
      dimming.style.position = 'fixed';
      dimming.style.opacity = '0'; // Initial transparent state
      dimming.style.zIndex = '998';

      // Append the dimming element to the body
      document.body.appendChild(dimming);

      // Add click event listener to remove the dimming element and the upper element
      dimming.addEventListener('click', function () {
        // First, check for .popup-panel, then check for previousElementSibling
        const elementToRemove = document.querySelector('.popup-panel') || dimming.previousElementSibling;
        if (elementToRemove) adjustVisibility(elementToRemove, 'hide', 0); // Fade out and remove element
        triggerDimmingElement('hide');
        if (scaledThumbnail) removeBigImageEventListeners(); // Remove all bigImage event listeners
      });
    }

    // Adjust the visibility of an element with a dimming effect, setting opacity to 0.5
    adjustVisibility(dimming, action, 0.5);

    // If the action is 'hide', check for and remove the .scaled-thumbnail using triggerTargetElement
    if (action === 'hide') {
      if (scaledThumbnail) {
        removeBigImageEventListeners(); // Remove all bigImage event listeners
        triggerTargetElement(scaledThumbnail, 'hide'); // Use triggerTargetElement to fade out and remove the scaled-thumbnail
      }
    }
  }

  // Function to gradually fade a target element to show or hide it
  function triggerTargetElement(element, action) {
    if (!element) return; // Return if the element does not exist

    // Adjust the visibility of a specific element, setting opacity to 1 (fully visible)
    adjustVisibility(element, action, 1);

    // Add a double click event listener to hide the element
    element.addEventListener('dblclick', (event) => {
      // Check if any panel is open
      const isPanelOpen = document.querySelector('.popup-panel');
      // If any panel is open and the double-clicked target is the scaled image, do not hide the dimming element
      if (!isPanelOpen || !event.target.closest('.scaled-thumbnail')) {
        triggerDimmingElement('hide'); // Hide the dimming element on double click, unless the target is a scaled image and a panel is open
      }

      triggerTargetElement(element, 'hide'); // Always hide the target element on double click
    });
  }

  // Define an empty object to store event handlers
  let panelsEvents = {};

  function removeAllPanelEventListeners() {
    Object.values(panelsEvents).forEach((handler) => {
      document.removeEventListener('keydown', handler); // Use the correct event handler to remove the listener
    });
    // Clear the panelsEvents object by reassigning it to an empty object
    panelsEvents = {};
  }

  // Function to remove the previous panel if it exists
  function removePreviousPanel() {
    removeAllPanelEventListeners();
    const existingPanel = document.querySelector('.popup-panel');
    if (existingPanel) existingPanel.remove();
  }


  // NEW CHAT CACHE CONTROL PANEL (START)

  // Rank order mapping
  const rankOrder = {
    'Экстракибер': 1,
    'Кибергонщик': 2,
    'Супермен': 3,
    'Маньяк': 4,
    'Гонщик': 5,
    'Профи': 6,
    'Таксист': 7,
    'Любитель': 8,
    'Новичок': 9
  };

  // Rank color mapping
  const rankColors = {
    'Экстракибер': '#06B4E9', // Light Blue
    'Кибергонщик': '#5681ff', // Medium Blue
    'Супермен': '#B543F5', // Purple
    'Маньяк': '#DA0543', // Red
    'Гонщик': '#FF8C00', // Orange
    'Профи': '#C1AA00', // Yellow
    'Таксист': '#2DAB4F', // Green
    'Любитель': '#61B5B3', // Light Cyan
    'Новичок': '#AFAFAF' // Grey
  };

  // Tracks the last focused textarea within the iframe to manage input interactions
  let lastFocusedIframeTextarea = null;

  // Creates and manages an iframe modal for profile content
  const loadProfileIntoIframe = (url) => {
    // Create iframe element and configure basic attributes
    const profileIframe = document.createElement('iframe');
    profileIframe.classList.add('profile-iframe-container');
    profileIframe.src = url;

    // Apply positioning and dimensional styles (non-commented per request)
    Object.assign(profileIframe.style, {
      border: 'none',
      display: 'flex',
      position: 'fixed',
      zIndex: '999',
      width: '75vw',
      minWidth: '1000px',
      height: '80vh',
      top: '48.5vh',
      left: '50vw',
      transform: 'translate(-50%, -50%)'
    });

    // Add shadow and border-radius with !important priority
    profileIframe.style.setProperty('box-shadow', '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)', 'important');
    profileIframe.style.setProperty('border-radius', '0.6em', 'important');
    document.body.appendChild(profileIframe);

    // Cleanup function for removing the iframe and event listeners
    const removeIframe = () => {
      profileIframe.remove();
      document.removeEventListener('keydown', handleEvents);
      document.removeEventListener('mousedown', handleEvents);
    };

    // Unified event handler for closure interactions
    const handleEvents = (event) => {
      // Spacebar handling: prevent default closure when textarea is focused
      if (event.type === 'keydown' && event.code === 'Space') {
        if (lastFocusedIframeTextarea) {
          event.stopPropagation();
          return;
        }
        event.preventDefault();
        removeIframe();
      }
      // Close iframe when clicking outside
      if (event.type === 'mousedown' && !profileIframe.contains(event.target)) {
        removeIframe();
      }
    };

    // Attach global event listeners for closure triggers
    document.addEventListener('keydown', handleEvents);
    document.addEventListener('mousedown', handleEvents);

    // Configure iframe content interactions after load
    profileIframe.onload = () => {
      try {
        const iframeWindow = profileIframe.contentWindow;
        const iframeDoc = iframeWindow.document;

        // Track focused textareas within iframe
        iframeDoc.addEventListener('focusin', (e) => {
          if (e.target.tagName === 'TEXTAREA') {
            lastFocusedIframeTextarea = e.target;
          }
        });

        // Clear textarea focus tracking when leaving input
        iframeDoc.addEventListener('focusout', () => {
          setTimeout(() => {  // Delay to check new active element
            if (!iframeDoc.activeElement || iframeDoc.activeElement.tagName !== 'TEXTAREA') {
              lastFocusedIframeTextarea = null;
            }
          }, 0);
        });

        // Attach internal iframe closure triggers
        iframeWindow.addEventListener('keydown', handleEvents);
        iframeWindow.addEventListener('dblclick', removeIframe);

        // Monitor DOM changes for automatic closure conditions
        new MutationObserver((mutations, observer) => {
          // Close iframe when specific UI elements are removed
          if (mutations.some(m => [...m.removedNodes].some(n =>
            n.nodeType === 1 && (n.classList.contains('dimming-background') || n.classList.contains('cached-users-panel'))
          ))) {
            removeIframe();
            observer.disconnect();
          }
        }).observe(document.body, { childList: true, subtree: true });

      } catch (error) {
        // Handle cross-origin policy restrictions
        console.warn("Unable to access iframe contents:", error);
      }
    };
  };

  // Global function to prepend an emoticon to the visits element in the cache panel.
  function updateVisitsEmoticon(visitsElement) {
    // Convert content to number; exit if invalid
    const count = Number(visitsElement.textContent);
    if (isNaN(count)) return console.warn('Invalid visits count!');

    // Select emoticon: 0–10: 💧, 11–20: 💦, 21–30: 🌊, above 30: 🔥
    const emoticon = count <= 10 ? '💧' : count <= 20 ? '💦' : count <= 30 ? '🌊' : '🔥';

    visitsElement.textContent = `${emoticon} ${count}`;
  }

  // Function to display the cached user list panel
  function showCachePanel() {
    // Check if the panel already exists
    const existingPanel = document.querySelector('.cached-users-panel');
    if (existingPanel) {
      existingPanel.remove(); // Remove the settings panel
      triggerDimmingElement('hide');
      return; // Return immediately to prevent further execution
    }

    // Remove any previous panel before creating a new one
    removePreviousPanel();

    // Get data from localStorage
    const fetchedUsersData = localStorage.getItem('fetchedUsers');

    // Initialize users by parsing fetched data or setting as empty object
    let users = JSON.parse(fetchedUsersData) || {};

    // Create a container div with class 'cached-users-panel'
    const cachedUsersPanel = document.createElement('div');
    cachedUsersPanel.className = 'cached-users-panel popup-panel';
    // Set initial styles
    cachedUsersPanel.style.opacity = '0';
    cachedUsersPanel.style.backgroundColor = '#1b1b1b';
    cachedUsersPanel.style.setProperty('border-radius', '0.6em', 'important');
    cachedUsersPanel.style.position = 'fixed';
    cachedUsersPanel.style.top = '100px';
    cachedUsersPanel.style.left = '50%';
    cachedUsersPanel.style.transform = 'translateX(-50%)';
    cachedUsersPanel.style.width = '80vw';
    cachedUsersPanel.style.height = '80vh';
    cachedUsersPanel.style.zIndex = '999';
    cachedUsersPanel.style.display = 'grid';
    cachedUsersPanel.style.gridTemplateColumns = '1fr';
    cachedUsersPanel.style.gridTemplateRows = 'min-content';
    cachedUsersPanel.style.gridTemplateAreas = `
      "header header"
      "cache scroll"`;

    // Define the event handler function for the cache panel
    panelsEvents.handleCacheKeydown = (event) => { // Assign the function to the object
      if (event.key === 'Escape') {
        triggerTargetElement(cachedUsersPanel, 'hide');
        triggerDimmingElement('hide');
        document.removeEventListener('keydown', panelsEvents.handleCacheKeydown); // Remove the event listener
      }
    };

    // Attach the event listener
    document.addEventListener('keydown', panelsEvents.handleCacheKeydown);

    // Create a container div with class 'panel-header'
    const panelHeaderContainer = document.createElement('div');
    panelHeaderContainer.className = 'panel-header';
    panelHeaderContainer.style.display = 'flex';
    panelHeaderContainer.style.flexDirection = 'row';
    panelHeaderContainer.style.justifyContent = 'space-between';
    panelHeaderContainer.style.padding = '0.6em';
    panelHeaderContainer.style.gridArea = 'header';

    // Create a container div with class 'drop-time'
    const dropTime = document.createElement('div');
    dropTime.className = 'drop-time';
    dropTime.style.display = 'flex';
    dropTime.style.justifyContent = 'center';
    dropTime.style.alignItems = 'center';
    dropTime.style.minWidth = 'fit-content';

    // Create span with description for threshold time element
    const dropTimeThresholdDescription = document.createElement('span');
    dropTimeThresholdDescription.className = 'drop-time-threshold-description';
    dropTimeThresholdDescription.textContent = '🚧 Threshold';
    dropTimeThresholdDescription.style.padding = '0.6em';
    dropTimeThresholdDescription.style.color = '#c6b209';

    const dropTimeThreshold = document.createElement('span');
    dropTimeThreshold.className = 'drop-time-threshold';
    dropTimeThreshold.style.padding = '0.6em';
    dropTimeThreshold.style.color = 'lightcoral';
    dropTimeThreshold.style.fontFamily = "'Roboto Mono', monospace";
    dropTimeThreshold.style.fontSize = '1.1em';
    dropTimeThreshold.style.fontWeight = 'bold';
    dropTimeThreshold.style.setProperty('border-radius', '0.2em', 'important');
    dropTimeThreshold.style.border = '1px solid rgba(240, 128, 128, 0.20)';
    dropTimeThreshold.style.backgroundColor = 'rgba(240, 128, 128, 0.05)';
    dropTimeThreshold.style.transition = 'filter 0.3s';
    dropTimeThreshold.style.cursor = 'pointer';

    // Add mouseover event to apply brightness filter
    dropTimeThreshold.addEventListener('mouseover', () => {
      dropTimeThreshold.style.filter = 'sepia(1)'; // Increase brightness on hover
    });

    // Add mouseout event to reset filter
    dropTimeThreshold.addEventListener('mouseout', () => {
      dropTimeThreshold.style.filter = 'sepia(0)'; // Reset brightness on mouse out
    });

    // Get the value from the localStorage key 'cacheRefreshThresholdHours'
    const storedThresholdTime = localStorage.getItem('cacheRefreshThresholdHours');
    // Update the innerHTML with the stored value (default to '00:00:00' if the key is not set)
    dropTimeThreshold.innerHTML = storedThresholdTime || '00:00:00';
    // Attach click event to the dropTimeThreshold element
    dropTimeThreshold.addEventListener('click', setCacheRefreshTime);

    // Create span with description for expiration time element
    const dropTimeExpirationDescription = document.createElement('span');
    dropTimeExpirationDescription.className = 'drop-time-expiration-description';
    dropTimeExpirationDescription.textContent = '💣 Countdown';
    dropTimeExpirationDescription.style.padding = '0.6em';
    dropTimeExpirationDescription.style.color = '#d0562c';

    const dropTimeExpiration = document.createElement('span');
    dropTimeExpiration.className = 'drop-time-expiration';
    dropTimeExpiration.style.padding = '0.6em';
    dropTimeExpiration.style.color = 'antiquewhite';
    dropTimeExpiration.style.fontFamily = "'Roboto Mono', monospace";
    dropTimeExpiration.style.fontSize = '1.1em';

    // Function to prompt the user for a cache refresh time and update the content
    function setCacheRefreshTime() {
      let isValidInput = false;

      // Keep prompting the user until valid input is provided or they click "Cancel"
      while (!isValidInput) {
        // Prompt the user for a time
        const userInput = prompt('Enter a cache refresh time (e.g., HH, HH:mm, or HH:mm:ss):');

        // Get the dropTimeThreshold element
        const dropTimeThreshold = document.querySelector('.drop-time-threshold');

        // Validate the user input
        const timeRegex = /^([0-9]+|[01][0-9]|2[0-4])(:([0-5]?[0-9])(:([0-5]?[0-9]))?)?$/; // HH, HH:mm, or HH:mm:ss

        if (userInput === null) {
          // User clicked "Cancel," exit the loop
          isValidInput = true;
        } else if (timeRegex.test(userInput)) {
          // Valid input, extract hours and set default values for minutes and seconds if not provided
          const formattedInput = userInput.split(':');
          const hours = ('0' + formattedInput[0]).slice(-2);
          const minutes = ('0' + (formattedInput[1] || '00')).slice(-2);
          const seconds = ('0' + (formattedInput[2] || '00')).slice(-2);

          // Update the content of the dropTimeThreshold element
          dropTimeThreshold.textContent = `${hours}:${minutes}:${seconds}`;

          // Combine the values and store in localStorage with the key 'cacheRefreshThresholdHours'
          const formattedTime = `${hours}:${minutes}:${seconds}`;
          localStorage.setItem('cacheRefreshThresholdHours', formattedTime);

          // Remove fetchedUsers, lastClearTime, and nextClearTime keys
          localStorage.removeItem('fetchedUsers');
          localStorage.removeItem('lastClearTime');
          localStorage.removeItem('nextClearTime');

          // Reload the current page after (N) time after changing the cache threshold
          setTimeout(() => location.reload(), 1000);

          // Set isValidInput to true to exit the loop
          isValidInput = true;
        } else {
          // Alert the user for invalid input
          alert('Invalid time format. Please enter a valid time in the format HH, HH:mm, or HH:mm:ss.');
        }
      }
    }

    // Append the childs to the drop time parent element
    dropTime.appendChild(dropTimeThresholdDescription);
    dropTime.appendChild(dropTimeThreshold);
    dropTime.appendChild(dropTimeExpirationDescription);
    dropTime.appendChild(dropTimeExpiration);

    // Append the drop time element to the panel header container
    panelHeaderContainer.appendChild(dropTime);

    // Create a container div for the search input
    const cacheSearchContainer = document.createElement('div');
    cacheSearchContainer.className = 'search-for-cached-users';
    cacheSearchContainer.style.width = '100%';
    cacheSearchContainer.style.margin = '0 0.5em';
    cacheSearchContainer.style.display = 'flex';

    // Create the input field for searching users
    const cacheSearchInput = document.createElement('input');
    cacheSearchInput.className = 'cached-users-search-input';
    cacheSearchInput.type = 'text';
    cacheSearchInput.style.outline = 'none';
    cacheSearchInput.style.width = '100%';
    cacheSearchInput.style.padding = '10px';
    cacheSearchInput.style.fontSize = '1em';
    cacheSearchInput.style.fontFamily = 'Montserrat';
    cacheSearchInput.style.setProperty('color', 'bisque', 'important');
    cacheSearchInput.style.setProperty('border-radius', '0.2em', 'important');
    cacheSearchInput.style.boxSizing = 'border-box';
    cacheSearchInput.style.backgroundColor = '#111';
    cacheSearchInput.style.border = '1px solid #222';

    // Append search input to the search container
    cacheSearchContainer.appendChild(cacheSearchInput);

    // Add click event listener to clear the search input by LMB click with Ctrl key pressed
    cacheSearchInput.addEventListener('click', () => isCtrlKeyPressed && (cacheSearchInput.value = ''));

    // Add event listener to listen for keydown events
    cacheSearchInput.addEventListener('keydown', async (event) => {
      const oldUsersContainer = document.querySelector('.old-users');
      const newUsersContainer = document.querySelector('.new-users');
      const fetchedUsersContainer = document.querySelector('.fetched-users');

      // Handle Backspace key
      if (event.key === 'Backspace' && event.target.value.length === 0) {
        oldUsersContainer.style.display = 'grid';
        newUsersContainer.style.display = 'grid';

        const searchResultsContainer = document.querySelector('.search-results');
        if (searchResultsContainer && fetchedUsersContainer) {
          fetchedUsersContainer.removeChild(searchResultsContainer);
        }
      }
      // Handle Enter key
      else if (event.key === 'Enter') {
        const inputValue = event.target.value.trim();

        // If input is empty, set it to 'user '
        if (inputValue.length === 0) {
          event.preventDefault(); // Prevent the default behavior
          event.target.value = 'user '; // Set input to 'user '
        }
      }
    });

    // Create a function to handle the search process
    const handleSearch = async (username) => {
      const oldUsersContainer = document.querySelector('.old-users');
      const newUsersContainer = document.querySelector('.new-users');
      const fetchedUsersContainer = document.querySelector('.fetched-users');

      if (username) {
        // Temporarily hide old and new user containers
        oldUsersContainer.style.display = 'none';
        newUsersContainer.style.display = 'none';

        // Find or create the search results container
        let searchResultsContainer = document.querySelector('.search-results');
        if (!searchResultsContainer) {
          searchResultsContainer = createUserContainer('search-results');
          fetchedUsersContainer.appendChild(searchResultsContainer); // Append if it's newly created
        } else {
          // Clear previous search results if the container already exists
          searchResultsContainer.innerHTML = null; // Clear existing elements
        }

        const userElements = []; // Initialize userElements array

        try {
          // Fetch user IDs by username
          const userIds = await getUserIDsByName(username);

          // Iterate over each user ID and retrieve profile data
          await Promise.all(userIds.map(async (userId) => {
            // Retrieve the user's profile data once
            const profileData = await getUserProfileData(userId, false); // Do not touch localStorage key "fetchedUsers"

            // Create user element data using the retrieved profile data
            const userData = {
              rank: profileData.rank, // Assign rank directly
              login: profileData.login,
              registered: profileData.registeredDate, // Set registered to registeredDate
              bestSpeed: profileData.bestSpeed,
              ratingLevel: profileData.ratingLevel,
              friends: profileData.friends,
              cars: profileData.cars,
              avatarTimestamp: profileData.avatarTimestamp,
              avatar: profileData.avatar // Include avatar in userData
            };

            // Create the user element with userId and userData
            const userElementData = createCachePanelUserElement(userId, userData);
            if (userElementData) {
              userElements.push(userElementData);
            }
          }));

          // Sort userElements by rank and best speed
          userElements.sort((a, b) =>
            a.order !== b.order ? a.order - b.order : b.bestSpeed - a.bestSpeed
          );

          // Append user elements to the search results container
          userElements.forEach(({ userElement }) => {
            searchResultsContainer.appendChild(userElement);
          });

          // Create and append the description for search results
          const searchDescription = createDescription(`Search Results for: ${username}`, 'search-results-description');
          searchResultsContainer.prepend(searchDescription); // Append description as the first element

        } catch (error) {
          console.error('Error fetching user profile:', error);

          // Create an error message element and append it to the container
          const errorMessage = document.createElement('div');
          errorMessage.className = 'error-message';
          errorMessage.textContent = `Error fetching user profile: ${error.message}`;
          errorMessage.style.width = 'fit-content';
          errorMessage.style.whiteSpace = 'nowrap';
          errorMessage.style.fontFamily = 'Montserrat';
          errorMessage.style.color = 'lightcoral';
          searchResultsContainer.appendChild(errorMessage);
        }
      }
    };

    // Debounce the handleSearch function to prevent excessive calls
    cacheSearchInput.addEventListener(
      'input',
      debounce((event) => {
        const inputValue = event.target.value.trim();
        const searchMode = localStorage.getItem('cachePanelSearchMode');

        // Extract username if input starts with 'user ', or use input directly in 'fetch' mode
        const username = inputValue.startsWith('user ')
          ? inputValue.substring(5).trim()
          : (searchMode === 'fetch' ? inputValue : '');

        // Trigger search if a valid username exists
        if (username) handleSearch(username);
      }, debounceTimeout)
    );

    // Append the search container to the panel header container
    panelHeaderContainer.appendChild(cacheSearchContainer);

    // Use a mutation observer to wait for the element to appear in the DOM
    const observer = new MutationObserver(mutations => {
      if (mutations.some(mutation => mutation.type === 'childList' && mutation.addedNodes.length > 0)) {
        const cachePanelSearchInput = document.querySelector('.cached-users-search-input');
        const cachePanelLogins = Array.from(document.querySelectorAll('.fetched-users .login'));

        // Fuzzy match scoring function
        const getFuzzyMatchScore = (query, text) => {
          let score = 0, queryIndex = 0;
          for (const char of text.toLowerCase()) {
            if (queryIndex < query.length && char === query[queryIndex].toLowerCase()) {
              score += 2; // Increment score for matching character
              queryIndex++; // Increment index for the next character
            }
          }
          return queryIndex === query.length ? score : 0;
        };

        // Filter items based on input query
        const filterItems = query => {
          cachePanelLogins.forEach(item => {
            const userContainer = item.closest('.user');
            userContainer.style.display = (!query || getFuzzyMatchScore(query, item.textContent) > 0) ? 'grid' : 'none';
          });
        };

        // Set focus to the search input field
        cachePanelSearchInput.focus();

        // Add input event listener to filter items as the user types
        cachePanelSearchInput.addEventListener('input', () => filterItems(cachePanelSearchInput.value.trim()));

        observer.disconnect();
      }
    });

    // Start observing the panel header container for changes
    observer.observe(panelHeaderContainer, { childList: true, subtree: true });

    // Create a container div with class 'panel-control-buttons'
    const panelControlButtons = document.createElement('div');
    panelControlButtons.className = 'panel-control-buttons';
    panelControlButtons.style.display = 'flex';

    // Helper function to apply common styles to a button
    function applyHeaderButtonStyles(button, backgroundColor, margin = '0 0.5em') {
      button.style.backgroundColor = backgroundColor;
      button.style.width = '48px';
      button.style.height = '48px';
      button.style.display = 'flex';
      button.style.justifyContent = 'center';
      button.style.alignItems = 'center';
      button.style.cursor = 'pointer';
      button.style.setProperty('border-radius', '0.2em', 'important');
      button.style.margin = margin; // Set margin using the provided value
      button.style.filter = 'brightness(1)';
      button.style.transition = 'filter 0.3s ease';
    }

    // Create cache panel search mode button with the provided SVG icon
    const cachePanelSearchMode = document.createElement('div');
    cachePanelSearchMode.className = 'user-mode-button';
    cachePanelSearchMode.innerHTML = usersSVG;
    // Apply common styles using the helper function
    applyHeaderButtonStyles(cachePanelSearchMode, 'darkslateblue');

    // Set the initial value or existing for cachePanelSearchMode if it doesn't exist
    const currentSearchMode = localStorage.getItem('cachePanelSearchMode') || (localStorage.setItem('cachePanelSearchMode', 'cache'), 'cache');

    // Set the title dynamically
    cachePanelSearchMode.title = `Current active mode: ${currentSearchMode}`;

    // Function to update styles based on the current mode
    function updateStyles(mode) {
      const backgroundColor = mode === 'fetch' ? '#b2a4f9' : 'darkslateblue';
      const strokeColor = mode === 'fetch' ? 'darkslateblue' : '#b2a4f9';

      // Apply the new background color using the helper function
      applyHeaderButtonStyles(cachePanelSearchMode, backgroundColor);

      // Update the SVG stroke color
      const svg = cachePanelSearchMode.querySelector('svg');
      if (svg) {
        svg.setAttribute('stroke', strokeColor);
      }
    }

    // Initial mode setup
    updateStyles(currentSearchMode);

    // Add click event listener to the cache panel search mode button
    cachePanelSearchMode.addEventListener('click', () => {
      // Toggle between 'cache' and 'fetch' values
      const currentMode = localStorage.getItem('cachePanelSearchMode');
      const newMode = currentMode === 'cache' ? 'fetch' : 'cache';
      // Set new mode in localStorage
      localStorage.setItem('cachePanelSearchMode', newMode);
      // Update styles based on the new mode
      updateStyles(newMode);
      // Set the title dynamically based on the new mode
      cachePanelSearchMode.title = `Current active mode: ${newMode}`;
      // Optional: Log the current mode for debugging
      // console.log(`Current mode: ${newMode}`);
    });

    // Append the search mode button to the panel header container
    panelControlButtons.appendChild(cachePanelSearchMode);

    // Create a clear cache button with the provided SVG icon
    const clearCacheButton = document.createElement('div');
    clearCacheButton.className = 'clear-cache-button';
    clearCacheButton.title = 'Clear cache';
    clearCacheButton.innerHTML = trashSVG;
    // Apply common styles using the helper function
    applyHeaderButtonStyles(clearCacheButton, 'brown');

    // Add a click event listener to the clear cache button
    clearCacheButton.addEventListener('click', () => {
      // Call the helper function to hide and remove the cachedUsersPanel
      hideCachePanel();
      // Clear the cache manually and reset the timer
      refreshFetchedUsers(true, cacheRefreshThresholdHours);

      // Set the user count element to 0
      const userCountElement = document.querySelector('.cache-panel-load-button .cache-user-count');
      if (userCountElement) userCountElement.textContent = '0'; // Set the user count to 0
    });

    // Append the clear cache button to the panel header container
    panelControlButtons.appendChild(clearCacheButton);

    // Create a close button with the provided SVG icon
    const closePanelButton = document.createElement('div');
    closePanelButton.className = 'close-panel-button';
    closePanelButton.title = 'Close panel';
    closePanelButton.innerHTML = closeSVG;
    // Apply common styles using the helper function
    applyHeaderButtonStyles(closePanelButton, 'darkolivegreen', '0 0 0 0.5em');

    // Add a click event listener to the close panel button
    closePanelButton.addEventListener('click', () => {
      // Remove the cached-users-panel when the close button is clicked
      hideCachePanel();
    });

    // Append the close button to the panel header container
    panelControlButtons.appendChild(closePanelButton);

    // Append the panel control buttons element inside the panel header container
    panelHeaderContainer.appendChild(panelControlButtons);

    // Create a container div with class 'fetched-users'
    const fetchedUsersContainer = document.createElement('div');
    fetchedUsersContainer.className = 'fetched-users';

    // Set grid layout properties
    fetchedUsersContainer.style.display = 'grid'; // Use grid layout
    fetchedUsersContainer.style.gridTemplateRows = '1fr 1fr'; // Stack two rows for new and old users
    fetchedUsersContainer.style.height = 'calc(100% - 0.5em)'; // Set height for main container
    fetchedUsersContainer.style.overflowY = 'auto'; // Enable vertical scrolling if needed
    fetchedUsersContainer.style.gridArea = 'cache';

    // Function to create a user container with common styles
    function createUserContainer(className) {
      const userContainer = document.createElement('div');
      userContainer.className = className;

      // Add common CSS styles for grid layout and centering
      userContainer.style.display = 'grid';
      // userContainer.style.gridAutoFlow = 'dense'; // Allows items to fill empty spaces
      userContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))'; // Responsive columns
      userContainer.style.gap = '12px'; // Space between items
      userContainer.style.padding = '1em';
      userContainer.style.height = 'fit-content';

      return userContainer;
    }

    // Create containers for old and new users
    const oldUsersContainer = createUserContainer('old-users');
    const newUsersContainer = createUserContainer('new-users');

    // Function to create a description for user groups
    function createDescription(text, className) {
      const description = document.createElement('span');
      description.className = className;
      description.textContent = text;
      description.style.color = 'bisque';
      description.style.fontFamily = 'Montserrat';
      description.style.fontSize = '1em';
      description.style.margin = '0';
      description.style.padding = '0.4em 0.2em';
      // Make description span all columns
      description.style.gridColumn = '1 / -1';
      description.style.height = 'fit-content';
      return description;
    }

    // Create and style descriptions for old and new users
    const oldUsersDescription = createDescription('Active Users', 'old-users-description'); // Create description for old users
    const newUsersDescription = createDescription('New Registrations', 'new-users-description'); // Create description for new users

    // Append descriptions to their respective containers
    oldUsersContainer.appendChild(oldUsersDescription); // Append description to old users container
    newUsersContainer.appendChild(newUsersDescription); // Append description to new users container

    // Append containers to the fetchedUsersContainer
    fetchedUsersContainer.appendChild(oldUsersContainer);
    fetchedUsersContainer.appendChild(newUsersContainer);

    // Create an array to hold user elements
    const userElements = [];

    // Flag to control if action log processing should continue
    let shouldProcessActionLog = true;

    // Get current date for comparison
    const currentDate = new Date();

    // Helper function to check if registered date is within the last 24 hours
    const isNewUser = (registered) => {
      const registeredDate = new Date(registered);
      const timeDifference = currentDate - registeredDate; // Difference in milliseconds
      return timeDifference <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    };

    // This function creates a user element for the cache panel with detailed user information and metrics.
    const createCachePanelUserElement = (userId, userData) => {
      // Create the main container for the user.
      const userElement = document.createElement('div');
      userElement.className = 'user';
      userElement.style.padding = '0.2em';
      userElement.style.margin = '0.4em 0.2em';
      userElement.style.display = 'grid';
      userElement.style.gridTemplateColumns = 'auto 1fr';
      userElement.style.alignItems = 'center';
      userElement.style.height = 'fit-content';

      // Define base styling for tracked and untracked users for visits element
      const baseStyle = {
        marginLeft: '8px',
        padding: '4px 6px',
        borderRadius: '2px !important',
        cursor: 'pointer',
        whiteSpace: 'pre'
      };

      // Styles for tracked and untracked users for visits element
      const styles = {
        tracked: { ...baseStyle, color: 'greenyellow', backgroundColor: 'darkgreen', fontWeight: 'bold' },
        untracked: { ...baseStyle, color: 'orange', backgroundColor: '#111111', fontWeight: 'normal' }
      };

      // Helper function to convert styles into a CSS string.
      const generateStylesString = (styles) =>
        Object.entries(styles)
          .map(([key, value]) => `${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}: ${value}`)
          .join('; ');

      // Choose the appropriate style based on whether the user is tracked.
      const chosenStyles = userData.tracked ? styles.tracked : styles.untracked;

      // Create an avatar container.
      const avatarElement = document.createElement('div');
      avatarElement.className = 'avatar';
      avatarElement.style.marginRight = '8px';

      // Handle avatar URL and display logic.
      const avatarTimestamp = fetchedUsers[userId]?.avatarTimestamp;
      const bigAvatarUrl = `/storage/avatars/${userId}_big.png`;

      if ((avatarTimestamp && avatarTimestamp !== '00') || (userData.avatar && Object.keys(userData.avatar).length > 0)) {
        const finalAvatarUrl = `${bigAvatarUrl}?updated=${avatarTimestamp}`;
        const imgElement = document.createElement('img');
        imgElement.src = finalAvatarUrl;
        imgElement.alt = `${userData.login}'s avatar`;
        imgElement.style.height = '24px';
        imgElement.style.width = '24px';
        imgElement.style.objectFit = 'cover';
        avatarElement.appendChild(imgElement);
      } else {
        // Display a random emoji avatar if no avatar is available.
        avatarElement.style.fontSize = '1.8rem';
        avatarElement.innerHTML = getRandomEmojiAvatar();
      }

      // Create the user data container and append login and rank elements.
      const userDataElement = document.createElement('div');
      userDataElement.className = 'user-data';

      // Create a container to hold the login and visits elements
      const loginContainer = document.createElement('div');
      loginContainer.className = 'login-container';

      // Create the login element with a link to the user's profile
      const loginElement = document.createElement('a');
      loginElement.className = 'login';
      loginElement.textContent = userData.login;
      loginElement.href = `https://klavogonki.ru/profile/${userId}`;

      // Append the login element to the container
      loginContainer.appendChild(loginElement);

      // Set styles and hover behavior for the login link.
      loginElement.style.setProperty('color', 'skyblue', 'important');
      loginElement.style.textDecoration = 'none';
      loginElement.style.fontFamily = 'Montserrat';
      loginElement.style.transition = 'color 0.3s ease';

      loginElement.addEventListener('mouseover', () => {
        loginElement.style.setProperty('color', 'cornsilk', 'important');
      });

      loginElement.addEventListener('mouseout', () => {
        loginElement.style.setProperty('color', 'skyblue', 'important');
      });

      // Define the URL for user profile messaging
      const profileUrl = profileBaseUrl + userId;
      const messageInProfile = `${profileBaseUrl}${myUserId}/messages/${userId}/`;

      // Attach a click event listener to the loginElement element
      loginElement.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link action

        // Check if both Ctrl and Shift keys are pressed during the click event
        if (event.ctrlKey && event.shiftKey) {
          const newTab = window.open(messageInProfile, '_blank'); // Open the messaging page in a new window
          if (newTab) newTab.focus(); // Attempt to make the new tab active
        }
        // Check if only the Ctrl key is pressed
        else if (event.ctrlKey) {
          loadProfileIntoIframe(messageInProfile); // Load the messaging profile into the iframe
        }
        // If Ctrl is not pressed, load the regular profile into the iframe
        else {
          loadProfileIntoIframe(profileUrl); // Load the regular profile into the iframe
        }
      });

      // Assuming 'userData' and 'userId' are available
      if (userData.visits !== undefined) {
        const visitsElement = document.createElement('span');
        visitsElement.className = 'visits';
        visitsElement.style.cssText = generateStylesString(chosenStyles);
        visitsElement.textContent = userData.visits;
        visitsElement.dataset.userId = userId;
        // Call the function to prepend an emoticon
        updateVisitsEmoticon(visitsElement);

        // Add the visitsElement to the fetchedUsersContainer
        loginContainer.appendChild(visitsElement);

        // Create an object for action log container styles
        const actionLogContainerStyles = {
          position: 'fixed',
          opacity: '0',
          padding: '8px',
          gap: '4px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxHeight: '85vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          overflowX: 'hidden',
          display: 'flex',
          minWidth: '30vw',
          maxWidth: '50vw',
          flexWrap: 'wrap',
          backgroundColor: '#111111',
          border: '3px dashed #212121'
        };

        // Add click event listener to visitsElement
        visitsElement.addEventListener('click', (event) => {
          shouldProcessActionLog = true; // Set back to true to resume processing the action log
          const userId = visitsElement.dataset.userId; // Get the userId from the dataset
          const user = fetchedUsers[userId]; // Retrieve the user data
          const actionLog = user ? user.actionLog : null; // Access actionLog if user exists

          if (user) {
            // Check if the action log container already exists
            let actionLogContainer = document.querySelector('.action-log');
            if (!actionLogContainer) {
              // Create a container for the action log display if it doesn't exist
              actionLogContainer = document.createElement('div');
              actionLogContainer.className = 'action-log';
              // Apply the styles from the object
              actionLogContainer.style.setProperty('box-shadow', boxShadow, 'important');
              actionLogContainer.style.setProperty('border-radius', '0.2em', 'important');
              Object.assign(actionLogContainer.style, actionLogContainerStyles);

              // Append the action log container to the specific container (fetchedUsersContainer)
              fetchedUsersContainer.appendChild(actionLogContainer);
              adjustVisibility(actionLogContainer, 'show', 1);
            } else {
              // Clear all child elements using replaceChildren (it's an empty operation for now)
              actionLogContainer.replaceChildren();
            }

            if (actionLog && shouldProcessActionLog) {
              for (let index = 0; index < actionLog.length; index++) {
                if (!shouldProcessActionLog) break;
                const action = actionLog[index];
                if (typeof action !== "object" || action === null) continue;
                const { type, timestamp } = action;
                const userAction = userData?.login || "Unknown User";
                const actionIconType = type === 'enter' ? enterSVG : leaveSVG;
                const userPresence = type === 'enter';
                // Use IIFE to capture the current value of shouldProcessActionLog
                ((currentShouldProcess) => {
                  setTimeout(() => {
                    if (currentShouldProcess) {
                      createStaticNotification(userAction, actionIconType, timestamp, userPresence, 'cachePanel');
                    }
                  }, 10 * (index + 1));
                })(shouldProcessActionLog);
              }
            }

            const closeActionLog = (e) => {
              if (!actionLogContainer.contains(e.target) || e.code === 'Space') {
                if (e.code === 'Space') e.preventDefault(); // Prevent the default space key behavior
                adjustVisibility(actionLogContainer, 'hide', 0);
                shouldProcessActionLog = false;
                ['click', 'keydown'].forEach(event => document.removeEventListener(event, closeActionLog));
              }
            };

            ['click', 'keydown'].forEach(event => document.addEventListener(event, closeActionLog));

            // Prevent the click on visitsElement from propagating, so it doesn't close immediately
            event.stopPropagation();
          } else {
            console.error('User data not found');
          }
        });
      }

      // Append login container to user data element
      userDataElement.appendChild(loginContainer);

      const rankElement = document.createElement('div');
      rankElement.className = 'rank';
      rankElement.textContent = userData.rank || 'N/A';
      rankElement.style.color = rankColors[userData.rank] || 'white';
      rankElement.style.padding = '2px 0';

      // Append rank element to the user data element
      userDataElement.appendChild(rankElement);

      // Add a registered date element with hover behavior.
      const registeredElement = document.createElement('div');
      registeredElement.className = 'registered';
      registeredElement.textContent = userData.registered || 'N/A';
      registeredElement.style.color = 'cadetblue';
      registeredElement.style.fontSize = '12px';

      let hoverTimer;
      const originalContent = registeredElement.textContent;

      registeredElement.addEventListener('mouseover', () => {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          registeredElement.textContent = calculateTimeOnSite(userData.registered);
        }, 300);
      });

      registeredElement.addEventListener('mouseout', () => {
        clearTimeout(hoverTimer);
        registeredElement.textContent = originalContent;
      });

      // Append registered element to user data element
      userDataElement.appendChild(registeredElement);

      // Helper function to create metric elements (speed, rating, etc.).
      const createMetricElement = (className, color, icon, value, title, url) => {
        const element = document.createElement('span');
        element.className = className;
        element.style.color = color;
        element.innerHTML = `${icon}${value || 0}&nbsp;&nbsp;`;
        element.title = title;
        element.style.cursor = 'pointer';
        element.addEventListener('click', () => loadProfileIntoIframe(url));
        return element;
      };

      // Create individual metric elements for the user.
      const bestSpeedElement = createMetricElement(
        'best-speed',
        'cyan',
        '🚀',
        userData.bestSpeed,
        'Best speed',
        `https://klavogonki.ru/u/#/${userId}/stats/normal/`
      );

      const ratingLevelElement = createMetricElement(
        'rating-level',
        'gold',
        '⭐',
        userData.ratingLevel,
        'Rating level',
        `https://klavogonki.ru/top/rating/today?s=${userData.login}`
      );

      const carsElement = createMetricElement(
        'cars-count',
        'lightblue',
        '🚖',
        userData.cars,
        'Cars count',
        `https://klavogonki.ru/u/#/${userId}/car/`
      );

      const friendsElement = createMetricElement(
        'friends-count',
        'lightgreen',
        '🤝',
        userData.friends,
        'Friends count',
        `https://klavogonki.ru/u/#/${userId}/friends/list/`
      );

      // Group all metrics into a container.
      const userMetrics = document.createElement('div');
      userMetrics.className = 'user-metrics';
      userMetrics.style.marginTop = '4px';
      userMetrics.style.gridColumn = 'span 2';

      // Append metrics elements into metrics wrapper
      userMetrics.append(bestSpeedElement, ratingLevelElement, carsElement, friendsElement);

      // Append all the groups of elements
      userElement.append(avatarElement, userDataElement, userMetrics);

      // Return the created user element and its relevant data.
      return {
        userElement,
        order: rankOrder[userData.rank] || 10,
        bestSpeed: userData.bestSpeed || 0,
        registered: userData.registered
      };
    };

    // Check if the current mode is 'cache'
    if (localStorage.getItem('cachePanelSearchMode') === 'cache') {
      // Iterate through each user
      Object.keys(users).forEach(async (userId) => {
        const userData = users[userId];
        const userElementData = createCachePanelUserElement(userId, userData);
        userElements.push(userElementData);
      });

      // Sort userElements by rank and best speed
      userElements.sort((a, b) =>
        // First by rank, then by speed
        a.order !== b.order ? a.order - b.order : b.bestSpeed - a.bestSpeed
      );

      // Distribute userElements into new or old users containers
      userElements.forEach(({ userElement, registered }) => {
        // Choose container
        const targetContainer = isNewUser(registered) ? newUsersContainer : oldUsersContainer;
        // Append userElement
        targetContainer.appendChild(userElement);
      });
    }

    // Append the panel-header container to the cached-users-panel
    cachedUsersPanel.appendChild(panelHeaderContainer);
    // Append the fetched-users container to the cached-users-panel
    cachedUsersPanel.appendChild(fetchedUsersContainer);
    // Append the cached-users-panel to the body
    document.body.appendChild(cachedUsersPanel);

    // Create and append scroll buttons
    const {
      scrollButtonsContainer,
      fullScrollUpButton,
      partialScrollUpButton,
      partialScrollDownButton,
      fullScrollDownButton
    } = createScrollButtons(fetchedUsersContainer);
    cachedUsersPanel.appendChild(scrollButtonsContainer);

    // Create an array containing the buttons we want to apply the events to
    const buttons = [
      cachePanelSearchMode,
      clearCacheButton,
      closePanelButton,
      fullScrollUpButton,
      partialScrollUpButton,
      partialScrollDownButton,
      fullScrollDownButton
    ];

    // Iterate through each button in the array
    buttons.forEach(button => {
      // Add a mouseover event listener to change the button's brightness on hover
      button.addEventListener('mouseover', () => {
        button.style.filter = 'brightness(0.8)'; // Dim the button
      });

      // Add a mouseout event listener to reset the button's brightness when not hovered
      button.addEventListener('mouseout', () => {
        button.style.filter = 'brightness(1)'; // Reset to original brightness
      });
    });

    // Fade in the cached users panel
    triggerTargetElement(cachedUsersPanel, 'show');

    // Show the dimming background
    triggerDimmingElement('show');

    // Function to update the remaining time
    function updateRemainingTime() {
      const lastClearTime = localStorage.getItem('lastClearTime');
      const nextClearTime = localStorage.getItem('nextClearTime');
      const dropTimeExpiration = document.querySelector('.drop-time-expiration');

      if (lastClearTime && nextClearTime && dropTimeExpiration) {
        const currentTime = new Date().getTime();

        // Calculate the remaining time until the next cache clear
        const remainingTime = nextClearTime - currentTime;

        // If remaining time is zero or less, execute the refreshFetchedUsers function
        remainingTime <= 0
          ? refreshFetchedUsers(true, cacheRefreshThresholdHours)
          : updatedropTimeExpiration(dropTimeExpiration, remainingTime);
      }
    }

    // Create a mapping of seconds to clock emojis
    const emojiMap = {
      0: '🕛',
      5: '🕐',
      10: '🕑',
      15: '🕒',
      20: '🕓',
      25: '🕔',
      30: '🕕',
      35: '🕖',
      40: '🕗',
      45: '🕘',
      50: '🕙',
      55: '🕚',
    };

    // Function to update the drop-time-expiration span
    function updatedropTimeExpiration(dropTimeExpiration, remainingTime) {
      // Calculate hours, minutes, and seconds
      const hours = String(Math.floor(remainingTime / (60 * 60 * 1000))).padStart(2, '0');
      const minutes = String(Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000))).padStart(2, '0');
      const seconds = String(Math.floor((remainingTime % (60 * 1000)) / 1000)).padStart(2, '0');

      // Create the formatted time string
      const remainingTimeString = `${hours}:${minutes}:${seconds}`;

      // Determine the current seconds
      const parsedSeconds = parseInt(seconds, 10);

      // Use the parsed seconds to find the emoji index, moving one forward
      const nextInterval = Math.ceil(parsedSeconds / 5) * 5; // Move to the next 5-second mark
      const currentEmoji = emojiMap[nextInterval] || emojiMap[0]; // Default to 00 if not found

      // Update the drop-time-expiration span with the time and emoji
      dropTimeExpiration.textContent = `${remainingTimeString} ${currentEmoji}`;
    }

    // Call the function to update the remaining time every second
    setInterval(updateRemainingTime, 1000);

    // Initial update
    updateRemainingTime();
  } // showCachePanel END

  // Global function to smoothly hide and remove the cachedUsersPanel
  function hideCachePanel() {
    const cachedUsersPanel = document.querySelector('.cached-users-panel');

    if (cachedUsersPanel) {
      // Call the fade function for the cachedUsersPanel
      triggerTargetElement(cachedUsersPanel, 'hide');
      // Call the fade function for the dimming element
      triggerDimmingElement('hide');
    }
  } // hideCachePanel END

  // NEW CHAT CACHE CONTROL PANEL (END)


  // NEW CHAT USER LIST (START)

  // Add styles for hover effects dynamically to the head
  const newChatUserListStyles = document.createElement('style');

  // Apply class to the style element
  newChatUserListStyles.classList.add('new-chat-user-list');

  newChatUserListStyles.innerHTML = `
    #chat-general .userlist-content {
      opacity: 0;
    }

    #chat-general .smile-tab {
      background-color: ${((c) => c[0] == '#' ? c : '#' + c.match(/\d+/g).map(Number).map(x => x.toString(16).padStart(2, '0')).join(''))
      (getComputedStyle(document.querySelector('.chat .messages')).backgroundColor)};
      position: relative;
      z-index: 1;
    }

    .chat-user-list {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 20px;
        padding-top: 8px;
        width: 200px;
        height: 94%;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: ${((c) => c[0] == '#' ? c : '#' + c.match(/\d+/g).map(Number).map(x => x.toString(16).padStart(2, '0')).join(''))
      (getComputedStyle(document.querySelector('.chat .messages')).backgroundColor)};
    }

    .chat-user-list [class^="rank-group"] {
        display: flex;
        flex-direction: column;
    }

    .chat-user-list [class^="user"] {
        display: inline-flex;
        margin: 2px 0;
    }

    .chat-user-list .avatar {
        width: 24px;
        height: 24px;
        display: inline-flex;
    }

    .chat-user-list .avatar img,
    .fetched-users .avatar img {
        transition: transform 0.3s;
        transform-origin: left;
    }

    .chat-user-list .avatar img:hover,
    .fetched-users .avatar img:hover {
        transform: scale(2);
    }

    .chat-user-list .name {
        text-decoration: none;
        display: inline-flex;
        width: auto;
        height: 24px;
        line-height: 24px;
        padding: 0 8px;
        max-width: 124px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .chat-user-list .name:hover {
        text-decoration: underline;
    }

    .chat-user-list .profile,
    .chat-user-list .tracked,
    .chat-user-list .ignored,
    .chat-user-list .moderator {
        display: inline-flex;
        width: 24px;
        height: 24px;
        justify-content: center;
        align-items: center;
    }

    svg.feather-meh,
    svg.feather-smile,
    svg.feather-frown {
        stroke: #A47C5E;
    }

    /* Common rotation animation */
    @keyframes rotateProfileIconAnimation {
        0% {
            transform: rotate(0deg) scale(1);
            transition-timing-function: ease-in-out;
        }
        50% {
            transform: rotate(180deg) scale(1.2);
            transition-timing-function: linear;
        }
        100% {
            transform: rotate(360deg) scale(1);
        }
    }
`;

  document.head.appendChild(newChatUserListStyles);

  // Function to validate required user data
  function validateUserData(user) {
    const requiredFields = ['rank', 'login', 'registered', 'bestSpeed', 'ratingLevel', 'friends', 'cars', 'avatarTimestamp'];
    return user && typeof user === 'object' && requiredFields.every(field => user?.[field] !== undefined);
  }

  // Function to get profile summary and registration data
  async function getUserProfileData(userId, useLocalStorage = true) {
    return new Promise(async (resolve, reject) => {
      let cachedUserInfo = useLocalStorage ? JSON.parse(localStorage.getItem('fetchedUsers')) || {} : {};
      const user = cachedUserInfo[userId];

      // Validate if user data exists and has the required properties
      if (useLocalStorage && validateUserData(user)) {
        // If all data is cached, resolve with the cached data
        resolve({
          rank: user.rank,
          login: user.login,
          registeredDate: user.registered,
          bestSpeed: user.bestSpeed,
          ratingLevel: user.ratingLevel,
          friends: user.friends, // Use cached friends count
          cars: user.cars, // Use cached cars count
          avatar: user.avatar, // Get avatar availability state
          avatarTimestamp: user.avatarTimestamp // Cached avatar timestamp
        });
      } else {
        try {
          // Fetch profile summary and registered date
          const summaryApiUrl = `https://klavogonki.ru/api/profile/get-summary?id=${userId}`;
          const profileApiUrl = `https://klavogonki.ru/api/profile/get-index-data?userId=${userId}`;

          // Fetch both profile summary and registration data in parallel
          const [summaryResponse, profileResponse] = await Promise.all([
            fetch(summaryApiUrl),
            fetch(profileApiUrl),
          ]);

          // Check if both responses are successful
          if (!summaryResponse.ok || !profileResponse.ok) {
            throw new Error('Failed to fetch data from one of the APIs.');
          }

          const summaryData = await summaryResponse.json();
          const profileData = await profileResponse.json();

          if (
            summaryData?.user?.login &&
            summaryData.title &&
            profileData?.stats?.registered
          ) {
            // Extract the relevant data
            const rank = summaryData.title;
            const login = summaryData.user.login;
            const registered = profileData.stats.registered.sec
              ? convertSecondsToDate(profileData.stats.registered.sec)
              : 'Invalid Date';

            // Extract new fields
            const bestSpeed = profileData.stats.best_speed || 0; // Default to 0 if undefined
            const ratingLevel = profileData.stats.rating_level || 0; // Default to 0 if undefined
            const friends = profileData.stats.friends_cnt || 0; // Extract friends count
            const cars = profileData.stats.cars_cnt || 0; // Extract cars count

            // Extract sec and usec from user.avatar, with null check
            const avatar = summaryData.user?.avatar || null; // Default to null if undefined or not present
            const sec = summaryData.user.avatar?.sec || 0; // Default to 0 if undefined or null
            const usec = summaryData.user.avatar?.usec || 0; // Default to 0 if undefined or null
            const avatarTimestamp = convertToUpdatedTimestamp(sec, usec); // Combine sec and usec to get avatar timestamp

            // Cache the fetched data if useLocalStorage is true, excluding the avatar
            if (useLocalStorage) {
              cachedUserInfo[userId] = {
                rank: rank,
                login: login,
                registered: registered,
                bestSpeed: bestSpeed,
                ratingLevel: ratingLevel,
                friends: friends, // Cache friends count
                cars: cars, // Cache cars count
                avatar: avatar,
                avatarTimestamp: avatarTimestamp // Cache avatar timestamp
              };

              // Update localStorage with the new cached data
              localStorage.setItem('fetchedUsers', JSON.stringify(cachedUserInfo));
            }

            // Resolve with the combined data
            resolve({
              rank: rank,
              login: login,
              registeredDate: registered,
              bestSpeed: bestSpeed,
              ratingLevel: ratingLevel,
              friends: friends,
              cars: cars,
              avatar: avatar, // Return avatar for current session
              avatarTimestamp: avatarTimestamp // Include avatar timestamp in the result
            });
          } else {
            throw new Error('Invalid data format received from the API.');
          }
        } catch (error) {
          console.error(`Error fetching user profile data for ${userId}:`, error);
          reject(error);
        }
      }
    });
  }

  // Function to convert seconds to a human-readable date format
  function convertSecondsToDate(seconds) {
    const date = new Date(seconds * 1000);
    return date.toISOString().slice(0, 19).replace('T', ' '); // Converts to 'YYYY-MM-DD HH:mm:ss' format
  }

  // Function to convert sec and usec to the 'updated' timestamp
  function convertToUpdatedTimestamp(sec, usec) {
    // Create the full timestamp by combining sec and usec (in microseconds)
    return sec.toString() + Math.floor(usec / 1000).toString();
  }

  // Helper to fetch JSON and validate response
  async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return response.json();
  }

  // Helper function to get Exact user ID by username via the search API
  async function getExactUserIdByName(userName) {
    // Define the search API URL
    const searchApiUrl = `https://klavogonki.ru/api/profile/search-users?query=${userName}`;

    // Get search results from the API
    const searchResults = await fetchJSON(searchApiUrl);

    // Ensure search results exist and contain data
    if (!searchResults.all?.length) throw new Error(`User ${userName} not found.`);

    // Return the ID of the user with the exact matching login
    const user = searchResults.all.find(user => user.login === userName);
    if (!user) throw new Error(`Exact match for user ${userName} not found.`);

    return user.id;
  }

  // Helper function to get all user IDs by username via the search API
  async function getUserIDsByName(userName) {
    const searchApiUrl = `https://klavogonki.ru/api/profile/search-users?query=${userName}`;
    const searchResults = await fetchJSON(searchApiUrl);

    const foundUsers = searchResults.all; // Get all search results
    if (!foundUsers || foundUsers.length === 0) throw new Error(`User ${userName} not found.`);

    // Return an array of user IDs
    return foundUsers.map(user => user.id);
  }

  // Function to calculate time spent on the site
  function calculateTimeOnSite(registeredDate) {
    const totalSeconds = Math.floor((new Date() - new Date(registeredDate)) / 1000);
    const years = Math.floor(totalSeconds / (365 * 24 * 60 * 60));
    const months = Math.floor((totalSeconds % (365 * 24 * 60 * 60)) / (30.44 * 24 * 60 * 60));
    const days = Math.floor((totalSeconds % (30.44 * 24 * 60 * 60)) / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    const timeComponents = [];

    if (years > 0) {
      timeComponents.push(`${years} year${years > 1 ? 's' : ''}`);
      if (months > 0) timeComponents.push(`${months} month${months > 1 ? 's' : ''}`);
    } else if (months > 1 || (months === 1 && days > 0)) {
      timeComponents.push(`${months} month${months > 1 ? 's' : ''}`);
      if (days > 0) timeComponents.push(`${days} day${days > 1 ? 's' : ''}`);
    } else if (days > 0) {
      timeComponents.push(`${days} day${days > 1 ? 's' : ''}`);
      if (hours > 0) timeComponents.push(`${hours} hour${hours > 1 ? 's' : ''}`);
      if (minutes > 0) timeComponents.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    } else if (hours > 0) {
      timeComponents.push(`${hours} hour${hours > 1 ? 's' : ''}`);
      if (minutes > 0) timeComponents.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    } else if (minutes > 0) {
      timeComponents.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
      if (seconds > 0) timeComponents.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
    } else {
      timeComponents.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
    }

    return timeComponents.filter(Boolean).join(' '); // Filter out empty strings and join components
  }

  // Function to get rank information (class, color, and icon) based on status title in English
  function getRankInfo(mainTitle) {
    const statusData = {
      'Экстракибер': { class: 'extra', icon: '🚀', color: '#06B4E9' },
      'Кибергонщик': { class: 'cyber', icon: '🤖', color: '#5681ff' },
      'Супермен': { class: 'superman', icon: '👊', color: '#B543F5' },
      'Маньяк': { class: 'maniac', icon: '🔪', color: '#DA0543' },
      'Гонщик': { class: 'racer', icon: '⚡️️', color: '#FF8C00' },
      'Профи': { class: 'profi', icon: '️💼️', color: '#C1AA00' },
      'Таксист': { class: 'driver', icon: '🚖️', color: '#2DAB4F' },
      'Любитель': { class: 'amateur', icon: '🍆️', color: '#61B5B3' },
      'Новичок': { class: 'newbie', icon: '🐥', color: '#AFAFAF' }
    };

    const defaultData = { class: 'unknown', icon: '❓', color: '#000000' };
    const rankInfo = statusData[mainTitle] || defaultData;

    if (rankInfo.class === defaultData.class) {
      console.log(`Class not found for status title: ${mainTitle}. Using default class: ${defaultData.class}`);
    }

    return rankInfo;
  }

  // Function to handle private message
  function insertPrivate(userId) {
    const userName = document.querySelector(`.name[data-user="${userId}"]`).textContent;
    const message = `<${userName}>`;

    const textElement = document.querySelector('.messages .text');
    textElement.value = message;

    textElement.focus();
    textElement.selectionEnd = textElement.value.length;

    console.log(`Setting private message to: ${message}`);
  }

  function createCircularProgress(percentage, color, isRevoked) {
    const svgUrl = "http://www.w3.org/2000/svg";
    const size = 20;
    const center = size / 2;
    const strokeWidth = 2;
    const radius = center - strokeWidth;
    const diameter = radius * 2;
    const randomString = Math.random().toString(36).substring(2, 22);
    const scaleMultiplier = !isRevoked && percentage === 0 ? 0.6 : 1;

    const svg = document.createElementNS(svgUrl, "svg");
    Object.entries({
      width: size, height: size, viewBox: `0 0 ${size} ${size}`, xmlns: svgUrl
    }).forEach(([k, v]) => svg.setAttribute(k, v));
    svg.classList.add("circularProgress");

    if (isRevoked || percentage === 0) {
      if (!isRevoked) {
        const outerCircle = document.createElementNS(svgUrl, "circle");
        Object.entries({
          cx: center, cy: center, r: radius, fill: "none", stroke: color, "stroke-width": strokeWidth
        }).forEach(([k, v]) => outerCircle.setAttribute(k, v));
        outerCircle.classList.add("outerCircle");
        svg.appendChild(outerCircle);
      }

      const scale = (size / 24) * scaleMultiplier;
      const offset = center - 12 * scale;
      const closeIconGroup = document.createElementNS(svgUrl, "g");
      closeIconGroup.setAttribute("transform", `translate(${offset}, ${offset}) scale(${scale})`);
      closeIconGroup.classList.add("closeIconGroup");

      const path = document.createElementNS(svgUrl, "path");
      Object.entries({
        d: "M18.364 5.636a1 1 0 0 1 0 1.414L13.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 0 1-1.414-1.414L10.586 12l-4.95-4.95a1 1 0 0 1 1.414-1.414L12 10.586l4.95-4.95a1 1 0 0 1 1.414 0z",
        fill: color
      }).forEach(([k, v]) => path.setAttribute(k, v));

      closeIconGroup.appendChild(path);
      svg.appendChild(closeIconGroup);
    } else {
      const defs = document.createElementNS(svgUrl, "defs");
      defs.classList.add("defs");

      const clipPath = document.createElementNS(svgUrl, "clipPath");
      clipPath.setAttribute("id", `clipInner-${randomString}`);
      clipPath.classList.add("clipPath");

      const clipRect = document.createElementNS(svgUrl, "rect");
      Object.entries({
        x: center - radius, y: center - radius, width: diameter, height: 0, transform: `rotate(180, ${center}, ${center})`
      }).forEach(([k, v]) => clipRect.setAttribute(k, v));
      clipRect.classList.add("clipRect");

      const animate = document.createElementNS(svgUrl, "animate");
      Object.entries({
        attributeName: "height",
        from: 0,
        to: diameter * (percentage / 100),
        begin: "indefinite",
        dur: "1s",
        fill: "freeze",
        calcMode: "spline",
        keySplines: "0.4 0 0.2 1", // Fast start, smooth stop
        keyTimes: "0;1"
      }).forEach(([k, v]) => animate.setAttribute(k, v));
      animate.classList.add("animateProfileProgress");

      clipRect.appendChild(animate);
      clipPath.appendChild(clipRect);
      defs.appendChild(clipPath);
      svg.appendChild(defs);

      const outerCircle = document.createElementNS(svgUrl, "circle");
      Object.entries({
        cx: center, cy: center, r: radius, fill: "none", stroke: color, "stroke-width": strokeWidth
      }).forEach(([k, v]) => outerCircle.setAttribute(k, v));
      outerCircle.classList.add("outerCircle");
      svg.appendChild(outerCircle);

      const innerCircle = document.createElementNS(svgUrl, "circle");
      Object.entries({
        cx: center, cy: center, r: radius, fill: color, "clip-path": `url(#clipInner-${randomString})`
      }).forEach(([k, v]) => innerCircle.setAttribute(k, v));
      innerCircle.classList.add("innerCircle");
      svg.appendChild(innerCircle);
    }

    return svg.outerHTML;
  }

  /**
   * Calculates the percentage of a given number within its nearest range.
   * The function dynamically determines the range based on the input value.
   *
   * @param {number} value - The input value to calculate the percentage for.
   * @returns {number} - The percentage of the input value within its identified range.
   */
  function calculatePercentage(value) {
    // Determine the lower bound of the range (this is smart, not hardcoded)
    const lowerBound = Math.floor(value / 100) * 100; // Nearest lower multiple of 100
    const upperBound = lowerBound + 100; // Nearest upper multiple of 100

    // Calculate the percentage within the identified range
    const percentage = ((value - lowerBound) / (upperBound - lowerBound)) * 100;

    return percentage;
  }

  //  Variable to store the last selected emoji
  let lastEmojiAvatar = null;

  // Helper function to get a random emoji avatar
  function getRandomEmojiAvatar() {
    let newEmoji;
    do {
      newEmoji = emojiFaces[Math.floor(Math.random() * emojiFaces.length)];
    } while (newEmoji === lastEmojiAvatar);

    lastEmojiAvatar = newEmoji;
    return newEmoji;
  }

  const emojiFaces = [
    // People Emojis (Facial expressions)
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆',
    '😉', '😊', '😋', '😎', '😏', '😐', '😑', '😒',
    '😓', '😔', '😕', '😖', '😗', '😘', '😙', '😚',
    '😜', '😝', '😛', '🤑', '🤗', '🤔', '🤐', '🤨',
    '😣', '😥', '😮', '🤯', '😳', '😱', '😨', '😰',
    '😢', '🤪', '😵', '😲', '🤤', '😷', '🤒', '🤕',
    '🤢', '🤧', '😇', '🥳', '🥺', '😬', '😴', '😌',
    '🤥', '🥴', '🥵', '🥶', '🤧', '🤭', '🤫', '😠',
    '😡', '😳', '😞', '😟', '😕',

    // Cat Emojis (Expressive faces of cats)
    '🐱', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',

    // Other Animal Emojis (Various animals' faces)
    '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵',
    '🙈', '🙉', '🙊', '🐔', '🦄'
  ];

  // Array to store user IDs and their status titles
  let fetchedUsers = JSON.parse(localStorage.getItem('fetchedUsers')) || {};

  // Function to create a user element with avatar, name, and profile link based on user details
  function createUserChatElement(userId, mainTitle, userName, bestSpeed, isRevoked) {
    const avatarTimestamp = fetchedUsers[userId]?.avatarTimestamp;

    // Ensure the bigAvatarUrl is only constructed if avatarTimestamp is not '00'
    const bigAvatarUrl = avatarTimestamp !== '00' ? `/storage/avatars/${userId}_big.png?updated=${avatarTimestamp}` : '';

    const newUserElement = document.createElement('div');
    // Get rank information (class, color, icon)
    const rankInfo = getRankInfo(mainTitle);
    const rankClass = rankInfo.class;  // Rank class
    const rankColor = rankInfo.color;  // Rank color
    const rankIcon = rankInfo.icon;    // Rank icon (emoji)

    newUserElement.classList.add(`user${userId}`, rankClass); // Assign the rank class

    const newAvatarElement = document.createElement('div');
    newAvatarElement.classList.add('avatar');

    // Only create and append an image element if avatarTimestamp is not '00'
    if (avatarTimestamp !== '00') {
      const avatarImage = document.createElement('img');
      avatarImage.src = bigAvatarUrl;
      newAvatarElement.appendChild(avatarImage);
    } else {
      newAvatarElement.style.fontSize = '1.8rem';
      // Insert a random SVG icon instead of an image when avatarTimestamp is '00'
      newAvatarElement.innerHTML = getRandomEmojiAvatar();
    }

    const newNameElement = document.createElement('a');
    newNameElement.classList.add('name');
    newNameElement.title = 'Написать в приват';
    newNameElement.dataset.user = userId;
    newNameElement.textContent = userName;

    newNameElement.style.setProperty('color', rankColor, 'important');

    const newProfileElement = document.createElement('a');
    newProfileElement.classList.add('profile');
    const title = `${rankIcon} ${mainTitle} - ${bestSpeed}`;
    createCustomTooltip(newProfileElement, title);
    newProfileElement.target = '_blank';
    newProfileElement.href = `/profile/${userId}/`;
    let circularProgress = createCircularProgress(calculatePercentage(bestSpeed), rankColor, isRevoked);
    // Use circular progress element for profile navigation from new chat user list
    newProfileElement.innerHTML = circularProgress;
    // Start animation after element is in DOM
    setTimeout(() => {
      const animateElement = newProfileElement.querySelector('.animateProfileProgress');
      if (animateElement) animateElement.beginElement();
    }, 10);
    // Add event listener click with Hold Ctrl Key to open profile into iframe
    newProfileElement.addEventListener('click', function (event) {
      event.preventDefault();
      if (isCtrlKeyPressed) {
        // Open the profile in a new tab
        window.open(profileBaseUrl + userId, '_blank');
      } else {
        // Load the profile into the iframe
        loadProfileIntoIframe(profileBaseUrl + userId);
      }
    });

    // Construct the URL for the messaging interface between two users
    const messageInProfile = `${profileBaseUrl}${myUserId}/messages/${userId}/`;

    // Attach a click event listener to the newNameElement element
    newNameElement.addEventListener('click', function (event) {
      // Check if both Ctrl and Shift keys are pressed during the click event
      if (event.ctrlKey && event.shiftKey) {
        // If both keys are pressed, open the messaging URL in a new tab
        const newTab = window.open(messageInProfile, '_blank');
        if (newTab) newTab.focus(); // Attempt to make the new tab active
      }
      // Check if only the Ctrl key is pressed
      else if (event.ctrlKey) {
        // If Ctrl is pressed, load the messaging interface URL into the iframe
        loadProfileIntoIframe(messageInProfile);
      }
      // If neither Ctrl nor Shift is pressed, initiate a private chat message
      else {
        // The insertPrivate function handles sending a private message to the specified user
        insertPrivate(userId);
      }
    });

    newUserElement.appendChild(newAvatarElement);
    newUserElement.appendChild(newNameElement);
    newUserElement.appendChild(newProfileElement);

    // Check if there is a user in 'usersToTrack' array by their name and state
    const userToTrack = usersToTrack.find((user) =>
      user.name === userName && user.state === 'thawed'
    );

    if (userToTrack) {
      const trackedIcon = document.createElement('div');
      trackedIcon.title = 'Tracked user';
      trackedIcon.classList.add('tracked');
      trackedIcon.innerHTML = trackedSVG;
      newUserElement.appendChild(trackedIcon);
    }

    // Check if the user is in the ignore list
    const isIgnoredUser = ignored.includes(userName);

    // Create and hide a message element if the user is in ignored
    if (isIgnoredUser) {
      const ignoredIcon = document.createElement('div');
      ignoredIcon.title = 'Ignored user';
      ignoredIcon.classList.add('ignored');
      ignoredIcon.innerHTML = ignoredSVG;
      newUserElement.appendChild(ignoredIcon);
    }

    // Check if there is an <img> element with a src attribute containing the word "moderator" inside the <ins> element
    const hasModeratorIcon = document.querySelector(`.userlist-content ins.user${userId} img[src*="moderator"]`);

    // Check if the user is in the moderator list
    const isModerator = moderator.includes(userName);

    // If a moderator icon is found or the current user is in the moderator array, append the moderator icon.
    if (hasModeratorIcon || isModerator) {
      const moderatorIcon = document.createElement('div');
      moderatorIcon.classList.add('moderator');
      moderatorIcon.innerHTML = moderatorSVG; // Assuming 'moderatorSVG' contains the SVG for the icon
      newUserElement.appendChild(moderatorIcon);
    }

    return newUserElement;
  }

  // Function to update users in the custom chat
  async function refreshUserList(retrievedLogin, actionType) {
    try {
      // Get the original user list container
      const originalUserListContainer = document.querySelector('.userlist-content');

      // Get or create the user list container
      let userListContainer = document.querySelector('.chat-user-list');
      if (!userListContainer) {
        userListContainer = document.createElement('div');
        userListContainer.classList.add('chat-user-list');

        // Find the element with the class "userlist"
        const userlistElement = document.querySelector('.userlist');

        // Append the userListContainer to the userlistElement if found
        if (userlistElement) {
          userlistElement.appendChild(userListContainer);
        }
      }

      // Define the rank order
      const rankOrder = ['extra', 'cyber', 'superman', 'maniac', 'racer', 'profi', 'driver', 'amateur', 'newbie'];

      // Create an object to store subparent elements for each rank class
      const rankSubparents = {};

      // Check if subparent elements already exist, if not, create them
      rankOrder.forEach(rankClass => {
        const existingSubparent = userListContainer.querySelector(`.rank-group-${rankClass}`);
        if (!existingSubparent) {
          rankSubparents[rankClass] = document.createElement('div');
          rankSubparents[rankClass].classList.add(`rank-group-${rankClass}`);
          userListContainer.appendChild(rankSubparents[rankClass]);
        } else {
          rankSubparents[rankClass] = existingSubparent;
        }
      });

      // Create a set to store existing user IDs in the updated user list
      const existingUserIds = new Set();

      // Iterate over each user element in the original user list
      for (const userElement of originalUserListContainer.querySelectorAll('ins')) {
        const nameElement = userElement.querySelector('.name');
        const userId = nameElement.getAttribute('data-user');
        const userName = nameElement.textContent;

        // Check if the user already exists in the updated user list
        if (!existingUserIds.has(userId)) {
          try {
            // Retrieve the user's profile data
            const { rank: mainTitle, login, registeredDate, bestSpeed, ratingLevel, friends, cars, avatarTimestamp } = await getUserProfileData(userId);

            // If the user data is not already stored in the fetchedUsers object
            if (!fetchedUsers[userId]) {
              // Set rank, login, registeredDate, bestSpeed, ratingLevel, friends, cars, and avatarTimestamp
              fetchedUsers[userId] = {
                rank: mainTitle,
                login,
                registered: registeredDate,
                bestSpeed,
                ratingLevel,
                friends,
                cars,
                avatarTimestamp
              };
            } else {
              // Update the user's data
              fetchedUsers[userId].rank = mainTitle;
              fetchedUsers[userId].login = login;
              fetchedUsers[userId].registered = registeredDate;
              fetchedUsers[userId].bestSpeed = bestSpeed;
              fetchedUsers[userId].ratingLevel = ratingLevel;
              fetchedUsers[userId].friends = friends;
              fetchedUsers[userId].cars = cars;
              fetchedUsers[userId].avatarTimestamp = avatarTimestamp;
            }

            // Logging user action (enter or leave) using the formatted time
            if (retrievedLogin === userName) {
              if (actionType === 'enter') {
                fetchedUsers[userId].visits = (fetchedUsers[userId].visits || 0) + 1;
                fetchedUsers[userId].tracked = usersToTrack.some(u => u.name === retrievedLogin);
              }
            }

            // Get the rank info from getRankInfo, which now returns an object with class, color, and icon
            const { class: rankClass } = getRankInfo(mainTitle);  // Destructure the returned object to get the rank class

            // Check if the user with the same ID already exists in the corresponding rank group
            const existingUserElement = rankSubparents[rankClass].querySelector(`.user${userId}`);
            if (!existingUserElement) {
              const newUserElement = createUserChatElement(userId, mainTitle, userName, bestSpeed, userElement.classList.contains('revoked'));
              // Add the user to the corresponding rank group
              rankSubparents[rankClass].appendChild(newUserElement);
              // Make sure the mutation observer for the new users changed flag to false to make it work
              if (!isInitialObservation) addShakeEffect(newUserElement); // Add shake effect on entered users
            }

            // Update existing user IDs
            existingUserIds.add(userId);
          } catch (error) {
            console.error(`Error fetching profile summary for user ${userId}:`, error);
          }
        }
      }

      // Additional removal logic based on your provided code
      userListContainer.querySelectorAll('.chat-user-list [class^="user"]').forEach(userElement => {
        const userId = userElement.querySelector('.name').getAttribute('data-user');
        if (!existingUserIds.has(userId)) {
          userElement.remove();
        }
      });

      // Sorting logic (applied after all users are created)
      Object.values(rankSubparents).forEach(rankGroup =>
        [...rankGroup.children]
          .sort((a, b) =>
            (fetchedUsers[b.querySelector('.name')?.getAttribute('data-user')]?.bestSpeed || 0) -
            (fetchedUsers[a.querySelector('.name')?.getAttribute('data-user')]?.bestSpeed || 0)
          )
          .forEach(el => rankGroup.appendChild(el))
      );

      // Update localStorage outside the if conditions
      localStorage.setItem('fetchedUsers', JSON.stringify(fetchedUsers));

      // Call updateUserCountText to refresh user count display
      updateUserCountText();

    } catch (error) {
      console.error('Error refreshing user list:', error);
    }
  }

  // Helper function to convert time string to single hours
  function convertToSingleHours(timeString) {
    const [hours, minutes = 0, seconds = 0] = timeString.split(':').map(Number);
    return hours + minutes / 60 + seconds / 3600;
  }

  // Global constant for default cache refresh threshold in hours
  const defaultCacheRefreshThresholdHours = 24;

  // Get the value from localStorage
  let storedFresholdTimeKey = localStorage.getItem('cacheRefreshThresholdHours');

  // If the key doesn't exist, set it to the default value
  if (!storedFresholdTimeKey) {
    storedFresholdTimeKey = defaultCacheRefreshThresholdHours;
    localStorage.setItem('cacheRefreshThresholdHours', storedFresholdTimeKey);
  }

  // Convert the value to single hours
  let cacheRefreshThresholdHours = convertToSingleHours(storedFresholdTimeKey);

  // Function to refresh or manually clear fetched users and reset the timer
  // @param {boolean} isManual - If true, clears cache unconditionally; if false, clears based on threshold (default is false)
  // @param {number} thresholdHours - Time threshold in hours for automatic cache clearing (default is 24 hours)
  function refreshFetchedUsers(isManual = false, thresholdHours = 24) {
    // Retrieve the last clear time from localStorage
    const lastClearTime = localStorage.getItem('lastClearTime');
    const timeElapsed = lastClearTime ? (new Date().getTime() - lastClearTime) / (1000 * 60 * 60) : Infinity;

    // If clearing manually or the time threshold has been reached, clear the cache
    if (isManual || timeElapsed >= thresholdHours) {
      // Clear the fetchedUsers from localStorage
      localStorage.removeItem('fetchedUsers');

      // Reset the in-memory fetchedUsers object
      fetchedUsers = {};

      // Reset the timer by updating 'lastClearTime' and 'nextClearTime'
      const nextClearTime = new Date().getTime() + thresholdHours * 60 * 60 * 1000;
      localStorage.setItem('lastClearTime', new Date().getTime().toString());
      localStorage.setItem('nextClearTime', nextClearTime.toString());

      // Optional: Notify the user about the cache clearing
      // const message = isManual
      //   ? `Cache manually cleared. Next clearing time: ${new Date(nextClearTime)}`
      //   : `Cache automatically cleared. Next clearing time: ${new Date(nextClearTime)}`;
    }
  }


  // NEW CHAT USER LIST (END)


  // Define reference for chat user list
  const userList = document.querySelector('.userlist-content');

  // Initialize user tracking map
  let userMap = new Map(); // Store as [userId]: {userName, ...}
  let prevUserCount = 0;
  let isInitialObservation = true; // Initialize the flag for initial observation

  let isAnimated = false;
  const debounceTimeout = 300;

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  function logUserAction(userId, actionType) {
    if (userId && actionType) {
      // Initialize user object and ensure actionLog is an array
      fetchedUsers[userId] = fetchedUsers[userId] || {};
      fetchedUsers[userId].actionLog = fetchedUsers[userId].actionLog || [];

      // Log the action
      fetchedUsers[userId].actionLog.push({
        type: actionType,
        timestamp: getCurrentTimeFormatted()
      });
    } else {
      console.error('Missing userId or actionType');
    }
  }

  /**
   * Updates the given user count element with the count, adjusting the font size based on the number of digits.
   * @param {HTMLElement} element - The DOM element displaying the user count.
   * @param {number} count - The user count.
   */
  function updateUserCount(element, count) {
    if (!element) return; // Exit if the element doesn't exist.
    const digits = count.toString().length;
    element.textContent = count;
    element.style.fontSize = Math.max(24 - (digits - 1) * 2, 12) + 'px';
  }

  // Function to animate user count change
  function animateUserCount(actualUserCount, userCountElement) {
    let count = 0;
    const speed = 20;

    const userCountIncrement = () => {
      if (count <= actualUserCount) {
        const progress = Math.min(count / (actualUserCount || 1), 1); // Handle zero case
        updateUserCount(userCountElement, count++);
        userCountElement.style.filter = `grayscale(${100 - progress * 100}%)`;
        setTimeout(userCountIncrement, speed);
      } else {
        addPulseEffect(userCountElement);
        isAnimated = true;
      }
    };

    setTimeout(userCountIncrement, speed);
  }

  // Mutation Observer for new users
  const chatUsersObserver = new MutationObserver(debounce((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const soundSwitcher = document.querySelector('#voice, #beep, #silence');
        const isSilence = soundSwitcher && soundSwitcher.id === 'silence';
        const chatHidden = document.querySelector('#chat-wrapper.chat-hidden');
        const userCountElement = document.querySelector('.chat-user-count');

        if (chatHidden) {
          // If the chat is hidden, update the user count to 0 and exit early
          userCountElement.style.filter = "grayscale(100%)";
          userCountElement.textContent = "0";
          return;
        }

        // Build current user map
        const newUsers = new Map(
          Array.from(userList.children)
            .map(child => {
              const nameElement = child.querySelector('.name');
              const userId = nameElement?.getAttribute('data-user');
              const userName = nameElement?.textContent?.trim();
              return userId ? [userId, { userName }] : null;
            })
            .filter(Boolean) // Remove null entries
        );

        // Handle initial observation
        if (isInitialObservation) {
          if (userCountElement && Number(userCountElement.textContent) === 0 && !isAnimated) {
            animateUserCount(newUsers.size, userCountElement);
          }
          newUsers.forEach((value, key) => userMap.set(key, value));
          setTimeout(() => {
            isInitialObservation = false; // Mark the initial observation as complete
          }, 2000); // After a small delay
          return; // Skip processing for initial load
        }

        // Detect users who entered (exist in newUsers but not in userMap)
        let entered = [...newUsers].filter(([userId]) => !userMap.has(userId))
          .map(([userId, data]) => ({ userId, ...data }));

        // Detect users who left (exist in userMap but not in newUsers)
        let left = [...userMap].filter(([userId]) => !newUsers.has(userId))
          .map(([userId, data]) => ({ userId, userName: data.userName }));

        // Reassign userMap instead of clearing and repopulating it
        userMap = new Map(newUsers);

        // User count management
        const currentCount = userMap.size;
        if (currentCount !== prevUserCount && isAnimated) {
          updateUserCount(userCountElement, currentCount);
          userCountElement.style.filter = currentCount > 0 ? 'none' : 'grayscale(100%)';
          addPulseEffect(userCountElement);
        }

        // Common logic for processing both entered and left users
        function processUserAction(user, actionType) {
          const { userName, userId } = user;
          const userGender = getUserGender(userName);
          const isTracked = usersToTrack.some(u => u.name === userName && u.state === 'thawed');

          showUserAction(userName, actionType === "enter" ? enterSVG : leaveSVG, actionType === "enter");
          refreshUserList(userName, actionType);
          logUserAction(userId, actionType);

          if (!isSilence && isTracked) {
            userAction(userName, actionType, userGender);
          }
        }

        // Process entries
        entered.forEach(newUser => processUserAction(newUser, "enter"));

        // Process exits
        left.forEach(oldUser => processUserAction(oldUser, "leave"));


        prevUserCount = currentCount; // Update previous count for next mutation
      }
    });
  }, debounceTimeout));

  // Start observing
  chatUsersObserver.observe(userList, { childList: true });

  // Button to close the chat
  const chatCloseButton = document.querySelector('.mostright');

  // Event listener for mostright click event
  chatCloseButton.addEventListener('click', () => {
    // Trigger the logic you want to perform when the mostright button is clicked
    setTimeout(() => {
      // Check if the chat is not closed
      const chatHidden = document.querySelector('#chat-wrapper.chat-hidden');
      if (chatHidden) {
        // Avoid "newMessagesObserver" run the call functions multiple times when the chat opens again
        isInitialized = false;
      } else {
        // Call the function to assign all the removing functionality again after the chat was closed
        executeMessageRemover();
        // Set chat field focus
        setChatFieldFocus();
        // Allow after "N" delay to run the "newMessagesObserver" call functions safely without repeating
        isInitialized = false;
        setTimeout(() => (isInitialized = false), 3000);
      }
    }, 300);
  });

  // Function to restore the chat state based on 'shouldShowPopupMessage' key in localStorage
  function restoreChatState() {
    // Main chat parent wrap element
    const chatMainWrapper = document.querySelector('#chat-fixed-placeholder');

    // Check if the key exists in localStorage
    if ('shouldShowPopupMessage' in localStorage) {
      // Retrieve the value from localStorage
      const shouldShowPopupMessage = JSON.parse(localStorage.getItem('shouldShowPopupMessage'));

      // Set the display property based on the retrieved value
      chatMainWrapper.style.display = shouldShowPopupMessage ? 'none' : 'unset';
    } else {
      // Default to 'none' if the key doesn't exist
      chatMainWrapper.style.display = 'none';
    }
  }

  // Call restoreChatState when needed, for example, on page load
  restoreChatState();

  // Check if the key exists in localStorage
  if (!('shouldShowPopupMessage' in localStorage)) {
    localStorage.setItem('shouldShowPopupMessage', false);
  }

  // Custom chat hider with hotkeys Ctr + Space
  document.addEventListener('keydown', (event) => {
    // Check if Ctrl key and Space key are pressed simultaneously
    if (event.ctrlKey && event.code === 'Space') {
      // Main chat parent wrap element
      const chatMainWrapper = document.querySelector('#chat-fixed-placeholder');
      // Check if the 'style' attribute is present
      const hasStyleAttribute = chatMainWrapper.hasAttribute('style');
      // Check if the 'display' property is set on chatMainWrapper element
      const isDisplayUnset = chatMainWrapper.style.display === 'unset';
      // Popup messages container element
      const popupMessagesContainer = document.querySelector('.popup-messages-container');

      // Toggle the display property
      if (hasStyleAttribute) {
        if (isDisplayUnset) {
          // Set the display property to 'none'
          chatMainWrapper.style.display = 'none';
          localStorage.setItem('shouldShowPopupMessage', true);
        } else {
          // Set the display property to 'unset'
          chatMainWrapper.style.display = 'unset';
          localStorage.setItem('shouldShowPopupMessage', false);

          // Retrieve the chat input field and length popup container based on the current URL
          const { inputField } = retrieveChatElementsByRoomType(); // Use your helper function

          // Check if inputField is valid before focusing
          if (inputField) {
            inputField.focus(); // Set focus to the chat input field
          } else {
            console.error('Input field not found. Cannot set focus.');
          }
        }
      } else {
        // Initial case: Set the display property to 'none'
        chatMainWrapper.style.display = 'none';
        localStorage.setItem('shouldShowPopupMessage', true);
      }

      // Remove the element with class 'popup-messages-container' if it exists and display is 'unset'
      if (popupMessagesContainer && hasStyleAttribute && isDisplayUnset) {
        popupMessagesContainer.remove();
      }
    }
  });

  // EVERY NEW MESSAGE READER

  // Initialize the variable to keep track of the last username seen
  let lastUsername = null;

  // Set the flag as false for the mention beep sound to trigger at first usual beep sound for usual messages
  let isMention = false;

  // Function to check if a username is mentioned in the message
  function isMentionForMe(message) {
    const messageLowercase = message.toLowerCase();
    return mentionKeywords.some(keyword => messageLowercase.includes(keyword.toLowerCase()));
  }

  function replaceWithPronunciation(text) {
    if (text === null) return text;

    // Combine all usernames that need replacement
    const allUsernames = [
      ...usersToTrack.map(user => user.name),
      ...usernameReplacements.map(replacement => replacement.original)
    ];

    // Create a pattern to match any character that is part of a word (including Cyrillic characters).
    const pattern = new RegExp(`(${allUsernames.join('|')})`, 'gu');

    return text.replace(pattern, (matched) => {
      // Priority 1: Check username replacements
      const replacement = usernameReplacements.find(r => r.original === matched);
      if (replacement) return replacement.replacement;

      // Priority 2: Check tracked user pronunciations
      const trackedUser = usersToTrack.find(user => user.name === matched);
      return trackedUser?.pronunciation || matched;
    });
  }

  function highlightMentionWords(containerType = 'generalMessages') {
    const containerSelectors = {
      generalMessages: {
        container: '.messages-content div',
        messageElement: 'p',
        exclude: ['.time', '.username'] // Add exclusion list
      },
      chatlogsMessages: {
        container: '.chat-logs-container',
        messageElement: '.message-text'
      },
      personalMessages: {
        container: '.messages-container',
        messageElement: '.message-text'
      }
    };

    const config = containerSelectors[containerType];
    if (!config) {
      console.error('Invalid container type');
      return;
    }

    const containers = document.querySelectorAll(config.container);
    const globalProcessed = new WeakSet();

    containers.forEach((container) => {
      const messages = container.querySelectorAll(config.messageElement);

      messages.forEach((message) => {
        const processingQueue = [
          ...message.querySelectorAll('.private'),
          ...message.querySelectorAll('.system-message'),
          message
        ];

        processingQueue.forEach((element) => {
          const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: (node) => {
                // Skip processed nodes and protected elements
                if (globalProcessed.has(node)) return NodeFilter.FILTER_SKIP;

                // Check if node is inside excluded elements
                const parent = node.parentElement;
                if (parent.closest('.mention, .time, .username')) {
                  return NodeFilter.FILTER_SKIP;
                }

                // Additional exclusion for generalMessages
                if (containerType === 'generalMessages' && parent.closest(config.exclude.join(','))) {
                  return NodeFilter.FILTER_SKIP;
                }

                return NodeFilter.FILTER_ACCEPT;
              }
            },
            false
          );

          const nodes = [];
          let currentNode;
          while ((currentNode = walker.nextNode())) {
            nodes.push(currentNode);
          }

          nodes.forEach((node) => {
            if (!globalProcessed.has(node)) {
              processNode(node);
              globalProcessed.add(node);
            }
          });
        });
      });
    });

    function processNode(node) {
      const regex = /[\s]+|[^\s\wа-яА-ЯёЁ]+|[\wа-яА-ЯёЁ]+/g;
      const words = node.textContent.match(regex);
      if (!words) return;

      const fragment = document.createDocumentFragment();

      words.forEach((word) => {
        if (mentionKeywords.map(alias => alias.toLowerCase()).includes(word.toLowerCase())) {
          const mentionSpan = document.createElement('span');
          mentionSpan.className = 'mention';
          mentionSpan.textContent = word;
          Object.assign(mentionSpan.style, {
            display: 'inline-flex',
            color: '#83cf40',
            fontFamily: 'Roboto Mono, monospace',
            fontWeight: 'bold'
          });
          fragment.appendChild(mentionSpan);
        } else {
          fragment.appendChild(document.createTextNode(word));
        }
      });

      node.parentNode.replaceChild(fragment, node);
    }
  }

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // Achromatic
    } else {
      const delta = max - min;
      s = l < 0.5 ? delta / (max + min) : delta / (2 - max - min);
      h = (
        max === r
          ? (g - b) / delta + (g < b ? 6 : 0)
          : max === g
            ? (b - r) / delta + 2
            : (r - g) / delta + 4
      ) / 6;
    }

    h = Math.round(h * 360); // Convert to degrees
    s = Math.min(Math.round(s * 100), 90); // Cap saturation at 90
    l = Math.round(l * 100); // Convert lightness to 0–100

    // Adjust hue to allow only 0–230 and 280–360 ranges
    if (h > 215 && h < 280) {
      h = h < 255 ? 215 : 280; // Shift to nearest valid range
    }

    return { h, s, l };
  };


  const hslToRgb = (h, s, l) => {
    s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) r = g = b = l * 255; // Achromatic
    else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        return t < 1 / 6 ? p + (q - p) * 6 * t :
          t < 1 / 2 ? q :
            t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 :
              p;
      };
      r = Math.round(hue2rgb(p, q, h / 360 + 1 / 3) * 255);
      g = Math.round(hue2rgb(p, q, h / 360) * 255);
      b = Math.round(hue2rgb(p, q, h / 360 - 1 / 3) * 255);
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Normalize chat username color to be readable in the personal messages panel
  function normalizeUsernameColor(initialColor) {
    const [r, g, b] = initialColor.match(/\d+/g).map(Number);
    const { h, s, l } = rgbToHsl(r, g, b);

    // Adjust lightness to ensure it's at least 50
    const normalizedLightness = l < 50 ? 50 : l;
    const finalColor = hslToRgb(h, s, normalizedLightness);

    // Round the RGB values in one go
    return finalColor;
  }

  function getLatestMessageData() {
    const messageElement = document.querySelector('.messages-content div p:last-of-type');
    if (!messageElement) return null;

    // Inline helper: collects text parts from a container's child nodes.
    const collectMessageParts = container =>
      Array.from(container.childNodes)
        .map(node =>
          node.nodeType === Node.TEXT_NODE && node.textContent.trim() ? node.textContent.trim() :
            node.nodeName === 'IMG' && node.getAttribute('title') ? node.getAttribute('title') :
              node.nodeName === 'A' && node.getAttribute('href') ? node.getAttribute('href') : ''
        )
        .filter(Boolean);

    // 1. Extract common message text.
    let finalMessageText = collectMessageParts(messageElement).join(' ').trim();
    let messageType = "common"; // Default message type

    // 2. Check for private messages
    const privateMessageContainer = messageElement.querySelector('.room.private');
    if (privateMessageContainer && privateMessageContainer.textContent.includes('[шепчет вам]')) {
      const privateMessageElement = messageElement.querySelector('span.private');
      if (privateMessageElement) {
        finalMessageText = collectMessageParts(privateMessageElement).join(' ').trim();
        messageType = "private";
      }
    }

    // 3. Check for system messages
    const systemMessageElement = messageElement.querySelector('.system-message');
    if (systemMessageElement) {
      let systemMessageText = collectMessageParts(systemMessageElement).join(' ').trim();
      systemMessageText = systemMessageText.replace(/<Клавобот>\s*/g, '');
      finalMessageText = systemMessageText;
      messageType = "system";
    }

    // 4. If still "common" and it mentions the user, mark as "mention".
    if (messageType === "common" && isMentionForMe(finalMessageText)) {
      messageType = "mention";
    }

    // Process localStorage: retrieve or initialize personalMessages.
    const personalMessages = JSON.parse(localStorage.getItem('personalMessages')) || {};
    const getCurrentDate = () => new Date().toLocaleDateString('en-CA');

    // Extract message metadata.
    const time = messageElement.querySelector('.time')?.textContent || 'N/A';
    const usernameDataElement = messageElement.querySelector('.username span[data-user]');
    const userId = usernameDataElement ? usernameDataElement.getAttribute('data-user') : null;
    const extractedUsername = usernameDataElement ? usernameDataElement.textContent : 'SYSTEM';
    const usernameColor = usernameDataElement ? usernameDataElement.parentElement.style.color : 'rgb(180,180,180)';
    const normalizedColor = normalizeUsernameColor(usernameColor);
    const messageKey = `${time}_${extractedUsername}`;

    // Check if the message type is "mention" or "private", and if the username is not in the ignore list
    const shouldSaveMessage = (
      messageType === "mention" ||
      messageType === "private"
    ) && !ignored.includes(extractedUsername);

    // If the condition is met, save the message to localStorage
    if (shouldSaveMessage) {
      personalMessages[messageKey] = {
        time,
        date: getCurrentDate(),
        username: extractedUsername,
        usernameColor: normalizedColor,
        message: finalMessageText,
        type: messageType,
        userId
      };
      localStorage.setItem('personalMessages', JSON.stringify(personalMessages));
    }

    // Extract username (defaulting to "SYSTEM") and build prefix.
    const usernameContainer = messageElement.querySelector('.username');
    const usernameText = usernameContainer ? usernameContainer.textContent.replace(/[<>]/g, '') : 'SYSTEM';

    highlightMentionWords(); // Apply highlight for all message types

    let prefix = (messageType === "mention" || messageType === "private")
      ? `${replaceWithPronunciation(usernameText)} обращается: `
      : (usernameText !== lastUsername ? `${replaceWithPronunciation(usernameText)} пишет: ` : "");
    lastUsername = usernameText;

    const messageText = prefix + replaceWithPronunciation(finalMessageText);
    return { messageText, usernameText };
  }

  // Prevent the "readNewMessages" function from being called multiple times until all messages in the set have been read
  let isReading = false;

  // Create a Set to store the new messages
  const newMessages = new Set();

  // This function adds a new message to the Set and triggers the "readNewMessages" function if the Set was empty before
  function addNewMessage(message) {
    // Check if the new message is not already in the Set
    if (!newMessages.has(message)) {
      // Add the new message to the Set
      newMessages.add(message);
      // If the "readNewMessages" function is not already in progress, trigger it
      if (!isReading) {
        // Change the flag to true to be initialized accent beep sound for mention message
        isReading = true;
        readNewMessages();
      }
    }
  }

  // This function reads the new messages from the Set and removes them after reading
  async function readNewMessages() {
    // Read each message in sequence from the Set
    for (let message of newMessages) {
      // Call the textToSpeech function to read the message
      await textToSpeech(message, voiceSpeed);
      // Remove the message from the Set after reading
      newMessages.delete(message);
    }
    // Set the isReading flag to false after reading all messages
    isReading = false;
  }

  // Track if the user has loaded messages for the first time
  let firstTime = true;
  // The distance from the bottom at which we should trigger auto-scrolling
  const scrollThreshold = 600;

  // Scrolls the specified container to the bottom if the user has scrolled close enough
  function scrollMessagesToBottom(containerType = 'generalMessages') {
    // Define a mapping for container types to their respective selectors
    const containerSelectors = {
      generalMessages: '.messages-content', // For general chat
      chatlogsMessages: '.chat-logs-container', // For chat logs
      personalMessages: '.messages-container-wrapper' // For personal messages panel
    };

    // Get the container based on the passed containerType
    const containerSelector = containerSelectors[containerType];

    // If the container selector is not defined, return
    if (!containerSelector) return;

    // Get the container element
    const container = document.querySelector(containerSelector);
    if (!container) return; // Return if the container doesn't exist

    // If it's the user's first time loading messages, auto-scroll to the bottom
    if (firstTime) {
      container.scrollTop = container.scrollHeight;
      firstTime = false;
    } else {
      // Calculate how far the user is from the bottom
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      // If the user is close enough to the bottom, auto-scroll to the bottom
      if (distanceFromBottom <= scrollThreshold) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }

  // Function to scroll messages to the middle of the parent container
  async function scrollMessagesToMiddle(parent, element) {
    const { top, height } = element.getBoundingClientRect(); // Get the position and height of the found element
    const { top: parentTop, height: parentHeight } = parent.getBoundingClientRect(); // Get the position and height of the parent

    // Calculate the middle position of the parent container
    const parentMiddle = parentTop + parentHeight / 2;

    // Determine how far to scroll to center the found element
    const scrollOffset = top - parentMiddle + height / 2;

    // Scroll to the found element to center it within the parent
    parent.scrollBy({
      top: scrollOffset,
      behavior: 'smooth'
    });

    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the scroll to complete
    parent.style.scrollBehavior = 'auto'; // Reset scroll behavior
    addShakeEffect(element); // Add a shake effect to the found element
  }

  function applyChatMessageGrouping() {
    // Get the messages container element
    const messagesContainer = document.getElementById('chat-content');

    // Get all the chat message elements from the messages container
    const chatMessages = messagesContainer.querySelectorAll('.messages-content div p');

    // Initialize variables
    let previousUser = null;
    let isFirstMessage = true;
    let spacing = '14px';

    // Loop through the chat messages
    for (let i = 0; i < chatMessages.length; i++) {
      const message = chatMessages[i];
      const usernameElement = message.querySelector('span.username');

      // Check if it's a system message with the "system-message" class
      const isSystemMessage = message.querySelector('.system-message');

      if (isSystemMessage) {
        // Apply margins to system messages
        message.style.marginTop = spacing;
        message.style.marginBottom = spacing;
      } else if (usernameElement) { // Check if the message contains a username
        // Get the username from the current message
        const usernameElementWithDataUser = usernameElement.querySelector('span[data-user]');

        if (!usernameElementWithDataUser) {
          continue; // Skip messages without a data-user element
        }

        let usernameText = usernameElementWithDataUser.textContent;

        // Remove the "<" and ">" symbols from the username if they are present
        usernameText = usernameText.replace(/</g, '').replace(/>/g, '');

        // Apply margin-top for the first message or when the user changes
        if (previousUser === null || usernameText !== previousUser) {
          // Check if it's not the first message overall
          if (!isFirstMessage) {
            // Add margin-top to create separation between the current message and the previous message
            message.style.marginTop = spacing;
          }
        } else {
          // Check if it's not the first message of the current user
          if (!isFirstMessage) {
            // Remove the margin-bottom property from the current message to remove any previously set margin
            message.style.removeProperty('margin-bottom');
          }
        }

        // Check if there is a next message
        const hasNextMessage = i < chatMessages.length - 1;

        // Check if there is a next message and it contains a username
        if (hasNextMessage) {
          const nextMessage = chatMessages[i + 1];
          const nextUsernameElement = nextMessage.querySelector('span.username');

          if (nextUsernameElement) {
            const nextUsernameElementWithDataUser = nextUsernameElement.querySelector('span[data-user]');

            if (!nextUsernameElementWithDataUser) {
              continue; // Skip messages without a data-user element
            }

            // Get the username from the next message
            const nextUsernameText = nextUsernameElementWithDataUser.textContent;

            // Apply margin-bottom for the last message of each user
            if (usernameText !== nextUsernameText) {
              message.style.marginBottom = spacing;
            }
          }
        }

        // Update the previousUser variable to store the current username
        previousUser = usernameText;
        // Set isFirstMessage to false to indicate that this is not the first message overall
        isFirstMessage = false;
      }
    }
  }

  // Call the function to apply chat message grouping
  applyChatMessageGrouping();

  // Algorithm to check for similarity between two strings
  function similarity(s1, s2) {
    const [longer, shorter] = s1.length >= s2.length ? [s1, s2] : [s2, s1];
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - editDistance(longer, shorter)) / longerLength;
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = Array(s2.length + 1).fill(0).map((_, j) => j);
    for (let i = 1; i <= s1.length; i++) {
      let lastValue = costs[0];
      costs[0] = i;
      for (let j = 1; j <= s2.length; j++) {
        const newValue = costs[j];
        costs[j] = s1.charAt(i - 1) === s2.charAt(j - 1) ? lastValue : Math.min(Math.min(newValue, lastValue), costs[j - 1]) + 1;
        lastValue = newValue;
      }
    }
    return costs[s2.length];
  }

  // Time difference threshold (in milliseconds) to identify spam
  const timeDifferenceThreshold = 400;
  // Message limit per timeDifferenceThreshold
  const messageLimit = 1;
  // Object to track user-specific data
  let userChatData = {};
  // Maximum number of consecutive times a user is allowed to exceed the message limit
  const thresholdMaxTries = 10;

  // Function to format time difference
  function formatTimeDifference(difference) {
    // Define time units
    const units = ['hour', 'minute', 'second', 'millisecond'];

    // Calculate values for each time unit
    const values = [
      Math.floor(difference / (1000 * 60 * 60)), // hours
      Math.floor((difference / (1000 * 60)) % 60), // minutes
      Math.floor((difference / 1000) % 60), // seconds
      difference % 1000 // milliseconds
    ];

    // Map each non-zero value to a formatted string with its corresponding unit
    const formattedStrings = values
      .map((value, index) => (value > 0 ? `${value} ${units[index]}${value > 1 ? 's' : ''}` : ''));

    // Filter out empty strings (units with a value of 0) and join the remaining strings
    const formattedTime = formattedStrings
      .filter(Boolean)
      .join(' ');

    // Return the formatted time string
    return formattedTime;
  }

  // Helper function to remove all messages by a user
  function removeUserMessages(userId) {
    const userMessages = document.querySelectorAll(`.messages-content span[data-user="${userId}"]`);
    userMessages.forEach(message => {
      const pTag = message.closest('p');
      if (pTag) {
        pTag.remove();
      }
    });
  }

  const digits = '0-9';
  const whitespaces = '\\s';
  const latinChars = 'a-zA-Z';
  const cyrillicChars = 'а-яА-ЯёЁ';
  const commonSymbols = '!@#$%^&*()-_=+[\\]{}|;:\'",.<>/?`~';

  // Special symbols as characters
  const copyrightSymbol = '\\u00A9'; // ©
  const trademarkSymbol = '\\u2122'; // ™
  const registeredSymbol = '\\u00AE'; // ®
  const leftDoubleAngleQuote = '\\u00AB'; // «
  const rightDoubleAngleQuote = '\\u00BB'; // »
  const plusMinus = '\\u00B1'; // ±
  const multiplication = '\\u00D7'; // ×
  const division = '\\u00F7'; // ÷
  const degreeSymbol = '\\u00B0'; // °
  const notEqual = '\\u2260'; // ≠
  const lessThanOrEqual = '\\u2264'; // ≤
  const greaterThanOrEqual = '\\u2265'; // ≥
  const infinity = '\\u221E'; // ∞
  const euroSymbol = '\\u20AC'; // €
  const poundSymbol = '\\u00A3'; // £
  const yenSymbol = '\\u00A5'; // ¥
  const sectionSymbol = '\\u00A7'; // §
  const bulletPoint = '\\u2022'; // •
  const ellipsis = '\\u2026'; // …
  const minus = '\\u2212'; // −
  const enDash = '\\u2013'; // –
  const emDash = '\\u2014'; // —

  // Arrow and Mathematical symbols as Unicode escape sequences
  const leftArrow = '\\u2190'; // ←
  const rightArrow = '\\u2192'; // →
  const upArrow = '\\u2191'; // ↑
  const downArrow = '\\u2193'; // ↓

  const half = '\\u00BD'; // ½
  const oneThird = '\\u2153'; // ⅓
  const twoThirds = '\\u2154'; // ⅔

  const summation = '\\u2211'; // ∑
  const acuteAccent = '\\u00B4'; // ´

  const emojiRanges = '\\uD83C-\\uDBFF\\uDC00-\\uDFFF';

  // Initialized to store characters found in a message that are not allowed
  let disallowedChars = null;

  function messageContainsAllowedChars(message) {
    const allowedCharsRegex = new RegExp(
      `[${digits}${latinChars}${cyrillicChars}${whitespaces}${commonSymbols}` +
      `${copyrightSymbol}${trademarkSymbol}${registeredSymbol}${leftDoubleAngleQuote}${rightDoubleAngleQuote}` +
      `${plusMinus}${multiplication}${division}${degreeSymbol}${notEqual}${lessThanOrEqual}${greaterThanOrEqual}` +
      `${infinity}${euroSymbol}${poundSymbol}${yenSymbol}${sectionSymbol}${bulletPoint}${ellipsis}${minus}${enDash}${emDash}` +
      `${leftArrow}${rightArrow}${upArrow}${downArrow}${half}${oneThird}${twoThirds}${summation}` +
      `${acuteAccent}${emojiRanges}]+`, 'gu' // previous 'g'
    );

    const allowedChars = message.match(allowedCharsRegex);

    if (allowedChars && allowedChars.join('') === message) {
      return true;
    } else {
      disallowedChars = message.replace(allowedCharsRegex, '');
      return false;
    }
  }

  // Helper function to handle threshold check
  function handleThresholdExceeded(userId, generateLogUserInfo) {
    if (userChatData[userId].thresholdMaxTries >= thresholdMaxTries) {
      // Set 'banned' to true after passing the max thresholdMaxTries to remove user messages passing the messages limit checking
      userChatData[userId].banned = true;
      console.log(generateLogUserInfo(), 'color: pink');
      console.log(`%c${userChatData[userId].userName} cannot send messages anymore`, 'color: pink');
    }
  }

  // Function to track and handle spam messages
  function banSpammer() {
    // Get the current timestamp
    const currentTime = new Date().getTime();

    // Select the last p element in the chat
    const latestMessage = document.querySelector('.messages-content p:last-child');

    if (latestMessage) {
      // Get user ID from the last message
      const userIdElement = latestMessage.querySelector('span[data-user]');
      const userId = userIdElement ? userIdElement.getAttribute('data-user') : null;

      // Initialize user-specific data outside the if block
      if (!userChatData[userId]) {
        userChatData[userId] = {
          messagesCount: 0,
          thresholdMaxTries: 0,
          time: currentTime,
          userName: userIdElement ? userIdElement.textContent : 'Unknown User',
          previousTime: null,
          firstInteraction: true,
          banned: false
        };
      }

      // Calculate time difference
      const timeDifference = currentTime - userChatData[userId].time;

      // Function to generate log information dynamically
      function generateLogUserInfo() {
        return `%cID: ${userId}, Name: ${userChatData[userId].userName}, ` +
          `Time Difference: ${formatTimeDifference(timeDifference)}, ` +
          `Messages Count: ${userChatData[userId].messagesCount}, ` +
          `Spam Tries: ${userChatData[userId].thresholdMaxTries}, ` +
          `Banned: ${userChatData[userId].banned}`;
      }

      // Check if the message contains not allowed chars
      if (!messageContainsAllowedChars(latestMessage.textContent, userId) && !userChatData[userId].banned) {
        // Increase thresholdMaxTries on every limit pass
        userChatData[userId].thresholdMaxTries++;
        // If the message contains not allowed chars, log the information
        console.log(
          `%c${userChatData[userId].userName} has sent a message with not allowed characters ${disallowedChars}.
          Threshold: ${userChatData[userId].thresholdMaxTries}.`,
          'color: orange;'
        );
        handleThresholdExceeded(userId, generateLogUserInfo);
      }

      // Special handling for the first interaction
      if (userChatData[userId].firstInteraction) {
        console.log(`%c${userChatData[userId].userName} posted the first message for the current chat session.`, 'color: yellow');
        userChatData[userId].firstInteraction = false;
      }

      // Check if the user is banned
      else if (userChatData[userId].banned) {
        // Remove all the messages by that user continuously until banned
        removeUserMessages(userId);
      } else {
        if (timeDifference < timeDifferenceThreshold) {
          // Check if the time difference is less than the threshold
          userChatData[userId].messagesCount++;

          if (userChatData[userId].messagesCount > messageLimit) {
            // Remove all messages by that user if messages limit was exceeded
            removeUserMessages(userId);

            // Increase thresholdMaxTries on every limit pass
            userChatData[userId].thresholdMaxTries++;

            handleThresholdExceeded(userId, generateLogUserInfo);

            // Log the information immediately after updating the values if not banned
            if (!userChatData[userId].banned) {
              console.log(generateLogUserInfo(), 'color: red');
            }
          } else {
            // Log the information immediately after updating the values if not banned and not exceeding the limit
            console.log(generateLogUserInfo(), 'color: green');
          }
        } else {
          // If none of the above conditions are met, update user-specific data for the current interaction
          userChatData[userId].previousTime = userChatData[userId].time;
          userChatData[userId].time = currentTime;
          userChatData[userId].messagesCount = 1;

          // Log the information immediately after updating the values if not banned and not exceeding the limit
          console.log(generateLogUserInfo(), 'color: green');
        }
      }
    }
  }


  // POPUP MESSAGES START

  const popupChatMessageStyles = document.createElement('style');
  popupChatMessageStyles.textContent = `
    .popup-messages-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: start;
      user-select: none;
      pointer-events: none;
      position: fixed;
      left: 0;
      right: 0;
      top: 50px;
      bottom: 0;
    }

    .popup-chat-message {
      display: flex;
      align-items: center;
      background-color: hsl(100, 50%, 10%);
      position: relative;
      max-width: 70vw;
      border-radius: 0.2em !important;
      color: hsl(100, 50%, 50%);
      border: 1px solid hsl(100, 50%, 25%);
      padding: 4px;
      margin: 6px 15vw;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      animation: fadeIn 0.3s ease-in-out forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .popup-chat-message.fade-out {
      animation: fadeOut 0.3s ease-in-out forwards;
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-20px);
      }
    }

    .popup-chat-message > div {
      padding: 2px;
      display: flex;
      font-family: 'Montserrat', sans-serif;
    }

    .popup-chat-message .time,
    .popup-chat-message .time-icon {
      opacity: 0.7;
    }
`;

  popupChatMessageStyles.classList.add('popup-chat-message-styles');

  document.head.appendChild(popupChatMessageStyles);

  // Set the maximum number of popup messages to display globally
  const maxPopupMessagesCount = 10;

  // Define an object to store the hue for each username
  const usernameHueMap = {};
  // Increase step for noticeable color changes
  const hueStep = 15;

  // Define the function to show popup messages when the main chat is hidden by hotkeys Ctrl + Space (only)
  function showPopupMessage() {
    // Check if the key 'shouldShowPopupMessage' exists and has a value of true
    const shouldShowPopupMessage = localStorage.getItem('shouldShowPopupMessage');

    // Stop execution if shouldShowPopupMessage is false
    if (shouldShowPopupMessage !== 'true') {
      return;
    }

    // Get the last message in the chat
    const latestMessage = document.querySelector('.messages-content p:last-of-type');

    if (latestMessage) {
      // Extract elements for time and username from the latest message
      const time = latestMessage.querySelector('.time');
      const username = latestMessage.querySelector('.username');

      const nodes = Array.from(latestMessage.childNodes);
      const elements = nodes.map(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return { type: 'text', value: node.nodeValue.replace(/ /g, '\u00A0') }; // Replace spaces with Unicode non-breaking space
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.toLowerCase() === 'a' && node.classList.contains('private')) {
            return { type: 'text', value: '📢\u00A0' };
          }
          if (node.tagName.toLowerCase() === 'span' && node.classList.contains('private')) {
            return { type: 'text', value: node.textContent.replace(/ /g, '\u00A0') };
          }
          if (node.tagName.toLowerCase() === 'img') {
            return { type: 'img', title: node.getAttribute('title') };
          }
          if (node.tagName.toLowerCase() === 'a') {
            return { type: 'anchor', href: node.getAttribute('href') };
          }
        }
      }).filter(Boolean);

      // Extract relevant data from the time and username elements
      const cleanTime = time.textContent.replace(/[\[\]]/g, '');
      const cleanUsername = username.textContent.replace(/[<>]/g, '');

      // Check if the hue for this username is already stored
      let hueForUsername = usernameHueMap[cleanUsername];

      // If the hue is not stored, generate a new random hue with the specified step
      if (!hueForUsername) {
        hueForUsername = Math.floor(Math.random() * (360 / hueStep)) * hueStep;
        // Store the generated hue for this username
        usernameHueMap[cleanUsername] = hueForUsername;
      }

      // Create or get the main container for all messages
      let popupMessagesContainer = document.querySelector('.popup-messages-container');
      if (!popupMessagesContainer) {
        popupMessagesContainer = document.createElement('div');
        popupMessagesContainer.classList.add('popup-messages-container');
        document.body.appendChild(popupMessagesContainer);
      }

      // Check if the total number of messages in the container exceeds the maximum
      if (popupMessagesContainer.childElementCount >= maxPopupMessagesCount) {
        // Get the oldest message
        const oldestMessage = popupMessagesContainer.firstChild;

        // Apply a CSS class to initiate the fade-out animation
        oldestMessage.classList.add('fade-out');

        // After the animation duration, remove the message from the DOM
        setTimeout(() => {
          popupMessagesContainer.removeChild(oldestMessage);
        }, 300); // Adjust the time to match your CSS animation duration
      }

      // Create a container div for each message
      const popupChatMessage = document.createElement('div');
      popupChatMessage.classList.add('popup-chat-message');
      // Apply the hue-rotate filter to the entire message container
      popupChatMessage.style.filter = `hue-rotate(${hueForUsername}deg)`;

      // Append time SVG icon before the time
      const timeIcon = document.createElement('div');
      timeIcon.classList.add('time-icon');
      timeIcon.innerHTML = clockSVG;

      // Append spans for each part with respective classes
      const timeElement = document.createElement('div');
      timeElement.classList.add('time');
      timeElement.textContent = cleanTime;

      // Append user SVG icon after the time
      const userIcon = document.createElement('div');
      userIcon.classList.add('user-icon');
      userIcon.innerHTML = userSVG;

      const usernameElement = document.createElement('div');
      usernameElement.classList.add('username');
      usernameElement.textContent = cleanUsername;

      // Append action SVG icon after the username
      const actionIcon = document.createElement('div');
      actionIcon.classList.add('action-icon');
      actionIcon.innerHTML = actionSVG;

      const messageElement = document.createElement('div');
      messageElement.classList.add('message');

      // Append elements to the message container
      popupChatMessage.appendChild(timeIcon);
      popupChatMessage.appendChild(timeElement);
      popupChatMessage.appendChild(userIcon);
      popupChatMessage.appendChild(usernameElement);
      popupChatMessage.appendChild(actionIcon);
      popupChatMessage.appendChild(messageElement);

      // Fill the message container with text, images, and anchors
      elements.forEach(element => {
        const elementContainer = document.createElement('div');

        if (element.type === 'text') {
          elementContainer.textContent = element.value;
        } else if (element.type === 'img') {
          elementContainer.innerHTML = `&nbsp;${element.title}&nbsp;`;
        } else if (element.type === 'anchor') {
          elementContainer.innerHTML = `&nbsp;${element.href}&nbsp;`;
        }

        messageElement.appendChild(elementContainer);
      });

      // Append the message container to the main container
      popupMessagesContainer.appendChild(popupChatMessage);
    }
  }

  // POPUP MESSAGES END

  // Function to convert Cyrillic characters to Latin
  function convertCyrillicToLatin(input) {
    const cyrillicToLatinMap = {
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
      'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
      'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
      'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
      'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch',
      'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': 'y', // 'ъ' maps to 'y'
      'Ы': 'Y', 'Ь': 'i', // 'ь' maps to 'i'
      'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
      'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
      'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
      'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
      'ш': 'sh', 'щ': 'shch', 'ъ': 'y', // 'ъ' maps to 'y'
      'ы': 'y', 'ь': 'i', // 'ь' maps to 'i'
      'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    // Convert the input string to Latin using the mapping
    return input.split('').map(char => cyrillicToLatinMap[char] || char).join('');
  }

  // Function to convert Russian usernames
  function convertRussianUsernameToLatin(username) {
    // Use the conversion function on the username
    return convertCyrillicToLatin(username);
  }

  // Skip reading the messages on page load to read them normally when the user is present and the page is stable
  let isInitialized = false;
  // Define the maximum number of messages per user
  const maxMessagesPerUser = 5;
  // Set a similarity threshold (you can adjust this value as needed)
  const similarityThreshold = 0.8;
  // Create a map to hold messages for each user
  const messagesForSimilarityCheck = new Map();

  // Function to remove all messages from users in the ignored
  function removeIgnoredUserMessages() {
    document.querySelectorAll('.messages-content p').forEach(message => {
      const usernameElement = message.querySelector('.username'); // Adjust selector if needed
      const username = usernameElement?.textContent?.replace(/[<>]/g, '') || null;

      if (username && ignored.includes(username)) {
        // console.log(`Hidden message from ignored user: ${username}`);
        // Convert Cyrillic username to Latin
        const latinUsername = convertRussianUsernameToLatin(username);
        message.classList.add('ignored-user', latinUsername);
        message.style.display = 'none'; // Hide the message
      }
    });
  }

  // Function to play sound as a notification for system message banned
  function playSound() {
    const marioGameOver = 'https://github.com/VimiummuimiV/Sounds/raw/refs/heads/main/Mario_Game_Over.mp3';
    const audio = new Audio(marioGameOver);
    audio.play();
  }

  // Function to detect a ban message based on the message text content
  function isBanMessage(messageText) {
    return ['Клавобот', 'Пользователь', 'заблокирован'].every(word => messageText.includes(word));
  }

  /**
   * Normalizes the color of usernames and resets their filter based on the specified mode.
   *
   * @param {NodeList|Element} usernameElements - A NodeList of username elements or a single username element.
   * @param {string} mode - The mode of operation; either 'one' to process a single username or 'all' to process multiple.
   */
  function normalizeAndResetUsernames(usernameElements, mode) {
    if (!usernameElements) return; // Skip processing if undefined or null

    if (mode === 'one') {
      // Process a single username element.
      const userSpan = usernameElements.querySelector('span[data-user]');
      if (!userSpan) return; // Skip processing if child span is missing
      const computedColor = getComputedStyle(usernameElements).color;
      const normalizedColor = normalizeUsernameColor(computedColor);
      usernameElements.style.setProperty('color', normalizedColor, 'important');
      userSpan.style.setProperty('filter', 'invert(0)', 'important');
    } else if (mode === 'all') {
      // Process all username elements using forEach with return (which acts like continue)
      Array.from(usernameElements).forEach(usernameElement => {
        if (!usernameElement) return; // Skip this iteration if the element is falsy
        const userSpan = usernameElement.querySelector('span[data-user]');
        if (!userSpan) return; // Skip if child span is missing
        const computedColor = getComputedStyle(usernameElement).color;
        const normalizedColor = normalizeUsernameColor(computedColor);
        usernameElement.style.setProperty('color', normalizedColor, 'important');
        userSpan.style.setProperty('filter', 'invert(0)', 'important');
      });
    } else {
      console.error("Invalid mode. Use 'one' or 'all'.");
    }
  }

  // Create a mutation observer to watch for new messages being added
  const newMessagesObserver = new MutationObserver(mutations => {
    // If isInitialized is false, return without doing anything
    if (!isInitialized) {
      isInitialized = true;

      // Remove the 'sessionChatMessages' key from localStorage if it exists
      localStorage.getItem('sessionChatMessages') && localStorage.removeItem('sessionChatMessages');

      // Normalize chat usernames color for dark theme
      const allUsernameElements = document.querySelectorAll('.username'); // Get all username elements
      normalizeAndResetUsernames(allUsernameElements, 'all'); // Process all username elements

      return; // Stop processing further
    }

    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        for (let node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
            const singleUsernameElement = node.querySelector('.username'); // Get a single username element
            if (singleUsernameElement) normalizeAndResetUsernames(singleUsernameElement, 'one'); // Process the single username element

            // Retrieve the previous message text from localStorage
            const previousMessageText = localStorage.getItem('previousMessageText');

            // Get the latest message data (returns only messageText and usernameText)
            const latestMessageData = getLatestMessageData();
            const currentMessageText = latestMessageData?.messageText || null;
            const currentMessageUsername = latestMessageData?.usernameText || null;

            // Initialize or update the user's message array in the map for similarity checks
            messagesForSimilarityCheck.set(
              currentMessageUsername,
              messagesForSimilarityCheck.get(currentMessageUsername) || []
            );
            const userMessages = messagesForSimilarityCheck.get(currentMessageUsername);

            // Check if the new message is similar to any existing message
            const isSimilarMessage = userMessages.some(msg => {
              const messageSimilarity = similarity(currentMessageText, msg);
              return messageSimilarity > similarityThreshold;
            });

            // If the message is similar, apply filter styles
            if (isSimilarMessage) {
              node.style.filter = 'opacity(0.3) blur(1px)';
            } else {
              // Otherwise, update the user's message array
              userMessages.push(currentMessageText);
              messagesForSimilarityCheck.set(currentMessageUsername, userMessages);

              // Prepare session messages object for localStorage
              let sessionMessages = JSON.parse(localStorage.getItem('sessionChatMessages')) || {};
              sessionMessages[currentMessageUsername] = sessionMessages[currentMessageUsername] || [];
              sessionMessages[currentMessageUsername].push(currentMessageText);

              // If the number of messages exceeds the maximum, remove the user’s messages
              if (userMessages.length > maxMessagesPerUser) {
                messagesForSimilarityCheck.delete(currentMessageUsername);
                delete sessionMessages[currentMessageUsername];
              }
              localStorage.setItem('sessionChatMessages', JSON.stringify(sessionMessages));
            }

            // Convert Cyrillic username to Latin
            const latinUsername = convertRussianUsernameToLatin(currentMessageUsername);

            // Check for a ban message and play sound if detected
            if (isBanMessage(currentMessageText)) {
              console.log('Ban message detected:', currentMessageText);
              playSound();
            }

            // Hide message if the username is in the ignored list
            if (currentMessageUsername && ignored.includes(currentMessageUsername)) {
              node.classList.add('ignored-user', latinUsername);
              node.style.display = 'none';
              continue;
            }

            // Get sound switcher and message mode elements
            const soundSwitcher = document.querySelector('#voice, #beep, #silence');
            const isVoice = soundSwitcher && soundSwitcher.id === 'voice';
            const isBeep = soundSwitcher && soundSwitcher.id === 'beep';
            const messageMode = document.querySelector('#every-message, #mention-message');
            const isEveryMessageMode = messageMode && messageMode.id === 'every-message';
            const isMentionMessageMode = messageMode && messageMode.id === 'mention-message';

            // Check if the message contains a private indicator
            const privateMessageIndicator = '[шепчет вам]';
            const privateMessageContainer = node.querySelector('.room.private');
            const isPrivateMessage = privateMessageContainer && privateMessageContainer.textContent.includes(privateMessageIndicator);

            // If voice mode is enabled and the message is new, trigger text-to-speech
            if (isVoice && isInitialized && currentMessageText && currentMessageText !== previousMessageText) {
              localStorage.setItem('previousMessageText', currentMessageText);
              if (currentMessageUsername && !currentMessageUsername.includes(myNickname)) {
                if (isEveryMessageMode) {
                  console.log('Triggered Voice: Every message mode');
                  addNewMessage(currentMessageText);
                } else if (isMentionMessageMode && isMention) {
                  console.log('Triggered Voice: Mention message mode');
                  addNewMessage(currentMessageText);
                } else if (isPrivateMessage) {
                  console.log('Triggered Voice: Private message');
                  addNewMessage(currentMessageText);
                } else {
                  console.log('No matching condition for Voice Mode');
                }
              }
            }

            // If beep mode is enabled and the message is new, play beep sound
            if (isBeep && isInitialized && currentMessageText && currentMessageText !== previousMessageText) {
              localStorage.setItem('previousMessageText', currentMessageText);
              if (currentMessageUsername && !currentMessageUsername.includes(myNickname)) {
                if (isEveryMessageMode) {
                  console.log('Triggered Beep: Every message mode');
                  const frequenciesToPlay = isMention ? mentionMessageFrequencies : usualMessageFrequencies;
                  playBeep(frequenciesToPlay, beepVolume);
                } else if (isMentionMessageMode && isMention) {
                  console.log('Triggered Beep: Mention message mode');
                  playBeep(mentionMessageFrequencies, beepVolume);
                } else if (isPrivateMessage) {
                  console.log('Triggered Beep: Private message');
                  playBeep(mentionMessageFrequencies, beepVolume);
                } else {
                  console.log('No matching condition for Beep Mode');
                }
                if (isMention) isMention = false;
              }
            }

            // If the page is initialized, perform various UI updates and processing
            if (isInitialized) {
              attachEventsToMessages();
              convertImageLinksToImage('generalMessages');
              convertVideoLinksToPlayer('generalMessages');
              processEncodedLinks('generalMessages');
              applyChatMessageGrouping();
              scrollMessagesToBottom();
              banSpammer();
              showPopupMessage();
              updatePersonalMessageCounts();
            }
          }
        }
      }
    }
  });

  // Observe changes to the messages container element
  const messagesContainer = document.querySelector('.messages-content div');
  newMessagesObserver.observe(messagesContainer, { childList: true, subtree: true });


  // SOUND GRAPHICAL SWITCHER

  // Declare variables for the sound switcher button and its icon
  let soundSwitcher, soundSwitcherIcon;
  // Declare variables for the message mode button and its icon
  let messageMode, messageModeIcon;

  // Helper function to add pulse effect
  function addPulseEffect(element) {
    element.classList.add('pulse-effect');
    setTimeout(() => {
      element.classList.remove('pulse-effect');
    }, 500);
  }

  function addJumpEffect(element, initialTranslateX = 0, initialTranslateY = 0) {
    // Define keyframes with specified percentages, scale effect, and calc for Y translation
    const keyframes = [
      { transform: `translate(${initialTranslateX}%, calc(${initialTranslateY}%)) scale(1)` }, // 0%
      { transform: `translate(${initialTranslateX}%, calc(${initialTranslateY}% - 60%)) scale(1.1)` }, // 20%
      { transform: `translate(${initialTranslateX}%, calc(${initialTranslateY}% + 15%)) scale(1)` }, // 40%
      { transform: `translate(${initialTranslateX}%, calc(${initialTranslateY}% - 20%)) scale(1.05)` }, // 60%
      { transform: `translate(${initialTranslateX}%, calc(${initialTranslateY}% + 8%)) scale(1)` }, // 75%
      { transform: `translate(${initialTranslateX}%, calc(${initialTranslateY}% - 10%)) scale(1.05)` }, // 85%
      { transform: `translate(${initialTranslateX}%, calc(${initialTranslateY}% + 4%)) scale(1)` }, // 92%
      { transform: `translate(${initialTranslateX}%, calc(${initialTranslateY}%)) scale(1)` } // 100%
    ];

    // Animation options
    const options = {
      duration: 500, // Total animation duration in ms (adjust as needed)
      easing: 'ease', // Smooth easing between keyframes
      iterations: 1 // Play once
    };

    // Start the animation
    const animation = element.animate(keyframes, options);

    // Optional: Return a promise that resolves when animation completes
    return animation.finished;
  }

  // Helper function to add shake effect
  function addShakeEffect(element) {
    element.classList.add('shake-effect');
    setTimeout(() => {
      element.classList.remove('shake-effect');
    }, 500);
  }

  // Helper function to apply common styles to buttons
  function applyBaseButtonStyles(element) {
    Object.assign(element.style, {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '48px',
      height: '48px',
      cursor: 'pointer',
      margin: `${empowermentButtonsMargin}px`,
      backgroundColor: '#212226',
      border: '1px solid #45474b',
    });
  }

  // CREATE SOUND SWITCHER BUTTON (START)

  function createSoundSwitcherButton() {
    // Create a new element with class 'sound-switcher-button' and id 'silence'
    soundSwitcher = document.createElement('div');
    // Retrieve the value from localStorage key "messageNotificationState"
    const messageNotificationState = KG_Chat_Empowerment.messageSettings.messageNotificationState || 'silence';
    // Add the class 'sound-switcher-button' to the 'soundSwitcher' element
    soundSwitcher.classList.add('sound-switcher-button');
    // Initial button id if the localStorage key isn't created with assigned value by user
    soundSwitcher.id = messageNotificationState;
    // Retrieve the value from localStorage key "messageNotificationTitle"

    // Apply base button styles
    applyBaseButtonStyles(soundSwitcher);

    // Retrieve the value from KG_Chat_Empowerment.messageSettings.messageNotificationTitle
    const messageNotificationTitle = KG_Chat_Empowerment.messageSettings.messageNotificationTitle || 'Do not disturb';
    // Assign title for the current notification state
    soundSwitcher.title = messageNotificationTitle;

    // Create sound switcher button icon container
    soundSwitcherIcon = document.createElement('span');
    // Add class to icon container
    soundSwitcherIcon.classList.add('sound-switcher-icon');

    // Append icon container inside sound switcher button
    soundSwitcher.appendChild(soundSwitcherIcon);
    // Append sound switcher button to chat buttons panel
    empowermentButtonsPanel.appendChild(soundSwitcher);
  } createSoundSwitcherButton();

  // Add the isAltKeyPressed condition to the soundSwitcher event listener
  soundSwitcher.addEventListener('click', function (event) {
    // Only execute the code if both isCtrlKeyPressed and isAltKeyPressed are false
    if (!isCtrlKeyPressed && !isAltKeyPressed) {

      // Get progress bar elements if they exist in the DOM
      let currentVoiceSpeed = document.querySelector('.current-voice-speed');
      let currentVoicePitch = document.querySelector('.current-voice-pitch');

      // Remove voice speed setting progress bar
      if (currentVoiceSpeed) {
        currentVoiceSpeed.remove();
      }

      // Remove voice pitch setting progress bar
      if (currentVoicePitch) {
        currentVoicePitch.remove();
      }

      // Add pulse effect for soundSwitcher
      addPulseEffect(this);

      switch (this.id) {
        case 'silence':
          this.id = 'beep';
          this.title = 'Notify with beep signal';
          KG_Chat_Empowerment.messageSettings.messageNotificationState = 'beep';
          KG_Chat_Empowerment.messageSettings.messageNotificationTitle = 'Notify with beep signal';
          break;
        case 'beep':
          this.id = 'voice';
          this.title = 'Notify with voice API';
          KG_Chat_Empowerment.messageSettings.messageNotificationState = 'voice';
          KG_Chat_Empowerment.messageSettings.messageNotificationTitle = 'Notify with voice API';
          break;
        case 'voice':
          this.id = 'silence';
          this.title = 'Do not disturb';
          KG_Chat_Empowerment.messageSettings.messageNotificationState = 'silence';
          KG_Chat_Empowerment.messageSettings.messageNotificationTitle = 'Do not disturb';
          break;
      }
      // Stringify KG_Chat_Empowerment before updating in localStorage
      localStorage.setItem('KG_Chat_Empowerment', JSON.stringify(KG_Chat_Empowerment));

      updateSoundSwitcherIcon();
    }
  });

  function updateSoundSwitcherIcon() {
    switch (soundSwitcher.id) {
      case 'silence':
        soundSwitcherIcon.innerHTML = silenceSVG;
        break;
      case 'beep':
        soundSwitcherIcon.innerHTML = beepSVG;
        break;
      case 'voice':
        soundSwitcherIcon.innerHTML = voiceSVG;
        break;
    }
  } updateSoundSwitcherIcon();

  // This function combines the results of the above functions to return an object
  // with both the speed and pitch percentages as strings with a "%" sign appended.
  function getVoiceSettingsPercentage() {
    const speedPercent = ((voiceSpeed - minVoiceSpeed) / (maxVoiceSpeed - minVoiceSpeed)) * 100;
    const pitchPercent = ((voicePitch - minVoicePitch) / (maxVoicePitch - minVoicePitch)) * 100;

    return {
      speed: `${speedPercent}%`,
      pitch: `${pitchPercent}%`,
    };
  }

  // Function to assign common styles for voice speed and pitch elements
  function assignVoiceSettingsStyles(voiceSettings) {
    voiceSettings.style.position = 'absolute';
    voiceSettings.style.top = '65px';
    voiceSettings.style.right = '70px';
    voiceSettings.style.opacity = 0;
    voiceSettings.style.transition = 'opacity 0.3s ease';
    voiceSettings.style.fontFamily = 'Orbitron, sans-serif';
  }

  /*
  * Shows the current voice speed or pitch as a span element with appropriate styles.
  * If the Ctrl key is pressed, displays the current voice speed.
  * If the Alt key is pressed, displays the current voice pitch.
  */
  function showVoiceSettings() {
    let voiceSettings = document.querySelector('.voice-settings');
    let currentVoiceSpeed = document.querySelector('.current-voice-speed');
    let currentVoicePitch = document.querySelector('.current-voice-pitch');

    if (isCtrlKeyPressed) {
      // Create voiceSettings if it doesn't exist
      if (!voiceSettings) {
        voiceSettings = document.createElement('div');
        voiceSettings.classList.add('voice-settings');
        soundSwitcher.appendChild(voiceSettings);
        assignVoiceSettingsStyles(voiceSettings);
        void voiceSettings.offsetWidth;
        voiceSettings.style.opacity = '1';
      }

      // Remove currentVoicePitch if it exists
      if (currentVoicePitch) {
        currentVoicePitch.remove();
      }

      // Create currentVoiceSpeed if it doesn't exist
      if (!currentVoiceSpeed) {
        currentVoiceSpeed = document.createElement('span');
        currentVoiceSpeed.classList.add('current-voice-speed');
        voiceSettings.appendChild(currentVoiceSpeed);
      }

      // Create progress text info
      let voiceSpeedInfo = voiceSettings.querySelector('.current-voice-speed .voice-value-info');
      if (!voiceSpeedInfo) {
        voiceSpeedInfo = document.createElement('span');
        voiceSpeedInfo.classList.add('voice-value-info');
        voiceSettings.querySelector('.current-voice-speed').appendChild(voiceSpeedInfo);
        voiceSpeedInfo.style.display = 'flex';
        voiceSpeedInfo.style.width = '100%';
        voiceSpeedInfo.style.justifyContent = 'center';
        voiceSpeedInfo.style.marginBottom = '6px';
        voiceSpeedInfo.style.color = 'hsl(100, 50%, 50%)';
      }

      if (voiceSpeedInfo) {
        // Set the text content of voiceSpeed
        if (voiceSpeed <= minVoiceSpeed || voiceSpeed >= maxVoiceSpeed) {
          voiceSpeedInfo.innerHTML = iconRangeisOut;
        } else {
          voiceSpeedInfo.innerHTML = `SPEED ${Number(voiceSpeed).toFixed(1)}`;
        }
      }

      // Create a new progress element if it doesn't exist
      let voiceSpeedProgress = voiceSettings.querySelector('.current-voice-speed .voice-progress');
      if (!voiceSpeedProgress) {
        voiceSpeedProgress = document.createElement('span');
        voiceSpeedProgress.classList.add('voice-progress');
        // Create the progress fill element
        let fill = document.createElement('span');
        fill.classList.add('voice-progress-fill');
        // Append the fill element to the progress element
        voiceSpeedProgress.appendChild(fill);
        // Append the progress element to the voice settings element
        voiceSettings.querySelector('.current-voice-speed').appendChild(voiceSpeedProgress);
      }

      // Update progress fill width based on voice pitch percentage
      voiceSpeedProgress.querySelector('.voice-progress-fill').style.width = getVoiceSettingsPercentage().speed;

      // Apply styles to the progress and fill elements
      const progressStyle = {
        display: 'block',
        width: '120px',
        height: '12px',
        backgroundColor: 'hsl(90, 60%, 30%)'
      };

      const fillStyle = {
        display: 'block',
        height: '100%',
        backgroundColor: 'hsl(90, 60%, 50%)'
      };

      for (let property in progressStyle) {
        voiceSpeedProgress.style[property] = progressStyle[property];
      }

      for (let property in fillStyle) {
        voiceSpeedProgress.querySelector('.voice-progress-fill').style[property] = fillStyle[property];
      }

      // Clear any existing timeout on voiceSettings and set a new one
      if (voiceSettings.timeoutId) {
        clearTimeout(voiceSettings.timeoutId);
      }

      voiceSettings.timeoutId = setTimeout(() => {
        voiceSettings.style.opacity = '0';
        setTimeout(() => {
          voiceSettings.remove();
        }, 500);
      }, 2000);

    } else if (isAltKeyPressed) {
      // Create voiceSettings if it doesn't exist
      if (!voiceSettings) {
        voiceSettings = document.createElement('div');
        voiceSettings.classList.add('voice-settings');
        soundSwitcher.appendChild(voiceSettings);
        assignVoiceSettingsStyles(voiceSettings);
        void voiceSettings.offsetWidth;
        voiceSettings.style.opacity = '1';
      }

      // Remove currentVoiceSpeed if it exists
      if (currentVoiceSpeed) {
        currentVoiceSpeed.remove();
      }

      // Create currentVoicePitch if it doesn't exist
      if (!currentVoicePitch) {
        currentVoicePitch = document.createElement('span');
        currentVoicePitch.classList.add('current-voice-pitch');
        voiceSettings.appendChild(currentVoicePitch);
      }

      // Create progress text info
      let voicePitchInfo = voiceSettings.querySelector('.current-voice-pitch .voice-value-info');
      if (!voicePitchInfo) {
        voicePitchInfo = document.createElement('span');
        voicePitchInfo.classList.add('voice-value-info');
        voiceSettings.querySelector('.current-voice-pitch').appendChild(voicePitchInfo);
        voicePitchInfo.style.display = 'flex';
        voicePitchInfo.style.width = '100%';
        voicePitchInfo.style.justifyContent = 'center';
        voicePitchInfo.style.marginBottom = '6px';
        voicePitchInfo.style.color = 'hsl(180, 60%, 50%)';
      }

      if (voicePitchInfo) {
        // Set the text content of voicePitch
        if (voicePitch <= minVoicePitch || voicePitch >= maxVoicePitch) {
          voicePitchInfo.innerHTML = iconRangeisOut;
        } else {
          voicePitchInfo.innerHTML = `PITCH ${voicePitch.toFixed(1)}`;
        }
      }

      // Create a new progress element if it doesn't exist
      let pitchProgress = voiceSettings.querySelector('.current-voice-pitch .voice-progress');
      if (!pitchProgress) {
        pitchProgress = document.createElement('span');
        pitchProgress.classList.add('voice-progress');
        // Create the progress fill element
        let fill = document.createElement('span');
        fill.classList.add('voice-progress-fill');
        // Append the fill element to the progress element
        pitchProgress.appendChild(fill);
        // Append the progress element to the voice settings element
        voiceSettings.querySelector('.current-voice-pitch').appendChild(pitchProgress);
      }

      // Update progress fill width based on voice pitch percentage
      pitchProgress.querySelector('.voice-progress-fill').style.width = getVoiceSettingsPercentage().pitch;

      // Apply styles to the progress and fill elements
      const progressStyle = {
        display: 'block',
        width: '120px',
        height: '12px',
        backgroundColor: 'hsl(180, 60%, 30%)'
      };

      const fillStyle = {
        display: 'block',
        height: '100%',
        backgroundColor: 'hsl(180, 60%, 50%)'
      };

      for (let property in progressStyle) {
        pitchProgress.style[property] = progressStyle[property];
      }

      for (let property in fillStyle) {
        pitchProgress.querySelector('.voice-progress-fill').style[property] = fillStyle[property];
      }

      // Clear any existing timeout on voiceSettings and set a new one
      if (voiceSettings.timeoutId) {
        clearTimeout(voiceSettings.timeoutId);
      }

      voiceSettings.timeoutId = setTimeout(() => {
        voiceSettings.style.opacity = '0';
        setTimeout(() => {
          voiceSettings.remove();
        }, 500);
      }, 2000);

    } else {
      // If neither Ctrl nor Alt is pressed, remove voiceSettings if it exists
      if (voiceSettings) {
        voiceSettings.remove();
      }
    }
  }

  let holdTimeout = null;
  let holdInterval = null;

  // Replace original click/contextmenu listeners with mousedown
  soundSwitcher.addEventListener('mousedown', handleMouseDown);
  soundSwitcher.addEventListener('contextmenu', (event) => event.preventDefault());

  function handleMouseDown(event) {
    event.preventDefault(); // Prevent context menu on right-click

    const params = getAdjustmentParams(event);
    if (!params) return;

    const { prop, step } = params;
    adjustValue(prop, step); // Initial adjustment

    // Set up delayed repeat
    holdTimeout = setTimeout(() => {
      holdInterval = setInterval(() => {
        const canContinue = adjustValue(prop, step);
        if (!canContinue) clearInterval(holdInterval);
      }, 100);
    }, 500);

    // Cleanup listeners
    const stopHolding = () => {
      clearTimeout(holdTimeout);
      clearInterval(holdInterval);
      soundSwitcher.removeEventListener('mouseup', stopHolding);
      soundSwitcher.removeEventListener('mouseleave', stopHolding);
    };

    soundSwitcher.addEventListener('mouseup', stopHolding);
    soundSwitcher.addEventListener('mouseleave', stopHolding);
  }

  function getAdjustmentParams(event) {
    const isLeft = event.button === 0;
    // const isRight = event.button === 2; // Unused declaration
    const isCtrl = event.ctrlKey || event.metaKey;
    const isAlt = event.altKey;

    if (!isCtrl && !isAlt) return null;

    const prop = isCtrl ? 'voiceSpeed' : 'voicePitch';
    const step = isLeft ? -0.1 : 0.1;

    // Boundary checks
    const current = KG_Chat_Empowerment.voiceSettings[prop];
    const [min, max] = prop === 'voiceSpeed'
      ? [minVoiceSpeed, maxVoiceSpeed]
      : [minVoicePitch, maxVoicePitch];

    if ((step < 0 && current <= min) || (step > 0 && current >= max)) return null;

    return { prop, step };
  }

  function adjustValue(prop, step) {
    const current = parseFloat(KG_Chat_Empowerment.voiceSettings[prop]);
    const [min, max] = prop === 'voiceSpeed'
      ? [minVoiceSpeed, maxVoiceSpeed]
      : [minVoicePitch, maxVoicePitch];

    const newValue = current + step;
    const clamped = Math.min(max, Math.max(min, newValue));

    if (current === clamped) return false; // No change

    updateVoiceSetting(prop, clamped);
    return (step > 0 ? clamped < max : clamped > min);
  }

  // Function to update the voice setting, round the value, and update storage
  function updateVoiceSetting(prop, value) {
    // Round the value to one decimal place
    const roundedValue = parseFloat(value.toFixed(1));
    // Update the voice setting in the application state
    KG_Chat_Empowerment.voiceSettings[prop] = roundedValue;
    // Update voiceSpeed and voicePitch variables
    if (prop === 'voiceSpeed') {
      voiceSpeed = roundedValue;
    } else if (prop === 'voicePitch') {
      voicePitch = roundedValue;
    }
    // Store the updated state in localStorage
    localStorage.setItem('KG_Chat_Empowerment', JSON.stringify(KG_Chat_Empowerment));
    // Show the updated voice settings
    showVoiceSettings();
  }

  // CREATE SOUND SWITCHER BUTTON (END)


  // CREATE MESSAGE MODE BUTTON (START)

  function createMessageModeButton() {
    // Create a new element with class 'message-mode-button' and id 'every-messages'
    messageMode = document.createElement('div');
    // Retrieve the value from KG_Chat_Empowerment.messageSettings.messageModeState
    const messageModeState = KG_Chat_Empowerment.messageSettings.messageModeState || 'every-message';
    // Add the class 'message-mode-button' to the 'messagesMode' element
    messageMode.classList.add('message-mode-button');
    // Initial button id if the localStorage key isn't created with assigned value by user
    messageMode.id = messageModeState;

    // Apply base button styles
    applyBaseButtonStyles(messageMode);

    // Retrieve the value from KG_Chat_Empowerment.messageSettings.messageModeTitle
    const messageModeTitle = KG_Chat_Empowerment.messageSettings.messageModeTitle || 'Notify about every message';
    // Assign title for the current notification state
    messageMode.title = messageModeTitle;

    // Create message mode button icon container
    messageModeIcon = document.createElement('span');
    // Add class to icon container
    messageModeIcon.classList.add('message-mode-icon');

    // Append icon container inside message mode button
    messageMode.appendChild(messageModeIcon);
    // Append sound switcher button to chat buttons panel
    empowermentButtonsPanel.appendChild(messageMode);
  } createMessageModeButton();

  // Add the isAltKeyPressed condition to the messagesMode event listener
  messageMode.addEventListener('click', function (event) {
    // Only execute when isCtrlKeyPressed or isAltKeyPressed are false
    if (!isCtrlKeyPressed || !isAltKeyPressed) {

      // Add pulse effect for messageMode
      addPulseEffect(this);

      switch (this.id) {
        case 'every-message':
          this.id = 'mention-message';
          this.title = 'Notify about mention message';
          KG_Chat_Empowerment.messageSettings.messageModeState = 'mention-message';
          KG_Chat_Empowerment.messageSettings.messageModeTitle = 'Notify about mention message';
          break;
        case 'mention-message':
          this.id = 'every-message';
          this.title = 'Notify about every message';
          KG_Chat_Empowerment.messageSettings.messageModeState = 'every-message';
          KG_Chat_Empowerment.messageSettings.messageModeTitle = 'Notify about every message';
          break;
      }

      // Stringify KG_Chat_Empowerment before updating in localStorage
      localStorage.setItem('KG_Chat_Empowerment', JSON.stringify(KG_Chat_Empowerment));

      updateMessageModeIcon();
    }
  });

  function updateMessageModeIcon() {
    switch (messageMode.id) {
      case 'every-message':
        messageModeIcon.innerHTML = iconModeEvery;
        break;
      case 'mention-message':
        messageModeIcon.innerHTML = modeMentionSVG;
        break;
    }
  } updateMessageModeIcon();

  // CREATE MESSAGE MODE BUTTON (END)


  // CREATE USER LIST CACHE BUTTON (START)

  // Function to create the button for showCachePanel
  function createShowUserListCacheButton() {
    // Create a new element with class 'cache-panel-load-button'
    const showUserListCacheButton = document.createElement('div');

    // Add the class 'cache-panel-load-button' to the button
    showUserListCacheButton.classList.add('cache-panel-load-button');

    // Apply base button styles
    applyBaseButtonStyles(showUserListCacheButton);

    // Add cache-specific styles directly
    showUserListCacheButton.style.position = 'relative';
    showUserListCacheButton.style.zIndex = '3';

    // Add data base icon to the button
    showUserListCacheButton.innerHTML = userlistCacheSVG;

    // Create the small indicator for user count
    const cacheUserCount = document.createElement('div');
    cacheUserCount.classList.add('cache-user-count');
    cacheUserCount.style.display = 'flex';
    cacheUserCount.style.position = 'absolute';
    cacheUserCount.style.justifyContent = 'center';
    cacheUserCount.style.alignItems = 'center';
    cacheUserCount.style.left = '0';
    cacheUserCount.style.bottom = '0';
    cacheUserCount.style.transform = 'translate(-50%, 50%)';
    cacheUserCount.style.zIndex = '1';
    cacheUserCount.style.height = '20px';
    cacheUserCount.style.padding = '0 4px';
    cacheUserCount.style.setProperty('border-radius', '2px', 'important');
    cacheUserCount.style.backgroundColor = '#9db380';
    cacheUserCount.style.color = 'rgb(2, 2, 2)';
    cacheUserCount.style.fontSize = '12px';
    cacheUserCount.style.fontFamily = 'Roboto';
    cacheUserCount.style.fontWeight = 'bold';

    // Initially set the count based on localStorage
    const fetchedUsers = JSON.parse(localStorage.getItem('fetchedUsers')) || {};
    const cacheUserCountValue = Object.keys(fetchedUsers).length;
    cacheUserCount.textContent = cacheUserCountValue;

    showUserListCacheButton.appendChild(cacheUserCount);

    // Assign a title to the button
    showUserListCacheButton.title = 'Show Cache Panel';

    // Add a click event listener to the button
    showUserListCacheButton.addEventListener('click', function () {

      // Add pulse effect for cacheButton
      addPulseEffect(showUserListCacheButton);

      // Call showCachePanel function to show the cache panel
      showCachePanel();
    });

    // Append the button to the existing panel
    empowermentButtonsPanel.appendChild(showUserListCacheButton);
  } createShowUserListCacheButton();

  // Function to update the user count displayed near the cache button based on localStorage
  function updateUserCountText() {
    const userCountElement = document.querySelector('.cache-panel-load-button .cache-user-count');
    if (!userCountElement) return; // Ensure the element exists

    const newUserCount = Object.keys(JSON.parse(localStorage.getItem('fetchedUsers')) || {}).length.toString();

    // Update the text content and add pulse effect if the count has changed
    if (newUserCount !== userCountElement.textContent) {
      userCountElement.textContent = newUserCount;
      addPulseEffect(userCountElement);
    }
  }

  // CREATE USER LIST CACHE BUTTON (END)


  // CREATE PERSONAL MESSAGES BUTTON (START)

  // Function to create the button for opening personal messages
  function createPersonalMessagesButton() {
    // Create a new element with class 'personal-messages-button'
    const showPersonalMessagesButton = document.createElement('div');
    showPersonalMessagesButton.classList.add('personal-messages-button');

    // Apply base button styles
    applyBaseButtonStyles(showPersonalMessagesButton);

    // Add personal messages-specific styles
    showPersonalMessagesButton.style.position = 'relative';
    showPersonalMessagesButton.style.zIndex = '2';
    showPersonalMessagesButton.innerHTML = personalMessagesSVG; // Add icon

    // Create the small indicator for all message count
    const allMessageIndicator = createMessageCountIndicator('total-message-count', '#fa8072');
    const personalMessages = JSON.parse(localStorage.getItem('personalMessages')) || {};
    allMessageIndicator.textContent = Object.keys(personalMessages).length;

    // Position the all message count to the left
    allMessageIndicator.style.left = '0';
    allMessageIndicator.style.transform = 'translate(-50%, 50%)';
    showPersonalMessagesButton.appendChild(allMessageIndicator);

    // Create the small indicator for new message count
    const newMessageIndicator = createMessageCountIndicator('new-message-count', '#ffd700');

    // Get the new messages count from localStorage or set to 0 if not present
    let newMessagesCount = Number(localStorage.getItem('newMessagesCount')) || (localStorage.setItem('newMessagesCount', '0'), 0);

    newMessageIndicator.textContent = newMessagesCount;

    // Check the newMessagesCount value and set visibility
    newMessageIndicator.style.visibility = newMessagesCount > 0 ? 'visible' : 'hidden'; // Set visibility based on count

    // Position the new message count to the right
    newMessageIndicator.style.right = '0';
    newMessageIndicator.style.transform = 'translate(50%, 50%)';
    showPersonalMessagesButton.appendChild(newMessageIndicator);

    // Assign a title to the button
    showPersonalMessagesButton.title = 'Show Personal Messages';

    // Add a click event listener to the button
    showPersonalMessagesButton.addEventListener('click', function () {
      addPulseEffect(showPersonalMessagesButton); // Add pulse effect
      showPersonalMessagesPanel(); // Show the personal messages panel
      const personalMessagesCount = Object.keys(JSON.parse(localStorage.getItem('personalMessages')) || {}).length;
      // Open the personal messages panel only when there are messages present.
      if (personalMessagesCount > 0) {
        // Reset newMessagesCount in localStorage to 0 when opening the panel
        localStorage.setItem('newMessagesCount', '0');
        newMessagesCount = 0; // Reset the local variable
        newMessageIndicator.textContent = newMessagesCount; // Update the displayed count
      }
    });

    // Append the button to the existing panel
    empowermentButtonsPanel.appendChild(showPersonalMessagesButton);
  }

  // Helper function to create a message count indicator
  function createMessageCountIndicator(className, backgroundColor) {
    const messageCount = document.createElement('div');
    messageCount.classList.add(className);
    messageCount.style.display = 'flex';
    messageCount.style.position = 'absolute';
    messageCount.style.justifyContent = 'center';
    messageCount.style.alignItems = 'center';
    messageCount.style.height = '20px'; // Fixed height for all indicators
    messageCount.style.padding = '0 4px';
    messageCount.style.setProperty('border-radius', '2px', 'important');
    messageCount.style.backgroundColor = backgroundColor;
    messageCount.style.color = 'rgb(2, 2, 2)';
    messageCount.style.fontSize = '12px';
    messageCount.style.fontFamily = 'Roboto';
    messageCount.style.fontWeight = 'bold';
    messageCount.style.bottom = '0'; // Common bottom positioning for both indicators
    return messageCount;
  }

  // Call the function to create the button
  createPersonalMessagesButton();

  // Find chat message by time in range and matching username
  async function findGeneralChatMessage(targetTime, targetUsername, allowScroll) {
    const parent = document.querySelector('.messages-content'); // Chat container
    if (!parent) return null; // Return null if the container isn't found

    // Convert time string "[HH:MM:SS]" to total seconds
    const timeStringToSeconds = (str) =>
      str.replace(/[\[\]]/g, '').split(':').reduce((acc, time, i) =>
        acc + Number(time) * (60 ** (2 - i)), 0
      );

    const initialTimeValue = timeStringToSeconds(targetTime); // Target time in seconds

    // Helper to find <p> elements by matching time and username
    const findMatchingElement = (condition) =>
      Array.from(parent.querySelectorAll('p')).find((p) => {
        const timeElement = p.querySelector('.time'); // Get the child element with class 'time'
        const usernameElement = p.querySelector('.username span[data-user]'); // Get the username element

        if (timeElement && usernameElement) {
          const currentTimeValue = timeStringToSeconds(timeElement.textContent.trim());
          const usernameText = usernameElement.textContent.trim(); // Extract the text content of the username

          // Check if the time and username match the conditions
          return condition(currentTimeValue) && usernameText === targetUsername;
        }
        return false;
      });

    // 1. Try to find an exact match first
    let foundElement = findMatchingElement(
      (currentTimeValue) => currentTimeValue === initialTimeValue
    );

    // 2. If no exact match, search within ±10 seconds
    if (!foundElement) {
      foundElement = findMatchingElement(
        (currentTimeValue) => Math.abs(currentTimeValue - initialTimeValue) <= 2
      );
    }

    if (foundElement && allowScroll) {
      await scrollMessagesToMiddle(parent, foundElement); // Call the extracted scrolling function
    }

    return foundElement || false; // Return found element or false if not found
  }

  // Find chat logs message by time in range and matching username
  async function findChatLogsMessage(targetTime, targetUsername, allowScroll) {
    const parent = document.querySelector('.chat-logs-container'); // Logs container
    if (!parent) return null; // Return null if the container isn't found

    // Convert time string "[HH:MM:SS]" to total seconds
    const timeStringToSeconds = (str) =>
      str.replace(/[\[\]]/g, '').split(':').reduce((acc, time, i) =>
        acc + Number(time) * (60 ** (2 - i)), 0
      );

    const initialTimeValue = timeStringToSeconds(targetTime); // Target time in seconds

    // Helper to find .message-item elements by matching time and username
    const findMatchingElement = (condition) =>
      Array.from(parent.querySelectorAll('.message-item')).find((messageItem) => {
        const timeElement = messageItem.querySelector('.message-time'); // Get the child element with class 'message-time'
        const usernameElement = messageItem.querySelector('.message-username'); // Get the username element

        if (timeElement && usernameElement) {
          const currentTimeValue = timeStringToSeconds(timeElement.textContent.trim());
          const usernameText = usernameElement.textContent.trim(); // Extract the text content of the username

          // Check if the time and username match the conditions
          return condition(currentTimeValue) && usernameText === targetUsername;
        }
        return false;
      });

    // 1. Try to find an exact match first
    let foundElement = findMatchingElement(
      (currentTimeValue) => currentTimeValue === initialTimeValue
    );

    // 2. If no exact match, search within ±10 seconds
    if (!foundElement) {
      foundElement = findMatchingElement(
        (currentTimeValue) => Math.abs(currentTimeValue - initialTimeValue) <= 2
      );
    }

    if (foundElement && allowScroll) {
      await scrollMessagesToMiddle(parent, foundElement); // Call the extracted scrolling function
    }

    return foundElement || false; // Return found element or false if not found
  }

  /**
   * Converts a given local time to Moscow time (UTC+3) based on the system's timezone.
   *
   * How it works:
   * 1. Gets the system's local timezone offset in minutes (positive if behind UTC).
   * 2. Converts the local offset to total minutes from UTC.
   * 3. Defines Moscow's fixed offset as UTC+3 (180 minutes).
   * 4. Calculates the difference between Moscow's offset and the local offset.
   * 5. Parses the input time and converts it into total minutes since midnight.
   * 6. Adjusts the time by the calculated difference.
   * 7. Ensures the result stays within the 24-hour format (wrap-around handling).
   * 8. Converts the result back to HH:MM:SS format and returns it.
   *
   * @param {string} time - The local time in "HH:MM:SS" format.
   * @returns {string} - The converted time in Moscow time (HH:MM:SS).
   */
  function calibrateToMoscowTime(time) {
    // Get local timezone offset in minutes (positive if local is behind UTC)
    const localOffsetMinutes = new Date().getTimezoneOffset();

    // Convert local offset to total minutes from UTC (local time = UTC + localTotalOffset)
    const localTotalOffset = -localOffsetMinutes;

    // Moscow is UTC+3 (180 minutes)
    const moscowOffset = 3 * 60; // 180 minutes

    // Calculate the adjustment needed: Moscow offset - local offset
    const diffMinutes = moscowOffset - localTotalOffset;

    // Parse input time
    const [hours, minutes, seconds] = time.split(':').map(Number);

    // Convert input time to total minutes since 00:00
    const totalInputMinutes = hours * 60 + minutes;

    // Adjust by diff and wrap within a single day (1440 minutes)
    let adjustedMinutes = totalInputMinutes + diffMinutes;
    adjustedMinutes = ((adjustedMinutes % 1440) + 1440) % 1440; // Ensure positive

    // Convert back to hours and minutes
    const adjustedHours = Math.floor(adjustedMinutes / 60);
    const adjustedMins = adjustedMinutes % 60;

    // Format the result with original seconds
    return `${adjustedHours.toString().padStart(2, '0')}:` +
      `${adjustedMins.toString().padStart(2, '0')}:` +
      `${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Removes messages from the DOM and updates localStorage based on the removal type.
   * @param {HTMLElement} messageElement - The message element to remove.
   * @param {string} removalType - The type of removal: 'single', 'all', or 'from'.
   */
  function removeMessage(messageElement, removalType = 'single') {
    // Extract time and username from the message element
    const time = messageElement.querySelector('.message-time').textContent;
    const username = messageElement.querySelector('.message-username').textContent;

    // Retrieve localStorage personalMessagesBackup data
    let backupData = JSON.parse(localStorage.getItem('personalMessagesBackup')) || {};

    // If backup data does not exist, create it by copying original data from personalMessages
    if (Object.keys(backupData).length === 0) {
      const originalData = JSON.parse(localStorage.getItem('personalMessages')) || {};
      backupData = { ...originalData }; // Make a copy of the original data
      localStorage.setItem('personalMessagesBackup', JSON.stringify(backupData)); // Save backupData to localStorage
    }

    // Work with backupData (make a copy to modify)
    let modifiedBackupData = { ...backupData };

    if (removalType === 'all') {
      // Remove all messages from the same user
      document.querySelectorAll('.message-item').forEach((element) => {
        const elementUsername = element.querySelector('.message-username').textContent;
        if (elementUsername === username) {
          element.remove(); // Remove the DOM element

          // Remove the corresponding entry from backupData
          const elementTime = element.querySelector('.message-time').textContent;
          const messageKey = `[${elementTime}]_${elementUsername}`;
          delete modifiedBackupData[messageKey];
        }
      });
    } else if (removalType === 'from') {
      // Get all message elements
      const messageElements = Array.from(document.querySelectorAll('.message-item'));

      // Find the index of the current message element
      const currentIndex = messageElements.indexOf(messageElement);

      // Iterate through messages starting from the current message till the end
      for (let i = currentIndex; i < messageElements.length; i++) {
        const element = messageElements[i];
        const elementUsername = element.querySelector('.message-username').textContent;

        if (elementUsername === username) {
          // Remove the DOM element
          element.remove();

          // Remove the corresponding entry from backupData
          const elementTime = element.querySelector('.message-time').textContent;
          const messageKey = `[${elementTime}]_${elementUsername}`;
          delete modifiedBackupData[messageKey];
        }
      }
    } else {
      // Default: Remove only the specific message (single)
      const messageKey = `[${time}]_${username}`;
      if (modifiedBackupData[messageKey]) {
        delete modifiedBackupData[messageKey]; // Remove from backupData
        messageElement.remove(); // Remove the DOM element
      }
    }

    // Update localStorage with the modified backupData
    localStorage.setItem('personalMessagesBackup', JSON.stringify(modifiedBackupData));

    // Update the total message count displayed in the personal messages button
    const messagesCountElement = document.querySelector('.personal-messages-button .total-message-count');
    if (messagesCountElement) {
      messagesCountElement.textContent = Object.keys(modifiedBackupData).length;
    }
  }

  // Update the message count displayed in the personal messages button
  function updateMessageCount() {
    const personalMessagesCount = Object.keys(JSON.parse(localStorage.getItem('personalMessages') || '{}')).length;
    const messagesCountElement = document.querySelector('.personal-messages-button .total-message-count');
    messagesCountElement.textContent = personalMessagesCount;
  }

  // Function to display the personal messages panel
  async function showPersonalMessagesPanel() {
    // Check if the panel already exists
    const existingPanel = document.querySelector('.cached-messages-panel');
    if (existingPanel) {
      existingPanel.remove(); // Remove the settings panel
      triggerDimmingElement('hide');
      return; // Return immediately to prevent further execution
    }

    // Flag to track if this is the first time the panel is being run
    let isFirstPanelRun = true;
    // Flag to track if messages are being imported
    let isMessagesImport = false;
    // Update the message count after panel load to reset the value if messages were not saved
    updateMessageCount();
    // Remove 'personalMessagesBackup' from localStorage if it exists
    if (localStorage.getItem('personalMessagesBackup')) localStorage.removeItem('personalMessagesBackup');
    // Remove any previous panel before creating a new one
    removePreviousPanel();

    // Reset the new messages indicator to 0
    const newMessagesCountElement = document.querySelector('.personal-messages-button .new-message-count');
    if (newMessagesCountElement) newMessagesCountElement.textContent = '0';
    newMessagesCountElement.style.visibility = 'hidden';
    // Remove the localStorage key for new personal messages after opening the messages panel (always)
    localStorage.removeItem('newMessagesCount');

    // Function to get messages from localStorage
    function getMessages() {
      const cachedMessagesData = localStorage.getItem('personalMessages');
      // Initialize messages by parsing fetched data or setting as empty object
      return JSON.parse(cachedMessagesData) || {};
    }

    let messages = getMessages();

    // Create a container div with class 'cached-messages-panel'
    const cachedMessagesPanel = document.createElement('div');
    cachedMessagesPanel.className = 'cached-messages-panel popup-panel';
    // Set initial styles
    cachedMessagesPanel.style.opacity = '0';
    cachedMessagesPanel.style.backgroundColor = '#1b1b1b';
    cachedMessagesPanel.style.setProperty('border-radius', '0.6em', 'important');
    cachedMessagesPanel.style.position = 'fixed';
    cachedMessagesPanel.style.top = '100px';
    cachedMessagesPanel.style.left = '50%';
    cachedMessagesPanel.style.transform = 'translateX(-50%)';
    cachedMessagesPanel.style.width = '50vw';
    cachedMessagesPanel.style.height = '80vh';
    cachedMessagesPanel.style.zIndex = '999';
    cachedMessagesPanel.style.minWidth = '1000px';
    cachedMessagesPanel.style.display = 'grid';
    cachedMessagesPanel.style.gridTemplateColumns = '1fr';
    cachedMessagesPanel.style.gridTemplateRows = 'min-content';
    cachedMessagesPanel.style.gridTemplateAreas = `
      "header header"
      "messages scroll"`;

    // Create a container div for the panel header
    const panelHeaderContainer = document.createElement('div');
    panelHeaderContainer.className = 'panel-header';
    panelHeaderContainer.style.display = 'flex';
    panelHeaderContainer.style.flexDirection = 'row';
    panelHeaderContainer.style.justifyContent = 'flex-end'; // Aligns to the right
    panelHeaderContainer.style.padding = '0.6em';
    panelHeaderContainer.style.gridArea = 'header';

    // Create the search input container and append it to the panel header
    const messagesSearchContainer = document.createElement('div');
    messagesSearchContainer.className = 'search-for-personal-messages';
    messagesSearchContainer.style.width = '100%';
    messagesSearchContainer.style.margin = '0 0.5em 0 0';
    messagesSearchContainer.style.display = 'flex';

    // Create the input field for searching personal messages
    const messagesSearchInput = document.createElement('input');
    messagesSearchInput.className = 'personal-messages-search-input';
    messagesSearchInput.type = 'text';
    messagesSearchInput.style.outline = 'none';
    messagesSearchInput.style.width = '100%';
    messagesSearchInput.style.padding = '10px';
    messagesSearchInput.style.fontSize = '1em';
    messagesSearchInput.style.fontFamily = 'Montserrat';
    messagesSearchInput.style.color = 'bisque';
    messagesSearchInput.style.setProperty('border-radius', '0.2em', 'important');
    messagesSearchInput.style.boxSizing = 'border-box';
    messagesSearchInput.style.backgroundColor = '#111';
    messagesSearchInput.style.border = '1px solid #222';

    // Append the search input to the search container
    messagesSearchContainer.appendChild(messagesSearchInput);

    // Create a container div with class 'panel-control-buttons'
    const panelControlButtons = document.createElement('div');
    panelControlButtons.className = 'panel-control-buttons';
    panelControlButtons.style.display = 'flex';

    // Helper function to apply common styles to a button
    function applyHeaderButtonStyles(button, backgroundColor, margin = '0 0.5em', display = 'flex') {
      button.style.backgroundColor = backgroundColor;
      button.style.width = '48px';
      button.style.height = '48px';
      button.style.display = display;
      button.style.justifyContent = 'center';
      button.style.alignItems = 'center';
      button.style.cursor = 'pointer';
      button.style.setProperty('border-radius', '0.2em', 'important');
      button.style.margin = margin; // Set margin using the provided value
      button.style.filter = 'brightness(1)';
      button.style.transition = 'filter 0.3s ease, opacity 0.3s ease';
    }

    // Create a save button with the provided SVG icon
    const saveMessagesButton = document.createElement('div');
    saveMessagesButton.className = 'save-messages-button';
    saveMessagesButton.innerHTML = saveSVG;
    saveMessagesButton.title = 'Save messages';
    saveMessagesButton.style.opacity = '0';

    // Apply common styles using the helper function
    applyHeaderButtonStyles(saveMessagesButton, '#2f6b63', '0 0.5em', 'none');

    // Handle the save button click to restore the backup
    saveMessagesButton.addEventListener('click', () => {
      // Retrieve the backup and original data from localStorage
      const backupData = localStorage.getItem('personalMessagesBackup');
      const originalData = localStorage.getItem('personalMessages');

      // Check if both backup and original data exist and if they are different
      const bothDataExist = backupData && originalData;
      const hasDataChanged = bothDataExist && originalData !== backupData;

      // If no backup or original data exists, do nothing
      if (!bothDataExist) return;

      // Ask user for confirmation if data has changed and it's not the first run
      if (hasDataChanged && !isFirstPanelRun) {
        const userConfirmed = window.confirm("Do you want to apply changes?");

        // If user confirms, restore the backup data
        if (userConfirmed) {
          localStorage.setItem('personalMessages', backupData);
          localStorage.removeItem('personalMessagesBackup');
          saveMessagesButton.style.setProperty('display', 'none', 'important');
          saveMessagesButton.style.opacity = '0'; // Hide the save button after saving
          // Wait for the opacity transition to finish before hiding the element
          saveMessagesButton.addEventListener('transitionend', function () {
            // After the transition, hide the button by setting display to 'none'
            saveMessagesButton.style.display = 'none'; // Now you can safely hide the element
          });
        }
      }
    });

    // Create an import button for messages with the provided SVG icon
    const importMessagesButton = document.createElement('div');
    importMessagesButton.className = 'import-messages-button';
    importMessagesButton.innerHTML = importSVG;
    importMessagesButton.title = 'Import messages';

    // Apply common styles using the helper function
    applyHeaderButtonStyles(importMessagesButton, '#502f6b');

    importMessagesButton.addEventListener('click', () => {
      isMessagesImport = true;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const importedMessages = JSON.parse(reader.result);
              const existingMessages = JSON.parse(localStorage.getItem('personalMessages') || '{}');

              // Merge existing and imported messages, ensuring no duplicates by date key
              const mergedMessages = {
                ...existingMessages,
                ...importedMessages
              };

              // Sort the merged messages with cleaned time for sorting but without modifying the original time
              const cleanedMergedMessages = Object.fromEntries(
                Object.entries(mergedMessages)
                  .sort(([, valueA], [, valueB]) => {
                    // Temporarily clean the time for sorting purposes (no change to original time)
                    const cleanedTimeA = valueA.time.replace(/[[\]]/g, '');
                    const cleanedTimeB = valueB.time.replace(/[[\]]/g, '');

                    // Combine date and cleaned time for comparison
                    const dateTimeA = `${valueA.date} ${cleanedTimeA}`;
                    const dateTimeB = `${valueB.date} ${cleanedTimeB}`;

                    // Convert to Date objects for sorting
                    return new Date(dateTimeA) - new Date(dateTimeB);
                  })
              );

              // Store the merged messages back in localStorage (time remains unchanged with square brackets)
              localStorage.setItem('personalMessages', JSON.stringify(cleanedMergedMessages));

              updateMessageCount(); // Update the message count after import

              // Load imported messages
              const messages = getMessages();
              await loadMessages(messages);
            } catch (error) {
              alert('Failed to import messages. The file may be corrupted.');
            }
          };
          reader.readAsText(file);
        }
      });

      input.click();
    });

    // Create an export button for messages with the provided SVG icon
    const exportMessagesButton = document.createElement('div');
    exportMessagesButton.className = 'export-messages-button';
    exportMessagesButton.innerHTML = exportSVG;
    exportMessagesButton.title = 'Export messages';

    // Apply common styles using the helper function
    applyHeaderButtonStyles(exportMessagesButton, '#2f4c6b');

    // Add event listener for exporting messages
    exportMessagesButton.addEventListener('click', () => {
      const messages = localStorage.getItem('personalMessages');
      if (messages && messages !== '{}') {
        const currentDate = new Intl.DateTimeFormat('en-CA').format(new Date()); // Get the current date in YYYY-MM-DD format

        // Parse the JSON string to an object for formatting
        const messagesObject = JSON.parse(messages);

        // Convert the object back to a formatted JSON string with indentation
        const formattedMessages = JSON.stringify(messagesObject, null, 2); // Indented JSON

        const blob = new Blob([formattedMessages], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Personal_Messages_${currentDate}.json`; // Use currentDate for file name
        link.click();
      } else {
        alert('No messages to export.');
      }
    });

    // Create a copy personal messages button element
    const copyPersonalMessagesButton = document.createElement('div');
    copyPersonalMessagesButton.className = 'copy-personal-messages-button';
    // Set the inner HTML of the copy personal messages button element with the clipboard SVG
    copyPersonalMessagesButton.innerHTML = clipboardSVG;
    copyPersonalMessagesButton.title = 'Copy Personal Messages';
    // Apply common styles to the button element
    applyHeaderButtonStyles(copyPersonalMessagesButton, 'steelblue');

    // Event listener to copy the text content of the messages container
    copyPersonalMessagesButton.addEventListener('click', () => {
      addJumpEffect(copyPersonalMessagesButton, 0, 0);
      const textContent = Array.from(document.querySelector('.messages-container').children)
        .filter(node => {
          const style = window.getComputedStyle(node);
          // Ignore hidden messages with contentVisibility 'hidden' or display 'none'
          return style.contentVisibility !== 'hidden' && style.display !== 'none';
        })
        .map(node => node.classList.contains('date-item') ? node.textContent.trim() :
          [node.querySelector('.message-time'), node.querySelector('.message-username'), node.querySelector('.message-text')]
            .map(el => el?.textContent.trim()).filter(Boolean).join(' '))
        .filter(Boolean).join(' \n');

      // Check if there's content to copy
      if (textContent.trim()) {
        navigator.clipboard.writeText(textContent)
          .then(() => addJumpEffect(copyPersonalMessagesButton, 0, 0))
          .catch(console.error);
      } else {
        alert('No messages to copy.');
      }
    });

    // Create a clear cache button with the provided SVG icon
    const clearCacheButton = document.createElement('div');
    clearCacheButton.className = 'clear-cache-button';
    clearCacheButton.title = 'Clear personal messages';
    clearCacheButton.innerHTML = trashSVG;
    applyHeaderButtonStyles(clearCacheButton, 'brown');

    // Add a click event listener to the clear cache button
    clearCacheButton.addEventListener('click', () => {
      // Set the flag to true when clear messages is initiated
      isMessagesImport = true;
      // Check if there are any messages before attempting to clear
      const messages = JSON.parse(localStorage.getItem('personalMessages') || '{}');
      if (Object.keys(messages).length === 0) {
        alert('No messages to delete.');
        return; // Exit the function if no messages exist
      }
      // Clear the messages container
      messagesContainer.innerHTML = null;

      // Set the 'personalMessages' key in localStorage to an empty object
      localStorage.setItem('personalMessages', JSON.stringify({}));

      // Fade out the cached messages panel when the clear cache button is clicked
      triggerTargetElement(cachedMessagesPanel, 'hide');
      triggerDimmingElement('hide');

      // Update the message count displayed in the personal messages button
      const messagesCountElement = document.querySelector('.personal-messages-button .total-message-count');
      if (messagesCountElement) messagesCountElement.textContent = '0';
    });

    // Create a close button with the provided SVG icon
    const closePanelButton = document.createElement('div');
    closePanelButton.className = 'close-panel-button';
    closePanelButton.title = 'Close panel';
    closePanelButton.innerHTML = closeSVG;
    applyHeaderButtonStyles(closePanelButton, 'darkolivegreen', '0 0 0 0.5em');

    // Add a click event listener to the close panel button
    closePanelButton.addEventListener('click', () => {
      // Fade out the cached messages panel when the close button is clicked
      triggerTargetElement(cachedMessagesPanel, 'hide');
      triggerDimmingElement('hide');
    });

    // Append the search container to the panel header container
    panelHeaderContainer.appendChild(messagesSearchContainer);

    // Append buttons to the panel header container
    panelControlButtons.appendChild(saveMessagesButton);
    panelControlButtons.appendChild(importMessagesButton);
    panelControlButtons.appendChild(exportMessagesButton);
    panelControlButtons.appendChild(copyPersonalMessagesButton);
    panelControlButtons.appendChild(clearCacheButton);
    panelControlButtons.appendChild(closePanelButton);

    // Append the panel control buttons element inside the panel header container
    panelHeaderContainer.appendChild(panelControlButtons);

    // Append the header to the cached messages panel
    cachedMessagesPanel.appendChild(panelHeaderContainer);

    // Create a container for the messages
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'messages-container';
    messagesContainer.style.overflowY = 'auto';
    messagesContainer.style.height = 'calc(100% - 0.5em)';
    messagesContainer.style.padding = '1em';
    messagesContainer.style.gridArea = 'messages';

    function attachMutationObserver() {
      // Set up MutationObserver to monitor removal of child elements
      const observer = new MutationObserver(mutationsList => {
        // Skip the observer actions if messages are being imported
        if (isMessagesImport) return;

        // Check if any node was removed from the messages container
        const removedNode = mutationsList.find(mutation => mutation.type === 'childList' && mutation.removedNodes.length > 0);

        if (removedNode && saveMessagesButton.style.opacity === '0') {
          isFirstPanelRun = false;
          // If an element node was removed and save button is hidden, show it
          saveMessagesButton.style.display = 'flex'; // Ensure the button is part of the layout
          saveMessagesButton.offsetHeight; // This ensures that the styles are applied before starting the transition
          saveMessagesButton.style.opacity = '1';
        }
      });

      // Configure the observer to watch for child node removals
      observer.observe(messagesContainer, {
        childList: true, // Watch for changes to the children
        subtree: true // Also monitor all descendants of the messagesContainer
      });
    }

    let lastUsername = null; // Store the last username processed
    let pingCheckCounter = 0; // Initialize a counter
    let maxPingChecks = 100; // Set the limit to 100
    let pingMessages = false; // Initialize pingMessages as false
    let lastDate = null; // Store the last processed date

    // Create an array to store message elements for later appending
    const messageElements = [];

    // Define messageColors and timeColors inside the loop
    const timeColors = {
      private: 'coral',
      mention: 'darkseagreen'
    };

    const messageColors = {
      private: 'coral',
      mention: 'lightsteelblue',
      default: 'slategray' // Default color if type is not private or mention
    };

    // Load messages on initial panel open
    async function loadMessages(messages) {
      messagesContainer.children.length && messagesContainer.replaceChildren();
      // Loop through the messages and create elements
      Object.entries(messages).forEach(([, { time, date, username, usernameColor, message, type, userId }]) => {
        // If the current date is different from the last processed one, create a new date-item
        if (lastDate !== date) {
          const dateItem = document.createElement('div');
          dateItem.className = 'date-item';
          // show "Today" if date matches
          dateItem.textContent = date === today ? 'Today ⏳' : `${date} 📅`;
          dateItem.dataset.date = date; // Store the date in a data attribute
          dateItem.style.position = 'relative';
          dateItem.style.font = '1em Montserrat';
          dateItem.style.color = 'burlywood';
          dateItem.style.backgroundColor = 'rgba(222, 184, 135, 0.1)';
          dateItem.style.width = 'fit-content';
          dateItem.style.margin = '2em 1em 1em';
          dateItem.style.padding = '0.4em 0.8em';
          dateItem.style.textAlign = 'center';
          dateItem.style.setProperty('border-radius', '0.4em', 'important');
          dateItem.style.left = '50%';
          dateItem.style.transform = 'translateX(-50%)';

          messagesContainer.appendChild(dateItem); // Append the date-item to the container
          lastDate = date; // Update the last processed date
        }

        // Create a message-item for the current message
        const messageElement = document.createElement('div');
        messageElement.className = 'message-item';
        messageElement.style.padding = '0.2em';

        // Add margin-top if this is the first message of a new username group
        if (username !== lastUsername) {
          messageElement.style.marginTop = '0.6em';
          lastUsername = username; // Update the lastUsername
        }

        // Remove square brackets from the time string
        const formattedTime = time.replace(/[\[\]]/g, '').trim();

        // Create time, username, and message elements
        const timeElement = document.createElement('span');
        timeElement.className = 'message-time';
        timeElement.textContent = formattedTime;
        timeElement.title = `Moscow Time: ${calibrateToMoscowTime(formattedTime)}`;
        timeElement.style.margin = '0px 0.4em';
        timeElement.style.height = 'fit-content';
        timeElement.style.cursor = 'pointer';
        timeElement.style.transition = 'color 0.2s ease';
        timeElement.style.color = timeColors[type] || 'slategray';

        // Add click event listener for "mention" and "private" types
        if (type === 'mention' || type === 'private') {
          const hoverColor = type === 'mention' ? 'lightgreen' : 'peachpuff';
          timeElement.addEventListener('mouseover', () => { timeElement.style.color = hoverColor; });
          timeElement.addEventListener('mouseout', () => { timeElement.style.color = timeColors[type]; });
          timeElement.addEventListener('click', (event) => {
            if (event.ctrlKey) {
              removeMessage(messageElement, 'from');
              return; // Exit the function to prevent opening the chatlog
            }
            if (type === 'mention') {
              const url = `https://klavogonki.ru/chatlogs/${date}.html#${calibrateToMoscowTime(formattedTime)}`;
              window.open(url, '_blank', 'noopener,noreferrer');
            }
          });
        }

        const usernameElement = document.createElement('span');
        usernameElement.className = 'message-username';
        usernameElement.textContent = username;
        usernameElement.style.color = usernameColor;
        usernameElement.style.display = 'inline-flex';
        usernameElement.style.cursor = 'pointer';
        usernameElement.style.margin = '0px 0.4em';
        usernameElement.style.height = 'fit-content';

        // Add click event only if userId is defined
        usernameElement.addEventListener('click', (event) => {
          // Remove all messages on Ctrl + LMB click for the same username
          if (event.ctrlKey) {
            removeMessage(messageElement, 'all');
            return;
          }
          if (userId) { // Check if userId is defined
            const url = `https://klavogonki.ru/u/#/${userId}/`; // Construct the user profile URL
            window.open(url, '_blank', 'noopener,noreferrer'); // Open in a new tab
          } else {
            addShakeEffect(usernameElement); // Call the shake effect if userId is not defined
          }
        });

        const messageTextElement = document.createElement('span');
        messageTextElement.className = 'message-text';
        messageTextElement.style.cursor = 'pointer'; // Pointer cursor
        messageTextElement.style.margin = '0px 0.4em';
        messageTextElement.style.height = 'fit-content';

        // Replace smiley codes with <img> tags, and then wrap links with <a> tags
        messageTextElement.innerHTML = message
          // Replace smiley codes like :word: with <img> tags
          .replace(/:(?=\w*[a-zA-Z])(\w+):/g,
            (_, word) => `<img src="/img/smilies/${word}.gif" alt=":${word}:" title=":${word}:" class="smile">`
          )
          // Wrap http and https links with <a> tags
          .replace(/(https?:\/\/[^\s]+)/gi,
            (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
          );

        // Add click event listener for the messageTextElement
        messageTextElement.addEventListener('click', async function (event) {
          // Remove single message on Ctrl + LMB click for the same username
          if (event.ctrlKey) {
            removeMessage(messageElement, 'single');
            return;
          }

          // Call the findGeneralChatMessage function to search for the general chat message by time in range and username
          const foundGeneralChatMessage = await findGeneralChatMessage(time, username, true);
          if (foundGeneralChatMessage) {
            triggerTargetElement(cachedMessagesPanel, 'hide');
            triggerDimmingElement('hide');
          } else {
            let previousElement = messageTextElement.parentElement.previousElementSibling;
            while (previousElement && !previousElement.classList.contains('date-item')) {
              previousElement = previousElement.previousElementSibling;
            }
            if (previousElement) {
              await showChatLogsPanel(previousElement.dataset.date);
              const calibratedMoscowTime = calibrateToMoscowTime(formattedTime);
              // Call the findChatLogsMessage function to search for the chat logs message by time in range and username
              requestAnimationFrame(async () => {
                setTimeout(async () => {
                  // find chat messge if not found close the panel
                  const foundChatLogsMessage = await findChatLogsMessage(calibratedMoscowTime, username, true);
                  if (!foundChatLogsMessage) {
                    const chatLogsPanel = document.querySelector('.chat-logs-panel'); // Get the chat logs panel
                    triggerTargetElement(chatLogsPanel, 'hide'); // Hide the chat logs panel
                    showPersonalMessagesPanel(); // Show the personal messages panel again
                  }
                }, 500); // Adjust the delay as needed
              });
            }
          }
        });

        // Store elements for (pingable messages) colorization after all processing
        const messageData = {
          messageTextElement,
          time,
          username,
          type
        };

        // Add messageData to the array for later processing
        messageElements.push(messageData);

        // Append time, username, and message to the message element
        messageElement.appendChild(timeElement);
        messageElement.appendChild(usernameElement);
        messageElement.appendChild(messageTextElement);

        // Append the message element to the messages container
        messagesContainer.appendChild(messageElement);
      });

      requestAnimationFrame(() => {
        convertImageLinksToImage('personalMessages');
        convertVideoLinksToPlayer('personalMessages');
        processEncodedLinks('personalMessages'); // Decodes links within the personal messages section.
        highlightMentionWords('personalMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll after next repaint
        attachMutationObserver();
        setTimeout(() => { isMessagesImport = false; }, 500);
      });

      // Process the colorization logic in reverse order
      messageElements.reverse().forEach(async ({ messageTextElement, time, username, type }) => {
        if (pingCheckCounter < maxPingChecks) {
          pingMessages = await findGeneralChatMessage(time, username, false);
          pingCheckCounter++; // Increment the counter

          if (pingCheckCounter >= maxPingChecks) {
            pingMessages = false;
            console.log("Reached maximum ping checks, resetting pingMessages.");
          }
        }

        // Colorize the messageTextElement accordingly (Pingable messages)
        messageTextElement.style.color =
          pingMessages && type === 'mention' ? 'lightgreen' :
            pingMessages && type === 'private' ? 'lemonchiffon' :
              messageColors[type] || 'slategray';
      });
    }

    // Assuming this code is within an async function
    await loadMessages(messages);

    // Append the messages container to the cached messages panel
    cachedMessagesPanel.appendChild(messagesContainer);

    // Append the cached messages panel to the body
    document.body.appendChild(cachedMessagesPanel);

    // Create and append scroll buttons
    const {
      scrollButtonsContainer,
      fullScrollUpButton,
      partialScrollUpButton,
      partialScrollDownButton,
      fullScrollDownButton
    } = createScrollButtons(messagesContainer);
    cachedMessagesPanel.appendChild(scrollButtonsContainer);

    // Create an array containing the buttons we want to apply the events to
    const buttons = [
      saveMessagesButton,
      importMessagesButton,
      exportMessagesButton,
      copyPersonalMessagesButton,
      clearCacheButton,
      closePanelButton,
      fullScrollUpButton,
      partialScrollUpButton,
      partialScrollDownButton,
      fullScrollDownButton
    ];

    // Iterate through each button in the array
    buttons.forEach(button => {
      // Add a mouseover event listener to change the button's brightness on hover
      button.addEventListener('mouseover', () => {
        button.style.filter = 'brightness(0.8)'; // Dim the button
      });

      // Add a mouseout event listener to reset the button's brightness when not hovered
      button.addEventListener('mouseout', () => {
        button.style.filter = 'brightness(1)'; // Reset to original brightness
      });
    });

    // Fade in the cached messages panel
    triggerTargetElement(cachedMessagesPanel, 'show');
    // Show the dimming background
    triggerDimmingElement('show');

    // Add click event listener to clear the search input by LMB click with Ctrl key pressed
    messagesSearchInput.addEventListener('click', () => isCtrlKeyPressed && (messagesSearchInput.value = ''));

    // Event listener to handle input search for matching personal messages
    // It searches through messages grouped by date and displays the corresponding date
    // Only if there are matching messages in that group.
    messagesSearchInput.addEventListener('input', () => {
      const query = messagesSearchInput.value.toLowerCase().replace(/_/g, ' ');

      messagesContainer.querySelectorAll('.date-item').forEach(dateEl => {
        let showDateForGroup = false;
        let nextEl = dateEl.nextElementSibling;

        // Iterate through messages in the current group (until the next date item)
        while (nextEl && !nextEl.classList.contains('date-item')) {
          const match = (nextEl.querySelector('.message-time')?.textContent.toLowerCase().replace(/_/g, ' ') + ' ' +
            nextEl.querySelector('.message-username')?.textContent.toLowerCase().replace(/_/g, ' ') + ' ' +
            nextEl.querySelector('.message-text')?.textContent.toLowerCase().replace(/_/g, ' ')).includes(query);

          // Toggle visibility based on match using content visibility and font size
          nextEl.style.contentVisibility = match ? 'visible' : 'hidden';
          // Set font size to 0 for hidden messages to maintain layout or remove the font size property
          nextEl.style.fontSize = match ? '' : '0';

          showDateForGroup = showDateForGroup || match; // Show date if any match found in the group

          nextEl = nextEl.nextElementSibling;
        }

        dateEl.style.display = showDateForGroup ? '' : 'none'; // Show or hide the date based on the match results in the group
      });
    });

    // Focus on the search input using requestAnimationFrame
    function focusOnSearchField() { requestAnimationFrame(function () { messagesSearchInput.focus(); }); } focusOnSearchField();

    // Define the event handler function for personal messages panel
    panelsEvents.handlePersonalMessagesKeydown = (event) => { // Assign the function to the object
      if (event.key === 'Escape') {
        triggerTargetElement(cachedMessagesPanel, 'hide');
        triggerDimmingElement('hide');
        document.removeEventListener('keydown', panelsEvents.handlePersonalMessagesKeydown); // Remove the event listener
      }
    };

    // Attach the event listener
    document.addEventListener('keydown', panelsEvents.handlePersonalMessagesKeydown);
  }

  // Initialize previousTotalCount with the current personal messages count from localStorage
  let previousTotalCount =
    (localStorage.personalMessages && Object.keys(JSON.parse(localStorage.personalMessages)).length) || 0;

  /**
   * Updates total and new personal message counts near the personal messages button.
   * - Increments new message count only when total message count increases.
   * - Manages visibility and pulse effects for the new message indicator.
   */
  function updatePersonalMessageCounts() {
    const totalCountElement = document.querySelector('.personal-messages-button .total-message-count');
    const newCountElement = document.querySelector('.personal-messages-button .new-message-count');
    if (!totalCountElement || !newCountElement) return; // Exit if elements are missing

    const personalMessages = JSON.parse(localStorage.getItem('personalMessages')) || {};
    const totalCount = Object.keys(personalMessages).length;

    let newCount = Number(localStorage.getItem('newMessagesCount')) || 0;
    if (totalCount > previousTotalCount) {
      newCount++;
      localStorage.setItem('newMessagesCount', newCount);
      addPulseEffect(newCountElement); // Apply pulse effect for new messages
      addJumpEffect(newCountElement, 50, 50); // Apply jump effect for new messages
    }

    // Update counts in the UI
    totalCountElement.textContent = totalCount;
    newCountElement.textContent = newCount;

    // Manage visibility of the new message indicator
    newCountElement.style.visibility = newCount > 0 ? 'visible' : 'hidden';

    // Apply pulse effect if total count changes
    if (totalCount !== previousTotalCount) addPulseEffect(totalCountElement);

    previousTotalCount = totalCount; // Update previous count
  }

  // CREATE PERSONAL MESSAGES BUTTON (END)


  // CREATE CHAT LOGS BUTTON (START)

  // Function to create the button for opening chat logs
  function createChatLogsButton() {
    const showChatLogsButton = document.createElement('div');
    showChatLogsButton.classList.add('chat-logs-button');

    // Apply base button styles
    applyBaseButtonStyles(showChatLogsButton);

    showChatLogsButton.style.position = 'relative';
    showChatLogsButton.style.zIndex = '1';
    showChatLogsButton.innerHTML = chatLogsSVG; // Add icon

    showChatLogsButton.title = 'Show Chat Logs';

    showChatLogsButton.addEventListener('click', async function () {
      addPulseEffect(showChatLogsButton); // Add pulse effect
      await showChatLogsPanel();
    });

    empowermentButtonsPanel.appendChild(showChatLogsButton);
  }

  // Call the function to create the button
  createChatLogsButton();

  // Function to fetch chat logs from the specified URL for a given date
  const fetchChatLogs = async (date, messagesContainer) => {
    // Clear the messagesContainer if it exists
    messagesContainer && (messagesContainer.innerHTML = '');

    // Generate a random 20-digit number
    const randomParam = Math.floor(Math.random() * 10 ** 20);

    // Construct the URL to fetch chat logs for the specified date with the random parameter
    const url = `https://klavogonki.ru/chatlogs/${date}.html?rand=${randomParam}`;

    // Function to parse the HTML and extract chat log entries
    const parseChatLog = (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');

      return [...doc.querySelectorAll('.ts')].map((timeElement) => {
        const usernameElement = timeElement.nextElementSibling;
        const messageNode = usernameElement?.nextSibling;

        const extractMessageText = (node) => {
          if (!node) return '';
          return [...node.childNodes].reduce((acc, child) => {
            if (child.nodeType === Node.TEXT_NODE) {
              acc += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              if (child.tagName === 'A') {
                acc += child.getAttribute('href');
              } else if (child.tagName === 'BR') {
                return acc;
              }
            }
            return acc;
          }, '').trim();
        };

        if (usernameElement?.classList.contains('mn') && messageNode) {
          let messageText = '';

          if (messageNode.nodeType === Node.ELEMENT_NODE) {
            messageText = extractMessageText(messageNode);
          } else if (messageNode.nodeType === Node.TEXT_NODE) {
            const nextSibling = usernameElement.nextElementSibling;
            if (nextSibling && nextSibling.tagName === 'A') {
              messageText = `${messageNode.textContent.trim()} ${nextSibling.getAttribute('href')}`;
            } else {
              messageText = messageNode.textContent.trim();
            }
          }

          if (!messageText) {
            const combinedText = extractMessageText(usernameElement.nextSibling);
            messageText = combinedText;
          }

          return {
            time: timeElement.textContent.trim().replace(/[\[\]]/g, ''),
            username: usernameElement.textContent.trim().replace(/<|>/g, ''),
            message: messageText || null,
          };
        }

        // Handle case where username is not found, and instead, `mne` class is present (system message)
        const systemMessageElement = timeElement.nextElementSibling;
        if (systemMessageElement && systemMessageElement.classList.contains('mne')) {
          // Extract the text directly from the <font> element
          const messageText = systemMessageElement.textContent.trim();
          return {
            time: timeElement.textContent.trim().replace(/[\[\]]/g, ''),
            username: 'SYSTEM', // Set username as 'SYSTEM' for system messages
            message: messageText || null,
          };
        }

        return null;
      }).filter(Boolean);
    };

    try {
      // Fetch chat logs from the URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Get the HTML content
      const html = await response.text();

      // Limit the size of the HTML to 5KB
      const sizeLimitKB = 1000; // Set the size limit in KB
      const sizeLimitBytes = sizeLimitKB * 1024; // Convert KB to bytes
      const htmlContent = html.length > sizeLimitBytes ? html.slice(0, sizeLimitBytes) : html;

      // Parse the HTML and extract chat logs
      const chatlogs = parseChatLog(htmlContent);

      const limitReached = html.length > sizeLimitBytes;

      // Step 1: Remove consecutive duplicate messages
      const noSpamMessages = [];
      let lastMessage = null;

      for (const log of chatlogs) {
        const isDifferentMessage = log.message !== lastMessage?.message;
        const isDifferentUser = log.username !== lastMessage?.username;

        // Include the message if:
        // - It's the first message, or
        // - It's a different message or from a different user
        if (isDifferentMessage || isDifferentUser) {
          noSpamMessages.push(log);
          lastMessage = log;
        }
      }

      // Step 2: Filter out messages from ignored users
      const finalChatlogs = noSpamMessages.filter((log) => !ignored.includes(log.username));

      // Return the filtered chat logs, size of HTML, URL, and info
      return {
        chatlogs: finalChatlogs,
        url: url,
        size: htmlContent.length,
        info: limitReached,
        error: null,
      }
    } catch (error) {
      // Handle other errors (e.g., parsing errors)
      return {
        chatlogs: [],
        url: url,
        size: 0,
        error: error.message,
      }
    }
  }

  const minDate = '2012-02-12'; // Define the minimum date

  function getRandomDateInRange() {
    const startDate = new Date(minDate); // Start date
    const endDate = new Date(); // Current date

    // Calculate the difference in milliseconds
    const dateDifference = endDate - startDate;

    // Generate a random number of milliseconds between 0 and dateDifference
    const randomMilliseconds = Math.floor(Math.random() * dateDifference);

    // Create a random date by adding the random milliseconds to the start date
    const randomDate = new Date(startDate.getTime() + randomMilliseconds);

    // Format the date to 'YYYY-MM-DD' using Intl.DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat('en-CA').format(randomDate);

    return formattedDate;
  }

  // Function to get user ID by username (with caching in localStorage)
  async function getUserId(username) {
    const userIdsCache = JSON.parse(localStorage.getItem('userIdsCache') || '{}');

    // If the user ID is cached, return it
    if (userIdsCache[username]) return userIdsCache[username];

    try {
      // Fetch the user ID
      const userId = await getExactUserIdByName(username);
      if (userId) {
        userIdsCache[username] = userId;
        localStorage.setItem('userIdsCache', JSON.stringify(userIdsCache));
        return userId;
      }
    } catch (error) {
      console.error(`Error fetching user ID for ${username}:`, error);
    }

    return null; // Return null if no user found
  }

  // Initialize the visibility state for media and mention messages
  let visibleMessages = { media: false, mention: false };

  // Function to reset the visibleMessages object
  const resetVisibleMessages = () => { visibleMessages = { media: false, mention: false }; };

  // Function to toggle the visibility of message items based on the given selector
  async function toggleMessagesVisibility(selector) {
    // Determine if the selector is 'media' or 'mention' and update visibility states
    const isMedia = selector === 'media';
    const isMention = selector === 'mention';

    // Update the visibility state: toggle the selected type and reset the other
    visibleMessages = {
      media: isMedia ? !visibleMessages.media : false, // Toggle media visibility
      mention: isMention ? !visibleMessages.mention : false // Toggle mention visibility
    };

    // Iterate over all message items and apply the corresponding visibility rules
    document.querySelectorAll('.message-item').forEach(item => {
      // Check if the message item contains media or mention content
      const hasMediaClass = item.querySelector('.media');
      const hasMentionClass = item.querySelector('.mention');

      // Case: Showing only media elements (when 'media' is toggled)
      if (visibleMessages.media) {
        item.style.contentVisibility = hasMediaClass ? 'visible' : 'hidden'; // Show/hide based on media class
        item.style.fontSize = hasMediaClass ? '' : '0'; // Adjust font size based on visibility
      }
      // Case: Showing only mention elements (when 'mention' is toggled)
      else if (visibleMessages.mention) {
        item.style.contentVisibility = hasMentionClass ? 'visible' : 'hidden'; // Show/hide based on mention class
        item.style.fontSize = hasMentionClass ? '' : '0'; // Adjust font size based on visibility
      }
      // Case: Show all messages when neither 'media' nor 'mention' is toggled
      else {
        item.style.contentVisibility = 'visible'; // Ensure the message is visible
        item.style.fontSize = ''; // Reset font size to default
      }
    });
  }

  //   Function to display the chat logs panel
  // Load initially with default date or date given by personal messages panel with parameter date
  async function showChatLogsPanel(personalMessagesDate) {
    // Check if the panel already exists
    const existingPanel = document.querySelector('.chat-logs-panel');
    if (existingPanel) {
      existingPanel.remove(); // Remove the settings panel
      triggerDimmingElement('hide');
      return; // Return immediately to prevent further execution
    }

    // Remove any previous panel before creating a new one
    removePreviousPanel();

    // Create a container div with class 'chat-logs-panel'
    const chatLogsPanel = document.createElement('div');
    chatLogsPanel.className = 'chat-logs-panel popup-panel';

    // Set initial styles for the chat logs panel
    chatLogsPanel.style.opacity = '0';
    chatLogsPanel.style.backgroundColor = '#1b1b1b';
    chatLogsPanel.style.setProperty('border-radius', '0.6em', 'important');
    chatLogsPanel.style.position = 'fixed';
    chatLogsPanel.style.top = '100px';
    chatLogsPanel.style.left = '50%';
    chatLogsPanel.style.transform = 'translateX(-50%)';
    chatLogsPanel.style.width = '80vw';
    chatLogsPanel.style.height = '80vh';
    chatLogsPanel.style.zIndex = '999';
    chatLogsPanel.style.minWidth = '1000px';
    chatLogsPanel.style.display = 'grid';
    chatLogsPanel.style.gridTemplateColumns = '1fr';
    chatLogsPanel.style.gridTemplateRows = 'min-content';
    chatLogsPanel.style.gridTemplateAreas = `
      "header header header"
      "messages scroll users"`;

    // Create a container div for the panel header
    const panelHeaderContainer = document.createElement('div');
    panelHeaderContainer.className = 'panel-header';
    panelHeaderContainer.style.display = 'flex';
    panelHeaderContainer.style.flexDirection = 'row';
    panelHeaderContainer.style.gridArea = 'header';
    panelHeaderContainer.style.justifyContent = 'flex-end';
    panelHeaderContainer.style.padding = '0.6em';

    // Create a container div with class 'panel-control-buttons'
    const panelControlButtons = document.createElement('div');
    panelControlButtons.className = 'panel-control-buttons';
    panelControlButtons.style.display = 'flex';

    // Create a container div for the search input
    const chatlogsSearchContainer = document.createElement('div');
    chatlogsSearchContainer.className = 'search-for-chatlogs-messages';
    chatlogsSearchContainer.style.width = '100%';
    chatlogsSearchContainer.style.margin = '0 0.5em 0 0';
    chatlogsSearchContainer.style.display = 'flex';

    // Create the input field for searching users
    const chatlogsSearchInput = document.createElement('input');
    chatlogsSearchInput.className = 'chatlogs-search-input';
    chatlogsSearchInput.type = 'text';
    chatlogsSearchInput.style.outline = 'none';
    chatlogsSearchInput.style.height = '48px';
    chatlogsSearchInput.style.width = '100%';
    chatlogsSearchInput.style.padding = '10px';
    chatlogsSearchInput.style.fontSize = '1em';
    chatlogsSearchInput.style.fontFamily = 'Montserrat';
    chatlogsSearchInput.style.setProperty('color', 'bisque', 'important');
    chatlogsSearchInput.style.setProperty('border-radius', '0.2em', 'important');
    chatlogsSearchInput.style.boxSizing = 'border-box';
    chatlogsSearchInput.style.backgroundColor = '#111';
    chatlogsSearchInput.style.border = '1px solid #222';

    // Append search input to the search container
    chatlogsSearchContainer.appendChild(chatlogsSearchInput);
    // Append the search container to the panel header container
    panelHeaderContainer.appendChild(chatlogsSearchContainer);

    // Add input event listener to filter items as the user types
    chatlogsSearchInput.addEventListener('input', () => filterItems(chatlogsSearchInput.value));

    // Clears the input when the left mouse button (LMB) is clicked while holding the Ctrl key
    // Also updates the filtered items accordingly
    chatlogsSearchInput.addEventListener('click', (event) => {
      if (event.ctrlKey) {
        chatlogsSearchInput.value = '';
        // Call the function to update the filtered items based on the cleared input
        filterItems(chatlogsSearchInput.value);
      }
    });

    // Add keydown event listener to handle date format and validity check
    chatlogsSearchInput.addEventListener('keydown', async (event) => {
      const inputValue = chatlogsSearchInput.value;

      if (event.key === 'Enter') {
        let normalizedDate = inputValue;

        // Handle 8-digit and 6-digit date formats
        if (/^\d{8}$/.test(inputValue)) {
          normalizedDate = inputValue.length === 6 ? '20' + inputValue : inputValue;
          normalizedDate = normalizedDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        } else if (/^\d{6}$/.test(inputValue)) {
          normalizedDate = '20' + inputValue.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3');
        }

        // Check if the normalized input matches either 'yyyy:mm:dd' or 'yyyy-mm-dd' format
        const isValidFormat = /^\d{2,4}[:\-]\d{2}[:\-]\d{2}$/.test(normalizedDate.replace(/:/g, '-'));

        // Check if the normalized date is a valid date
        const isValidDate = isValidFormat && !isNaN(new Date(normalizedDate.replace(/:/g, '-')).getTime());

        if (isValidDate) {
          await loadChatLogs(normalizedDate); // Load chat logs for the determined date
          showDateInput(dateInput);
        } else {
          alert('Please enter a valid date.\n\nValid formats include:\n' +
            '1. yyyy-mm-dd\n' +
            '2. yyyy:mm:dd\n' +
            '3. yy-mm-dd\n' +
            '4. yy:mm:dd\n' +
            '5. yyyymmdd\n' +
            '6. yymmdd\n\n');
        }

        // Clear the input value after processing the "Enter" key
        chatlogsSearchInput.value = '';
      }
    });

    // Focus on the search input using requestAnimationFrame
    function focusOnSearchField() { requestAnimationFrame(function () { chatlogsSearchInput.focus(); }); } focusOnSearchField();

    // Helper function to apply common styles to a header button
    function applyHeaderButtonStyles(button, backgroundColor, margin = '0 0.5em') {
      button.style.backgroundColor = backgroundColor;
      button.style.width = '48px';
      button.style.height = '48px';
      button.style.display = 'flex';
      button.style.justifyContent = 'center';
      button.style.alignItems = 'center';
      button.style.cursor = 'pointer';
      button.style.setProperty('border-radius', '0.2em', 'important');
      button.style.margin = margin; // Set margin using the provided value
      button.style.filter = 'brightness(1)';
      button.style.transition = 'filter 0.3s ease';
    }

    // Create a date input toggle with similar styles as the close button
    const dateInputToggle = document.createElement('div');
    dateInputToggle.className = 'date-panel-button';
    dateInputToggle.innerHTML = calendarSVG;
    // Apply common styles using the helper function with a different background color
    applyHeaderButtonStyles(dateInputToggle, 'steelblue');
    dateInputToggle.style.margin = '0 0.5em';

    // Function to toggle visibility of an element
    function toggleDateInputVisibility(element) {
      element.style.display = element.style.display === 'none' ? 'flex' : 'none';
    }

    // Function to show the date input if it is currently hidden
    function showDateInput(element) {
      if (element.style.display === 'none') element.style.display = 'flex';
    }

    // Toggle the visibility of the date input when the toggle is clicked
    dateInputToggle.addEventListener('click', () => {
      toggleDateInputVisibility(dateInput);
    });

    // Create the date input field
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'chatlogs-date-input';

    // Apply consistent styles
    dateInput.style.backgroundColor = '#111';
    dateInput.style.color = 'bisque';
    dateInput.style.border = '1px solid #222';
    dateInput.style.width = 'fit-content';
    dateInput.style.height = '48px';
    dateInput.style.padding = '10px';
    dateInput.style.fontSize = '1em';
    dateInput.style.fontFamily = 'Montserrat';
    dateInput.style.display = 'none'; // Hidden by default
    dateInput.style.setProperty('border-radius', '0.2em', 'important');
    dateInput.style.boxSizing = 'border-box';
    dateInput.style.margin = '0 0.5em';

    // Append the date button and input field to the control buttons container
    panelControlButtons.appendChild(dateInputToggle);
    panelControlButtons.appendChild(dateInput);

    // Create a toggle mention messages component
    const toggleMentionMessages = document.createElement('div');
    toggleMentionMessages.className = 'toggle-mention-messages';
    // Set the inner HTML of the toggle component with a suitable SVG or text
    toggleMentionMessages.innerHTML = personalMessagesSVG;
    toggleMentionMessages.title = 'Toggle Mention Messages';
    // Apply common styles to the component
    applyHeaderButtonStyles(toggleMentionMessages, 'saddlebrown');

    // Add a click event listener to toggle the visibility of messages without mentions
    toggleMentionMessages.addEventListener('click', async () => {
      await toggleMessagesVisibility('mention');
    });

    // Function to apply styles to the toggle counter element
    function applyToggleCounterStyles(element, backgroundColor) {
      // Set the display type to flex for layout control
      element.style.display = 'flex';
      element.style.position = 'absolute';
      element.style.justifyContent = 'center';
      element.style.alignItems = 'center';
      element.style.padding = '2px 4px';
      element.style.setProperty('border-radius', '2px', 'important');
      element.style.fontSize = '12px';
      element.style.fontFamily = 'Roboto';
      element.style.fontWeight = 'bold';
      element.style.bottom = '0px';
      element.style.left = '0px';
      element.style.transform = 'translate(-50%, 50%)';
      element.style.backgroundColor = backgroundColor;
      element.style.color = '#020202';
      element.style.pointerEvents = 'none';
      element.style.userSelect = 'none';
    }

    // Create a new div element for the toggle mention messages counter
    const toggleMentionMessagesCounter = document.createElement('div');
    // Assign a class name to the element
    toggleMentionMessagesCounter.className = 'toggle-mention-messages-counter';
    toggleMentionMessagesCounter.textContent = '0'; // Set as default value before assign
    // Apply the defined styles using the applyToggleCounterStyles function
    applyToggleCounterStyles(toggleMentionMessagesCounter, '#ffa07a');

    // Append the counter inside the toggleMentionMessages component
    toggleMentionMessages.appendChild(toggleMentionMessagesCounter);
    // Append the toggle mention messages component to the control panel
    panelControlButtons.appendChild(toggleMentionMessages);

    // Create a toggle media messages component
    const toggleMediaMessages = document.createElement('div');
    toggleMediaMessages.className = 'toggle-media-messages';
    // Set the inner HTML of the toggle component with a suitable SVG or text
    toggleMediaMessages.innerHTML = mediaMessagesSVG;
    toggleMediaMessages.title = 'Toggle Media Messages';
    // Apply common styles to the component
    applyHeaderButtonStyles(toggleMediaMessages, 'darkslategray');

    // Add a click event listener to toggle the visibility of media messages
    toggleMediaMessages.addEventListener('click', async () => {
      await toggleMessagesVisibility('media');
    });

    // Create a new div element for the toggle media messages counter
    const toggleMediaMessagesCounter = document.createElement('div');
    // Assign a class name to the element
    toggleMediaMessagesCounter.className = 'toggle-media-messages-counter';
    toggleMediaMessagesCounter.textContent = '0'; // Set as default value before assign
    // Apply the defined styles using the applyToggleCounterStyles function
    applyToggleCounterStyles(toggleMediaMessagesCounter, '#71c4c4');

    // Append the counter inside the toggleMediaMessages component
    toggleMediaMessages.appendChild(toggleMediaMessagesCounter);

    // Append the toggle media messages component to the control panel
    panelControlButtons.appendChild(toggleMediaMessages);

    // Function to update the media and mention counters
    function updateMediaAndMentionCounters() {
      // Update the media counter
      toggleMediaMessagesCounter.textContent = document.querySelectorAll('.chat-logs-container .media').length;
      // Update the mention counter
      toggleMentionMessagesCounter.textContent = document.querySelectorAll('.chat-logs-container .mention').length;
    }

    // Create a copy chatlogs button element
    const copyChatLogsUrl = document.createElement('div');
    copyChatLogsUrl.className = 'copy-current-chatlogs-url';
    // Set the inner HTML of the copy chat logs element with the clipboard SVG
    copyChatLogsUrl.innerHTML = clipboardSVG;
    copyChatLogsUrl.title = 'Copy Chat Logs Url';
    // Apply common styles to the button element
    applyHeaderButtonStyles(copyChatLogsUrl, 'steelblue');

    // Helper function to extract date from the URL
    const extractDateFromUrl = (url) => {
      const chatlogsDateRegex = /(\d{4}-\d{2}-\d{2})/;
      const match = url.match(chatlogsDateRegex);
      return match ? match[1] : null; // Return the date if match is found, else return null
    };

    // Function to create and populate chat log links
    function createChatLogLinks(savedChatlogs, chatLogsLinksContainer) {
      // Check if the container exists and return if not
      if (!chatLogsLinksContainer) return;
      // Clear the container before repopulating it
      chatLogsLinksContainer.replaceChildren();

      savedChatlogs.forEach(({ url, title }) => {
        const date = extractDateFromUrl(url); // Extract date from URL

        // Create the wrapper container for each link
        const logWrapper = document.createElement('div');
        logWrapper.classList.add('saved-chatlog-url-wrapper');

        // Create the log link element
        const logLink = document.createElement('a');
        logLink.classList.add('saved-chatlog-url');
        logLink.textContent = date; // Display the date
        logLink.href = url; // Store the URL in the href attribute

        // Style the log link
        logLink.style.setProperty('color', 'darkseagreen', 'important');
        logLink.style.textDecoration = 'none'; // Optional: Remove underline
        logLink.style.display = 'inline-flex';
        logLink.style.padding = '0.5em';

        logLink.addEventListener('click', async (event) => {
          event.preventDefault(); // Prevent the default link behavior

          if (event.ctrlKey) {
            const urlToRemove = event.target.href;
            // Find the exact match in the savedChatlogs array and remove it
            const updatedChatlogs = savedChatlogs.filter(log => log.url !== urlToRemove);

            // If there was a change, update localStorage and remove the link
            if (updatedChatlogs.length !== savedChatlogs.length) {
              savedChatlogs = updatedChatlogs;
              localStorage.setItem('savedChatlogs', JSON.stringify(savedChatlogs));
              const targetLink = event.target;
              targetLink.closest('.saved-chatlog-url-wrapper').remove(); // Remove the wrapper
            }
          } else {
            // Handle when Ctrl is not pressed
            await loadChatLogs(date);
          }
        });

        // Create the title element
        const logTitle = document.createElement('span');
        logTitle.classList.add('saved-chatlog-url-title');
        logTitle.textContent = title || '➕'; // Display the title (or an empty string if none provided)

        // Style the log title
        logTitle.style.color = 'lightsteelblue';
        logTitle.style.padding = '0.5em';

        // Add click event listener to the title
        logTitle.addEventListener('click', () => {
          const newTitle = prompt('Enter a new title for this chat log:', logTitle.textContent);

          if (newTitle !== null && newTitle !== logTitle.textContent) {
            // Update the title displayed on the page
            logTitle.textContent = newTitle;

            // Find the log by URL in the savedChatlogs array and update its title
            const logIndex = savedChatlogs.findIndex(log => log.url === url);
            if (logIndex !== -1) {
              savedChatlogs[logIndex].title = newTitle; // Update the title in the saved object
              localStorage.setItem('savedChatlogs', JSON.stringify(savedChatlogs)); // Save the updated list to localStorage
            }
          }
        });

        // Append the elements to the wrapper
        logWrapper.appendChild(logLink);
        logWrapper.appendChild(logTitle);

        // Append the wrapper to the container
        chatLogsLinksContainer.appendChild(logWrapper);
      });
    }

    // Add a click event listener to copy chatLogsUrlForCopy to the clipboard
    copyChatLogsUrl.addEventListener('click', (event) => {
      let chatLogsLinksContainer = document.querySelector('.saved-chatlog-container');

      !chatLogsLinksContainer && !event.shiftKey && addJumpEffect(copyChatLogsUrl, 0, 0);

      if (chatLogsLinksContainer && !event.ctrlKey && !chatLogsLinksContainer.contains(event.target)) {
        chatLogsLinksContainer.remove();
      }

      let savedChatlogs = JSON.parse(localStorage.getItem('savedChatlogs')) || [];

      if (event.ctrlKey && !event.target.closest('.saved-chatlog-url')) {
        const currentUrlDate = extractDateFromUrl(chatLogsUrlForCopy);
        if (!currentUrlDate) return;

        // Ask for title input
        const title = prompt('Enter a title for this chat log:', '➕');

        // Check if the URL with the same date already exists
        const urlExists = savedChatlogs.some(log => extractDateFromUrl(log.url) === currentUrlDate);

        if (!urlExists) {
          // Add the new URL and title if no match was found for the date
          savedChatlogs.push({ url: chatLogsUrlForCopy, title: title || '➕' });

          // Sort the saved URLs based on the date extracted from the URL
          savedChatlogs.sort((a, b) => {
            const dateA = extractDateFromUrl(a.url);
            const dateB = extractDateFromUrl(b.url);
            return new Date(dateA) - new Date(dateB);
          });

          // Store the updated list back in localStorage
          localStorage.setItem('savedChatlogs', JSON.stringify(savedChatlogs));
        }
        createChatLogLinks(savedChatlogs, chatLogsLinksContainer);
      } else if (event.shiftKey) {
        if (savedChatlogs.length > 0 && !chatLogsLinksContainer) {
          chatLogsLinksContainer = document.createElement('div');
          chatLogsLinksContainer.classList.add('saved-chatlog-container');
          chatLogsLinksContainer.style.display = 'flex';
          chatLogsLinksContainer.style.flexDirection = 'column';
          chatLogsLinksContainer.style.overflowY = 'auto';
          chatLogsLinksContainer.style.backgroundColor = 'rgb(30, 40, 45)';
          chatLogsLinksContainer.style.setProperty('border', '1px solid rgb(60, 70, 80)', 'important');
          chatLogsLinksContainer.style.setProperty('border-radius', '0.2em', 'important');
          chatLogsLinksContainer.style.position = 'absolute';
          chatLogsLinksContainer.style.padding = '0.5em';
          chatLogsLinksContainer.style.height = 'fit-content';
          chatLogsLinksContainer.style.width = 'max-content';
          chatLogsLinksContainer.style.maxHeight = `calc(${chatLogsContainer.offsetHeight}px - 0.5em)`;
          chatLogsLinksContainer.style.top = 'calc(50px + 1em)';
          chatLogsLinksContainer.style.right = '0';
          createChatLogLinks(savedChatlogs, chatLogsLinksContainer);

          copyChatLogsUrl.appendChild(chatLogsLinksContainer);
        }
      } else {
        navigator.clipboard.writeText(chatLogsUrlForCopy)
          .catch(err => console.error('Failed to copy: ', err));
      }
    });

    panelControlButtons.appendChild(copyChatLogsUrl);

    // Retrieve `shouldShowActiveUsers` from localStorage or set it to 'shown' if it doesn't exist
    const shouldShowActiveUsers = localStorage.getItem('shouldShowActiveUsers') || (localStorage.setItem('shouldShowActiveUsers', 'shown'), 'shown');

    // Create a toggle active users button
    const toggleActiveUsers = document.createElement('div');
    toggleActiveUsers.className = 'toggle-active-users';
    updateActiveUsersToggle(shouldShowActiveUsers); // Set initial SVG based on stored state
    applyHeaderButtonStyles(toggleActiveUsers, '#144e9d'); // Apply common styles

    // Set initial title based on stored state
    toggleActiveUsers.title = shouldShowActiveUsers === 'shown' ? 'Hide User List' : 'Show User List';

    // Function to update the toggle button's SVG and title based on current state
    function updateActiveUsersToggle(state) {
      toggleActiveUsers.innerHTML = state === 'shown' ? toggleLeftSVG : toggleRightSVG; // Toggle between SVGs
      toggleActiveUsers.title = state === 'shown' ? 'Hide User List' : 'Show User List'; // Update title based on state
    }

    // Function to toggle active users and update localStorage, SVG, and title
    function toggleActiveUsersState() {
      const newState = localStorage.getItem('shouldShowActiveUsers') === 'shown' ? 'hidden' : 'shown'; // Determine new state
      localStorage.setItem('shouldShowActiveUsers', newState); // Update localStorage
      updateActiveUsersToggle(newState); // Update the displayed SVG and title

      if (newState === 'shown') {
        // Call renderActiveUsers to update the display of active users based on their message counts
        renderActiveUsers(usernameMessageCountMap, chatLogsPanel);
      } else {
        // Remove the active users container if the state is hidden
        const activeUsersContainer = chatLogsPanel.querySelector('.active-users');
        if (activeUsersContainer) {
          chatLogsPanel.removeChild(activeUsersContainer);
        }
      }
    }

    // Add click event to toggle active users
    toggleActiveUsers.addEventListener('click', toggleActiveUsersState);

    // Append the toggle active users to the panel control buttons
    panelControlButtons.appendChild(toggleActiveUsers);

    // Create and style the chevron left button
    const oneDayBackward = document.createElement('div');
    oneDayBackward.className = 'chevron-left-button';
    oneDayBackward.title = 'Previous Day';
    oneDayBackward.innerHTML = chevronLeftSVG; // Assuming you have chevronLeftSVG defined
    applyHeaderButtonStyles(oneDayBackward, 'darkcyan');

    // Create and style the chevron right button
    const oneDayForward = document.createElement('div');
    oneDayForward.className = 'chevron-right-button';
    oneDayForward.title = 'Next Day';
    oneDayForward.innerHTML = chevronRightSVG; // Assuming you have chevronRightSVG defined
    applyHeaderButtonStyles(oneDayForward, 'darkcyan');

    // Create and style the shuffle button
    const randomDay = document.createElement('div');
    randomDay.className = 'shuffle-button';
    randomDay.title = 'Random Date';
    randomDay.innerHTML = shuffleSVG; // Assuming you have shuffleSVG defined
    applyHeaderButtonStyles(randomDay, 'darkslateblue');

    // Function to get current date or fallback to today's date
    function getEffectiveDate() {
      return dateInput.value ? new Date(dateInput.value) : new Date(); // Use dateInput value or today's date
    }

    // Function to update the date input and title
    const updateDateInputAndTitle = (newDate) => {
      dateInput.value = newDate; // Update the date input
      dateInputToggle.title = `Current date: ${newDate}`; // Update title
    };

    // Event listener for the chevron left button
    oneDayBackward.addEventListener('click', async () => {
      const currentDate = getEffectiveDate(); // Get the effective date
      currentDate.setDate(currentDate.getDate() - 1); // Go one day back
      await loadChatLogs(currentDate); // Load chat logs for the updated date
      showDateInput(dateInput);
      focusOnSearchField();
      resetVisibleMessages();
    });

    // Event listener for the chevron right button
    oneDayForward.addEventListener('click', async () => {
      const currentDate = getEffectiveDate(); // Get the effective date
      currentDate.setDate(currentDate.getDate() + 1); // Go one day forward
      await loadChatLogs(currentDate); // Load chat logs for the updated date
      showDateInput(dateInput);
      focusOnSearchField();
      resetVisibleMessages();
    });

    // Event listener for the shuffle button
    randomDay.addEventListener('click', async () => {
      const randomDate = getRandomDateInRange(); // Get a random date
      await loadChatLogs(randomDate); // Load chat logs for the random date
      showDateInput(dateInput);
      focusOnSearchField();
      resetVisibleMessages();
    });

    // Append buttons to the control buttons container
    panelControlButtons.appendChild(oneDayBackward);
    panelControlButtons.appendChild(oneDayForward);
    panelControlButtons.appendChild(randomDay);

    // Create a close button with the provided SVG icon
    const closePanelButton = document.createElement('div');
    closePanelButton.className = 'close-panel-button';
    closePanelButton.title = 'Close panel';
    closePanelButton.innerHTML = closeSVG;
    // Apply common styles using the helper function
    applyHeaderButtonStyles(closePanelButton, 'darkolivegreen', '0 0 0 0.5em');

    // Add a click event listener to the close panel button
    closePanelButton.addEventListener('click', () => {
      // Fade out the chat logs panel when the close button is clicked
      triggerTargetElement(chatLogsPanel, 'hide');
      triggerDimmingElement('hide');
    });

    // Append close button to control buttons, and control buttons to header
    panelControlButtons.appendChild(closePanelButton);
    panelHeaderContainer.appendChild(panelControlButtons);

    // Create a container for the chat logs
    const chatLogsContainer = document.createElement('div');
    chatLogsContainer.className = 'chat-logs-container';
    chatLogsContainer.style.overflowY = 'auto';
    chatLogsContainer.style.height = 'calc(100% - 0.5em)';
    chatLogsContainer.style.padding = '1em';
    chatLogsContainer.style.display = 'flex';
    chatLogsContainer.style.gridArea = 'messages';
    chatLogsContainer.style.flexDirection = 'column';


    // Append the header and chat logs container to the chat logs panel
    chatLogsPanel.appendChild(panelHeaderContainer);
    chatLogsPanel.appendChild(chatLogsContainer);

    // Create and append scroll buttons
    const {
      scrollButtonsContainer,
      fullScrollUpButton,
      partialScrollUpButton,
      partialScrollDownButton,
      fullScrollDownButton
    } = createScrollButtons(chatLogsContainer);
    chatLogsPanel.appendChild(scrollButtonsContainer);

    // Compact array of buttons with optional exclusions
    const buttons = [
      { element: fullScrollUpButton },
      { element: fullScrollDownButton },
      { element: partialScrollUpButton },
      { element: partialScrollDownButton },
      { element: toggleMentionMessages },
      { element: toggleMediaMessages },
      { element: copyChatLogsUrl, exclusion: 'saved-chatlog-container' },
      { element: toggleActiveUsers },
      { element: dateInputToggle },
      { element: oneDayBackward },
      { element: oneDayForward },
      { element: randomDay },
      { element: closePanelButton }
    ];

    // Helper function to check if the event target is inside an excluded child element
    function isExcludedChild(event, exclusionClass) {
      return exclusionClass && event.target.closest(`.${exclusionClass}`);
    }

    buttons.forEach(button => {
      const { element, exclusion } = button;

      // Add mouseover event
      element.addEventListener('mouseover', event => {
        if (isExcludedChild(event, exclusion)) return; // Skip if mouse is inside an excluded child
        element.style.filter = 'brightness(0.8)'; // Apply dim effect
      });

      // Add mouseout event
      element.addEventListener('mouseout', event => {
        if (isExcludedChild(event, exclusion) && event.relatedTarget?.closest(`.${exclusion}`)) return; // Skip if mouse is leaving to an excluded child
        element.style.filter = 'brightness(1)'; // Reset brightness
      });
    });

    // Append the chat logs panel to the body
    document.body.appendChild(chatLogsPanel);

    // Fade in the chat logs panel and dimming background
    triggerTargetElement(chatLogsPanel, 'show');
    triggerDimmingElement('show');

    // Define an object to store the hue for each username
    const usernameHueMap = {};
    const hueStep = 15;
    let lastDisplayedUsername = null; // Variable to track the last displayed username
    // Initialize a map to track message counts for unique usernames
    const usernameMessageCountMap = new Map();
    // Store the current chat logs URL for clipboard copy.
    let chatLogsUrlForCopy = ''; // Store the current chat logs URL for copying

    // Function to load the total message count into the placeholder without replacing the existing text
    function loadTotalMessageCount() {
      if (chatLogsContainer.childElementCount > 0) {
        chatlogsSearchInput.placeholder += ` | Total messages: ${chatLogsContainer.childElementCount}`;
      }
    }

    // Function to load and display chat logs into the container
    const loadChatLogs = async (date) => {
      // Normalize date input to 'yyyy-mm-dd' format, supporting 'yyyy:mm:dd' format as well
      const normalizeDate = date => /^\d{4}:\d{2}:\d{2}$/.test(date) ? date.replace(/:/g, '-') : date;
      // Normalize and format the date
      const formattedDate = new Intl.DateTimeFormat('en-CA').format(new Date(normalizeDate(date)));

      // Check if the provided date is out of bounds (less than minDate or greater than today)
      if (formattedDate < minDate || formattedDate > today) {
        alert(formattedDate < minDate ? `The selected date cannot be earlier than ${minDate}.` : "You cannot load a future date.");
        return; // Exit the function if the date is invalid
      }

      // Call the updateDateInputAndTitle function with the formattedDate
      updateDateInputAndTitle(formattedDate);

      // Fetch chat logs and pass the chatLogsContainer as the parent container
      const { chatlogs, url, size, info, error } = await fetchChatLogs(formattedDate, chatLogsContainer);

      // Convert size to KB
      const sizeInKB = (size / 1024).toFixed(2);

      // Set placeholder for size in KB, info, or error
      chatlogsSearchInput.placeholder = error ? `Error: ${error}` : (info ? `Limit reached: ${sizeInKB} KB` : info || `Size: ${sizeInKB} KB`);

      // Assign the fetched URL to the chatLogsUrlForCopy variable
      chatLogsUrlForCopy = url;

      // Clear previous counts
      usernameMessageCountMap.clear();

      chatlogs.forEach(async ({ time, username, message }) => {
        // Update message count for each unique username
        usernameMessageCountMap.set(username, (usernameMessageCountMap.get(username) || 0) + 1);

        // Create a container for each message
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-item');
        messageContainer.style.padding = '0.2em'; // Set padding for the message container
        messageContainer.style.display = 'inline-flex';
        messageContainer.style.cursor = 'pointer'; // Set cursor to pointer on hover for click effect
        messageContainer.style.alignItems = 'start'; // Align items to center
        // Attach click event to scroll the chat logs container to the middle of the parent container on LMB click
        messageContainer.addEventListener('click', async (event) => {
          // If the clicked element or one of its parents is an anchor, exit early.
          if (event.target.closest('a')) return;
          // Call toggleMessagesVisibility to show all messages and scroll when a message is clicked on visibleMentionMessages is true
          if (visibleMessages) await toggleMessagesVisibility();
          chatlogsSearchInput.value.length > 0 && (chatlogsSearchInput.value = '');
          // Use helper function to scroll the chat logs container to the middle of the parent container
          await scrollMessagesToMiddle(chatLogsContainer, messageContainer);
        });

        // Create time element
        const timeElement = document.createElement('span');
        timeElement.className = 'message-time';

        // Update the timeElement's text content with the adjusted time
        timeElement.textContent = time;
        timeElement.style.color = 'darkseagreen';
        timeElement.style.margin = '0 0.4em';
        timeElement.style.cursor = 'pointer';
        timeElement.style.transition = 'color 0.2s ease'; // Smooth color transition
        timeElement.style.height = 'fit-content';

        // Add hover effect to change color to light green
        timeElement.addEventListener('mouseover', () => {
          timeElement.style.color = 'lightgreen';
        });

        // Revert back to original color on mouse out
        timeElement.addEventListener('mouseout', () => {
          timeElement.style.color = 'darkseagreen';
        });

        // Open the chat log URL on click
        timeElement.addEventListener('click', function () {
          const url = `https://klavogonki.ru/chatlogs/${date}.html#${time}`;
          window.open(url, '_blank', 'noopener,noreferrer');
        });

        // Create username element
        const usernameElement = document.createElement('span');
        usernameElement.className = 'message-username';
        usernameElement.textContent = username; // Use the original username for display
        usernameElement.style.cursor = 'pointer';
        usernameElement.style.margin = '0 0.4em';
        usernameElement.style.height = 'fit-content';

        // Add click event to navigate to the user's profile or shake the username if userId is not found
        usernameElement.addEventListener('click', async () => {
          const userId = await getUserId(username); // Fetch the user ID on click

          if (userId) {
            const url = `https://klavogonki.ru/u/#/${userId}/`;
            window.open(url, '_blank', 'noopener,noreferrer');
          } else {
            // Add shake effect if userId doesn't exist
            addShakeEffect(usernameElement); // Define this function for the shake effect
          }
        });

        // Check if the hue for this username is already stored
        let hueForUsername = usernameHueMap[username]; // Use the original username as the key

        // If the hue is not stored, generate a new random hue with the specified step
        if (!hueForUsername) {
          hueForUsername = Math.floor(Math.random() * (210 / hueStep)) * hueStep; // Limit hue to a maximum of 210
          // Store the generated hue for this username
          usernameHueMap[username] = hueForUsername; // Store hue using the original username as the key
        }

        // Apply the hue color to the username element
        usernameElement.style.color = `hsl(${hueForUsername}, 80%, 50%)`;

        // Create message text element
        const messageTextElement = document.createElement('span');
        messageTextElement.className = 'message-text';
        messageTextElement.style.color = 'lightsteelblue';
        messageTextElement.style.margin = '0 0.4em';
        messageTextElement.style.overflowWrap = 'anywhere';
        messageTextElement.style.height = 'fit-content';

        // Replace smiley codes with <img> tags, and then wrap links with <a> tags
        messageTextElement.innerHTML = message
          // Replace smiley codes like :word: with <img> tags
          .replace(/:(?=\w*[a-zA-Z])(\w+):/g,
            (_, word) => `<img src="/img/smilies/${word}.gif" alt=":${word}:" title=":${word}:" class="smile">`
          )
          // Wrap http and https links with <a> tags
          .replace(/(https?:\/\/[^\s]+)/gi,
            (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
          );

        // Apply margin for the first message of a new user
        messageContainer.style.marginTop = lastDisplayedUsername !== username ? '0.6em' : '';

        // Update the last displayed username
        lastDisplayedUsername = username;

        // Append elements to the message container
        messageContainer.appendChild(timeElement);
        messageContainer.appendChild(usernameElement);
        messageContainer.appendChild(messageTextElement);

        // Append the message container to the chat logs container
        chatLogsContainer.appendChild(messageContainer);
      });

      // Call renderActiveUsers to update the display of active users based on their message counts
      renderActiveUsers(usernameMessageCountMap, chatLogsPanel, chatlogsSearchInput);

      requestAnimationFrame(() => {
        convertImageLinksToImage('chatlogsMessages');
        convertVideoLinksToPlayer('chatlogsMessages');
        processEncodedLinks('chatlogsMessages'); // Decodes links within the chat logs section.
        highlightMentionWords('chatlogsMessages');
        chatLogsContainer.scrollTop = chatLogsContainer.scrollHeight; // Scroll to the very bottom

        // Update the media and mention counters
        updateMediaAndMentionCounters();
        // Call the function to load the total message count once
        loadTotalMessageCount();
        // Call the filter function with the updated input value
        chatlogsSearchInput.value.length > 0 && filterItems(chatlogsSearchInput.value);
      });

    };

    // Renders the active users based on their message counts from the provided map
    function renderActiveUsers(usernameMessageCountMap, parentContainer, searchField) {
      // Check if active users should be shown
      if (localStorage.getItem('shouldShowActiveUsers') === 'shown') {
        // Check if the activeUsers container already exists
        let activeUsers = parentContainer.querySelector('.active-users');

        // If it doesn't exist, create it
        if (!activeUsers) {
          activeUsers = document.createElement('div');
          activeUsers.className = 'active-users';
          activeUsers.style.padding = '1em';
          activeUsers.style.height = 'calc(100% - 1em)';
          activeUsers.style.width = 'fit-content';
          activeUsers.style.overflowY = 'auto';
          activeUsers.style.overflowX = 'hidden';
          activeUsers.style.gridArea = 'users';
          activeUsers.style.display = 'flex';
          activeUsers.style.flexDirection = 'column';

          // Append the newly created activeUsers container to the parent container
          parentContainer.appendChild(activeUsers);
        }

        // Sort usernames by message count in descending order
        const sortedUsernames = Array.from(usernameMessageCountMap.entries())
          .sort(([, countA], [, countB]) => countB - countA); // Sort in descending order

        // Clear previous user list in the activeUsers container
        activeUsers.innerHTML = ''; // Clear previous user list

        // Append sorted users to the activeUsers container
        sortedUsernames.forEach(([username, count]) => {
          // Create a user element
          const userElement = document.createElement('div');
          userElement.className = 'active-user-item';
          userElement.style.display = 'flex';
          userElement.style.height = 'fit-content';
          userElement.style.alignItems = 'center';
          userElement.style.justifyContent = 'left';
          userElement.style.margin = '0.2em 0';
          userElement.style.cursor = 'pointer';
          userElement.style.transition = 'filter 0.15s';

          // Compact event listeners for mouse over and mouse out
          userElement.addEventListener('mouseover', () => (userElement.style.filter = 'brightness(0.8)'));
          userElement.addEventListener('mouseout', () => (userElement.style.filter = 'brightness(1)'));

          // Add click event to populate the search input with the clicked username
          userElement.addEventListener('click', () => {
            const currentValue = chatlogsSearchInput.value.trim();
            const usernameEntry = isCtrlKeyPressed ? `, ${username}` : username;

            // Toggle input value: clear if same username clicked, otherwise add or replace
            chatlogsSearchInput.value = (currentValue === username)
              ? ''
              : (isCtrlKeyPressed && !currentValue.includes(username))
                ? currentValue + usernameEntry
                : username;

            // Call the filter function with the updated input value
            filterItems(chatlogsSearchInput.value);
          });

          // Create nickname element
          const nicknameElement = document.createElement('span');
          nicknameElement.className = 'active-user-name';
          nicknameElement.textContent = username;
          nicknameElement.style.padding = '0.4em';

          // Fetch the color for the username from the hue map
          const userHue = usernameHueMap[username] || 0; // Fallback to 0 if hue not found
          nicknameElement.style.color = `hsl(${userHue}, 80%, 50%)`; // Apply the hue color

          // Create message count element
          const messageCountElement = document.createElement('span');
          messageCountElement.className = 'active-user-messages-count';
          messageCountElement.textContent = count;
          messageCountElement.style.padding = '0.4em';
          messageCountElement.style.color = `hsl(${userHue}, 80%, 50%)`; // Apply the hue color
          messageCountElement.style.backgroundColor = `hsla(${userHue}, 80%, 50%, 0.2)`;
          messageCountElement.style.setProperty('border-radius', '0.2em', 'important');

          // Append elements to user element
          userElement.appendChild(messageCountElement);
          userElement.appendChild(nicknameElement);

          // Append user element to activeUsers container
          activeUsers.appendChild(userElement);
        });
      }
    }

    // Load chat logs based on the provided date or default to today's date
    const dateToLoad = personalMessagesDate || today; // Use personalMessagesDate if available
    await loadChatLogs(dateToLoad); // Load chat logs for the determined date
    // Check if personalMessagesDate is given as parameter or null to show the date input field
    if (personalMessagesDate) showDateInput(dateInput); // Show the date input field

    // Set the max attribute to today's date
    dateInput.max = today; // Set the maximum value to today's date
    // Set the min attribute to '2012-02-12'
    dateInput.min = minDate; // Assign the minimum date
    dateInput.value = dateToLoad; // Set the value to the date to load
    dateInputToggle.title = `Current date: ${dateToLoad}`; // Update the title with the selected date

    // Add an event listener for the date input change
    dateInput.addEventListener('change', async (event) => {
      const selectedDate = event.target.value; // Get the selected date
      await loadChatLogs(selectedDate); // Load chat logs for the selected date
      dateInputToggle.title = `Current date: ${selectedDate}`; // Update the title with the selected date
    });

    // Retrieves details from message items including usernames and message text.
    function getMessageDetails(messageItems) {
      // Cache message details including text, username, and message content
      return messageItems.map(item => {
        const usernameElement = item.querySelector('.message-username');
        const username = usernameElement ? usernameElement.textContent.toLowerCase().trim() : ''; // Get username text, if available
        const messageTextElement = item.querySelector('.message-text');
        const messageText = messageTextElement ? messageTextElement.textContent.toLowerCase().trim() : ''; // Get message text, if available
        return { username, messageText };
      });
    }

    // Filters message items based on the provided query and displays matching messages.
    function filterItems(query) {
      // If the query contains only digits, hyphens, or colons, do nothing
      if (/^[\d-:]+$/.test(query.trim())) return;

      // Helper function to replace underscores and hyphens with spaces and convert to lowercase
      function normalizeText(text) {
        return text.replace(/[_-]/g, ' ').toLowerCase(); // Replaces _ and - with spaces
      }

      // Normalize query by removing underscores and hyphens, then trimming spaces
      const queryWithoutSymbols = normalizeText(query).trim();

      // Retrieve message items within the filterItems function
      const messageItems = Array.from(document.querySelectorAll('.chat-logs-container > .message-item'));

      const messageDetails = getMessageDetails(messageItems); // Get the message details
      const isEmptyQuery = !queryWithoutSymbols;

      // Split query by commas and trim parts
      const queryParts = queryWithoutSymbols.split(',').map(part => part.trim()).filter(Boolean);

      // Count matching usernames
      const matchingUsernamesCount = queryParts.filter(part =>
        messageDetails.some(detail => normalizeText(detail.username) === part)
      ).length;

      // Determine if User Mode is active (2 or more matching usernames)
      const isUserMode = matchingUsernamesCount >= 2;

      // Filter message items based on the query
      messageItems.forEach((item, index) => {
        const messageContainer = item.closest('.message-item'); // Get the closest message item container
        const messageDetailsItem = messageDetails[index];

        let shouldDisplay = false;

        // Normalize underscores and hyphens in the username and message text
        const normalizedUsername = normalizeText(messageDetailsItem.username);
        const normalizedMessageText = normalizeText(messageDetailsItem.messageText);

        if (isEmptyQuery) {
          // Display all messages if the query is empty
          shouldDisplay = true;
        } else if (isUserMode) {
          // User Mode: Match only by username
          shouldDisplay = queryParts.some(part => normalizedUsername === part);
        } else {
          // Simple Mode: Treat the entire query (including commas) as part of the text search
          shouldDisplay = normalizedUsername.includes(queryWithoutSymbols) ||
            normalizedMessageText.includes(queryWithoutSymbols);
        }

        // Toggle visibility based on shouldDisplay using content visibility and font size
        messageContainer.style.contentVisibility = shouldDisplay ? 'visible' : 'hidden';
        // Set font size to 0 for hidden messages to maintain layout or remove the font size property
        messageContainer.style.fontSize = shouldDisplay ? '' : '0';
      });
    }

    // Define the event handler function for chat logs panel
    panelsEvents.handleChatLogsKeydown = (event) => { // Assign the function to the object
      if (event.key === 'Escape') {
        triggerTargetElement(chatLogsPanel, 'hide');
        triggerDimmingElement('hide');
        document.removeEventListener('keydown', panelsEvents.handleChatLogsKeydown); // Remove the event listener
      }
    };

    // Attach the event listener
    document.addEventListener('keydown', panelsEvents.handleChatLogsKeydown);
  }

  // CREATE CHAT LOGS BUTTON (END)


  // CREATE PANEL GRAPHICAL SETTINGS (START)

  // Global function to handle file input and process uploaded settings
  async function handleUploadSettings(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Return a Promise to handle the asynchronous reading
      return new Promise((resolve, reject) => {
        reader.onload = function (e) {
          const jsonData = e.target.result; // Get the raw JSON string
          try {
            const settingsData = JSON.parse(jsonData); // Attempt to parse the JSON data
            // Call a function to process the uploaded settings data
            processUploadedSettings(settingsData);
            resolve(); // Resolve the promise if successful
          } catch (error) {
            console.error('Error parsing JSON data:', error.message); // Log the error message
            console.error('Invalid JSON:', jsonData); // Log the raw JSON string for debugging
            // Optional: Notify the user about the error
            alert('Failed to parse JSON data. Please check the format and try again.');
            reject(error); // Reject the promise on error
          }
        };

        reader.onerror = function (e) {
          console.error('Error reading file:', e.target.error); // Handle file reading errors
          reject(e.target.error); // Reject the promise on error
        };

        reader.readAsText(file); // Read the file as text
      });
    }
  }

  function handleDownloadSettings(settingsData) {
    if (!settingsData || typeof settingsData !== 'object') {
      console.error('Invalid settings data for download.');
      alert('Cannot export settings. Please try again.');
      return;
    }

    try {
      const tabSize2 = '  ';
      const tabSize4 = '    ';

      // Format usersToTrack
      const usersToTrackFormatted = settingsData.usersToTrack
        .map((user) => `${tabSize4}${JSON.stringify(user)}`)
        .join(',\n');

      // Format username replacements
      const replacementsFormatted = settingsData.usernameReplacements
        ?.map(replacement => `${tabSize4}${JSON.stringify(replacement)}`)
        .join(',\n') || '';

      // Format toggle settings
      const toggleFormatted = settingsData.toggle
        .map(toggle => `${tabSize4}${JSON.stringify(toggle)}`)
        .join(',\n');

      // Build JSON structure
      const jsonData = '{\n' +
        `${tabSize2}"usersToTrack": [\n` +
        `${usersToTrackFormatted}\n` +
        `${tabSize2}],\n` +
        `${tabSize2}"mentionKeywords": [\n` +
        `${settingsData.mentionKeywords.map(keyword => `${tabSize4}"${keyword}"`).join(',\n')}\n` +
        `${tabSize2}],\n` +
        `${tabSize2}"usernameReplacements": [\n` + // Added replacements section
        `${replacementsFormatted}\n` +
        `${tabSize2}],\n` +
        `${tabSize2}"moderator": [\n` +
        `${settingsData.moderator.map(moderator => `${tabSize4}"${moderator}"`).join(',\n')}\n` +
        `${tabSize2}],\n` +
        `${tabSize2}"ignored": [\n` +
        `${settingsData.ignored.map(user => `${tabSize4}"${user}"`).join(',\n')}\n` +
        `${tabSize2}],\n` +
        `${tabSize2}"toggle": [\n` +
        `${toggleFormatted}\n` +
        `${tabSize2}]\n` +
        '}';

      // Generate filename
      const currentDate = new Intl.DateTimeFormat('en-CA').format(new Date());
      const filename = `KG_Chat_Empowerment_Settings_${currentDate}.json`;

      // Create and trigger download
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.download = filename;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting settings:', error);
      alert('Failed to export settings. Please try again.');
    }
  }

  // Function to retrieve settings from localStorage and combine them into a single object
  function getSettingsData() {
    // Retrieve data from localStorage using the appropriate keys
    const usersToTrack = JSON.parse(localStorage.getItem('usersToTrack')) || [];
    const mentionKeywords = JSON.parse(localStorage.getItem('mentionKeywords')) || [];
    const usernameReplacements = JSON.parse(localStorage.getItem('usernameReplacements')) || [];
    const moderator = JSON.parse(localStorage.getItem('moderator')) || [];
    const ignored = JSON.parse(localStorage.getItem('ignored')) || [];
    const toggle = JSON.parse(localStorage.getItem('toggle')) || [];

    // Combine the retrieved data into a single object
    const settingsData = {
      usersToTrack: usersToTrack,
      mentionKeywords: mentionKeywords,
      usernameReplacements: usernameReplacements,
      moderator: moderator,
      ignored: ignored,
      toggle: toggle
    };

    return settingsData;
  }

  // Create a button to upload and apply new settings
  function createSettingsButton() {
    // Create a new element with class 'settings-button'
    const showSettingsButton = document.createElement('div');
    // Add the class 'settings-button' to the button
    showSettingsButton.classList.add('settings-button');

    showSettingsButton.title = 'Show Settings Panel';

    // Apply base button styles
    applyBaseButtonStyles(showSettingsButton);

    // Add settings-specific styles directly
    showSettingsButton.style.position = 'relative';

    // Add settings icon to the button (use the SVG icon you provided)
    showSettingsButton.innerHTML = settingsSVG;

    // Create a hidden file input for uploading settings
    const importFileInput = document.createElement('input');
    importFileInput.type = 'file';
    importFileInput.accept = '.json'; // Specify the file type if needed (e.g., JSON)
    importFileInput.style.display = 'none'; // Hide the file input

    // Add an event listener to handle file selection
    importFileInput.addEventListener('change', handleUploadSettings);

    showSettingsButton.addEventListener('click', event => {
      addPulseEffect(showSettingsButton);
      if (isAltKeyPressed) handleDownloadSettings(getSettingsData());
      if (isCtrlKeyPressed) importFileInput.click();
      if (isAltKeyPressed || isCtrlKeyPressed) return;
      showSettingsPanel();
    });

    // Append the file input to the button
    showSettingsButton.appendChild(importFileInput);

    // Append the button to the existing panel
    empowermentButtonsPanel.appendChild(showSettingsButton);
  }

  // Call the function to create the settings button
  createSettingsButton();

  // Save the current settings to localStorage
  function saveSettingsToLocalStorage() {
    localStorage.setItem('usersToTrack', JSON.stringify(usersToTrack));
    localStorage.setItem('mentionKeywords', JSON.stringify(mentionKeywords));
    localStorage.setItem('usernameReplacements', JSON.stringify(usernameReplacements));
    localStorage.setItem('moderator', JSON.stringify(moderator));
    localStorage.setItem('ignored', JSON.stringify(ignored));
    localStorage.setItem('toggle', JSON.stringify(toggle));
  }

  // Process and apply uploaded settings
  function processUploadedSettings({
    usersToTrack: u = [],
    mentionKeywords: mk = [],
    usernameReplacements: ur = [],
    moderator: md = [],
    ignored: i = [],
    toggle: t = []
  }) {
    // Ensure the uploaded values are valid arrays
    usersToTrack = Array.isArray(u) ? u : usersToTrack;
    mentionKeywords = Array.isArray(mk) ? mk : mentionKeywords;
    usernameReplacements = Array.isArray(ur) ? ur : usernameReplacements;
    moderator = Array.isArray(md) ? md : moderator;
    ignored = Array.isArray(i) ? i : ignored;
    toggle = Array.isArray(t) ? t : toggle;

    // Save to localStorage after applying the settings
    saveSettingsToLocalStorage();
    console.log('Uploaded settings applied:', {
      usersToTrack,
      mentionKeywords,
      usernameReplacements, // Added to log
      moderator,
      ignored,
      toggle
    });
  }

  // Function to display the settings panel
  function showSettingsPanel() {
    // Check if the panel already exists
    const existingPanel = document.querySelector('.settings-panel');
    if (existingPanel) {
      existingPanel.remove(); // Remove the settings panel
      triggerDimmingElement('hide');
      return; // Return immediately to prevent further execution
    }

    // Remove any previous panel before creating a new one
    removePreviousPanel();

    // Create the settings panel container
    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'settings-panel popup-panel';

    // Set initial styles
    settingsPanel.style.opacity = '0';
    settingsPanel.style.backgroundColor = '#1b1b1b';
    settingsPanel.style.setProperty('border-radius', '0.6em', 'important');
    settingsPanel.style.position = 'fixed';
    settingsPanel.style.top = '100px';
    settingsPanel.style.left = '50%';
    settingsPanel.style.transform = 'translateX(-50%)';
    settingsPanel.style.width = '50vw';
    settingsPanel.style.height = '80vh';
    settingsPanel.style.zIndex = '999';
    settingsPanel.style.minWidth = '1000px';
    settingsPanel.style.display = 'grid';
    settingsPanel.style.gridTemplateColumns = '1fr';
    settingsPanel.style.gridTemplateRows = 'min-content';
    settingsPanel.style.gridTemplateAreas = `
      "header header"
      "settings scroll"`;

    // Define the event handler function for settings panel
    panelsEvents.handleSettingsKeydown = (event) => { // Assign the function to the object
      if (event.key === 'Escape') {
        triggerTargetElement(settingsPanel, 'hide');
        triggerDimmingElement('hide');
        document.removeEventListener('keydown', panelsEvents.handleSettingsKeydown); // Remove the event listener
      }
    };

    // Attach the event listener
    document.addEventListener('keydown', panelsEvents.handleSettingsKeydown);

    // Create a container div for the panel header
    const panelHeaderContainer = document.createElement('div');
    panelHeaderContainer.className = 'panel-header';
    panelHeaderContainer.style.display = 'flex';
    panelHeaderContainer.style.flexDirection = 'row';
    panelHeaderContainer.style.justifyContent = 'flex-end'; // Aligns to the right
    panelHeaderContainer.style.padding = '0.6em';
    panelHeaderContainer.style.gridArea = 'header';

    // Helper function to apply common styles to a button
    function applyHeaderButtonStyles(button, backgroundColor, margin = '0 0.5em') {
      button.style.backgroundColor = backgroundColor;
      button.style.width = '48px';
      button.style.height = '48px';
      button.style.display = 'flex';
      button.style.justifyContent = 'center';
      button.style.alignItems = 'center';
      button.style.cursor = 'pointer';
      button.style.setProperty('border-radius', '0.2em', 'important');
      button.style.margin = margin; // Set margin using the provided value
      button.style.filter = 'brightness(1)';
      button.style.transition = 'filter 0.3s ease, opacity 0.3s ease';
    }

    // Create a close button with the provided SVG icon
    const closePanelButton = document.createElement('div');
    closePanelButton.className = 'close-panel-button';
    closePanelButton.innerHTML = closeSVG;
    closePanelButton.title = 'Close panel';
    // Apply common styles using the helper function
    applyHeaderButtonStyles(closePanelButton, 'darkolivegreen', '0 0 0 0.5em');

    // Add a click event listener to the close panel button
    closePanelButton.addEventListener('click', () => {
      // Fade out the settings panel when the close button is clicked
      triggerTargetElement(settingsPanel, 'hide');
      triggerDimmingElement('hide');
    });

    // Create a clear cache button with the provided SVG icon
    const clearCacheButton = document.createElement('div');
    clearCacheButton.className = 'clear-cache-button';
    clearCacheButton.innerHTML = trashSVG;
    clearCacheButton.title = 'Clear settings';

    // Apply common styles using the helper function
    applyHeaderButtonStyles(clearCacheButton, 'brown');

    // Add a click event listener to the clear cache button
    clearCacheButton.addEventListener('click', () => {
      clearSettingsContainers();
    })

    // Create an import button with the provided SVG icon
    const importSettingsButton = document.createElement('div');
    importSettingsButton.className = 'import-settings-button';
    importSettingsButton.innerHTML = importSVG;
    importSettingsButton.title = 'Import settings';

    // Apply common styles using the helper function
    applyHeaderButtonStyles(importSettingsButton, '#502f6b');

    // Create a save button with the provided SVG icon
    const saveSettingsButton = document.createElement('div');
    saveSettingsButton.className = 'save-settings-button';
    saveSettingsButton.innerHTML = saveSVG;
    saveSettingsButton.title = 'Save settings';
    saveSettingsButton.style.opacity = '0';

    function initializeSaveButtonLogic(saveButton) {
      const container = document.querySelector('.settings-content-container');
      if (!container) return console.error("Container not found.");

      const showButton = () => (saveButton.style.opacity = '1');
      const hideButton = () => (saveButton.style.opacity = '0');

      // Get previous values from localStorage
      const previousValues = getSettingsData();

      const handleInputChange = () => {
        const currentValues = {
          usersToTrack: [],
          mentionKeywords: [],
          usernameReplacements: [],
          moderator: [],
          ignored: [],
          toggle: []
        };

        // Process tracked items
        container.querySelectorAll('.settings-tracked-container .tracked-item').forEach(item => {
          const usernameField = item.querySelector('.tracked-username-field');
          const genderField = item.querySelector('.tracked-gender-select');
          const pronunciationField = item.querySelector('.tracked-pronunciation-field');
          const snowflakeButton = item.querySelector('.assigned-thawed-config, .assigned-frozen-config');

          const usernameValue = usernameField ? usernameField.value.trim() : '';
          const genderValue = genderField ? genderField.value.trim() : '';
          const pronunciationValue = pronunciationField ? pronunciationField.value.trim() : '';
          // Determine the state based on the button's class
          const state = snowflakeButton.classList.contains('assigned-frozen-config') ? 'frozen' : 'thawed';

          // Push current values to usersToTrack
          currentValues.usersToTrack.push({
            name: usernameValue,
            gender: genderValue,
            pronunciation: pronunciationValue,
            state
          });
        });

        // Create a set of tracked usernames (case-insensitive)
        const trackedNames = new Set(
          currentValues.usersToTrack.map(user => user.name.toLowerCase())
        );

        // Process mention items
        container.querySelectorAll('.settings-mention-container .mention-item').forEach(item => {
          const mentionField = item.querySelector('.mention-field');
          const mentionValue = mentionField ? mentionField.value.trim() : '';
          currentValues.mentionKeywords.push(mentionValue);
        });

        // Process replacement items
        container.querySelectorAll('.settings-replacement-container .replacement-item').forEach(item => {
          const originalField = item.querySelector('.replacement-original-field');
          const replacementField = item.querySelector('.replacement-field');
          const originalValue = originalField ? originalField.value.trim() : '';
          const replacementValue = replacementField ? replacementField.value.trim() : '';

          // If the original value exists in tracked users, prevent creating a new replacement item.
          if (trackedNames.has(originalValue.toLowerCase())) {
            // Optionally, mark the field as invalid to notify the user.
            originalField.classList.add('input-error');
            addShakeEffect(originalField);
            return; // Skip pushing this replacement item.
          } else {
            originalField.classList.remove('input-error');
          }

          currentValues.usernameReplacements.push({
            original: originalValue,
            replacement: replacementValue
          });
        });

        // Process moderator
        container.querySelectorAll('.settings-moderator-container .moderator-item').forEach(item => {
          const moderatorField = item.querySelector('.moderator-field');
          const moderatorValue = moderatorField ? moderatorField.value.trim() : '';
          currentValues.moderator.push(moderatorValue);
        });

        // Process ignored items
        container.querySelectorAll('.settings-ignored-container .ignored-item').forEach(item => {
          const ignoredField = item.querySelector('.ignored-field');
          const ignoredValue = ignoredField ? ignoredField.value.trim() : '';
          currentValues.ignored.push(ignoredValue);
        });

        // Process toggle (yes/no) settings based on select elements within each toggle-setting item
        container.querySelectorAll('.settings-toggle-container .toggle-item').forEach(item => {
          const descriptionElement = item.querySelector('.toggle-description'); // Get the description element
          const selectElement = item.querySelector('.toggle-select'); // Select the toggle (select) element within the current toggle-item
          const selectedValue = selectElement ? selectElement.value.trim() : 'no'; // Default to 'no' if not selected

          // Get the data-toggle-name attribute value from the descriptionElement
          const toggleName = descriptionElement.getAttribute('data-toggle-name');

          // Push the current toggle setting as an object into the toggle array
          if (toggleName) {
            currentValues.toggle.push({
              name: toggleName, // Store the toggle name
              option: selectedValue // Store the selected value directly
            });
          }
        });

        // Check if any values have changed compared to previous state
        const valuesChanged = JSON.stringify(previousValues) !== JSON.stringify(currentValues);

        // Show or hide the save button based on whether values have changed
        valuesChanged ? showButton() : hideButton();

        return currentValues; // Return current values for saving later
      };

      // Attach click event to save settings when there are changes
      saveButton.addEventListener('click', () => {
        const currentValues = handleInputChange(); // Get current values before saving
        processUploadedSettings(currentValues); // Process and save the current settings
        // Update previousValues to the current state after saving
        Object.assign(previousValues, currentValues);
        hideButton(); // Optionally hide the button after saving
      });

      // Add input listeners to existing fields
      container.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('input', handleInputChange);
      });

      // Function to attach event listeners to dynamically added input and select elements
      const attachEventListeners = (element) => {
        if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
          element.addEventListener('input', handleInputChange);
          // console.log('Listener attached to:', element);
        } else {
          // Check its children for input or select elements
          element.querySelectorAll('input, select').forEach((child) => {
            child.addEventListener('input', handleInputChange);
            // console.log('Listener attached to child:', child);
          });
        }
      };

      // Create a mutation observer to monitor changes in the target container
      const observer = new MutationObserver(debounce((mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // console.log('Added:', node);
                attachEventListeners(node); // Attach event listeners to new elements
              }
            });

            mutation.removedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // console.log('Removed:', node);
                handleInputChange(); // Call handleInputChange to check the state after any changes
              }
            });
          }
        });
      }, 300));

      // Start observing the target container for child list changes
      observer.observe(container, {
        childList: true,
        subtree: true, // Observe all descendants as well
      });
    }

    // Apply common styles using the helper function
    applyHeaderButtonStyles(saveSettingsButton, '#2f6b63');

    // Create a hidden file input for importing settings
    const importFileInput = document.createElement('input');
    importFileInput.type = 'file';
    importFileInput.accept = '.json'; // Specify the file type
    importFileInput.style.display = 'none'; // Hide the file input

    // Add an event listener for the import file input
    importFileInput.addEventListener('change', async (event) => {
      await handleUploadSettings(event); // Wait for processing uploaded settings
      // Clear the containers before populating new data
      clearSettingsContainers();
      // Populate the UI with updated settings
      populateSettings();
    });

    // Function to clear the content of settings containers
    function clearSettingsContainers() {
      const containers = [
        '.settings-tracked-container',
        '.settings-mention-container',
        '.settings-replacement-container',
        '.settings-moderator-container',
        '.settings-ignored-container',
        '.settings-toggle-container'
      ];

      containers.forEach(selector => {
        const container = document.querySelector(selector);
        if (container) container.replaceChildren(); // Clear the container

        const addButton = container.querySelector('.add-setting-button');
        // Re-add the .add-setting-button if it was found
        addButton && container.appendChild(addButton);
      });
    }

    // Add a click event listener to the import button
    importSettingsButton.addEventListener('click', () => {
      importFileInput.click(); // Trigger file input click
    });

    // Append the file input to the import button
    importSettingsButton.appendChild(importFileInput);

    // Create an export button with the provided SVG icon
    const exportSettingsButton = document.createElement('div');
    exportSettingsButton.className = 'export-settings-button';
    exportSettingsButton.innerHTML = exportSVG;
    exportSettingsButton.title = 'Export settings';

    // Apply common styles using the helper function
    applyHeaderButtonStyles(exportSettingsButton, '#2f4c6b');

    // Example of how to use the getSettingsData function in the export event
    exportSettingsButton.addEventListener('click', function () {
      const settingsData = getSettingsData(); // Retrieve the settings data
      handleDownloadSettings(settingsData); // Pass the retrieved settings data to the download function
    });

    // Append the buttons to the panel header container
    panelHeaderContainer.appendChild(saveSettingsButton);
    panelHeaderContainer.appendChild(importSettingsButton);
    panelHeaderContainer.appendChild(exportSettingsButton);
    panelHeaderContainer.appendChild(clearCacheButton);
    panelHeaderContainer.appendChild(closePanelButton);

    // Append the header to the settings panel
    settingsPanel.appendChild(panelHeaderContainer);

    // Append the header to the settings panel
    settingsPanel.appendChild(panelHeaderContainer);

    // Create a container for the settings content
    const settingsContainer = document.createElement('div');
    settingsContainer.className = 'settings-content-container';
    settingsContainer.style.overflowY = 'auto'; // Enable scrolling for settings content
    settingsContainer.style.height = 'calc(100% - 0.5em)'; // Adjust height considering header
    settingsContainer.style.padding = '1em';
    settingsContainer.style.gridArea = 'settings';

    // Helper function to assign styles to description elements
    function assignDescriptionStyles(element) {
      element.style.position = 'relative';
      element.style.font = '1em Montserrat';
      element.style.color = 'burlywood';
      element.style.backgroundColor = 'rgba(222, 184, 135, 0.1)';
      element.style.width = 'fit-content';
      element.style.margin = '0 0 1em';
      element.style.padding = '0.4em 0.8em';
      element.style.setProperty('border-radius', '0.4em', 'important');
      element.style.left = '50%';
      element.style.transform = 'translateX(-50%)';
    }

    // Helper function to assign styles to hide elements
    function assignHideElementStyles(element) {
      element.style.position = 'relative';
      element.style.font = '1em Montserrat';
      element.style.color = 'lightgreen';
      element.style.backgroundColor = 'rgba(222, 184, 135, 0.1)';
      element.style.margin = '0 0 3em 0';
      element.style.padding = '0.4em 0.8em';
      element.style.setProperty('border-radius', '0.4em', 'important');
      element.style.left = '50%';
      element.style.transform = 'translateX(-50%)';
      element.style.cursor = 'pointer';
      element.style.transition = 'background-color 0.3s ease';
      element.style.border = 'none';

      // Hover effect
      element.addEventListener('mouseenter', () => {
        element.style.backgroundColor = 'rgba(222, 184, 135, 0.25)';
      });

      // Restore original style when mouse leaves
      element.addEventListener('mouseleave', () => {
        element.style.backgroundColor = 'rgba(222, 184, 135, 0.1)';
      });
    }

    // Array of settings types with corresponding emoji
    const settingsTypes = [
      { type: 'tracked', emoji: '👀' },
      { type: 'mention', emoji: '📢' },
      { type: 'replacement', emoji: '♻️' },
      { type: 'moderator', emoji: '⚔️' },
      { type: 'ignored', emoji: '🛑' },
      { type: 'toggle', emoji: '🔘' }
    ];

    // Loop through each type and create description and container elements
    settingsTypes.forEach(({ type, emoji }) => {
      const description = document.createElement('div');
      description.className = `settings-${type}-description`; // Add specific class for description

      assignDescriptionStyles(description);

      // Create the description container directly
      const container = document.createElement('div');
      container.className = `settings-${type}-container`; // Add specific class for container

      // Set the text content with first letter capitalized and append emoji
      description.textContent = `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} ${emoji}`;

      settingsContainer.appendChild(description);
      settingsContainer.appendChild(container);
    });

    // Append the settings content container to the settings panel
    settingsPanel.appendChild(settingsContainer);

    // Applies common styles to an settings input field element
    function styleInput(input) {
      input.style.height = '30px';
      input.style.maxWidth = '200px';
      input.style.minWidth = '150px';
      input.style.padding = '0.4em';
      input.style.font = '1em Montserrat';
      input.style.fontFamily = 'Montserrat';
      input.style.color = 'bisque';
      input.style.setProperty('border-radius', '0.2em', 'important');
      input.style.boxSizing = 'border-box';
      input.style.backgroundColor = 'rgb(17,17,17)';
      input.style.border = '1px solid rgb(34,34,34)';
    }

    /* Applies common styles to a button element for saving or removing actions.
    * @param {HTMLElement} button - The button element to style.
    * @param {string} strokeColor - The stroke color for the button.
    * @param {string} backgroundColor - The background color for the button.
    * @param {boolean} disabled - Whether the button should be styled as disabled.
    */
    function styleButton(button, strokeColor, backgroundColor, disabled) {
      button.style.stroke = strokeColor;
      button.style.width = '30px';
      button.style.height = '30px';
      button.style.display = 'flex';
      button.style.justifyContent = 'center';
      button.style.alignItems = 'center';
      button.style.backgroundColor = backgroundColor;
      button.style.setProperty('border-radius', '0.2em', 'important');
      button.style.cursor = 'pointer';
      button.style.transition = 'filter 0.3s';

      // Compact event listeners for mouse over and mouse out
      button.addEventListener('mouseover', () => (button.style.filter = 'brightness(0.8)'));
      button.addEventListener('mouseout', () => (button.style.filter = 'brightness(1)'));

      if (disabled) {
        button.style.filter = 'grayscale(1)';
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.5';
      } else {
        button.style.filter = 'grayscale(0)';
      }
    }

    // Applies common styles to a select element and its options
    function styleSelect(select) {
      select.style.height = '30px';
      select.style.maxWidth = '120px';
      select.style.minWidth = '105px';
      select.style.padding = '0.4em';
      select.style.font = '1em Montserrat';
      select.style.fontFamily = 'Montserrat';
      select.style.setProperty('color', 'bisque', 'important');
      select.style.setProperty('border-radius', '0.2em', 'important');
      select.style.boxSizing = 'border-box';
      select.style.setProperty('background-color', 'rgb(17,17,17)', 'important');
      select.style.setProperty('border', '1px solid rgb(34,34,34)', 'important');

      // Style each option element
      Array.from(select.options).forEach(option => {
        option.style.height = '30px';
        option.style.setProperty('background-color', 'rgb(17,17,17)', 'important');
        option.style.setProperty('color', 'bisque', 'important');
        option.style.fontFamily = 'Montserrat';
      });
    }

    // Common function to attach click event for removing an item
    function attachRemoveListener(removeButton, item) {
      removeButton.addEventListener('click', () => {
        item.remove(); // Remove the parent element
      });
    }

    // Function to attach click event for toggling between "assigned-thawed-config" and "assigned-frozen-config"
    function attachSnowflakeListener(snowflakeButton, username) {
      snowflakeButton.addEventListener('click', () => {
        const isFrozen = snowflakeButton.classList.toggle('assigned-frozen-config');
        snowflakeButton.classList.toggle('assigned-thawed-config');

        // Set opacity based on the assigned class
        snowflakeButton.style.opacity = isFrozen ? '1' : '0.3';

        // Update localStorage using the helper function
        updateUserState(username, isFrozen ? 'frozen' : 'thawed');
      });
    }

    // Helper function to create a container element
    function createContainer(type, layout = 'inline-flex') {
      const item = document.createElement('div');
      item.className = `${type}-item`;
      item.style.display = layout;
      item.style.gap = '0.5em';
      item.style.padding = '0.25em';
      return item;
    }

    // Helper function to create an input element
    function createInput(type, value = '', placeholder = '') {
      const input = document.createElement('input');
      input.className = `${type}-field`;
      input.value = value;
      input.placeholder = placeholder;
      styleInput(input);
      return input;
    }

    // Helper function to create a remove button with styles and event listener
    function createRemoveButton(type, item) {
      const removeButton = document.createElement('div');
      removeButton.className = `remove-${type}-word`;
      removeButton.innerHTML = removeSVG;
      attachRemoveListener(removeButton, item);
      styleButton(removeButton, '#ee9090', '#6b2f2f', false);
      return removeButton;
    }

    // Helper function to create a snowflake button with styles and event listener
    function createSnowflakeButton(state = 'thawed', username) {
      const snowflakeButton = document.createElement('div');
      snowflakeButton.className = `assigned-${state}-config`;

      // Set initial opacity based on the state
      snowflakeButton.style.opacity = state === 'thawed' ? '0.3' : '1';
      snowflakeButton.innerHTML = snowflakeSVG;

      attachSnowflakeListener(snowflakeButton, username); // Pass username here
      styleButton(snowflakeButton, 'lightsteelblue', 'steelblue', false);

      return snowflakeButton;
    }

    // Function to update a specific user in localStorage to add the state property
    function updateUserState(username, state) {
      const usersData = localStorage.getItem("usersToTrack");
      if (usersData) {
        const updatedUsers = JSON.parse(usersData).map(user =>
          user.name === username ? { ...user, state } : user
        );
        localStorage.setItem("usersToTrack", JSON.stringify(updatedUsers));
      }
    }

    // Function to create a spoiler container (as provided)
    function createSpoilerContainer(contentElement, options = {}) {
      const container = document.createElement('div');
      container.classList.add("settings-spoiler");
      const toggleButton = document.createElement('button');

      toggleButton.textContent = options.showText || 'Show Content';

      contentElement.style.display = 'none';
      // Apply hide element styles when hiding content
      assignHideElementStyles(toggleButton);

      toggleButton.addEventListener('click', () => {
        const isHidden = contentElement.style.display === 'none';
        contentElement.style.display = isHidden ? 'flex' : 'none';
        toggleButton.textContent = isHidden
          ? (options.hideText || 'Hide Content')
          : (options.showText || 'Show Content');
      });

      container.appendChild(toggleButton);
      container.appendChild(contentElement);

      return container;
    }

    // Function to create a tracked item (with gender select)
    function createTrackedItem(user) {
      const item = createContainer('tracked', 'flex');

      const usernameInput = createInput('tracked-username', user.name, 'Username');
      const pronunciationInput = createInput('tracked-pronunciation', user.pronunciation, 'Pronunciation');
      const removeButton = createRemoveButton('tracked', item);

      // Set the initial state based on the user's state property, defaulting to 'thawed' if it doesn't exist
      const initialState = (user.state === 'frozen') ? 'frozen' : 'thawed';
      const snowflakeButton = createSnowflakeButton(initialState, user.name); // Pass username

      const genderSelect = document.createElement('select');
      genderSelect.className = 'tracked-gender-select';
      const genders = [
        { value: 'Male', emoji: '👨' },
        { value: 'Female', emoji: '👩' },
      ];
      genders.forEach(({ value, emoji }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = `${emoji} ${value}`;
        if (user.gender === value) option.selected = true;
        genderSelect.appendChild(option);
      });
      styleSelect(genderSelect);

      item.appendChild(usernameInput);
      item.appendChild(genderSelect);
      item.appendChild(pronunciationInput);
      item.appendChild(removeButton);
      item.appendChild(snowflakeButton);

      return item;
    }

    // Function to create a mention item
    function createMentionItem(keyword) {
      const item = createContainer('mention');
      const mentionInput = createInput('mention', keyword, 'Mention Keyword');
      const removeButton = createRemoveButton('mention', item);

      item.appendChild(mentionInput);
      item.appendChild(removeButton);

      return item;
    }

    // Function to create a username replacement item for text to speech API
    function createReplacementItem(replacement = { original: '', replacement: '' }) {
      const item = createContainer('replacement');
      const originalInput = createInput('replacement-original', replacement.original, 'Original username');
      const replacementInput = createInput('replacement', replacement.replacement, 'Replacement name');
      const removeButton = createRemoveButton('replacement', item);

      item.appendChild(originalInput);
      item.appendChild(replacementInput);
      item.appendChild(removeButton);

      return item;
    }

    // Function to create a moderator item
    function createModeratorItem(moderator) {
      const item = createContainer('moderator');
      const moderatorInput = createInput('moderator', moderator, 'Moderator Name');
      const removeButton = createRemoveButton('moderator', item);

      item.appendChild(moderatorInput);
      item.appendChild(removeButton);

      return item;
    }

    // Function to create an ignored item
    function createIgnoredItem(user) {
      const item = createContainer('ignored');
      const ignoredInput = createInput('ignored', user, 'Ignored User');
      const removeButton = createRemoveButton('ignored', item);

      item.appendChild(ignoredInput);
      item.appendChild(removeButton);

      return item;
    }

    // Function to create a toggle item with a description and select for yes/no options
    function createToggleItem(toggle, name, optionValue) {
      const item = createContainer('toggle', 'flex');
      item.style.alignItems = 'center';

      // Create the select element for yes/no
      const select = document.createElement('select');
      select.className = 'toggle-select';

      // Create the description element
      const description = document.createElement('span');
      description.className = 'toggle-description';
      description.innerText = toggle.description;
      // Set the custom data attribute for the setting using the name parameter
      description.setAttribute('data-toggle-name', name); // Set data-toggle-name to the name parameter

      // Add click event to open the image in a new tab
      description.style.cursor = 'pointer'; // Add pointer cursor to indicate it's clickable
      description.style.color = 'burlywood';
      description.style.transition = 'color 0.15s ease-in-out';

      description.addEventListener('click', () => {
        if (toggle.image) {
          window.open(toggle.image, '_blank'); // Open the image in a new tab
        }
      });

      // Compact mouseover and mouseout events
      description.addEventListener('mouseover', function () { description.style.color = 'lightgoldenrodyellow'; })
      description.addEventListener('mouseout', function () { description.style.color = 'burlywood'; });

      // Define options with emojis for yes and no
      const options = [
        { value: 'yes', emoji: '✔️' },
        { value: 'no', emoji: '❌' }
      ];

      // Create options for the select element
      options.forEach(({ value, emoji }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = `${emoji} ${value}`; // Format text as "✔️ yes" or "❌ no"
        select.appendChild(option);
      });

      // Set the initial value of the select based on the optionValue parameter
      select.value = optionValue; // Assign the optionValue to the select element

      // Style the select element
      styleSelect(select); // Call the styling function

      // Append the description and select to the toggle item
      item.appendChild(select);
      item.appendChild(description);

      return item; // Return the created toggle item
    }

    function populateSettings() {
      const containers = {
        usersToTrack: '.settings-tracked-container',
        mentionKeywords: '.settings-mention-container',
        usernameReplacements: '.settings-replacement-container',
        moderator: '.settings-moderator-container',
        ignored: '.settings-ignored-container'
      };

      const creators = {
        usersToTrack: { name: 'tracked', createItem: createTrackedItem },
        mentionKeywords: { name: 'mention', createItem: createMentionItem },
        usernameReplacements: { name: 'replacement', createItem: createReplacementItem },
        moderator: { name: 'moderator', createItem: createModeratorItem },
        ignored: { name: 'ignored', createItem: createIgnoredItem }
      };

      const data = getSettingsData();

      Object.entries(data).forEach(([key, items]) => {
        const container = document.querySelector(containers[key]);
        if (!container) return;

        // Apply styling to the container
        container.style.width = '100%';
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.alignItems = 'start';
        container.style.flexDirection = 'column';

        if (key === 'mentionKeywords' || key === 'moderator' || key === 'ignored') {
          container.style.flexDirection = 'row';
        }

        // Clear existing items and add buttons, but ensure the add button is not removed
        const existingAddButton = container.querySelector('.add-button');
        while (container.firstChild) {
          if (container.firstChild !== existingAddButton) {
            container.removeChild(container.firstChild);
          } else {
            break;
          }
        }

        // Populate items
        items.forEach(item => container.appendChild(creators[key].createItem(item)));

        const addButton = createAddButton(containers[key], creators[key].createItem);
        container.appendChild(addButton);

        // Check if already wrapped in a spoiler
        const isAlreadyWrapped = container.closest('.settings-spoiler') !== null;

        if (!isAlreadyWrapped) {
          const parent = container.parentNode;
          if (parent) {
            const index = Array.from(parent.childNodes).indexOf(container);
            parent.removeChild(container);
            const spoiler = createSpoilerContainer(container, {
              showText: `Show ${creators[key].name} settings`,
              hideText: `Hide ${creators[key].name} settings`
            });
            spoiler.classList.add('settings-spoiler-wrapper');
            if (index >= parent.childNodes.length) {
              parent.appendChild(spoiler);
            } else {
              parent.insertBefore(spoiler, parent.childNodes[index]);
            }
          }
        }
      });

      // Process toggle settings separately
      const storedToggleSettings = JSON.parse(localStorage.getItem('toggle')) || [];
      const toggleContainer = document.querySelector('.settings-toggle-container');
      const toggleSettings = [
        {
          name: 'showChatStaticNotifications',
          description: '👀 Show chat static notifications',
          image: 'https://i.imgur.com/oUPSi9I.jpeg'
        },
        {
          name: 'showGlobalDynamicNotifications',
          description: '👀 Show global dynamic notifications',
          image: 'https://i.imgur.com/8ffCdUG.jpeg'
        },
        {
          name: 'enabledBeepOnChatJoinLeave',
          description: '🔊 Play a beep sound and speak feedback when the user enters or leaves the chat',
          image: 'https://i.imgur.com/6PXFIES.jpeg'
        },
        {
          name: 'switchToGoogleTTSEngine',
          description: '🔊 Switch to google TTS engine if available',
          image: 'https://i.imgur.com/0H94LII.jpeg'
        }
      ];

      toggleSettings.forEach(toggle => {
        const storedSetting = storedToggleSettings.find(item => item.name === toggle.name);
        const optionValue = storedSetting ? storedSetting.option : 'yes';
        const toggleItem = createToggleItem(toggle, toggle.name, optionValue);
        toggleContainer.appendChild(toggleItem);
      });
    }

    // Function to create an "Add" button for dynamic item creation
    function createAddButton(containerSelector, itemCreator) {
      const middleWord = containerSelector.split('-')[1]; // Extract key type (e.g., tracked, mention)
      const existingButton = document.querySelector(`.add-${middleWord}-item`); // Check if the button already exists
      // If the button exists, remove it
      if (existingButton) existingButton.remove();

      const addButton = document.createElement('div');
      // Set class, content, and style for the button
      addButton.className = `add-button add-setting-button add-${middleWord}-item`;
      addButton.innerHTML = addSVG; // Add SVG icon to the button
      styleButton(addButton, '#d190ee', '#502f6b', false); // Style the button
      addButton.style.margin = '0.4em';

      // On click, validate the last item and create a new one if valid
      addButton.addEventListener('click', () => {
        const container = document.querySelector(containerSelector); // Get the container element

        // Get all settings {type} items and select the last one
        const allItems = container.querySelectorAll(`.${middleWord}-item`);
        const lastItem = allItems.length > 0 ? allItems[allItems.length - 1] : null;

        // Check if the last item has any input fields
        const inputFields = lastItem ? lastItem.querySelectorAll('input') : []; // Get all input fields in the last item
        const hasEmptyFields = Array.from(inputFields).some(field => field.value.trim().length === 0); // Check for empty fields

        // Allow creation only if the last item has no empty fields (or if there are no items yet)
        const canCreateNewItem = !lastItem || !hasEmptyFields;

        if (canCreateNewItem) {
          // Create a new empty item based on the item creator function
          const emptyItem = itemCreator === createTrackedItem
            ? itemCreator({ name: '', pronunciation: '' }) // Remove gender from tracked item creation
            : itemCreator('');

          // Check if the new item is a valid HTMLElement before inserting
          if (emptyItem instanceof HTMLElement) {
            container.insertBefore(emptyItem, addButton); // Insert the new item before the Add button
          } else {
            console.error('Invalid item created.'); // Log an error if the item is not valid
          }
        } else {
          // Alert the user if the last item is filled
          alert('Please fill in the previous item before adding a new one.');
        }
      });

      return addButton; // Return the created button
    }

    // Create and append scroll buttons
    const {
      scrollButtonsContainer,
      fullScrollUpButton,
      partialScrollUpButton,
      partialScrollDownButton,
      fullScrollDownButton
    } = createScrollButtons(settingsContainer);
    settingsPanel.appendChild(scrollButtonsContainer);

    // Create an array containing the buttons we want to apply the events to
    const buttons = [
      clearCacheButton,
      closePanelButton,
      importSettingsButton,
      exportSettingsButton,
      fullScrollUpButton,
      partialScrollUpButton,
      partialScrollDownButton,
      fullScrollDownButton
    ];

    // Iterate through each button in the array
    buttons.forEach(button => {
      // Add a mouseover event listener to change the button's brightness on hover
      button.addEventListener('mouseover', () => {
        button.style.filter = 'brightness(0.8)'; // Dim the button
      });

      // Add a mouseout event listener to reset the button's brightness when not hovered
      button.addEventListener('mouseout', () => {
        button.style.filter = 'brightness(1)'; // Reset to original brightness
      });
    });

    // Append the settings panel to the body
    document.body.appendChild(settingsPanel);

    // Call the function to populate settings on page load
    populateSettings();

    // Make save button work as expected
    initializeSaveButtonLogic(saveSettingsButton);

    // Fade in the settings panel and dimming background element
    triggerTargetElement(settingsPanel, 'show');
    triggerDimmingElement('show');
  }

  // CREATE PANEL GRAPHICAL SETTINGS (END)


  // Function to retrieve the chat input field and length popup container based on the current URL
  function retrieveChatElementsByRoomType() {
    const currentURL = window.location.href; // Get the current URL
    let inputField, lengthPopupContainer;

    if (currentURL.includes('gamelist')) {
      inputField = document.querySelector('#chat-general .text'); // Selector for the general chat input
      lengthPopupContainer = document.querySelector('#chat-general .messages'); // Selector for the general chat messages
    } else if (currentURL.includes('gmid')) {
      inputField = document.querySelector('[id^="chat-game"] .text'); // Selector for the game chat input
      lengthPopupContainer = document.querySelector('[id^="chat-game"] .messages'); // Selector for the game chat messages
    } else {
      console.error('No matching room type found in the URL.');
      return null; // Return null if no matching type is found
    }

    return { inputField, lengthPopupContainer }; // Return both the input field and the length popup container
  }


  // CHAT POPUP INDICATOR LENGTH (START)

  // Select the input element and length popup container using the helper function
  const { inputField: chatField, lengthPopupContainer } = retrieveChatElementsByRoomType();

  const lengthPopup = document.createElement('div');
  lengthPopup.className = 'length-field-popup';

  lengthPopupContainer.appendChild(lengthPopup);

  // Initialize once at startup
  const textMeasurementCanvas = document.createElement('canvas');
  const textMeasurementContext = textMeasurementCanvas.getContext('2d');

  let isPopupVisible = false;
  let previousLength = 0;
  let hidePopupTimeout;

  // Function to update the color of the length popup
  function updateLengthPopupColor(length) {
    if (!lengthPopup) {
      console.error('lengthPopup is not defined');
      return;
    }

    let textColor;

    // Determine color based on the length
    if (length === 0) {
      textColor = 'hsl(200, 20%, 50%)'; // Light Blue
    } else if (length >= 1 && length <= 90) {
      textColor = 'hsl(120, 100%, 40%)'; // Bright Green
    } else if (length > 90 && length <= 100) {
      const factor = (length - 90) / 10;
      const h = Math.round(120 + factor * (60 - 120)); // Interpolating hue
      textColor = `hsl(${h}, 100%, 40%)`;
    } else if (length > 100 && length <= 190) {
      textColor = 'hsl(60, 100%, 50%)'; // Bright Yellow
    } else if (length > 190 && length <= 200) {
      const factor = (length - 190) / 10;
      const h = Math.round(60 + factor * (30 - 60)); // Interpolating hue
      textColor = `hsl(${h}, 100%, 50%)`;
    } else if (length > 200 && length <= 250) {
      textColor = 'hsl(40, 100%, 50%)'; // Orange (Updated)
    } else if (length > 250 && length <= 300) {
      const factor = (length - 250) / 50;
      const h = Math.round(40 + factor * (0 - 40)); // Interpolating hue
      textColor = `hsl(${h}, 100%, 70%)`;
    } else {
      textColor = 'hsl(0, 100%, 70%)'; // Red (Updated)
    }

    // Apply the text color to the length popup
    lengthPopup.style.color = textColor;
  }

  // Then use them in your measurement function
  function updatePopupMetrics(text) {
    // Get current font from input field
    const computedStyle = getComputedStyle(chatField);
    textMeasurementContext.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;

    // Measure text
    const textWidth = textMeasurementContext.measureText(text).width;

    // Calculate position
    const newLeft = chatField.offsetLeft + textWidth + 5;
    const maxLeft = chatField.offsetLeft + chatField.offsetWidth - lengthPopup.offsetWidth;
    lengthPopup.style.left = `${Math.min(newLeft, maxLeft)}px`;
  }

  // Only update content/position without animation
  function updateLengthPopup(length) {
    let displayText;

    displayText = length > previousLength ? `${length} 🡆` :
      length < previousLength ? `🡄 ${length}` :
        `${length}`;

    lengthPopup.textContent = displayText;
    updateLengthPopupColor(length);
    previousLength = length;
  }

  function togglePopup(show) {
    if (isPopupVisible === show) return;
    lengthPopup.classList.toggle('bounce-in', show);
    lengthPopup.classList.toggle('bounce-out', !show);
    isPopupVisible = show;
    if (!show) setTimeout(() => lengthPopup.classList.remove('bounce-out'), 500);
  }

  function resetPopup() {
    updateLengthPopup(0);
    Object.assign(lengthPopup.style, { left: '0px', color: 'hsl(200, 20%, 50%)' });
  }

  chatField.addEventListener('input', () => {
    clearTimeout(hidePopupTimeout);
    updateLengthPopup(chatField.value.length);
    updatePopupMetrics(chatField.value);
    togglePopup(true);
    hidePopupTimeout = setTimeout(() => togglePopup(false), 1000);
  });

  chatField.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    resetPopup();
    togglePopup(true);
    hidePopupTimeout = setTimeout(() => togglePopup(false), 1000);
  });

  // CHAT POPUP INDICATOR LENGTH (END)


  // REMOVE UNWANTED MESSAGES

  /*
  ** This algorithm enables the removal of unpleasant messages in the chat that are unwanted.
  ** The messages are saved in localStorage and remain there until they are visible in the chat.
  ** Once a message is no longer visible in the chat, its corresponding value in localStorage is also removed.
  ** This method is helpful in storing only necessary unwanted messages, preventing an overgrowth of values over time.
  */

  function executeMessageRemover() {
    attachEventsToMessages();
    createToggleButton();
    wipeDeletedMessages();
  } // executeMessageRemover function END

  // Functions to assign different toggle button styles
  // Red color tones
  function assignHiddenButtonStyle(toggleButton) {
    toggleButton.style.backgroundColor = 'hsl(0, 20%, 10%)';
    toggleButton.style.color = 'hsl(0, 50%, 50%)';
    toggleButton.style.border = '1px solid hsl(0, 50%, 50%)';
  }
  // Green color tones
  function assignShowButtonStyle(toggleButton) {
    toggleButton.style.backgroundColor = 'hsl(90, 20%, 10%)';
    toggleButton.style.color = 'hsl(90, 50%, 50%)';
    toggleButton.style.border = '1px solid hsl(90, 50%, 50%)';
  }
  // Yellow color tones
  function assignHideButtonStyle(toggleButton) {
    toggleButton.style.backgroundColor = 'hsl(50, 20%, 10%)';
    toggleButton.style.color = 'hsl(50, 50%, 50%)';
    toggleButton.style.border = '1px solid hsl(50, 50%, 50%)';
  }

  // Function to assign styles to the delete button
  function assignDeleteButtonStyles(deleteButton, event) {
    // Set the delete button styles
    deleteButton.style.position = 'fixed';
    deleteButton.style.top = `${event.clientY}px`;
    deleteButton.style.left = `${event.clientX}px`;
    deleteButton.style.zIndex = 999;
    deleteButton.style.padding = '8px 16px';
    deleteButton.style.backgroundColor = 'hsl(0, 50%, 20%)';
    deleteButton.style.color = 'hsl(0, 60%, 70%)';
    deleteButton.style.border = '1px solid hsl(0, 50%, 35%)';
    deleteButton.style.transition = 'all 0.3s';
    deleteButton.style.filter = 'brightness(1)';

    // Set the hover styles
    deleteButton.addEventListener('mouseenter', () => {
      deleteButton.style.filter = 'brightness(1.5)';
    });

    // Set the mouse leave styles
    deleteButton.addEventListener('mouseleave', () => {
      deleteButton.style.filter = 'brightness(1)';
    });
  }

  // Functions to assign selection to the messages
  function assignMessageSelection(message) {
    message.style.setProperty('background-color', 'hsla(0, 50%, 30%, .5)', 'important');
    message.style.setProperty('box-shadow', 'inset 0px 0px 0px 1px rgb(191, 64, 64)', 'important');
    message.style.setProperty('background-clip', 'padding-box', 'important');
  }
  // Clear the selection
  function clearMessageSelection() {
    const messages = document.querySelectorAll('.messages-content div p');
    messages.forEach(message => {
      message.style.removeProperty('background-color');
      message.style.removeProperty('box-shadow');
      message.style.removeProperty('background-clip');
    });
  }

  // Declare a new Set to hold selected messages
  const selectedMessages = new Set();
  // To store the data of the right mouse button drag
  let isDragging = false;
  let isRightMouseButton = false;

  // Function to attach events on every message what doesn't have any event assigned
  function attachEventsToMessages() {
    const messages = document.querySelectorAll('.messages-content div p');
    // Store timeoutID to regulate it by multiple events
    let timeoutId = null;

    messages.forEach(message => {
      // Check if the element has the 'contextmenu' id before adding a new event listener
      if (!message.hasAttribute('id') || message.getAttribute('id') !== 'contextmenu') {

        message.addEventListener('mousedown', event => {
          isRightMouseButton = event.button === 2;
          if (isRightMouseButton) {
            isDragging = true;
            clearTimeout(timeoutId);

            // Extract content from various types of child nodes
            const messageContent = getMessageContent(message);
            if (!selectedMessages.has(messageContent)) {
              selectedMessages.add(messageContent);
              console.log('Added new message inside the selectedMessages Set:', messageContent);
            }

            assignMessageSelection(message);
          }
        });

        message.addEventListener('mouseup', event => {
          isRightMouseButton = event.button === 2;
          if (isRightMouseButton) {
            isDragging = false;
          }
        });

        message.addEventListener('mouseover', event => {
          if (isDragging && isRightMouseButton) {
            // Extract content from various types of child nodes
            const messageContent = getMessageContent(message);
            if (!selectedMessages.has(messageContent)) {
              selectedMessages.add(messageContent);
              console.log('Added new message inside the selectedMessages Set:', messageContent);
            }

            assignMessageSelection(message);
          }
        });

        // Add id contextmenu to check in the future if the element has the event
        message.setAttribute('id', 'contextmenu');
        // Add an event listener for right-clicks on messages
        message.addEventListener('contextmenu', event => {
          // Prevent the default context menu from appearing
          event.preventDefault();
          // Wrap the message into visible selection to visually know what message will be deleted
          assignMessageSelection(message);

          // Check if a delete-message button already exists in the document
          const deleteButton = document.querySelector('.delete-message');

          if (deleteButton) {
            // If it exists, remove it
            deleteButton.remove();
          }

          // Create a new delete-message button
          const newDeleteButton = document.createElement('button');
          newDeleteButton.innerText = 'Delete';
          newDeleteButton.classList.add('delete-message');

          // Attach event click to new delete-message button
          newDeleteButton.addEventListener('click', () => {
            deleteSelectedMessages(message);
            newDeleteButton.remove();
            createToggleButton();
            selectedMessages.clear();
          });

          // Style the delete button
          assignDeleteButtonStyles(newDeleteButton, event);

          // Set the hover styles
          newDeleteButton.addEventListener('mouseenter', () => {
            newDeleteButton.style.filter = 'brightness(1.5)';
          });

          // Set the mouse leave styles
          newDeleteButton.addEventListener('mouseleave', () => {
            newDeleteButton.style.filter = 'brightness(1)';
          });

          // Append the new delete-message button to the document body
          document.body.appendChild(newDeleteButton);

          function hideDeleteButton() {
            // Set a new timeout to remove the delete button
            timeoutId = setTimeout(() => {
              if (!newDeleteButton.matches(':hover')) {
                newDeleteButton.remove();
                clearMessageSelection(message);
                selectedMessages.clear();
              }
            }, 1000);
          }

          hideDeleteButton();

          // Add event listener for the mouseleave event on the delete button
          newDeleteButton.addEventListener('mouseleave', () => {
            hideDeleteButton();
          });

          // Add event listener for the mouseenter event on the delete button to clear the previous timeout
          newDeleteButton.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
          });

        });
      }
    });
  }

  // Function to extract content from various types of child nodes within a message element
  function getMessageContent(messageElement) {
    // Query the .time and .username elements
    const timeElement = messageElement.querySelector('.time');
    const usernameElement = messageElement.querySelector('.username');

    // Extract content from .time and .username elements
    const timeContent = timeElement ? timeElement.textContent.trim() : '';
    const usernameContent = usernameElement ? ` ${usernameElement.textContent.trim()} ` : '';

    // Extract content from other types of child nodes
    const otherContentArray = Array.from(messageElement.childNodes)
      .filter(node => node !== timeElement && node !== usernameElement)
      .map(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent; // Handle #text node without trimming
        } else if (node.tagName === 'A') {
          return node.getAttribute('href').trim(); // Handle #anchor (link) node
        } else if (node.tagName === 'IMG') {
          return node.title.trim(); // Handle #img node
        } else if (node.tagName === 'IFRAME') {
          return node.getAttribute('src').trim(); // Handle #iframe node
        }
        return ''; // Return empty string for other node types
      });

    // Concatenate content while respecting the order of child nodes
    const allContentArray = [timeContent, usernameContent, ...otherContentArray];

    return allContentArray.join('');
  }

  function deleteSelectedMessages() {
    // Retrieve and backup all current selectedMessages and convert into Array
    const messagesToDelete = [...selectedMessages];

    // Get all message elements
    const messages = document.querySelectorAll('.messages-content div p');

    // Loop over each selected message content
    messagesToDelete.forEach((messageContent) => {
      // Find the corresponding DOM element
      const messageElement = Array.from(messages).find(message => getMessageContent(message) === messageContent);

      // Check if the element is found before using it
      if (messageElement) {
        // Retrieve the stored deleted messages array, or create an empty array if none exist
        const deletedMessages = JSON.parse(localStorage.getItem('deletedChatMessagesContent') || '[]');
        // Add the deleted message content to the array if it doesn't already exist
        if (!deletedMessages.includes(messageContent)) {
          deletedMessages.push(messageContent);
        }
        // Store the updated deleted messages array in localStorage
        localStorage.setItem('deletedChatMessagesContent', JSON.stringify(deletedMessages));
        // Remove the message from the selectedMessages Set
        selectedMessages.delete(messageContent);
      }
    });

    // Hide all the messages that match the localStorage value
    wipeDeletedMessages();
  }

  function wipeDeletedMessages() {
    // Retrieve and parse the stored deleted messages
    const deletedMessages = JSON.parse(localStorage.getItem('deletedChatMessagesContent') || '[]');

    // If there are no deleted messages in localStorage, return early
    if (deletedMessages.length === 0) return;

    const messages = document.querySelectorAll('.messages-content div p');
    // Convert the deleted messages into a Set for faster lookup
    const deletedMessagesSet = new Set(deletedMessages);

    // Collect the current messages content into an array for easy comparison
    const currentMessagesContent = Array.from(messages).map(message => getMessageContent(message));

    // Filter out the deleted messages that no longer exist in the current messages
    const newDeletedMessages = deletedMessages.filter(content => currentMessagesContent.includes(content));

    // Hide messages in the chat that match the deleted messages
    messages.forEach(message => {
      if (deletedMessagesSet.has(getMessageContent(message))) {
        message.style.display = 'none';
      }
    });

    // Store the updated deleted messages array in localStorage
    localStorage.setItem('deletedChatMessagesContent', JSON.stringify(newDeletedMessages));
  } // wipeDeletedMessages END

  // Declare toggleButton variable outside of the function so it is a global variable
  let toggleButton;

  // Function to create the button only if localStorage "deletedChatMessagesContent" has at least one deleted message value
  function createToggleButton() {
    // Retrieve the stored deleted messages array
    const deletedMessages = JSON.parse(localStorage.getItem('deletedChatMessagesContent') || '[]');

    // Only create the toggle button if there are deleted messages to show/hide
    if (deletedMessages.length > 0) {
      // Check if the button already exists in the DOM
      toggleButton = document.getElementById('toggleButton');
      if (toggleButton === null) {
        // Create the toggle button
        toggleButton = document.createElement('button');
        toggleButton.id = 'toggleButton';
        toggleButton.addEventListener('click', toggleHiddenMessages);
        toggleButton.style.position = 'absolute';
        toggleButton.style.top = '0';
        toggleButton.style.right = '0';
        toggleButton.style.padding = '8px 16px';
        // Initial textContent if at least one message is hidden
        toggleButton.innerText = 'Hidden';
        // Initial styles for the Hidden button
        assignHiddenButtonStyle(toggleButton);
        toggleButton.style.transition = 'filter 300ms';
        toggleButton.style.filter = 'hue-rotate(0) brightness(1)';
        let backupTextContent = toggleButton.textContent;

        // Set the hover styles
        toggleButton.addEventListener('mouseenter', () => {
          if (isCtrlKeyPressed) {
            backupTextContent = toggleButton.textContent;
            toggleButton.textContent = 'Restore';
            toggleButton.style.filter = 'hue-rotate(180deg) brightness(2)';
          } else {
            toggleButton.style.filter = 'hue-rotate(0) brightness(2)';
          }
        });

        // Set the mouse leave styles
        toggleButton.addEventListener('mouseleave', () => {
          const isRestore = toggleButton.textContent === 'Restore';
          if (isCtrlKeyPressed || !isCtrlKeyPressed && isRestore) {
            toggleButton.textContent = backupTextContent;
          }
          toggleButton.style.filter = 'hue-rotate(0) brightness(1)';
        });

        messagesContainer.appendChild(toggleButton);
      }
    }
  } // createToggleButton END

  // Function to toggle messages display state from "NONE" to "BLOCK" and reverse
  function toggleHiddenMessages() {
    const messages = document.querySelectorAll('.messages-content div p');
    // Retrieve the stored deleted messages array
    const deletedMessages = JSON.parse(localStorage.getItem('deletedChatMessagesContent') || '[]');

    if (isCtrlKeyPressed) {
      // Set deletedChatMessagesContent in local storage as an empty array
      localStorage.setItem('deletedChatMessagesContent', JSON.stringify([]));

      // Display all messages
      messages.forEach(message => {
        message.style.display = 'block';
        message.style.removeProperty('background-color');
        message.style.removeProperty('box-shadow');
        message.style.removeProperty('background-clip');
      });

      toggleButton.remove();
    }

    if (!isCtrlKeyPressed) {

      // Check if there are any deleted messages in the local storage
      if (deletedMessages.length === 0) {
        // Hide the toggle button if there are no deleted messages
        toggleButton.style.display = 'none';
        return;
      } else {
        // Show the toggle button if there are deleted messages
        toggleButton.style.display = 'block';
      }

      // Toggle the display of each message that matches the key "deletedChatMessagesContent" data
      messages.forEach(message => {
        const messageContent = getMessageContent(message);

        if (deletedMessages.includes(messageContent)) {
          // Show hidden messages if innerText is "Hidden" and display equal "NONE"
          if (toggleButton.innerText === 'Hidden') {
            if (message.style.display === 'none') {
              // Change display to "BLOCK"
              message.style.display = 'block';
              // Wrap the message into visible selection to visually know what message will be deleted
              message.style.setProperty('background-color', 'hsla(0, 50%, 30%, .5)', 'important');
              message.style.setProperty('box-shadow', 'inset 0px 0px 0px 1px rgb(191, 64, 64)', 'important');
              message.style.setProperty('background-clip', 'padding-box', 'important');
            }
            // Show hidden messages if innerText is "Show" and display equal "NONE"
          } else if (toggleButton.innerText === 'Show') {
            if (message.style.display === 'none') {
              message.style.display = 'block';
              // Wrap the message into visible selection to visually know what message will be deleted
              message.style.setProperty('background-color', 'hsla(0, 50%, 30%, .5)', 'important');
              message.style.setProperty('box-shadow', 'inset 0px 0px 0px 1px rgb(191, 64, 64)', 'important');
              message.style.setProperty('background-clip', 'padding-box', 'important');
            }
          } else if (toggleButton.innerText === 'Hide') {
            if (message.style.display === 'block') {
              message.style.display = 'none';
              message.style.removeProperty('background-color');
              message.style.removeProperty('box-shadow');
              message.style.removeProperty('background-clip');
            }
          }
        }
      });

      // Toggle the button text and style
      if (toggleButton.innerText === 'Hide') {
        toggleButton.innerText = 'Show';
        assignShowButtonStyle(toggleButton);
      } else {
        toggleButton.innerText = 'Hide';
        assignHideButtonStyle(toggleButton);
      }

    }

  } // toggleHiddenMessages END

  // CHAT SWITCHER

  const currentLocationIncludes = part => window.location.href.includes(part);

  if (currentLocationIncludes('gamelist')) {
    // Timeout settings.
    const extraTimeout = 5000;
    const minimalTimeout = 1000;

    // Define system messages.
    const blockedChatMessage = 'Вы не можете отправлять сообщения';
    const lostConnectionMessage = 'Связь с сервером потеряна';

    // Helper function to dynamically retrieve the current chat elements.
    const getChatElements = () => ({
      chatField: document.querySelector('.chat .text'),
      chatSend: document.querySelector('.chat .send')
    });

    // Function to extract a system message from the chat field's value.
    // Returns the message string if found, or null otherwise.
    function getChatSystemMessage(chatField) {
      if (!chatField) return null;
      const value = chatField.value;
      if (value.includes(blockedChatMessage)) return blockedChatMessage;
      if (value.includes(lostConnectionMessage)) return lostConnectionMessage;
      return null;
    }

    // Function to handle changes when the chat field is disabled.
    function handleChatStateChange(timeout, chatField, chatSend) {
      if (chatField.disabled) {
        const systemMessage = getChatSystemMessage(chatField);
        if (systemMessage === blockedChatMessage) {
          // Re-enable the chat field and send button, and update their styles.
          chatField.disabled = chatSend.disabled = false;
          chatSend.style.setProperty('background-color', 'rgb(160, 35, 35)', 'important');
          chatSend.style.setProperty(
            'background-image',
            `url("data:image/svg+xml,${encodeURIComponent(deniedSVG)}")`,
            'important'
          );
          chatSend.style.setProperty('background-repeat', 'no-repeat', 'important');
          chatSend.style.setProperty('background-position', 'center', 'important');
          chatSend.style.setProperty('color', 'transparent', 'important');
          chatField.value = null;
          console.log('Chat field was blocked, re-enabled.');
        } else if (systemMessage === lostConnectionMessage) {
          // Schedule a reload using timeout.
          console.log('Lost connection, reloading...');
          setTimeout(() => {
            window.location.reload();
          }, timeout);
        }
      }
    }

    // Create a MutationObserver to watch for attribute changes.
    const observer = new MutationObserver(() => {
      // Get updated chat elements.
      const { chatField, chatSend } = getChatElements();
      // Handle the change when the 'disabled' attribute is modified.
      handleChatStateChange(extraTimeout, chatField, chatSend);
    });

    // Get the chat field element.
    const { chatField: chatInputText } = getChatElements();
    // Start observing the chatField for changes to the 'disabled' attribute.
    if (chatInputText)
      observer.observe(chatInputText, { attributes: true, attributeFilter: ['disabled'] });

    // Compact visibilitychange event: When the document becomes visible,
    // set a shorter timeout duration and check the chat state.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const { chatField, chatSend } = getChatElements();
        handleChatStateChange(minimalTimeout, chatField, chatSend);
      }
    });
  }

  // Get all elements with the 'general' class
  let generalChatTabs = document.querySelectorAll('.general');
  // Get all elements with the 'game' class
  let gameChatTabs = document.querySelectorAll('.game');

  // Function to set focus on the chat input field based on the current URL on page load
  function setChatFieldFocus() {
    // Check if the chat is closed or opened
    const chatHidden = document.querySelector('#chat-wrapper.chat-hidden');

    // Determine the current URL and chat type based on URL keywords
    const currentURL = window.location.href;
    let chatInput; // Variable to store the chat input element

    if (currentURL.includes('gamelist')) {
      // If the URL contains "gamelist," it's a general chat
      chatInput = document.querySelector('#chat-general .text');
    } else if (currentURL.includes('gmid')) {
      // If the URL contains "gmid," it's a game chat
      chatInput = document.querySelector('[id^="chat-game"] .text');
    }

    // Run if the chat is not closed and a chat input element is found
    if (!chatHidden && chatInput) {
      chatInput.focus(); // Set focus on the selected chat input field
    }
  }

  // Function to set focus on the chat input field based on active chat tab on tab key press
  function toggleFocusAndSwitchTab() {
    // Check if the chat is closed or opened
    const chatHidden = document.querySelector('#chat-wrapper.chat-hidden');

    // Get general chat tabs and game chat tabs
    let generalChatTabs = document.querySelectorAll('.general.c, .general.c.active');
    let gameChatTabs = document.querySelectorAll('.game.c, .game.c.active');

    // Find the first visible general chat tab that is not active
    let visibleGeneralChatTab = Array.from(generalChatTabs).find(function (tab) {
      let computedStyle = window.getComputedStyle(tab);
      return computedStyle.display !== 'none' && !tab.classList.contains('active');
    });

    // Find the first visible game chat tab that is not active
    let visibleGameChatTab = Array.from(gameChatTabs).find(function (tab) {
      let computedStyle = window.getComputedStyle(tab);
      return computedStyle.display !== 'none' && !tab.classList.contains('active');
    });

    // Run if a chat tab is found
    if (!chatHidden && (visibleGeneralChatTab || visibleGameChatTab)) {
      // Click on the visible chat tab
      if (visibleGeneralChatTab) {
        visibleGeneralChatTab.click();
      } else if (visibleGameChatTab) {
        visibleGameChatTab.click();
      }

      // Determine the chat input element based on visible tabs
      let chatInput; // Variable to store the chat input element

      if (visibleGeneralChatTab) {
        // If the visible chat tab is a general chat tab, focus on general chat input
        chatInput = document.querySelector('#chat-general .text');
      } else if (visibleGameChatTab) {
        // If the visible chat tab is a game chat tab, focus on game chat input
        chatInput = document.querySelector('[id^="chat-game"] .text');
      }

      // Run if a chat input element is found
      if (chatInput) {
        chatInput.focus(); // Set focus on the selected chat input field
      }
    }
  }

  // Function to handle click event and log the clicked element
  function switchChatTab(event) {
    console.log('Clicked element:', event.target);
    let activeTab = event.target.classList.contains('general') ? 'general' : 'game';
    localStorage.setItem('activeChatTab', activeTab);
  }

  // Add click event listeners to the general chat tabs
  generalChatTabs.forEach(function (tab) {
    tab.addEventListener('click', switchChatTab);
  });

  // Add click event listeners to the game chat tabs
  gameChatTabs.forEach(function (tab) {
    tab.addEventListener('click', switchChatTab);
  });

  // Add keydown event listener to the document
  document.addEventListener('keydown', function (event) {
    // Check if the Tab key is pressed
    if (event.key === 'Tab') {
      // Call toggleFocusAndSwitchTab function when Tab key is pressed
      toggleFocusAndSwitchTab();
      // Prevent the default tab behavior (moving focus to the next element in the DOM)
      event.preventDefault();
    }
  });

  // Function to restore chat tab from localStorage and set the focus for game page
  function restoreChatTabAndFocus() {
    let activeTab = localStorage.getItem('activeChatTab');
    let chatInput; // Variable to store the chat input element to be focused

    if (activeTab === 'general') {
      let visibleGeneralChatTab = Array.from(generalChatTabs).find(function (tab) {
        let computedStyle = window.getComputedStyle(tab);
        return computedStyle.display !== 'none' && !tab.classList.contains('active');
      });
      if (visibleGeneralChatTab) {
        visibleGeneralChatTab.click();
        chatInput = document.querySelector('#chat-general .text');
      }
    } else if (activeTab === 'game') {
      let visibleGameChatTab = Array.from(gameChatTabs).find(function (tab) {
        let computedStyle = window.getComputedStyle(tab);
        return computedStyle.display !== 'none' && !tab.classList.contains('active');
      });
      if (visibleGameChatTab) {
        visibleGameChatTab.click();
        chatInput = document.querySelector('[id^="chat-game"] .text');
      }
    }

    // Set focus on the chat input field if chatInput is defined
    if (chatInput) {
      chatInput.focus();
    }
  }

  // Function to break text into pieces of a maximum length
  function breakSentence(text) {
    const maxLength = 300; // Maximum length of each piece
    const words = text.split(' '); // Split the text into words
    const pieces = []; // Array to hold the final pieces
    let currentPiece = ''; // Variable to build the current piece

    words.forEach((word) => {
      // Check if adding the next word would exceed maxLength
      if ((currentPiece + word).length > maxLength) {
        // Push the current piece to pieces and reset currentPiece
        pieces.push(currentPiece.trim());
        currentPiece = word + ' '; // Start a new piece with the current word
      } else {
        currentPiece += word + ' '; // Add the word to the current piece
      }
    });

    // Push the last piece if it exists
    if (currentPiece) {
      pieces.push(currentPiece.trim());
    }

    return pieces;
  }

  // Function to send the message in parts
  async function sendMessageInParts(message) {
    const pieces = breakSentence(message); // Break the message into pieces
    const inputField = document.querySelector('.text'); // Get the input field element
    const sendButton = document.querySelector('.send'); // Get the send button element

    // Disable the input field only if the message is longer than 300 characters
    const isLongMessage = message.length > 300;
    if (isLongMessage) {
      inputField.disabled = true; // Disable input field for long messages
    }

    for (let index = 0; index < pieces.length; index++) {
      // Set the input field to the current piece
      const fullMessage = pieces[index]; // Use the current piece
      inputField.value = fullMessage;

      // Log each piece and its length
      console.log(`Sending piece ${index + 1}: "${fullMessage}" (Length: ${fullMessage.length})`);

      // Simulate sending the message
      sendButton.click(); // Click the send button

      // If not the last piece, generate a random delay before sending the next one
      if (index < pieces.length - 1) {
        const randomDelay = Math.floor(Math.random() * 500) + 500; // 500 ms to 1000 ms
        console.log(`Waiting for ${randomDelay} ms before sending the next piece.`);
        await new Promise(resolve => setTimeout(resolve, randomDelay)); // Use await for async delay
      }
    }

    // Re-enable the input field after all pieces have been sent, if it was disabled
    if (isLongMessage) {
      inputField.disabled = false;
    }
  }

  function setupInputFieldListener() {
    const inputField = document.querySelector('.text');
    inputField.setAttribute('maxlength', '1000');

    // Listen for the paste event on the input field
    inputField.addEventListener('paste', (event) => {
      // Prevent the default paste behavior
      event.preventDefault();
      // Get the pasted value from the clipboard
      const pastedValue = event.clipboardData.getData('text');
      // Initialize the processed value to the pasted value
      let processedValue = pastedValue;

      // If the pasted value is a valid and encoded URL, decode it
      if (isValidEncodedURL(pastedValue)) {
        processedValue = decodeURL(pastedValue);
      }

      // Get the current selection's start and end positions in the input field
      const start = inputField.selectionStart;
      const end = inputField.selectionEnd;

      // Insert the processed value into the input field at the current cursor position
      inputField.value = inputField.value.slice(0, start) + processedValue + inputField.value.slice(end);
      // Set the cursor position after the pasted value
      inputField.setSelectionRange(start + processedValue.length, start + processedValue.length);
    });


    inputField.addEventListener('keydown', (event) => {
      const message = inputField.value;
      if (event.key === 'Enter') {
        if (message.length > 300) {
          event.preventDefault();
          sendMessageInParts(message);
          console.log(`Long message processed: "${message}"`);
          inputField.value = '';
        } else {
          console.log(`Short message processed: "${message}"`);
        }
      }
    });
  }

  // Function to set up input field backup and restore
  function setupInputBackup(inputSelector) {
    const inputField = document.querySelector(inputSelector); // Select the input element
    if (inputField) {
      // Restore the input value
      inputField.value = localStorage.getItem('inputBackup') || '';

      // Backup on input with debounce, but only if there's no system message.
      inputField.addEventListener('input', debounce(() => {
        if (!getChatSystemMessage(inputField)) {
          localStorage.setItem('inputBackup', inputField.value);
        }
      }, 250));

      // Clear local storage on Enter
      inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') localStorage.removeItem('inputBackup');
      });
    }
  }

  // create a new MutationObserver to wait for the chat to fully load with all messages
  let waitForChatObserver = new MutationObserver(() => {
    // Get the container for all chat messages
    const messagesContainer = document.querySelector('.messages-content div');
    // Get all the message elements from messages container
    const messages = document.querySelectorAll('.messages-content div p');

    // check if the chat element has been added to the DOM
    if (document.contains(messagesContainer)) {

      // check if there are at least 20 messages in the container
      if (messages.length >= 20) {
        // stop observing the DOM
        waitForChatObserver.disconnect();
        // Remove ignored users' messages if the page is not initialized
        removeIgnoredUserMessages();
        // Convert image links to visible image containers
        convertImageLinksToImage('generalMessages');
        // Convert YouTube links to visible iframe containers
        convertVideoLinksToPlayer('generalMessages'); // For general chat
        // Decodes links within the general messages section.
        processEncodedLinks('generalMessages');
        // Restore chat tab from localStorage
        restoreChatTabAndFocus();
        // Call the function with the selector for the input field
        setupInputBackup('#chat-general .text');
        // Call the function to re-highlight all the mention words of the messages
        highlightMentionWords();
        // Call the function to apply the chat message grouping
        applyChatMessageGrouping();
        // Call the function to scroll to the bottom of the chat
        scrollMessagesToBottom();
        // Call the function to refresh the user list and clear the cache if needed
        refreshFetchedUsers(false, cacheRefreshThresholdHours);
        // Refresh experimental custom chat user list on old list changes
        refreshUserList();
        // Call the setChatFieldFocus function when the page loads
        setChatFieldFocus();
        // Execute the function to trigger the process of chat cleaning after the youtube and images convertation to avoid issues
        executeMessageRemover();
        // Initialize the input field listener to handle message sending when Enter is pressed
        setupInputFieldListener();
      }
    }
  });

  // start observing the DOM for changes
  waitForChatObserver.observe(document, { childList: true, subtree: true });
})();