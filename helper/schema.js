import fs from 'fs';
import path from 'path';

async function loadTypeSchema(type) {
  const pathToSchema = path.join(
    process.cwd(),
    `types/${type}/${type}.gql`,
  );
  try {
    const schema = await fs.readFileSync(pathToSchema, { encoding: 'utf-8' });
    return schema;
  } catch (err) { 
    console.log(err);
   }
}

export default loadTypeSchema;