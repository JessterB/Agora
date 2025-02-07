// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as awsParamStore from 'aws-param-store';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import {
  allBiodomainsRoute,
  biodomainsRoute,
  comparisonGenesRoute,
  distributionRoute,
  geneRoute,
  genesRoute,
  nominatedGenesRoute,
  searchGeneRoute,
  teamMemberImageRoute,
  teamsRoute,
} from './components';

// -------------------------------------------------------------------------- //
// Mongo Connection
// -------------------------------------------------------------------------- //
const database = { url: '' };

// Uncomment when in need of verbose debugging
/* mongoose.set('debug', function(coll, method, query, doc) {
    console.log(
        '\n\n',
        ' => Query executed: ',
        '\ncollection => ' + coll,
        '\nmethod => ' + method,
        '\ndata => ' + util.inspect(query),
        '\n',
        doc && ('doc => ' + util.inspect(doc)), '\n');
}); */

// Set the database url
if (
  process.env.MONGODB_HOST &&
  process.env.MONGODB_PORT &&
  process.env.APP_ENV
) {
  let dbUser: string | undefined;
  let dbPass: string | undefined;
  if (process.env.APP_ENV === 'e2e') {
    dbUser = process.env.DB_USER;
    dbPass = process.env.DB_PASS;
  } else {
    const results = awsParamStore.getParametersSync(
      [
        '/agora-' + process.env.APP_ENV + '/MongodbUsername',
        '/agora-' + process.env.APP_ENV + '/MongodbPassword',
      ],
      { region: 'us-east-1' }
    );
    if (results && results.Parameters) {
      dbUser = results.Parameters[1]['Value'];
      dbPass = results.Parameters[0]['Value'];
    }
  }
  
  if (dbUser && dbPass) {
    database.url =
      'mongodb://' +
      dbUser +
      ':' +
      dbPass +
      '@' +
      process.env.MONGODB_HOST +
      ':' +
      process.env.MONGODB_PORT +
      '/agora' +
      '?authSource=admin';
  }
} else {
  database.url = 'mongodb://localhost:27017/agora';
}

mongoose.connect(database.url);

// Get the default connection
const connection = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);

// -------------------------------------------------------------------------- //
// Routes
// -------------------------------------------------------------------------- //
const router = express.Router();

connection.once('open', async () => {
  router.get('/biodomains', allBiodomainsRoute);
  router.get('/biodomains/:id', biodomainsRoute);
  router.get('/genes/search', searchGeneRoute);
  router.get('/genes/comparison', comparisonGenesRoute);
  router.get('/genes/nominated', nominatedGenesRoute);
  router.get('/genes/:id', geneRoute);
  router.get('/genes', genesRoute);
  router.get('/distribution', distributionRoute);
  router.get('/teams', teamsRoute);
  router.get('/team-member/:name/image', teamMemberImageRoute);
});

export default router;
