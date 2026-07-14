import { translateDocumentJSON } from './src/utils/translate';


const testObj = {
  title: "Platform Edukasi & Tata Kelola",
  description: "Tingkatkan kompetensi SDM dan perkuat tata kelola instansi Anda."
};

async function run() {
  console.log("Translating...", testObj);
  const result = await translateDocumentJSON(testObj, 'English');
  console.log("Result:", result);
}

run();
