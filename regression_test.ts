import { getPayload } from 'payload';
import configPromise from './src/payload.config';

async function run() {
  console.log("Initializing Payload...");
  const payload = await getPayload({ config: configPromise });

  try {
    console.log("1. Testing Create Article...");
    const article = await payload.create({
      collection: 'articles',
      data: {
        title: 'Regression Test Article',
        status: 'draft',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'This is a test article.', version: 1 }],
                version: 1
              }
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1
          }
        },
      }
    });
    console.log("   ✅ Created article:", article.title, "ID:", article.id);

    console.log("2. Testing Update Data (Article)...");
    const updated = await payload.update({
      collection: 'articles',
      id: article.id,
      data: {
        title: 'Regression Test Article - Updated'
      }
    });
    console.log("   ✅ Updated article title:", updated.title);

    console.log("3. Testing Create Team Member...");
    const teamMember = await payload.create({
      collection: 'team-members',
      draft: false,
      data: {
        name: 'John Doe Regression',
        initials: 'JDR',
        category: 'management',
        role: 'Test Role',
        expertise: 'Regression testing',
        color: 'linear-gradient(135deg, #1E6FD9, #0B2D6B)',
        order: 99
      }
    });
    console.log("   ✅ Created team member:", teamMember.name, "ID:", teamMember.id);
    
    // Clean up
    console.log("Cleaning up test data...");
    await payload.delete({ collection: 'articles', id: article.id });
    await payload.delete({ collection: 'team-members', id: teamMember.id });
    console.log("   ✅ Cleaned up.");

    console.log("All tests passed successfully.");
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
  process.exit(0);
}

run();
