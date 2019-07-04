const { promises: fs } = require('fs');


const sounds = {};

fs.readdir('./public/sounds')
  .then(async (directories) => {
    await Promise.all(directories.map(async (directoryName) => {
      if (!directoryName.startsWith('.')) {
        const files = await fs.readdir(`./sounds/${directoryName}`);
        sounds[directoryName] = files.map(file => ({
          file,
          name: file.split('.')[0],
        }))
      }
    }));
    console.log('Done!');
    await fs.writeFile('sounds.json', JSON.stringify(sounds, null, 2), 'utf8');
  });