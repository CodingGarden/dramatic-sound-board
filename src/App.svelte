<script>
	import sounds from './sounds.json';

	let currentSound = null;
	let filter = '';
	let inputBox;
	
	const colors = ['#3DDC97', '#FF8C42', '#E87EA1', '#FFD046', '#C45AB3'];

	const audio = new Audio();

	let currentKey = 0;
	const keyboard = '1234567890qwertyuiopasdfghjkl';
	const keys = {};

	const sections = Object
		.keys(sounds)
		.map(section => {
			sounds[section].forEach(sound => {
				sound.key = keyboard[currentKey];
				keys[keyboard[currentKey]] = {
					section,
					sound
				};
				currentKey++;
			});
			return {
				section,
				title: section[0].toUpperCase() + section.slice(1),
			};
		});

	function playSound(section, file) {
		const path = `sounds/${section}/${file}`;
		audio.src = path;
		if (section === 'loops') {
			audio.loop = true;
		} else {
			audio.loop = false;
		}
		audio.play();
	}

	document.addEventListener('keydown', (e) => {
		if (e.key === ' ') {
			audio.pause();
			audio.currentTime = 0;
		}
		if (!keys[e.key]) return;
		if (inputBox === document.activeElement) return;
		const { section, sound: { file, name } } = keys[e.key];
		playSound(section, file);
		currentSound = name;
		setTimeout(() => {
			currentSound = null;
		}, 100);
	});

	$: filteredSections = Object
		.keys(sounds)
		.map(section => {
			const regexp = new RegExp(filter.trim(), 'i');
			return {
				section,
				title: section[0].toUpperCase() + section.slice(1),
				sounds: sounds[section].filter(sound => sound.name.match(regexp) || section.match(regexp))
			};
		});
</script>

<form class="filter-form">
	<input bind:this={inputBox} bind:value={filter} class="filter-box">
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
	color: #FFF200;
	margin: 0 auto;
}

.filter-form {
	width: 100%;
	display: flex;
	justify-content: center;
	margin: 1em;
}

.filter-box {
	width: 60%;
	font-size: 3vmin;
	font-family: "Allerta Stencil", sans-serif;
	background: #000F08;
	color: #FFF200;
}

.sound-button {
	position: relative;
	background-color: #000F08;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	outline: 1px solid #FF4141;
	font-size: 2.5vmin;
	cursor: pointer;
	box-shadow: 5px 5px 5px #FF4141;
	transition: background 0.25s linear, color 0.25s linear, box-shadow 0.15s linear;
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
	background: #FFF200;
	color: #000F08 !important;
}

.sound-button:active, .sound-button-active {
	background: #FFF200;
	color: #000F08 !important;
	transform: translate(5px, 5px);
	box-shadow: none;
}
</style>