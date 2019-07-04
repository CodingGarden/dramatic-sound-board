<script>
  import sounds from "./sounds.json";

  let filter = "";
  let inputBox;
  let currentSound = null;
  let filteredSections;
  let keys = {};
	let currentKey = 0;
	const s3Bucket = 'https://dramatic-sound-board.s3.amazonaws.com';

  const colors = ["#3DDC97", "#FF8C42", "#E87EA1", "#FFD046", "#C45AB3"];

  const audio = new Audio();
  const keyboard = "12345qwertasdfgzxcvb67890yuiop";

  function playSound(section, file) {
    const path = `${s3Bucket}/sounds/${section}/${file}`;
    audio.src = path;
    audio.currentTime = 0;
    if (section === "loops") {
      audio.loop = true;
    } else {
      audio.loop = false;
    }
    audio.play();
  }

  function filterBoxKeyDown(e) {
    if (e.key === "Escape") {
      inputBox.blur();
    }
  }

  function documentKeyDown(e) {
    if (e.key === " ") {
      audio.pause();
      audio.currentTime = 0;
    }
    if (!keys[e.key] || inputBox === document.activeElement) return;
    const {
      section,
      sound: { file, name }
    } = keys[e.key];
    if (currentSound !== name) {
      playSound(section, file);
      currentSound = name;
    }
  }

  function documentKeyUp(e) {
    currentSound = null;
  }

  audio.addEventListener("ended", () => {
    currentSound = null;
  });
  document.addEventListener("keydown", documentKeyDown);
  document.addEventListener("keyup", documentKeyUp);

  $: {
    keys = {};
    currentKey = 0;
    filteredSections = Object.keys(sounds).map(section => {
      const regexp = new RegExp(filter.trim(), "i");
      return {
        section,
        title: section[0].toUpperCase() + section.slice(1),
        sounds: sounds[section].filter(sound => {
          if (sound.name.match(regexp) || section.match(regexp)) {
            sound.key = keyboard[currentKey];
            keys[keyboard[currentKey]] = {
              section,
              sound
            };
            currentKey++;
            return true;
          }
        })
      };
    });
  }
</script>

{#each filteredSections as { section, title, sounds }, i}
  {#each sounds as { file, name, key }}
		<audio preload="auto">
			<source src={`${s3Bucket}/sounds/${section}/${file}`} type="audio/mpeg">
		</audio>
  {/each}
{/each}
<form class="filter-form">
  <input
    bind:this={inputBox}
    placeholder="filter sounds..."
    bind:value={filter}
    on:keydown={filterBoxKeyDown}
    class="filter-box" />
</form>
<div class="container">
  {#each filteredSections as { section, title, sounds }, i}
    {#each sounds as { file, name, key }}
      <div
        class="sound-button"
        style={`color: ${colors[i % colors.length]}`}
        class:sound-button-active={currentSound === name}
        on:mousedown={() => playSound(section, file)}>
        <small class="key">{key.toUpperCase()}</small>
        <h4>{name}</h4>
        <small class="section-title">{section}</small>
      </div>
    {/each}
  {/each}
</div>

<style>
  .container {
    width: 100vmin;
    height: 100vmin;
    text-align: center;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    grid-gap: 15px 15px;
    color: #fff200;
    margin: 0 auto;
  }

  .filter-form {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 1em;
  }

  .filter-box {
    width: 30%;
    font-size: 3vmin;
    font-family: "Allerta Stencil", sans-serif;
    background: #000f08;
    color: #fff200;
  }

  .sound-button {
    position: relative;
    background-color: #000f08;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    outline: 1px solid #ff4141;
    font-size: 2.5vmin;
    cursor: pointer;
    box-shadow: 5px 5px 5px #ff4141;
    transition: background 0.25s linear, color 0.25s linear,
      box-shadow 0.15s linear;
    text-transform: uppercase;
  }

  .section-title {
    position: absolute;
    bottom: 1vmin;
  }

  .key {
    position: absolute;
    top: 1vmin;
    font-family: monospace;
    font-size: 1.5vmin;
  }

  .sound-button:hover {
    background: #fff200;
    color: #000f08 !important;
  }

  .sound-button:active,
  .sound-button-active {
    background: #fff200;
    color: #000f08 !important;
    transform: translate(5px, 5px);
    box-shadow: none;
  }
</style>
