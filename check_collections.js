const https = require('https');
const http = require('http');

async function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

(async () => {
  // Login
  const loginRes = await request('http://localhost:8055/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'd1r3ctu5' })
  });
  const { data: { access_token } } = JSON.parse(loginRes.body);

  // Get collections
  const colRes = await request('http://localhost:8055/collections', {
    headers: { 'Authorization': `Bearer ${access_token}` }
  });
  const { data: collections } = JSON.parse(colRes.body);

  const userCollections = collections.filter(c => !c.collection.startsWith('directus_'));

  console.log('\n=== COLLECTION VISIBILITY & GROUP STATUS ===\n');
  userCollections.forEach(c => {
    const hidden = c.meta?.hidden;
    const group = c.meta?.group;
    const singleton = c.meta?.singleton;
    console.log(`${c.collection.padEnd(35)} hidden=${String(hidden).padEnd(6)} group=${group || 'null'}`);
  });

  console.log('\n=== VISIBLE (not hidden) TOP-LEVEL (no group) ===\n');
  userCollections
    .filter(c => !c.meta?.hidden && !c.meta?.group)
    .forEach(c => console.log(' - ' + c.collection));

  console.log('\n=== VISIBLE IN GROUPS ===\n');
  const grouped = {};
  userCollections
    .filter(c => !c.meta?.hidden && c.meta?.group)
    .forEach(c => {
      if (!grouped[c.meta.group]) grouped[c.meta.group] = [];
      grouped[c.meta.group].push(c.collection);
    });
  Object.entries(grouped).forEach(([g, cols]) => {
    console.log(`  [${g}]: ${cols.join(', ')}`);
  });

  console.log('\n=== HIDDEN COLLECTIONS ===\n');
  userCollections
    .filter(c => c.meta?.hidden)
    .forEach(c => console.log(` - ${c.collection} (group=${c.meta?.group || 'null'})`));
})();
