import payload from 'payload';
import configPromise from './src/payload.config.ts';

async function run() {
  const config = await configPromise;
  await payload.init({ config, local: true });
  const doc = await payload.findGlobal({ slug: 'footer', locale: 'en' });
  console.log(JSON.stringify(doc, null, 2));
  process.exit(0);
}
run();
