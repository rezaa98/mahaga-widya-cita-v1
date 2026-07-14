import payload from 'payload';
import config from './src/payload.config.ts';

async function run() {
  await payload.init({
    config,
    local: true,
  });

  const doc = await payload.updateGlobal({
    slug: 'beranda',
    locale: 'id',
    data: {
      hero: {
        title: "Test Update Title",
      }
    }
  });
  console.log("Updated ID locale:", doc.hero.title);
}
run();
